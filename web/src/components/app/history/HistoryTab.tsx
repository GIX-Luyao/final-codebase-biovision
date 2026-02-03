"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Calendar, Download, Eye, MessageSquare, ChevronDown, Clock } from "lucide-react";
import { Job, JobStatus } from "@/types/detection";

// Mock history data
const mockHistory: Job[] = [
  {
    id: "job_abc123",
    name: "20250125 Beaver ID – Salmon Creek",
    status: "complete",
    created_at: "2025-01-25T14:30:00Z",
    image_count: 156,
    results: [],
    csv_ready: true,
  },
  {
    id: "job_def456",
    name: "20250123 Beaver ID – Cedar River",
    status: "complete",
    created_at: "2025-01-23T09:15:00Z",
    image_count: 89,
    results: [],
    csv_ready: true,
  },
  {
    id: "job_ghi789",
    name: "20250120 Beaver ID – Lake Washington",
    status: "error",
    created_at: "2025-01-20T16:45:00Z",
    image_count: 234,
    results: [],
    csv_ready: false,
  },
  {
    id: "job_jkl012",
    name: "20250118 Beaver ID – Green River",
    status: "complete",
    created_at: "2025-01-18T11:00:00Z",
    image_count: 67,
    results: [],
    csv_ready: true,
  },
];

const statusConfig: Record<JobStatus, { label: string; className: string }> = {
  idle: { label: "Idle", className: "chip-queued" },
  queued: { label: "Queued", className: "chip-queued" },
  running: { label: "Running", className: "chip-running" },
  complete: { label: "Complete", className: "chip-complete" },
  error: { label: "Error", className: "chip-error" },
};

interface HistoryTabProps {
  onOpenReview: (job: Job) => void;
  onOpenChatbot: (job: Job) => void;
}

const HistoryTab = ({ onOpenReview, onOpenChatbot }: HistoryTabProps) => {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const filteredJobs = mockHistory
    .filter((job) => job.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs..."
            className="input-dark w-full pl-10"
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="btn-ghost flex items-center gap-2 border border-border">
            <Calendar className="w-4 h-4" />
            Date range
          </button>

          <div className="relative">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
              className="appearance-none bg-muted/50 border border-border rounded-xl px-4 py-2.5 pr-10 text-sm font-medium cursor-pointer hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </motion.div>

      {/* Job List */}
      <div className="space-y-4">
        {filteredJobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-panel-hover p-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold">{job.name}</h3>
                  <span className={statusConfig[job.status].className}>
                    {statusConfig[job.status].label}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {formatDate(job.created_at)}
                  </span>
                  <span className="font-mono">
                    {job.image_count} images
                  </span>
                  <code className="bg-muted/50 px-2 py-0.5 rounded text-xs">
                    {job.id}
                  </code>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenReview(job)}
                  disabled={job.status !== "complete"}
                  className="btn-ghost flex items-center gap-2 border border-border disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Eye className="w-4 h-4" />
                  Open Review
                </button>
                <button
                  disabled={!job.csv_ready}
                  className="btn-ghost flex items-center gap-2 border border-border disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4" />
                  CSV
                </button>
                <button
                  onClick={() => onOpenChatbot(job)}
                  disabled={!job.csv_ready}
                  className="btn-ghost flex items-center gap-2 border border-secondary/30 hover:border-secondary/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MessageSquare className="w-4 h-4" />
                  Chatbot
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredJobs.length === 0 && (
          <div className="glass-panel p-12 text-center">
            <p className="text-muted-foreground">No jobs found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryTab;
