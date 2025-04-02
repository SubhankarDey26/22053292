const apiService = require('../services/apiService');

exports.getPosts = async (req, res) => {
  try {
    const { type = 'popular' } = req.query;
    
    let posts;
    if (type === 'popular') {
      posts = await apiService.getPopularPosts();
    } else if (type === 'latest') {
      posts = await apiService.getLatestPosts();
    } else {
      return res.status(400).json({
        success: false,
        error: 'Invalid post type. Use "popular" or "latest"'
      });
    }
    
    res.json({
      success: true,
      type,
      posts
    });
  } catch (error) {
    console.error('Error in getPosts controller:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve posts'
    });
  }
};