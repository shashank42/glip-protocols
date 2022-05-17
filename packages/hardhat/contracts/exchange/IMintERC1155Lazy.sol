// SPDX-License-Identifier: MIT

pragma solidity ^0.7.6;
pragma abicoder v2;

import "./../tokens/@openzeppelin/contracts-upgradeable/token/ERC1155/IERC1155Upgradeable.sol";
import "./../tokens/@rarible/royalties/contracts/LibPart.sol";

interface IGlipERC1155Lazy is IERC1155Upgradeable {

    function transferFromOrMintEncodedData(
        bytes memory encoded,
        address from,
        address to,
        uint256 amount
    ) external virtual;

}
