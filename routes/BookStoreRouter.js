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

router.post("/capture", auth, isAdmin, captureBookPayment);
router.post("/verify", auth,  isAdmin, verifyBookPayment);

router.post("/createProduct",   auth, isStudent, createProduct);
router.get("/getAllBooks",   auth, isStudent, getAllBooks);
router.get("/getBookById",   auth, isStudent, getBookById);
router.put("/updateBook",    auth, isStudent, updateBook);
router.delete("/deleteBook", auth, isStudent, deleteBook);

export default router;
