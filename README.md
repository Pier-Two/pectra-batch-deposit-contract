# Contracts

This project only contains a BatchDeposit contract which simply iterates over an array of Deposit structs and calls Ethereum's deposit contract for each. The file can be found here `contracts/contracts/implementations/BatchDeposit.sol`.

## Deposit data root

The only more advanced piece of logic is constructing the deposit data root which is validated by the Deposit contract, the logic here is mostly copied from that contract. This is contained in a library found in `contracts/contracts/libs/DepositDataRoot.sol`
