

// // ----------- DEPLOYMENT ORDER ----------------- //
// // 0. Deploy EIP712Forwarder forwarder
// // 1. Deploy ERC20TransferProxy, TransferProxy and call __OperatorRole_init on both
// // 2. Deploy ERC721GlipLazyMintTransferProxy, ERC1155GlipLazyMintTransferProxy and call __OperatorRole_init on both
// // 3. Deploy exchange with ERC20TransferProxy.address and TransferProxy.address and EIP712Forwarder.address in intilializer
// // 4. Call addOperator on all proxies with exchange's address
// // 5. Call setTransferProxy on exchange with bytes4 of different asset classes bytes4(keccak256("ETH")) with each proxy's address
// // 6. Deploy RoyaltyForwarder implementation
// // 7. Deploy MinterUpgradeable with minter EOA address, _fee 0, minDefaultMinterRoyalty 0, RoyaltyForwarder.address,  EIP712Forwarder.address
// // 8. Deploy ERC721GlipLive, ERC1155GlipPass and ERC1155OpenGlip beacons
// // 9. Deploy ERC721GlipLiveFactoryC2, ERC1155GlipPassFactoryC2 and ERC1155OpenGlipFactoryC2 with beacon, TransferProxy.address, ERC721GlipLazyMintTransferProxy/ERC1155GlipLazyMintTransferProxy.address, address MinterUpgradeable.address, RoyaltyForwarder.address


// /* eslint no-use-before-define: "warn" */
// const fs = require("fs");
// const chalk = require("chalk");
// // import { config, tenderly, run, upgrades } = require("hardhat");
// // import * as ethers from "ethers";
// const ethers = require("ethers");
// // const { utils } = require("ethers");
// const R = require("ramda");
// var path = require('path');
// const { exec } = require("child_process");
// const ethUtil = require('ethereumjs-util');


// // const {defaultNetwork} = require("../hardhat.config");

// const defaultNetwork = "localhost";

// const { utils, Wallet } = require("zksync-web3");
// // import * as ethers from "ethers";
// const { HardhatRuntimeEnvironment } = require("hardhat/types"); 
// const { Deployer }  = require("@matterlabs/hardhat-zksync-deploy");

// //const verificationLag = 100000;
// const verificationLag = 1;

// function mnemonic() {
//   try {
//     return fs.readFileSync("./mnemonic.txt").toString().trim();
//   } catch (e) {
//     if (defaultNetwork !== "localhost") {
//       console.log("☢️ WARNING: No mnemonic file created for a deploy account. Try `yarn run generate` and then `yarn run account`.")
//     }
//   }
//   return "";
// }

// export default async function (hre: any) {


//   console.log(`Running deploy script for the Greeter contract`);

//   // Initialize the wallet.
//   const wallet = new Wallet(mnemonic());

//   // Create deployer object and load the artifact of the contract we want to deploy.
//   const deployer = new Deployer(hre, wallet);



//   console.log("\n\n 📡 Deploying...\n");

