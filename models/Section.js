import mongoose from "mongoose";

// Define the Section schema with exercises support
const sectionSchema = new mongoose.Schema({
	sectionName: {
		type: String
	},
	subSection: [
		{
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "SubSection"
		}
	],
	exercises: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Exercise"
		}
	],
	createdAt: {
		type: Date,
		default: Date.now
	}
});

export default mongoose.model("Section", sectionSchema);