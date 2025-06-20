import express from "express";
import {
  createExercise,
  getExercise,
  submitAnswer,
  getUserAnswers,
  getSectionContent,
  getUserAnswersAdmin,
  updateUserAnswerAttachment
} from "../controllers/Execrise.js";
import { auth, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Admin routes - Create exercise
router.post("/create", auth, isAdmin, createExercise);

// Public routes (for enrolled students)
router.get("/getExercise", auth, getExercise);
router.get("/getSectionContent", auth, getSectionContent);

// Student routes - Submit and get answers
router.post("/submitAnswer/:exerciseId/:questionId/", auth, submitAnswer);
// router.post("/getUserAnswers", auth, isAdmin, getUserAnswers);
router.post("/getUserAnswersAdmin", auth, isAdmin, getUserAnswersAdmin);
router.put("/updateUserAnswerAttachment/:id", auth, isAdmin, updateUserAnswerAttachment);

export default router;