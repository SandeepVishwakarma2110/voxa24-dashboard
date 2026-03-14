const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema({
  logId: String,
  whatsappNumber: String,
  userName: String,
  userEmail: String,
  startTime: Date,
  endTime: Date,
  transcript: Array
}, { collection: "sessionlogs" });

module.exports = mongoose.model("Log", LogSchema);