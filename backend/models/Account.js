const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema(
  {
    userId: {type: Schema.Types.ObjectId, ref: "User", required:true},
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Account", AccountSchema);