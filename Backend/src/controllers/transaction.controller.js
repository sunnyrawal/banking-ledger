const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");
const emailService = require("../services/email.service");
const accountModel = require("../models/account.model");

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

  

}
