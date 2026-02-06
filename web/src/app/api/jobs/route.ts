export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { resolveBeaverApiBase } from "@/lib/beaverApiBase";

export async function POST(req: Request) {
  try {
    const base = resolveBeaverApiBase().value;
    const url = new URL("/api/jobs", base);
    const contentType = req.headers.get("content-type") || "";
    const body = await req.arrayBuffer();
    const headers = contentType ? { "content-type": contentType } : undefined;
    const response = await fetch(url, {
      method: "POST",
      headers,
      body,
    });
    const text = await response.text();
    return new Response(text, {
      status: response.status,
      headers: {
        "content-type": response.headers.get("content-type") || "application/json",
      },
    });
  } catch (error) {
    console.error("Jobs API error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
