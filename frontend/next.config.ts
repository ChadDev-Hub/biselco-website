import type { NextConfig } from "next";


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
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com"
      },
      {
        protocol: "https",
        hostname: "img.daisyui.com",
      }

    ]
  }
}

export default nextConfig;
