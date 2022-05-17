// SPDX-License-Identifier: MIT

pragma solidity ^0.7.6;
pragma abicoder v2;

import "./../tokens/@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "./../tokens/@rarible/royalties/contracts/LibPart.sol";

interface IGlipERC721Lazy is IERC721Upgradeable {

    function transferFromOrMintEncodedData(
        bytes memory encoded,
        address from,
        address to
    ) external;

}
