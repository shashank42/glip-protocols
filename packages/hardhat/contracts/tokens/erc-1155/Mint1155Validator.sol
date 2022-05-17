// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;

import "../erc-1271/ERC1271Validator.sol";
import "./../@rarible/lazy-mint/contracts/erc-1155/LibERC1155LazyMint.sol";

contract Mint1155Validator is ERC1271Validator {
    function __Mint1155Validator_init_unchained(string memory domain, string memory version) internal initializer {
        __EIP712_init_unchained(domain, version);
    }

    function validate(address account, bytes32 hash, bytes memory signature) internal view returns(address) {
        return validate1271(account, hash, signature);
    }
    uint256[50] private __gap;
}
