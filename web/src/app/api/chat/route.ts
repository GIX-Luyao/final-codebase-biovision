export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const API_BASE = process.env.BEAVER_API_BASE_URL;

function requireApiBase() {
  if (!API_BASE) {
    throw new Error("Missing BEAVER_API_BASE_URL for backend function.");
  }
  return API_BASE;
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const base = requireApiBase();
    const url = new URL("/api/chat", base);
    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const text = await response.text();
    return new Response(text, {
      status: response.status,
      headers: {
        "content-type": response.headers.get("content-type") || "application/json",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
