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
    enum: ["Notes", "TestSeries", "Material", "Books"],
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

  // 🖼️ Thumbnail info
  thumbnailUrl: {
    type: String
  },
  thumbnail_public_id: {
    type: String
  },
  thumbnail_format: {
    type: String
  },
  thumbnail_bytes: {
    type: Number
  },

  // 📄 PDF/download info
  downloadUrl: {
    type: String,
    required: true
  },
  pdf_public_id: {
    type: String
  },
  pdf_format: {
    type: String
  },
  pdf_bytes: {
    type: Number
  },

  // 📊 Reviews & purchases
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
