import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "hardhat-chai-matchers-viem";
import "@openzeppelin/hardhat-upgrades";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });

const forkingURL = process.env.FORKING_URL || "";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      viaIR: true,
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
      forking: {
        url: forkingURL,
        blockNumber: 22062918,
      },
    },
    mainnet: {
      chainId: 1,
      url: "https://0xrpc.io/eth",
      accounts: {
        mnemonic: process.env.MNEMONIC || "",
      },
    },
    hoodi: {
      chainId: 560048,
      url: "https://0xrpc.io/hoodi",
      accounts: {
        mnemonic: process.env.MNEMONIC || "",
      },
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || "",
    customChains: [
      {
        network: "hoodi",
        chainId: 560048,
        urls: {
          apiURL: "https://api-hoodi.etherscan.io/api",
          browserURL: "https://hoodi.etherscan.io",
        },
      },
    ],
  },
};

export default config;
