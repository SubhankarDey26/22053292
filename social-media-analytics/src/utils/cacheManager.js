const NodeCache = require('node-cache');
const Redis = require('redis');
const { promisify } = require('util');
const config = require('../config/config');

class CacheManager {
  constructor() {
    if (config.useRedis) {
      // Use Redis for caching
      this.client = Redis.createClient(config.redisUrl);
      this.client.on('error', (err) => console.error('Redis Client Error', err));
      this.getAsync = promisify(this.client.get).bind(this.client);
      this.setAsync = promisify(this.client.setex).bind(this.client);
    } else {
      // Use in-memory cache
      this.cache = new NodeCache({ stdTTL: config.cacheTtl });
    }
  }

  async get(key) {
    try {
      if (config.useRedis) {
        const value = await this.getAsync(key);
        return value ? JSON.parse(value) : null;
      } else {
        return this.cache.get(key);
      }
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key, value, ttl = config.cacheTtl) {
    try {
      if (config.useRedis) {
        await this.setAsync(key, ttl, JSON.stringify(value));
      } else {
        this.cache.set(key, value, ttl);
      }
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }
}

module.exports = new CacheManager();