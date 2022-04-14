// SPDX-License-Identifier: MIT

pragma solidity >=0.6.2 <0.8.0;
pragma abicoder v2;

import "./AbstractRoyalties.sol";
import "../Royalties.sol";
import "./../../../../../roles/IMinterUpgradeable.sol";

contract RoyaltiesImpl is AbstractRoyalties {

    function _onRoyaltiesSet(uint256 id, address wallet, LibPart.Part[] memory _royalties) override internal {
        // emit RoyaltiesSet(id, wallet, _royalties);
    }
}
