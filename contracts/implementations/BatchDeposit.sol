// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import {IBatchDeposit} from "../interfaces/IBatchDeposit.sol";
import {IDepositContract} from "../vendors/IDepositContract.sol";
import {DepositDataRoot} from "../libs/DepositDataRoot.sol";

contract BatchDeposit is IBatchDeposit {
    using DepositDataRoot for Deposit;

    IDepositContract public constant depositContract =
        IDepositContract(0x00000000219ab540356cBB839Cbe05303d7705Fa);

    receive() external payable {
        revert ETHNotAccepted();
    }

    fallback() external payable {
        revert FallbackMethodNotAccepted();
    }

    function batchDeposit(
        Deposit[] calldata _deposits
    ) external payable override {
        if (_deposits.length == 0) {
            revert NoDepositsProvided();
        }

        // Gas optimization: accumulate total required ETH for all deposits.
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < _deposits.length; ++i) {
            if (_deposits[i].pubKey.length != 48) {
                revert InvalidPubKeyLength();
            }
            if (_deposits[i].withdrawalCredentials.length != 32) {
                revert InvalidWithdrawalCredLength();
            }
            if (_deposits[i].signature.length != 96) {
                revert InvalidSignatureLength();
            }
            if (_deposits[i].amount < 1 ether) {
                revert DepositValueLessThan1ETH();
            }
            if (_deposits[i].amount > 2048 ether) {
                revert DepositValueGreaterThan2048ETH();
            }

            if (_deposits[i].amount % 1 gwei != 0) {
                revert DepositValueMustBeMultipleOfGwei();
            }

            totalAmount += _deposits[i].amount;
        }
        if (totalAmount != msg.value) {
            revert MsgValueNotEqualToTotalDepositAmount();
        }

        // Process each deposit
        for (uint256 i = 0; i < _deposits.length; ++i) {
            bytes32 depositDataRoot = _deposits[i].formatDepositDataRoot();

            // Call the Ethereum deposit contract for this entry.
            depositContract.deposit{value: _deposits[i].amount}(
                _deposits[i].pubKey,
                _deposits[i].withdrawalCredentials,
                _deposits[i].signature,
                depositDataRoot
            );

            emit ValidatorDeposit(
                _deposits[i].pubKey,
                _deposits[i].withdrawalCredentials,
                _deposits[i].amount
            );
        }
    }
}
