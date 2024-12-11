/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    PUSHER_APP_ID: process.env.PUSHER_APP_ID,
    NEXT_PUBLIC_PUSHER_KEY: process.env.NEXT_PUBLIC_PUSHER_KEY,
    PUSHER_SECRET: process.env.PUSHER_SECRET,
    NEXT_PUBLIC_PUSHER_CLUSTER: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    LINE_CHANNEL_ACCESS_TOKEN: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    LINE_CHANNEL_SECRET: process.env.LINE_CHANNEL_SECRET,
    FACEBOOK_PAGE_ACCESS_TOKEN: process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
    FACEBOOK_VERIFY_TOKEN: process.env.FACEBOOK_VERIFY_TOKEN,
    DATABASE_URL: process.env.DATABASE_URL,
    API_SECRET_KEY: process.env.API_SECRET_KEY
  }
};

module.exports = nextConfig;