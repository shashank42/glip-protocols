// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;

import "./../@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "../LibURI.sol";

import "./ERC1155Base.sol";

contract ERC1155BaseURI is ERC1155Base {

    function setURI(string memory newuri) external virtual {
        require(_isDefaultApproved(_msgSender()) || _msgSender() == owner(), "Not allowed");
        super._setURI(newuri);
    }

    uint256[50] private __gap;
}
