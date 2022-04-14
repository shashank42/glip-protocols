// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;
pragma abicoder v2;


import "./../@rarible/royalties/contracts/impl/RoyaltiesImpl.sol";
import "./../@rarible/royalties-upgradeable/contracts/RoyaltiesUpgradeable.sol";
import "./../@rarible/lazy-mint/contracts/erc-1155/IERC1155LazyMint.sol";
import "./Mint1155Validator.sol";
import "./ERC1155BaseURI.sol";

import "./../../roles/IMinterUpgradeable.sol";
import "./../../exchange/IGlipERC721LazyData.sol";

import "./../@rarible/royalties/contracts/IERC2981.sol";

import "./ERC1155Base.sol";

abstract contract ERC1155Lazy is
    ERC1155BaseURI,
    IERC1155LazyMint,
    Mint1155Validator,
    RoyaltiesUpgradeable,
    RoyaltiesImpl,
    IERC2981
{

    using SafeMathUpgradeable for uint256;
    
    uint256 constant CREATOR_MASK = uint256(type(uint160).max) << 96;
    uint256 constant NON_FUNGIBLE_MASK = uint256(type(uint56).max) << 40;
    uint256 constant FUNGIBLE_MASK = uint256(type(uint40).max);


    bytes4 private constant _INTERFACE_ID_ERC165 = 0x01ffc9a7;
    bytes4 private constant _INTERFACE_ID_ERC1155 = 0xd9b67a26;
    bytes4 private constant _INTERFACE_ID_ERC1155_METADATA_URI = 0x0e89341c;
    bytes4 private constant _INTERFACE_ID_ERC2981 = 0x2a55205a;

    mapping(uint256 => uint256) public supply;
    mapping(uint256 => uint256) public minted;
    mapping(uint256 => uint256) private reserves;
    mapping(uint256 => uint256) public tokenIdCounter;
    mapping(uint256 => bool) public convertable;

    address public minter;

    function __ERC1155Lazy_init_unchained( address _minter)
        internal
        initializer
    {
        minter = _minter;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(IERC165Upgradeable, ERC165Upgradeable, ERC1155Base)
        returns (bool)
    {
        return
            interfaceId == LibERC1155LazyMint._INTERFACE_ID_MINT_AND_TRANSFER ||
            interfaceId == LibRoyalties._INTERFACE_ID_ROYALTIES ||
            interfaceId == _INTERFACE_ID_ERC165 ||
            interfaceId == _INTERFACE_ID_ERC1155 ||
            interfaceId == _INTERFACE_ID_ERC1155_METADATA_URI ||
            interfaceId == _INTERFACE_ID_ERC2981 ||
            super.supportsInterface(interfaceId);
    }

    // ------------- ENCODERS AND DECODERS FOR INTERNAL AND EXCHANGE CONTRACT ------ //

    /*
    Encodes contract address and mint data to bytes
     */
    function encodeLazyMintData(LibERC1155LazyMint.Mint1155Data calldata data)
        external
        view
        virtual
        returns (bytes memory)
    {
        return abi.encode(address(this), data);
    }

    /*
        Converts encoded data to what is required for minting by the Auction contract
        Namely - tokenId, primary creator, auctioneer, LibPart of primary sale split BPS
     */
    function decodeLazyMintData(bytes calldata encoded)
        external
        view
        virtual
        returns (IGlipERC721LazyData.DecodedMintData memory)
    {
        (address token, LibERC1155LazyMint.Mint1155Data memory data) = abi
            .decode(encoded, (address, LibERC1155LazyMint.Mint1155Data));
        require(token == address(this), "Wrong contract");

        // Assume minter is right, we are verifying minter's signature anyway right before minting
        address signer = data.minter;

        uint256 reserve;
        if (reserves[data.tokenId] == 0) {
            reserve = data.reserve;
        } else {
            reserve = reserves[data.tokenId];
        }

        if (signer == data.creator) {
            uint256 totalPayouts;
            for (uint256 i = 0; i < data.creators.length; i++) {
                totalPayouts += data.creators[i].value;
            }
            require(totalPayouts == 10000, "Payouts should be 10000");

            return (
                IGlipERC721LazyData.DecodedMintData(
                    data.tokenId,
                    reserve.mul(data.amount),
                    data.creator,
                    data.creators,
                    LibPart.Part(payable(0x0), 0),
                    data.royalty
                )
            );
        } else {
            // LibPart.Part[] memory
            // If signed by someone else then fetch the data from minter contract
            (
                uint96 fee,
                LibPart.Part[] memory creators,
                bytes32 royaltySplitterBytes,
                LibPart.Part memory royaltiesSplitter
            ) = IMinterUpgradeable(minter).getDetailsForMinting(
                    token,
                    data.creator,
                    signer
                );
            return (
                IGlipERC721LazyData.DecodedMintData(
                    data.tokenId,
                    reserve.mul(data.amount),
                    data.creator,
                    creators,
                    LibPart.Part(payable(signer), fee),
                    royaltiesSplitter
                )
            );
        }
    }

    /**
    @dev Decompose a raw tokenId into it's three composite parts
     */
    function decomposeTokenId(
        uint256 tokenId
    ) public pure virtual returns (address creator,uint256 nonFungibleId,uint256 fungibleId) {
        creator = address(tokenId >> 96);
        nonFungibleId = uint256((tokenId & NON_FUNGIBLE_MASK) >> 40);
        fungibleId = uint256(tokenId & FUNGIBLE_MASK);
    }

    /**
    @dev Compose three composite parts to raw tokenId
     */
    function composeTokenId(
        address creator,uint256 nonFungibleId,uint256 fungibleId
    ) public pure virtual returns (uint256 tokenId) {
        return (uint256(creator) << 96) + (nonFungibleId << 40) + fungibleId;
    }

    // ----------------------- VERIFIER -------------------------------------//
    function verifyAssetAndSigner(LibERC1155LazyMint.Mint1155Data memory data)
        internal
        view
        returns (address)
    {

        require(data.amount > 0, "amount incorrect");
        uint256 newMinted = data.amount.add(minted[data.tokenId]);
        require((supply[data.tokenId] == 0 && newMinted <= data.supply ) || newMinted <= supply[data.tokenId], "more than supply");

        

        // In order for ensuring token id has space for both fungible and non-fungible
        // tokens that will get minted on burning
        // tokenId = (creatorAddress << 96) + passID (passID < 2^80)
        (address creator,uint256 nonFungibleId,uint256 fungibleId) = decomposeTokenId(data.tokenId);
        require(creator == data.creator);
        require(nonFungibleId == 0, "Token id is wrong");

        // We need to check validity/legitimacy of the Asset
        // Creator of the asset contract can implement any arbitrary signing logic
        bytes32 hash = LibERC1155LazyMint.hash(data);
        address signer = validate(data.minter, hash, data.signature);

        return signer;
    }

    // --------------- MINT AND TRANSFER (Encoded and Decoded data) -------------------- //

    /*
    Single function to execute transfer or mint using decoded data
     */

    function transferFromOrMint(
        LibERC1155LazyMint.Mint1155Data memory data,
        address from,
        address to
    ) external virtual override {
        uint256 balance = balanceOf(from, data.tokenId);
        uint256 left = data.amount;
        if (balance != 0) {
            uint256 transfer = data.amount;
            if (balance < data.amount) {
                transfer = balance;
            }
            safeTransferFrom(from, to, data.tokenId, transfer, "");
            left = data.amount - transfer;
        }
        if (left > 0) {
            mintAndTransfer(data, to, left);
        }
    }
    

    /*
    Can be called by an external contract with the encoded data to 
    execute mintAndTransfer function without knowing the lazy form 
    data structure
     */
    function mintAndTransferEncodedData(bytes memory encoded, address to) external virtual {
        (address token, LibERC1155LazyMint.Mint1155Data memory data) = abi.decode( encoded, (address, LibERC1155LazyMint.Mint1155Data));
        require(token == address(this), "Wrong contracts");
        mintAndTransfer(data, to, data.amount);
    }

    function mintAndTransfer(
        LibERC1155LazyMint.Mint1155Data memory data,
        address to,
        uint256 _amount
    ) internal virtual {

        // Verify if message sender is approved address or owner
        require(isApprovedForAll(data.creator, _msgSender()) || _msgSender() == data.creator, "Not approved");

        // Verify signer/minter
        address signer = verifyAssetAndSigner(data);

        // Verify if creator has allowed the minter
        bytes32 royaltySplitterBytes = IMinterUpgradeable(minter).getDetailsForRoyalty(address(this), data.creator, signer);

        require(_amount > 0, "amount incorrect");

        if (supply[data.tokenId] == 0) {

            require(data.supply > 0, "supply incorrect");
            _saveSupply(data.tokenId, data.supply);

            if (signer == data.creator) {
            // Accept creator defined royalty
                _saveCreatorSignedRoyalties(data.tokenId, data.creator, data.royalty);
            } else {
                // Save royalty splitter bytes
                _saveRoyalties(data.tokenId, royaltySplitterBytes);
            }
        }

        _mint(to, data.tokenId, _amount, "");

        if (data.creator != to) {
            emit TransferSingle(
                _msgSender(),
                address(0),
                data.creator,
                data.tokenId,
                _amount
            );
            emit TransferSingle(_msgSender(), data.creator, to, data.tokenId, _amount);
        } else {
            emit TransferSingle(_msgSender(), address(0), data.creator, data.tokenId, _amount);
        }
    }

    function _mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) internal virtual override {
        
        uint256 newMinted = amount.add(minted[id]);
        require(newMinted <= supply[id], "more than supply");
        minted[id] = amount.add(minted[id]); // newMinted;

        require(account != address(0), "ERC1155: mint to the zero address");

        address operator = _msgSender();

        _beforeTokenTransfer(
            operator,
            address(0),
            account,
            _asSingletonArray(id),
            _asSingletonArray(amount),
            data
        );

        _balances[id][account] = _balances[id][account].add(amount);

        _doSafeTransferAcceptanceCheck(
            operator,
            address(0),
            account,
            id,
            amount,
            data
        );
    }

    function _saveSupply(uint256 tokenId, uint256 _supply) internal {
        require(supply[tokenId] == 0);
        supply[tokenId] = _supply;
        emit Supply(tokenId, _supply);
    }
    

    // For compliance with EIP2981
    function royaltyInfo(uint256 _tokenId, uint256 _salePrice) external view override returns (address, uint256) {

        (address creator,uint256 nonFungibleId,uint256 fungibleId) = decomposeTokenId(_tokenId);
        uint256 baseTokenId = composeTokenId(creator, 0, fungibleId);

        LibPart.Part memory royalty = creatorSignedRoyalty[baseTokenId];
        if (royalty.value != 0 && royalty.account == address(0x0)) {
            royalty.account = address(baseTokenId >> 96);
        } else if (royalty.value == 0 && royalty.account == address(0x0)) {
            royalty = IMinterUpgradeable(minter).getSplitter(royaltySplitterBytesMap[baseTokenId]);
        }
        return (royalty.account, uint((_salePrice * royalty.value)/10000));
    }

    function allowConversion(uint256 id) external virtual onlyOwner {
        convertable[id] = true;
    }

    function convertPass( address account, uint256 id, uint256 amount ) external virtual {

        require(convertable[id], "Not ready to be converted");
        (address creator,uint256 nonFungibleId,uint256 fungibleId) = decomposeTokenId(id);
        require(nonFungibleId == 0, "Can only burn fungible");

        _burn(account, id, amount);

        for (uint256 i = 0; i < amount; i++) {
            tokenIdCounter[id]++;
            uint256 newTokenId = composeTokenId(creator, tokenIdCounter[id], fungibleId);
            
            if (supply[newTokenId] == 0) {
                _saveSupply(newTokenId, 1);
            }

            _mint(account, newTokenId, 1, "");
            emit TransferSingle(
                _msgSender(),
                address(0),
                account,
                newTokenId,
                1
            );
        }
        
    }

    uint256[50] private __gap;
}
