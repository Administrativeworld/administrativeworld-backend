import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User", // References the User model
	},
	gender: {
		type: String,
		enum: ["Male", "Female", "Other"],
	},
	dateOfBirth: {
		type: String,
	},
	about: {
		type: String,
		trim: true,
		minlength: 10,
		maxlength: 500,
	}
});

export default mongoose.model("Profile", profileSchema);
