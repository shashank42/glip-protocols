// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;
pragma abicoder v2;

import "./../@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./ERC721BurnableUpgradeable.sol";
import "./ERC721DefaultApproval.sol";
import "../HasContractURI.sol";

abstract contract ERC721Base is OwnableUpgradeable, ERC721DefaultApproval, ERC721BurnableUpgradeable, HasContractURI {

    function _isApprovedOrOwner(address spender, uint256 tokenId) internal virtual override(ERC721Upgradeable, ERC721DefaultApproval) view returns (bool) {
        return ERC721DefaultApproval._isApprovedOrOwner(spender, tokenId);
    }

    function isApprovedForAll(address owner, address operator) public view virtual override(ERC721DefaultApproval, ERC721Upgradeable) returns (bool) {
        return ERC721DefaultApproval.isApprovedForAll(owner, operator);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165Upgradeable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _mint(address to, uint256 tokenId) internal virtual override(ERC721Upgradeable) {
        super._mint(to, tokenId);
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwnerOrDefaultApproved() {
        require((owner() == _msgSender()) || (_isDefaultApproved(_msgSender())), "Safe Ownable: caller is not the owner or default approved");
        _;
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner or the default approved address which is set at the time of deployment
     * This is overridden to allow for safety of creators who misplace their private key
     */
    function transferOwnership(address newOwner) public virtual override(OwnableUpgradeable) onlyOwnerOrDefaultApproved {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _setOwnership(newOwner);
    }

    uint256[50] private __gap;
}

