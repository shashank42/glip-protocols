module.exports = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint96",
        "name": "fee",
        "type": "uint96"
      }
    ],
    "name": "MinDefaultMinterRoyalty",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "components": [
          {
            "internalType": "address payable",
            "name": "account",
            "type": "address"
          },
          {
            "internalType": "uint96",
            "name": "value",
            "type": "uint96"
          }
        ],
        "indexed": false,
        "internalType": "struct LibPart.Part[]",
        "name": "payees",
        "type": "tuple[]"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "splitterBytes",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "splitterAddress",
        "type": "address"
      }
    ],
    "name": "NewSplitter",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "RecievedRoyaltyPayment",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "minter",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint96",
        "name": "fee",
        "type": "uint96"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "active",
        "type": "bool"
      }
    ],
    "name": "UpsertDefaultMinter",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "components": [
          {
            "internalType": "address payable",
            "name": "account",
            "type": "address"
          },
          {
            "internalType": "uint96",
            "name": "value",
            "type": "uint96"
          }
        ],
        "indexed": false,
        "internalType": "struct LibPart.Part[]",
        "name": "creators",
        "type": "tuple[]"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "byOwner",
        "type": "bool"
      }
    ],
    "name": "UpsertDefaultPayouts",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "royaltyBytes",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "byOwner",
        "type": "bool"
      }
    ],
    "name": "UpsertDefaultRoyalties",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "minter",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "active",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "uint96",
        "name": "fee",
        "type": "uint96"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "cancelValue",
        "type": "uint256"
      }
    ],
    "name": "UpsertMinter",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "splitter",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "by",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "components": [
          {
            "internalType": "address payable",
            "name": "account",
            "type": "address"
          },
          {
            "internalType": "uint96",
            "name": "value",
            "type": "uint96"
          }
        ],
        "indexed": false,
        "internalType": "struct LibPart.Part[]",
        "name": "splits",
        "type": "tuple[]"
      }
    ],
    "name": "WithdrawStakedRoyalty",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "ERC1271_INTERFACE_ID",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "",
        "type": "bytes4"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "ERC1271_RETURN_INVALID_SIGNATURE",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "",
        "type": "bytes4"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "ERC1271_RETURN_VALID_SIGNATURE",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "",
        "type": "bytes4"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_minter",
        "type": "address"
      },
      {
        "internalType": "uint96",
        "name": "_fee",
        "type": "uint96"
      },
      {
        "internalType": "uint96",
        "name": "_minDefaultMinterRoyalty",
        "type": "uint96"
      },
      {
        "internalType": "address",
        "name": "_splitterImplementationContract",
        "type": "address"
      }
    ],
    "name": "__MinterUpgradable_init",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_token",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_minter",
        "type": "address"
      }
    ],
    "name": "cancelMinter",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "defaultPayoutMapping",
    "outputs": [
      {
        "internalType": "address payable",
        "name": "account",
        "type": "address"
      },
      {
        "internalType": "uint96",
        "name": "value",
        "type": "uint96"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "defaultRoyaltySplittersMapping",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "defaultsRegistry",
    "outputs": [
      {
        "internalType": "bool",
        "name": "active",
        "type": "bool"
      },
      {
        "internalType": "uint96",
        "name": "fee",
        "type": "uint96"
      },
      {
        "internalType": "uint256",
        "name": "cancelValue",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "start",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "end",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "depositBPS",
    "outputs": [
      {
        "internalType": "uint96",
        "name": "",
        "type": "uint96"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_minter",
        "type": "address"
      }
    ],
    "name": "getDefaultMinter",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      },
      {
        "components": [
          {
            "internalType": "bool",
            "name": "active",
            "type": "bool"
          },
          {
            "internalType": "uint96",
            "name": "fee",
            "type": "uint96"
          },
          {
            "internalType": "uint256",
            "name": "cancelValue",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "start",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "end",
            "type": "uint256"
          }
        ],
        "internalType": "struct MinterUpgradeable.DefaultMinter",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_minter",
        "type": "address"
      }
    ],
    "name": "getDefaultMinterFee",
    "outputs": [
      {
        "internalType": "uint96",
        "name": "",
        "type": "uint96"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_token",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_creator",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_signer",
        "type": "address"
      }
    ],
    "name": "getDetailsForMinting",
    "outputs": [
      {
        "internalType": "uint96",
        "name": "",
        "type": "uint96"
      },
      {
        "components": [
          {
            "internalType": "address payable",
            "name": "account",
            "type": "address"
          },
          {
            "internalType": "uint96",
            "name": "value",
            "type": "uint96"
          }
        ],
        "internalType": "struct LibPart.Part[]",
        "name": "",
        "type": "tuple[]"
      },
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      },
      {
        "components": [
          {
            "internalType": "address payable",
            "name": "account",
            "type": "address"
          },
          {
            "internalType": "uint96",
            "name": "value",
            "type": "uint96"
          }
        ],
        "internalType": "struct LibPart.Part",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_token",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_creator",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_signer",
        "type": "address"
      }
    ],
    "name": "getDetailsForRoyalty",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_token",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_creator",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_minter",
        "type": "address"
      }
    ],
    "name": "getMinter",
    "outputs": [
      {
        "components": [
          {
            "internalType": "bool",
            "name": "active",
            "type": "bool"
          },
          {
            "internalType": "uint96",
            "name": "fee",
            "type": "uint96"
          },
          {
            "internalType": "uint256",
            "name": "cancelValue",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "start",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "end",
            "type": "uint256"
          },
          {
            "components": [
              {
                "internalType": "address payable",
                "name": "account",
                "type": "address"
              },
              {
                "internalType": "uint96",
                "name": "value",
                "type": "uint96"
              }
            ],
            "internalType": "struct LibPart.Part[]",
            "name": "creators",
            "type": "tuple[]"
          },
          {
            "internalType": "bytes32",
            "name": "royalties",
            "type": "bytes32"
          }
        ],
        "internalType": "struct MinterUpgradeable.Minter",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "splitterBytes",
        "type": "bytes32"
      }
    ],
    "name": "getSplitter",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address payable",
            "name": "account",
            "type": "address"
          },
          {
            "internalType": "uint96",
            "name": "value",
            "type": "uint96"
          }
        ],
        "internalType": "struct LibPart.Part",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_hash",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "_signature",
        "type": "bytes"
      }
    ],
    "name": "isValidSignature",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "",
        "type": "bytes4"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "minDefaultMinterRoyalty",
    "outputs": [
      {
        "internalType": "uint96",
        "name": "",
        "type": "uint96"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "mintersRegistry",
    "outputs": [
      {
        "internalType": "bool",
        "name": "active",
        "type": "bool"
      },
      {
        "internalType": "uint96",
        "name": "fee",
        "type": "uint96"
      },
      {
        "internalType": "uint256",
        "name": "cancelValue",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "start",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "end",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "royalties",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "recieveRoyaltyStake",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint96",
        "name": "_minDefaultMinterRoyalty",
        "type": "uint96"
      }
    ],
    "name": "setMinDefaultMinterRoyalty",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_splitterImplementationContract",
        "type": "address"
      }
    ],
    "name": "setSplitterImplementationContract",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "splitterImplementationContract",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "splitters",
    "outputs": [
      {
        "internalType": "address payable",
        "name": "account",
        "type": "address"
      },
      {
        "internalType": "uint96",
        "name": "value",
        "type": "uint96"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "stake",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "creator",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "token",
            "type": "address"
          },
          {
            "components": [
              {
                "internalType": "address payable",
                "name": "account",
                "type": "address"
              },
              {
                "internalType": "uint96",
                "name": "value",
                "type": "uint96"
              }
            ],
            "internalType": "struct LibPart.Part[]",
            "name": "creators",
            "type": "tuple[]"
          },
          {
            "components": [
              {
                "internalType": "address payable",
                "name": "account",
                "type": "address"
              },
              {
                "internalType": "uint96",
                "name": "value",
                "type": "uint96"
              }
            ],
            "internalType": "struct LibPart.Part[]",
            "name": "royalties",
            "type": "tuple[]"
          }
        ],
        "internalType": "struct LibMinter.DefaultMinter",
        "name": "data",
        "type": "tuple"
      }
    ],
    "name": "upsertDefaultCreatorPayoutsAndRoyalties",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "creator",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "token",
            "type": "address"
          },
          {
            "components": [
              {
                "internalType": "address payable",
                "name": "account",
                "type": "address"
              },
              {
                "internalType": "uint96",
                "name": "value",
                "type": "uint96"
              }
            ],
            "internalType": "struct LibPart.Part[]",
            "name": "creators",
            "type": "tuple[]"
          },
          {
            "components": [
              {
                "internalType": "address payable",
                "name": "account",
                "type": "address"
              },
              {
                "internalType": "uint96",
                "name": "value",
                "type": "uint96"
              }
            ],
            "internalType": "struct LibPart.Part[]",
            "name": "royalties",
            "type": "tuple[]"
          }
        ],
        "internalType": "struct LibMinter.DefaultMinter",
        "name": "data",
        "type": "tuple"
      }
    ],
    "name": "upsertDefaultCreatorPayoutsAndRoyaltiesByCreator",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_minter",
        "type": "address"
      },
      {
        "internalType": "uint96",
        "name": "_fee",
        "type": "uint96"
      },
      {
        "internalType": "bool",
        "name": "active",
        "type": "bool"
      }
    ],
    "name": "upsertDefaultMinter",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_token",
        "type": "address"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "minter",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "creator",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "token",
            "type": "address"
          },
          {
            "internalType": "uint96",
            "name": "fee",
            "type": "uint96"
          },
          {
            "internalType": "uint256",
            "name": "cancelValue",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "start",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "end",
            "type": "uint256"
          },
          {
            "components": [
              {
                "internalType": "address payable",
                "name": "account",
                "type": "address"
              },
              {
                "internalType": "uint96",
                "name": "value",
                "type": "uint96"
              }
            ],
            "internalType": "struct LibPart.Part[]",
            "name": "creators",
            "type": "tuple[]"
          },
          {
            "components": [
              {
                "internalType": "address payable",
                "name": "account",
                "type": "address"
              },
              {
                "internalType": "uint96",
                "name": "value",
                "type": "uint96"
              }
            ],
            "internalType": "struct LibPart.Part[]",
            "name": "royalties",
            "type": "tuple[]"
          },
          {
            "internalType": "bytes[]",
            "name": "signatures",
            "type": "bytes[]"
          }
        ],
        "internalType": "struct LibMinter.Minter",
        "name": "data",
        "type": "tuple"
      }
    ],
    "name": "upsertMinter",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdrawOwnerStake",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "splitterBytes",
        "type": "bytes32"
      }
    ],
    "name": "withdrawRoyaltyStake",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "withdrawSplits",
    "outputs": [
      {
        "internalType": "address payable",
        "name": "account",
        "type": "address"
      },
      {
        "internalType": "uint96",
        "name": "value",
        "type": "uint96"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];