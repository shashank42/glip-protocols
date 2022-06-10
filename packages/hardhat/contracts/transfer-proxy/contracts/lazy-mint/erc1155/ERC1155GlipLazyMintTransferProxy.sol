import "hardhat/console.sol";
// SPDX-License-Identifier: MIT

pragma solidity >=0.6.9 <0.8.0;
pragma abicoder v2;

import "./../../../../exchange/v3/interfaces/contracts/ITransferProxy.sol";
import "./../../../../tokens/@rarible/lazy-mint/contracts/erc-1155/LibERC1155LazyMint.sol";
import "./../../../../tokens/@rarible/lazy-mint/contracts/erc-1155/IERC1155LazyMint.sol";
import "../../roles/OperatorRole.sol";

contract ERC1155GlipLazyMintTransferProxy is OperatorRole, ITransferProxy {
    constructor() public {
    }
    
    function transfer(LibAsset.Asset memory asset, address from, address to) override onlyOperator external {
        (address token, bytes memory data) = abi.decode(asset.assetType.data, (address, bytes));
        console.log("Inside ERC1155GlipLazyMintTransferProxy");
        console.log(token);
        IERC1155LazyMint(token).transferFromOrMintEncodedData(data, from, to, asset.value);
    }
}
