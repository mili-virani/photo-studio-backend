const Product = require("../../models/product-model");
const Notification = require("../../models/notification-model"); // Import Notification model
const nodemailer = require("nodemailer");
require("dotenv").config();

let ioInstance; // Store WebSocket instance

// Function to set the WebSocket instance
const setIoInstance = (io) => {
  ioInstance = io;
};

// Configure Nodemailer for sending emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send emails
const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// 📌 GET all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error });
  }
};

// 📌 GET single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error });
  }
};

// 📌 CREATE a new product (Store notification, send email & real-time update)
exports.createProduct = async (req, res) => {
  try {
    const { name, price, originalPrice, category, stock, emailList } = req.body;
    const image = req.file ? `/images/shop/${req.file.filename}` : null;

    const newProduct = new Product({ name, image, price, originalPrice, category, stock });
    await newProduct.save();
    console.log("product saved successfully!");


    // 📌 Store notification in MongoDB
    const notification = new Notification({
      message: `New Product Added: ${name} - ₹${price}`,
      type: "new_product",
      productId: newProduct._id,
    });
    // console.log("Saving notification:", notification);

    await notification.save();
    // console.log("Notification saved successfully!");

    // 📌 Emit real-time notification via WebSocket
    if (ioInstance) {
      ioInstance.emit("newNotification", notification);
    }

    // 📌 Send email notifications
    if (emailList && emailList.length > 0) {
      const emailText = `A new product "${name}" has been added to our store. Check it out now!`;
      emailList.forEach((email) => sendEmail(email, "New Product Alert!", emailText));
    }

    res.status(201).json({ message: "Product added successfully", newProduct });
  } catch (error) {
    res.status(500).json({ message: "Failed to add product", error });
  }
};

// 📌 UPDATE product (Notify users about price drops)
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, originalPrice, category, stock, emailList } = req.body;
    let updatedData = { name, price, originalPrice, category, stock };

    if (req.file) {
      updatedData.image = `/images/shop/${req.file.filename}`;
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const oldPrice = product.price;
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    // 📌 Notify users if the price drops
    if (oldPrice > price) {
      const notification = new Notification({
        message: `Price Drop Alert: ${name} is now ₹${price}!`,
        type: "price_drop",
      });
      await notification.save();

      if (ioInstance) {
        ioInstance.emit("newNotification", notification);
      }

      if (emailList && emailList.length > 0) {
        const emailText = `Great news! The price of "${name}" has dropped from ₹${oldPrice} to ₹${price}. Hurry up and grab the deal!`;
        emailList.forEach((email) => sendEmail(email, "Price Drop Alert!", emailText));
      }
    }

    res.json({ message: "Product updated successfully", updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Failed to update product", error });
  }
};

// 📌 DELETE product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product", error });
  }
};

// 📌 GET all notifications (To show in Notification Page)
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }); // Latest first
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications", error });
  }
};

// Export WebSocket setter
exports.setIoInstance = setIoInstance;
