const Blog = require('../models/blog-model'); // Import the Blog model

// Controller function to create a new blog post
const createBlogPost = async (req, res) => {
  try {
    const { title, description, imageUrl, content } = req.body;
    const author = req.user.id; // Assuming you have authentication middleware setting the user in req.user

    // Create a new blog post
    const newBlogPost = new Blog({
      title,
      description,
      imageUrl,
      content,
      author,
    });

    // Save the blog post to the database
    const savedBlogPost = await newBlogPost.save();

    res.status(201).json(savedBlogPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getBlogPostsList = async (req, res) => {
    try {
      // Fetch all blog posts
      const blogPosts = await Blog.find({}, '-content').populate('author','name'); // Exclude content for listing
  
      res.status(200).json(blogPosts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  const getBlogPostById = async (req, res) => {
    const { id } = req.params;
    console.log("id ",id);
  
    try {
      // Fetch the blog post by ID and populate the author field to include the author's name
      const blogPost = await Blog.findById(id).populate('author', 'name');
  
      if (!blogPost) {
        return res.status(404).json({ success: false, error: 'Blog post not found' });
      }
  
      // You can modify the response format as needed
      res.status(200).json({ data: blogPost });
    } catch (error) {
      console.error('Error fetching blog post by ID:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  };
  
  

module.exports = { createBlogPost, getBlogPostsList, getBlogPostById };
