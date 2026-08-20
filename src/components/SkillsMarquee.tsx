"use client";

import { useEffect, useRef, useState } from "react";
import { skillsRows } from "@/data/site";
import { cn } from "@/lib/cn";

function SkillPills({
  items,
  ariaHidden = false,
}: {
  items: readonly string[];
  ariaHidden?: boolean;
}) {
  return (
    <div
      className="flex shrink-0 gap-2 pr-2"
      aria-hidden={ariaHidden || undefined}
    >
      {items.map((item, i) => (
        <span
          key={`${item}-${i}`}
          className="shrink-0 rounded-md bg-dark-850 px-3 py-1 text-sm text-title ring-1 ring-dark-500 transition-colors hover:bg-dark-800 hover:ring-dark-400"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function Row({
  items,
  reverse = false,
}: {
  items: readonly string[];
  reverse?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const hoveringRef = useRef(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const apply = () => {
      const paused = hoveringRef.current || document.hidden || reduceMotion;
      track.style.animationPlayState = paused ? "paused" : "running";
    };

    apply();
    document.addEventListener("visibilitychange", apply);
    return () => document.removeEventListener("visibilitychange", apply);
  }, [reduceMotion]);

  const setHovering = (hovering: boolean) => {
    hoveringRef.current = hovering;
    const track = trackRef.current;
    if (!track) return;
    track.style.animationPlayState =
      hovering || document.hidden || reduceMotion ? "paused" : "running";
  };

  if (reduceMotion) {
    return (
      <div className="relative flex flex-wrap gap-2 overflow-hidden py-1">
        <SkillPills items={items} />
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden py-1"
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
    >
      <div
        ref={trackRef}
        className={cn(
          "flex w-max min-w-max shrink-0",
          reverse ? "animate-marquee-reverse" : "animate-marquee",
        )}
      >
        <SkillPills items={items} />
        <SkillPills items={items} ariaHidden />
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
