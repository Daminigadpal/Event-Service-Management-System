const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    action: String,
    entityType: String,
    entityId: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);