//   const deployed = {
//     "chain": "mumbai",
//     "deploymentTime": "19/07/2022",
//     "eip712Forwarder": "0x30F53eD8e9E0594Db7F8d1522a80015ee46cb3aC",
//     "erc20TransferProxy": "0xC02A60274FB758858227e852A5bCAd72beBa7186",
//     "transferProxy": "0x8566FC5fb683715322116C2f5720878f64723e6C",
//     "erc721GlipLazyMintTransferProxy": "0x8FCD0Ab8306a2F1bc1223F03A849082A398eed29",
//     "erc1155GlipLazyMintTransferProxy": "0x6b96746aaa2FFe1E9Eb96A93654a4A15b5E133a7",
//     "exchange": "0x2D0f4752B7016A28D3D7F7d42DF31A67ddCd2b78",
//     "exchangeImplAddress": "0xE8dC725524AeddEd575eA6C165ded2a0458bC0eA",
//     "royaltyForwarder": "0xD3573c82a633Af551BB8082Ac3F79b5dc64dC544",
//     "minterUpgradeable": "0xf999e169384a450EFd69Bfb77f170174608e4468",
//     "minterUpgradeableImplAddress": "0x33cD715627992765eB27eCf329d83617830F3535",
//     "erc721GlipLiveBeacon": "0x8088c22e66B16e31912ddD30C858C530bda592cC",
//     "glipLiveBeaconImplAddress": "0x5928A5b7A8Be9D3300eE6C8fA7b258E473680eBc",
//     "erc1155GlipPassBeacon": "0x467aB1d0fdE275dc0AB7121D0244C827b34737cA",
//     "glipPassBeaconImplAddress": "0xB64871e73b3c5EE52396f51Bd33ceaaB72583730",
//     "erc1155OpenGlipBeacon": "0xB1bBdc6311689a92CC11B26D0066D7579c5d5720",
//     "openGlipBeaconImplAddress": "0x1Dd346032CfCB2f5033a94f30d046091801b2E12",
//     "erc721GlipLiveFactoryC2": "0x010265811DDE618B4261e71e0D7401B521b7f670",
//     "GlipLive1Address": "0xc126EAE1A785e68974744Bf6C291d4c2cCcc0F71",
//     "erc1155GlipPassFactoryC2": "0x6eF4eEA7D61E6AE7bde70b4bfFF318Bb5e5183a8",
//     "GlipPass1Address": "0xf4f817B94804aC279b28De8834c684c6833D00aD",
//     "erc1155OpenGlipFactoryC2": "0xc0b5Ce4e5b7de3457bd3902e81690b279118292a",
//     "OpenGlip1Address": "0xf6Bd32E14714915Af6E2b65eF43B74781797C071",
//     "testERC20Address": "0x99b612Fe60BfD3E10842e72B4FbbC0fdB7F40520"
// }


//   // 0. Deploy EIP712Forwarder forwarder
//   var contractArgs: any = [];
//   var overrides = { gasLimit: 1000000 };
//   var eip712Forwarder = await deploy("EIP712Forwarder", "contracts/meta-tx/EIP712Forwarder.sol:EIP712Forwarder", contractArgs, {}, {}, null, deployer );
//   deployed.eip712Forwarder = eip712Forwarder.address;


//   // 1. Deploy ERC20TransferProxy, TransferProxy and call __OperatorRole_init on both
//   contractArgs = [];
//   overrides = { gasLimit: 1000000 };
//   var erc20TransferProxy = await deploy("ERC20TransferProxy", "contracts/transfer-proxy/contracts/proxy/ERC20TransferProxy.sol:ERC20TransferProxy", contractArgs, {}, {}, null, deployer);
//   deployed.erc20TransferProxy = erc20TransferProxy.address;

//   contractArgs = [];
//   overrides = { gasLimit: 1000000 };
//   var transferProxy = await deploy("TransferProxy", "contracts/transfer-proxy/contracts/proxy/TransferProxy.sol:TransferProxy", contractArgs, overrides, {}, null, deployer);
//   deployed.transferProxy = transferProxy.address;

//   await erc20TransferProxy.__ERC20TransferProxy_init(overrides);
//   await transferProxy.__TransferProxy_init(overrides);


//   // 2. Deploy ERC721GlipLazyMintTransferProxy, ERC1155GlipLazyMintTransferProxy and call __OperatorRole_init on both
//   contractArgs = [];
//   overrides = { gasLimit: 1000000 };
//   var erc721GlipLazyMintTransferProxy = await deploy("ERC721GlipLazyMintTransferProxy", "contracts/transfer-proxy/contracts/lazy-mint/erc721/ERC721GlipLazyMintTransferProxy.sol:ERC721GlipLazyMintTransferProxy", contractArgs, overrides, {}, null, deployer);
//   deployed.erc721GlipLazyMintTransferProxy = erc721GlipLazyMintTransferProxy.address;

//   contractArgs = [];
//   overrides = { gasLimit: 1000000 };
//   var erc1155GlipLazyMintTransferProxy = await deploy("ERC1155GlipLazyMintTransferProxy", "contracts/transfer-proxy/contracts/lazy-mint/erc1155/ERC1155GlipLazyMintTransferProxy.sol:ERC1155GlipLazyMintTransferProxy", contractArgs, overrides, {}, null, deployer);
//   deployed.erc1155GlipLazyMintTransferProxy = erc1155GlipLazyMintTransferProxy.address;

