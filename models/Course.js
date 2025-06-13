import mongoose from "mongoose";

const coursesSchema = new mongoose.Schema({
  courseName: { type: String },
  courseDescription: { type: String },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  whatYouWillLearn: {
    type: String,
  },
  courseContent: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
    },
  ],
  ratingAndReviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RatingAndReview",
    },
  ],
  avgRating: {
    type: Number,
    default: 0
  },
  purchases: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
  },
  couponCode: {
    type: String,

  },
  thumbnail: {
    type: String,
  },
  thumbnail_public_id: {
    type: String
  },
  thumbnail_format: {
    type: String
  },
  thumbnail_resource_type: {
    type: String
  },
  thumbnail_bytes: {
    type: Number
  },
  tag: {
    type: [String],
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  instructions: {
    type: [String],
  },
  status: {
    type: String,
    enum: ["Draft", "Published"],
  },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model("Course", coursesSchema);