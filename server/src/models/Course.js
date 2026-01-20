const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      default: 0
    },
    category: {
      type: String,
      default: "Development"
    },
    image: {
      type: String,
      default: "https://placehold.co/600x400?text=EduTalks"
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    discount: {
      type: Number,
      default: 0
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
