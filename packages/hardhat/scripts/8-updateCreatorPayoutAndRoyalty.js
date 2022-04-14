/* eslint no-use-before-define: "warn" */
const fs = require("fs");
const chalk = require("chalk");
const { config, ethers, tenderly, run, upgrades } = require("hardhat");
const { utils } = require("ethers");
const R = require("ramda");
const { exec } = require("child_process");
// scripts/create-box.js

const main = async () => {

  console.log("\n\n 📡 Deploying...\n");


  const yourCollectible = await deploy("MinterUpgradeable") // <-- add in constructor args like line 19 vvvv
  

  console.log(
    " 💾  Artifacts (address, abi, and args) saved to: ",
    chalk.blue("packages/hardhat/artifacts/"),
    "\n\n"
  );
};

const deploy = async (contractName, _args = [], overrides = {}, libraries = {}) => {
  console.log(` 🛰  Deploying: ${contractName}`);

  
  // https://forum.openzeppelin.com/t/problem-in-upgrades-plugins-for-users-of-unsafeallowcustomtypes/5066
  
  const minterAddress = "0x938e59978F1c0647d7373f0263F2f127D69A2391";


  const assetContractAddress = "0x7b08Fc0AFC74a1aD1a2475Fa8063B14CeaB2A925";
  
  const Box = await ethers.getContractFactory(contractName);
  const minter = await (await ethers.getContractFactory(contractName)).attach(minterAddress);

  // Set default royalty
  const resp = await minter.upsertDefaultCreatorPayoutsAndRoyalties({
    creator: "0xC7b4240e35feF032E68612Be497f06d9Fd421CF4",
    token: assetContractAddress,
    creators: [{account: "0xC7b4240e35feF032E68612Be497f06d9Fd421CF4", value: 7000}, {account: "0x5b1E16CcfC1168f1B4CD1a22be184db59A01EB30", value: 3000} ],
    royalties: [{account: "0x8E46D66bCAbAb488658B9113e0Cbdb1E08a57fE5", value: 300}, {account: "0xFb2115DFe72Fd2d87c95D303eDc75A07e7986460", value: 200}, {account: minterAddress, value: 200} ],
    });

    console.log(resp);

  return Box;
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
