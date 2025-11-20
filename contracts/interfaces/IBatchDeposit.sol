// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

/// @title IBatchDeposit - Interface for batching deposits to the Ethereum deposit contract
/// @notice Facilitates multiple validator deposits to Ethereum's deposit contract in a single transaction
interface IBatchDeposit {
    /// @notice Struct representing a single validator deposit
    /// @param pubKey Validator public key (48 bytes)
    /// @param withdrawalCredentials Withdrawal credentials (32 bytes)
    /// @param signature Validator signature (96 bytes)
    /// @param amount Amount to deposit for the validator (in wei)
    struct Deposit {
        bytes pubKey;
        bytes withdrawalCredentials;
        bytes signature;
        uint256 amount;
    }

    /// @notice Emitted when a validator deposit is made
    /// @param pubKey The public key of the deposited validator
    /// @param withdrawalCredentials The withdrawal credentials associated with the validator
    /// @param amount The amount deposited for the validator
    event ValidatorDeposit(
        bytes indexed pubKey,
        bytes indexed withdrawalCredentials,
        uint256 amount
    );

    /// @notice Thrown when the deposits array is empty
    error NoDepositsProvided();

    /// @notice Thrown when the provided pubKey is not exactly 48 bytes
    error InvalidPubKeyLength();

    /// @notice Thrown when the withdrawal credentials are not exactly 32 bytes
    error InvalidWithdrawalCredLength();

    /// @notice Thrown when the signature is not exactly 96 bytes
    error InvalidSignatureLength();

    /// @notice Thrown when a deposit amount is less than 1 ether (required minimum for Ethereum validators)
    error DepositValueLessThan1ETH();

    /// @notice Thrown when a single deposit amount exceeds 2048 ether (maximum allowed for Ethereum validators)
    /// @notice Note that if the validator already has a balance, this check doesn't take that into account
    error DepositValueGreaterThan2048ETH();

    /// @notice Thrown when the deposit amount is not a multiple of Gwei (1e9 wei)
    error DepositValueMustBeMultipleOfGwei();

    /// @notice Thrown when msg.value does not equal the total of all deposit amounts
    error MsgValueNotEqualToTotalDepositAmount();

    /// @notice Thrown when ETH is sent to the contract directly
    error ETHNotAccepted();

    /// @notice Thrown when a fallback method is called
    error FallbackMethodNotAccepted();

    /// @notice Executes a batch deposit to Ethereum's deposit contract
    /// @dev Validates input data lengths and ensures deposit values comply with Ethereum's validator requirements
    /// @param _deposits An array of Deposit structs representing each validator's deposit data
    function batchDeposit(Deposit[] calldata _deposits) external payable;
}
