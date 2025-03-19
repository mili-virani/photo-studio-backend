const stripe = require("stripe")(
  "sk_test_51R27VaRr1DGBjnZ2nXKtivfZ9bKEPCYarybEjp9QDCl7ZepXfMSK31Vlf8cayjvnj9X7KrwCiTFrXAD29Y1GZiS5006qM4irzr"
);
const Payment = require("../../models/payment-model");

exports.createCheckoutSession = async (req, res) => {
  try {
    console.log("Creating checkout session...");
    const { products, order_id, user_id } = req.body;
    console.log("Received data:", { products, order_id, user_id });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: products.map((item) => ({
        price_data: {
          currency: "inr",
          product_data: { name: item.name },
          unit_amount: item.price * 100, // Price in paisa
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `http://localhost:3000/PaymentSuccess?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/payment-failed`,
      metadata: { order_id, user_id },
    });

    console.log("Stripe session created successfully:", session.id);
    // ✅ Payment Details Store in Database Before Payment
    const paymentRecord = await Payment.create({
      order_id,
      user_id,
      payment_id: session.id, // Payment Intent store nathi, but session_id store thashe
      amount: products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      ), // Total Amount
      status: "Pending", // Payment success pachi update kari sakay
    });

    console.log(
      "Payment details saved to database before checkout:",
      paymentRecord
    );

    res.json({ id: session.id });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    res.status(500).json({ error: "Payment failed" });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { session_id } = req.body;
    console.log("🔍 Received session_id:", session_id); // ✅ Debugging

    // Check if session_id is valid
    if (!session_id) {
      return res.status(400).json({ error: "Session ID is required" });
    }

    const payment = await Payment.findOneAndUpdate(
      { payment_id: session_id }, // Search for the correct payment
      { status: "Paid" }, // Update status to "Paid"
      { new: true }
    );

    if (!payment) {
      console.log("❌ Payment not found for session_id:", session_id);
      return res.status(404).json({ error: "Payment not found" });
    }

    console.log("✅ Payment updated successfully:", payment);
    res.json(payment);
  } catch (error) {
    console.error("⚠️ Payment status update error:", error);
    res.status(500).json({ error: "Failed to update payment status" });
  }
};
exports.getPaymentDetails = async (req, res) => {
    try {
      console.log("Step 1: Fetching payment documents from the database...");
      const payments = await Payment.find().populate("user_id", "username email phone");
      console.log("Step 1: Payments fetched from DB:", payments);
  
      // Process each payment to enrich with Stripe data
      const enrichedPayments = await Promise.all(
        payments.map(async (payment) => {
          console.log(`\nProcessing Payment ID: ${payment.payment_id}`);
          
          // Retrieve the checkout session with expanded Payment Intent and Charges
          const session = await stripe.checkout.sessions.retrieve(payment.payment_id, {
            expand: ["payment_intent", "payment_intent.charges"],
          });
          console.log(`Retrieved Stripe session for Payment ID ${payment.payment_id}:`, JSON.stringify(session));
          
          const pi = session.payment_intent;
          console.log(`Payment Intent for Payment ID ${payment.payment_id}:`, JSON.stringify(pi));
          
          // Extract the first charge object from the Payment Intent
          const chargeObj = pi?.charges?.data?.[0];
          console.log(`Charge object for Payment ID ${payment.payment_id}:`, chargeObj);
          
          // Extract card details (brand, last4)
          const cardDetails = chargeObj?.payment_method_details?.card;
          console.log(`Card details for Payment ID ${payment.payment_id}:`, cardDetails);
  
          return {
            ...payment.toObject(),
            stripeCardBrand: cardDetails?.brand || null,
            stripeCardLast4: cardDetails?.last4 || null,
          };
        })
      );
  
      console.log("Final enriched payments:", enrichedPayments);
      res.status(200).json({ success: true, data: enrichedPayments });
    } catch (error) {
      console.error("Error fetching payment details from Stripe:", error);
      res.status(500).json({ success: false, message: "Failed to fetch payment details" });
    }
  };
  
  
