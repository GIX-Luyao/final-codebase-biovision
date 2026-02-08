import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const turbopackRoot = path.dirname(fileURLToPath(import.meta.url));

function parsePossiblyWrappedJson(input: string | undefined): unknown | null {
  const trimmed = (input || "").trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    // Some UIs wrap JSON in quotes. Try parsing twice: JSON-string -> JSON-object.
    try {
      const once = JSON.parse(trimmed) as unknown;
      if (typeof once === "string") return JSON.parse(once) as unknown;
    } catch {
      // ignore
    }
    return null;
  }
}

function extractCognitoFromAmplifyOutputs(outputs: unknown): {
  region: string;
  userPoolId: string;
  userPoolClientId: string;
} | null {
  if (!outputs || typeof outputs !== "object") return null;
  const anyObj = outputs as any;

  // Gen2 auth output schema: { auth: { payload: { authRegion, userPoolId, webClientId } } }
  const p = anyObj?.auth?.payload;
  if (
    p &&
    typeof p.authRegion === "string" &&
    typeof p.userPoolId === "string" &&
    typeof p.webClientId === "string"
  ) {
    return { region: p.authRegion, userPoolId: p.userPoolId, userPoolClientId: p.webClientId };
  }

  // Amplify outputs v1.4: { auth: { aws_region, user_pool_id, user_pool_client_id, ... } }
  const a = anyObj?.auth;
  if (
    a &&
    typeof a.aws_region === "string" &&
    typeof a.user_pool_id === "string" &&
    typeof a.user_pool_client_id === "string"
  ) {
    return { region: a.aws_region, userPoolId: a.user_pool_id, userPoolClientId: a.user_pool_client_id };
  }

  return null;
}

function buildAuthEnv() {
  const injectedB64 = process.env.AMPLIFY_OUTPUTS_JSON_B64;
  const decoded =
    injectedB64 && injectedB64.trim()
      ? Buffer.from(injectedB64, "base64").toString("utf8")
      : undefined;

  const outputs =
    parsePossiblyWrappedJson(decoded) ??
    parsePossiblyWrappedJson(process.env.AMPLIFY_OUTPUTS_JSON);

  const cognito = extractCognitoFromAmplifyOutputs(outputs);
  if (!cognito) return {};

  // These are not secrets; they're IDs required to talk to Cognito from the browser.
  return {
    NEXT_PUBLIC_COGNITO_REGION: cognito.region,
    NEXT_PUBLIC_COGNITO_USER_POOL_ID: cognito.userPoolId,
    NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID: cognito.userPoolClientId,
  };
}

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["@aws-sdk/client-s3", "@aws-sdk/*"],
  env: buildAuthEnv(),
  // Without this, Next/Turbopack can "infer" the monorepo root as the parent
  // directory (due to multiple lockfiles), which breaks module resolution
  // (e.g. it tries to resolve `tailwindcss` from the repo root).
  turbopack: { root: turbopackRoot },
};

export default nextConfig;
