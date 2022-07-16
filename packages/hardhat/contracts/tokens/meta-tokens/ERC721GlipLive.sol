// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;
pragma abicoder v2;

import "./../erc-721/ERC721Lazy.sol";
import "./../../meta-tx/ForwarderReceiverBase.sol";

contract ERC721GlipLive is ForwarderReceiverBase, ERC721Lazy {

    event CreateERC721GlipLive(address owner, string name, string symbol);

    // constructor() public initializer {}

    // address transferProxy, address lazyTransferProxy
    function __ERC721GlipLive_init(string memory _name, string memory _symbol, bool _global, string memory baseURI, string memory contractURI, address transferProxy, address lazyTransferProxy, address defaultMinter, address forwarder) public initializer {
        __ERC721GlipLive_init_unchained(_name, _symbol, _global, baseURI, contractURI, transferProxy, lazyTransferProxy, defaultMinter, forwarder); // transferProxy, lazyTransferProxy
        emit CreateERC721GlipLive(_msgSender(), _name, _symbol);
    }

    // address transferProxy, address lazyTransferProxy
    function __ERC721GlipLive_init_unchained(string memory _name, string memory _symbol, bool _global, string memory baseURI, string memory contractURI, address transferProxy, address lazyTransferProxy, address defaultMinter, address forwarder) internal {
        _setBaseURI(baseURI);
        __ERC721Lazy_init_unchained(_global, defaultMinter);
        __RoyaltiesUpgradeable_init_unchained();
        __Context_init_unchained();
        __ERC165_init_unchained();
        __Ownable_init_unchained();
        __ERC721Burnable_init_unchained();
        __Mint721Validator_init_unchained("Mint721GlipLive", "1");
        __HasContractURI_init_unchained(contractURI);
        __ERC721_init_unchained(_name, _symbol);
        __ForwarderReceiverBase_init(forwarder);

        //setting default approver for transferProxies
        _setDefaultApproval(transferProxy, true);
        _setDefaultApproval(lazyTransferProxy, true);
    }

    function _msgSender() internal view virtual override(ForwarderReceiverBase, ContextUpgradeable) returns (address payable) {
        return ForwarderReceiverBase._msgSender();
    }

    uint256[50] private __gap;
}