//   await erc721GlipLazyMintTransferProxy.__OperatorRole_init(overrides);
//   await erc1155GlipLazyMintTransferProxy.__OperatorRole_init(overrides);



//   // // 3. Deploy exchange with ERC20TransferProxy.address and TransferProxy.address and EIP712Forwarder.address in initializer
//   // const protocolFee = 100;
//   // const protocolFeeRecipient = "0xF1b6fceac6784a26360056973C41e0017DeE12e4";
//   // contractArgs = [deployed.transferProxy, deployed.erc20TransferProxy, protocolFee, protocolFeeRecipient, deployed.eip712Forwarder];
//   // overrides = { initializer: '__Exchange_init', timeout: 0, unsafeAllow: ["delegatecall"] }; // gasLimit: 2500000, //  
//   // var {proxy: exchange, impl: exchangeImplAddress} = await deployProxy("Exchange", "contracts/exchange/v3/Exchange.sol:Exchange", contractArgs, overrides, {});
//   // deployed.exchange = exchange.address;
//   // deployed.exchangeImplAddress = exchangeImplAddress;


//   // // 4. Call addOperator on all proxies with exchange's address
//   // overrides = { gasLimit: 1000000 };
//   // await erc20TransferProxy.addOperator(deployed.exchange, overrides);
//   // await transferProxy.addOperator(deployed.exchange, overrides);
//   // await erc721GlipLazyMintTransferProxy.addOperator(deployed.exchange, overrides);
//   // await erc1155GlipLazyMintTransferProxy.addOperator(deployed.exchange, overrides);


//   // // 5. Call setTransferProxy on exchange with bytes4 of different asset classes bytes4(keccak256("ETH")) with each proxy's address
//   // overrides = { gasLimit: 1000000 };
//   // await exchange.setTransferProxy(ERC721_LAZY, deployed.erc721GlipLazyMintTransferProxy, overrides);
//   // await exchange.setTransferProxy(ERC1155_LAZY, deployed.erc1155GlipLazyMintTransferProxy, overrides);

//   // console.log("setTransferProxy : ERC1155_LAZY", await exchange.proxies(ERC1155_LAZY));
//   // console.log("setTransferProxy : ERC721_LAZY", await exchange.proxies(ERC721_LAZY));



//   // // 6. Deploy RoyaltyForwarder implementation
//   // overrides = { gasLimit: 5000000 };
//   // var royaltyForwarder = await deploy("RoyaltyForwarder", "contracts/tokens/RoyaltyForwarder.sol:RoyaltyForwarder",[], overrides);
//   // deployed.royaltyForwarder = royaltyForwarder.address;



//   // // 7. Deploy MinterUpgradeable with minter EOA address, _fee 0, minDefaultMinterRoyalty 0, RoyaltyForwarder.address,  EIP712Forwarder.address
//   // const backendMinter = "0xF1b6fceac6784a26360056973C41e0017DeE12e4";
//   // const backendMintingFee = 0;
//   // const defaultMinterRoyalty = 0;
//   // contractArgs = [backendMinter, backendMintingFee, defaultMinterRoyalty, deployed.royaltyForwarder, deployed.eip712Forwarder];
//   // overrides = { initializer: '__MinterUpgradable_init', timeout: 0, unsafeAllow: ["delegatecall"] }; // gasLimit: 2500000, //  unsafeAllow: ["delegatecall"]
//   // var {proxy: minterUpgradeable, impl: minterUpgradeableImplAddress} = await deployProxy("MinterUpgradeable", "contracts/roles/MinterUpgradeable.sol:MinterUpgradeable", contractArgs, overrides, {}, backendMinter);
//   // deployed.minterUpgradeable = minterUpgradeable.address;
//   // deployed.minterUpgradeableImplAddress = minterUpgradeableImplAddress;



