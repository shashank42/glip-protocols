/* eslint no-use-before-define: "warn" */
const fs = require("fs");
const chalk = require("chalk");
const { config, ethers, tenderly, run, upgrades } = require("hardhat");
// const { hre } = require("hardhat");
const { utils } = require("ethers");
const R = require("ramda");
// scripts/create-box.js

const { exec } = require("child_process");



const main = async () => {

  console.log("\n\n 📡 Deploying...\n");


  const yourCollectible = await deploy("SplitPayments")

  console.log(
    " 💾  Artifacts (address, abi, and args) saved to: ",
    chalk.blue("packages/hardhat/artifacts/"),
    "\n\n"
  );
};

const deploy = async (contractName, _args = [], overrides = {}, libraries = {}) => {
  console.log(` 🛰  Deploying: ${contractName}`);

  let contractArgs = _args || [];
  
  const contractArtifacts = await ethers.getContractFactory(contractName);
  const deployed = await contractArtifacts.deploy(...contractArgs, overrides);

  
  fs.writeFileSync(`artifacts/${contractName}.address`, deployed.address);

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

  // Verifying contract
  console.log("Verifying contract");
  // await run("verify:verify", {
  //   address: implAddress,
  //   constructorArguments: [],
  // });

  exec(`npx hardhat verify --contract contracts/tokens/SplitPayments.sol:SplitPayments --network mumbai ${deployed.address}`, (error, stdout, stderr) => {
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

  return deployed;
};


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
