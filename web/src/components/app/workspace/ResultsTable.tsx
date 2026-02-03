"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Check, X, ChevronDown } from "lucide-react";
import { DetectionResult, DetectionLabel } from "@/types/detection";

interface ResultsTableProps {
  results: DetectionResult[];
  onUpdateLabel: (id: string, label: DetectionLabel) => void;
  onUpdateNotes: (id: string, notes: string) => void;
}

const labelOptions: { value: DetectionLabel; label: string; color: string }[] = [
  { value: "beaver", label: "Beaver", color: "text-primary" },
  { value: "other_animal", label: "Other Animal", color: "text-secondary" },
  { value: "no_animal", label: "No Animal", color: "text-muted-foreground" },
  { value: "other", label: "Other", color: "text-amber-400" },
];

const ResultsTable = ({ results, onUpdateLabel, onUpdateNotes }: ResultsTableProps) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);

  const getLabelColor = (label: DetectionLabel) => {
    return labelOptions.find((l) => l.value === label)?.color || "text-foreground";
  };

  return (
    <>
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Preview</th>
                <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Filename</th>
                <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Predicted</th>
                <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Confidence</th>
                <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Reason</th>
                <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Review Label</th>
                <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Corrected</th>
                <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {results.map((result, index) => (
                <motion.tr
                  key={result.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="w-16 h-12 bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                      <img
                        src={result.image_path}
                        alt={result.filename}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <Eye className="w-4 h-4 text-muted-foreground hidden" />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <code className="font-mono text-sm">{result.filename}</code>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-medium ${getLabelColor(result.predicted_label)}`}>
                      {labelOptions.find((l) => l.value === result.predicted_label)?.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${result.confidence * 100}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs text-muted-foreground">
                        {(result.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-muted-foreground max-w-xs truncate block">
                      {result.reason}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative">
                      <select
                        value={result.review_label}
                        onChange={(e) => onUpdateLabel(result.id, e.target.value as DetectionLabel)}
                        className="appearance-none bg-muted/50 border border-border rounded-lg px-3 py-1.5 pr-8 text-sm font-medium cursor-pointer hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        {labelOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {result.was_corrected ? (
                      <span className="inline-flex items-center gap-1 text-primary text-sm">
                        <Check className="w-4 h-4" />
                        Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-muted-foreground text-sm">
                        <X className="w-4 h-4" />
                        No
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingNotes === result.id ? (
                      <input
                        type="text"
                        value={result.notes}
                        onChange={(e) => onUpdateNotes(result.id, e.target.value)}
                        onBlur={() => setEditingNotes(null)}
                        onKeyDown={(e) => e.key === "Enter" && setEditingNotes(null)}
                        autoFocus
                        className="input-dark text-sm py-1 px-2 w-full"
                        placeholder="Add notes..."
                      />
                    ) : (
                      <button
                        onClick={() => setEditingNotes(result.id)}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left w-full truncate"
                      >
                        {result.notes || "Add notes..."}
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewImage(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-panel p-4 max-w-4xl w-full"
            >
              <div className="aspect-video bg-muted rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground font-mono">{previewImage}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    (Preview would show actual trail camera image)
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ResultsTable;
