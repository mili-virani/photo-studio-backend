const express = require('express');
const { sendResetEmail, verifyOTP, resendOTP } = require('../../controller/user/otp-controller');
const router = express.Router();

router.post('/send-otp', sendResetEmail);  // Send OTP for password reset
router.post('/verify-otp', verifyOTP);     // Verify OTP
router.post('/resend-otp', resendOTP);     // Resend OTP

module.exports = router;
