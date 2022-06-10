

// ----------- DEPLOYMENT ORDER ----------------- //
// 0. Deploy EIP712Forwarder forwarder
// 1. Deploy ERC20TransferProxy, TransferProxy and call __OperatorRole_init on both
// 2. Deploy ERC721GlipLazyMintTransferProxy, ERC1155GlipLazyMintTransferProxy and call __OperatorRole_init on both
// 3. Deploy exchange with ERC20TransferProxy.address and TransferProxy.address and EIP712Forwarder.address in intilializer
// 4. Call addOperator on all proxies with exchange's address
// 5. Call setTransferProxy on exchange with bytes4 of different asset classes bytes4(keccak256("ETH")) with each proxy's address
// 6. Deploy RoyaltyForwarder implementation
// 7. Deploy MinterUpgradeable with minter EOA address, _fee 0, minDefaultMinterRoyalty 0, RoyaltyForwarder.address,  EIP712Forwarder.address
// 8. Deploy ERC721GlipLive, ERC1155GlipPass and ERC1155OpenGlip beacons
// 9. Deploy ERC721GlipLiveFactoryC2, ERC1155GlipPassFactoryC2 and ERC1155OpenGlipFactoryC2 with beacon, TransferProxy.address, ERC721GlipLazyMintTransferProxy/ERC1155GlipLazyMintTransferProxy.address, address MinterUpgradeable.address, RoyaltyForwarder.address


/* eslint no-use-before-define: "warn" */
const fs = require("fs");
const chalk = require("chalk");
const { config, ethers, tenderly, run, upgrades } = require("hardhat");
const { utils } = require("ethers");
const R = require("ramda");
var path = require('path');
const { exec } = require("child_process");
const ethUtil = require('ethereumjs-util');

const {defaultNetwork} = require("../hardhat.config");

verificationLag = 100000;
// verificationLag = 1;

