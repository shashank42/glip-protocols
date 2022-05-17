const { createTypeData, signTypedDataV4 } = require("./EIP712");


function AssetType(assetClass, data) {
	return { assetClass, data }
}

function Asset(assetClass, assetData, value) {
	return { assetType: AssetType(assetClass, assetData), value };
}


const Types = {
	AssetType: [
		{name: 'assetClass', type: 'bytes4'},
		{name: 'data', type: 'bytes'}
	],
	Asset: [
		{name: 'assetType', type: 'AssetType'},
		{name: 'value', type: 'uint256'}
	],
	Part: [
		{name: 'account', type: 'address'},
		{name: 'value', type: 'uint96'}
	],
	Mint1155: [
		{name: 'tokenId', type: 'uint256'},
		{name: 'reserve', type: 'Asset'},
		{name: 'supply', type: 'uint256'},
		{name: 'creator', type: 'address'},
		{name: 'minter', type: 'address'},
		{name: 'creators', type: 'Part[]'},
		{name: 'royalty', type: 'Part'}
	]
};

async function sign(account, tokenId, reserve, supply, creator, minter, creators, royalty, verifyingContract) {

	const chainId = Number(await account.getChainId());
	
	const data = await createTypeData(
		{
		name: "Mint1155OpenGlip",
		chainId,
		version: "1",
		verifyingContract
		}, 
		'Mint1155', 
		{ tokenId, reserve, supply, creator, minter, creators, royalty}, 
		Types);

	return (await signTypedDataV4(account, data)).sig;
}

module.exports = { sign, Asset, AssetType }