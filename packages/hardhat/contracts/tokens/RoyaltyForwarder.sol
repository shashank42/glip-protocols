pragma solidity 0.7.6;
pragma abicoder v2;

import "./../tokens/erc-1271/ERC1271.sol";
import "./IMinterUpgradeableForForwarder.sol";
import "./@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";
import "./@openzeppelin/contracts-upgradeable/token/ERC721/IERC721ReceiverUpgradeable.sol";
import "./@openzeppelin/contracts-upgradeable/token/ERC1155/IERC1155ReceiverUpgradeable.sol";
import "./@openzeppelin/contracts-upgradeable/token/ERC777/IERC777RecipientUpgradeable.sol";
import "./@openzeppelin/contracts-upgradeable/token/ERC777/IERC777SenderUpgradeable.sol";
import "./@rarible/royalties/contracts/LibPart.sol";
import "./../asset/contracts/LibAsset.sol";
import "./@openzeppelin/contracts-upgradeable/token/ERC1155/IERC1155Upgradeable.sol";
import "./@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "./@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "./../exchange/v3/lib/LibTransfer.sol";
import "./../exchange/v3/lib/BpLibrary.sol";
import "./@rarible/libraries/contracts/LibSignature.sol";
import "./IRoyaltyForwarder.sol";
import "./@openzeppelin/contracts-upgradeable/introspection/IERC1820RegistryUpgradeable.sol";


