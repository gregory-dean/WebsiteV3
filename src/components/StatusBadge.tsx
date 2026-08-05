import type { WritingStatus } from "@/lib/types";
import { cn } from "@/lib/cn";

const labels: Record<WritingStatus, string> = {
  active: "Active",
  lab: "Lab",
  complete: "Complete",
};

const tones: Record<WritingStatus, string> = {
  active: "text-title",
  lab: "text-description",
  complete: "text-dark-400",
};

/** Quiet uppercase pill marking a writing post as active, lab, or complete. */
export function StatusBadge({ status }: { status?: WritingStatus }) {
  if (!status) return null;
  return (
    <span
      className={cn(
        "rounded-sm bg-dark-850 px-1.5 py-0.5 text-xs tracking-widest uppercase ring-1 ring-dark-700",
        tones[status],
      )}
    >
      {labels[status]}
    </span>
  );
}
