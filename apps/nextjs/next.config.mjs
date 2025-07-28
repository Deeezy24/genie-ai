/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  images: {
    domains: ["img.clerk.com", "images.unsplash.com", "images.pexels.com"],
  },
};

export default nextConfig;
