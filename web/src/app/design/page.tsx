export default function DesignPage() {
  return (
    <div className="min-h-screen bg-[#f7f1e6] px-6 py-10 text-[#1b1b1b]">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold text-[#2b2417]">Design Preview</h1>
          <p className="text-sm text-[#6a5a3f]">
            Embedded from the Lovable UI build. Open in a new tab if needed.
          </p>
          <a
            href="/design/index.html"
            className="text-sm font-semibold text-[#9a6b2f] underline underline-offset-4"
            target="_blank"
            rel="noreferrer"
          >
            Open design in new tab
          </a>
        </header>
        <div className="overflow-hidden rounded-3xl border border-[#e7dac5] bg-white shadow-sm">
          <iframe
            title="Design Preview"
            src="/design/index.html"
            className="h-[80vh] w-full border-0"
          />
        </div>
      </main>
    </div>
  );
}
