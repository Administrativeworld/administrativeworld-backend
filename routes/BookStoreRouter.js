import express from "express";
import { captureBookPayment, verifyBookPayment } from "../controllers/BookStorePayment.js";
import {
  createProduct,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  generateStoreDownloadToken,
  downloadWithToken,
  createBooksCombo,
  getBookCombos,
  getBookByIdAdmin,
  deleteBookThumbnail,
  deleteBookPdf,
} from "../controllers/BookStore.js";
import { auth, isAdmin, isStudent } from "../middleware/auth.js";

const router = express.Router();

router.post("/capture", auth, isStudent, captureBookPayment);
router.post("/verify", auth, isStudent, verifyBookPayment);

router.post("/getAllBooks", getAllBooks);
router.post("/createProduct", auth, isAdmin, createProduct);
router.post("/getBookById", auth, getBookById);
router.post("/updateBook", auth, isAdmin, updateBook);
router.post("/deleteBook", auth, isAdmin, deleteBook);
router.post("/generateStoreDownloadToken", auth, generateStoreDownloadToken)
router.get('/download/:token', downloadWithToken);
router.post("/createBooksCombo", auth, isAdmin, createBooksCombo)
router.post("/deleteBookThumbnail", auth, isAdmin, deleteBookThumbnail)
router.post("/deleteBookPdf", auth, isAdmin, deleteBookPdf)
router.post('/getBookByIdAdmin', auth, isAdmin, getBookByIdAdmin)
router.get("/getBookCombos", getBookCombos)

export default router;
