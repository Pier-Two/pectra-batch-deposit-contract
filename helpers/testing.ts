import hre, { ignition } from "hardhat";
import BatchDepositModule from "../ignition/modules/BatchDeposit";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { DEPOSIT_CONTRACT_ADDRESS } from "../constants/contracts";

export const buildFixture = async () => {
  const { batchDeposit } = await ignition.deploy(BatchDepositModule);

  const ethDepositContract = await hre.viem.getContractAt(
    "contracts/vendors/IDepositContract.sol:IDepositContract",
    DEPOSIT_CONTRACT_ADDRESS,
  );

  return { batchDeposit, ethDepositContract };
};

export const testingFixture = async () => loadFixture(buildFixture);
