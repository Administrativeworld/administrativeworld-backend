// Import the required modules
import express from "express";
import passport from "passport";
const router = express.Router();

// Import the required controllers and middleware functions
import { login, signup, sendotp, changePassword, logout, handleGoogleCallback, handleLogout } from "../controllers/Auth.js";

import { resetPasswordToken, resetPassword } from "../controllers/resetPassword.js";
import { auth } from "../middleware/auth.js";
import welcome from "../controllers/welcome.js";

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: `${process.env.FRONTEND_URL}login` }),
  handleGoogleCallback
);
router.get("/logout", handleLogout);
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
