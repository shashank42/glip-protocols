const { createTypeData, signTypedDataV4 } = require("./EIP712");

const { ethers } = require("hardhat");

const zeroAddress = '0x0000000000000000000000000000000000000000';

const Types = {
	MetaTransaction: [
        { name: 'from', type: 'address' },
        { name: 'to', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'chainId', type: 'uint256' },
        { name: 'replayProtection', type: 'address' },
        { name: 'nonce', type: 'bytes' },
        { name: 'data', type: 'bytes' },
        { name: 'innerMessageHash', type: 'bytes32' },
    ]
};


async function createMetaTxForm(from, to, value, chainId, data) {

	// const chainId = Number(await account.getChainId());
    const nonce = ethers.BigNumber.from(ethers.utils.randomBytes(16)).mul(ethers.BigNumber.from("0x100000000000000000000000000000000"));

	
	const form = await createTypeData(
		{
            name: 'Forwarder',
            version: '1',
		    // chainId,
            // verifyingContract
		}, 
		'MetaTransaction', 
		{ from, to, value, chainId, replayProtection: zeroAddress, nonce, data, innerMessageHash: '0x0000000000000000000000000000000000000000000000000000000000000000'}, 
		Types);

    return form;

}


async function signMetaTxForm (metaTxOriginSigner, data) {

    const signature = await signTypedDataV4( metaTxOriginSigner, data);
    return signature.sig;

}


module.exports = { createMetaTxForm, signMetaTxForm }