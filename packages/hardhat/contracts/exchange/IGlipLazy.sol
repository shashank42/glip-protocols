// SPDX-License-Identifier: MIT

pragma solidity ^0.7.6;
pragma abicoder v2;

import "./../tokens/@rarible/royalties/contracts/LibPart.sol";
import "./IMintSaleData.sol";

interface IGlipLazy is IMintSaleData {

    function decodeLazyMintData(bytes calldata encoded) external view returns(DecodedMintData memory);

    function transferOwnership(address newOwner) external;

    function owner() external view returns (address);

}