//   // // 8. Deploy ERC721GlipLive, ERC1155GlipPass and ERC1155OpenGlip beacons
//   // const assetContractOwnerAddress = "0xF1b6fceac6784a26360056973C41e0017DeE12e4";
//   // let overrides1 =  {timeout: 0, unsafeAllow: ["delegatecall"]}; // unsafeAllow: ["delegatecall"],
//   // let overrides2 = { initializer: '__ERC721GlipLive_init', timeout: 0, unsafeAllow: ["delegatecall"] };
//   // contractArgs = ["GlipLive", "GLV", false, "https://be.namasteapis.com/metadata/v1/live/", "", deployed.transferProxy, deployed.erc721GlipLazyMintTransferProxy, deployed.minterUpgradeable, deployed.eip712Forwarder];
//   // var  {beacon: erc721GlipLiveBeacon, beaconImpl: glipLiveBeaconImplAddress} = await deployTokenBeaconAndBeaconProxy("ERC721GlipLive", "contracts/tokens/meta-tokens/ERC721GlipLive.sol:ERC721GlipLive", assetContractOwnerAddress, contractArgs, overrides1, overrides2, {});
//   // deployed.erc721GlipLiveBeacon = erc721GlipLiveBeacon.address;
//   // deployed.glipLiveBeaconImplAddress = glipLiveBeaconImplAddress;


//   // overrides1 =  {timeout: 0, unsafeAllow: ["delegatecall"]}; // unsafeAllow: ["delegatecall"],
//   // overrides2 = { initializer: '__ERC1155GlipPass_init', timeout: 0, unsafeAllow: ["delegatecall"] };
//   // contractArgs = ["GlipPass", "GLP", false, "https://be.namasteapis.com/metadata/v1/pass/", "", deployed.transferProxy, deployed.erc1155GlipLazyMintTransferProxy, deployed.minterUpgradeable, deployed.eip712Forwarder];
//   // var  {beacon: erc1155GlipPassBeacon, beaconImpl: glipPassBeaconImplAddress} = await deployTokenBeaconAndBeaconProxy("ERC1155GlipPass", "contracts/tokens/meta-tokens/ERC1155GlipPass.sol:ERC1155GlipPass", assetContractOwnerAddress, contractArgs, overrides1, overrides2, {});
//   // deployed.erc1155GlipPassBeacon = erc1155GlipPassBeacon.address;
//   // deployed.glipPassBeaconImplAddress = glipPassBeaconImplAddress;


//   // overrides1 =  {timeout: 0, unsafeAllow: ["delegatecall"]}; // unsafeAllow: ["delegatecall"],
//   // overrides2 = { initializer: '__ERC1155OpenGlip_init', timeout: 0, unsafeAllow: ["delegatecall"] };
//   // contractArgs = ["OpenGlip", "OGP", false, "https://be.namasteapis.com/metadata/v1/open/", "", deployed.transferProxy, deployed.erc1155GlipLazyMintTransferProxy, deployed.minterUpgradeable, deployed.eip712Forwarder];
//   // var  {beacon: erc1155OpenGlipBeacon, beaconImpl: openGlipBeaconImplAddress} = await deployTokenBeaconAndBeaconProxy("ERC1155OpenGlip", "contracts/tokens/meta-tokens/ERC1155OpenGlip.sol:ERC1155OpenGlip", assetContractOwnerAddress, contractArgs, overrides1, overrides2, {});
//   // deployed.erc1155OpenGlipBeacon = erc1155OpenGlipBeacon.address;
//   // deployed.openGlipBeaconImplAddress = openGlipBeaconImplAddress;



//   // // 9. Deploy ERC721GlipLiveFactoryC2, ERC1155GlipPassFactoryC2 and ERC1155OpenGlipFactoryC2 with beacon, TransferProxy.address, ERC721GlipLazyMintTransferProxy/ERC1155GlipLazyMintTransferProxy.address, address MinterUpgradeable.address, RoyaltyForwarder.address

//   // contractArgs = [deployed.erc721GlipLiveBeacon, deployed.transferProxy, deployed.erc721GlipLazyMintTransferProxy, deployed.minterUpgradeable, deployed.eip712Forwarder];
//   // overrides = { gasLimit: 5000000 };
//   // var erc721GlipLiveFactoryC2 = await deploy("ERC721GlipLiveFactoryC2", "contracts/tokens/create-2/ERC721GlipLiveFactoryC2.sol:ERC721GlipLiveFactoryC2", contractArgs, overrides, {});
//   // deployed.erc721GlipLiveFactoryC2 = erc721GlipLiveFactoryC2.address;

