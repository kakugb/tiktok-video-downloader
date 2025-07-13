
const { i18n } = require('./next-i18next.config');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.tiktokcdn.com', // Covers all tiktokcdn.com subdomains
      },
      {
        protocol: 'https',
        hostname: 'p16-pu-sign-no.tiktokcdn-eu.com', // Explicitly include the problematic hostname
      },
    ],
  },
};

module.exports = nextConfig;