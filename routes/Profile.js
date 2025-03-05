import express from "express";
const router = express.Router()
import { auth, isAdmin } from "../middleware/auth.js";

import {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
  updateDisplayPicture,
  getEnrolledCourses,
  adminDashboard,
} from "../controllers/Profile.js";

// 
//                                      Profile routes
// Delet User Account
router.delete("/deleteProfile", auth, deleteAccount)
router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetails", auth, getAllUserDetails)
// Get Enrolled Courses
router.post("/getEnrolledCourses", auth, getEnrolledCourses)
router.put("/updateDisplayPicture", auth, updateDisplayPicture)
router.get("/adminDashboard", auth, isAdmin, adminDashboard)

export default router;
