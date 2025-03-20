const mongoose = require("mongoose");
const serviceSchema = new mongoose.Schema(
    {
        service_name: {
            type: String,
            required: true,
            maxlength: 100, // Allows meaningful names
        },
        description: {
            type: String,
            required: true,
            maxlength: 500, // More detailed descriptions
        },
        price: {
            type: Number,
            required: true,
            min: 0, // Ensures price is non-negative
        },
        category_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true, // Service must belong to a category
        },
        image_url: {
            type: String,
            required: false, // Optional but useful
        },
        duration: {
            type: String,
            required: false, // Example: "2 hours", "Full day"
        }
    },
    { timestamps: true }
);

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