//   // addressArgs = ["GlipLive", "GLV", false, "https://be.namasteapis.com/metadata/v1/live/", "", 0];
//   // contractArgs = [assetContractOwnerAddress, ...addressArgs];
//   // await erc721GlipLiveFactoryC2.createToken(...contractArgs, overrides);
//   // var GlipLive1Address = await erc721GlipLiveFactoryC2.getAddress(...addressArgs);
//   // console.log("Deployed GlipLive1 to : ", GlipLive1Address.toString());
//   // deployed.GlipLive1Address = GlipLive1Address;

//   // contractArgs = [deployed.erc1155GlipPassBeacon, deployed.transferProxy, deployed.erc1155GlipLazyMintTransferProxy, deployed.minterUpgradeable, deployed.eip712Forwarder];
//   // overrides = { gasLimit: 5000000 };
//   // var erc1155GlipPassFactoryC2 = await deploy("ERC1155GlipPassFactoryC2", "contracts/tokens/create-2/ERC1155GlipPassFactoryC2.sol:ERC1155GlipPassFactoryC2", contractArgs, overrides, {});
//   // deployed.erc1155GlipPassFactoryC2 = erc1155GlipPassFactoryC2.address;
//   // addressArgs = ["GlipPass", "GLP", false, "https://be.namasteapis.com/metadata/v1/pass/", "", 0];
//   // contractArgs = [assetContractOwnerAddress, ...addressArgs];
//   // await erc1155GlipPassFactoryC2.createToken(...contractArgs, overrides);
//   // var GlipPass1Address = await erc1155GlipPassFactoryC2.getAddress(...addressArgs);
//   // console.log("Deployed GlipPass1 to : ", GlipPass1Address.toString());
//   // deployed.GlipPass1Address = GlipPass1Address;

//   // contractArgs = [deployed.erc1155OpenGlipBeacon, deployed.transferProxy, deployed.erc1155GlipLazyMintTransferProxy, deployed.minterUpgradeable, deployed.eip712Forwarder];
//   // overrides = { gasLimit: 5000000 };
//   // var erc1155OpenGlipFactoryC2 = await deploy("ERC1155OpenGlipFactoryC2", "contracts/tokens/create-2/ERC1155OpenGlipFactoryC2.sol:ERC1155OpenGlipFactoryC2", contractArgs, overrides, {});
//   // deployed.erc1155OpenGlipFactoryC2 = erc1155OpenGlipFactoryC2.address;
//   // addressArgs = ["OpenGlip", "OGP", false, "https://be.namasteapis.com/metadata/v1/open/", "", 0];
//   // contractArgs = [assetContractOwnerAddress, ...addressArgs];
//   // await erc1155OpenGlipFactoryC2.createToken(...contractArgs, overrides);
//   // var OpenGlip1Address = await erc1155OpenGlipFactoryC2.getAddress(...addressArgs);
//   // console.log("Deployed OpenGlip1 to : ", OpenGlip1Address.toString());
//   // deployed.OpenGlip1Address = OpenGlip1Address;


//   // // 10. Deploy test ERC20 coins
//   // contractArgs = [deployed.erc20TransferProxy, deployed.eip712Forwarder];
//   // overrides = { gasLimit: 5000000 };
//   // var testERC20 = await deploy("Test1ERC20", "contracts/tokens/Test1ERC20.sol:Test1ERC20", contractArgs, overrides, {});
//   // console.log("Deployed TestERC20 to : ", testERC20.address);
//   // deployed.testERC20Address = testERC20.address;

//   console.log();

//   console.log(
//     " 💾  Artifacts (address, abi, and args) saved to: ",
//     chalk.blue(`packages/hardhat/artifacts/${defaultNetwork}/`),
//     "\n\n"
//   );

//   const curr = (new Date()).toLocaleDateString();

