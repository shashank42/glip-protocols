// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;
pragma abicoder v2;

import "./../../@rarible/meta-tx/contracts/EIP712MetaTransaction.sol";
import "../ERC1155GlipPass.sol";

contract ERC1155GlipPassMeta is ERC1155GlipPass, EIP712MetaTransaction {

    event CreateERC1155GlipPassMeta(address owner, string name, string symbol);

    function __ERC1155GlipPassMeta_init(string memory _name, string memory _symbol, bool _global, string memory baseURI, string memory contractURI, address transferProxy, address lazyTransferProxy, address forwarder) external initializer {
        __ERC1155GlipPass_init_unchained(_name, _symbol, baseURI, contractURI, transferProxy, lazyTransferProxy, forwarder);
        __MetaTransaction_init_unchained("ERC1155GlipPassMeta", "1");
        emit CreateERC1155GlipPassMeta(_msgSender(), _name, _symbol);
    }

    function _msgSender() internal view virtual override(ERC1155GlipPass, EIP712MetaTransaction) returns (address payable) {
        return super._msgSender();
    }
}
