import express from "express";
import { auth, isAdmin } from "../middleware/auth.js";
import { createArticle, deleteArticle, editArticle, getAllArticlesAdmin, getArticleById } from "../controllers/Articles.js";
const router = express.Router();



//Admin Routes
router.post("/createArticle", auth, isAdmin, createArticle)
router.post("/editArticle", auth, isAdmin, editArticle)
router.post("/deleteArticle", auth, isAdmin, deleteArticle)
router.post("/getAllArticleAdmin", auth, isAdmin, getAllArticlesAdmin)

// GET /api/article/:id
router.get('/getArticle/:id', auth, getArticleById);


export default router;