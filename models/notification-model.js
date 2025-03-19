const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["new_product", "price_drop", "general"],
    default: "general",
  },
  isRead: {
    type: Boolean,
    default: false,
  },

},{timestamps:true});

module.exports = mongoose.model("Notification", notificationSchema);
