export default function Home() {
  return (
    <div className="min-h-screen bg-[#f7f1e6] px-6 py-10 text-[#1b1b1b]">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9a6b2f]">
            Beaver Insights
          </p>
          <h1 className="text-4xl font-semibold text-[#2b2417]">
            Lovable UI (Main)
          </h1>
          <p className="text-sm text-[#6a5a3f]">
            The Lovable-designed interface is embedded below. Use the Chatbot page
            to run the live assistant.
          </p>
          <div className="flex flex-wrap gap-3 text-sm font-semibold text-[#9a6b2f]">
            <a href="/design/index.html" className="underline underline-offset-4" target="_blank" rel="noreferrer">
              Open design in new tab
            </a>
            <a href="/chatbot" className="underline underline-offset-4">
              Go to chatbot
            </a>
          </div>
        </header>
        <div className="overflow-hidden rounded-3xl border border-[#e7dac5] bg-white shadow-sm">
          <iframe
            title="Lovable UI"
            src="/design/index.html"
            className="h-[80vh] w-full border-0"
          />
        </div>
      </main>
    </div>
  );
}
