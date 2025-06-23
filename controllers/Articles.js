//Admin apis

import Article from "../models/Article.js";
import User from "../models/UserModel.js";

export const createArticle = async (req, res) => {
  try {
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
    } = req.body;
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