const main = async () => {

  console.log("\n\n 📡 Deploying...\n");

//   const deployed = {
//     "deploymentTime": "12/05/2022",
//     "eip712Forwarder": "0x17ED49532F6F00845afD7C450265739480e67c93",
//     "erc20TransferProxy": "0xB2803975FB26C86555b2a7DD79D99C6A16995adE",
//     "transferProxy": "0x164c868E888C7A996Daa7b729123eF8B60c9F660",
//     "erc721GlipLazyMintTransferProxy": "0xa6c7A0c58e89FEed8A558779779e73561B5C010b",
//     "erc1155GlipLazyMintTransferProxy": "0xE2B72D94e5373CE3304FFB3aaF01b374116399E9",
//     "exchange": "0x877844098CaC36d1Cbd379997ce85F26717c1Ca2",
//     "exchangeImplAddress": "0xB6C3DEA66d7F98514Eb27e4eE78012b040F97ea8",
//     "royaltyForwarder": "0xDA93c4D10c3bC7fC68C11519dE79C2af4d86460a",
//     "minterUpgradeable": "0xb697EFD82aBaEaDC5B9812a8Be7bED2e91642902",
//     "minterUpgradeableImplAddress": "0x33cD715627992765eB27eCf329d83617830F3535",
//     "erc721GlipLiveBeacon": "0x517297BE295e7B7d0bcfF5058a5B8c53fcBE1E42",
//     "glipLiveBeaconImplAddress": "0x77CeeB9a2e6B912612883ddab26329A1e88Dcf5a",
//     "erc1155GlipPassBeacon": "0xBFD3488c90dd517DdEdC13753b1f98b23D48E2C2",
//     "glipPassBeaconImplAddress": "0xCfF72809D0A295fe6f5cE7BE6E065c316280D024",
//     "erc1155OpenGlipBeacon": "0x1CA3610b42F316B933A5e0341d5fE9118af2F702",
//     "openGlipBeaconImplAddress": "0x414Fd26a9c7bF5932200d015c06e70Df3d5FC24e",
//     "erc721GlipLiveFactoryC2": "0x793b86Df97dccfda1EEBc842643A81AC6ce8D0A5",
//     "GlipLive1Address": "0xB5D9A603d071923b5325B81b699AaA87cBf7A452",
//     "erc1155GlipPassFactoryC2": "0xdeeeC8d49603eA4303bed5c08E8CAeeEE2211f41",
//     "GlipPass1Address": "0x1038BE3987C8649cdd83D936cB60Fe5d52a61CE9",
//     "erc1155OpenGlipFactoryC2": "0x2337f580a6ec70Eb9Ad0A1f94863611a4A748793",
//     "OpenGlip1Address": "0xf4c4648a15e856C65865aCBB355B29811b27d5FF",
//     "testERC20Address": "0xFC269941095f33996873543829a81563609a91ac"
// }


  // 0. Deploy EIP712Forwarder forwarder
  var contractArgs = [];
  var overrides = { gasLimit: 1000000 };
  var eip712Forwarder = await deploy("EIP712Forwarder", "contracts/meta-tx/EIP712Forwarder.sol:EIP712Forwarder", contractArgs, {}, {});


  // 1. Deploy ERC20TransferProxy, TransferProxy and call __OperatorRole_init on both
  contractArgs = [];
  overrides = { gasLimit: 1000000 };
  var erc20TransferProxy = await deploy("ERC20TransferProxy", "contracts/transfer-proxy/contracts/proxy/ERC20TransferProxy.sol:ERC20TransferProxy", contractArgs, {}, {});

  contractArgs = [];
  overrides = { gasLimit: 1000000 };
  var transferProxy = await deploy("TransferProxy", "contracts/transfer-proxy/contracts/proxy/TransferProxy.sol:TransferProxy", contractArgs, overrides, {});

  await erc20TransferProxy.__ERC20TransferProxy_init(overrides);
  await transferProxy.__TransferProxy_init(overrides);


  // 2. Deploy ERC721GlipLazyMintTransferProxy, ERC1155GlipLazyMintTransferProxy and call __OperatorRole_init on both
  contractArgs = [];
  overrides = { gasLimit: 1000000 };
  var erc721GlipLazyMintTransferProxy = await deploy("ERC721GlipLazyMintTransferProxy", "contracts/transfer-proxy/contracts/lazy-mint/erc721/ERC721GlipLazyMintTransferProxy.sol:ERC721GlipLazyMintTransferProxy", contractArgs, overrides, {});

  contractArgs = [];
  overrides = { gasLimit: 1000000 };
  var erc1155GlipLazyMintTransferProxy = await deploy("ERC1155GlipLazyMintTransferProxy", "contracts/transfer-proxy/contracts/lazy-mint/erc1155/ERC1155GlipLazyMintTransferProxy.sol:ERC1155GlipLazyMintTransferProxy", contractArgs, overrides, {});

  await erc721GlipLazyMintTransferProxy.__OperatorRole_init(overrides);
  await erc1155GlipLazyMintTransferProxy.__OperatorRole_init(overrides);


//     // const eipForwarderAddress = "0xfA683C78a5cA80568aC76969be4134Db7E4fc06F";
//     // const erc20ProxyAddrrss = "0x93c83c20Bf46E128997e3C28F9A30163d4d18406";
//     // const transferProxyAddress = "0x8E4e73c161Fe8d2731aC6C71B53156aEA11e345D";
//     // const erc721GlipLazyMintTransferProxyAddress = "0x999f2676f2232f05f14d59F4e4c2169fBF62b4eb";
//     // const erc1155GlipLazyMintTransferProxyAddress = "0x6210E87f94835c750a4b62DDE3912A2b78F456A2";


  // 3. Deploy exchange with ERC20TransferProxy.address and TransferProxy.address and EIP712Forwarder.address in initializer
  const protocolFee = 100;
  const protocolFeeRecipient = "0xF1b6fceac6784a26360056973C41e0017DeE12e4";
  contractArgs = [transferProxy.address, erc20TransferProxy.address, protocolFee, protocolFeeRecipient, eip712Forwarder.address];
  var overrides = { initializer: '__Exchange_init', timeout: 0, unsafeAllow: ["delegatecall"] }; // gasLimit: 2500000, //  
  var {proxy: exchange, impl: exchangeImplAddress} = await deployProxy("Exchange", "contracts/exchange/v3/Exchange.sol:Exchange", contractArgs, overrides, {});


  // 4. Call addOperator on all proxies with exchange's address
  overrides = { gasLimit: 1000000 };
  await erc20TransferProxy.addOperator(exchange.address, overrides);
  await transferProxy.addOperator(exchange.address, overrides);
  await erc721GlipLazyMintTransferProxy.addOperator(exchange.address, overrides);
  await erc1155GlipLazyMintTransferProxy.addOperator(exchange.address, overrides);


  // 5. Call setTransferProxy on exchange with bytes4 of different asset classes bytes4(keccak256("ETH")) with each proxy's address
  overrides = { gasLimit: 1000000 };
  await exchange.setTransferProxy(ERC721_LAZY, erc721GlipLazyMintTransferProxy.address, overrides);
  await exchange.setTransferProxy(ERC1155_LAZY, erc1155GlipLazyMintTransferProxy.address, overrides);

  console.log("setTransferProxy : ERC1155_LAZY", await exchange.proxies(ERC1155_LAZY));
  console.log("setTransferProxy : ERC721_LAZY", await exchange.proxies(ERC721_LAZY));

  // await exchange.setTransferProxy(ERC721_LAZY, erc721GlipLazyMintTransferProxyAddress, overrides);
  // await exchange.setTransferProxy(ERC1155_LAZY, erc1155GlipLazyMintTransferProxyAddress, overrides);


  // 6. Deploy RoyaltyForwarder implementation
  overrides = { gasLimit: 5000000 };
  var royaltyForwarder = await deploy("RoyaltyForwarder", "contracts/tokens/RoyaltyForwarder.sol:RoyaltyForwarder",[], overrides);



  // 7. Deploy MinterUpgradeable with minter EOA address, _fee 0, minDefaultMinterRoyalty 0, RoyaltyForwarder.address,  EIP712Forwarder.address
  const backendMinter = "0xF1b6fceac6784a26360056973C41e0017DeE12e4";
  const backendMintingFee = 0;
  const defaultMinterRoyalty = 0;
  contractArgs = [backendMinter, backendMintingFee, defaultMinterRoyalty, royaltyForwarder.address, eip712Forwarder.address];
  overrides = { initializer: '__MinterUpgradable_init', timeout: 0, unsafeAllow: ["delegatecall"] }; // gasLimit: 2500000, //  unsafeAllow: ["delegatecall"]
  var {proxy: minterUpgradeable, impl: minterUpgradeableImplAddress} = await deployProxy("MinterUpgradeable", "contracts/roles/MinterUpgradeable.sol:MinterUpgradeable", contractArgs, overrides, {});



  // 8. Deploy ERC721GlipLive, ERC1155GlipPass and ERC1155OpenGlip beacons
  const assetContractOwnerAddress = "0xF1b6fceac6784a26360056973C41e0017DeE12e4";
  let overrides1 =  {timeout: 0, unsafeAllow: ["delegatecall"]}; // unsafeAllow: ["delegatecall"],
  let overrides2 = { initializer: '__ERC721GlipLive_init', timeout: 0, unsafeAllow: ["delegatecall"] };
  contractArgs = ["GlipLive", "GLV", false, "https://be.namasteapis.com/metadata/v1/live/", "", transferProxy.address, erc721GlipLazyMintTransferProxy.address, minterUpgradeable.address, eip712Forwarder.address];
  var  {beacon: erc721GlipLiveBeacon, beaconImpl: glipLiveBeaconImplAddress} = await deployTokenBeaconAndBeaconProxy("ERC721GlipLive", "contracts/tokens/meta-tokens/ERC721GlipLive.sol:ERC721GlipLive", assetContractOwnerAddress, contractArgs, overrides1, overrides2, {});


  overrides1 =  {timeout: 0, unsafeAllow: ["delegatecall"]}; // unsafeAllow: ["delegatecall"],
  overrides2 = { initializer: '__ERC1155GlipPass_init', timeout: 0, unsafeAllow: ["delegatecall"] };
  contractArgs = ["GlipPass", "GLP", false, "https://be.namasteapis.com/metadata/v1/pass/", "", transferProxy.address, erc1155GlipLazyMintTransferProxy.address, minterUpgradeable.address, eip712Forwarder.address];
  var  {beacon: erc1155GlipPassBeacon, beaconImpl: glipPassBeaconImplAddress} = await deployTokenBeaconAndBeaconProxy("ERC1155GlipPass", "contracts/tokens/meta-tokens/ERC1155GlipPass.sol:ERC1155GlipPass", assetContractOwnerAddress, contractArgs, overrides1, overrides2, {});

  let transferProxyAddress = transferProxy.address;
  let erc1155GlipLazyMintTransferProxyAddress = erc1155GlipLazyMintTransferProxy.address;
  let minterUpgradeableAddress = minterUpgradeable.address;
  let eip712ForwarderAddress = eip712Forwarder.address;

  // Overrides from previous deployment
  // let transferProxyAddress = deployed["transferProxy"];
  // let erc1155GlipLazyMintTransferProxyAddress = deployed["erc1155GlipLazyMintTransferProxy"];
  // let minterUpgradeableAddress = deployed["minterUpgradeable"];
  // let eip712ForwarderAddress = deployed["eip712Forwarder"];



  overrides1 =  {timeout: 0, unsafeAllow: ["delegatecall"]}; // unsafeAllow: ["delegatecall"],
  overrides2 = { initializer: '__ERC1155OpenGlip_init', timeout: 0, unsafeAllow: ["delegatecall"] };
  contractArgs = ["OpenGlip", "OGP", false, "https://be.namasteapis.com/metadata/v1/open/", "", transferProxyAddress, erc1155GlipLazyMintTransferProxyAddress, minterUpgradeableAddress, eip712ForwarderAddress];
  var  {beacon: erc1155OpenGlipBeacon, beaconImpl: openGlipBeaconImplAddress} = await deployTokenBeaconAndBeaconProxy("ERC1155OpenGlip", "contracts/tokens/meta-tokens/ERC1155OpenGlip.sol:ERC1155OpenGlip", assetContractOwnerAddress, contractArgs, overrides1, overrides2, {});



  // 9. Deploy ERC721GlipLiveFactoryC2, ERC1155GlipPassFactoryC2 and ERC1155OpenGlipFactoryC2 with beacon, TransferProxy.address, ERC721GlipLazyMintTransferProxy/ERC1155GlipLazyMintTransferProxy.address, address MinterUpgradeable.address, RoyaltyForwarder.address

  contractArgs = [erc721GlipLiveBeacon.address, transferProxy.address, erc721GlipLazyMintTransferProxy.address, minterUpgradeable.address, eip712Forwarder.address];
  overrides = { gasLimit: 5000000 };
  var erc721GlipLiveFactoryC2 = await deploy("ERC721GlipLiveFactoryC2", "contracts/tokens/create-2/ERC721GlipLiveFactoryC2.sol:ERC721GlipLiveFactoryC2", contractArgs, overrides, {});
  addressArgs = ["GlipLive", "GLV", false, "https://be.namasteapis.com/metadata/v1/live/", "", 0];
  contractArgs = [assetContractOwnerAddress, ...addressArgs];
  await erc721GlipLiveFactoryC2.createToken(...contractArgs, overrides);
  var GlipLive1Address = await erc721GlipLiveFactoryC2.getAddress(...addressArgs);
  console.log("Deployed GlipLive1 to : ", GlipLive1Address.toString());

  contractArgs = [erc1155GlipPassBeacon.address, transferProxy.address, erc1155GlipLazyMintTransferProxy.address, minterUpgradeable.address, eip712Forwarder.address];
  overrides = { gasLimit: 5000000 };
  var erc1155GlipPassFactoryC2 = await deploy("ERC1155GlipPassFactoryC2", "contracts/tokens/create-2/ERC1155GlipPassFactoryC2.sol:ERC1155GlipPassFactoryC2", contractArgs, overrides, {});
  addressArgs = ["GlipPass", "GLP", false, "https://be.namasteapis.com/metadata/v1/pass/", "", 0];
  contractArgs = [assetContractOwnerAddress, ...addressArgs];
  await erc1155GlipPassFactoryC2.createToken(...contractArgs, overrides);
  var GlipPass1Address = await erc1155GlipPassFactoryC2.getAddress(...addressArgs);
  console.log("Deployed GlipPass1 to : ", GlipPass1Address.toString());

  contractArgs = [erc1155OpenGlipBeacon.address, transferProxyAddress, erc1155GlipLazyMintTransferProxyAddress, minterUpgradeableAddress, eip712ForwarderAddress];
  overrides = { gasLimit: 5000000 };
  var erc1155OpenGlipFactoryC2 = await deploy("ERC1155OpenGlipFactoryC2", "contracts/tokens/create-2/ERC1155OpenGlipFactoryC2.sol:ERC1155OpenGlipFactoryC2", contractArgs, overrides, {});
  addressArgs = ["OpenGlip", "OGP", false, "https://be.namasteapis.com/metadata/v1/open/", "", 0];
  contractArgs = [assetContractOwnerAddress, ...addressArgs];
  await erc1155OpenGlipFactoryC2.createToken(...contractArgs, overrides);
  var OpenGlip1Address = await erc1155OpenGlipFactoryC2.getAddress(...addressArgs);
  console.log("Deployed OpenGlip1 to : ", OpenGlip1Address.toString());

  // let erc20TransferProxyAddress = "0x95401dc811bb5740090279Ba06cfA8fcF6113778";

  // 10. Deploy test ERC20 coins
  contractArgs = [erc20TransferProxy.address];
  overrides = { gasLimit: 5000000 };
  var testERC20 = await deploy("Test1ERC20", "contracts/tokens/Test1ERC20.sol:Test1ERC20", contractArgs, overrides, {});
  console.log("Deployed TestERC20 to : ", testERC20.address);

  console.log();

  console.log(
    " 💾  Artifacts (address, abi, and args) saved to: ",
    chalk.blue(`packages/hardhat/artifacts/${defaultNetwork}/`),
    "\n\n"
  );

  const curr = (new Date()).toLocaleDateString();

  const allContracts = {
    chain: defaultNetwork,
    deploymentTime: curr,
    eip712Forwarder: eip712Forwarder.address,
    erc20TransferProxy: erc20TransferProxy.address,
    transferProxy: transferProxy.address,
    erc721GlipLazyMintTransferProxy: erc721GlipLazyMintTransferProxy.address,
    erc1155GlipLazyMintTransferProxy: erc1155GlipLazyMintTransferProxy.address,
    exchange: exchange.address,
    exchangeImplAddress: exchangeImplAddress,
    royaltyForwarder: royaltyForwarder.address,
    minterUpgradeable: minterUpgradeable.address,
    minterUpgradeableImplAddress: minterUpgradeableImplAddress,
    erc721GlipLiveBeacon: erc721GlipLiveBeacon.address,
    glipLiveBeaconImplAddress: glipLiveBeaconImplAddress,
    erc1155GlipPassBeacon: erc1155GlipPassBeacon.address,
    glipPassBeaconImplAddress: glipPassBeaconImplAddress,
    erc1155OpenGlipBeacon: erc1155OpenGlipBeacon.address,
    openGlipBeaconImplAddress: openGlipBeaconImplAddress,
    erc721GlipLiveFactoryC2: erc721GlipLiveFactoryC2.address,
    GlipLive1Address: GlipLive1Address,
    erc1155GlipPassFactoryC2: erc1155GlipPassFactoryC2.address,
    GlipPass1Address: GlipPass1Address,
    erc1155OpenGlipFactoryC2: erc1155OpenGlipFactoryC2.address,
    OpenGlip1Address: OpenGlip1Address,
    testERC20Address: testERC20.address
  }

  console.log(allContracts);

  await sleep(verificationLag);

};




