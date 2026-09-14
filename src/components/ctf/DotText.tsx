"use client";

import { useEffect, useRef } from "react";
import { PARTICLE_FLAG_TEXT } from "@/data/ctf";
import { drawFilledText, drawPadlock, paintDots } from "@/lib/draw-text";

export function DotText({
  mode,
}: {
  mode: "flag" | "lock";
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const dest = canvasRef.current;
    if (!wrap || !dest) return;

    const paint = () => {
      const { width, height } = wrap.getBoundingClientRect();
      if (width < 2 || height < 2) return;
      dest.width = Math.floor(width);
      dest.height = Math.floor(height);
      const source =
        mode === "lock"
          ? drawPadlock(dest.width, dest.height)
          : drawFilledText(dest.width, dest.height, PARTICLE_FLAG_TEXT);
      paintDots(dest, source);
    };

    paint();
    const observer = new ResizeObserver(paint);
    observer.observe(wrap);
    return () => observer.disconnect();
  }, [mode]);

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <canvas ref={canvasRef} className="h-full w-full" aria-hidden />
    </div>
  );
}
