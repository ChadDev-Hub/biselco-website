import type { NextConfig } from "next";
import { hostname } from "os";

const nextConfig: NextConfig = {
  /* config options here */
  productionBrowserSourceMaps: true,
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://192.168.254.118:3000",
  ],
};

module.exports = {
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],
  images:{
    remotePatterns:[{
        protocol: "https",
        hostname: "drive.google.com",
        pathname: "/thumbnail",
      },
      {
        protocol: "https",
        hostname: "drive.google.com",
        pathname: "/uc"
      }

    ]
  }
}

export default nextConfig;