//   deployed.chain = defaultNetwork;
//   deployed.deploymentTime = curr;

//   // const allContracts = {
//   //   chain: defaultNetwork,
//   //   deploymentTime: curr,
//   //   eip712Forwarder: eip712Forwarder.address,
//   //   erc20TransferProxy: erc20TransferProxy.address,
//   //   transferProxy: transferProxy.address,
//   //   erc721GlipLazyMintTransferProxy: erc721GlipLazyMintTransferProxy.address,
//   //   erc1155GlipLazyMintTransferProxy: erc1155GlipLazyMintTransferProxy.address,
//   //   exchange: exchange.address,
//   //   exchangeImplAddress: exchangeImplAddress,
//   //   royaltyForwarder: royaltyForwarder.address,
//   //   minterUpgradeable: minterUpgradeable.address,
//   //   minterUpgradeableImplAddress: minterUpgradeableImplAddress,
//   //   erc721GlipLiveBeacon: erc721GlipLiveBeacon.address,
//   //   glipLiveBeaconImplAddress: glipLiveBeaconImplAddress,
//   //   erc1155GlipPassBeacon: erc1155GlipPassBeacon.address,
//   //   glipPassBeaconImplAddress: glipPassBeaconImplAddress,
//   //   erc1155OpenGlipBeacon: erc1155OpenGlipBeacon.address,
//   //   openGlipBeaconImplAddress: openGlipBeaconImplAddress,
//   //   erc721GlipLiveFactoryC2: erc721GlipLiveFactoryC2.address,
//   //   GlipLive1Address: GlipLive1Address,
//   //   erc1155GlipPassFactoryC2: erc1155GlipPassFactoryC2.address,
//   //   GlipPass1Address: GlipPass1Address,
//   //   erc1155OpenGlipFactoryC2: erc1155OpenGlipFactoryC2.address,
//   //   OpenGlip1Address: OpenGlip1Address,
//   //   testERC20Address: testERC20.address
//   // }

//   console.log(deployed);

//   await sleep(verificationLag);

// };




// const deploy = async (contractName, path, _args = [], overrides = {}, libraries = {}, newOwner = null, deployer: any) => {


//     while (true) {

//         try {
//             console.log(` 🛰  Deploying: ${contractName}`);
//             var contractArgs = _args || [];

//             const artifact = await deployer.loadArtifact(contractName);
//             const deployed = await deployer.deploy(artifact, contractArgs);

//             const box = deployed;
//             await box.deployed();
//             console.log("Box deployed to:", box.address);
//             writeFileRecursive(`artifacts/${defaultNetwork}/${contractName}.address`, deployed.address);

//             let extraGasInfo = ""
//             var gasLimit;
//             if(box&&box.deployTransaction){
//             gasLimit = deployed.deployTransaction.gasLimit;
//             const gasUsed = box.deployTransaction.gasLimit.mul(box.deployTransaction.gasPrice)
//             extraGasInfo = `${ethers.utils.formatEther(gasUsed)} ETH, tx hash ${box.deployTransaction.hash}`
//             }

//             console.log(
//                 " 📄",
//                 chalk.cyan(contractName),
//                 "deployed to:",
//                 chalk.magenta(box.address)
//             );
//             console.log(
//                 " ⛽",
//                 chalk.grey(extraGasInfo)
//             );
//             console.log(" GAS units : ", gasLimit.toNumber());

      

//             const cmdArgs = contractArgs.join(' ');

//             await sleep(verificationLag);

//             if (newOwner) {
//               const tx = await box.transferOwnership(newOwner);
//               await tx.wait();
//               console.log("Transferred ownership to : ", newOwner);
//             }

//             // Verifying contract
//             console.log("Verifying contract");
//             exec(`npx hardhat verify --contract ${path} --network ${defaultNetwork} ${box.address} ${cmdArgs}`, (error, stdout, stderr) => {
//                 if (error) {
//                     console.log(`error: ${error.message}`);
//                     return;
//                 }
//                 if (stderr) {
//                     console.log(`stderr: ${stderr}`);
//                     return;
//                 }
//                 console.log(`stdout: ${stdout}`);
//             });
//             return box;
//         } catch (error) {
//             console.log(error);
//         }
        
