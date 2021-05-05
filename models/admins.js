const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;

let adminSchema = new Schema(
  {
    username: { type: String },
    first_name: { type: String },
    last_name: { type: String },
    account_balance: { type: Number, default: 0 },
    password: { type: String },
    photo: { type: String },
    phone_number: { type: String },
    email: { type: String },
    monthly_reports: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

var Admins = mongoose.model("Admin", adminSchema);
module.exports = { Admins, adminSchema };
