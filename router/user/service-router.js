const express = require("express");
const { createService, getServiceById,getAllServices, updateService, deleteService } = require("../../controller/user/service-controller");

const router = express.Router();
const upload=require('../../middlewares/service-upload')

router.post("/",upload.single("image"), createService);
router.get("/", getAllServices);  // This should handle POST requests correctly
router.get("/:id", getServiceById);
router.put("/:id",upload.single("image"),updateService);
router.delete("/:id", deleteService);

module.exports = router;