//     }

    

// }


// // const deployProxy = async (contractName: string, path: string, _args = [], overrides = {}, libraries = {}, newOwner = null) => {

// //     while(true) {

// //         try {
// //             console.log(` 🛰  Deploying: ${contractName}`);
    
// //             let contractArgs = _args || [];
            
        
// //             const Box = await ethers.getContractFactory(contractName);
// //             const box = await upgrades.deployProxy(Box, contractArgs, overrides); // unsafeAllowCustomTypes:true
// //             await box.deployed();
// //             console.log("Box deployed to:", box.address);
        
// //             const deployed = box;


// //             const implAddress = await upgrades.erc1967.getImplementationAddress(box.address);
// //             console.log("Implementation is here : ", implAddress);
        
// //             writeFileRecursive(`artifacts/${defaultNetwork}/${contractName}.address`, deployed.address);
// //             writeFileRecursive(`artifacts/${defaultNetwork}/${contractName}.impl.address`, implAddress);
        
// //             let extraGasInfo = ""
// //             var gasLimit;
// //             if(deployed&&deployed.deployTransaction){
// //               let gasUsed = ethers.BigNumber.from("0");
// //               if (deployed.deployTransaction.gasPrice != null ) {
// //                 gasUsed = deployed.deployTransaction.gasLimit.mul(deployed.deployTransaction.gasPrice)
// //                 extraGasInfo = `${ethers.utils.formatEther(gasUsed)} ETH, tx hash ${deployed.deployTransaction.hash}`
// //               }
// //             }
        
// //             console.log(
// //             " 📄",
// //             chalk.cyan(contractName),
// //             "deployed to:",
// //             chalk.magenta(deployed.address)
// //             );
// //             console.log(
// //             " ⛽",
// //             chalk.grey(extraGasInfo)
// //             );
// //             console.log(" GAS units : ", gasLimit.toNumber());
        
      
        
// //             await sleep(verificationLag);

// //             if (newOwner) {
// //               const tx = await box.transferOwnership(newOwner);
// //               await tx.wait();
// //               console.log("Transferred ownership to : ", newOwner);
// //             }
            
// //             console.log("Verifying contract");



        
// //             exec(`npx hardhat verify --contract ${path} --network ${defaultNetwork} ${implAddress}`, (error, stdout, stderr) => {
// //             if (error) {
// //                 console.log(`error: ${error.message}`);
// //                 return;
// //             }
// //             if (stderr) {
// //                 console.log(`stderr: ${stderr}`);
// //                 return;
// //             }
// //             console.log(`stdout: ${stdout}`);
// //             });
        
// //             return {proxy: box, impl: implAddress};
// //         } catch (error) {
// //             console.log(error);
// //         }

// //     }
    
// //   };



// // const deployTokenBeaconAndBeaconProxy = async (contractName: string, path: string, passContractOwner: string, _args = [], overrides1 = {}, overrides2 = {}, libraries = {}) => {
    
// //     while (true) {

// //         try {

// //             console.log(` 🛰  Deploying: ${contractName}`);
    
// //             const contractArgs = _args || [];
        
// //             const Box = await ethers.getContractFactory(contractName);
        
// //             const beacon = await upgrades.deployBeacon(Box, overrides1);
// //             await beacon.deployed();
// //             const beaconImplAddress = await upgrades.beacon.getImplementationAddress(beacon.address);
// //             console.log("Beacon deployed to:", beacon.address);
// //             console.log("Beacon implemented at:", beaconImplAddress );
            
        
// //             // const box = await upgrades.deployBeaconProxy(beacon, Box, contractArgs, overrides2);
// //             // await box.deployed();
// //             // console.log("Box deployed to:", box.address);

// //             // await sleep(10000);

// //             // console.log(await box.owner());

// //             // console.log("Transferring ownership to backend owner account");
// //             // console.log(passContractOwner);
// //             // await box.transferOwnership(passContractOwner);

// //             // console.log("New owner : ", await box.owner());
        

// //             const deployed = beacon;
        
