/* eslint no-use-before-define: "warn" */
const fs = require("fs");
const chalk = require("chalk");
const { config, ethers, tenderly, run, upgrades } = require("hardhat");
const { utils } = require("ethers");
const R = require("ramda");
const { exec } = require("child_process");
// scripts/create-box.js
// import { getImplementationAddress } from '@openzeppelin/upgrades-core';

const main = async () => {

  console.log("\n\n 📡 Deploying...\n");


  const yourCollectible = await deploy("Auction"); // <-- add in constructor args like line 19 vvvv
  

  console.log(
    " 💾  Artifacts (address, abi, and args) saved to: ",
    chalk.blue("packages/hardhat/artifacts/"),
    "\n\n"
  );
};

const deploy = async (contractName, _args = [], overrides = {}, libraries = {}) => {
  console.log(` 🛰  Deploying: ${contractName}`);

  // const contractArgs = [];
  // const contractArtifacts = await ethers.getContractFactory(contractName); //{libraries: libraries}
  // const deployed = await contractArtifacts.deploy(...contractArgs, overrides);

  const platformFee = 100;
  const auctioneer = "0x8D1F5AbA5F5455B0cE7b0f8898ffa94f8388e42e";

  const contractArgs = [platformFee, auctioneer];

  const Box = await ethers.getContractFactory(contractName);
  const box = await upgrades.deployProxy(Box, contractArgs, { initializer: '__Auction_init', gasLimit: 2500000, unsafeAllow: ["delegatecall"] }); // unsafeAllowCustomTypes:true
  await box.deployed();
  console.log("Box deployed to:", box.address);


  console.log("What is going on here");
  console.log("Implementation is here : ", await upgrades.erc1967.getImplementationAddress(box.address));

  const implAddress = await upgrades.erc1967.getImplementationAddress(box.address);

  const deployed = box;
    
// const currentImplAddress = await getImplementationAddress(provider, proxyAddress);

  // const encoded = abiEncodeArgs(deployed, contractArgs);
  // console.log("Encoded args");

  fs.writeFileSync(`artifacts/${contractName}.address`, box.address);
  fs.writeFileSync(`artifacts/${contractName}.impl.address`, implAddress);

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

  // Verifying contract
  console.log("Verifying contract");
  exec(`npx hardhat verify --contract contracts/exchange/Auction.sol:Auction --network mumbai ${implAddress}`, (error, stdout, stderr) => {
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

  // if (!encoded || encoded.length <= 2) return deployed;
  // fs.writeFileSync(`artifacts/${contractName}.args`, encoded.slice(2));


  // Upgrading
  // const BoxV2 = await ethers.getContractFactory("Auction");
  // const upgraded = await upgrades.upgradeProxy(deployed.address, BoxV2);

  // console.log("Box upgraded to:", upgraded.address);
  // console.log("What is going on here");

  // // const encoded = abiEncodeArgs(deployed, contractArgs);
  // // console.log("Encoded args");

  // fs.writeFileSync(`artifacts/${contractName}.address`, upgraded.address);

  // // let extraGasInfo = ""
  // if(upgraded&&upgraded.deployTransaction){
  //   gasUsed = upgraded.deployTransaction.gasLimit.mul(upgraded.deployTransaction.gasPrice)
  //   extraGasInfo = `${utils.formatEther(gasUsed)} ETH, tx hash ${upgraded.deployTransaction.hash}`
  // }

  // console.log(
  //   " 📄",
  //   chalk.cyan(contractName),
  //   "upgraded to:",
  //   chalk.magenta(upgraded.address)
  // );
  // console.log(
  //   " ⛽",
  //   chalk.grey(extraGasInfo)
  // );



  return box;
};


// ------ utils -------

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
