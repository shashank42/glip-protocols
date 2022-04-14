
pragma solidity ^0.7.6;
pragma abicoder v2;
interface IAuctioneerUpgradeable {
    function getFee(address _token, address _minter, address _signer, uint8 _auctionType) external view returns (uint96);
}
