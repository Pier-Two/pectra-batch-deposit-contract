import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const BatchDepositModule = buildModule("BatchDepositModule", (m) => {
  const batchDeposit = m.contract("BatchDeposit", []);

  return { batchDeposit };
});

export default BatchDepositModule;
