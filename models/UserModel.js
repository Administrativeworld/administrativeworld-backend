import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
      default: ' '
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        // Only require password if it's NOT a Google OAuth user
        return !this.googleId && this.provider === 'local';
      }
    },
    googleId: {
      type: String,
      sparse: true, // Allows multiple null values
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    accountType: {
      type: String,
      enum: ["Admin", "Student", "Google"],
      default: "Student",
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    approved: {
      type: Boolean,
      default: true,
    },
    additionalDetails: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "Profile",
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    materials: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store",
      },
    ],
    post: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    token: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    image: {
      type: String,
    },
    image_public_id: {
      type: String
    },
    image_format: {
      type: String
    },
    image_resource_type: {
      type: String
    },
    image_bytes: {
      type: Number
    },
    courseProgress: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "courseProgress",
      },
    ],
    contactNumber: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v);
        },
        message: "Contact number must be a valid 10-digit number.",
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("user", userSchema);