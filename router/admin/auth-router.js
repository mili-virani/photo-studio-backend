const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../../models/admin-model"); // Capitalize model name
const upload=require('../../middlewares/profile-upload')
const path = require("path");
const fs = require("fs");


const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET_KEY || "Online_Studio"; // Store securely

// Admin Registration Route
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) return res.status(400).json({ msg: "Admin already exists" });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new admin
        const newAdmin = new Admin({ name, email, password: hashedPassword });
        await newAdmin.save();

        res.status(201).json({ msg: "Admin created successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// Admin Login Route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if admin exists
        const admin = await Admin.findOne({ email }); // Fixed model reference
        if (!admin) return res.status(400).json({ msg: "Invalid credentials" });

        // Compare passwords
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        // Generate JWT token
        const token = jwt.sign(
            { id: admin._id, name: admin.name, email: admin.email },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            msg: `Welcome, ${admin.name}!`,
            token,
            admin: {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                profilePicture: admin.profilePicture || null
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

router.delete("/delete-profile-pic/:adminId", async (req, res) => {
    try {
        const { adminId } = req.params;
        
        // Find the admin by ID
        const admin = await Admin.findById(adminId);
        // console.log("admin",admin);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // Check if profile picture exists
        if (!admin.profilePicture) {
            return res.status(400).json({ message: "No profile picture found" });
        }

        // Define file path
        const filePath = path.join(__dirname, "../../profile-uploads", admin.profilePicture);

        // Delete the file from the server
        fs.unlink(filePath, async (err) => {
            if (err && err.code !== "ENOENT") {
                return res.status(500).json({ message: "Error deleting profile picture" });
            }

            // Update the admin record to remove the profile picture reference
            admin.profilePicture = "/profile-uploads/default-avatar.jpg"; // Set to the default image
            await admin.save();

            return res.status(200).json({ message: "Profile picture deleted successfully" });
        });
    } catch (error) {
        console.error("Error deleting profile picture:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


router.put("/update-profile/:id", upload.single("profilePicture"), async (req, res) => {
    try {
        const { name, email } = req.body;
        const adminId = req.params.id;

        // Find the existing admin data
        const existingAdmin = await Admin.findById(adminId);
        if (!existingAdmin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // Prepare updateData, ensuring existing values remain if not provided
        let updateData = {
            name: name || existingAdmin.name,  // Keep old name if not updated
            email: email || existingAdmin.email, // Keep old email if not updated
            profilePicture: existingAdmin.profilePicture, // Default to existing profile pic
        };

        // If a new profile picture is uploaded, update it
        if (req.file) {
            updateData.profilePicture = `http://localhost:8000/profile-uploads/${req.file.filename}`;
        }

        // Update admin data
        const updatedAdmin = await Admin.findByIdAndUpdate(adminId, updateData, { new: true });

        res.status(200).json(updatedAdmin);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Fetch Admin Profile by ID
router.get("/:id", async (req, res) => {
    try {
        const adminId = req.params.id;
        const admin = await Admin.findById(adminId).select("-password"); // Exclude password

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.status(200).json(admin);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});



module.exports = router;
