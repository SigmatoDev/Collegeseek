import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    domains: [process.env.NEXT_PUBLIC_IMAGE_DOMAIN as string],
    unoptimized: true,
  },

  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: `${process.env.NEXT_PUBLIC_IMG_URL}uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
