import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    domains: ["collegeseek.s3.amazonaws.com"], // use your S3 bucket domain
    unoptimized: true, // optional, only if you want to skip optimization
  },

  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: `${process.env.NEXT_PUBLIC_IMG_URL}/uploads/:path*`, // ensure trailing slash
      },
    ];
  },
};

export default nextConfig;

// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   reactStrictMode: true,

//   images: {
//     domains: ["collegeseek.s3.amazonaws.com"], // use your S3 bucket domain
//     unoptimized: true, // optional, only if you want to skip optimization
//   },

//   async rewrites() {
//     return [
//       {
//         source: "/uploads/:path*",
//         destination: `${process.env.NEXT_PUBLIC_IMG_URL}/uploads/:path*`, // ensure trailing slash
//       },
//     ];
//   },
// };

// export default nextConfig;
