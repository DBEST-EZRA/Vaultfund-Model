const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ["deposit", "withdrawal"], required: true },
  status: { type: String, enum: ["pending", "completed", "flagged"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
  anomalyDetected: { type: Boolean, default: false }, // Flag for anomalies
  riskScore: { type: Number, min: 0, max: 100, default: 0 }, // AI risk score
  flaggedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null }, // If manually flagged
});

module.exports = mongoose.model("Transaction", TransactionSchema);
