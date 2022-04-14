// SPDX-License-Identifier: MIT

pragma solidity ^0.7.6;
pragma abicoder v2;

import "./../tokens/@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "./../tokens/@rarible/royalties/contracts/LibPart.sol";
import "./IGlipERC721LazyData.sol";

interface IGlipERC721LazyV2 is IGlipERC721LazyData, IERC721Upgradeable {

    function decodeLazyMintData(bytes calldata encoded) external view returns(DecodedMintData memory);

    function mintAndTransferEncodedData(bytes memory encoded, address to, uint amount) external;

    function transferOwnership(address newOwner) external;

    function owner() external view returns (address);

}
