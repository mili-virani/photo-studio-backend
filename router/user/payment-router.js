const express = require("express");
const router = express.Router();
const paymentController = require("../../controller/user/payment-controller");

router.post("/create-checkout-session", paymentController.createCheckoutSession);
// router.post("/webhook", express.raw({ type: "application/json" }), paymentController.handlePaymentSuccess);
router.post("/update-payment-status",paymentController.updatePaymentStatus);
router.get("/payments/details",paymentController.getPaymentDetails);
module.exports = router;

