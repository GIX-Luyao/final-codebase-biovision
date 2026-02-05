export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { resolveBeaverApiBase } from "@/lib/beaverApiBase";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const base = resolveBeaverApiBase().value;
    const url = new URL("/api/classify", base);
    const response = await fetch(url, { method: "POST", body: formData });
    const text = await response.text();
    return new Response(text, {
      status: response.status,
      headers: {
        "content-type": response.headers.get("content-type") || "application/json",
      },
    });
  } catch (error) {
    console.error("Classify API error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
