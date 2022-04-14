/* eslint no-use-before-define: "warn" */
const fs = require("fs");
const chalk = require("chalk");
const { config, ethers, tenderly, run, upgrades } = require("hardhat");
const { utils } = require("ethers");
const R = require("ramda");
var path = require('path');
const { exec } = require("child_process");
const {defaultNetwork} = require("./../hardhat.config");

verificationLag = 80000;

const main = async () => {

  console.log("\n\n 📡 Deploying...\n");

  // // PAYMENT SPLITTER
  var overrides = { gasLimit: 250000000000 };
  const splitterImplementationContract = await deployPaymentSplitter("SplitPayments", [], {});

  // MANUAL OVERRIDES
  // const splitterImplementationContract = "0xe8Eb78bA59A52d498403D614379d56B331c3A099";

  // AUCTIONEER CONTRACT
  // https://forum.openzeppelin.com/t/problem-in-upgrades-plugins-for-users-of-unsafeallowcustomtypes/5066
  const auctioneer = "0xF1b6fceac6784a26360056973C41e0017DeE12e4";
  const auctioneerFee = 100;
  var contractArgs = [auctioneer, auctioneerFee];
  overrides = { initializer: '__AuctioneerUpgradable_init', unsafeAllow: ["delegatecall"]  };
  var {proxy: auctioneerProxy, impl: auctioneerImpl} = await deployAuctioneer("AuctioneerUpgradable", contractArgs, overrides, {});

  // MINTER CONTRACT
  // https://forum.openzeppelin.com/t/problem-in-upgrades-plugins-for-users-of-unsafeallowcustomtypes/5066
  const minter = "0xF1b6fceac6784a26360056973C41e0017DeE12e4";
  const minterFee = 100;
  const defaultRoyalty = 250;
  contractArgs = [minter, minterFee, defaultRoyalty, splitterImplementationContract];
  overrides = { initializer: '__MinterUpgradable_init', unsafeAllow: ["delegatecall"], timeout: 0};
  var {proxy: minterProxy, impl: minterImpl} = await deployMinter ("MinterUpgradeable", contractArgs, overrides, {});

  // MANUAL OVERRIDES
  // const auctioneerProxy = "0x5030A19FA7F26046d74E89b56e33d2D719d7fF0c";
  // const minterProxy = "0x786F46f847402b8794e8d01238A1F0824718b0C3";

  
  // AUCTION CONTRACT
  const platformFee = 100;
  contractArgs = [platformFee, auctioneerProxy];
  overrides = { initializer: '__Auction_init', unsafeAllow: ["delegatecall"], timeout: 0 }; // gasLimit: 2500000,
  var {proxy: auctionProxy, impl: auctionImpl} = await deployAuction ("Auction", contractArgs, overrides, {});

  

  // BEACON and GLOBAL PROXY CONTRACT
  let overrides1 =  {unsafeAllow: ["delegatecall"], timeout: 0};
  let overrides2 = { initializer: '__ERC721GlipLive_init', timeout: 0 };
  contractArgs = ["Glip", "GLIP", true, "ipfs://", "", auctionProxy, minterProxy];
  var {beacon: assetBeacon, beaconImpl: assetBeaconImpl, proxy1: globalAssetProxy} = await deployTokenBeaconAndBeaconProxy("ERC721GlipLive", contractArgs, overrides1, overrides2, {});
  
  // // MANUAL STEPS UGGGHHH
  // var assetBeacon = "0xf78bF34244760090Be0D171E709E3286F9522262"
  // var auctionProxy = "0x187c2cbF294038184fea3C08D20A059e89E73217";
  // var minterProxy = "0x0738Af5a0e85196f3c16A11741265Be39C714290"
  
  // FACTORY CONTRACT
  contractArgs = [assetBeacon, auctionProxy, minterProxy];
  var overrides = { gasLimit: 100000 };
  var factoryAddress = await deployTokensFactory ("ERC721GlipLiveFactoryC2", contractArgs, {}, {});


  // MANUAL OVERRIDES

  // TEST-PROXY CONTRACT
  overrides = { initializer: '__ERC721GlipLive_init', timeout: 0};
  contractArgs = ["Glip", "GLIP", true, "ipfs://", "", auctionProxy, minterProxy];
  const testTokenBeaconProxy = await deployTokenBeaconProxy ("ERC721GlipLive", assetBeacon, contractArgs, overrides, {})


  console.log(
    " 💾  Artifacts (address, abi, and args) saved to: ",
    chalk.blue(`packages/hardhat/artifacts/${defaultNetwork}/`),
    "\n\n"
  );
};