const deploy = async (contractName, path, _args = [], overrides = {}, libraries = {}) => {


    while (true) {

        try {
            console.log(` 🛰  Deploying: ${contractName}`);
            var contractArgs = _args || [];

            const contractArtifacts = await ethers.getContractFactory(contractName);
            const deployed = await contractArtifacts.deploy(...contractArgs, overrides);
            const box = deployed;
            await box.deployed();
            console.log("Box deployed to:", box.address);
            writeFileRecursive(`artifacts/${defaultNetwork}/${contractName}.address`, deployed.address);

            let extraGasInfo = ""
            var gasLimit;
            if(box&&box.deployTransaction){
            gasLimit = deployed.deployTransaction.gasLimit;
            const gasUsed = box.deployTransaction.gasLimit.mul(box.deployTransaction.gasPrice)
            extraGasInfo = `${utils.formatEther(gasUsed)} ETH, tx hash ${box.deployTransaction.hash}`
            }

            console.log(
                " 📄",
                chalk.cyan(contractName),
                "deployed to:",
                chalk.magenta(box.address)
            );
            console.log(
                " ⛽",
                chalk.grey(extraGasInfo)
            );
            console.log(" GAS units : ", gasLimit.toNumber());

            await tenderly.persistArtifacts({
                name: contractName,
                address: box.address
            });

            const cmdArgs = contractArgs.join(' ');

            await sleep(verificationLag);
            // Verifying contract
            console.log("Verifying contract");
            exec(`npx hardhat verify --contract ${path} --network ${defaultNetwork} ${box.address} ${cmdArgs}`, (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
            });
            return box;
        } catch (error) {
            console.log(error);
        }
        
    }

    

}


