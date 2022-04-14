// SPDX-License-Identifier: MIT

pragma solidity >=0.6.2 <0.8.0;
pragma abicoder v2;

import "./LibPart.sol";

interface Royalties {
    event RoyaltiesSet(uint256 tokenId, address wallet, LibPart.Part[] royalties);
}
