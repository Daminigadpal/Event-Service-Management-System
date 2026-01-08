const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },

    invoiceNumber: String,
    totalAmount: Number,
    paidAmount: Number,

    status: {
      type: String,
      enum: ["Pending", "Partial", "Paid"],
      default: "Pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
