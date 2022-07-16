const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

const { sign, Asset } = require("./mint");
const { id, ETH, ERC20, ERC721, ERC1155, ORDER_DATA_V1, enc, encDataV2, enc_lazy } = require("./assets");
const {Order, sign: signOrder} = require("./order");

const { createMetaTxForm, signMetaTxForm } = require("./meta");

const ZERO = "0x0000000000000000000000000000000000000000";
const eth = "0x0000000000000000000000000000000000000000";

use(solidity);

describe("Test ERC1155 Open Glip Asset Contract", function () {

    let artifact;
    let AssetContract;
    let ERC20TransferProxy;
    let TransferProxy;
    let LazyTransferProxy;
    let DefaultMinter;
    let EIP712Forwarder;
    let ERC20TestCoin;
    let Exchange;

    before(async function () {
        
        EIP712Forwarder = await (await (await ethers.getContractFactory('EIP712Forwarder')).deploy()).deployed();
        TransferProxy = await (await (await ethers.getContractFactory('TransferProxy')).deploy()).deployed();
        await TransferProxy.__TransferProxy_init();
        LazyTransferProxy = await (await (await ethers.getContractFactory('ERC1155GlipLazyMintTransferProxy')).deploy()).deployed();
        await LazyTransferProxy.__OperatorRole_init();
        ERC20TransferProxy = await (await (await ethers.getContractFactory('ERC20TransferProxy')).deploy()).deployed();
        await ERC20TransferProxy.__ERC20TransferProxy_init();
        let royaltyForwarder = await (await (await ethers.getContractFactory('RoyaltyForwarder')).deploy()).deployed();
        DefaultMinter = await (await (await ethers.getContractFactory('MinterUpgradeable')).deploy()).deployed();
        await DefaultMinter.__MinterUpgradable_init((await ethers.getSigners())[1].address, 0, 0, royaltyForwarder.address, EIP712Forwarder.address);
        await TransferProxy.addOperator((await ethers.getSigners())[2].address);
        await LazyTransferProxy.addOperator((await ethers.getSigners())[2].address);

        Exchange = await (await (await ethers.getContractFactory('Exchange')).deploy()).deployed();
        await Exchange.__Exchange_init(TransferProxy.address, ERC20TransferProxy.address, 100, "0xF1b6fceac6784a26360056973C41e0017DeE12e4", EIP712Forwarder.address);

        await TransferProxy.addOperator(Exchange.address);
        await LazyTransferProxy.addOperator(Exchange.address);
        await ERC20TransferProxy.addOperator(Exchange.address);


        await Exchange.setTransferProxy(id("ERC1155_LAZY"), LazyTransferProxy.address);
        
        artifact = await ethers.getContractFactory('ERC1155OpenGlip');
      });


    describe("Open Glip Asset Contract", function () {

        beforeEach(async () => {

            ERC20TestCoin = await (await (await ethers.getContractFactory('TestERC20')).deploy()).deployed();

            AssetContract = await artifact.deploy();
            await AssetContract.deployed();
            await AssetContract.__ERC1155OpenGlip_init("OpenGlip", "OGP", false, "", "", TransferProxy.address, LazyTransferProxy.address, DefaultMinter.address, EIP712Forwarder.address);

        });

        it("Mints 1155 asset signed by minter and submitted!", async () => {
            
            const mintData = {
                tokenId: 1, 
                reserve: Asset(id("ETH"), "0x", 1), 
                supply: 1, 
                creator: (await ethers.getSigners())[0].address, 
                minter: (await ethers.getSigners())[1].address, 
                creators: [{account: (await ethers.getSigners())[0].address, value: "1000"}], 
                royalty: {account: (await ethers.getSigners())[0].address, value: 100}, 
            };

            const signature = await getSignature((await ethers.getSigners())[1], mintData.tokenId, mintData.reserve, mintData.supply, mintData.creator, mintData.minter, mintData.creators, mintData.royalty);
            mintData["signature"] = signature;


            // https://ethereum.stackexchange.com/q/121525/97554
            const encodedMintData = ethers.utils.AbiCoder.prototype.encode(
                ['address', 'tuple(uint256 tokenId, tuple(tuple(bytes4 assetClass, bytes data) assetType, uint256 value) reserve, uint256 supply, address creator, address minter, tuple(address account, uint96 value)[] creators, tuple(address account, uint96 value) royalty, bytes signature) data'],
                [AssetContract.address, mintData]
            );

            // const data = await AssetContract.decodeLazyMintData(encodedMintData);
            // const signer = await AssetContract.verifyAssetAndSigner(mintData, 1);

            await AssetContract.transferFromOrMintEncodedData(encodedMintData, (await ethers.getSigners())[0].address, (await ethers.getSigners())[3].address, 1);

            expect(await AssetContract.balanceOf((await ethers.getSigners())[3].address, 1)).to.equal(1);

        });

        
        it("erc20 <> minted erc1155", async () => {  

            const accounts = await ethers.getSigners();

            // Mint 100 ERC20 to account 4
            await ERC20TestCoin.mint(accounts[4].address, 20000);
    	    await ERC20TestCoin.connect(accounts[4]).approve(ERC20TransferProxy.address, 10000000, { from: accounts[4].address });

            expect(await ERC20TestCoin.balanceOf(accounts[4].address)).to.equal(20000);

            // Mint ERC1155 to account 3 - creator is 1, minter is 2
            // Reserve is 20 ERC20 coins
            const mintData = {
                tokenId: 1, 
                reserve: Asset(id("ERC20"), ERC20TestCoin.address, 20), 
                supply: 1, 
                creator: accounts[0].address, 
                minter: accounts[1].address, 
                creators: [{account: accounts[0].address, value: 10000}],
                royalty: {account: accounts[0].address, value: 100},
            };

            const signature = await getSignature(accounts[1], mintData.tokenId, mintData.reserve, mintData.supply, mintData.creator, mintData.minter, mintData.creators, mintData.royalty);
            mintData["signature"] = signature;
            const encodedMintData = ethers.utils.AbiCoder.prototype.encode(
                ['address', 'tuple(uint256 tokenId, tuple(tuple(bytes4 assetClass, bytes data) assetType, uint256 value) reserve, uint256 supply, address creator, address minter, tuple(address account, uint96 value)[] creators, tuple(address account, uint96 value) royalty, bytes signature) data'],
                [AssetContract.address, mintData]
            );
            const data = await AssetContract.decodeLazyMintData(encodedMintData);
            const signer = await AssetContract.verifyAssetAndSigner(mintData, 1);

            await AssetContract.transferFromOrMintEncodedData(encodedMintData, accounts[0].address, accounts[3].address, 1);
            expect(await AssetContract.balanceOf(accounts[3].address, 1)).to.equal(1);

            // console.log("MINT COMPLETE");
            

            // Create order with make asset as 1 erc1155 asset and take asset as 30 ERC20 tokens

            let orderDataV1 = {
                payouts: [{account: accounts[3].address, value: 10000}],
                originFees: [{account: accounts[5].address, value: 200}, {account: accounts[6].address, value: 400}],
                isMakeFill: false
            };
            // console.log("RIGHT STRUCTURE DONE");

            console.log("orderDataV1 : ", orderDataV1);

            const encDataRight = ethers.utils.AbiCoder.prototype.encode(
                ['tuple(tuple(address account, uint96 value)[] payouts, tuple(address account, uint96 value)[] originFees, bool isMakeFill) data'],
                [orderDataV1]
            );


            // let encDataRight = await Exchange.encodeOrderDataV1(orderDataV1);
            // console.log("RIGHT encodeOrderDataV1");
            // console.log("DATA IS OK");
            const right = Order(accounts[3].address, Asset(id("ERC1155"), enc(AssetContract.address, 1), 1), ZERO, Asset(id("ERC20"), enc(ERC20TestCoin.address), 10000), 1, 0, 0,  id("V1"), encDataRight);
            // console.log("RIGHT ORDER CREATED");

            let signatureRight = await signOrder(right, accounts[3], Exchange.address);
            // console.log("RIGHT SIGNATURE DONE");


            orderDataV1 = {
                payouts: [{account: accounts[4].address, value: 10000}],
                originFees: [{account: accounts[7].address, value: 100}, {account: accounts[8].address, value: 300}],
                isMakeFill: 0
            };

            // console.log("LEFT STRUCTURE DONE");
            
            const encDataLeft = ethers.utils.AbiCoder.prototype.encode(
                ['tuple(tuple(address account, uint96 value)[] payouts, tuple(address account, uint96 value)[] originFees, bool isMakeFill) data'],
                [orderDataV1]
            );

            // let encDataLeft = await Exchange.encodeOrderDataV1(orderDataV1);
            // console.log("LEFT encodeOrderDataV1");
            const left = Order(accounts[4].address,Asset(id("ERC20"), enc(ERC20TestCoin.address), 20000), ZERO, Asset(id("ERC1155"), enc(AssetContract.address, 1), 1), 1, 0, 0,  id("V1"), encDataLeft);

            // console.log("LEFT ORDER CREATED");
            let signatureLeft = await signOrder(left, accounts[4], Exchange.address);
			// console.log("LEFT SIGNATURE DONE");

            // console.log()

            // Create order with make asset as 30 ERC20 tokens and take asset as 1 erc1155 asset token
            let tx = await Exchange.matchOrders(left, signatureLeft, right, signatureRight, { from: accounts[0].address });

            // send to match order
            expect(await AssetContract.balanceOf(accounts[3].address, 1)).to.equal(0);
            expect(await AssetContract.balanceOf(accounts[4].address, 1)).to.equal(1);

            // expect(await ERC20TestCoin.balanceOf(accounts[3].address)).to.equal(9600);
            expect(await ERC20TestCoin.balanceOf(accounts[4].address)).to.equal(9500);

            console.log("Makers");
            console.log((await ERC20TestCoin.balanceOf(accounts[3].address)).toNumber());
            console.log((await ERC20TestCoin.balanceOf(accounts[4].address)).toNumber());

            console.log("Right origin");
            console.log((await ERC20TestCoin.balanceOf(accounts[5].address)).toNumber());
            console.log((await ERC20TestCoin.balanceOf(accounts[6].address)).toNumber());

            console.log("Left origin");
            console.log((await ERC20TestCoin.balanceOf(accounts[7].address)).toNumber());
            console.log((await ERC20TestCoin.balanceOf(accounts[8].address)).toNumber());

            console.log("Protocol fee")
            console.log((await ERC20TestCoin.balanceOf("0xF1b6fceac6784a26360056973C41e0017DeE12e4")).toNumber());

        });

        it("erc20 <> un-minted erc1155 token", async () => {

            // console.log("ERC20TestCoin.address : ", ERC20TestCoin.address);

            const accounts = await ethers.getSigners();

            // Mint 100 ERC20 to account 4
            await ERC20TestCoin.mint(accounts[4].address, 20000);
    	    await ERC20TestCoin.connect(accounts[4]).approve(ERC20TransferProxy.address, 10000000, { from: accounts[4].address });

            expect(await ERC20TestCoin.balanceOf(accounts[4].address)).to.equal(20000);

            // Mint ERC1155 to account 3 - creator is 1, minter is 2
            // Reserve is 20 ERC20 coins
            const mintData = {
                tokenId: 1, 
                reserve: Asset(id("ERC20"), enc(ERC20TestCoin.address), 1000), 
                supply: 1, 
                creator: accounts[0].address, 
                minter: accounts[1].address, 
                creators: [{account: accounts[0].address, value: 10000}],
                royalty: {account: accounts[0].address, value: 100},
            };

            const signature = await getSignature(accounts[1], mintData.tokenId, mintData.reserve, mintData.supply, mintData.creator, mintData.minter, mintData.creators, mintData.royalty);
            mintData["signature"] = signature;

            const encodedMintData = ethers.utils.AbiCoder.prototype.encode(
                ['address', 'tuple(uint256 tokenId, tuple(tuple(bytes4 assetClass, bytes data) assetType, uint256 value) reserve, uint256 supply, address creator, address minter, tuple(address account, uint96 value)[] creators, tuple(address account, uint96 value) royalty, bytes signature) data'],
                [AssetContract.address, mintData]
            );
            const data = await AssetContract.decodeLazyMintData(encodedMintData);
            // console.log("decodeLazyMintData : ", data);
            const signer = await AssetContract.verifyAssetAndSigner(mintData, 1);



            // Create order with make asset as 1 erc1155 asset and take asset as 30 ERC20 tokens

            let orderDataV1 = {
                payouts: [{account: accounts[3].address, value: 10000}],
                originFees: [{account: accounts[5].address, value: 200}, {account: accounts[6].address, value: 400}],
                isMakeFill: 0
            };

            // console.log("RIGHT STRUCTURE DONE");

            const encDataRight = ethers.utils.AbiCoder.prototype.encode(
                ['tuple(tuple(address account, uint96 value)[] payouts, tuple(address account, uint96 value)[] originFees, bool isMakeFill) data'],
                [orderDataV1]
            );
            // let encDataRight = await Exchange.encodeOrderDataV1(orderDataV1);
            // console.log("RIGHT encodeOrderDataV1");
            // console.log("DATA IS OK");


            const right = Order(accounts[3].address, Asset(id("ERC1155_LAZY"), enc_lazy(AssetContract.address, encodedMintData), 1), ZERO, Asset(id("ERC20"), enc(ERC20TestCoin.address), 10000), 1, 0, 0,  id("V1"), encDataRight);
            // console.log(right);
            // console.log("RIGHT ORDER CREATED");

            let signatureRight = await signOrder(right, accounts[3], Exchange.address);
            // console.log("RIGHT SIGNATURE DONE");



            orderDataV1 = {
                payouts: [{account: accounts[4].address, value: 10000}],
                originFees: [{account: accounts[7].address, value: 100}, {account: accounts[8].address, value: 300}],
                isMakeFill: 0
            };



            // console.log("LEFT STRUCTURE DONE");

            const encDataLeft = ethers.utils.AbiCoder.prototype.encode(
                ['tuple(tuple(address account, uint96 value)[] payouts, tuple(address account, uint96 value)[] originFees, bool isMakeFill) data'],
                [orderDataV1]
            );
            // let encDataLeft = await Exchange.encodeOrderDataV1(orderDataV1);
            // console.log("LEFT encodeOrderDataV1");
            const left = Order(accounts[4].address,Asset(id("ERC20"), enc(ERC20TestCoin.address), 10000), ZERO, Asset(id("ERC1155_LAZY"), enc_lazy(AssetContract.address, encodedMintData), 1), 1, 0, 0,  id("V1"), encDataLeft);

            // console.log("LEFT ORDER CREATED");
            let signatureLeft = await signOrder(left, accounts[4], Exchange.address);
			// console.log("LEFT SIGNATURE DONE");

            // console.log()

            console.log(left);
            console.log(right);

            // Create order with make asset as 30 ERC20 tokens and take asset as 1 erc1155 asset token
            let tx = await Exchange.matchOrders(left, signatureLeft, right, signatureRight, { from: accounts[0].address });

            // send to match order
            expect(await AssetContract.balanceOf(accounts[3].address, 1)).to.equal(0);
            expect(await AssetContract.balanceOf(accounts[4].address, 1)).to.equal(1);

            // expect(await ERC20TestCoin.balanceOf(accounts[3].address)).to.equal(9600);
            expect(await ERC20TestCoin.balanceOf(accounts[4].address)).to.equal(9500);

            console.log("Makers");
            console.log((await ERC20TestCoin.balanceOf(accounts[0].address)).toNumber());
            console.log((await ERC20TestCoin.balanceOf(accounts[1].address)).toNumber());
            console.log((await ERC20TestCoin.balanceOf(accounts[2].address)).toNumber());
            console.log((await ERC20TestCoin.balanceOf(accounts[3].address)).toNumber());
            console.log((await ERC20TestCoin.balanceOf(accounts[4].address)).toNumber());

            console.log("Right origin");
            console.log((await ERC20TestCoin.balanceOf(accounts[5].address)).toNumber());
            console.log((await ERC20TestCoin.balanceOf(accounts[6].address)).toNumber());

            console.log("Left origin");
            console.log((await ERC20TestCoin.balanceOf(accounts[7].address)).toNumber());
            console.log((await ERC20TestCoin.balanceOf(accounts[8].address)).toNumber());

            console.log("Protocol fee")
            console.log((await ERC20TestCoin.balanceOf("0xF1b6fceac6784a26360056973C41e0017DeE12e4")).toNumber());


        }
        
        
        );


        it("un-minted erc1155 token <> un-minted erc1155 token", async () => {


            const accounts = await ethers.getSigners();

            // Circular dependency, cannot exchange unminted token with unminted token
            expect(function(){
                const mintDataRight = {
                    tokenId: 1, 
                    reserve: Asset(id("ERC1155_LAZY"), enc_lazy(AssetContract.address, encodedMintDataLeft), 1), 
                    supply: 1, 
                    creator: accounts[0].address, 
                    minter: accounts[1].address, 
                    creators: [{account: accounts[0].address, value: 10000}],
                    royalty: {account: accounts[0].address, value: 100},
                }
            } ).to.throw("encodedMintDataLeft is not defined");

        }
        
        
        );


        it("Mints 1155 asset signed by minter and transfer. Both tx submitted through forwarder!", async () => {

            const accounts = await ethers.getSigners();
            const mintData = {
                tokenId: 1, 
                reserve: Asset(id("ETH"), "0x", 1), 
                supply: 1, 
                creator: accounts[0].address, 
                minter: accounts[1].address, 
                creators: [{account: accounts[0].address, value: "1000"}], 
                royalty: {account: accounts[0].address, value: 100}, 
            };

            const signature = await getSignature(accounts[1], mintData.tokenId, mintData.reserve, mintData.supply, mintData.creator, mintData.minter, mintData.creators, mintData.royalty);
            mintData["signature"] = signature;
            const encodedMintData = ethers.utils.AbiCoder.prototype.encode(
                ['address', 'tuple(uint256 tokenId, tuple(tuple(bytes4 assetClass, bytes data) assetType, uint256 value) reserve, uint256 supply, address creator, address minter, tuple(address account, uint96 value)[] creators, tuple(address account, uint96 value) royalty, bytes signature) data'],
                [AssetContract.address, mintData]
            );
            const data = await AssetContract.decodeLazyMintData(encodedMintData);
            const signer = await AssetContract.verifyAssetAndSigner(mintData, 1);


            // Create form using the correct function call and with correct parameters
            let realTx = await AssetContract.populateTransaction.transferFromOrMintEncodedData(encodedMintData, accounts[0].address, accounts[3].address, 1);
            console.log("transferFromOrMintEncodedData")
           
            let form = await createMetaTxForm(accounts[0].address, AssetContract.address, 0, Number(await accounts[0].getChainId()), realTx.data);
            console.log("createMetaTxForm")

            // Get it signed by the client - in this case account[0] as account[0] is the creator address in the mintData
            let metaTxOriginSig = await signMetaTxForm(accounts[0], form);
            console.log("signMetaTxForm")


            // Send by any signer to the forwarder
            let popTx = await EIP712Forwarder.forward( form.message, 0, metaTxOriginSig );
            console.log("forward")


            expect(await AssetContract.balanceOf(accounts[3].address, 1)).to.equal(1);

            realTx = await AssetContract.populateTransaction.safeTransferFrom(
                accounts[3].address,
                accounts[2].address,
                1,
                1,
                "0x"
            );
            console.log("safeTransferFrom")
            form = await createMetaTxForm(accounts[3].address, AssetContract.address, 0, Number(await accounts[0].getChainId()), realTx.data);
            console.log("createMetaTxForm")

            // Get it signed by the client - in this case account[0] as account[0] is the creator address in the mintData
            metaTxOriginSig = await signMetaTxForm(accounts[3], form);
            console.log("signMetaTxForm")

            // Send by any signer to the forwarder
            popTx = await EIP712Forwarder.forward( form.message, 0, metaTxOriginSig );
            console.log("forward")

            expect(await AssetContract.balanceOf(accounts[3].address, 1)).to.equal(0);
            expect(await AssetContract.balanceOf(accounts[2].address, 1)).to.equal(1);

        });

    });

    function getSignature(account, tokenId, reserve, supply, creator, minter, creators, royalty) {
        
        return sign(account, tokenId, reserve, supply, creator, minter, creators, royalty, AssetContract.address);

    }

});
