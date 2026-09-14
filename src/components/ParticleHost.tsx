"use client";

import { useEffect, useState, type ComponentType } from "react";
import { DotText } from "@/components/ctf/DotText";
import { useSignal } from "@/components/signal/SignalProvider";
import { DURATION_TOTAL_REVEAL, PARTICLE_FRAME_CLASS } from "@/data/site";
import { useCtf } from "@/lib/ctf-store";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";

type SceneProps = {
  delay?: number;
  morphSeconds?: number;
  framed?: boolean;
};

export function ParticleHost({
  delay = DURATION_TOTAL_REVEAL,
  morphSeconds = 6,
}: {
  delay?: number;
  morphSeconds?: number;
}) {
  const reduceMotion = usePrefersReducedMotion();
  const { on: hunt } = useSignal();
  const ctf = useCtf();
  const [Scene, setScene] = useState<ComponentType<SceneProps> | null>(null);

  useEffect(() => {
    if (reduceMotion) return;
    let cancelled = false;

    const load = () => {
      void import("@/components/ParticleScene").then((mod) => {
        if (!cancelled) setScene(() => mod.ParticleScene);
      });
    };

    const idle = window.requestIdleCallback;
    if (idle) {
      const id = idle(load, { timeout: 1600 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback?.(id);
      };
    }

    const id = globalThis.setTimeout(load, 200);
    return () => {
      cancelled = true;
      globalThis.clearTimeout(id);
    };
  }, [reduceMotion]);

  if (reduceMotion) {
    return (
      <div className={PARTICLE_FRAME_CLASS}>
        {hunt ? (
          <DotText mode={ctf.complete ? "lock" : "flag"} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/image-name.webp"
            alt=""
            className="h-full w-full object-contain opacity-80"
          />
        )}
      </div>
    );
  }

  return (
    <div className={PARTICLE_FRAME_CLASS}>
      {Scene ? (
        <Scene delay={delay} morphSeconds={morphSeconds} framed />
      ) : null}
    </div>
  );
}
