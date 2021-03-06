// SPDX-License-Identifier: MIT

pragma solidity ^0.7.6;
pragma abicoder v2;

import "./../tokens/@rarible/royalties/contracts/LibPart.sol";

interface IGlipERC721LazyData {

    struct DecodedMintData {
        uint256 tokenId; // Token id
        uint256 reserve; // Reserve
        address creator; // Primary creator
        LibPart.Part[] payouts; // Payout split %s
        LibPart.Part minter; // Minter fee %
        LibPart.Part royalty;
    }

}
