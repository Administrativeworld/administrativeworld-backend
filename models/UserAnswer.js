import mongoose from "mongoose";

// Define the UserAnswer schema
const userAnswerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  exercise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exercise",
    required: true
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true
  },
  answerText: {
    type: String,
    default: ""
  },
  attachmentUrl: {
    type: String
  },
  attachment_public_id: {
    type: String
  },
  attachment_format: {
    type: String
  },
  attachment_resource_type: {
    type: String,
    default: "image"
  },
  attachment_bytes: {
    type: Number
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  isSubmitted: {
    type: Boolean,
    default: false
  },
  isChecked: {
    type: Boolean,
    default: false
  }
});

// Create compound index for user, exercise, and question combination
userAnswerSchema.index({ user: 1, exercise: 1, question: 1 }, { unique: true });

export default mongoose.model("UserAnswer", userAnswerSchema);