// //             writeFileRecursive(`artifacts/${defaultNetwork}/${contractName}.beacon.address`, beacon.address);
// //             writeFileRecursive(`artifacts/${defaultNetwork}/${contractName}.impl.address`, beaconImplAddress);
// //             // writeFileRecursive(`artifacts/${defaultNetwork}/${contractName}.address`, box.address);
        
// //             let extraGasInfo = ""
// //             if(deployed&&deployed.deployTransaction){
// //               let gasUsed = ethers.BigNumber.from("0");
// //               if (deployed.deployTransaction.gasPrice != null ) {
// //                 gasUsed = deployed.deployTransaction.gasLimit.mul(deployed.deployTransaction.gasPrice)
// //                 extraGasInfo = `${ethers.utils.formatEther(gasUsed)} ETH, tx hash ${deployed.deployTransaction.hash}`
// //               }
            
// //             }
        
// //             console.log(
// //             " 📄",
// //             chalk.cyan(contractName),
// //             "deployed to:",
// //             chalk.magenta(deployed.address)
// //             );
// //             console.log(
// //             " ⛽",
// //             chalk.grey(extraGasInfo)
// //             );
        
           
        
// //             await sleep(verificationLag);
// //             // Verifying contract
// //             console.log("Verifying contract");
// //             exec(`npx hardhat verify --contract ${path} --network ${defaultNetwork} ${beaconImplAddress}`, (error, stdout, stderr) => {
// //             if (error) {
// //                 console.log(`error: ${error.message}`);
// //                 return;
// //             }
// //             if (stderr) {
// //                 console.log(`stderr: ${stderr}`);
// //                 return;
// //             }
// //             console.log(`stdout: ${stdout}`);
// //             });
        
// //             return {beacon: beacon, beaconImpl: beaconImplAddress};
            
// //         } catch (error) {
// //             console.log(error);
// //         }
        
// //     }
    
    
// //   };



// // ------ utils -------

// // function id(str) {
// // 	// return `${ethers.utils.keccak256(ethers.utils.formatBytes32String(str)).toString("hex").substring(0, 10)}`;
// //     // return `0x${ethUtil.keccak256(str).toString("hex").substring(0, 8)}`;
// //     return `0x${ethUtil.keccak256(Buffer.from(str, 'hex') ).toString("hex").substring(0, 8)}`;
// // }

// const id = (str) => {
// 	return ethers.utils.solidityKeccak256( ["string"] , [str] ).substring(0, 10);
// 	// return `0x${ethUtil.keccak256(Buffer.from(str, 'hex')).toString("hex").substring(0, 8)}`;
// }

// // function enc(token, tokenId) {
// // 	if (tokenId) {
// // 		return web3.eth.abi.encodeParameters(["address", "uint256"], [token, tokenId]);
// // 	} else {
// // 		return web3.eth.abi.encodeParameter("address", token);
// // 	}
// // }

// const ETH = id("ETH");
// const ERC20 = id("ERC20");
// const ERC721 = id("ERC721");
// const ERC721_LAZY = id("ERC721_LAZY");
// const ERC1155 = id("ERC1155");
// const ERC1155_LAZY = id("ERC1155_LAZY");
// const COLLECTION = id("COLLECTION");
// const CRYPTO_PUNKS = id("CRYPTO_PUNKS");
// const ORDER_DATA_V1 = id("V1");
// const ORDER_DATA_V2 = id("V2");
// const TO_MAKER = id("TO_MAKER");
// const TO_TAKER = id("TO_TAKER");
// const PROTOCOL = id("PROTOCOL");
// const ROYALTY = id("ROYALTY");
// const ORIGIN = id("ORIGIN");
// const PAYOUT = id("PAYOUT");

// console.log("ETH : ", ETH);
// console.log("ERC20 : ", ERC20);
// console.log("ERC721_LAZY : ", ERC721_LAZY);
// console.log("ERC1155_LAZY : ", ERC1155_LAZY);




// const writeFileRecursive = (file, data) => {
//   const dirname = path.dirname(file);
//   if (!fs.existsSync(dirname)) {
//     fs.mkdirSync(dirname, { recursive: true });
//   }
//   fs.writeFileSync(file, data);
// };





// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }




