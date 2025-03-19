const User = require("../../models/user-model");
const Order = require("../../models/order-model");
const Payment = require("../../models/payment-model");
const service=require("../../models/service-model");
const gallery=require("../../models/gallery-model");
const category=require("../../models/category-model");
const contact=require("../../models/contact-model");
const feedback=require("../../models/feedback-model");
const product=require("../../models/product-model");
const booking=require("../../models/Booking-model");

exports.getDashboardCounts = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const newOrders = await Order.countDocuments();
    const services = await service.countDocuments();
    const bookings = await booking.countDocuments();
    const galleries = await gallery.countDocuments();
    const categories=await category.countDocuments();
    const contacts=await contact.countDocuments();
    const feedbacks = await feedback.countDocuments();
    const products = await product.countDocuments();
    const revenue = await Payment.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]);

    res.json({
      totalUsers,
      newOrders,
      revenue: revenue.length > 0 ? revenue[0].total : 0,
      services,
      bookings,
      galleries,
      categories,
      contacts,
      feedbacks,
      products
    });
  } catch (error) {
    console.error("Error fetching dashboard counts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getRecentOrders = async (req, res) => {
    try {
      const recentOrders = await Order.find()
        .populate("user_id", "username") // Assuming `userId` is referenced in the Order schema
        .sort({ createdAt: -1 })
        .limit(5);
  
      res.json(recentOrders);
    } catch (error) {
      console.error("Error fetching recent orders:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  exports.getRecentBookings = async (req, res) => {
    try {
      const recentBookings = await booking.find()
        .populate({ path: "userId", select: "username" }) // Populate user details
        .populate({ path: "packageId", select: "service_name" }) // Populate service details
        .sort({ createdAt: -1 })
        .limit(5);
  
      res.json(recentBookings);
    } catch (error) {
      console.error("Error fetching recent bookings:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };