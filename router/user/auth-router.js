const express = require("express");
const { home, register, login, getAllUsers, forgotPassword, getUserById, resetPassword, resetPasswordForAdmin,contactSendEmail} = require("../../controller/user/auth-controller");
const { getProfile ,updateProfile} = require("../../middlewares/profile");
const router = express.Router();
const authMiddleware=require("../../controller/user/auth")
router.get("/", home);
router.post("/register", register);
router.post("/login", login);
router.get("/users", getAllUsers);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/reset-password-admin", resetPasswordForAdmin);
router.post("/send-email", contactSendEmail);
router.get("/users/:id", getUserById);
router.get("/profile", authMiddleware, getProfile);  
router.put("/profile", authMiddleware, updateProfile); 
module.exports = router;