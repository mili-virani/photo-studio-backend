const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    image: {
        type: String,
        required: true
    }, 
    price: {
        type: Number,
        required: true
    }, 
    originalPrice: {
        type: Number
    }, 
    category: {
        type: String,
        required: true
    }, 
    stock: {
        type: Number,
        required: true,
        min: 0
    }, 
}, { timestamps: true }); 

const Product = mongoose.model("Product", productSchema);

module.exports = Product; 
