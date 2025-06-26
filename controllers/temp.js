// ============================================
// CONTROLLER: articles.controller.js
// ============================================

export const getAllArticlesPublic = async (req, res) => {
  try {
    console.log("getAllArticlesPublic called with query:", req.query);

    // Extract query parameters with defaults
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search,
      category,
      tags,
      author,
      status = 'Published',
      isFeatured,
      isTrending,
      dateFrom,
      dateTo,
      fields
    } = req.query;

    // Build filter object
    const filter = { status }; // Default to published articles only

    // Search functionality (title, content, metaTitle, metaDescription)
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { metaTitle: { $regex: search, $options: 'i' } },
        { metaDescription: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Tags filter (can be comma-separated)
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      filter.tags = { $in: tagArray };
    }

    // Author filter
    if (author) {
      filter.author = author;
    }

    // Featured filter
    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured === 'true';
    }

    // Trending filter
    if (isTrending !== undefined) {
      filter.isTrending = isTrending === 'true';
    }

    // Date range filter
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) {
        filter.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        filter.createdAt.$lte = new Date(dateTo);
      }
    }

    // Pagination setup
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit))); // Max 50 items per page
    const skip = (pageNum - 1) * limitNum;

    // Sort setup
    const sortOptions = {};
    const validSortFields = ['createdAt', 'updatedAt', 'publishedAt', 'views', 'title'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortDirection = sortOrder === 'asc' ? 1 : -1;
    sortOptions[sortField] = sortDirection;

    // Field selection (optional)
    let selectFields = '';
    if (fields) {
      const allowedFields = [
        'title', 'slug', 'content', 'thumbnail', 'category', 'tags',
        'author', 'metaTitle', 'metaDescription', 'keywords', 'views',
        'isFeatured', 'isTrending', 'status', 'publishedAt', 'createdAt', 'updatedAt'
      ];
      const requestedFields = fields.split(',').map(f => f.trim());
      const validFields = requestedFields.filter(f => allowedFields.includes(f));
      selectFields = validFields.join(' ');
    }

    // Execute query with aggregation for better performance
    const [articles, totalCount] = await Promise.all([
      Article.find(filter)
        .select(selectFields || '-__v')
        .populate({
          path: "author",
          select: "firstName lastName image"
        })
        .populate({
          path: "category",
          select: "name slug"
        })
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(), // Use lean() for better performance

      Article.countDocuments(filter)
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    // Response object
    const response = {
      message: "Articles retrieved successfully",
      data: {
        articles,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalCount,
          limit: limitNum,
          hasNextPage,
          hasPrevPage,
          nextPage: hasNextPage ? pageNum + 1 : null,
          prevPage: hasPrevPage ? pageNum - 1 : null
        },
        filters: {
          search: search || null,
          category: category || null,
          tags: tags ? tags.split(',') : null,
          author: author || null,
          isFeatured: isFeatured || null,
          isTrending: isTrending || null,
          dateFrom: dateFrom || null,
          dateTo: dateTo || null,
          sortBy: sortField,
          sortOrder
        }
      }
    };

    res.status(200).json(response);

  } catch (error) {
    console.error("Error retrieving articles:", error);
    res.status(500).json({
      message: "Server error while retrieving articles.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

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