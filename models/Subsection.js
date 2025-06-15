import mongoose from "mongoose";

const SubSectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  timeDuration: { type: String, default: "N/A" },
  description: { type: String },
  videoUrl: { type: String, required: true },
  videoType: { type: String, enum: ["YouTube", "Uploaded"], required: true },

});

export default mongoose.model("SubSection", SubSectionSchema);
