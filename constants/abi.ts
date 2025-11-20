// Having issues with type-safety in the frontend if this isn't declared in a .ts file and as a constant

export const BATCH_DEPOSIT_ABI = [
  {
    inputs: [],
    name: "DepositValueGreaterThan2048ETH",
    type: "error",
  },
  {
    inputs: [],
    name: "DepositValueLessThan1ETH",
    type: "error",
  },
  {
    inputs: [],
    name: "DepositValueMustBeMultipleOfGwei",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidPubKeyLength",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidSignatureLength",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidWithdrawalCredLength",
    type: "error",
  },
  {
    inputs: [],
    name: "MsgValueNotEqualToTotalDepositAmount",
    type: "error",
  },
  {
    inputs: [],
    name: "NoDepositsProvided",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes",
        name: "pubKey",
        type: "bytes",
      },
      {
        indexed: true,
        internalType: "bytes",
        name: "withdrawalCredentials",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "ValidatorDeposit",
    type: "event",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes",
            name: "pubKey",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "withdrawalCredentials",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "signature",
            type: "bytes",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        internalType: "struct IBatchDeposit.Deposit[]",
        name: "_deposits",
        type: "tuple[]",
      },
    ],
    name: "batchDeposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "depositContract",
    outputs: [
      {
        internalType: "contract IDepositContract",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
