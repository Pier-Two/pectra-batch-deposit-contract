import { testingFixture } from "../helpers/testing";

type IgnitionModules = Awaited<ReturnType<typeof testingFixture>>;

export type BatchDepositContract = IgnitionModules["batchDeposit"];
export type ETHDepositContract = IgnitionModules["ethDepositContract"];
