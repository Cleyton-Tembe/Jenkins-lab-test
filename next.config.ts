import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io", // ✅ domínio do UploadThing
      },
      // {
      //   protocol: "https",
      //   hostname: "*.ufs.sh", // ✅ novo domínio do UploadThing
      // },
    ],
  },
};
export default nextConfig;
