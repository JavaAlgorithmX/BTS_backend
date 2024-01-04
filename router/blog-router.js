const express = require('express');
const blogRouter = express.Router();
const { createBlogPost, getBlogPostsList, getBlogPostById } = require('../controllers/blog-controller');
const authMiddleware = require('../middleware/auth-middleware');

// POST endpoint for creating a new blog post
blogRouter.route('/create').post(authMiddleware, createBlogPost);
blogRouter.route('/list').get( getBlogPostsList);
blogRouter.route('/:id').get( getBlogPostById);

module.exports = blogRouter;
