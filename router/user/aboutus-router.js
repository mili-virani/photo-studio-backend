const express = require("express");
const { 
    createAboutUs, 
    getAboutUs, 
    updateAboutUs, 
    deleteAboutUs 
} = require("../../controller/user/aboutus-controller");

const router = express.Router();

router.post("/", createAboutUs);
router.get("/", getAboutUs);
router.put("/:id", updateAboutUs);
router.delete("/:id", deleteAboutUs);

module.exports = router;
