// SPDX-License-Identifier: MIT
pragma abicoder v2;
pragma solidity >=0.6.2 <0.8.0;
import "../LibPart.sol";
abstract contract AbstractRoyalties {

    event SaveRoyaltySplitter(uint256 id, bytes32 royaltySplitterBytes);
    event SaveCreatorSignedRoyalty(uint256 id, LibPart.Part royalty);

    mapping (uint256 => LibPart.Part) creatorSignedRoyalty;
    mapping (uint256 => bytes32) royaltySplitterBytesMap;

    function _saveRoyalties(uint256 id, bytes32 royaltySplitterBytes ) internal {
        royaltySplitterBytesMap[id] = royaltySplitterBytes;
        emit SaveRoyaltySplitter(id, royaltySplitterBytes);
    }

    function _saveCreatorSignedRoyalties(uint256 id, address creator, LibPart.Part memory royalty ) internal {

        emit SaveCreatorSignedRoyalty(id, royalty);
        if (royalty.account == creator && creator == address(id >> 96)) {
            // To save gas don't set the account as it can be recovered
            royalty.account = address(0x0);
        }
        creatorSignedRoyalty[id] = royalty;
        
    }

    function _onRoyaltiesSet(uint256 id, address wallet, LibPart.Part[] memory _royalties) virtual internal;
}
