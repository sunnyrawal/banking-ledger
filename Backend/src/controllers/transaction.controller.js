const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");
const emailService = require("../services/email.service");
const accountModel = require("../models/account.model");
const mongoose = require("mongoose");

/**
 * - Create a new transaction
 * -The 10 steps :
 * 1. Validate the request body
 * 2. Validate idompotency key to prevent duplicate transactions
 * 3.check account status
 * 4. Derive sender balance from the ledger
 * 5.Create transaction (pending)
 * 6.Create debit entry in the ledger
 * 7.Create credit entry in the ledger
 * 8.Update transaction status to completed
 * 9. commit mongodb session
 * 10.send email notification to the sender and receiver
 */

async function createTransaction(req, res) {
  /** Step 1: Validate the request body */

  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const fromUserAccount = await accountModel.findOne({ _id: fromAccount });
  const toUserAccount = await accountModel.findOne({ _id: toAccount });

  if (!fromUserAccount || !toUserAccount) {
    return res.status(404).json({ message: "Account not found" });
  }

  /** Step 2: Validate idompotency key to prevent duplicate transactions */

  const existingTransaction = await transactionModel.findOne({
    idempotencyKey: idempotencyKey,
  });

  if (existingTransaction) {
    if (existingTransaction.status === "COMPLETED") {
      return res.status(200).json({
        message: "Transaction already completed",
        transaction: existingTransaction,
      });
    }

    if (existingTransaction.status === "PENDING") {
      return res.status(200).json({
        message: "Transaction is pending",
      });
    }

    if (existingTransaction.status === "FAILED") {
      return res.status(200).json({
        message: "Transaction already failed",
      });
    }

    if (existingTransaction.status === "REVERSED") {
      return res.status(200).json({
        message: "Transaction was reversed, please try again",
      });
    }
  }

  /** Step 3: Check account status */

  if (
    fromUserAccount.status !== "ACTIVE" ||
    toUserAccount.status !== "ACTIVE"
  ) {
    return res
      .status(400)
      .json({ message: "One or both accounts are not active" });
  }

  /** Step 4: Derive sender balance from the ledger */

  const balance = await fromUserAccount.getBalance();

  if (balance < amount) {
    return res.status(400).json({ message: "Insufficient balance" });
  }

  /** Step 5: Create transaction (pending) */

  let transaction;
  try {
    /**
     * 5. Create transaction (PENDING)
     */
    const session = await mongoose.startSession();
    session.startTransaction();

    transaction = (
      await transactionModel.create(
        [
          {
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status: "PENDING",
          },
        ],
        { session },
      )
    )[0];

    const debitLedgerEntry = await ledgerModel.create(
      [
        {
          account: fromAccount,
          amount: amount,
          transaction: transaction._id,
          type: "DEBIT",
        },
      ],
      { session },
    );

    await (() => {
      return new Promise((resolve) => setTimeout(resolve, 15 * 1000));
    })();

    const creditLedgerEntry = await ledgerModel.create(
      [
        {
          account: toAccount,
          amount: amount,
          transaction: transaction._id,
          type: "CREDIT",
        },
      ],
      { session },
    );

    await transactionModel.findOneAndUpdate(
      { _id: transaction._id },
      { status: "COMPLETED" },
      { session },
    );

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    return res.status(400).json({
      message:
        "Transaction is Pending due to some issue, please retry after sometime",
    });
  }

  /** Step 10: Send email notification to the sender and receiver */

  await emailService.sendTransactionEmail(
    req.user.email,
    req.user.name,
    amount,
    toAccount,
  );

  res.status(201).json({ message: "Transaction successful", transaction });
}

async function createInitialFundsTransaction(req, res) {
  const { toAccount, amount, idempotencyKey } = req.body;

  if (!toAccount || !amount || !idempotencyKey) {
    return res
      .status(400)
      .json({ message: "toAccount ,amount, idempotencyKey are required" });
  }

  const toUserAccount = await accountModel.findOne({ _id: toAccount });
  if (!toUserAccount) {
    return res.status(404).json({ message: "toAccount not found" });
  }

  const fromUserAccount = await accountModel.findOne({
    user: req.user._id,
  });

  if (!fromUserAccount) {
    return res.status(404).json({ message: "System account not found" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const transaction = new transactionModel({
    fromAccount: fromUserAccount._id,
    toAccount,
    amount,
    idempotencyKey,
    status: "PENDING",
  });

  const debitEntry = await ledgerModel.create(
    [
      {
        account: fromUserAccount._id,
        amount: amount,
        transaction: transaction._id,
        type: "DEBIT",
      },
    ],
    { session },
  );

  const creditEntry = await ledgerModel.create(
    [
      {
        account: toAccount,
        amount: amount,
        transaction: transaction._id,
        type: "CREDIT",
      },
    ],
    { session },
  );

  transaction.status = "COMPLETED";
  await transaction.save({ session });

  await session.commitTransaction();
  session.endSession();

  return res
    .status(201)
    .json({ message: "Initial funds transaction successful", transaction });
}

module.exports = {
  createTransaction,
  createInitialFundsTransaction,
};
