import mongoose from "mongoose";

const courseCreationSchema = new mongoose.Schema({
  creation: { type: Boolean, required: true },
  creationStep: { type: Number, required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true }
});

export default mongoose.model("CourseCreation", courseCreationSchema);
