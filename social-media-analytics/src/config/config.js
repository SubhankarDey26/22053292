require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  socialMediaApiBaseUrl: process.env.SOCIAL_MEDIA_API_BASE_URL || 'http://20.244.56.144/evaluation-service',
  useRedis: process.env.USE_REDIS === 'true',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  cacheTtl: parseInt(process.env.CACHE_TTL || '300', 10) // Cache time-to-live in seconds
};