import { Redis } from '@upstash/redis'
import { env } from 'process'

if (!env.REDIS_URL || !env.REDIS_TOKEN) {
  throw new Error('REDIS_URL and REDIS_TOKEN must be defined')
}

const redis = new Redis({
  url: env.REDIS_URL,
  token: env.REDIS_TOKEN,
})

// Connection monitoring
export const verifyRedisConnection = async () => {
  try {
    await redis.ping()
    console.log('✅ Redis connection successful')
    return true
  } catch (error) {
    console.error('❌ Redis connection failed:', error)
    return false
  }
}

export default redis
