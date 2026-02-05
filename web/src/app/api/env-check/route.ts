export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { resolveBeaverApiBase } from "@/lib/beaverApiBase";

export async function GET() {
  const resolved = resolveBeaverApiBase();
  return new Response(
    JSON.stringify({
      hasBeaverApiBaseUrl: Boolean(process.env.BEAVER_API_BASE_URL),
      resolvedBaseUrl: resolved.value,
      resolvedFrom: resolved.source,
    }),
    {
      status: 200,
      headers: { "content-type": "application/json" },
    }
  );
}
