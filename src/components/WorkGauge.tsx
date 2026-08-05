"use client";

import {
  animate,
  motion,
  useMotionValue,
  useTransform,
} from "motion/react";
import { useEffect } from "react";
import type { WorkStat } from "@/data/site";
import { cn } from "@/lib/cn";

const EASE = [0.22, 1, 0.36, 1] as const;

function formatValue(value: number, decimals?: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals ?? 0,
    maximumFractionDigits: decimals ?? 0,
  });
}

/**
 * Editorial metric card for work detail panels. Large number, quiet labels,
 * and a single hairline progress track that draws in when active.
 */
export function WorkGauge({
  stat,
  active,
  delay = 0,
}: {
  stat: WorkStat;
  active: boolean;
  delay?: number;
}) {
  const count = useMotionValue(0);
  const display = useTransform(count, (v) => formatValue(v, stat.decimals));
  const accent = stat.tone === "accent";

  useEffect(() => {
    if (!active) {
      count.set(0);
      return;
    }
    const controls = animate(count, stat.value, {
      duration: 1.15,
      ease: EASE,
      delay,
    });
    return () => controls.stop();
  }, [active, count, stat.value, delay]);

  return (
    <div
      className={cn(
        "relative flex flex-col gap-4 overflow-hidden rounded-lg border border-dark-750 bg-dark-850/40 px-5 py-5",
        "before:absolute before:inset-y-0 before:left-0 before:w-px before:bg-current",
        accent ? "before:text-accent" : "before:text-dark-500",
      )}
    >
      <div className="flex items-end justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <p className="text-xs tracking-wide text-dark-400 uppercase">
            {stat.caption}
          </p>
          <p className="text-sm leading-snug text-description">{stat.sub}</p>
        </div>

        <div className="flex shrink-0 items-baseline gap-1 tabular-nums">
          <motion.span className="text-4xl leading-none text-title">
            {display}
          </motion.span>
          {stat.unit ? (
            <span className="text-base text-dark-400">{stat.unit}</span>
          ) : null}
        </div>
      </div>

      <div className="relative h-px w-full overflow-hidden bg-dark-750">
        <motion.div
          className={cn(
            "absolute inset-y-0 left-0",
            accent ? "bg-accent" : "bg-dark-300",
          )}
          initial={{ width: "0%" }}
          animate={{
            width: active ? `${Math.min(100, stat.progress * 100)}%` : "0%",
          }}
          transition={{ duration: 1.1, ease: EASE, delay }}
        />
      </div>
    </div>
  );
}
