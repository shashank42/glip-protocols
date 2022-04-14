/* eslint no-use-before-define: "warn" */
const fs = require("fs");
const chalk = require("chalk");
const { config, ethers, tenderly, run, upgrades } = require("hardhat");
const { utils } = require("ethers");
const R = require("ramda");
const {defaultNetwork} = require("./../hardhat.config");
var path = require('path');
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
  const beaconAddress = "0x2d81950C06ce54a15Aa278EF37Db8EF46Fa9D718";
  const exchangeProxy = "0xB9E6c76c1D481d9E80d1F31DfA5A3A1B8f1B0014";
  const defaultMinter = "0x3F1c3b42C73bE0D5f4bAFDC6d4383657EB102036";
  
  contractArgs = ["Glip", "GLIP", true, "ipfs:/", "", exchangeProxy, defaultMinter];
  // string memory _name, string memory _symbol, bool _global, string memory baseURI, string memory contractURI, address exchangeProxy, address defaultMinter

  const Box = await ethers.getContractFactory(contractName);

  

  const box = await upgrades.deployBeaconProxy(beaconAddress, Box, contractArgs, { initializer: '__ERC721GlipLive_init' });
  await box.deployed();
  console.log("Box deployed to:", box.address);

  
  const deployed = box;

  // fs.writeFileSync(`artifacts/${contractName+"BeaconProxyTest"}.address`, deployed.address);
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

  // if (!encoded || encoded.length <= 2) return deployed;
  // fs.writeFileSync(`artifacts/${contractName}.args`, encoded.slice(2));

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

const writeFileRecursive = (file, data) => {
  const dirname = path.dirname(file);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
  fs.writeFileSync(file, data);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
