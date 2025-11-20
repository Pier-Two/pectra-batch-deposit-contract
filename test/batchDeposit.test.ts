import { parseEther } from "viem";
import { testingFixture } from "../helpers/testing";
import { BatchDepositContract, ETHDepositContract } from "../types/testing";
import { expect } from "chai";
import { flipAmountEndianness } from "../helpers/deposit";
import hre from "hardhat";

interface Deposit {
  pubKey: `0x${string}`;
  withdrawalCredentials: `0x${string}`;
  signature: `0x${string}`;
  amount: bigint;
}

const createBytesOfLength = (length: number): `0x${string}` =>
  `0x${"00".repeat(length)}`;

const buildMockDeposit = (args: Partial<Deposit>): Deposit => ({
  pubKey: createBytesOfLength(48),
  withdrawalCredentials: createBytesOfLength(32),
  signature: createBytesOfLength(96),
  amount: parseEther("32"),
  ...args,
});

describe("BatchDeposit", () => {
  let batchDeposit: BatchDepositContract;
  let ethDepositContract: ETHDepositContract;

  beforeEach(async () => {
    ({ batchDeposit, ethDepositContract } = await testingFixture());
  });

  it("Should revert when sending ETH directly to the contract", async () => {
    const [sender] = await hre.ethers.getSigners();

    // Attempt to send ETH directly to the contract
    await expect(
      sender.sendTransaction({
        to: batchDeposit.address,
        value: parseEther("1"),
      }),
    ).to.be.revertedWithCustomError(batchDeposit, "ETHNotAccepted");
  });

  it("Should revert when the fallback function is called", async () => {
    const [sender] = await hre.ethers.getSigners();

    // Create a transaction that will trigger the fallback function
    // by calling a non-existent function with some data and value
    await expect(
      sender.sendTransaction({
        to: batchDeposit.address,
        value: parseEther("1"),
        data: "0x12345678", // Some arbitrary data that doesn't match any function signature
      }),
    ).to.be.revertedWithCustomError(batchDeposit, "FallbackMethodNotAccepted");
  });

  it("Should revert when supplying no deposits", async () => {
    await expect(
      batchDeposit.write.batchDeposit([[]]),
    ).to.be.revertedWithCustomError(batchDeposit, "NoDepositsProvided");
  });

  it("Should revert when supplying a pubKey with invalid length", async () => {
    await expect(
      batchDeposit.write.batchDeposit([[buildMockDeposit({ pubKey: "0x0" })]]),
    ).to.be.revertedWithCustomError(batchDeposit, "InvalidPubKeyLength");
  });

  it("Should revert when supplying a withdrawalCredentials with invalid length", async () => {
    await expect(
      batchDeposit.write.batchDeposit([
        [buildMockDeposit({ withdrawalCredentials: "0x0" })],
      ]),
    ).to.be.revertedWithCustomError(
      batchDeposit,
      "InvalidWithdrawalCredLength",
    );
  });

  it("Should revert when the deposit value is less than 1 ETH", async () => {
    await expect(
      batchDeposit.write.batchDeposit([
        [buildMockDeposit({ amount: parseEther("0.5") })],
      ]),
    ).to.be.revertedWithCustomError(batchDeposit, "DepositValueLessThan1ETH");
  });

  it("Should revert when supplying more than 2048 ETH in a single deposit", async () => {
    await expect(
      batchDeposit.write.batchDeposit([
        [buildMockDeposit({ amount: parseEther("2048.1") })],
      ]),
    ).to.be.revertedWithCustomError(
      batchDeposit,
      "DepositValueGreaterThan2048ETH",
    );
  });

  it("Should revert when the deposit value isn't a multiple of gwei", async () => {
    await expect(
      batchDeposit.write.batchDeposit([
        [buildMockDeposit({ amount: parseEther("1.0000000001") })],
      ]),
    ).to.be.revertedWithCustomError(
      batchDeposit,
      "DepositValueMustBeMultipleOfGwei",
    );
  });

  it("Should revert when the msg.value isn't equal to the sum of all deposits", async () => {
    await expect(
      batchDeposit.write.batchDeposit(
        [
          [
            buildMockDeposit({ amount: parseEther("1") }),
            buildMockDeposit({ amount: parseEther("1") }),
          ],
        ],
        { value: parseEther("1.5") },
      ),
    ).to.be.revertedWithCustomError(
      batchDeposit,
      "MsgValueNotEqualToTotalDepositAmount",
    );
  });

  it("Should emit the Deposit event", async () => {
    const deposit = buildMockDeposit({ amount: parseEther("1") });

    // Get the response in little endian
    const depositCountInLE = await ethDepositContract.read.get_deposit_count();

    // Flip the endianness so that we can use it as a normal number
    const converted = flipAmountEndianness(BigInt(depositCountInLE), true);

    // Cast to int, pass 16 as it is a HEX value
    let numDeposits = parseInt(converted, 16);

    const expectedAmount = flipAmountEndianness(deposit.amount);

    await expect(
      batchDeposit.write.batchDeposit([[deposit]], { value: deposit.amount }),
    )
      .to.emit(ethDepositContract, "DepositEvent")
      .withArgs(
        deposit.pubKey,
        deposit.withdrawalCredentials,
        expectedAmount,
        deposit.signature,
        flipAmountEndianness(BigInt(numDeposits), true),
      );
  });
});
