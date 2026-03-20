import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export default async function handler(req, res) {
  try {
    const count = await redis.incr('portfolio_visitors')
    res.status(200).json({ count })
  } catch (error) {
    res.status(500).json({ count: null })
  }
}
