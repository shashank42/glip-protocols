import "hardhat/console.sol";
// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

contract Test1ERC20 is ERC20Upgradeable {

    address transferProxy;

     constructor (address _transferProxy) public {
        __ERC20_init("TEST ERC20", "TRC");
        transferProxy = _transferProxy;
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


}
