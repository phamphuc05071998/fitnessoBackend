const mongoose = require("mongoose");

const gymCourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  instructor: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  schedule: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: String,
  },
  type: [
    {
      type: String,
      default: "training",
    },
  ],
});

const GymCourse = mongoose.model("GymCourse", gymCourseSchema);

module.exports = GymCourse;