const deployProxy = async (contractName, path, _args = [], overrides = {}, libraries = {}) => {

    while(true) {

        try {
            console.log(` 🛰  Deploying: ${contractName}`);
    
            let contractArgs = _args || [];
            
        
            const Box = await ethers.getContractFactory(contractName);
            const box = await upgrades.deployProxy(Box, contractArgs, overrides); // unsafeAllowCustomTypes:true
            await box.deployed();
            console.log("Box deployed to:", box.address);
        
            const deployed = box;


            const implAddress = await upgrades.erc1967.getImplementationAddress(box.address);
            console.log("Implementation is here : ", implAddress);
        
            writeFileRecursive(`artifacts/${defaultNetwork}/${contractName}.address`, deployed.address);
            writeFileRecursive(`artifacts/${defaultNetwork}/${contractName}.impl.address`, implAddress);
        
            let extraGasInfo = ""
            var gasLimit;
            if(deployed&&deployed.deployTransaction){
            gasLimit = deployed.deployTransaction.gasLimit;
            const gasUsed = deployed.deployTransaction.gasLimit.mul(deployed.deployTransaction.gasPrice)
            extraGasInfo = `${utils.formatEther(gasUsed)} ETH, tx hash ${deployed.deployTransaction.hash}`
            }
        
            console.log(
            " 📄",
            chalk.cyan(contractName),
            "deployed to:",
            chalk.magenta(deployed.address)
            );
            console.log(
            " ⛽",
            chalk.grey(extraGasInfo)
            );
            console.log(" GAS units : ", gasLimit.toNumber());
        
            await tenderly.persistArtifacts({
            name: contractName,
            address: deployed.address
            });
        
            await sleep(verificationLag);
            console.log("Verifying contract");

        
            exec(`npx hardhat verify --contract ${path} --network ${defaultNetwork} ${implAddress}`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            });
        
            return {proxy: box, impl: implAddress};
        } catch (error) {
            console.log(error);
        }

    }
    
  };



