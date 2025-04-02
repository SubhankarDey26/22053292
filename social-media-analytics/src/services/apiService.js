const axios = require('axios');
const config = require('../config/config');
const cacheManager = require('../utils/cacheManager');

class ApiService {
  constructor() {
    this.baseURL = config.socialMediaApiBaseUrl;
    this.userPostCounts = new Map(); // Keep track of user post counts
  }

  async getUsers() {
    const cacheKey = 'all_users';
    const cachedData = await cacheManager.get(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }
    
    try {
      const response = await axios.get(`${this.baseURL}/users`);
      const users = response.data.users || {};
      
      // Store in cache
      await cacheManager.set(cacheKey, users);
      
      return users;
    } catch (error) {
      console.error('Error fetching users:', error.message);
      throw error;
    }
  }

  async getUserPosts(userId) {
    const cacheKey = `user_posts_${userId}`;
    const cachedData = await cacheManager.get(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }
    
    try {
      const response = await axios.get(`${this.baseURL}/users/${userId}/posts`);
      const posts = response.data.posts || [];
      
      // Update post count for this user
      this.userPostCounts.set(userId, posts.length);
      
      // Store in cache
      await cacheManager.set(cacheKey, posts);
      
      return posts;
    } catch (error) {
      console.error(`Error fetching posts for user ${userId}:`, error.message);
      throw error;
    }
  }

  async getPostComments(postId) {
    const cacheKey = `post_comments_${postId}`;
    const cachedData = await cacheManager.get(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }
    
    try {
      const response = await axios.get(`${this.baseURL}/posts/${postId}/comments`);
      const comments = response.data.comments || [];
      
      // Store in cache
      await cacheManager.set(cacheKey, comments);
      
      return comments;
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error.message);
      throw error;
    }
  }

  async getTopUsers(limit = 5) {
    try {
      const users = await this.getUsers();
      const userIds = Object.keys(users);
      
      // Get post counts for all users (if not already cached)
      await Promise.all(
        userIds.map(async (userId) => {
          if (!this.userPostCounts.has(userId)) {
            const posts = await this.getUserPosts(userId);
            this.userPostCounts.set(userId, posts.length);
          }
        })
      );
      
      // Sort users by post count (descending)
      const sortedUserIds = [...this.userPostCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(entry => entry[0]);
      
      // Return top users with their names and post counts
      return sortedUserIds.map(userId => ({
        id: userId,
        name: users[userId],
        postCount: this.userPostCounts.get(userId)
      }));
    } catch (error) {
      console.error('Error getting top users:', error.message);
      throw error;
    }
  }

  async getPopularPosts(limit = 1) {
    try {
      const users = await this.getUsers();
      const userIds = Object.keys(users);
      
      let allPosts = [];
      let postCommentCounts = new Map();
      
      // Get all posts and their comment counts
      await Promise.all(
        userIds.map(async (userId) => {
          const userPosts = await this.getUserPosts(userId);
          
          await Promise.all(
            userPosts.map(async (post) => {
              const comments = await this.getPostComments(post.id);
              postCommentCounts.set(post.id, comments.length);
              allPosts.push({
                ...post,
                userName: users[post.userid]
              });
            })
          );
        })
      );
      
      // Sort posts by comment count (descending)
      const popularPosts = allPosts
        .sort((a, b) => postCommentCounts.get(b.id) - postCommentCounts.get(a.id))
        .slice(0, limit)
        .map(post => ({
          ...post,
          commentCount: postCommentCounts.get(post.id)
        }));
      
      return popularPosts;
    } catch (error) {
      console.error('Error getting popular posts:', error.message);
      throw error;
    }
  }

  async getLatestPosts(limit = 5) {
    try {
      const users = await this.getUsers();
      const userIds = Object.keys(users);
      
      let allPosts = [];
      
      // Get all posts from all users
      await Promise.all(
        userIds.map(async (userId) => {
          const userPosts = await this.getUserPosts(userId);
          allPosts.push(...userPosts.map(post => ({
            ...post,
            userName: users[post.userid]
          })));
        })
      );
      
      // Sort posts by ID (assuming higher ID means newer post) and take the latest
      const latestPosts = allPosts
        .sort((a, b) => b.id - a.id)
        .slice(0, limit);
      
      return latestPosts;
    } catch (error) {
      console.error('Error getting latest posts:', error.message);
      throw error;
    }
  }
}

module.exports = new ApiService();