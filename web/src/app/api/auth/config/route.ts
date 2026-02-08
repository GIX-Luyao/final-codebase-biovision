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

function parsePossiblyWrappedJson(input: string): { value: unknown | null; error: string } {
  const trimmed = (input || "").trim();
  if (!trimmed) return { value: null, error: "empty" };
  try {
    return { value: JSON.parse(trimmed) as unknown, error: "" };
  } catch (err) {
    // Some UIs wrap the JSON in quotes. Try parsing twice: JSON-string -> JSON-object.
    try {
      const once = JSON.parse(trimmed) as unknown;
      if (typeof once === "string") {
        return { value: JSON.parse(once) as unknown, error: "" };
      }
    } catch {
      // ignore
    }
    return { value: null, error: err instanceof Error ? err.message : "invalid_json" };
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

  // Amplify outputs v1.4 shape: { auth: { aws_region, user_pool_id, user_pool_client_id, ... } }
  const v14 = anyObj?.auth;
  if (
    v14 &&
    typeof v14.aws_region === "string" &&
    typeof v14.user_pool_id === "string" &&
    typeof v14.user_pool_client_id === "string"
  ) {
    return {
      region: v14.aws_region,
      userPoolId: v14.user_pool_id,
      userPoolClientId: v14.user_pool_client_id,
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

export async function GET(req: Request) {
  const url = new URL(req.url);
  const debugEnabled =
    url.searchParams.get("debug") === "1" || process.env.AMPLIFY_AUTH_CONFIG_DEBUG === "1";

  const diagnostics: Record<string, unknown> = {
    checkedFiles: [] as string[],
    hasEnv: false,
    envParseError: "",
    envFound: false,
    debug: debugEnabled,
  };

  // Allow explicit injection (useful when amplify_outputs.json isn't on disk).
  const injected = process.env.AMPLIFY_OUTPUTS_JSON;
  if (injected) {
    diagnostics.hasEnv = true;
    const parsed = parsePossiblyWrappedJson(injected);
    diagnostics.envParseError = parsed.error;
    const found = findAuthConfig(parsed.value);
    if (found) return Response.json(found);
  }

  // Alternate env var: Base64-encoded JSON to avoid UI escaping issues.
  const injectedB64 = process.env.AMPLIFY_OUTPUTS_JSON_B64;
  if (injectedB64) {
    diagnostics.hasEnv = true;
    try {
      const decoded = Buffer.from(injectedB64, "base64").toString("utf8");
      const parsed = parsePossiblyWrappedJson(decoded);
      diagnostics.envParseError = diagnostics.envParseError || parsed.error;
      const found = findAuthConfig(parsed.value);
      if (found) return Response.json(found);
    } catch (err) {
      diagnostics.envParseError =
        diagnostics.envParseError ||
        (err instanceof Error ? err.message : "invalid_base64");
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
    (diagnostics.checkedFiles as string[]).push(filePath);
  }

  const error =
    "Auth config not found. Deploy backend auth (Cognito) and ensure amplify_outputs.json is available, or set AMPLIFY_OUTPUTS_JSON.";
  return new Response(JSON.stringify(debugEnabled ? { error, diagnostics } : { error }), {
    status: 500,
    headers: { "content-type": "application/json" },
  });
}
