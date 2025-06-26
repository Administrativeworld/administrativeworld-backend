
import Article from "../models/Article.js";
import User from "../models/UserModel.js";

export const createArticle = async (req, res) => {
  try {
    console.log('createArticle called ->>')
    const isUserExists = await User.findById(req.user.id);
    if (!isUserExists) {
      return res.status(401).json({ message: "user not exists" })
    }
    const {
      title,
      slug,
      content,
      category,
      tags,
      metaTitle,
      metaDescription,
      keywords,
      thumbnail,
      status,
      isFeatured,
      isTrending,
    } = req.body.formData || req.body;

    if (!title ||
      !slug ||
      !content ||
      !category ||
      !tags ||
      !metaTitle ||
      !metaDescription) {
      return res.status(400).json({
        message: "fill required fields"
      })
    }

    // Check for duplicate slug
    const existingArticle = await Article.findOne({ slug });
    if (existingArticle) {
      return res.status(400).json({ message: 'Article with this slug already exists.' });
    }

    const newArticle = new Article({
      title,
      slug,
      content,
      category,
      tags,
      metaTitle,
      metaDescription,
      keywords,
      thumbnail,
      status: status || 'Draft',
      isFeatured: isFeatured || false,
      isTrending: isTrending || false,
      author: req.user._id, // Assuming you attach user info via authentication middleware
    });

    const savedArticle = await newArticle.save();

    res.status(201).json({ message: 'Article created successfully.', article: savedArticle });
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ message: 'Server error while creating article.' });
  }
};
// Edit Article
export const editArticle = async (req, res) => {
  try {
    console.log("editArticle called -->>", req.body.title)
    const isUserExists = await User.findById(req.user.id);
    if (!isUserExists) {
      return res.status(401).json({ message: "user not exists" })
    }

    const { id } = req.query;
    const {
      title,
      slug,
      content,
      category,
      tags,
      metaTitle,
      metaDescription,
      keywords,
      thumbnail,
      status,
      isFeatured,
      isTrending,
    } = req.body;

    // Check if article exists
    const existingArticle = await Article.findById(id);
    if (!existingArticle) {
      return res.status(404).json({ message: 'Article not found.' });
    }

    // Check for duplicate slug (excluding current article)
    const duplicateSlug = await Article.findOne({ slug, _id: { $ne: id } });
    if (duplicateSlug) {
      return res.status(400).json({ message: 'Article with this slug already exists.' });
    }

    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      {
        title,
        slug,
        content,
        category,
        tags,
        metaTitle,
        metaDescription,
        keywords,
        thumbnail,
        status: status || 'Draft',
        isFeatured: isFeatured || false,
        isTrending: isTrending || false,
      },
      { new: true }
    );

    res.status(200).json({ message: 'Article updated successfully.', article: updatedArticle });
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(500).json({ message: 'Server error while updating article.' });
  }
};

// Delete Article
export const deleteArticle = async (req, res) => {
  try {
    const isUserExists = await User.findById(req.user.id);
    if (!isUserExists) {
      return res.status(401).json({ message: "user not exists" })
    }

    const { id } = req.query;

    // Check if article exists
    const existingArticle = await Article.findById(id);
    if (!existingArticle) {
      return res.status(404).json({ message: 'Article not found.' });
    }

    await Article.findByIdAndDelete(id);

    res.status(200).json({ message: 'Article deleted successfully.' });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ message: 'Server error while deleting article.' });
  }
};

// Get All Articles
export const getAllArticlesAdmin = async (req, res) => {
  try {
    console.log("getAllArticleAdmin called ->>")
    const isUserExists = await User.findById(req.user.id);
    if (!isUserExists) {
      return res.status(401).json({ message: "user not exists" })
    }
    if (isUserExists.accountType !== "Admin") {
      return res.status(401).json({ message: "Admin not exists" })
    }
    const articles = await Article.find({}).populate({
      path: "author",
      select: "firstName lastName email image"
    }
    ).sort({ createdAt: -1 });
    res.status(200).json({ message: 'Articles retrieved successfully.', articles });
  } catch (error) {
    console.error('Error retrieving articles:', error);
    res.status(500).json({ message: 'Server error while retrieving articles.' });
  }
};
export const getArticleBySlug = async (req, res) => {
  try {
    console.log("getArticleById called ->>");

    const { slug } = req.query;

    const article = await Article.find({ slug: slug }).populate({
      path: "author",
      select: "firstName lastName email image"
    });

    if (!article) {
      return res.status(404).json({ message: "Article not found." });
    }

    res.status(200).json({ message: 'Article retrieved successfully.', article });
  } catch (error) {
    console.error('Error retrieving article by ID:', error);
    res.status(500).json({ message: 'Server error while retrieving the article.' });
  }
};
// controllers/articleController.js

export const getFeaturedArticles = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const articles = await Article.find({
      status: 'Published',
      isFeatured: true
    })
      .select('title slug thumbnail metaTitle metaDescription createdAt views')
      .populate({
        path: "author",
        select: "firstName lastName"
      })
      .populate({
        path: "category",
        select: "name slug"
      })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    res.status(200).json({
      message: "Featured articles retrieved successfully",
      articles
    });
  } catch (error) {
    console.error("Error retrieving featured articles:", error);
    res.status(500).json({ message: "Server error while retrieving featured articles." });
  }
};

export const getTrendingArticles = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const articles = await Article.find({
      status: 'Published',
      isTrending: true
    })
      .select('title slug thumbnail metaTitle metaDescription createdAt views')
      .populate({
        path: "author",
        select: "firstName lastName"
      })
      .populate({
        path: "category",
        select: "name slug"
      })
      .sort({ views: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    res.status(200).json({
      message: "Trending articles retrieved successfully",
      articles
    });
  } catch (error) {
    console.error("Error retrieving trending articles:", error);
    res.status(500).json({ message: "Server error while retrieving trending articles." });
  }
};

export const getArticlesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(20, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [articles, totalCount] = await Promise.all([
      Article.find({
        category: categoryId,
        status: 'Published'
      })
        .select('title slug thumbnail metaTitle metaDescription createdAt views tags')
        .populate({
          path: "author",
          select: "firstName lastName"
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),

      Article.countDocuments({ category: categoryId, status: 'Published' })
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    res.status(200).json({
      message: "Category articles retrieved successfully",
      data: {
        articles,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalCount,
          limit: limitNum,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        }
      }
    });
  } catch (error) {
    console.error("Error retrieving category articles:", error);
    res.status(500).json({ message: "Server error while retrieving category articles." });
  }
};

export const getRelatedArticles = async (req, res) => {
  try {
    const { articleId } = req.params;
    const { limit = 4 } = req.query;

    // Get the current article to find related ones
    const currentArticle = await Article.findById(articleId).select('tags category');

    if (!currentArticle) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Find related articles based on tags and category
    const relatedArticles = await Article.find({
      _id: { $ne: articleId },
      status: 'Published',
      $or: [
        { category: currentArticle.category },
        { tags: { $in: currentArticle.tags } }
      ]
    })
      .select('title slug thumbnail metaTitle createdAt views')
      .populate({
        path: "author",
        select: "firstName lastName"
      })
      .sort({ views: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    res.status(200).json({
      message: "Related articles retrieved successfully",
      articles: relatedArticles
    });
  } catch (error) {
    console.error("Error retrieving related articles:", error);
    res.status(500).json({ message: "Server error while retrieving related articles." });
  }
};

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
