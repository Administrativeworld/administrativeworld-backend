import express from "express";
import { auth, isAdmin } from "../middleware/auth.js";
import { createArticle, deleteArticle, editArticle, getAllArticlesAdmin } from "../controllers/Articles.js";
const router = express.Router();



//Admin Routes
router.post("/createArticle", auth, isAdmin, createArticle)
router.post("/editArticle", auth, isAdmin, editArticle)
router.post("/deleteArticle", auth, isAdmin, deleteArticle)
router.post("/getAllArticleAdmin", auth, isAdmin, getAllArticlesAdmin)


export default router;