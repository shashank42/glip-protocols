// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
import "./../tokens/@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";
import "./../tokens/@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract ForwarderReceiverBase is Initializable, OwnableUpgradeable {
    address /* immutable */ _forwarder;
    
    function __ForwarderReceiverBase_init(address forwarder) internal initializer {
        _forwarder = forwarder;
    }

    function updateForwarder(address forwarder) external onlyOwner {
        _forwarder = forwarder;
    }

    function _msgSender() internal view virtual override returns (address payable signer) {
        if (msg.sender == _forwarder) {
            bytes memory data = msg.data;
            uint256 length = msg.data.length;
            assembly { 
                signer := and(mload(sub(add(data, length), 0x00)), 0xffffffffffffffffffffffffffffffffffffffff) 
                }
        } else {
            signer = msg.sender;
        }
	}
}