contract RoyaltyForwarder is ERC1271, Initializable, IERC721ReceiverUpgradeable, IERC1155ReceiverUpgradeable, IERC777RecipientUpgradeable, IERC777SenderUpgradeable, IRoyaltyForwarder {

    // Set the token contract address in registry
    IERC1820RegistryUpgradeable private _erc1820 = IERC1820RegistryUpgradeable(0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24);
    bytes32 constant private TOKENS_RECIPIENT_INTERFACE_HASH = keccak256("ERC777TokensRecipient");
    bytes32 constant public TOKENS_SENDER_INTERFACE_HASH = keccak256("ERC777TokensSender");

    using BpLibrary for uint256;
    using SafeMathUpgradeable for uint;

    using LibSignature for bytes32;

    IMinterUpgradeableForForwarder minter;
    bool public autoFlush20 = true;
    bool public autoFlush721 = true;
    bool public autoFlush1155 = true;

    constructor() public {
    }

    /**
    * Modifier that will execute internal code block only if the sender is the parent address
    */
    modifier onlyMinter {
        require(msg.sender == address(minter), "Only Minter");
        _;
    }

 
    function __RoyaltyForwarder_init(address minterAddress) external virtual initializer override onlyMinter {
        _erc1820.setInterfaceImplementer(address(this), TOKENS_RECIPIENT_INTERFACE_HASH, address(this));
        _erc1820.setInterfaceImplementer(address(this), TOKENS_SENDER_INTERFACE_HASH, address(this));
        minter = IMinterUpgradeableForForwarder(minterAddress);
    }

    function setAutoFlush20(bool autoFlush)
        external
        virtual
        override
        onlyMinter
    {
        autoFlush20 = autoFlush;
    }



    function setAutoFlush721(bool autoFlush)
        external
        virtual
        override
        onlyMinter
    {
        autoFlush721 = autoFlush;
    }


    function setAutoFlush1155(bool autoFlush)
        external
        virtual
        override
        onlyMinter
    {
        autoFlush1155 = autoFlush;
    }


    receive() external payable {
        flush();
    }

    fallback() external payable {
        flush();
    }

 
    function flush() public override {
        minter.recieveRoyaltyStake{value: address(this).balance}();
    }


    function withdrawalSplits() private returns (LibPart.Part[] memory) {
        return minter.forwarderSplits(address(this));
    }


    function flushERC20Tokens(address token)
        external
        virtual
        override
        onlyMinter
    {
        flushTokens(token, 0, 0, LibAsset.ERC20_ASSET_CLASS);
    }


    function flushERC721Token(address token, uint256 tokenId)
        external
        virtual
        override
        onlyMinter
    {
        flushTokens(token, tokenId, 1, LibAsset.ERC721_ASSET_CLASS);
    }


    function flushERC1155Tokens(address token, uint256 tokenId)
        external
        virtual
        override
        onlyMinter
    {
        flushTokens(token, tokenId, 0, LibAsset.ERC1155_ASSET_CLASS);
    }


    function flushTokens(
        address token,
        uint tokenId,
        uint amount,
        bytes4 assetClass
    ) private {

        LibPart.Part[] memory payouts = withdrawalSplits();
        if (amount == 0) amount = amountFinder(token, tokenId, address(this), assetClass);

        uint sumBps = 0;
        uint restValue = amount;
        for (uint256 i = 0; i < payouts.length - 1; i++) {
            uint currentAmount = amount.bp(payouts[i].value);
            sumBps = sumBps.add(payouts[i].value);
            if (currentAmount > 0) {
                restValue = restValue.sub(currentAmount);
                transfer(token, tokenId, address(this), payouts[i].account, currentAmount, assetClass);
            }
        }
        LibPart.Part memory lastPayout = payouts[payouts.length - 1];
        sumBps = sumBps.add(lastPayout.value);
        require(sumBps == 10000, "Sum payouts Bps not equal 100%");
        if (restValue > 0) {
            transfer(token, tokenId, address(this), lastPayout.account, restValue, assetClass);
        }
    }


    function amountFinder(
        address token,
        uint tokenId,
        address from,
        bytes4 assetClass
        ) private view returns (uint256) {
        if (assetClass == LibAsset.ETH_ASSET_CLASS) {
            return address(this).balance;
        } else if (assetClass == LibAsset.ERC20_ASSET_CLASS) {
            IERC20Upgradeable instance = IERC20Upgradeable(token);
            return instance.balanceOf(from);
        } else if (assetClass == LibAsset.ERC721_ASSET_CLASS) {
            return 1; // Will get reverted later if owner is wrong
        } else if (assetClass == LibAsset.ERC1155_ASSET_CLASS) {
            IERC1155Upgradeable instance = IERC1155Upgradeable(token);
            return instance.balanceOf(from, tokenId);
        }
    }


    function transfer(
        address token,
        uint tokenId,
        address from, 
        address to,
        uint amount,
        bytes4 assetClass
    ) private {
        if (assetClass == LibAsset.ETH_ASSET_CLASS) {
            // to.transferEth(amount); // @todo decide if this or staking
            return; // Native currency is deposited at the minter contract by default
        } else if (assetClass == LibAsset.ERC20_ASSET_CLASS) {
            IERC20Upgradeable instance = IERC20Upgradeable(token);
            safeTransfer(token, to, amount);
        } else if (assetClass == LibAsset.ERC721_ASSET_CLASS) {
            IERC721Upgradeable instance = IERC721Upgradeable(token);
            require(instance.supportsInterface(type(IERC721Upgradeable).interfaceId), "The caller does not support the ERC721 interface");
            // this won"t work for ERC721 re-entrancy
            instance.safeTransferFrom(from, to, tokenId, "");
        } else if (assetClass == LibAsset.ERC1155_ASSET_CLASS) {
            IERC1155Upgradeable instance = IERC1155Upgradeable(token);
            require(instance.supportsInterface(type(IERC1155Upgradeable).interfaceId), "The caller does not support the IERC1155 interface");
            instance.safeTransferFrom(from, to, tokenId, amount, "");
        }
    }

    function safeTransfer(
        address token,
        address to,
        uint256 value
    ) private {
        // bytes4(keccak256(bytes("transfer(address,uint256)")));
        (bool success, bytes memory data) = token.call(
        abi.encodeWithSelector(0xa9059cbb, to, value)
        );
        require(
        success && (data.length == 0 || abi.decode(data, (bool))),
        "TransferHelper::safeTransfer: transfer failed"
        );
    }




    function tokensToSend(
        address operator,
        address from,
        address to,
        uint256 amount,
        bytes calldata userData,
        bytes calldata operatorData
    ) external override {}



    function tokensReceived(
        address operator,
        address from,
        address to,
        uint256 amount,
        bytes calldata userData,
        bytes calldata operatorData
    ) external override {
        if (autoFlush20) flushTokens(msg.sender, 0, amount, LibAsset.ERC20_ASSET_CLASS);
    }


    /**
    * ERC721 standard callback function for when a ERC721 is transfered. The forwarder will send the nft
    * to the base wallet once the nft contract invokes this method after transfering the nft.
    *
    * @param _operator The address which called `safeTransferFrom` function
    * @param _from The address of the sender
    * @param _tokenId The token id of the nft
    * @param data Additional data with no specified format, sent in call to `_to`
    */
    function onERC721Received(
        address _operator,
        address _from,
        uint256 _tokenId,
        bytes memory data
    ) external virtual override returns (bytes4) {
        if (autoFlush721) flushTokens(msg.sender, _tokenId, 1, LibAsset.ERC721_ASSET_CLASS);
        return this.onERC721Received.selector;
    }


    function onERC1155Received(
        address _operator,
        address _from,
        uint256 id,
        uint256 value,
        bytes calldata data
    ) external virtual override returns (bytes4) {
        if (autoFlush721) flushTokens(msg.sender, id, value, LibAsset.ERC1155_ASSET_CLASS);
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address _operator,
        address _from,
        uint256[] calldata ids,
        uint256[] calldata values,
        bytes calldata data
    ) external virtual override returns (bytes4) {
        if (autoFlush721) for (uint256 i = 0; i < ids.length; i++) flushTokens(msg.sender, ids[i], values[i], LibAsset.ERC1155_ASSET_CLASS);
        return this.onERC1155BatchReceived.selector;
    }


    function callFromMinter(
    address target,
    uint256 value,
    bytes calldata data
    ) external virtual override onlyMinter returns (bool success, bytes memory) {
        return target.call{ value: value }(data);
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
            return returnIsValidSignatureMagicNumber(true);
        }
        return returnIsValidSignatureMagicNumber(false);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        virtual
        override(IERC165Upgradeable)
        view
        returns (bool)
    {
        return interfaceId == type(IRoyaltyForwarder).interfaceId;
    }

}
