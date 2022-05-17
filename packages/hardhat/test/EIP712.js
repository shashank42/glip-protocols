// import { ethers } from "ethers";
// import { ExternallyOwnedAccount, Signer, TypedDataDomain, TypedDataField, TypedDataSigner } from "@ethersproject/abstract-signer";
// import { arrayify, Bytes, BytesLike, concat, hexDataSlice, isHexString, joinSignature, SignatureLike } from "@ethersproject/bytes";
// import { BigNumber } from "ethers";





const createTypeData = async (domainData, primaryType, message, types) => {
    // Don't need to provide EIP712Domain as a type to ethers.js
    //   return {
    //     types: Object.assign({
    //       EIP712Domain: DOMAIN_TYPE,
    //     }, types),
    //     domain: domainData,
    //     primaryType: primaryType,
    //     message: message
    //   };

    return {
        types: types,
        domain: domainData,
        primaryType: primaryType,
        message: message
      };
}


const signTypedDataV4 = async(signer, data) => {

    const sig = await signer._signTypedData(data["domain"], data["types"], data["message"]);

    const sig0 = sig.substring(2);
    const r = "0x" + sig0.substring(0, 64);
    const s = "0x" + sig0.substring(64, 128);
    const v = parseInt(sig0.substring(128, 130), 16);

    return {
    data,
    sig,
    v,
    r,
    s,
    };
}



const sign = async ( signer, domainName, domainVersion, chainId, contractAddress, primaryType, types, message ) =>
{
	const data = await createTypeData( {
		name: domainName,
		version: domainVersion,
		chainId,
		verifyingContract: contractAddress
	},
        primaryType,
		{ ...message},
		types
	);

	const sig = ( await signTypedDataV4( signer, data ) ).sig;

	return sig;
}



module.exports = { createTypeData, signTypedDataV4 };

