const ethUtil = require('ethereumjs-util');

const { ethers } = require("hardhat");
var abiCoder = ethers.utils.defaultAbiCoder;

function id(str) {
	return ethers.utils.solidityKeccak256( ["string"] , [str] ).substring(0, 10);
	// return `0x${ethUtil.keccak256(Buffer.from(str, 'hex')).toString("hex").substring(0, 8)}`;
}

function enc(token, tokenId) {
	var abiCoder = ethers.utils.defaultAbiCoder;
	if (tokenId > -1) {
		return abiCoder.encode(["address", "uint256"], [token, tokenId]);
	} else {
		return abiCoder.encode(["address"], [token]);
	}
}

function enc_lazy(token, bytes) {
	var abiCoder = ethers.utils.defaultAbiCoder;
	return abiCoder.encode(["address", "bytes"], [token, bytes]);
}

const ETH = id("ETH");
const ERC20 = id("ERC20");
const ERC721 = id("ERC721");
const ERC1155 = id("ERC1155");
const ORDER_DATA_V1 = id("V1");
const TO_MAKER = id("TO_MAKER");
const TO_TAKER = id("TO_TAKER");
const PROTOCOL = id("PROTOCOL");
const ROYALTY = id("ROYALTY");
const ORIGIN = id("ORIGIN");
const PAYOUT = id("PAYOUT");
const CRYPTO_PUNKS = id("CRYPTO_PUNKS");

// console.log( ETH, ERC20, ERC721, ERC1155, ORDER_DATA_V1, TO_MAKER, TO_TAKER, PROTOCOL, ROYALTY, ORIGIN, PAYOUT, CRYPTO_PUNKS);
console.log("ERC1155_LAZY : ", id("ERC1155_LAZY"));
console.log("ERC20 : ", id("ERC20"));

module.exports = { id, ETH, ERC20, ERC721, ERC1155, ORDER_DATA_V1, TO_MAKER, TO_TAKER, PROTOCOL, ROYALTY, ORIGIN, PAYOUT, CRYPTO_PUNKS, enc, enc_lazy }