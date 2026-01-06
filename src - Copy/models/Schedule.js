const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    staff: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    date: Date,

    status: {
      type: String,
      enum: ["Scheduled", "Busy", "Available"],
      default: "Scheduled"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Schedule", scheduleSchema);
