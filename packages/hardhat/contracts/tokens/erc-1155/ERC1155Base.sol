// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;
pragma abicoder v2;

import "./../@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./ERC1155BurnableUpgradeable.sol";
import "./ERC1155DefaultApproval.sol";
import "../HasContractURI.sol";

abstract contract ERC1155Base is OwnableUpgradeable, ERC1155DefaultApproval, ERC1155BurnableUpgradeable, HasContractURI {

    string public name;
    string public symbol;

    function isApprovedForAll(address _owner, address _operator) public override(ERC1155Upgradeable, ERC1155DefaultApproval) view returns (bool) {
        return ERC1155DefaultApproval.isApprovedForAll(_owner, _operator);
    }

    function _mint(address account, uint256 id, uint256 amount, bytes memory data) internal virtual override(ERC1155Upgradeable) {
        super._mint(account, id, amount, data);
    }

    function __ERC1155Base_init_unchained(string memory _name, string memory _symbol) internal initializer {
        name = _name;
        symbol = _symbol;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165Upgradeable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }


     /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwnerOrDefaultApproved() {
        require((owner() == _msgSender()) || (_isDefaultApproved(_msgSender())), "Safe Ownable: caller is not the owner or default approved");
        _;
    }

    // /**
    //  * @dev Transfers ownership of the contract to a new account (`newOwner`).
    //  * Can only be called by the current owner or the default approved address which is set at the time of deployment
    //  * This is overridden to allow for safety of creators who misplace their private key
    //  */
    // function transferOwnership(address newOwner) public virtual override(OwnableUpgradeable) onlyOwnerOrDefaultApproved {
    //     require(newOwner != address(0), "Ownable: new owner is the zero address");
    //     _setOwnership(newOwner);
    // }

    uint256[50] private __gap;
}
