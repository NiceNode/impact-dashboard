import { Redis, type ScanCommandOptions } from '@upstash/redis'
import 'dotenv/config'

export interface constructorArgs {
  initRedisUrl?: string
  initRedisToken?: string
}

class RedisClient {
  public client: Redis

  constructor({
    initRedisUrl,
    initRedisToken,
  }: constructorArgs) {
    const redisUrl = initRedisUrl ?? process.env.UPSTASH_REDIS_REST_URL
    const redisPassword = initRedisToken ?? process.env.UPSTASH_REDIS_REST_TOKEN

    if (redisUrl === undefined || redisPassword === undefined) {
      throw new Error('initRedisUrl or initRedisToken is undefined')
    }

    this.client = new Redis({
      url: redisUrl,
      token: redisPassword,
    })
  }

  /**
   * get a value for a key
   * @param key
   * @returns
   */
  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key)
    } catch (error) {
      console.error(`Error getting key ${key}:`, error)
      return null
    }
  }

  /**
   * set a value for a key
   * @param key
   * @returns
   */
  async set(key: string, value: string): Promise<string | null> {
    try {
      return await this.client.set(key, value)
    } catch (error) {
      console.error(`Error setting key ${key}:`, error)
      throw error
    }
  }

  /**
   * create or add to a set the values
   * @param key
   * @param values new values to add to the set
   * @returns number of values newly added to the set
   */
  async addToSet(key: string, ...values: string[]): Promise<number | null> {
    try {
      return await this.client.sadd(key, ...values)
    } catch (error) {
      console.error(`Error adding to set key ${key}:`, error)
      throw error
    }
  }

  /**
   * remove value from a set
   * @param key set key
   * @param values values to remove
   * @returns number of values removed from the set
   */
  async removeFromSet(key: string, ...values: string[]): Promise<number | null> {
    try {
      return await this.client.srem(key, ...values)
    } catch (error) {
      console.error(`Error remove values from set key ${key}:`, error)
      throw error
    }
  }

  /**
   * @see — https://redis.io/commands/sscan
   */
  async sscan(key: string, cursor: number, opts?: ScanCommandOptions | undefined): Promise<[number, Array<string | number>]> {
    try {
      return await this.client.sscan(key, cursor, opts)
    } catch (error: unknown) {
      console.error(`Error setting key ${key}:`, error)
      throw error
    }
  }
}

let impactDashRedisUrl = process.env.DEV_IMPACT_DASH_REDIS_REST_URL
let impactDashRedisToken = process.env.DEV_IMPACT_DASH_REDIS_REST_TOKEN
if (true || process.env.NN_ENV === 'production') {
  impactDashRedisUrl = process.env.IMPACT_DASH_REDIS_REST_URL
  impactDashRedisToken = process.env.IMPACT_DASH_REDIS_REST_TOKEN
}

export const impactDashRedisClient = new RedisClient({
  initRedisUrl: impactDashRedisUrl,
  initRedisToken: impactDashRedisToken,
})

export const iterateSet = async (redis: RedisClient, setName: string, processElement: (element: string | number) => Promise<void>): Promise<void> => {
  let cursor = 0

  do {
    // Use SSCAN to get elements from the set
    const reply = await redis.sscan(setName, cursor, { count: 100 })
    cursor = reply[0]
    const elements = reply[1]
    console.log(`Iterating over ${elements.length} from ${setName} now...`)

    for (const element of elements) {
      // console.log(element)
      await processElement(element)
    }
  } while (cursor !== 0)
  console.log('cursor reached (if 0, then less than 100 items in the set): ', cursor)
}

export default RedisClient
