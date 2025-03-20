require('dotenv').config();
const cors = require("cors");
const express = require("express");
const http = require("http"); // Add this
const socketIo = require("socket.io"); // Add this

const app = express();
const server = http.createServer(app); // Create HTTP server
const io = socketIo(server, {
  cors: {
    origin: "https://photostudiobymili.netlify.app", // Allow frontend to connect
    methods: ["GET","POST","PUT","DELETE"]
  }
});

const path = require("path");
const authRouter = require("./router/user/auth-router");
const contactRoute = require("./router/user/contact-router");
const categoryRoute = require("./router/user/category-router");
const serviceRoute = require("./router/user/service-router");
const galleryRoute = require("./router/user/gallery-router");
const orderRoute = require("./router/user/order-router");
const feedbackRoute = require("./router/user/feedback-router");
const paymentRoute = require("./router/user/payment-router");
const otpRoute = require("./router/user/otp-router");
const productRoute = require("./router/user/product-router");
const bookingRoute = require("./router/user/Booking-router");
const dashboardRoute = require("./router/user/dashboard-router");
const aboutUsRoute = require("./router/user/aboutus-router");
const notificationRoute = require("./router/user/notification-router");

//admin
const adminAuthRoute = require("./router/admin/auth-router");
const adminPwdRoute = require("./router/admin/pwd-router");

const connectDb = require("./utils/db"); 
const errorMiddleware = require('./middlewares/error-middleware');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// API Routes
app.use("/admin1", adminAuthRoute);
app.use("/admin1/pwd", adminPwdRoute);
app.use("/api", authRouter);
app.use("/api", dashboardRoute);
app.use("/api/otp", otpRoute);
app.use("/api/contact", contactRoute);
app.use("/api/category", categoryRoute);
app.use("/api/services", serviceRoute);
app.use("/api/gallery", galleryRoute);
app.use("/api/orders", orderRoute);
app.use("/api/feedback", feedbackRoute);
app.use("/api/", paymentRoute);
app.use("/api/products", productRoute);
app.use("/api/booking", bookingRoute);
app.use("/api/aboutus", aboutUsRoute);
app.use("/api/notifications", notificationRoute);

// Serve Static Files
app.use("/images", express.static("public/images"));
app.use("/uploads", express.static("uploads"));
app.use("/service-uploads", express.static("service-uploads"));
app.use("/profile-uploads", express.static("profile-uploads"));

app.use(errorMiddleware);

// Handle Root Route
app.get("/", (req, res) => {
  res.status(200).send("Welcome to online photo studio.");
});

// 🔥 **Add Socket.IO Connection Handling**
io.on("connection", (socket) => {
  console.log("🔗 New client connected");

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected");
  });
});

// Start Server After Connecting to Database
const PORT = 8000;
connectDb().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
  server.keepAliveTimeout = 2400000; // 120 seconds
  server.headersTimeout = 240000; // 120 seconds
}).catch(err => {
  console.error("❌ Database connection failed:", err);
});

// Example Email Notification Route (Optional)
app.post("/send-notification", async (req, res) => {
  const { to, subject, message } = req.body;
  try {
    await sendEmail(to, subject, message);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending email", error });
  }
});