const deployTokenBeaconAndBeaconProxy = async (contractName, path, passContractOwner, _args = [], overrides1 = {}, overrides2 = {}, libraries = {}) => {
    
    while (true) {

        try {

            console.log(` 🛰  Deploying: ${contractName}`);
    
            const contractArgs = _args || [];
        
            const Box = await ethers.getContractFactory(contractName);
        
            const beacon = await upgrades.deployBeacon(Box, overrides1);
            await beacon.deployed();
            const beaconImplAddress = await upgrades.beacon.getImplementationAddress(beacon.address);
            console.log("Beacon deployed to:", beacon.address);
            console.log("Beacon implemented at:", beaconImplAddress );
            
        
            // const box = await upgrades.deployBeaconProxy(beacon, Box, contractArgs, overrides2);
            // await box.deployed();
            // console.log("Box deployed to:", box.address);

            // await sleep(10000);

            // console.log(await box.owner());

            // console.log("Transferring ownership to backend owner account");
            // console.log(passContractOwner);
            // await box.transferOwnership(passContractOwner);

            // console.log("New owner : ", await box.owner());
        

            const deployed = beacon;
        
            writeFileRecursive(`artifacts/${defaultNetwork}/${contractName}.beacon.address`, beacon.address);
            writeFileRecursive(`artifacts/${defaultNetwork}/${contractName}.impl.address`, beaconImplAddress);
            // writeFileRecursive(`artifacts/${defaultNetwork}/${contractName}.address`, box.address);
        
            let extraGasInfo = ""
            if(deployed&&deployed.deployTransaction){
            const gasUsed = deployed.deployTransaction.gasLimit.mul(deployed.deployTransaction.gasPrice)
            extraGasInfo = `${utils.formatEther(gasUsed)} ETH, tx hash ${deployed.deployTransaction.hash}`
            }
        
            console.log(
            " 📄",
            chalk.cyan(contractName),
            "deployed to:",
            chalk.magenta(deployed.address)
            );
            console.log(
            " ⛽",
            chalk.grey(extraGasInfo)
            );
        
            await tenderly.persistArtifacts({
            name: contractName,
            address: deployed.address
            });
        
            await sleep(verificationLag);
            // Verifying contract
            console.log("Verifying contract");
            exec(`npx hardhat verify --contract ${path} --network ${defaultNetwork} ${beaconImplAddress}`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            });
        
            return {beacon: beacon, beaconImpl: beaconImplAddress};
            
        } catch (error) {
            console.log(error);
        }
        
    }
    
    
  };



