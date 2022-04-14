/* eslint no-use-before-define: "warn" */
const fs = require("fs");
const chalk = require("chalk");
const { config, ethers, tenderly, run, upgrades } = require("hardhat");
const { utils } = require("ethers");
const R = require("ramda");
// scripts/create-box.js

const main = async () => {

  console.log("\n\n 📡 Deploying...\n");


  const yourCollectible = await deploy("ERC721GlipLive") // <-- add in constructor args like line 19 vvvv

  console.log(
    " 💾  Artifacts (address, abi, and args) saved to: ",
    chalk.blue("packages/hardhat/artifacts/"),
    "\n\n"
  );
};

const deploy = async (contractName, _args = [], overrides = {}, libraries = {}) => {
  console.log(` 🛰  Deploying: ${contractName}`);

  
  // https://forum.openzeppelin.com/t/problem-in-upgrades-plugins-for-users-of-unsafeallowcustomtypes/5066
  const exchangeProxy = "0xcE92D18af7e5C5a1221f6b6C89d1A009C84F6999";
  const defaultMinter = "0x94be26EE932fdB8D266176B354342f5E57e77B2a";

  contractArgs = ["Glip", "GLIP", true, "ipfs:/", "", exchangeProxy, defaultMinter];


  const Box = await ethers.getContractFactory(contractName);

  const beacon = await upgrades.deployBeacon(Box, {unsafeAllow: ["delegatecall"]});
  await beacon.deployed();
  console.log("Beacon deployed to:", beacon.address);
  console.log("Beacon implemented at:", await upgrades.beacon.getImplementationAddress(beacon.address) );
  const beaconImplAddress = await upgrades.beacon.getImplementationAddress(beacon.address);

  const box = await upgrades.deployBeaconProxy(beacon, Box, contractArgs, { initializer: '__ERC721GlipLive_init' });
  await box.deployed();
  console.log("Box deployed to:", box.address);

//   await upgrades.getImplementationAddress(box.address)

  // const encoded = abiEncodeArgs(deployed, contractArgs);
  // console.log("Encoded args");
  const deployed = box;

  fs.writeFileSync(`artifacts/${contractName}.beacon.address`, beacon.address);
  fs.writeFileSync(`artifacts/${contractName}.impl.address`, beaconImplAddress);
  fs.writeFileSync(`artifacts/${contractName}.global-proxy.address`, box.address);

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

  // if (!encoded || encoded.length <= 2) return deployed;
  // fs.writeFileSync(`artifacts/${contractName}.args`, encoded.slice(2));

  // Verifying contract
  console.log("Verifying contract");
  exec(`npx hardhat verify --contract contracts/tokens/erc-721/ERC721GlipLive.sol:ERC721GlipLive --network mumbai ${beaconImplAddress}`, (error, stdout, stderr) => {
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

  return deployed;
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
