// Import the required modules
import express from "express";

const router = express.Router();

// Import the required controllers and middleware functions
import { login, signup, sendotp, changePassword, logout } from "../controllers/Auth.js";

import { resetPasswordToken, resetPassword } from "../controllers/resetPassword.js";
import { auth } from "../middleware/auth.js";
import welcome from "../controllers/welcome.js";

// Routes for Login, Signup, and Authentication
router.post("/login", login);
router.post("/signup", signup);
router.post("/sendotp", sendotp);
router.post("/changepassword", auth, changePassword);
router.post("/reset-password-token", resetPasswordToken);
router.post("/reset-password", resetPassword);
router.post("/logout", auth, logout)
router.post("/validate", auth, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});
router.get("/welcome", welcome);

// Export the router for use in the main application
export default router;
