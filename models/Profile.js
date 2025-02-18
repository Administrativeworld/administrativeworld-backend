const mongoose = require("mongoose");

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
	},
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
});

module.exports = mongoose.model("Profile", profileSchema);
