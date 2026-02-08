export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import fs from "node:fs/promises";
import path from "node:path";

type AuthConfig = {
  region: string;
  userPoolId: string;
  userPoolClientId: string;
};

async function readJsonIfExists(filePath: string) {
  try {
    const text = await fs.readFile(filePath, "utf8");
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

function findAuthConfig(obj: unknown): AuthConfig | null {
  if (!obj || typeof obj !== "object") return null;

  // Most common Gen2 shape: { auth: { version: "1", payload: { authRegion, userPoolId, webClientId } } }
  const anyObj = obj as any;
  const direct = anyObj?.auth?.payload;
  if (
    direct &&
    typeof direct.authRegion === "string" &&
    typeof direct.userPoolId === "string" &&
    typeof direct.webClientId === "string"
  ) {
    return {
      region: direct.authRegion,
      userPoolId: direct.userPoolId,
      userPoolClientId: direct.webClientId,
    };
  }

  // Fallback: some environments may already flatten values.
  const alt = anyObj?.auth;
  if (
    alt &&
    typeof alt.authRegion === "string" &&
    typeof alt.userPoolId === "string" &&
    typeof alt.webClientId === "string"
  ) {
    return {
      region: alt.authRegion,
      userPoolId: alt.userPoolId,
      userPoolClientId: alt.webClientId,
    };
  }

  // DFS for an auth payload.
  for (const value of Object.values(anyObj)) {
    const found = findAuthConfig(value);
    if (found) return found;
  }

  return null;
}

export async function GET() {
  // Allow explicit injection (useful when amplify_outputs.json isn't on disk).
  const injected = process.env.AMPLIFY_OUTPUTS_JSON;
  if (injected) {
    try {
      const parsed = JSON.parse(injected) as unknown;
      const found = findAuthConfig(parsed);
      if (found) return Response.json(found);
    } catch {
      // fall through
    }
  }

  // Try common locations for `amplify_outputs.json`.
  const candidates = [
    path.join(process.cwd(), "amplify_outputs.json"),
    path.join(process.cwd(), "..", "amplify_outputs.json"),
    path.join(process.cwd(), "..", "..", "amplify_outputs.json"),
  ];

  for (const filePath of candidates) {
    const json = await readJsonIfExists(filePath);
    const found = findAuthConfig(json);
    if (found) return Response.json(found);
  }

  return new Response(
    JSON.stringify({
      error:
        "Auth config not found. Deploy backend auth (Cognito) and ensure amplify_outputs.json is available, or set AMPLIFY_OUTPUTS_JSON.",
    }),
    { status: 500 },
  );
}

