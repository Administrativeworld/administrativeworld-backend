const mongoose = require("mongoose");

const courseCreationSchema = new mongoose.Schema({
  creation: { type: Boolean, required: true },
  creationStep: { type: Number, required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true }
});

module.exports = mongoose.model("CourseCreation", courseCreationSchema);
