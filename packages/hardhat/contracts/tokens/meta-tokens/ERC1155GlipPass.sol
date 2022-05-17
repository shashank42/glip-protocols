// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;
pragma abicoder v2;

import "./../erc-1155/ERC1155LazyGlipPass.sol";
import "./../../meta-tx/ForwarderReceiverBase.sol";

contract ERC1155GlipPass is ForwarderReceiverBase, ERC1155LazyGlipPass {

    event CreateERC1155GlipPass(address owner, string name, string symbol);
    
    function __ERC1155GlipPass_init(string memory _name, string memory _symbol, bool _global, string memory baseURI, string memory contractURI, address transferProxy, address lazyTransferProxy, address defaultMinter, address forwarder) external initializer {
        __ERC1155GlipPass_init_unchained(_name, _symbol, _global, baseURI, contractURI, transferProxy, lazyTransferProxy, defaultMinter, forwarder);
        emit CreateERC1155GlipPass(_msgSender(), _name, _symbol);
    }
    
    function __ERC1155GlipPass_init_unchained(string memory _name, string memory _symbol, bool _global, string memory baseURI, string memory contractURI, address transferProxy, address lazyTransferProxy, address defaultMinter, address forwarder) internal {
        __Ownable_init_unchained();
        __ERC1155Lazy_init_unchained(_global, defaultMinter);
        __ERC165_init_unchained();
        __Context_init_unchained();
        __Mint1155Validator_init_unchained("Mint1155GlipPass", "1");
        __ERC1155_init_unchained("");
        __HasContractURI_init_unchained(contractURI);
        __ERC1155Burnable_init_unchained();
        __RoyaltiesUpgradeable_init_unchained();
        __ERC1155Base_init_unchained(_name, _symbol);
        _setURI(baseURI);
        __ForwarderReceiverBase_init(forwarder);

        //setting default approver for transferProxies
        _setDefaultApproval(transferProxy, true);
        _setDefaultApproval(lazyTransferProxy, true);
    }

    function _msgSender() internal view virtual override(ForwarderReceiverBase, ContextUpgradeable) returns (address payable) {
        return ForwarderReceiverBase._msgSender();
    }

    uint256[49] private __gap;
}
