// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;

import "./../@openzeppelin/contracts/proxy/UpgradeableBeacon.sol";

contract ERC721GlipLiveBeacon is UpgradeableBeacon {
    constructor(address impl) UpgradeableBeacon(impl) {

    }
}