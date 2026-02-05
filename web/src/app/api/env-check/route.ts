export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const hasBeaverApiBaseUrl = Boolean(process.env.BEAVER_API_BASE_URL);
  return new Response(JSON.stringify({ hasBeaverApiBaseUrl }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
