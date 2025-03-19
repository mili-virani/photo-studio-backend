const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true  // Ensures no duplicate emails
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isadmin: {
        type: Boolean,
        default: false
    },
    resetOTP: { 
        type: String  // Store OTP
    },
    otpExpiry: { 
        type: Date  // Store OTP expiration time
    }
});

// Define the model and collection name
const User = mongoose.model("User", userSchema);

module.exports = User;
