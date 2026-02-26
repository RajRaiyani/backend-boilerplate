import { createClient } from 'redis';
import env from '@/config/env.js';

if (!env.redis.url) throw new Error('Redis URL is not found in environment variables');

const redisClient = createClient({
  url: env.redis.url,
});


export default redisClient;
