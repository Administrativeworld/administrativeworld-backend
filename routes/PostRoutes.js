const express = require("express")
const router = express.Router()
const { auth, isAdmin } = require("../middleware/auth")

const {
    createPost,
    editPost,
    deletePost,
    getAllPosts,
    getCategoryPosts
} = require("../controllers/Post")
// Create a new post (Admin only)
router.post("/create", auth, isAdmin, createPost);

// Edit an existing post (Only author can edit)
router.put("/edit", auth, isAdmin, editPost);

// Delete a post (Only author can delete)
router.delete("/delete", auth, isAdmin, deletePost);

// Get all posts
router.get("/all", getAllPosts);

//  Get posts by category
router.get("/category/:categoryId", getCategoryPosts);

module.exports = router;
