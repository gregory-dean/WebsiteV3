"use client";

import { Activity } from "lucide-react";
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
} from "motion/react";
import { useEffect } from "react";
import type { WorkStat } from "@/data/site";
import { cn } from "@/lib/cn";

const SIZE = 176;
const OUTER_R = 74;
const INNER_R = 60;
const OUTER_C = 2 * Math.PI * OUTER_R;
const INNER_C = 2 * Math.PI * INNER_R;

const EASE = [0.22, 1, 0.36, 1] as const;

function formatValue(value: number, decimals?: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals ?? 0,
    maximumFractionDigits: decimals ?? 0,
  });
}

/**
 * Animated circular gauge in the style of the razgraf detail panels, wired to
 * the site theme tokens. Arcs draw in and the value counts up when `active`.
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
  const primaryColor = accent ? "text-accent" : "text-dark-300";
  const secondaryColor = accent ? "text-dark-300" : "text-accent";

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
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dark-750 bg-dark-850/60 p-5">
      <div className="relative flex items-center justify-center">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="size-40 -rotate-90"
          fill="none"
        >
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={OUTER_R}
            className="text-dark-800"
            stroke="currentColor"
            strokeWidth={6}
          />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={INNER_R}
            className="text-dark-800"
            stroke="currentColor"
            strokeWidth={3}
            opacity={0.7}
          />
          <motion.circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={INNER_R}
            className={cn(secondaryColor)}
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray={INNER_C}
            opacity={0.55}
            initial={{ strokeDashoffset: INNER_C }}
            animate={{
              strokeDashoffset: active
                ? INNER_C * (1 - Math.min(1, stat.progress * 0.62))
                : INNER_C,
            }}
            transition={{ duration: 1.2, ease: EASE, delay: delay + 0.05 }}
          />
          <motion.circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={OUTER_R}
            className={cn(primaryColor)}
            stroke="currentColor"
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={OUTER_C}
            initial={{ strokeDashoffset: OUTER_C }}
            animate={{
              strokeDashoffset: active
                ? OUTER_C * (1 - Math.min(1, stat.progress))
                : OUTER_C,
            }}
            transition={{ duration: 1.2, ease: EASE, delay }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
          <span className="flex size-8 items-center justify-center rounded-full bg-dark-800 ring-1 ring-dark-700">
            <Activity className={cn("size-4", primaryColor)} aria-hidden />
          </span>
          <span className="flex items-baseline gap-0.5 tabular-nums">
            <motion.span className="text-2xl text-title">{display}</motion.span>
            {stat.unit ? (
              <span className="text-sm text-dark-400">{stat.unit}</span>
            ) : null}
          </span>
          <span className="max-w-[7rem] text-center text-[0.7rem] leading-tight text-dark-400">
            {stat.sub}
          </span>
        </div>
      </div>

      <p className="text-center text-xs text-description">{stat.caption}</p>
    </div>
  );
}
