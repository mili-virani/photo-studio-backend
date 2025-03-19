const Category = require("../../models/category-model");

// 📌 Create a new category
const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({
      name: name.trim().toLowerCase(),
    });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    // Generate a unique `cat_id` (incremental)
    const lastCategory = await Category.findOne().sort({ cat_id: -1 }); // Find latest `cat_id`
    const newCatId = lastCategory ? lastCategory.cat_id + 1 : 1; // Increment or start from 1

    // Create and save new category
    const newCategory = new Category({ cat_id: newCatId, name: name.trim() });
    await newCategory.save();

    return res
      .status(201)
      .json({
        message: "Category created successfully",
        category: newCategory,
      });
  } catch (error) {
    console.error("Error creating category:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// 📌 Get all categories
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 }); // Latest first
    return res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// 📌 Get single category by ID
const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findOne({ cat_id: req.params.id });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// 📌 Update category by ID
const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params; // Fetching ObjectId from URL params
    console.log("name:", name);
    console.log("id:", id);

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id, // Use `_id` instead of `cat_id`
      { name: name.trim() },
      { new: true } // Return updated category
    );
    console.log("updated data", updatedCategory);

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res
      .status(200)
      .json({
        message: "Category updated successfully",
        category: updatedCategory,
      });
  } catch (error) {
    console.error("Error updating category:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// 📌 Delete category by ID
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params; // Fetch ObjectId from request params

        const deletedCategory = await Category.findByIdAndDelete(id); // Use `_id` instead of `cat_id`

        if (!deletedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }

        return res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error("Error deleting category:", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};


module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
