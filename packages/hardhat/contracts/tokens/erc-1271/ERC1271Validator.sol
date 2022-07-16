import "hardhat/console.sol";
// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;

import "./ERC1271.sol";
import "./../@openzeppelin/contracts-upgradeable/drafts/EIP712Upgradeable.sol";
import "./../@rarible/libraries/contracts/LibSignature.sol";

abstract contract ERC1271Validator is EIP712Upgradeable {
    using AddressUpgradeable for address;
    using LibSignature for bytes32;

    string constant SIGNATURE_ERROR = "signature verification error";
    bytes4 constant internal MAGICVALUE = 0x1626ba7e;

    function validate1271(address signer, bytes32 structHash, bytes memory signature) internal view returns (address) {
        bytes32 hash = _hashTypedDataV4(structHash);

        address signerFromSig;
        if (signature.length == 65) {
            signerFromSig = hash.recover(signature);
        }

        console.log("Signature");
        console.logBytes(signature);
        console.log("Struct hash");
        console.logBytes32(structHash);
        console.logBytes32(_domainSeparatorV4());
        console.log("Final hash");
        console.logBytes32(hash);
        console.log("Signer");
        console.log(signer);
        console.log(signerFromSig);

        if  (signerFromSig != signer) {
            if (signer.isContract()) {
                require(
                    ERC1271(signer).isValidSignature(hash, signature) == MAGICVALUE,
                    SIGNATURE_ERROR
                );
            } else {
                revert(SIGNATURE_ERROR);
            }
        }

        return signerFromSig;
    }
    uint256[50] private __gap;
}
