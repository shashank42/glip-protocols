/* eslint no-use-before-define: "warn" */
const fs = require("fs");
const chalk = require("chalk");
const { config, ethers, tenderly, run, upgrades } = require("hardhat");
const { utils } = require("ethers");
const R = require("ramda");
const { exec } = require("child_process");

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

  let contractArgs = _args || [];
  const contractArtifacts = await ethers.getContractFactory(contractName); //{libraries: libraries}
  const deployed = await contractArtifacts.deploy(...contractArgs, overrides);
  const box = deployed;

  console.log(await box.deployed());
  console.log("Box deployed to:", box.address);


  console.log("What is going on here");


  fs.writeFileSync(`artifacts/${contractName}NoProxy.address`, deployed.address);

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

  // Verifying contract
  console.log("Verifying contract");
  exec(`npx hardhat verify --contract contracts/tokens/erc-721/ERC721GlipLive.sol:ERC721GlipLive --network mumbai ${box.address}`, (error, stdout, stderr) => {
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

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
