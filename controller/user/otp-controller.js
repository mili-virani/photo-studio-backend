require("dotenv").config();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../../models/user-model"); // Import User model
const crypto = require("crypto"); // For generating OTP
const bcrypt = require("bcryptjs"); // For hashing OTPs
const mongoose = require("mongoose");

// Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // Use 465 for SSL, or 587 for TLS
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

// Ensure OTP is always 5 digits
const generateOTP = () => {
  return (crypto.randomInt(10000, 99999) + "").padStart(5, "0");
};

// Function to send OTP email
const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: `"Online Photo Studio" <${process.env.EMAIL}>`,
    to: email,
    subject: "Your OTP for Password Reset",
    html: `
      <p>Hello,</p>
      <p>Your OTP for password reset is:</p>
      <h2>${otp}</h2>
      <p>This OTP is valid for 10 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
      <br>
      <p>Best Regards,</p>
      <p>Online Photo Studio Team</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// 🔹 1️⃣ Send OTP for password reset
const sendResetEmail = async (req, res) => {
  const { email } = req.body;
  console.log("Received email:", email);

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }

    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10); // Hash OTP before saving
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes

    user.resetOTP = hashedOTP;
    user.otpExpiry = otpExpiry;
    await user.save();

    await sendOTPEmail(email, otp);

    return res.json({ success: true, message: "OTP sent successfully!" });
  } catch (error) {
    console.error("Email error:", error);
    return res.status(500).json({ success: false, message: "Failed to send email" });
  }
};

// 🔹 2️⃣ Verify OTP
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if OTP has expired
    if (new Date(user.otpExpiry) < new Date()) {
      return res.status(400).json({ success: false, message: "OTP has expired!" });
    }

    // Compare OTP securely using bcrypt
    const isMatch = await bcrypt.compare(otp, user.resetOTP);

    if (isMatch) {
      return res.json({ success: true, message: "OTP verified successfully!", redirect: "/reset-password" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error verifying OTP", error });
  }
};

// 🔹 3️⃣ Resend OTP
const resendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const newOTP = generateOTP();
    const hashedOTP = await bcrypt.hash(newOTP, 10);
    user.resetOTP = hashedOTP;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendOTPEmail(email, newOTP);

    res.json({ success: true, message: "OTP resent successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error resending OTP", error });
  }
};

module.exports = { sendResetEmail, verifyOTP, resendOTP };
