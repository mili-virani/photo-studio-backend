const express = require("express");
const multer = require("multer");
const path = require("path");
const faceController = require("../../controller/user/face-controller");

const router = express.Router();

// Multer setup for file upload
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

// Define routes
router.post("/upload-gallery", upload.single("image"), faceController.uploadGalleryImage);
router.post("/search-face", upload.single("image"), faceController.searchFace);

module.exports = router;
