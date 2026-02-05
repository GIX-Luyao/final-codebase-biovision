import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    serverComponentsExternalPackages: [
      "@aws-sdk/client-s3",
      "@aws-sdk/client-sqs",
      "@aws-sdk/client-bedrock-runtime",
    ],
  },
};

export default nextConfig;
