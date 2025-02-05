const express = require('express');
const router = express.Router();
const { auth, isStudent, isAdmin } = require("../middleware/auth")
// ************** category ****************************
const {
  showAllCategories,
  createCategory,
  categoryPageDetails,
} = require('../controllers/Category')




// ************** COURSE IMPORTED ****************************
const {
  createCourse,
  editCourse,
  getAllCourses,
  getCourseDetails,
  getFullCourseDetails,
  deleteCourse,
  getCourseCreation,
} = require('../controllers/Course')
// ************** SECCTION IMPORTED ****************************
const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section")
// ************** SECCTION IMPORTED ****************************
const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/Subsection")
// ************** Rating and review IMPORTED ****************************
const {
  createRating,
  getAverageRating,
  getAllRatingReview,
} = require("../controllers/RatingandReview")
// ************** COURSE PROGREES IMPORTED ****************************
const {
  updateCourseProgress,
  getProgressPercentage,
} = require("../controllers/courseProgress")

// ************** CATEGORY ROUTES FOR ADMIN ****************************
router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", auth, isAdmin, showAllCategories)
router.post("/getCategoryPageDetails", auth, isAdmin, categoryPageDetails)

// ************** COURSE FOR ADMIN ****************************
router.post("/createCourse", auth, isAdmin, createCourse)
// Edit a course
router.post("/editCourse", auth, isAdmin, editCourse)
router.get("/courseCreationDraft", auth, getCourseCreation)

// ************** SECTION FOR ADMIN ****************************
//Add a Section to a Course
router.post("/addSection", auth, isAdmin, createSection)
// Update a Section
router.post("/updateSection", auth, isAdmin, updateSection)
// Delete a Section
router.post("/deleteSection", auth, isAdmin, deleteSection)

// ************** SUBSECTION FOR ADMIN ****************************
// Add a Sub Section to a Section
router.post("/addSubSection", auth, isAdmin, createSubSection)
// Edit Sub Section
router.post("/updateSubSection", auth, isAdmin, updateSubSection)
// Delete Sub Section
router.post("/deleteSubSection", auth, isAdmin, deleteSubSection)


// ************** COURSE FOR STUDENT ****************************
// Get all Registered Courses
router.get("/getAllCourses", getAllCourses)
// Get Details for a Specific Courses
router.post("/getCourseDetails", getCourseDetails)
// Get Details for a Specific Courses
router.post("/getFullCourseDetails", auth, getFullCourseDetails)
// Delete a Course
// router.delete("/deleteCourse", deleteCourse)


// ************** Rating and review FOR STUDENT ****************************
router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRatingReview)

// ************** COURSE PROGREES ROUTES ****************************
// To Update Course Progress
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress)
// To get Course Progress
router.post("/getProgressPercentage", auth, isStudent, getProgressPercentage)





module.exports = router;