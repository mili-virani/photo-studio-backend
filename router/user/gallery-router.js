const express = require("express");
const {
    createGallery,
    getAllGalleries,
    getGalleryById,
    updateGallery,
    deleteGallery
} = require("../../controller/user/gallery-controller");

const router = express.Router();
const upload=require('../../middlewares/upload')

router.post("/g1", upload.single("image"), createGallery);
router.get("/", getAllGalleries);
router.get("/:id", getGalleryById);
router.put("/:id", upload.single("image"), updateGallery)
router.delete("/:id", deleteGallery);

module.exports = router;
