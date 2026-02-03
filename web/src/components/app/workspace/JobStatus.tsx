import { motion } from "framer-motion";
import { Loader2, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { JobStatus as JobStatusType } from "@/types/detection";

interface JobStatusProps {
  jobName: string;
  status: JobStatusType;
  progress: number;
  csvReady: boolean;
}

const statusConfig = {
  idle: { label: "Ready", icon: Clock, className: "chip-queued" },
  queued: { label: "Queued", icon: Clock, className: "chip-queued" },
  running: { label: "Running", icon: Loader2, className: "chip-running" },
  complete: { label: "Complete", icon: CheckCircle2, className: "chip-complete" },
  error: { label: "Error", icon: AlertCircle, className: "chip-error" },
};

const JobStatus = ({ jobName, status, progress, csvReady }: JobStatusProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="glass-panel p-6">
      <h3 className="text-lg font-semibold mb-4">Job Status</h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Job Name</span>
          <span className="text-sm text-foreground font-medium truncate max-w-[180px]" title={jobName}>
            {jobName}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Status</span>
          <span className={config.className}>
            <Icon
              className={`w-3.5 h-3.5 ${status === "running" ? "animate-spin" : ""}`}
            />
            {config.label}
          </span>
        </div>

        {(status === "running" || status === "queued") && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-mono">{Math.min(100, Math.round(progress))}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, progress)}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Results CSV</span>
          <span
            className={`text-sm font-medium ${
              csvReady ? "text-emerald-400" : "text-muted-foreground"
            }`}
          >
            {csvReady ? "Ready" : "Not ready"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default JobStatus;
