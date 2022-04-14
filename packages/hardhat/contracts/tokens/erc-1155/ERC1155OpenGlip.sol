// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;
pragma abicoder v2;

import "./ERC1155LazyOpen.sol";
import "./../../meta-tx/ForwarderReceiverBase.sol";

contract ERC1155OpenGlip is ForwarderReceiverBase, ERC1155LazyOpen {
    /// @dev true if collection is private, false if public
    bool isPrivate;

    event CreateERC1155OpenGlip(address owner, string name, string symbol);
    
    function __ERC1155OpenGlip_init(string memory _name, string memory _symbol, string memory baseURI, string memory contractURI, address exchangeProxy, address defaultMinter, address forwarder) external initializer {
        __ERC1155OpenGlip_init_unchained(_name, _symbol, baseURI, contractURI, exchangeProxy, defaultMinter, forwarder);
        emit CreateERC1155OpenGlip(_msgSender(), _name, _symbol);
    }
    
    function __ERC1155OpenGlip_init_unchained(string memory _name, string memory _symbol,  string memory baseURI, string memory contractURI, address exchangeProxy, address defaultMinter, address forwarder) internal {
        __Ownable_init_unchained();
        __ERC1155Lazy_init_unchained(defaultMinter);
        __ERC165_init_unchained();
        __Context_init_unchained();
        __Mint1155Validator_init_unchained();
        __ERC1155_init_unchained("");
        __HasContractURI_init_unchained(contractURI);
        __ERC1155Burnable_init_unchained();
        __RoyaltiesUpgradeable_init_unchained();
        __ERC1155Base_init_unchained(_name, _symbol);
        _setURI(baseURI);
        __ForwarderReceiverBase_init(forwarder);


        //setting default approver for transferProxies
        _setDefaultApproval(exchangeProxy, true);
    }

    function _msgSender() internal view virtual override(ForwarderReceiverBase, ContextUpgradeable) returns (address payable) {
        return ForwarderReceiverBase._msgSender();
    }

    uint256[49] private __gap;
}
