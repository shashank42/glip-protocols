// SPDX-License-Identifier: MIT

pragma solidity >=0.6.9 <0.8.0;
pragma abicoder v2;

import "./../../../../exchange/v3/interfaces/contracts/ITransferProxy.sol";
import "./../../../../tokens/@rarible/lazy-mint/contracts/erc-721/LibERC721LazyMint.sol";
import "./../../../../tokens/@rarible/lazy-mint/contracts/erc-721/IERC721LazyMint.sol";

import "../../roles/OperatorRole.sol";

contract ERC721GlipLazyMintTransferProxy is OperatorRole, ITransferProxy {

    constructor() public {
    }



    function transfer(LibAsset.Asset memory asset, address from, address to) override onlyOperator external {
        require(asset.value == 1, "erc721 value error");
        (address token, bytes memory data) = abi.decode(asset.assetType.data, (address, bytes));
        IERC721LazyMint(token).transferFromOrMintEncodedData(data, from, to);
    }
}
