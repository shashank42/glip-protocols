import "hardhat/console.sol";
// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;

import "./@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "./../meta-tx/ForwarderReceiverBase.sol";

contract Test1ERC20 is ForwarderReceiverBase, ERC20Upgradeable {

    address transferProxy;

     constructor (address _transferProxy, address forwarder) public {
        __ERC20_init("TEST ERC20", "TRC");
        transferProxy = _transferProxy;
        __ForwarderReceiverBase_init(forwarder);
     }

    function mint(address to, uint amount) external {
        _mint(to, amount);
    }


    function transferFrom(address sender, address recipient, uint256 amount) public virtual override returns (bool) {

        console.log("Inside test ERC20");
        console.log(msg.sender);
        console.log(transferProxy);

        if (msg.sender == transferProxy) {
            _transfer(sender, recipient, amount);
            return true;
        } else {
            revert("Call must come from proxy");
        }
    }

    function _msgSender() internal view virtual override(ForwarderReceiverBase, ContextUpgradeable) returns (address payable) {
        return ForwarderReceiverBase._msgSender();
    }


}
