// SPDX-License-Identifier: MIT

pragma solidity >=0.6.9 <0.8.0;

import "../roles/OperatorRole.sol";
import "./../../../exchange/v3/interfaces/contracts/IERC20TransferProxy.sol";

contract ERC20TransferProxy is IERC20TransferProxy, Initializable, OperatorRole {

    constructor() public {
    }

    function __ERC20TransferProxy_init() external initializer {
        __Ownable_init();
        __OperatorRole_init();
    }

    function erc20safeTransferFrom(IERC20Upgradeable token, address from, address to, uint256 value) override external onlyOperator {
        require(token.transferFrom(from, to, value), "failure while transferring");
    }
}
