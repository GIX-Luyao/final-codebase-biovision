import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["@aws-sdk/client-s3", "@aws-sdk/*"],
  turbopack: {},
};

export default nextConfig;
