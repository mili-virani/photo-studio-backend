const Notification = require("../../models/notification-model");

// Get all notifications for a user
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!notification) return res.status(404).json({ message: "Notification not found" });

    res.json({ message: "Notification marked as read", notification });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
