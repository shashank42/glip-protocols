// SPDX-License-Identifier: MIT

pragma solidity >=0.6.2 <0.8.0;
pragma abicoder v2;

import "./../../../@openzeppelin/contracts-upgradeable/introspection/ERC165Upgradeable.sol";
import "./../../royalties/contracts/LibRoyalties.sol";
import "./../../royalties/contracts/Royalties.sol";

abstract contract RoyaltiesUpgradeable is ERC165Upgradeable, Royalties {
    function __RoyaltiesUpgradeable_init_unchained() internal initializer {
        _registerInterface(LibRoyalties._INTERFACE_ID_ROYALTIES);
    }
}
