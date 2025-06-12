import mongoose from "mongoose";

const bookStoreComboSchema = new mongoose.Schema({
  comboTitle: {
    type: String,
    required: true,
    trim: true
  },

  comboDescription: {
    type: String,
    trim: true
  },

  includedMaterials: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store", // Referencing your bookstore items
      required: true
    }
  ],

  comboPrice: {
    type: Number,
    required: true,
    default: 0
  },

  isFree: {
    type: Boolean,
    default: false
  },

  discountType: {
    type: String,
    enum: ["PercentOff", "RupeesOff", "None"],
    default: "None"
  },

  discount: {
    type: Number,
    default: 0
  },
  finalPrice: {
    type: Number,
  },

  purchases: {
    type: Number,
    default: 0
  },
  // Optional: Combo Thumbnail
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
  studentPurchases: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // Referencing your bookstore items
    required: true
  },
  status: {
    type: String,
    enum: ["Draft", "Published"],
    default: "Draft"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("BookStoreCombo", bookStoreComboSchema);
