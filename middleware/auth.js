import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/UserModel.js";
dotenv.config();

export async function auth(req, res, next) {
	try {
		// Extracting JWT from request cookies, body or header
		const token =
			req.cookies.token ||
			req.body.token ||
			req.header("Authorization")?.replace("Bearer ", "");

		if (!token) {
			return res.status(401).json({ success: false, message: "Token Missing" });
		}

		try {
			const decode = await jwt.verify(token, process.env.JWT_SECRET);

			const userDoc = await User.findById(decode.id)
				.populate("additionalDetails")
				.populate("courses")          // Add this
				.populate({
					path: "materials",
					populate: {
						path: "studentsPurchase",
						select: "email _id", // only populate these fields
					},
				});
			req.user = userDoc;
		} catch (error) {
			return res.status(401).json({ success: false, message: "Token is invalid" });
		}

		next();
	} catch (error) {
		return res.status(401).json({
			success: false,
			message: "Something went wrong while validating the token",
		});
	}
}


export async function isStudent(req, res, next) {
	try {
		const userDetails = await User.findOne({ email: req.user.email });

		if (userDetails.accountType !== "Student") {
			return res.status(401).json({
				success: false,
				message: "This is a Protected Route for Students",
			});
		}
		next();
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: `User Role Can't be Verified` });
	}
}

export async function isAdmin(req, res, next) {
	try {
		const userDetails = await User.findOne({ email: req.user.email });

		if (userDetails.accountType !== "Admin") {
			return res.status(401).json({
				success: false,
				message: "This is a Protected Route for Admin",
			});
		}
		next();
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: `User Role Can't be Verified` });
	}
}