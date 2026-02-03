"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Download, MessageSquare, Edit3 } from "lucide-react";
import UploadSection from "./UploadSection";
import JobStatus from "./JobStatus";
import ResultsTable from "./ResultsTable";
import { useDetectionJob } from "@/hooks/useDetectionJob";
import type { AppTab } from "../TabNavigation";

interface WorkspaceTabProps {
  onOpenChatbot: () => void;
}

const WorkspaceTab = ({ onOpenChatbot }: WorkspaceTabProps) => {
  const [jobName, setJobName] = useState(
    `${new Date().toISOString().split("T")[0]} Beaver ID – Site Name`
  );

  const {
    currentJob,
    uploadedFiles,
    s3Path,
    progress,
    createJob,
    uploadFiles,
    setS3Path,
    runDetection,
    updateResultLabel,
    updateResultNotes,
    exportCSV,
  } = useDetectionJob();

  useEffect(() => {
    if (!currentJob) {
      createJob(jobName);
    }
  }, []);

  useEffect(() => {
    if (currentJob && currentJob.name !== jobName) {
      createJob(jobName);
    }
  }, [jobName]);

  const canRunDetection =
    (uploadedFiles.length > 0 || s3Path.trim().length > 0) &&
    currentJob?.status !== "running" &&
    currentJob?.status !== "queued";

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Job Setup */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Edit3 className="w-5 h-5 text-primary" />
          Job Setup
        </h3>
        <div>
          <label className="block text-sm font-medium mb-2">Job Name</label>
          <input
            type="text"
            value={jobName}
            onChange={(e) => setJobName(e.target.value)}
            className="input-dark w-full max-w-lg"
            placeholder="Enter job name..."
          />
          <p className="text-xs text-muted-foreground mt-2">
            Tip: Use a site name + date for easy search later
          </p>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <UploadSection
            files={uploadedFiles}
            s3Path={s3Path}
            onUpload={uploadFiles}
            onS3PathChange={setS3Path}
          />
        </motion.div>

        {/* Job Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {currentJob && (
            <JobStatus
              jobName={jobName}
              status={currentJob.status}
              progress={progress}
              csvReady={currentJob.csv_ready}
            />
          )}
        </motion.div>
      </div>

      {/* Run Detection Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center"
      >
        <button
          onClick={runDetection}
          disabled={!canRunDetection}
          className={`btn-primary flex items-center gap-2 text-lg px-8 ${
            !canRunDetection ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <Play className="w-5 h-5" />
          Run Detection
        </button>
      </motion.div>

      {/* Results Table */}
      {currentJob?.results && currentJob.results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">
              Results{" "}
              <span className="text-muted-foreground font-mono text-base">
                ({currentJob.results.length} images)
              </span>
            </h3>
            <div className="flex items-center gap-3">
              <button onClick={exportCSV} className="btn-secondary flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download CSV
              </button>
              <button
                onClick={onOpenChatbot}
                className="btn-ghost flex items-center gap-2 border border-secondary/30 hover:border-secondary/50"
              >
                <MessageSquare className="w-4 h-4" />
                Open in Chatbot
              </button>
            </div>
          </div>

          <ResultsTable
            results={currentJob.results}
            onUpdateLabel={updateResultLabel}
            onUpdateNotes={updateResultNotes}
          />

          {/* Export Actions */}
          <div className="flex justify-end gap-3">
            <button onClick={exportCSV} className="btn-primary flex items-center gap-2">
              <Download className="w-4 h-4" />
              Save Corrected CSV
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default WorkspaceTab;