// ------ utils -------

// function id(str) {
// 	// return `${ethers.utils.keccak256(ethers.utils.formatBytes32String(str)).toString("hex").substring(0, 10)}`;
//     // return `0x${ethUtil.keccak256(str).toString("hex").substring(0, 8)}`;
//     return `0x${ethUtil.keccak256(Buffer.from(str, 'hex') ).toString("hex").substring(0, 8)}`;
// }

const id = (str) => {
	return ethers.utils.solidityKeccak256( ["string"] , [str] ).substring(0, 10);
	// return `0x${ethUtil.keccak256(Buffer.from(str, 'hex')).toString("hex").substring(0, 8)}`;
}

function enc(token, tokenId) {
	if (tokenId) {
		return web3.eth.abi.encodeParameters(["address", "uint256"], [token, tokenId]);
	} else {
		return web3.eth.abi.encodeParameter("address", token);
	}
}

const ETH = id("ETH");
const ERC20 = id("ERC20");
const ERC721 = id("ERC721");
const ERC721_LAZY = id("ERC721_LAZY");
const ERC1155 = id("ERC1155");
const ERC1155_LAZY = id("ERC1155_LAZY");
const COLLECTION = id("COLLECTION");
const CRYPTO_PUNKS = id("CRYPTO_PUNKS");
const ORDER_DATA_V1 = id("V1");
const ORDER_DATA_V2 = id("V2");
const TO_MAKER = id("TO_MAKER");
const TO_TAKER = id("TO_TAKER");
const PROTOCOL = id("PROTOCOL");
const ROYALTY = id("ROYALTY");
const ORIGIN = id("ORIGIN");
const PAYOUT = id("PAYOUT");

