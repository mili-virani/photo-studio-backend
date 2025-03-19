const { Schema, model, default: mongoose } = require("mongoose");

const gallerySchema = new Schema(
  {
    p_id: {
      type: Number,
      required: true,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Category",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true, 
    },
    image_url: {
      type: String,
      required: true,
      maxlength: 500, 
    },
    description: {
      type: String,
      required: true,
      maxlength: 500,
    },
    price: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Gallery = model("Gallery", gallerySchema);
module.exports = Gallery;
