// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;
pragma abicoder v2;

import "./ERC721GlipLive.sol";

contract ERC721Glip is ERC721GlipLive {

    constructor (string memory _name, string memory _symbol, bool _global, string memory baseURI, string memory contractURI, address exchangeProxy, address defaultMinter) public {
        __ERC721GlipLive_init( _name, _symbol, _global, baseURI, contractURI, exchangeProxy, defaultMinter);
    }

}