// SPDX-License-Identifier: MIT

pragma solidity ^0.7.6;

import "./../tokens/erc-1271/ERC1271Validator.sol";

contract AuctionValidatorV2 is ERC1271Validator {
    function __AuctionValidator_init_unchained() internal initializer {
        __EIP712_init_unchained("Exchange", "2");
    }

    function validate(address account, bytes32 hash, bytes memory signature) internal view returns(address){
        return validate1271(account, hash, signature);
    }
    
    uint256[50] private __gap;
}
