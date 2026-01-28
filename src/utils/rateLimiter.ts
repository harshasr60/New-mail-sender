import { Redis } from "ioredis";
import dotenv from "dotenv";

dotenv.config();

// Create a separate Redis client for the rate limiter (BullMQ manages its own connections)
const redis = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
});

const MAX_EMAILS_PER_HOUR = parseInt(process.env.MAX_EMAILS_PER_HOUR || "10");

export class RateLimiter {
    static async checkRateLimit(sender: string): Promise<boolean> {
        const key = this.getKey(sender);
        const count = await redis.get(key);
        return count ? parseInt(count) < MAX_EMAILS_PER_HOUR : true;
    }

    static async increment(sender: string): Promise<void> {
        const key = this.getKey(sender);
        const ttl = 3600; // 1 hour

        // Multi/exec to ensure atomicity (optional here but good practice) or simply incr and expire
        const pipeline = redis.pipeline();
        pipeline.incr(key);
        pipeline.expire(key, ttl);
        await pipeline.exec();
    }

    private static getKey(sender: string): string {
        const date = new Date();
        const hourKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`;
        return `rate:${sender}:${hourKey}`;
    }

    static getSecondsUntilNextHour(): number {
        const now = new Date();
        const nextHour = new Date(now);
        nextHour.setHours(now.getHours() + 1, 0, 0, 0);
        return Math.ceil((nextHour.getTime() - now.getTime()) / 1000);
    }
}
