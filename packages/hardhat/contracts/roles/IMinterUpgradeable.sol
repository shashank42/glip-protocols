
pragma solidity ^0.7.6;
pragma abicoder v2;

import "../tokens/@rarible/royalties/contracts/LibPart.sol";

interface IMinterUpgradeable {

    function getDetailsForMinting(address _token, address _creator, address _signer) external view returns (
        uint96,
        LibPart.Part[] memory,
        bytes32,
        LibPart.Part memory);

    function getDetailsForRoyalty(address _token, address _creator, address _signer) external view returns (
        bytes32
    );

    function getSplitter(bytes32 signature) external view returns(LibPart.Part memory);

    function recieveRoyaltyStake() external payable;
}
