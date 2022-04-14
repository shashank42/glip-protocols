// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;
pragma abicoder v2;

import "./../@rarible/royalties/contracts/impl/RoyaltiesImpl.sol";
import "./../@rarible/royalties-upgradeable/contracts/RoyaltiesUpgradeable.sol";
import "./../@rarible/lazy-mint/contracts/erc-721/IERC721LazyMint.sol";
import "./Mint721Validator.sol";
import "./ERC721Base.sol";
import "./../../roles/IMinterUpgradeable.sol";
import "./../../exchange/IGlipERC721LazyData.sol";

import "./../@rarible/royalties/contracts/IERC2981.sol";

abstract contract ERC721Lazy is
    ERC721Base,
    IERC721LazyMint,
    RoyaltiesUpgradeable,
    Mint721Validator,
    RoyaltiesImpl,
    IERC2981
{
    using SafeMathUpgradeable for uint256;
    using EnumerableSetUpgradeable for EnumerableSetUpgradeable.UintSet;
    using EnumerableMapUpgradeable for EnumerableMapUpgradeable.UintToAddressMap;

    bytes4 private constant _INTERFACE_ID_ERC165 = 0x01ffc9a7;
    bytes4 private constant _INTERFACE_ID_ERC721 = 0x80ac58cd;
    bytes4 private constant _INTERFACE_ID_ERC721_METADATA = 0x5b5e139f;
    bytes4 private constant _INTERFACE_ID_ERC721_ENUMERABLE = 0x780e9d63;
    bytes4 private constant _INTERFACE_ID_ERC2981 = 0x2a55205a;


    bool public global;
    address public minter;

    function __ERC721Lazy_init_unchained(bool _global, address _minter) internal initializer {
        global = _global;
        minter = _minter;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(IERC165Upgradeable, ERC165Upgradeable, ERC721Base)
        returns (bool)
    {
        return
            interfaceId == LibERC721LazyMint._INTERFACE_ID_MINT_AND_TRANSFER ||
            interfaceId == LibRoyalties._INTERFACE_ID_ROYALTIES ||
            interfaceId == _INTERFACE_ID_ERC165 ||
            interfaceId == _INTERFACE_ID_ERC721 ||
            interfaceId == _INTERFACE_ID_ERC721_METADATA ||
            interfaceId == _INTERFACE_ID_ERC721_ENUMERABLE ||
            interfaceId == _INTERFACE_ID_ERC2981 || 
            super.supportsInterface(interfaceId);
    }

    // ------------- ENCODERS AND DECODERS FOR INTERNAL AND EXCHANGE CONTRACT ------ //

    /*
    Encodes contract address and mint data to bytes
     */
    function encodeLazyMintData(LibERC721LazyMint.Mint721Data calldata data)
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
        (address token, LibERC721LazyMint.Mint721Data memory data) = abi.decode(
            encoded,
            (address, LibERC721LazyMint.Mint721Data)
        );
        require(token == address(this), "Wrong contract");

        // Assume minter is right, we are verifying minter's signature anyway right before minting
        address signer = data.minter;

        if (signer == data.creator) {
            uint256 totalPayouts;
            for (uint256 i = 0; i < data.creators.length; i++) {
                totalPayouts += data.creators[i].value;
            }
            require(totalPayouts == 10000, "Payouts total");

            return (IGlipERC721LazyData.DecodedMintData(
                data.tokenId,
                data.reserve,
                data.creator,
                data.creators,
                LibPart.Part(payable(0x0), 0),
                data.royalty)
            );
        } else {
            // LibPart.Part[] memory
            // If signed by someone else then fetch the data from minter contract
            (uint96 fee, LibPart.Part[] memory creators, bytes32 royaltySplitterBytes, LibPart.Part memory royaltiesSplitter) = IMinterUpgradeable(minter).getDetailsForMinting(token, data.creator, signer);
            return (IGlipERC721LazyData.DecodedMintData(
                data.tokenId,
                data.reserve,
                data.creator,
                creators,
                LibPart.Part(payable(signer), fee),
                royaltiesSplitter)
            );
        }
    }

    // ----------------------- VERIFIER -------------------------------------//
    function verifyAssetAndSigner(LibERC721LazyMint.Mint721Data memory data) internal view returns (address)
    {
        require(!_burned(data.tokenId), "Burnt");
        require(!_exists(data.tokenId), "Exists");

        // In order for ensuring token id has creator encoded in it
        address creator = address(data.tokenId >> 96);
        require(!(global) || creator == data.creator, "tokenId wrong");

        // If creator specific contract then check if it is being minted to the owner
        require(global || (data.creator == owner()), "Mint to owner");

        // We need to check validity/legitimacy of the Asset
        // Creator of the asset contract can implement any arbitrary signing logic
        bytes32 hash = LibERC721LazyMint.hash(data);
        address signer = validate(data.minter, hash, data.signature);

        return signer;
    }

    // --------------- MINT AND TRANSFER (Encoded and Decoded data) -------------------- //

    /*
    Single function to execute transfer or mint using decoded data
     */
    function transferFromOrMint(LibERC721LazyMint.Mint721Data memory data, address from, address to) external virtual override {
        if (_exists(data.tokenId)) {
            safeTransferFrom(from, to, data.tokenId);
        } else {
            mintAndTransfer(data, to);
        }
    }

    /*
    Can be called by an external contract with the encoded data to 
    execute mintAndTransfer function without knowing the lazy form 
    data structure
     */
    function mintAndTransferEncodedData(bytes memory encoded, address to) external virtual {
        (address token, LibERC721LazyMint.Mint721Data memory data) = abi.decode( encoded, (address, LibERC721LazyMint.Mint721Data));
        require(token == address(this), "Wrong contracts");
        mintAndTransfer(data, to);
    }

    // -------------------- THE MINTER --------------------------- //
    function mintAndTransfer( LibERC721LazyMint.Mint721Data memory data, address to) internal virtual {
        
        // Verify if message sender is approved address or owner
        require(_isDefaultApproved(_msgSender()) || _msgSender() == data.creator, "Not approved");

        // Verify signer/minter
        address signer = verifyAssetAndSigner(data);

        // Verify if creator has allowed the minter
        bytes32 royaltySplitterBytes = IMinterUpgradeable(minter).getDetailsForRoyalty(address(this), data.creator, signer);
        
        _safeMint(to, data.tokenId);
        if (signer == data.creator) {
            // Accept creator defined royalty
            _saveCreatorSignedRoyalties(data.tokenId, data.creator, data.royalty );
        } else {
            // Save royalty splitter bytes
            _saveRoyalties(data.tokenId, royaltySplitterBytes);
        }
        _setTokenURI(data.tokenId, data.tokenURI);
        emit Transfer(address(0), data.creator, data.tokenId);
        emit Transfer(data.creator, to, data.tokenId);
    }

    
    function _mint(address to, uint256 tokenId) internal virtual override {
        require(to != address(0), "ERC721: mint to the zero address");
        require(!_burned(tokenId), "token already burned");
        require(!_exists(tokenId), "ERC721: token already minted");

        _beforeTokenTransfer(address(0), to, tokenId);
        _holderTokens[to].add(tokenId);
        _tokenOwners.set(tokenId, to);        
    }

    // --------------- PUBLIC GETTERS (Exists, Burned, Royalty) -------------------- //

    function exists(uint256 _id) external view returns (bool) {
        return _exists(_id);
    }

    function burned(uint256 _id) external view returns (bool) {
        return _burned(_id);
    }

    // For compliance with EIP2981
    function royaltyInfo(uint256 _tokenId, uint256 _salePrice) external view override returns (address, uint256) {

        LibPart.Part memory royalty = creatorSignedRoyalty[_tokenId];
        if (royalty.value != 0 && royalty.account == address(0x0)) {
            royalty.account = address(_tokenId >> 96);
        } else if (royalty.value == 0 && royalty.account == address(0x0)) {
            royalty = IMinterUpgradeable(minter).getSplitter(royaltySplitterBytesMap[_tokenId]);
        }
        return (royalty.account, uint((_salePrice * royalty.value)/10000));
    }
    uint256[50] private __gap;
}
