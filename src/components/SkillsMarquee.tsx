"use client";

import { useEffect, useRef, useState } from "react";
import { skillsRows } from "@/data/site";

const DURATION_FORWARD = 28;
const DURATION_REVERSE = 32;

function SkillPills({
  items,
  ariaHidden = false,
}: {
  items: readonly string[];
  ariaHidden?: boolean;
}) {
  return (
    <div
      className="flex gap-2 pr-2"
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
  duration,
}: {
  items: readonly string[];
  reverse?: boolean;
  duration: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const halfRef = useRef(0);
  const pausedRef = useRef(false);

  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const track = trackRef.current;
    const copy = copyRef.current;
    if (!track || !copy) return;

    const measure = () => {
      const half = copy.offsetWidth;
      if (half <= 0) return;
      const wasUnmeasured = halfRef.current === 0;
      halfRef.current = half;
      if (wasUnmeasured && reverse) {
        offsetRef.current = -half;
        track.style.transform = `translate3d(${offsetRef.current}px,0,0)`;
      }
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(copy);

    let last = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      const half = halfRef.current;
      if (
        half > 0 &&
        !pausedRef.current &&
        !document.hidden
      ) {
        const speed = half / duration;
        const dir = reverse ? 1 : -1;
        let next = offsetRef.current + dir * speed * dt;
        next = ((next % half) + half) % half - half;
        offsetRef.current = next;
        track.style.transform = `translate3d(${next}px,0,0)`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const onVisibility = () => {
      last = performance.now();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [duration, reduceMotion, reverse]);

  if (reduceMotion) {
    return (
      <div className="relative flex flex-wrap gap-2 overflow-hidden py-1">
        <SkillPills items={items} />
      </div>
    );
  }

  return (
    <div
      className="relative flex overflow-hidden py-1"
      onPointerEnter={() => {
        pausedRef.current = true;
      }}
      onPointerLeave={() => {
        pausedRef.current = false;
      }}
    >
      <div
        ref={trackRef}
        className="flex w-max will-change-transform"
      >
        <div ref={copyRef}>
          <SkillPills items={items} />
        </div>
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
        <Row items={skillsRows[0]} duration={DURATION_FORWARD} />
        <Row items={skillsRows[1]} reverse duration={DURATION_REVERSE} />
        <Row items={skillsRows[2]} duration={DURATION_FORWARD} />
        <Row items={skillsRows[3]} reverse duration={DURATION_REVERSE} />
      </div>
    </div>
  );
}
