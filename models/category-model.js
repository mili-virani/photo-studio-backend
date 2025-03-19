const { Schema, model, default: mongoose } = require("mongoose");

const categorySchema = new Schema(
  {
    cat_id: {
      type: Number,
      required: true,
      unique: true, // Ensures uniqueness
    },
    name: {
      type: String,
      required: true,
      trim: true, // Removes extra spaces
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