const deployPaymentSplitter = async (contractName, _args = [], overrides = {}, libraries = {}) => {
    
    
    console.log(` 🛰  Deploying: ${contractName}`);

  let contractArgs = _args || [];
  
  const contractArtifacts = await ethers.getContractFactory(contractName);
  const deployed = await contractArtifacts.deploy(...contractArgs, overrides);
  console.log(deployed);

  console.log(deployed.address);

  await deployed.deployed();

  
  writeFileRecursive(`artifacts/${defaultNetwork}/${contractName}.address`, deployed.address);

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

  // Verifying contract
  console.log("Verifying contract");
  exec(`npx hardhat verify --contract contracts/tokens/SplitPayments.sol:SplitPayments --network ${defaultNetwork} ${deployed.address}`, (error, stdout, stderr) => {
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

  return deployed.address;
};

const deployAuctioneer = async (contractName, _args = [], overrides = {}, libraries = {}) => {
    console.log(` 🛰  Deploying: ${contractName}`);
    
    let contractArgs = _args || [];
    
  
    const Box = await ethers.getContractFactory(contractName);
    const box = await upgrades.deployProxy(Box, contractArgs, overrides); // unsafeAllowCustomTypes:true
    await box.deployed();
    console.log("Box deployed to:", box.address);
  
    const deployed = box;
  
    console.log("What is going on here");
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
  
    exec(`npx hardhat verify --contract contracts/roles/AuctioneerUpgradable.sol:AuctioneerUpgradable --network ${defaultNetwork} ${implAddress}`, (error, stdout, stderr) => {
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
  
    return {proxy: box.address, impl: implAddress};
  };

const deployMinter = async (contractName, _args = [], overrides = {}, libraries = {}) => {
  console.log(` 🛰  Deploying: ${contractName}`);
  

  let contractArgs = _args || [];
  
  const Box = await ethers.getContractFactory(contractName);
  const box = await upgrades.deployProxy(Box, contractArgs, overrides); // unsafeAllowCustomTypes:true
  await box.deployed();
  console.log("Box deployed to:", box.address);

  const deployed = box;

  console.log("What is going on here");
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
  // Verifying contract
  console.log("Verifying contract");
  exec(`npx hardhat verify --contract contracts/roles/MinterUpgradeable.sol:MinterUpgradeable --network ${defaultNetwork} ${implAddress}`, (error, stdout, stderr) => {
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

  return {proxy: box.address, impl: implAddress};
};

const deployAuction = async (contractName, _args = [], overrides = {}, libraries = {}) => {
    console.log(` 🛰  Deploying: ${contractName}`);

  
    const contractArgs = _args || [];
  
    const Box = await ethers.getContractFactory(contractName);
    const box = await upgrades.deployProxy(Box, contractArgs, overrides);
    await box.deployed();
    console.log("Box deployed to:", box.address);
    
    const implAddress = await upgrades.erc1967.getImplementationAddress(box.address);
  
    console.log("What is going on here");
    console.log("Implementation is here : ", implAddress);
  
    const deployed = box;
      
    writeFileRecursive(`artifacts/${defaultNetwork}/${contractName}.address`, box.address);
    writeFileRecursive(`artifacts/${defaultNetwork}/${contractName}.impl.address`, implAddress);
  
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
    await sleep(verificationLag);
    // Verifying contract
    console.log("Verifying contract");
    exec(`npx hardhat verify --contract contracts/exchange/Auction.sol:Auction --network ${defaultNetwork} ${implAddress}`, (error, stdout, stderr) => {
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
  
    return {proxy: box.address, impl: implAddress};
  };

const deployTokenBeaconAndBeaconProxy = async (contractName, _args = [], overrides1 = {}, overrides2 = {}, libraries = {}) => {
    console.log(` 🛰  Deploying: ${contractName}`);
  
    
    const contractArgs = _args || [];
  
  
    const Box = await ethers.getContractFactory(contractName);
  
    const beacon = await upgrades.deployBeacon(Box, overrides1);
    await beacon.deployed();
    const beaconImplAddress = await upgrades.beacon.getImplementationAddress(beacon.address);
    console.log("Beacon deployed to:", beacon.address);
    console.log("Beacon implemented at:", beaconImplAddress );
    
  
    const box = await upgrades.deployBeaconProxy(beacon, Box, contractArgs, overrides2);
    await box.deployed();
    console.log("Box deployed to:", box.address);
  

    const deployed = box;
  
    writeFileRecursive(`artifacts/${defaultNetwork}/${contractName}.beacon.address`, beacon.address);
    writeFileRecursive(`artifacts/${defaultNetwork}/${contractName}.impl.address`, beaconImplAddress);
    writeFileRecursive(`artifacts/${defaultNetwork}/${contractName}.address`, box.address);
  
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
    exec(`npx hardhat verify --contract contracts/tokens/erc-721/ERC721GlipLive.sol:ERC721GlipLive --network ${defaultNetwork} ${beaconImplAddress}`, (error, stdout, stderr) => {
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
  
    return {beacon: beacon.address, beaconImpl: beaconImplAddress, proxy1: box.address};
  };


const deployTokensFactory = async (contractName, _args = [], overrides = {}, libraries = {}) => {
    console.log(` 🛰  Deploying: ${contractName}`);
  
    var contractArgs = _args || [];
  
    const contractArtifacts = await ethers.getContractFactory(contractName);
    const deployed = await contractArtifacts.deploy(...contractArgs, overrides);
    const box = deployed;
  
    await box.deployed();
    console.log("Box deployed to:", box.address);
  
  
    console.log("What is going on here");
  
  
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
    await sleep(verificationLag);
    // Verifying contract
    console.log("Verifying contract");
    exec(`npx hardhat verify --contract contracts/tokens/create-2/ERC721GlipLiveFactoryC2.sol:ERC721GlipLiveFactoryC2 --network ${defaultNetwork} ${box.address} ${contractArgs[0]} ${contractArgs[1]} ${contractArgs[2]}`, (error, stdout, stderr) => {
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
    
    
    return box.address;
  };

  const deployTokenBeaconProxy = async (contractName, beaconAddress, _args = [], overrides = {}, libraries = {}) => {
    console.log(` 🛰  Deploying: ${contractName}`);
  
    const Box = await ethers.getContractFactory(contractName);
    const contractArgs = _args || [];

    const box = await upgrades.deployBeaconProxy(beaconAddress, Box, contractArgs, overrides);
    await box.deployed();
    console.log("Box deployed to:", box.address);
  
    
    const deployed = box;
  
    writeFileRecursive(`artifacts/${defaultNetwork}/${contractName}.proxytest.address`, deployed.address);
  
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
  
    return box.address;
  };

// ------ utils -------


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
