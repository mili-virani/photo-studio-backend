const Gallery = require("../../models/gallery-model");
const Category = require("../../models/category-model");

const createGallery = async (req, res) => {
    try {
        const { description, category_id, title, price } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; // Save file path

        console.log("Received Data:", req.body);
        console.log("Image URL:", imageUrl);

        if (!imageUrl || !description || !category_id || !title || !price) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const categoryExists = await Category.findById(category_id);
        if (!categoryExists) {
            return res.status(400).json({ message: "Invalid category ID" });
        }

        const lastGallery = await Gallery.findOne().sort({ p_id: -1 });
        const newPId = lastGallery ? lastGallery.p_id + 1 : 1;

        const newGallery = new Gallery({
            p_id: newPId,
            image_url: imageUrl,
            description,
            category_id,
            title,
            price,
        });

        await newGallery.save();

        return res.status(201).json({ message: "Gallery item created successfully", gallery: newGallery });
    } catch (error) {
        console.error("Error creating gallery item:", error);
        res.status(500).json({ message: error.message });
    }
};


// Get all gallery items
const getAllGalleries = async (req, res) => {
    try {
        const galleries = await Gallery.find().populate("category_id", "name"); // Populate category name only
        res.status(200).json(galleries);
    } catch (error) {
        console.error("Error fetching gallery items:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

// Get a single gallery item by ID
const getGalleryById = async (req, res) => {
    try {
        const { id } = req.params;
        const gallery = await Gallery.findById(id).populate("category_id"); // ✅ Correct usage

        if (!gallery) {
            return res.status(404).json({ message: "Gallery item not found" });
        }

        res.status(200).json(gallery);
    } catch (error) {
        console.error("Error fetching gallery item:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};


// Update a gallery item
const updateGallery = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("🔹 Received Data:", req.body);

        const existingGallery = await Gallery.findById(id);
        if (!existingGallery) {
            return res.status(404).json({ message: "Gallery item not found" });
        }

        // Handle image update
        let imagePath = existingGallery.image_url; // Keep old image by default
        if (req.file) {
            imagePath = `/uploads/${req.file.filename}`; // Save new file path
        }

        const updateData = {
            category_id: req.body.category_id,
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            image_url: imagePath,
        };

        console.log("🔹 Updating Data:", updateData);
        const updatedGallery = await Gallery.findByIdAndUpdate(id, updateData, { new: true });

        console.log("✅ Updated Gallery:", updatedGallery);
        res.status(200).json({ message: "Gallery updated successfully", gallery: updatedGallery });
    } catch (error) {
        console.error("❌ Error updating gallery:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

// Delete a gallery item
const deleteGallery = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedGallery = await Gallery.findByIdAndDelete(id);

        if (!deletedGallery) return res.status(404).json({ message: "Gallery item not found" });

        res.status(200).json({ message: "Gallery item deleted successfully" });
    } catch (error) {
        console.error("Error deleting gallery item:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

module.exports = {
    createGallery,
    getAllGalleries,
    getGalleryById,
    updateGallery,
    deleteGallery,
};
