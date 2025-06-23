import mongoose from 'mongoose';

const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  content: {
    type: String, // Save HTML content here
    required: true,
  },

  thumbnail: {
    type: String, // Image URL
    required: false, // Optional but recommended
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },

  tags: {
    type: [String], // Example: ["UPSC", "IAS", "Civil Services"]
    default: [],
  },

  author: {
    type: mongoose.Schema.Types.ObjectId, // Admin User ID (Optional: can also just save name)
    ref: 'user', // Reference to User model
    required: false,
  },

  metaTitle: {
    type: String,
    required: true,
  },

  metaDescription: {
    type: String,
    required: true,
  },

  keywords: {
    type: [String],
    default: [],
  },

  views: {
    type: Number,
    default: 0,
  },

  isFeatured: {
    type: Boolean,
    default: false, // For home page highlights
  },

  isTrending: {
    type: Boolean,
    default: false, // For trending sections
  },

  status: {
    type: String,
    enum: ['Draft', 'Published'],
    default: 'Draft',
  },

  publishedAt: {
    type: Date,
    default: null, // Set when article is published
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Article', ArticleSchema);
