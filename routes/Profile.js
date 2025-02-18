const express = require("express")
const router = express.Router()
const { auth, isAdmin } = require("../middleware/auth")
const {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
  updateDisplayPicture,
  getEnrolledCourses,
  adminDashboardDashboard,
  adminDashboard,
} = require("../controllers/Profile")

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

module.exports = router
