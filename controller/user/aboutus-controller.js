const AboutUs = require("../../models/aboutus-model");

// Create About Us
exports.createAboutUs = async (req, res) => {
    try {
        const aboutUs = new AboutUs(req.body);
        await aboutUs.save();
        res.status(201).json({ message: "About Us added successfully", aboutUs });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get About Us
exports.getAboutUs = async (req, res) => {
    try {
        const aboutUs = await AboutUs.findOne();
        res.json(aboutUs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update About Us
exports.updateAboutUs = async (req, res) => {
    try {
        const updatedAboutUs = await AboutUs.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ message: "About Us updated successfully", updatedAboutUs });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete About Us
exports.deleteAboutUs = async (req, res) => {
    try {
        await AboutUs.findByIdAndDelete(req.params.id);
        res.json({ message: "About Us deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
