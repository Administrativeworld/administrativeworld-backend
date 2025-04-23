import express from 'express';
const router = express.Router();
import { auth, isStudent, isAdmin } from "../middleware/auth.js";

// ************** category ****************************
import { showAllCategories, createCategory, categoryPageDetails } from '../controllers/Category.js';

// ************** COURSE IMPORTED ****************************
import {
  createCourse,
  editCourse,
  getAllCourses,
  getCourseDetails,
  getFullCourseDetails,
  getCourseCreation,
  getACourse,
  publishCourse,
} from '../controllers/Course.js';

// ************** SECCTION IMPORTED ****************************
import { createSection, updateSection, deleteSection } from "../controllers/Section.js";

// ************** SECCTION IMPORTED ****************************
import { createSubSection, updateSubSection, deleteSubSection } from "../controllers/Subsection.js";

// ************** Rating and review IMPORTED ****************************
import { createRating, getAverageRating, getAllRatingReview } from "../controllers/RatingandReview.js";

// ************** COURSE PROGREES IMPORTED ****************************
import { updateCourseProgress, getProgressPercentage } from "../controllers/courseProgress.js";

// ************** CATEGORY ROUTES FOR ADMIN ****************************
router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategories)
router.post("/getCategoryPageDetails", auth, isAdmin, categoryPageDetails)

// ************** COURSE FOR ADMIN ****************************
router.post("/createCourse", auth, isAdmin, createCourse)
// Edit a course
router.post("/editCourse", auth, editCourse)
router.post("/publishCourse", auth, publishCourse)
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
router.post("/getAllCourses", getAllCourses)
// Get Details for a Specific Courses
router.post("/getCourseDetails", getCourseDetails)
// Get Details for a Specific Courses
router.post("/getFullCourseDetails", auth, getFullCourseDetails)
router.post("/getACourse", getACourse)
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





export default router;