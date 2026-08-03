"use client";

import { skillsRows } from "@/data/site";
import { cn } from "@/lib/cn";

function Row({
  items,
  reverse = false,
  durationClass,
}: {
  items: readonly string[];
  reverse?: boolean;
  durationClass?: string;
}) {
  const loop = [...items, ...items];
  return (
    <div className="relative flex overflow-hidden py-1">
      <div
        className={cn(
          "flex w-max gap-2",
          reverse ? "animate-marquee-reverse" : "animate-marquee",
          durationClass,
        )}
      >
        {loop.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="shrink-0 rounded-md bg-dark-850 px-3 py-1 text-sm text-title ring-1 ring-dark-500"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SkillsMarquee() {
  return (
    <div className="relative isolate mt-3 h-auto w-full overflow-hidden rounded-sm border border-dark-700 bg-dark-950/40 py-3 sm:h-60 sm:py-4">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-dark-900 to-transparent sm:w-16"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-dark-900 to-transparent sm:w-16"
      />

      <div className="flex h-full flex-col justify-center gap-2">
        <Row items={skillsRows[0]} />
        <Row items={skillsRows[1]} reverse />
        <Row items={skillsRows[2]} />
        <Row items={skillsRows[3]} reverse />
      </div>
    </div>
  );
}
