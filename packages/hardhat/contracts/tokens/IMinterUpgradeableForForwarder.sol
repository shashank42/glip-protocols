pragma solidity ^0.7.6;
pragma abicoder v2;

import "./@rarible/royalties/contracts/LibPart.sol";

interface IMinterUpgradeableForForwarder {
    function recieveRoyaltyStake() external payable;
    function forwarderSplits(address) external returns (LibPart.Part[] memory);
}
