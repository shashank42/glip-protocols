// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;

import "./../@openzeppelin/contracts/proxy/UpgradeableBeacon.sol";

contract ERC1155OpenGlipBeacon is UpgradeableBeacon {
    constructor(address impl) UpgradeableBeacon(impl) {
    }
}