
import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  /* config options here */
  productionBrowserSourceMaps: true,
  allowedDevOrigins: ["http://localhost:3001"],
};

module.exports = {
  reactStrictMode: false,
  experimental: {
    serverActions: {
      bodySizeLimit: "30mb",
    },
    proxyClientMaxBodySize: 52428800,
  },
  allowedDevOrigins: ["local-origin.dev", "*.local-origin.dev"],
  images: {
  
    remotePatterns: [
      {
        protocol: "https",
        hostname: "drive.google.com",
        pathname: "/thumbnail",
      },
      {
        protocol: "https",
        hostname: "drive.google.com",
        pathname: "/uc",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "img.daisyui.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "biselco.s3.ap-southeast-1.amazonaws.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self'"
          }
        ],
      },
    ];
  },
};

export default nextConfig;
