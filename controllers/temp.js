// ============================================
// CONTROLLER: articles.controller.js
// ============================================



// Additional specialized endpoints



// ============================================
// ROUTES: articles.routes.js
// ============================================

import express from 'express';
import {
  getAllArticlesPublic,
  getFeaturedArticles,
  getTrendingArticles,
  getArticlesByCategory,
  getRelatedArticles
} from '../controllers/articles.controller.js';

const router = express.Router();

// Main articles endpoint with advanced filtering


export default router;


// ============================================
// USAGE EXAMPLES
// ============================================

/*
1. Basic pagination:
GET /api/articles?page=1&limit=10

2. Search articles:
GET /api/articles?search=UPSC&page=1&limit=10

3. Filter by category:
GET /api/articles?category=64a7b8c9d1e2f3g4h5i6j7k8

4. Filter by tags:
GET /api/articles?tags=UPSC,IAS,Civil Services

5. Filter by author:
GET /api/articles?author=64a7b8c9d1e2f3g4h5i6j7k8

6. Get featured articles only:
GET /api/articles?isFeatured=true

7. Get trending articles only:
GET /api/articles?isTrending=true

8. Sort by views (descending):
GET /api/articles?sortBy=views&sortOrder=desc

9. Sort by title (ascending):
GET /api/articles?sortBy=title&sortOrder=asc

10. Date range filter:
GET /api/articles?dateFrom=2024-01-01&dateTo=2024-12-31

11. Select specific fields only:
GET /api/articles?fields=title,slug,thumbnail,createdAt

12. Complex query:
GET /api/articles?search=exam&category=64a7b8c9d1e2f3g4h5i6j7k8&tags=UPSC&isFeatured=true&sortBy=views&sortOrder=desc&page=1&limit=5

13. Get featured articles:
GET /api/articles/featured?limit=5

14. Get trending articles:
GET /api/articles/trending?limit=5

15. Get articles by category:
GET /api/articles/category/64a7b8c9d1e2f3g4h5i6j7k8?page=1&limit=10

16. Get related articles:
GET /api/articles/64a7b8c9d1e2f3g4h5i6j7k8/related?limit=4
*/