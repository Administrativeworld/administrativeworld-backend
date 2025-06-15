import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/UserModel.js";
dotenv.config();

// export async function auth(req, res, next) {
// 	try {
// 		// Get JWT token from cookie, body, or Authorization header
// 		const token =
// 			req.cookies.token ||
// 			req.body.token ||
// 			req.header("Authorization")?.replace("Bearer ", "");

// 		if (!token) {
// 			return res.status(401).json({ success: false, message: "Token Missing" });
// 		}

// 		try {
// 			const decode = await jwt.verify(token, process.env.JWT_SECRET);

// 			const userDoc = await User.findById(decode.id)
// 				.populate("additionalDetails")
// 				.populate({
// 					path: "courses",
// 					populate: {
// 						path: "instructor", // populate instructor inside each course
// 						model: "user", // explicitly mention model if needed
// 						select: "firstName lastName _id",
// 					},
// 				})
// 				.populate({
// 					path: "courses",
// 					populate: {
// 						path: "category", // populate instructor inside each course
// 						model: "Category", // explicitly mention model if needed
// 						select: "name _id",
// 					},
// 				})
// 				.populate({
// 					path: "materials",
// 					populate: [
// 						{
// 							path: "author", // populate author inside each material
// 						}
// 					],
// 				});

// 			req.user = userDoc;
// 			next();
// 		} catch (error) {
// 			return res.status(401).json({ success: false, message: "Token is invalid" });
// 		}
// 	} catch (error) {
// 		return res.status(401).json({
// 			success: false,
// 			message: "Something went wrong while validating the token",
// 		});
// 	}
// }
export async function auth(req, res, next) {
	try {
		const token =
			req.cookies.token ||
			req.body.token ||
			req.header("Authorization")?.replace("Bearer ", "");


		if (!token) {
			return res.status(401).json({ success: false, message: "Token Missing" });
		}

		try {
			const decode = await jwt.verify(token, process.env.JWT_SECRET);
			console.log("Token decoded successfully, user ID:", decode.id);

			const userDoc = await User.findById(decode.id)
				.populate("additionalDetails")
				.populate({
					path: "courses",
					populate: {
						path: "instructor",
						model: "user",
						select: "firstName lastName _id",
					},
				})
				.populate({
					path: "courses",
					populate: {
						path: "category",
						model: "Category",
						select: "name _id",
					},
				})
				.populate({
					path: "materials",
					populate: [
						{
							path: "author",
						}
					],
				});

			if (!userDoc) {
				console.log("User not found in database");
				return res.status(401).json({ success: false, message: "User not found" });
			}

			console.log("User found:", userDoc.email);
			console.log("Current session exists:", userDoc.currentSession ? "YES" : "NO");
			console.log("Session active:", userDoc.currentSession?.isActive);
			console.log("Token match:", userDoc.currentSession?.token === token);

			// Check if current session is valid
			if (!userDoc.currentSession ||
				!userDoc.currentSession.isActive ||
				userDoc.currentSession.token !== token) {

				console.log("Session validation failed - Details:", {
					hasSession: !!userDoc.currentSession,
					isActive: userDoc.currentSession?.isActive,
					tokenMatch: userDoc.currentSession?.token === token,
					dbToken: userDoc.currentSession?.token?.substring(0, 20) + "...",
					reqToken: token?.substring(0, 20) + "..."
				});

				// Clear invalid cookie
				res.clearCookie("token");

				return res.status(401).json({
					success: false,
					message: "Session expired. Please login again.",
					sessionInvalid: true
				});
			}

			req.user = userDoc;
			console.log("Auth middleware successful");
			next();
		} catch (error) {
			console.log("JWT verification failed:", error.message);
			res.clearCookie("token");
			return res.status(401).json({ success: false, message: "Token is invalid" });
		}
	} catch (error) {
		console.log("Auth middleware error:", error);
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