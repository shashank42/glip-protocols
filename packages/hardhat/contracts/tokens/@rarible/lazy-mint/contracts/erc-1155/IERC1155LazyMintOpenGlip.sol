// SPDX-License-Identifier: MIT

pragma solidity >=0.6.2 <0.8.0;
pragma abicoder v2;

import "./../../../../@openzeppelin/contracts-upgradeable/token/ERC1155/IERC1155Upgradeable.sol";
import "./LibERC1155LazyMintOpenGlip.sol";
import "./../../../royalties/contracts/LibPart.sol";

interface IERC1155LazyMintOpenGlip is IERC1155Upgradeable {

    event Supply(
        uint256 tokenId,
        uint256 value
    );
    event Creators(
        uint256 tokenId,
        LibPart.Part[] creators
    );

    function transferFromOrMint(
        LibERC1155LazyMintOpenGlip.Mint1155Data memory data,
        address from,
        address to,
        uint256 amount
    ) external;
}