const User = require("../../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const saltRound = 10;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

if (!JWT_SECRET_KEY) {
  throw new Error("JWT_SECRET_KEY is not set in environment variables");
}

// Home route
const home = async (req, res) => {
  try {
    res.status(200).send("Welcome to online photo studio.");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// User registration
const register = async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hash_password = await bcrypt.hash(password, saltRound);
    const newUser = await User.create({ username, email, phone, password: hash_password });

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, isadmin: newUser.isadmin },
      JWT_SECRET_KEY,
      { expiresIn: "7d" } // Security fix: Reduced token expiry
    );

    res.status(201).json({ message: "Registration successful", token, userId: newUser._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// User login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, isadmin: user.isadmin },
      JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.status(200).json({ message: "Login successful", token, userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Forgot password (OTP-based)
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = crypto.randomInt(10000, 99999).toString(); // 5-digit OTP
    const hashedOtp = await bcrypt.hash(otp, saltRound); // Secure OTP storage

    user.resetOtp = hashedOtp;
    user.otpExpires = Date.now() + 15 * 60 * 1000; // Expires in 15 minutes
    await user.save();

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: "Online Photo Studio",
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is ${otp}. It will expire in 15 minutes.`,
    });

    res.json({ message: "OTP sent to email!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  // console.log("req.body", req.body);
  // console.log("body is: ",email,otp,newPassword)
  try {
    const user = await User.findOne({ email });
    // console.log("User is ", user);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOTP = null;
    user.otpExpiry = null;
    
    await user.save();
    // console.log("Hey without error");
    console.log("hashed pwd", hashedPassword);
    res.json({ message: "Password reset successfully" });
  } catch (error) {
    // console.log("Hey with error!!!");
    res.status(500).json({ message: "Server error" });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "username email phone");
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ fullName: user.username });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
}

module.exports = { home, register, login, getAllUsers, forgotPassword,getUserById, resetPassword};