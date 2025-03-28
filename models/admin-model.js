const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String, // Store the URL of the profile picture
        default: "/profile-uploads/admin-avatar.png"
    },
    resetOTP: { 
        type: String  // Store OTP
    },
    otpExpiry: { 
        type: Date  // Store OTP expiration time
    }
   
},{timestamps: true});

// Export the model
const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
