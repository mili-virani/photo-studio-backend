require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const Admin = require("../../models/admin-model"); // Ensure path is correct

const router = express.Router();

// Password change route
router.put("/change-password", async (req, res) => {
  const { adminId, currentPassword, newPassword, email } = req.body;

  if (!adminId || !currentPassword || !newPassword || !email) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // ✅ Find admin in DB
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    // ✅ Ensure password is present in DB
    if (!admin.password) {
      return res.status(500).json({ error: "Stored password is missing in DB." });
    }
    // ✅ Verify current password
    const isMatch = await bcrypt.compare(currentPassword, admin.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect current password" });
    }

    // ✅ Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();

    console.log("✅ Password Changed Successfully for Admin:", adminId);

    // ✅ Send email notification
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS, // Ensure this is set in .env
      },
    });

    let mailOptions = {
      from: `"Admin Support" <${process.env.EMAIL}>`,
      to: email,
      subject: "🔒 Password Changed Successfully",
      html: `
        <h2>Password Changed Successfully</h2>
        <p>Your password has been updated. If this wasn't you, please contact support.</p>
        <br />
        <p>Best Regards,</p>
        <p><strong>Admin Support Team</strong></p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password changed & email sent successfully." });

  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: "Server error. Try again later." });
  }
});

module.exports = router;
