
pragma solidity ^0.7.6;
pragma abicoder v2;

import "./../tokens/@openzeppelin/contracts-upgradeable/proxy/ClonesUpgradeable.sol";
import "./../tokens/@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "./../tokens/@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./../tokens/@openzeppelin/contracts-upgradeable/introspection/ERC165Upgradeable.sol";
import "./../tokens/@rarible/libraries/contracts/LibSignature.sol";
import "./../tokens/erc-1271/ERC1271.sol";
import "./IMinterUpgradeable.sol";
import "./LibMinter.sol";
import "./RolesValidator.sol";
import "../tokens/@rarible/royalties/contracts/LibPart.sol";
import "./../tokens/IRoyaltyForwarder.sol";

import "./../meta-tx/ForwarderReceiverBase.sol";

contract MinterUpgradeable is ERC1271, OwnableUpgradeable, ERC165Upgradeable, IMinterUpgradeable, RolesValidator, ForwarderReceiverBase {

    using LibSignature for bytes32;
    using AddressUpgradeable for address;

    event UpsertDefaultMinter(address indexed minter, uint96 fee, bool active);
    event MinDefaultMinterRoyalty(uint96 fee);
    event UpsertDefaultPayouts(address indexed token, address indexed creator, LibPart.Part[] creators, bool byOwner);
    event UpsertDefaultRoyalties(address indexed token, address indexed creator, bytes32 royaltyBytes, bool byOwner);
    event NewRoyaltyForwarder(LibPart.Part[] payees, bytes32 forwarderBytes, address indexed forwarderAddress);
    event RecievedRoyaltyPayment(address indexed from, uint256 amount);
    event WithdrawStakedRoyalty(address indexed forwarder, address indexed by, uint256 amount, LibPart.Part[] splits);
    event UpsertMinter(address indexed token, address indexed creator, address indexed minter, bool active, uint96 fee, uint256 cancelValue);

    struct Minter {
        bool active;
        uint96 fee;
        uint256 cancelValue;
        uint256 start;
        uint256 end;
        LibPart.Part[] creators;    // No need to create forwarder for creator payouts
        bytes32 royalties;          // Creating a forwarder to allow for EIP 2981
    }

    struct DefaultMinter {
        bool active;
        uint96 fee;
        uint256 cancelValue;
        uint256 start;
        uint256 end;
    }

    // Store the royalty stakes from the wallets
    mapping(address => uint256) public stake;

    // Default minter
    // address private minter;
    // uint96 private fee;
    mapping(address => uint256) private defaults;
    // Creator approved minters
    mapping(address => mapping(address => mapping(address => uint256))) private minters;

    // Minters registry
    DefaultMinter[] public defaultsRegistry;
    Minter[] public mintersRegistry;

    // To map created payment forwarders with their definition, used for custom minters
    address public forwarderImplementationContract;
    mapping (bytes32 => LibPart.Part) public forwarders;

    // Maps forwarder address to whom the staked amount should go to
    mapping (address => LibPart.Part[]) public forwarderSplits;
    // Overall percentage basis points excluding the minter contract
    mapping (address => uint96) public depositBPS;

    // Mapping from creator to payment forwarder for default royalties
    mapping (address => mapping(address => LibPart.Part[] )) public defaultPayoutMapping;
    mapping (address => mapping(address => bytes32)) public defaultRoyaltyForwardersMapping;

    // Minimum royalty for using the default signer
    uint96 public minDefaultMinterRoyalty;

    function __MinterUpgradable_init (address _minter, uint96 _fee, uint96 _minDefaultMinterRoyalty, address _forwarderImplementationContract, address _forwarder ) public initializer {
        __Ownable_init();
        __ERC165_init_unchained();
        _registerInterface(ERC1271_INTERFACE_ID);

        // Ensure index 0 is empty by default for cases where data is not set
        defaultsRegistry.push();
        mintersRegistry.push();

        upsertDefaultMinter(_minter, _fee, true);
        setMinDefaultMinterRoyalty(_minDefaultMinterRoyalty);
        setForwarderImplementationContract(_forwarderImplementationContract);
        __ForwarderReceiverBase_init(_forwarder);
    }

    function _msgSender() internal view virtual override(ForwarderReceiverBase, ContextUpgradeable) returns (address payable) {
        return ForwarderReceiverBase._msgSender();
    }

    function setForwarderImplementationContract(address _forwarderImplementationContract) public onlyOwner {
        forwarderImplementationContract = _forwarderImplementationContract;
    }
    
    function setMinDefaultMinterRoyalty(uint96 _minDefaultMinterRoyalty) public onlyOwner {
        minDefaultMinterRoyalty = _minDefaultMinterRoyalty;
        emit MinDefaultMinterRoyalty(_minDefaultMinterRoyalty);
    }

    function upsertDefaultMinter(address _minter, uint96 _fee, bool active ) public onlyOwner {
        defaults[_minter] = defaultsRegistry.length;
        defaultsRegistry.push(DefaultMinter(active, _fee, 0, 0, 0));
        emit UpsertDefaultMinter(_minter, _fee, active);
    }

    function upsertDefaultCreatorPayoutsAndRoyalties(LibMinter.DefaultMinter memory data) public onlyOwner {

        delete defaultPayoutMapping[data.token][data.creator];
        for (uint i = 0; i < data.creators.length; i++) {
            defaultPayoutMapping[data.token][data.creator].push(data.creators[i]);
        }
        bytes32 royaltiesBytes = getOrCreateForwarderUsingSplit(data.royalties);
        defaultRoyaltyForwardersMapping[data.token][data.creator] = royaltiesBytes;

        emit UpsertDefaultPayouts(data.token, data.creator, data.creators, true);
        emit UpsertDefaultRoyalties(data.token, data.creator, royaltiesBytes, true);

    }

    function upsertDefaultCreatorPayoutsAndRoyaltiesByCreator(LibMinter.DefaultMinter memory data) public {

        require(data.creator == _msgSender(), "Can't set for someone else");
        delete defaultPayoutMapping[data.token][data.creator];
        for (uint i = 0; i < data.creators.length; i++) {
            defaultPayoutMapping[data.token][data.creator].push(data.creators[i]);
        }

        // Ensure Minters contract gets a minimum specified royalty
        bool setDefault;
        for (uint i = 0; i < data.royalties.length; i++) {
            if (data.royalties[i].account == address(this)){
                if (data.royalties[i].value < minDefaultMinterRoyalty) {
                    data.royalties[i].value = minDefaultMinterRoyalty;
                }
                setDefault = true;
                break;
            }
        }

        bytes32 royaltiesBytes;
        if (!setDefault){
            // Extend array in memory
            LibPart.Part[] memory royalties = new LibPart.Part[](data.royalties.length + 1);
            for (uint i = 0; i < data.royalties.length; i++) {
                royalties[i].account = data.royalties[i].account;
                royalties[i].value = data.royalties[i].value;
            }
            royalties[data.royalties.length].account = payable(address(this));
            royalties[data.royalties.length].value = minDefaultMinterRoyalty;

            royaltiesBytes = getOrCreateForwarderUsingSplit(royalties);
            defaultRoyaltyForwardersMapping[data.token][data.creator] = royaltiesBytes;
        } else {
            royaltiesBytes = getOrCreateForwarderUsingSplit(data.royalties);
            defaultRoyaltyForwardersMapping[data.token][data.creator] = royaltiesBytes;
        }

        emit UpsertDefaultPayouts(data.token, data.creator, data.creators, false);
        emit UpsertDefaultRoyalties(data.token, data.creator, royaltiesBytes, false);
    }

    function getDefaultMinter(address _minter) external view returns (uint256 index, DefaultMinter memory) {
        return (defaults[_minter], defaultsRegistry[defaults[_minter]]);
    }

    function getDefaultMinterFee(address _minter) public view returns (uint96) {
        return defaultsRegistry[defaults[_minter]].fee;
    }

    function getOrCreateForwarderUsingSplit(LibPart.Part[] memory payees) internal virtual returns (bytes32){

        address payable forwarderAddress;
        uint96 totalValue;
        bytes32 forwarderBytes = LibPart.hashParts(payees);
        if (payees.length == 1) {
            require(payees[0].account != address(0x0), "Recipient should be present");
            require(payees[0].value != 0, "Royalty value should be positive");
            require(payees[0].value < 10000, "Royalty total value should be < 10000");

            forwarders[forwarderBytes] = LibPart.Part(payees[0].account, payees[0].value);

        } else if ( payees.length > 0) {
            forwarderAddress = forwarders[forwarderBytes].account;
            totalValue = forwarders[forwarderBytes].value;
            
            // Check if forwarder is not already created
            if (forwarderAddress == address(0x0)){

                
                for (uint i = 0; i < payees.length; i++) {
                    require(payees[i].account != address(0x0), "Recipient should be present");
                    require(payees[i].value != 0, "Royalty value should be positive");
                    totalValue += payees[i].value;
                }
                require(totalValue < 10000, "Royalty total value should be < 10000");

                uint96 _depositBPS;
                for (uint i = 0; i < payees.length; i++) {
                    payees[i].value = payees[i].value * 10000 / totalValue;
                    if (payees[i].account != address(this)){
                        _depositBPS += payees[i].value;
                    } else {
                        payees[i].value = 0;
                    }
                }

                forwarderAddress = payable(ClonesUpgradeable.clone(forwarderImplementationContract));
                IRoyaltyForwarder(forwarderAddress).__RoyaltyForwarder_init(address(this));

                forwarders[forwarderBytes] = LibPart.Part(forwarderAddress, totalValue);
                depositBPS[forwarderAddress] = _depositBPS;

                for (uint i = 0; i < payees.length; i++){
                    forwarderSplits[forwarderAddress].push(payees[i]);
                }

                emit NewRoyaltyForwarder(payees, forwarderBytes, forwarderAddress);

            }

            // return LibPart.Part(payable(forwarder), totalValue);
        }
        return forwarderBytes;
        
    }

    function recieveRoyaltyStake() external payable override {
        require(depositBPS[_msgSender()] > 0, "Isn't a forwarder address");
        // Stake the royalty users into their staked wallet address to be withdrawn when they want
        // The minterDefault's stake is just added to the contract balance
        stake[_msgSender()] += msg.value * depositBPS[_msgSender()] / 10000 ;
        stake[owner()] += msg.value * (10000 - depositBPS[_msgSender()]) / 10000 ;
        emit RecievedRoyaltyPayment(_msgSender(), msg.value);
    }

    function withdrawOwnerStake() external onlyOwner {
        (bool success, ) = owner().call{value: stake[owner()]}("");
        require(success, "Transfer failed.");
    }

    function withdrawRoyaltyStake(bytes32 forwarderBytes) external {
        address forwarderAddress = forwarders[forwarderBytes].account;
        // Send the staked amounts to participants wallets
        for (uint i = 0; i < forwarderSplits[forwarderAddress].length; i++) {
            if (forwarderSplits[forwarderAddress][i].account != address(this)) {
                (bool success, ) = forwarderSplits[forwarderAddress][i].account.call{
                value:(stake[forwarderAddress] * forwarderSplits[forwarderAddress][i].value ) / depositBPS[forwarderAddress]
                }("");
                // require(success, "Transfer failed."); // If someone messed up, others shouldn't suffer
            }
        }
        emit WithdrawStakedRoyalty(forwarderAddress, _msgSender(), stake[forwarderAddress], forwarderSplits[forwarderAddress]);
        delete stake[forwarderAddress];
    }


    function withdrawERC20Royalty(bytes32 forwarderBytes, address erc20TokenAddress) external {
        address forwarderAddress = forwarders[forwarderBytes].account;
        IRoyaltyForwarder(forwarderAddress).flushERC20Tokens(erc20TokenAddress);        
    }


    function withdrawERC721Royalty(bytes32 forwarderBytes, address erc721TokenAddress, uint256 erc721TokenId) external {
        address forwarderAddress = forwarders[forwarderBytes].account;
        IRoyaltyForwarder(forwarderAddress).flushERC721Token(erc721TokenAddress, erc721TokenId);
    }


    function withdrawERC1155Royalty(bytes32 forwarderBytes, address erc1155TokenAddress, uint256 erc1155TokenId) external {
        address forwarderAddress = forwarders[forwarderBytes].account;
        IRoyaltyForwarder(forwarderAddress).flushERC1155Tokens(erc1155TokenAddress, erc1155TokenId);
    }

    function callForwarder(bytes32 forwarderBytes, address target, uint256 value, bytes calldata data) external returns (bytes memory) {
        address forwarderAddress = forwarders[forwarderBytes].account;
        require(_msgSender() == forwarderSplits[forwarderAddress][0].account, "Forwarder caller should be first royalty recipient!");
        (bool success, bytes memory returnedData) = IRoyaltyForwarder(forwarderAddress).callFromMinter(target, value, data);
        require(success, 'Forwarder call execution failed');
        return returnedData;
    }


    function upsertMinter(address _token, LibMinter.Minter memory data) public virtual {

        bytes32 hash = LibMinter.hash(data);

        // Check if creator and minter gave signature
        address signer = validate(data.minter, hash, data.signatures[0]);
        validate(data.creator, hash, data.signatures[1]);

        // Creator is free to choose royalty forwarder
        bytes32 royalties = getOrCreateForwarderUsingSplit(data.royalties);
        minters[_token][data.creator][data.minter] = mintersRegistry.length;

        
        mintersRegistry.push();

        mintersRegistry[mintersRegistry.length - 1].active = true;
        mintersRegistry[mintersRegistry.length - 1].fee = data.fee;
        mintersRegistry[mintersRegistry.length - 1].cancelValue = data.cancelValue;
        mintersRegistry[mintersRegistry.length - 1].start = data.start;
        mintersRegistry[mintersRegistry.length - 1].end = data.end;
        mintersRegistry[mintersRegistry.length - 1].royalties = royalties;

        for (uint i = 0; i < data.creators.length; i++) {
            mintersRegistry[mintersRegistry.length - 1].creators.push(data.creators[i]);
        }

        emit UpsertMinter(_token, data.creator, data.minter, true, data.fee, data.cancelValue);

    }

    function cancelMinter(address _token, address _minter) public payable virtual {
        require(
            msg.value == mintersRegistry[minters[_token][_msgSender()][_minter]].cancelValue,
            "Cancel charge"
        );
        delete mintersRegistry[minters[_token][_msgSender()][_minter]].active;
        emit UpsertMinter(_token, _msgSender(), _minter, false, 0, 0);
    }

    function getMinter(address _token, address _creator, address _minter)
        public
        view
        virtual
        returns (Minter memory)
    {
        return mintersRegistry[minters[_token][_creator][_minter]];
    }


    function getDetailsForMinting(address _token, address _creator, address _signer) external view virtual override returns (
        uint96,                 // Minting fee
        LibPart.Part[] memory,  // Creators payouts
        bytes32,                // Royalty forwarder contract bytes to save
        LibPart.Part memory     // Royalty forwarder contract address and percentage basis points
    ){
       
        if (_signer == _creator){
            // Allowing self signed
            if (defaultPayoutMapping[_token][_creator].length == 0){
                LibPart.Part[] memory creators = new LibPart.Part[](1);
                creators[0].account = payable(_creator);
                creators[0].value  = 10000;

                return (0, 
                        creators, 
                        defaultRoyaltyForwardersMapping[_token][_creator], 
                        forwarders[defaultRoyaltyForwardersMapping[_token][_creator]]);
            }

            return (0, 
                    defaultPayoutMapping[_token][_creator], 
                    defaultRoyaltyForwardersMapping[_token][_creator], 
                    forwarders[defaultRoyaltyForwardersMapping[_token][_creator]]);

        } else if (mintersRegistry[minters[_token][_creator][_signer]].active) {
            
            // Signed by creator defined minter
            return (mintersRegistry[minters[_token][_creator][_signer]].fee, 
                    mintersRegistry[minters[_token][_creator][_signer]].creators, 
                    mintersRegistry[minters[_token][_creator][_signer]].royalties, 
                    forwarders[mintersRegistry[minters[_token][_creator][_signer]].royalties]);

        } else if (defaultsRegistry[defaults[_signer]].active) {

            // Signed by any of the default minters
            if (defaultPayoutMapping[_token][_creator].length == 0){
                LibPart.Part[] memory creators = new LibPart.Part[](1);
                creators[0].account = payable(_creator);
                creators[0].value  = 10000;

                return (defaultsRegistry[defaults[_signer]].fee, 
                        creators, 
                        defaultRoyaltyForwardersMapping[_token][_creator], 
                        forwarders[defaultRoyaltyForwardersMapping[_token][_creator]]);
            } 

            return (defaultsRegistry[defaults[_signer]].fee, 
                    defaultPayoutMapping[_token][_creator], 
                    defaultRoyaltyForwardersMapping[_token][_creator], 
                    forwarders[defaultRoyaltyForwardersMapping[_token][_creator]]);
        }
        revert("Illegal minter");
    }


    function getDetailsForRoyalty(address _token, address _creator, address _signer) external view virtual override returns (
        bytes32 // Forwarder description bytes identifier for the wallet
    ){
        if (_signer == _creator){
            return defaultRoyaltyForwardersMapping[_token][_creator];
        } else if (mintersRegistry[minters[_token][_creator][_signer]].active) {
            return mintersRegistry[minters[_token][_creator][_signer]].royalties;
        } else if (defaultsRegistry[defaults[_signer]].active) {
            return defaultRoyaltyForwardersMapping[_token][_creator];
        }
        revert("Illegal minter");
    }

    function getForwarder(bytes32 forwarderBytes) external view override returns(LibPart.Part memory) {
        return forwarders[forwarderBytes];
    }

    
    /**
    * @dev Function must be implemented by deriving contract
    * @param _hash Arbitrary length data signed on the behalf of address(this)
    * @param _signature Signature byte array associated with _data
    * @return A bytes4 magic value 0x1626ba7e if the signature check passes, 0x00000000 if not
    *
    * MUST NOT modify state (using STATICCALL for solc < 0.5, view modifier for solc > 0.5)
    * MUST allow external calls
    */
    function isValidSignature(bytes32 _hash, bytes memory _signature) public virtual override view returns (bytes4){

        address signerFromSig;
        if (_signature.length == 65) {
            signerFromSig = _hash.recover(_signature);
            if (defaultsRegistry[defaults[signerFromSig]].active) {
                return returnIsValidSignatureMagicNumber(true);
            }
        }
        return returnIsValidSignatureMagicNumber(false);

    }


    uint256[50] private __gap;

}
