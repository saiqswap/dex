exports.Escrow_Vesting = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "vestingId",
            type: "address",
          },
          {
            internalType: "address",
            name: "vestingToken",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "TGETime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "TGEUnlockPercent",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "cliffMonths",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "number0fLinearMonth",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct xEscrow_Vesting.Vesting",
        name: "vesting",
        type: "tuple",
      },
      {
        indexed: false,
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "AddFund",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "roundId",
            type: "address",
          },
          {
            internalType: "string",
            name: "projectId",
            type: "string",
          },
          {
            internalType: "address",
            name: "tokenSaleAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "minUSD",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "startAt",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "endAt",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isPause",
            type: "bool",
          },
        ],
        indexed: false,
        internalType: "struct xEscrow_Vesting.Round",
        name: "round",
        type: "tuple",
      },
    ],
    name: "ExecuteRound",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "vestingId",
            type: "address",
          },
          {
            internalType: "address",
            name: "vestingToken",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "TGETime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "TGEUnlockPercent",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "cliffMonths",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "number0fLinearMonth",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct xEscrow_Vesting.Vesting",
        name: "vesting",
        type: "tuple",
      },
    ],
    name: "ExecuteVesting",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "roundId",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "nationId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "ref",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "paymentToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "paymentAmout",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isReceiveToken",
        type: "bool",
      },
    ],
    name: "Purchase",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "vestingId",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "investor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalUnlockAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalLockAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "stage",
        type: "uint256",
      },
    ],
    name: "Withdraw",
    type: "event",
  },
  {
    inputs: [],
    name: "DEFAULT_BASE_VALUE",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "DEFAULT_TOKEN_DECIMALS",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "IDO",
    outputs: [
      {
        internalType: "contract IDOContract",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "NATIVE_TOKEN_ADDRESS",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "TOTAL_PERCENTAGE",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "USD_TOKEN_ADDRESS",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "vestingId",
            type: "address",
          },
          {
            internalType: "address",
            name: "vestingToken",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "TGETime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "TGEUnlockPercent",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "cliffMonths",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "number0fLinearMonth",
            type: "uint256",
          },
        ],
        internalType: "struct xEscrow_Vesting.Vesting",
        name: "_vesting",
        type: "tuple",
      },
      {
        internalType: "address",
        name: "_receiver",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "addFund",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "roundId",
            type: "address",
          },
          {
            internalType: "string",
            name: "projectId",
            type: "string",
          },
          {
            internalType: "address",
            name: "tokenSaleAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "minUSD",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "startAt",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "endAt",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isPause",
            type: "bool",
          },
        ],
        internalType: "struct xEscrow_Vesting.Round",
        name: "_round",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "address",
            name: "vestingId",
            type: "address",
          },
          {
            internalType: "address",
            name: "vestingToken",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "TGETime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "TGEUnlockPercent",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "cliffMonths",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "number0fLinearMonth",
            type: "uint256",
          },
        ],
        internalType: "struct xEscrow_Vesting.Vesting",
        name: "_vesting",
        type: "tuple",
      },
    ],
    name: "executeRound",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "vestingId",
            type: "address",
          },
          {
            internalType: "address",
            name: "vestingToken",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "TGETime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "TGEUnlockPercent",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "cliffMonths",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "number0fLinearMonth",
            type: "uint256",
          },
        ],
        internalType: "struct xEscrow_Vesting.Vesting",
        name: "_vesting",
        type: "tuple",
      },
    ],
    name: "executeVesting",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getListRound",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getListVesting",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_investor",
        type: "address",
      },
    ],
    name: "getVestingBalance",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "vestingId",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "totalLockAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalUnlockAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "stage",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "period",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "releaseTime",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "percentage",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "unlockAmount",
                type: "uint256",
              },
              {
                internalType: "bool",
                name: "isWithdrawal",
                type: "bool",
              },
            ],
            internalType: "struct xEscrow_Vesting.State[]",
            name: "arrVesting",
            type: "tuple[]",
          },
        ],
        internalType: "struct xEscrow_Vesting.Investment[]",
        name: "arrInvestment",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_USDAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_IDOAddress",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "mapPresaleData",
    outputs: [
      {
        internalType: "uint256",
        name: "currentSold",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalSupply",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "nativeTokenPrice",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "USDPrice",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "mapRound",
    outputs: [
      {
        internalType: "address",
        name: "roundId",
        type: "address",
      },
      {
        internalType: "string",
        name: "projectId",
        type: "string",
      },
      {
        internalType: "address",
        name: "tokenSaleAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "minUSD",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "startAt",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "endAt",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isPause",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "mapVesting",
    outputs: [
      {
        internalType: "address",
        name: "vestingId",
        type: "address",
      },
      {
        internalType: "address",
        name: "vestingToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "TGETime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "TGEUnlockPercent",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "cliffMonths",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "number0fLinearMonth",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_roundId",
        type: "address",
      },
      {
        internalType: "string",
        name: "_ref",
        type: "string",
      },
      {
        internalType: "address",
        name: "_paymentToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_paymentAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_nationId",
        type: "uint256",
      },
    ],
    name: "purchase",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_vestingId",
        type: "address",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
