"use client";

import { useMemo } from "react";

export default function VercelChatPage() {
  const src = useMemo(() => {
    return (
      process.env.NEXT_PUBLIC_VERCEL_CHAT_URL ||
      "http://localhost:3002"
    );
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f7f4] text-[#1b1b1b]">
      <header className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-6 py-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4c4c46]">
          Vercel AI Chatbot
        </p>
        <h1 className="text-2xl font-semibold">Embedded UI Preview</h1>
        <p className="text-sm text-[#6b6a63]">
          This route embeds the Vercel AI Chatbot app. Set{" "}
          <code className="rounded bg-[#eceae4] px-1 py-0.5">
            NEXT_PUBLIC_VERCEL_CHAT_URL
          </code>{" "}
          if you run it on another host/port.
        </p>
      </header>

      <main className="mx-auto w-full max-w-5xl px-6 pb-10">
        <div className="overflow-hidden rounded-2xl border border-[#e3e1da] bg-white shadow-sm">
          <iframe
            title="Vercel AI Chatbot"
            src={src}
            className="h-[80vh] w-full border-0"
          />
        </div>
      </main>
    </div>
  );
}
