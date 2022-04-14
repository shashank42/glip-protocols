// SPDX-License-Identifier: MIT

pragma solidity >=0.6.2 <0.8.0;

import "./../../../royalties/contracts/LibPart.sol";

library LibERC1155LazyMint {
    bytes4 public constant ERC1155_LAZY_ASSET_CLASS =
        bytes4(keccak256("ERC1155_LAZY"));
    bytes4 constant _INTERFACE_ID_MINT_AND_TRANSFER = 0x6db15a0f;

    struct Mint1155Data {
        uint256 tokenId;
        uint256 reserve;
        uint256 supply;
        uint256 amount;
        address payable creator;
        address payable minter;
        LibPart.Part[] creators;
        LibPart.Part royalty;
        bytes signature;
    }

    bytes32 public constant MINT_AND_TRANSFER_TYPEHASH =
        keccak256(
            "Mint1155(uint256 tokenId,uint256 reserve,uint256 supply,uint256 amount,address creator,address minter,Part[] creators,Part royalty)Part(address account,uint96 value)"
        );

    function hash(Mint1155Data memory data) internal pure returns (bytes32) {
        bytes32[] memory creatorsBytes = new bytes32[](data.creators.length);
        for (uint256 i = 0; i < data.creators.length; i++) {
            creatorsBytes[i] = LibPart.hash(data.creators[i]);
        }

        return
            keccak256(
                abi.encode(
                    MINT_AND_TRANSFER_TYPEHASH,
                    data.tokenId,
                    data.reserve,
                    data.supply,
                    data.amount,
                    data.creator,
                    data.minter,
                    keccak256(abi.encodePacked(creatorsBytes)),
                    LibPart.hash(data.royalty)
                )
            );
    }
}
