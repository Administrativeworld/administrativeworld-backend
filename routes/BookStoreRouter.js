import express from "express";
import { captureBookPayment, verifyBookPayment } from "../controllers/BookStorePayment.js";
import {
  createProduct,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
} from "../controllers/BookStore.js";
import { auth, isAdmin, isStudent } from "../middleware/auth.js";

const router = express.Router();

router.post("/capture", auth, isStudent, captureBookPayment);
router.post("/verify", auth, isStudent, verifyBookPayment);

router.get("/getAllBooks", auth, isAdmin, getAllBooks);
router.post("/createProduct", auth, isAdmin, createProduct);
router.get("/getBookById", auth, isAdmin, getBookById);
router.put("/updateBook", auth, isAdmin, updateBook);
router.delete("/deleteBook", auth, isAdmin, deleteBook);

export default router;
