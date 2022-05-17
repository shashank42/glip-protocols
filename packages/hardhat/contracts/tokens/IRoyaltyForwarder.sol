pragma solidity 0.7.6;

interface IRoyaltyForwarder {

    function __RoyaltyForwarder_init(address minterAddress) external virtual;
    function setAutoFlush20(bool autoFlush) external virtual;
    function setAutoFlush721(bool autoFlush) external virtual;
    function setAutoFlush1155(bool autoFlush) external virtual;
 
    function flush() external virtual;

    function flushERC20Tokens(address token) external virtual;
    function flushERC721Token(address token, uint256 tokenId) external virtual;
    function flushERC1155Tokens(address token, uint256 tokenId) external virtual;

    function callFromMinter(address target, uint256 value, bytes calldata data) external returns (bool success, bytes memory);

}
