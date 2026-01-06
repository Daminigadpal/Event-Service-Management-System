const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,

    preferences: {
      eventTypes: [String],
      notes: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);
