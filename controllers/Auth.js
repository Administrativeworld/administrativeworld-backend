import bcrypt from "bcrypt";
import User from "../models/UserModel.js";
import OTP from "../models/Otp.js";
import crypto from "crypto";

import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import mailSender from "../utils/MailSender.js";
import passwordResetLinkTemplate from "../mail/templates/passwordResetLinkTemplate.js";
import { passwordUpdated } from "../mail/templates/passwordUpdate.js";
import Profile from "../models/Profile.js";
import dotenv from "dotenv";
import PasswordResetToken from "../models/PasswordResetToken.js";
dotenv.config();


// Signup
export async function signup(req, res) {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      contactNumber,
      otp,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(422).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password do not match. Please try again.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists. Please sign in to continue.",
      });
    }

    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    if (response.length === 0) {
      return res.status(404).json({
        success: false,
        message: "The OTP is not valid",
      });
    } else if (otp !== response[0].otp) {
      return res.status(401).json({
        success: false,
        message: "The OTP is not valid",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let approved = "";
    approved === "Instructor" ? (approved = false) : (approved = true);

    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      approved: approved,
      additionalDetails: profileDetails._id,
      image: "",
    });

    return res.status(201).json({
      success: true,
      user,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again.",
    });
  }
}

// Login
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    console.log("auth login called")
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all the required fields",
      });
    }

    const user = await User.findOne({ email }).populate("additionalDetails");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered with us. Please sign up to continue.",
      });
    }

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { email: user.email, id: user._id, role: user.accountType },
        process.env.JWT_SECRET,
        { expiresIn: "3d" } // changed from "24h" to "3d"
      );



      // Save token to user document
      await User.findOneAndUpdate(
        { email: email },
        { $set: { token: token } },
        { new: true }
      );

      // Cookie settings for web authentication
      const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        path: "/",
        maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days in milliseconds
      };



      // Always return the token in the response body
      const responsePayload = {
        success: true,
        token, // Always return the token
        user,
        message: "User login successful",
      };
      return res.cookie("token", token, options).status(200).json(responsePayload);

    } else {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Login failure. Please try again.",
    });
  }
}

export const handleGoogleCallback = (req, res) => {
  console.log('Google Callback URL:', process.env.GOOGLE_CALLBACK_URL);
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed. User not found.",
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    // Set cookie with token
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      path: "/",
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days in milliseconds
    });


    return res.redirect(`${process.env.FRONTEND_URL}/home`); // No need to send token in URL
  } catch (error) {
    console.error("Google OAuth Callback Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong during authentication",
    });
  }
};

export const handleLogout = (req, res) => {
  req.logout(err => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).send("Error logging out.");
    }
    res.redirect("/");
  });
};

export const forgotPassword = async (req, res) => {
  const { emailOrUsername } = req.body;

  const user = await User.findOne({
    $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
  });

  if (!user) {
    return res.status(200).json({ message: "If user exists, reset link sent." });
  }

  //check of PasswordResetToken availbale in Db
  const tokenInDb = await PasswordResetToken.findOne({ userId: user._id });
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  if (!tokenInDb) {
    // Save to DB
    await PasswordResetToken.create({
      userId: user._id,
      tokenHash,
      expiresAt,
      used: false
    });
  } else {
    tokenInDb.tokenHash = tokenHash;
    tokenInDb.expiresAt = expiresAt;
    tokenInDb.used = false;
    await tokenInDb.save();
  }



  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  await mailSender(
    user.email,
    "Reset Your Password",
    passwordResetLinkTemplate(resetLink, user.email)
  )


  res.status(200).json({ message: "Reset link sent to email." });
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const resetTokenRecord = await PasswordResetToken.findOne({
      tokenHash,
      userId: decoded.userId,
      used: false,
      expiresAt: { $gt: new Date() }
    });

    if (!resetTokenRecord) {
      return res.status(400).json({ message: "Invalid or expired reset token." });
    }

    const user = await User.findById(decoded.userId);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    resetTokenRecord.used = true;
    await resetTokenRecord.save();
    await mailSender(
      user.email,
      "Password Updated or Reset Success",
      passwordUpdated(user.email, user.firstName)
    )
    return res.status(200).json({ message: "Password reset successful." });
  } catch (err) {
    return res.status(400).json({ message: "Invalid or expired token." });
  }
};

// Send OTP For Email Verification
export async function sendotp(req, res) {
  try {
    const { email } = req.body

    // Check if user is already present
    // Find user with provided email
    const checkUserPresent = await User.findOne({ email })
    // to be used in case of signup

    // If user found with provided email
    if (checkUserPresent) {
      // Return 401 Unauthorized status code with error message
      return res.status(401).json({
        success: false,
        message: `User is Already Registered`,
      })
    }

    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    })
    const result = await OTP.findOne({ otp: otp })
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      })
    }
    const otpPayload = { email, otp }
    const otpBody = await OTP.create(otpPayload)
    res.status(200).json({
      success: true,
      message: `OTP Sent Successfully`,
      otp,
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ success: false, error: error.message })
  }
}

// Controller for Changing Password
export async function changePassword(req, res) {
  try {
    // Get user data from req.user
    const userDetails = await User.findById(req.user.id)

    // Get old password, new password, and confirm new password from req.body
    const { oldPassword, newPassword } = req.body

    // Validate old password
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    )
    if (!isPasswordMatch) {
      // If old password does not match, return a 401 (Unauthorized) error
      return res
        .status(401)
        .json({ success: false, message: "The password is incorrect" })
    }

    // Update password
    const encryptedPassword = await bcrypt.hash(newPassword, 10)
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    )

    // Send notification email
    try {
      const emailResponse = await mailSender(
        updatedUserDetails.email,
        "Password for your account has been updated",
        passwordUpdated(
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
        )
      );
    } catch (error) {
      // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while sending email:", error)
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      })
    }

    // Return success response
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" })
  } catch (error) {
    // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
    console.error("Error occurred while updating password:", error)
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    })
  }
}
export const logout = async (req, res) => {
  try {
    res
      .status(200)
      .clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
        path: "/",
        maxAge: 0,
      })
      .json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ error: "Logout failed", details: error.message });
  }
};