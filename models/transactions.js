const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;

let transactionSchema = new Schema(
  {
    transaction_code: { type: String },
    amount: { type: Number },
    name: { type: String },
    type: { type: String },
  },
  {
    timestamps: true,
  }
);

var Transactions = mongoose.model("Transaction", transactionSchema);
module.exports = { Transactions, transactionSchema };
