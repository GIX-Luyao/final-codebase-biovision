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
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push(
        "@aws-sdk/client-s3",
        "@aws-sdk/client-sqs",
        "@aws-sdk/client-bedrock-runtime",
      );
    }
    return config;
  },
};

export default nextConfig;
