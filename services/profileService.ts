import { redisClient } from "../config/redis.js";

export const getUsageMsg = async (userId: string, daysSinceRegistration:string) => {
    try {
        const redisKey = `msg_count:${userId}:${daysSinceRegistration}`;

        // Get current count
        let currentCount = await redisClient.get(redisKey);

        return currentCount;
    } catch (error) {
        console.error(error)
    }
}