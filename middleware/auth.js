const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/UserModel");
dotenv.config();

const authentication = async (req, res, next) => {
	try {
		// Extracting JWT from request cookies, body, or header
		const token =
			req.cookies.token ||
			req.body.token ||
			req.header("Authorization").replace("Bearer ", "");

		// If JWT is missing, return 401 Unauthorized response
		if (!token) {
			return res.status(400).json({ success: false, message: "Token Missing" });
		}

		try {
			// Verifying the JWT using the secret key stored in environment variables
			const decode = jwt.verify(token, process.env.JWT_SECRET);
			// Fetching the user's details from the database
			const user = await User.findOne({ email: decode.email });

			if (!user) {
				return res.status(404).json({ success: false, message: "User not found" });
			}

			// Storing the decoded JWT payload and user document in the request object for further use
			req.user = user;
		} catch (error) {
			// If JWT verification fails, return 401 Unauthorized response
			if (error.name === "JsonWebTokenError") {
				return res.status(401).json({ success: false, message: "Token is invalid" });
			} else if (error.name === "TokenExpiredError") {
				return res.status(401).json({ success: false, message: "Token expired" });
			} else {
				console.error("Token verification error:", error);
				return res.status(500).json({ success: false, message: "Internal server error" });
			}
		}

		// If JWT is valid, move on to the next middleware or request handler
		next();
	} catch (error) {
		// If there is an error during the authentication process, return 500 Internal Server Error response
		return res.status(500).json({
			success: false,
			message: "Something went wrong while validating the token",
		});
	}
};

module.exports = authentication;
