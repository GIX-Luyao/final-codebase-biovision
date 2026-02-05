export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  void req;
  return new Response(
    JSON.stringify({
      error: "Legacy beaver/run path disabled. Use /api/classify (<=5) or /api/jobs (batch).",
    }),
    { status: 410 },
  );
}
