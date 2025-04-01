const Booking = require("../../models/Booking-model");

// Create a Booking (POST)
// const createBooking = async (req, res) => {
// try {
// const { userId, categoryId, packageId, date, time, address, price } = req.body;

// // Debug log to check received request data
// console.log("Received body:", req.body);

// // Validate required fields
// if (!userId || !categoryId || !packageId || !date || !time || !address || !price) {
// return res.status(400).json({ success: false, message: "All fields are required" });
// }

// // Convert date to ISO format
// const bookingDate = new Date(date);

// const newBooking = new Booking({
// userId, // Ensure this matches the schema
// categoryId,
// packageId,
// bookingDate, // Ensure proper format
// bookingTime: time,
// address,
// price,
// status: "pending",
// });

// await newBooking.save();
// res.status(201).json({ success: true, message: "Booking created successfully", booking: newBooking });

// } catch (error) {
// console.error("Error in createBooking:", error);
// res.status(500).json({ success: false, message: "Internal Server Error", error });
// }
// };
const createBooking = async (req, res) => {
try {
const { userId, categoryId, packageId, bookingDate, bookingTime, address, price } = req.body;

// Debug log to check received request data
console.log("Received body:", req.body);

// Validate required fields
if (!userId || !categoryId || !packageId || !bookingDate || !bookingTime || !address || !price) {
return res.status(400).json({ success: false, message: "All fields are required" });
}

// Convert bookingDate to Date object
const formattedBookingDate = new Date(bookingDate);

const newBooking = new Booking({
userId,
categoryId,
packageId,
bookingDate: formattedBookingDate, // Ensure correct format
bookingTime,
address,
price,
status: "pending",
});

await newBooking.save();
res.status(201).json({ success: true, message: "Booking created successfully", booking: newBooking });

} catch (error) {
console.error("Error in createBooking:", error);
res.status(500).json({ success: false, message: "Internal Server Error", error });
}
};

// Get all Bookings (GET)
const getAllBookings = async (req, res) => {
try {
const bookings = await Booking.find().populate("userId", "username email phone").populate("categoryId").populate("packageId");
res.status(200).json({ success: true, bookings });
} catch (error) {
console.error("Error in getAllBookings:", error);
res.status(500).json({ success: false, message: "Internal Server Error" });
}
};

// ✅ Get Bookings for Logged-in User
const getUserBookings = async (req, res) => {
    const { userId } = req.params;
    console.log("Fetching Bookings for UserID:", userId); // 🟢 Debug log
  
    try {
      const bookings = await Booking.find({ userId: userId })
        .populate("userId", "username email phone")
        .populate("categoryId", "name")
        .populate("packageId", "packageName");
  
      if (!bookings.length) {
        console.log("No Bookings Found!");
        return res.status(200).json({ success: true, data: [] });
      }
  
      res.status(200).json({ success: true, data: bookings });
    } catch (error) {
      console.error("Error fetching user booking data:", error.message);
      res.status(500).json({
        success: false,
        message: "Error fetching booking data",
        error: error.message,
      });
    }
  };
  
// const getUserBookings = async (req, res) => {
//     console.log("Received request:", req.url); // Logs the request URL
//     console.log("Params:", req.params); // Logs the request parameters

//     const { userId } = req.params;
//     console.log("Extracted UserID:", userId); // Logs extracted userId

//     try {
//         const bookings = await Booking.find({ userId: userId })
//             .populate("userId", "username email phone")
//             .populate("categoryId", "name")
//             .populate("packageId", "packageName");

//         if (!bookings.length) {
//             console.log("No Bookings Found!");
//             return res.status(200).json({ success: true, data: [] });
//         }

//         console.log("Bookings Found:", bookings.length);
//         res.status(200).json({ success: true, data: bookings });
//     } catch (error) {
//         console.error("Error fetching user booking data:", error.message);
//         res.status(500).json({
//             success: false,
//             message: "Error fetching booking data",
//             error: error.message,
//         });
//     }
// };


// Get a single Booking by ID (GET)
const getBookingById = async (req, res) => {
try {
const booking = await Booking.findById(req.params.id)
.populate("userId", "username email phone")
.populate("categoryId")
.populate("packageId");

if (!booking) {
return res.status(404).json({ success: false, message: "Booking not found" });
}

res.status(200).json({ success: true, booking });
} catch (error) {
console.error("Error in getBookingById:", error);
res.status(500).json({ success: false, message: "Internal Server Error" });
}
};

// Update Booking (PUT)
const updateBooking = async (req, res) => {
try {
const { status, date, time, address, price } = req.body;

const updatedBooking = await Booking.findByIdAndUpdate(
req.params.id,
{ status, bookingDate: date, bookingTime: time, address, price },
{ new: true, runValidators: true }
);

if (!updatedBooking) {
return res.status(404).json({ success: false, message: "Booking not found" });
}

res.status(200).json({ success: true, message: "Booking updated successfully", booking: updatedBooking });

} catch (error) {
console.error("Error in updateBooking:", error);
res.status(500).json({ success: false, message: "Internal Server Error" });
}
};

// Delete Booking (DELETE)
const deleteBooking = async (req, res) => {
try {
const deletedBooking = await Booking.findByIdAndDelete(req.params.id);

if (!deletedBooking) {
return res.status(404).json({ success: false, message: "Booking not found" });
}

res.status(200).json({ success: true, message: "Booking deleted successfully" });

} catch (error) {
console.error("Error in deleteBooking:", error);
res.status(500).json({ success: false, message: "Internal Server Error" });
}
};

module.exports = {
createBooking,
getAllBookings,
getBookingById,
updateBooking,
deleteBooking,
getUserBookings,
};