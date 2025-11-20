import { range } from "lodash";
import { toHex } from "viem";

const MAX_LENGTH = 18;

const GWEI = 1_000_000_000n;

/**
 * This method flips the endianness of the provided value, this is primarily so the beacon deposit contract doesn't reject requests. Refer to here for more info: https://github.com/ethereum/consensus-specs/blob/dev/solidity_deposit_contract/deposit_contract.sol#L165
 * @param amount The amount value to flip the endianness
 * @param skipGweiParsing Whether to not divide the value by 1 gwei
 * @returns Returns the amount with the endianness flipped
 */
export const flipAmountEndianness = (
  amount: bigint,
  skipGweiParsing?: boolean,
) => {
  let parsedAmount = amount;
  if (!skipGweiParsing) {
    parsedAmount = amount / GWEI;
  }

  const hexValue = toHex(parsedAmount);

  if (hexValue.length > MAX_LENGTH) {
    throw new Error("Amount value too large to fit in uint64");
  }

  const updatedString = range(MAX_LENGTH - 2).map(() => "0");

  let numLoops = 0;

  for (let i = hexValue.length; i > 2; i -= 2) {
    const [firstChar, secondChar] = hexValue.slice(i - 2, i);

    updatedString[numLoops * 2] = firstChar;
    updatedString[numLoops * 2 + 1] = secondChar;

    numLoops += 1;
  }

  return `0x${updatedString.join("")}`;
};
