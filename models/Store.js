import mongoose from "mongoose";

const bookstoreSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ["Notes", "TestSeries", "Material","Books"],
    required: true
  },
  author: {
    type: String
  },
  price: {
    type: Number,
    required: true,
    default: 0
  },
  isFree: {
    type: Boolean,
    default: false
  },
  thumbnailUrl: {
    type: String
  },
  downloadUrl: {
    type: String,
    required: true
  },
  ratingAndReviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RatingAndReview",
    },
  ],
  studentsPurchase: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user",
      },
    ],
  purchases: {
        type: Number,
        default: 0
    },
  status: {
    type: String,
    enum: ["Draft", "Published"],
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Store", bookstoreSchema);