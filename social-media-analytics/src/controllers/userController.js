const apiService = require('../services/apiService');

exports.getTopUsers = async (req, res) => {
  try {
    const topUsers = await apiService.getTopUsers();
    
    res.json({
      success: true,
      users: topUsers
    });
  } catch (error) {
    console.error('Error in getTopUsers controller:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve top users'
    });
  }
};