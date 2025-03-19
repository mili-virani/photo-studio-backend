const Service = require("../../models/service-model");
const mongoose = require("mongoose");

// ✅ Create a New Service
const createService = async (req, res) => {
    try {
        const { service_name, description, price, category_id, image_url, duration } = req.body;
       
        const imageUrl = req.file ? `/service-uploads/${req.file.filename}` : null; // Save file path

        console.log("Req.body", imageUrl);
        // Validate required fields
        if (!imageUrl || !service_name || !description || !price || !category_id) {
            return res.status(400).json({ success: false, message: "All fields are required, except image and duration." });
        }

        // Ensure price is a positive number
        if (price <= 0) {
            return res.status(400).json({ success: false, message: "Price must be greater than 0." });
        }

        // Validate category_id
        if (!mongoose.Types.ObjectId.isValid(category_id)) {
            return res.status(400).json({ success: false, message: "Invalid category ID." });
        }

        const newService = new Service({ service_name, description, price, category_id, image_url: imageUrl, duration });
        await newService.save();

        return res.status(201).json({ success: true, message: "Service created successfully!", data: newService });
    } catch (error) {
        console.error("Error creating service:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};




// ✅ Fetch All Services (or Filter by Category ID)
const getAllServices = async (req, res) => {
    try {
        const { category_id } = req.query; // Get category ID from query params

        let filter = {};
        if (category_id) {
            if (!mongoose.Types.ObjectId.isValid(category_id)) {
                return res.status(400).json({ success: false, message: "Invalid category ID." });
            }
            filter.category_id = category_id; // Apply category filter
        }

        const services = await Service.find(filter).populate("category_id", "name");

        res.status(200).json({ success: true, data: services });
    } catch (error) {
        console.error("Error fetching services:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// ✅ Get Service by ID (with category details)
const getServiceById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid service ID." });
        }

        const service = await Service.findById(id).populate("category_id", "name");

        if (!service) {
            return res.status(404).json({ success: false, message: "Service not found." });
        }

        res.status(200).json({ success: true, data: service });
    } catch (error) {
        console.error("Error fetching service:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// ✅ Update Service
// const updateService = async (req, res) => {
//     try {
//         const { id } = req.params;

//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({ success: false, message: "Invalid service ID." });
//         }

//         const updatedService = await Service.findByIdAndUpdate(id, req.body, { new: true });

//         if (!updatedService) {
//             return res.status(404).json({ success: false, message: "Service not found." });
//         }

//         res.status(200).json({ success: true, message: "Service updated successfully!", data: updatedService });
//     } catch (error) {
//         console.error("Error updating service:", error);
//         res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// };
// const updateService = async (req, res) => {
//     try {
//         const { id } = req.params;

//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({ success: false, message: "Invalid service ID." });
//         }

//         // Find existing service
//         const existingService = await Service.findById(id);
//         if (!existingService) {
//             return res.status(404).json({ success: false, message: "Service not found." });
//         }

//         // Create an update object
//         const updateData = { ...req.body };
//         console.log("update data ", updateData);
//         // If an image file is uploaded, update the image path
//         if (req.file) {
//             updateData.image = `/service-uploads/${req.file.filename}`;
//         }

//         // Update the service
//         const updatedService = await Service.findByIdAndUpdate(id, updateData, { new: true });

//         res.status(200).json({
//             success: true,
//             message: "Service updated successfully!",
//             data: updatedService,
//         });

//     } catch (error) {
//         console.error("Error updating service:", error);
//         res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// };
const updateService = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid service ID." });
        }

        // Extract update data from req.body
        const updateData = { ...req.body };

        // Check if an image was uploaded
        if (req.file) {
            updateData.image_url = `/service-uploads/${req.file.filename}`;
        }

        console.log("Updated Data: ", updateData); // Debugging

        const updatedService = await Service.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedService) {
            return res.status(404).json({ success: false, message: "Service not found." });
        }

        res.status(200).json({ success: true, message: "Service updated successfully!", data: updatedService });
    } catch (error) {
        console.error("Error updating service:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};



// ✅ Delete Service
const deleteService = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid service ID." });
        }

        const deletedService = await Service.findByIdAndDelete(id);

        if (!deletedService) {
            return res.status(404).json({ success: false, message: "Service not found." });
        }

        res.status(200).json({ success: true, message: "Service deleted successfully!" });
    } catch (error) {
        console.error("Error deleting service:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports = {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService,
};