console.log("ETH : ", ETH);
console.log("ERC20 : ", ERC20);
console.log("ERC721_LAZY : ", ERC721_LAZY);
console.log("ERC1155_LAZY : ", ERC1155_LAZY);




const writeFileRecursive = (file, data) => {
  const dirname = path.dirname(file);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
  fs.writeFileSync(file, data);
};

// abi encodes contract arguments
// useful when you want to manually verify the contracts
// for example, on Etherscan
const abiEncodeArgs = (deployed, contractArgs) => {
  // not writing abi encoded args if this does not pass
  if (
    !contractArgs ||
    !deployed ||
    !R.hasPath(["interface", "deploy"], deployed)
  ) {
    return "";
  }
  const encoded = utils.defaultAbiCoder.encode(
    deployed.interface.deploy.inputs,
    contractArgs
  );
  return encoded;
};

// checks if it is a Solidity file
const isSolidity = (fileName) =>
  fileName.indexOf(".sol") >= 0 && fileName.indexOf(".swp") < 0 && fileName.indexOf(".swap") < 0;

const readArgsFile = (contractName) => {
  let args = [];
  try {
    const argsFile = `./contracts/${contractName}.args`;
    if (!fs.existsSync(argsFile)) return args;
    args = JSON.parse(fs.readFileSync(argsFile));
  } catch (e) {
    console.log(e);
  }
  return args;
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// If you want to verify on https://tenderly.co/
const tenderlyVerify = async ({contractName, contractAddress}) => {

  let tenderlyNetworks = ["kovan","goerli","mainnet","rinkeby","ropsten","matic","mumbai","xDai","POA"]
  let targetNetwork = process.env.HARDHAT_NETWORK || config.defaultNetwork

  if(tenderlyNetworks.includes(targetNetwork)) {
    console.log(chalk.blue(` 📁 Attempting tenderly verification of ${contractName} on ${targetNetwork}`))

    await tenderly.persistArtifacts({
      name: contractName,
      address: contractAddress
    });

    let verification = await tenderly.verify({
        name: contractName,
        address: contractAddress,
        network: targetNetwork
      })

    return verification
  } else {
      console.log(chalk.grey(` 🧐 Contract verification not supported on ${targetNetwork}`))
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });








