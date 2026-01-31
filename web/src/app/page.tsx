"use client";

import { DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";
import { useState } from "react";

export default function Home() {
  const [csvPath, setCsvPath] = useState("");
  const [csvText, setCsvText] = useState("");
  const [csvName, setCsvName] = useState("");
  const [modelId, setModelId] = useState("");
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });
  const isLoading = status === "submitted" || status === "streaming";

  const suggestions = [
    "How many beavers are in the dataset?",
    "List animals found in this CSV.",
    "Total animals detected?",
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff3d6,_#f7efe2_40%,_#f2efe9_100%)] px-6 py-10 text-[#1b1b1b]">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9a6b2f]">
              DFW Beaver ID
            </p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-[#2b2417] md:text-5xl">
              Wildlife dataset chat
            </h1>
            <p className="mt-3 text-base leading-7 text-[#5a4b34]">
              Ask questions about animal detections across your CSV. The assistant
              answers using your latest batch outputs.
            </p>
          </div>
          <div className="rounded-2xl border border-[#e6d9c4] bg-white/70 px-4 py-3 text-sm text-[#6b5a40] shadow-sm">
            Uses AWS Bedrock Claude through Vercel AI SDK
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-[1fr_1.6fr]">
          <div className="rounded-3xl border border-[#e7dac5] bg-white/80 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#2f2417]">Dataset source</h2>
            <p className="mt-2 text-sm text-[#6a5a3f]">
              Upload a CSV or provide a CSV path. The chat uses animal_type +
              has_beaver columns to answer.
            </p>
            <label className="mt-5 block text-sm font-semibold text-[#443321]">
              Upload CSV
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) {
                  setCsvText("");
                  setCsvName("");
                  return;
                }
                setCsvName(file.name);
                const reader = new FileReader();
                reader.onload = () => {
                  setCsvText(String(reader.result || ""));
                };
                reader.readAsText(file);
              }}
              className="mt-2 w-full rounded-2xl border border-[#d9cbb2] bg-white px-4 py-3 text-sm text-[#2b2417] shadow-inner outline-none focus:border-[#b3863e] focus:ring-2 focus:ring-[#e6c17a]"
            />
            <p className="mt-2 text-xs text-[#6a5a3f]">
              {csvName ? `Loaded: ${csvName}` : "No CSV uploaded yet."}
            </p>
            <div className="mt-4">
              <label className="block text-sm font-semibold text-[#443321]">
                Or use CSV path
              </label>
              <input
                value={csvPath}
                onChange={(event) => setCsvPath(event.target.value)}
                placeholder="/Users/you/Downloads/beaver_results_batch.csv"
                className="mt-2 w-full rounded-2xl border border-[#d9cbb2] bg-white px-4 py-3 text-sm text-[#2b2417] shadow-inner outline-none focus:border-[#b3863e] focus:ring-2 focus:ring-[#e6c17a]"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-semibold text-[#443321]">
                Bedrock Model ID / ARN (optional)
              </label>
              <input
                value={modelId}
                onChange={(event) => setModelId(event.target.value)}
                placeholder="arn:aws:bedrock:us-east-2:...:inference-profile/..."
                className="mt-2 w-full rounded-2xl border border-[#d9cbb2] bg-white px-4 py-3 text-sm text-[#2b2417] shadow-inner outline-none focus:border-[#b3863e] focus:ring-2 focus:ring-[#e6c17a]"
              />
              <p className="mt-2 text-xs text-[#6a5a3f]">
                Use this if Amplify env vars are not available at runtime.
              </p>
            </div>
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a1824c]">
                Try asking
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {suggestions.map((hint) => (
                  <button
                    key={hint}
                    type="button"
                    onClick={() => setInput(hint)}
                    className="rounded-full border border-[#e1d2b7] bg-[#fbf6eb] px-4 py-2 text-xs font-semibold text-[#6b5127] transition hover:border-[#caa25d]"
                  >
                    {hint}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col rounded-3xl border border-[#e8dbc6] bg-white/80 shadow-sm">
            <div className="border-b border-[#efe3d1] px-6 py-4">
              <h2 className="text-lg font-semibold text-[#2f2417]">Chat</h2>
              <p className="text-sm text-[#6a5a3f]">
                The model reads your CSV summary and responds in real time.
              </p>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
              {messages.length === 0 && (
                <div className="rounded-2xl border border-dashed border-[#e7dbc7] bg-[#fbf7ef] px-4 py-6 text-sm text-[#826c49]">
                  Start the conversation with a question about animal counts or
                  beaver detections.
                </div>
              )}
              {messages.map((message) => {
                const text = message.parts
                  .filter((part) => part.type === "text")
                  .map((part) => part.text)
                  .join("");
                return (
                <div
                  key={message.id}
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.role === "user"
                      ? "ml-auto bg-[#2e2a21] text-[#fdf7e9]"
                      : "bg-[#f6efe2] text-[#3b2f1b]"
                  }`}
                >
                  {text || "(no text)"}
                </div>
              )})}
            </div>
            <form
              onSubmit={async (event) => {
                event.preventDefault();
                if (!input || (!csvPath && !csvText) || isLoading) {
                  return;
                }
                await sendMessage(
                  { text: input },
                  { body: { csvPath, csvText, modelId } },
                );
                setInput("");
              }}
              className="border-t border-[#efe3d1] px-6 py-4"
            >
              <div className="flex flex-col gap-3 md:flex-row">
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask about bears, beavers, deer..."
                  className="flex-1 rounded-2xl border border-[#d9cbb2] bg-white px-4 py-3 text-sm text-[#2b2417] shadow-inner outline-none focus:border-[#b3863e] focus:ring-2 focus:ring-[#e6c17a]"
                />
                <button
                  type="submit"
                  disabled={!input || (!csvPath && !csvText) || isLoading}
                  className="rounded-2xl bg-[#9a6b2f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#7f5524] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? "Thinking..." : "Send"}
                </button>
              </div>
              {!csvPath && !csvText && (
                <p className="mt-3 text-xs text-[#9a6b2f]">
                  Upload a CSV or add a CSV path before sending a message.
                </p>
              )}
              {error && (
                <p className="mt-3 text-xs text-red-700">
                  Error: {error.message}
                </p>
              )}
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
