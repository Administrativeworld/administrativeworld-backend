import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/UserModel.js";
dotenv.config();

export async function auth(req, res, next) {
	try {
		// Get JWT token from cookie, body, or Authorization header
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
				.populate({
					path: "courses",
					populate: {
						path: "instructor", // populate instructor inside each course
						model: "user", // explicitly mention model if needed
						select: "firstName lastName _id",
					},
				})
				.populate({
					path: "courses",
					populate: {
						path: "category", // populate instructor inside each course
						model: "Category", // explicitly mention model if needed
						select: "name _id",
					},
				})
				.populate({
					path: "materials",
					populate: [
						{
							path: "author", // populate author inside each material
						}
					],
				});

			req.user = userDoc;
			next();
		} catch (error) {
			return res.status(401).json({ success: false, message: "Token is invalid" });
		}
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