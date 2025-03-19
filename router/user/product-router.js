const express = require("express");
const router = express.Router();
const productController = require("../../controller/user/product-controller");
const multer = require("multer");

// Multer Setup for Image Upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/shop/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Routes
router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);
router.post("/", upload.single("image"), productController.createProduct);
router.put("/:id", upload.single("image"), productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
