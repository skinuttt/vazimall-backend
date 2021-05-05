const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;

let customerSchema = new Schema(
  {
    phone_number: { type: String },
    name: { type: String },
    account_balance: { type: Number, default: 0 },
    starred: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    subscriptions: [{ type: Schema.Types.ObjectId, ref: "Vendor" }],
    address: { type: Map, of: String },
    photo: { type: String },
    password: { type: String },
    gender: { type: String },
  },
  {
    timestamps: true,
  }
);

var Customers = mongoose.model("Customer", customerSchema);
module.exports = { Customers, customerSchema };
