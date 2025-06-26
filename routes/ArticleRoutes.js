import express from "express";
import { auth, isAdmin } from "../middleware/auth.js";
import { createArticle, deleteArticle, editArticle, getAllArticlesAdmin, getAllArticlesPublic, getArticleBySlug, getArticlesByCategory, getFeaturedArticles, getRelatedArticles, getTrendingArticles } from "../controllers/Articles.js";
const router = express.Router();



//Admin Routes
router.post("/createArticle", auth, isAdmin, createArticle)
router.post("/editArticle", auth, isAdmin, editArticle)
router.post("/deleteArticle", auth, isAdmin, deleteArticle)
router.post("/getAllArticleAdmin", auth, isAdmin, getAllArticlesAdmin)

// GET /api/article/:id
router.get('/getArticleBySlug', getArticleBySlug);

router.get('/getAllArticle', getAllArticlesPublic);
router.get('/featured', getFeaturedArticles);
router.get('/trending', getTrendingArticles);
router.get('/category/:categoryId', getArticlesByCategory);
router.get('/:articleId/related', getRelatedArticles);

export default router;