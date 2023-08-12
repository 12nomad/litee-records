/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "files.stripe.com",
      "upload.wikimedia.org",
    ],
  },
};

module.exports = nextConfig;
