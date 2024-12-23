import { Redis } from '@upstash/redis';

if (!process.env.REDIS_URL) {
  throw new Error('REDIS_URL is not defined');
}

// Parse URL to extract token
const url = new URL(process.env.REDIS_URL);
const token = url.password;

export const redis = new Redis({
  url: process.env.REDIS_URL,
  token: token,
  // Optional configuration
  automaticDeserialization: true,
  enableTelemetry: false
});