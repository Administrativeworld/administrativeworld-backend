const mongoose = require("mongoose");

const SubSectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  timeDuration: { type: String, default: "N/A" }, 
  description: { type: String },
  videoUrl: { type: String, required: true },
  videoType: { type: String, enum: ["YouTube", "Uploaded"], required: true },
});

module.exports = mongoose.model("SubSection", SubSectionSchema);
