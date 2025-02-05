const Post = require('../models/Post');
const User = require('../models/UserModel');
const Category = require('../models/Category');

exports.createPost = async (req, res) => {
    try {
        const userId = req.user.id;

        let { titleName, thumbnailUrl, bodyPost, category } = req.body;
        if (!titleName || !bodyPost || !thumbnailUrl || !category) {
            return res.status(400).json({
                success: false,
                message: "All fields are mandatory",
            });
        }

        const authorDetails = await User.findOne({ _id: userId, accountType: "Admin" });

        if (!authorDetails) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to create a post",
            });
        }

        const categoryDetails = await Category.findById(category);
        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: "Category details not found",
            });
        }

        const newPost = await Post.create({
            titleName,
            thumbnailUrl,
            bodyPost,
            category: categoryDetails._id,
            author: authorDetails._id,
        });

        // Add the new post to the User schema
        await User.findByIdAndUpdate(
            authorDetails._id,
            { $push: { posts: newPost._id } },
            { new: true }
        );

        // Add the new post to the category
        await Category.findByIdAndUpdate(
            categoryDetails._id,
            { $push: { posts: newPost._id } },
            { new: true }
        );

        res.status(201).json({
            success: true,
            data: newPost,
            message: "Post created successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create post",
            error: error.message,
        });
    }
};

exports.editPost = async (req, res) => {
    try {
        const userId = req.user.id;
        const { postId, titleName, thumbnailUrl, bodyPost, category } = req.body;

        if (!postId) {
            return res.status(400).json({
                success: false,
                message: "Post ID is required",
            });
        }
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        if (post.author.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to edit this post",
            });
        }

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { titleName, thumbnailUrl, bodyPost, category },
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: updatedPost,
            message: "Post updated successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to edit post",
            error: error.message,
        });
    }
};
exports.deletePost = async (req, res) => {
    try {
        const userId = req.user.id;
        const { postId } = req.body;

        if (!postId) {
            return res.status(400).json({
                success: false,
                message: "Post ID is required",
            });
        }

        
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        if (post.Author.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this post",
            });
        }

        await User.findByIdAndUpdate(
            userId,
            { $pull: { posts: postId } },
            { new: true }
        );

        await Category.findByIdAndUpdate(
            post.category,
            { $pull: { posts: postId } },
            { new: true }
        );

        await Post.findByIdAndDelete(postId);

        res.status(200).json({
            success: true,
            message: "Post deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete post",
            error: error.message,
        });
    }
};
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("author", "name")  
            .populate("category", "name"); 

        if (posts.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No posts found",
            });
        }

        res.status(200).json({
            success: true,
            data: posts,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch posts",
            error: error.message,
        });
    }
};
exports.getCategoryPosts = async (req, res) => {
    try {
        const { categoryId } = req.params;  

        const categoryExists = await Category.findById(categoryId);
        if (!categoryExists) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }
        const posts = await Post.find({ category: categoryId })
            .populate("author", "name email")
            .populate("category", "name");

        if (posts.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No posts found in this category",
            });
        }

        res.status(200).json({
            success: true,
            data: posts,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch category posts",
            error: error.message,
        });
    }
};
