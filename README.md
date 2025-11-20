# Pier Two Batch Deposit Contract
This contract faciliates batch deposits to both Shapella (0x01) and Pectra (0x02) era validators. It differs from pre-pectra implementations by allowing the depositor to specify an amount per validator deposit in the batch.

## Deployment Addresses
**Ethereum Mainnet**: [0xcD7a6C118Ac8F6544BC5076F2D8Fb86D2C546756](https://etherscan.io/address/0xcD7a6C118Ac8F6544BC5076F2D8Fb86D2C546756)

**Ethereum Hoodi Testnet**: [0x4c9506eE2fCd962f03022D9d8ebf6f7828abEfaf](https://hoodi.etherscan.io/address/0x4c9506ee2fcd962f03022d9d8ebf6f7828abefaf)

## HashLock Audit
This `BatchDeposit.sol` contract underwent a [security audit](https://hashlock.com/wp-content/uploads/2025/05/Pier-Two-Smart-Contract-Audit-Report-Final-Report-v1.pdf) performed by [Hashlock](https://hashlock.com/) in April 2025. The contract was rated as both Secure and Decentralised by the Auditors.

## Contracts

This project only contains a BatchDeposit contract which simply iterates over an array of Deposit structs and calls Ethereum's deposit contract for each. The file can be found here `contracts/contracts/implementations/BatchDeposit.sol`.

### Deposit data root

The only more advanced piece of logic is constructing the deposit data root which is validated by the Deposit contract, the logic here is mostly copied from that contract. This is contained in a library found in `contracts/contracts/libs/DepositDataRoot.sol`
