import mongoose from "mongoose";

// Define the Question schema
const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true
  },
  questionType: {
    type: String,
    enum: ["long-answer"],
    default: "long-answer"
  },
  points: {
    type: Number,
    default: 10
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Question", questionSchema);