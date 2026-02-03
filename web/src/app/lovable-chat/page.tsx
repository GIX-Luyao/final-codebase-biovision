"use client";

import { DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Database, FileSpreadsheet, Send, Sparkles, Upload, User } from "lucide-react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const mockDatasets = [
  { id: "1", name: "20250125 Beaver ID – Salmon Creek", imageCount: 156 },
  { id: "2", name: "20250123 Beaver ID – Cedar River", imageCount: 89 },
  { id: "3", name: "20250118 Beaver ID – Green River", imageCount: 67 },
];

const suggestedQuestions = [
  "How many beavers are in this dataset?",
  "How many other animals?",
  "How many images have no animal?",
  "List animals found in this CSV.",
  "Give me a short weekly summary.",
];

export default function LovableChatPage() {
  const [selectedDataset, setSelectedDataset] = useState(mockDatasets[0].id);
  const [input, setInput] = useState("");
  const [csvText, setCsvText] = useState("");
  const [csvName, setCsvName] = useState("");
  const [csvPath, setCsvPath] = useState("");
  const [modelId, setModelId] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });
  const isTyping = status === "submitted" || status === "streaming";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;
    await sendMessage(
      { text },
      { body: { csvText, csvPath, modelId } },
    );
    setInput("");
  };

  const displayMessages: ChatMessage[] = messages.map((message) => {
    const text = message.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("");
    return {
      id: message.id,
      role: message.role === "assistant" ? "assistant" : "user",
      content: text,
    };
  });

  const dataset = mockDatasets.find((d) => d.id === selectedDataset);

  return (
    <div className="lovable-scope h-[calc(100vh-6rem)] min-h-[700px]">
      <div className="h-full flex">
        {/* Left Panel - Data Source */}
        <div className="w-80 border-r border-border p-6 flex flex-col gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              Data Source
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-2">Select from History</label>
                <select
                  value={selectedDataset}
                  onChange={(event) => setSelectedDataset(event.target.value)}
                  className="input-dark w-full"
                >
                  {mockDatasets.map((ds) => (
                    <option key={ds.id} value={ds.id}>
                      {ds.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-center text-muted-foreground text-sm">or</div>

              <button
                type="button"
                className="btn-ghost w-full flex items-center justify-center gap-2 border border-dashed border-border"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4" />
                Upload CSV file
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
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
              />
              <div className="text-xs text-muted-foreground">
                {csvName ? `Loaded: ${csvName}` : "No CSV uploaded"}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Or use CSV path</label>
                <input
                  value={csvPath}
                  onChange={(event) => setCsvPath(event.target.value)}
                  className="input-dark w-full"
                  placeholder="/path/to/beaver_results.csv"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bedrock Model ID</label>
                <input
                  value={modelId}
                  onChange={(event) => setModelId(event.target.value)}
                  className="input-dark w-full"
                  placeholder="arn:aws:bedrock:us-east-2:..."
                />
              </div>
            </div>
          </div>

          {/* Dataset Stats */}
          {dataset && (
            <div className="glass-panel p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileSpreadsheet className="w-4 h-4 text-secondary" />
                <span className="text-sm font-medium">Dataset Info</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Images</span>
                  <span className="font-mono">{dataset.imageCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="text-emerald-400">Ready</span>
                </div>
              </div>
            </div>
          )}

          {/* Suggested Questions */}
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Suggested Questions
            </h4>
            <div className="space-y-2">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="w-full text-left text-sm p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Chat */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {displayMessages.length === 0 && (
              <div className="h-full flex items-center justify-center">
                <div className="text-center max-w-md">
                  <div className="w-16 h-16 rounded-2xl bg-secondary/20 text-secondary flex items-center justify-center mx-auto mb-4">
                    <Bot className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">AI Wildlife Assistant</h3>
                  <p className="text-muted-foreground">
                    Ask questions about your detection results. Try one of the suggested questions to get started.
                  </p>
                </div>
              </div>
            )}

            <AnimatePresence>
              {displayMessages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-lg bg-secondary/20 text-secondary flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-2xl rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "glass-panel"
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                  </div>
                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-secondary/20 text-secondary flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="glass-panel rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <span
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-6 border-t border-border">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                handleSend();
              }}
              className="flex gap-3"
            >
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about your detection results..."
                className="input-dark flex-1"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="btn-primary px-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
            {error && (
              <p className="mt-3 text-xs text-destructive">
                Error: {error.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
