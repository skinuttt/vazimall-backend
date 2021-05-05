const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;

let vendorSchema = new Schema(
  {
    stall_name: { type: String },
    description: { type: String },
    photo: { type: String },
    account_balance: { type: Number, default: 0 },
    escrow: { type: Number, default: 0 },
    ratings: [{ type: Number }],
    phone_number: { type: String },
    password: { type: String },
    id_number: { type: String },
  },
  {
    timestamps: true,
  }
);

var Vendors = mongoose.model("Vendor", vendorSchema);
module.exports = { Vendors, vendorSchema };
