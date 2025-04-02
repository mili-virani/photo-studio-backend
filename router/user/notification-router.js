const express = require("express");
const router = express.Router();
const { getNotifications, markAsRead } = require("../../controller/user/notification-controller");

router.get("/", getNotifications);
router.put("/:id/read", markAsRead);

module.exports = router;
