"use client";

import { m } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";

function curvePoint(t: number, scale: number) {
  const n = t * Math.PI * 2;
  const i = (9.2 + 0.6 * scale) * (0.72 + 0.28 * scale) * Math.cos(2 * n);
  return {
    x: 50 + Math.cos(n) * i * 3.25,
    y: 50 + Math.sin(n) * i * 3.25,
  };
}

function FlowerMark({
  className,
  active,
}: {
  className?: string;
  active: boolean;
}) {
  const start = useRef(0);
  const [state, setState] = useState({
    path: "",
    rotation: 0,
    particles: [] as { x: number; y: number; radius: number; opacity: number }[],
  });

  useEffect(() => {
    if (!active) return;
    start.current = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const elapsed = now - start.current;
      const phase = (elapsed % 5200) / 5200;
      const scale =
        0.52 +
        ((Math.sin(((elapsed % 4300) / 4300) * Math.PI * 2 + 0.55) + 1) / 2) *
          0.48;

      const particles = Array.from({ length: 74 }, (_, i) => {
        const n = i / 73;
        const p = curvePoint((((phase - 0.3 * n) % 1) + 1) % 1, scale);
        const falloff = (1 - n) ** 0.56;
        return {
          x: p.x,
          y: p.y,
          radius: 0.9 + 2.7 * falloff,
          opacity: 0.04 + 0.96 * falloff,
        };
      });

      const path = Array.from({ length: 481 }, (_, i) => {
        const p = curvePoint(i / 480, scale);
        return `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
      }).join(" ");

      setState({
        path,
        rotation: -((elapsed % 28000) / 28000) * 360,
        particles,
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active]);

  if (!active && !state.path) return null;

  return (
    <svg viewBox="0 0 100 100" fill="none" className={cn("size-6 text-current", className)}>
      <g transform={`rotate(${state.rotation} 50 50)`}>
        <path
          d={state.path}
          stroke="currentColor"
          strokeWidth={4.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.1}
        />
        {state.particles.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={p.radius}
            fill="currentColor"
            opacity={p.opacity}
          />
        ))}
      </g>
    </svg>
  );
}

const ornamentVariants = {
  hidden: {
    translateX: 12,
    translateY: -14,
    opacity: 0,
    transition: {
      ease: "easeOut" as const,
      duration: 0.35,
    },
  },
  shown: {
    translateX: 14,
    translateY: -16,
    opacity: 1,
    transition: {
      ease: "easeOut" as const,
      duration: 0.4,
    },
  },
};

export function EmphasizedLink({
  value,
  href,
  active,
}: {
  value: string;
  href: string;
  active: boolean;
}) {
  const reduceMotion = usePrefersReducedMotion();
  const showMark = active && !reduceMotion;
  const external = /^https?:\/\//.test(href);
  return (
    <span className="relative">
      <m.a
        data-cuelume-press
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="cursor-pointer text-title hover:text-title"
      >
        {value}
      </m.a>
      <m.span
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 z-3 flex select-none items-center justify-center"
        initial="hidden"
        animate={showMark ? "shown" : "hidden"}
        variants={ornamentVariants}
      >
        <FlowerMark className="size-6 text-dark-100" active={showMark} />
      </m.span>
    </span>
  );
}
