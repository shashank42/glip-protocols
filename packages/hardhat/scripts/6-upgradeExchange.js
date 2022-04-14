/* eslint no-use-before-define: "warn" */
const fs = require("fs");
const chalk = require("chalk");
const { config, ethers, tenderly, run, upgrades } = require("hardhat");
const { utils } = require("ethers");
const R = require("ramda");
// scripts/create-box.js

const main = async () => {

  console.log("\n\n 📡 Deploying...\n");


  const yourCollectible = await deploy("Auction", "0x2ca1f28BD3974089DABb60ea64109174a6fc1088"); // <-- add in constructor args like line 19 vvvv

  console.log(
    " 💾  Artifacts (address, abi, and args) saved to: ",
    chalk.blue("packages/hardhat/artifacts/"),
    "\n\n"
  );
};

const deploy = async (contractName, proxyContractAddress, _args = [], overrides = {}, libraries = {}) => {
  console.log(` 🛰  Deploying: ${contractName}`);

  // https://github.com/OpenZeppelin/openzeppelin-upgrades/blob/6e5e7a439cf8918dc57ce39a7dbb03a3475eaf88/packages/plugin-hardhat/test/uups-happy-path.js#L21  
  
  console.log(contractName, proxyContractAddress);
  const BoxV2 = await ethers.getContractFactory(contractName);
  const upgraded = await upgrades.upgradeProxy(proxyContractAddress, BoxV2);
  await upgraded.deployed();


  console.log("Implementation is here : ", await upgrades.erc1967.getImplementationAddress(upgraded.address));
  

//   const upgraded = greeter2;
  fs.writeFileSync(`artifacts/${contractName+"Upgraded"}.address`, upgraded.address);

  let extraGasInfo = ""
  if(upgraded&&upgraded.deployTransaction){
    gasUsed = upgraded.deployTransaction.gasLimit.mul(upgraded.deployTransaction.gasPrice)
    extraGasInfo = `${utils.formatEther(gasUsed)} ETH, tx hash ${upgraded.deployTransaction.hash}`
  }

  console.log(
    " 📄",
    chalk.cyan(contractName),
    "upgraded to:",
    chalk.magenta(upgraded.address)
  );
  console.log(
    " ⛽",
    chalk.grey(extraGasInfo)
  );

  console.log("Implementation is here : ", await upgrades.erc1967.getImplementationAddress(proxyContractAddress));
  


  return upgraded;
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
