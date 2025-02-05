const mongoose = require("mongoose");


const categorySchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	description: { type: String },
	courses: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Course",
		},
	],
	Post: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
		},
	],
});

module.exports = mongoose.model("Category", categorySchema);