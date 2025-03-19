const express = require("express");
const router = express.Router();
const { createBooking, getAllBookings, getBookingById, updateBooking, deleteBooking } = require("../../controller/user/Booking-controller");
// const authMiddleware = require("../../controller/user/auth");

// Routes for Bookings
router.post("/", createBooking);        // Create a new booking (User)
router.get("/", getAllBookings);       // Get all bookings (Admin)
router.get("/:id", getBookingById);    // Get a booking by ID (Admin)
router.put("/:id", updateBooking);     // Update a booking (Admin)
router.delete("/:id", deleteBooking);  // Delete a booking (Admin)

module.exports = router;

