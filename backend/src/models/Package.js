const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service"
      }
    ],
    duration: String, // e.g., "1 Day", "3 Days"
    price: Number,
    description: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Package", packageSchema);
