const express = require("express");
const router = express.Router();
const dashboardController = require("../../controller/user/dashboard-controller");

router.get("/dashboard-counts", dashboardController.getDashboardCounts);
router.get("/recent-orders", dashboardController.getRecentOrders);
router.get("/recent-bookings", dashboardController.getRecentBookings);

module.exports = router;
