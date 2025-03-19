const mongoose = require("mongoose");

const aboutUsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description1: { type: String, required: true },
    description2: { type: String, required: true },
    description3: { type: String, required: true },
    features: { type: [String], required: true }
}, { timestamps: true });

module.exports = mongoose.model("AboutUs", aboutUsSchema);
