import express from "express";
import { auth, isAdmin } from "../middleware/auth.js";
import { deleteArticle, editArticle, getAllArticlesAdmin, getAllArticlesPublic, getArticleById, getArticleBySlug, getArticlesByCategory, getFeaturedArticles, getRelatedArticles, getTrendingArticles, upsertArticle } from "../controllers/Articles.js";
const router = express.Router();



//Admin Routes
router.post("/createArticle", auth, isAdmin, upsertArticle)
router.post("/editArticle", auth, isAdmin, editArticle)
router.post("/deleteArticle", auth, isAdmin, deleteArticle)
router.post("/getAllArticleAdmin", auth, isAdmin, getAllArticlesAdmin)
router.post("/getArticleById", auth, isAdmin, getArticleById)

// GET /api/article/:id
router.get('/getArticleBySlug', getArticleBySlug);

router.get('/getAllArticle', getAllArticlesPublic);
router.get('/featured', getFeaturedArticles);
router.get('/trending', getTrendingArticles);
router.get('/category/:categoryId', getArticlesByCategory);
router.get('/:articleId/related', getRelatedArticles);

export default router;