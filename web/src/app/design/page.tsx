export default function DesignPage() {
  return (
    <div className="min-h-screen bg-[#f7f1e6] px-6 py-10 text-[#1b1b1b]">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold text-[#2b2417]">Design Preview</h1>
          <p className="text-sm text-[#6a5a3f]">
            Embedded from the Lovable UI build. Open in a new tab if needed.
          </p>
          <div className="flex flex-wrap gap-3 text-sm font-semibold text-[#9a6b2f]">
            <a
              href="/design/index.html"
              className="underline underline-offset-4"
              target="_blank"
              rel="noreferrer"
            >
              Open design in new tab
            </a>
            <a
              href="/lovable-chat"
              className="underline underline-offset-4"
            >
              Open Lovable chat
            </a>
          </div>
        </header>
        <div className="overflow-hidden rounded-3xl border border-[#e7dac5] bg-white shadow-sm">
          <iframe
            title="Design Preview"
            src="/design/index.html"
            className="h-[80vh] w-full border-0"
          />
        </div>
        <div className="overflow-hidden rounded-3xl border border-[#e7dac5] bg-white shadow-sm">
          <div className="border-b border-[#efe3d1] px-6 py-4">
            <h2 className="text-lg font-semibold text-[#2f2417]">Chatbot</h2>
            <p className="text-sm text-[#6a5a3f]">
              Live chat UI embedded from the main app.
            </p>
          </div>
          <iframe
            title="Chatbot"
            src="/"
            className="h-[80vh] w-full border-0"
          />
        </div>
      </main>
    </div>
  );
}
