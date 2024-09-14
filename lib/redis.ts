import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.REDIS_URL || "https://huge-albacore-30624.upstash.io", 
  token: process.env.REDIS_TOKEN || "<TOKEN>",
});

export default redis;
