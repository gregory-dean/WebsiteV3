"use client";

import { Building2, Shield, Wifi, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { ExperienceItem } from "@/data/site";
import { cn } from "@/lib/cn";
import { WorkGauge } from "@/components/WorkGauge";

const icons = {
  building: Building2,
  shield: Shield,
  wifi: Wifi,
} as const;

const EASE = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.12, staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, translateY: 10, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    translateY: 0,
    filter: "blur(0px)",
    transition: { ease: EASE, duration: 0.4 },
  },
};

export function WorkDetailPanel({
  work,
  onClose,
}: {
  work: ExperienceItem;
  onClose: () => void;
}) {
  const Icon = icons[work.icon];

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <motion.div key="work-detail" className="fixed inset-0 z-50">
      <motion.div
        aria-hidden
        onClick={onClose}
        className="absolute inset-0 bg-dark-950/45 backdrop-blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
      />

      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-label={`${work.name} details`}
        className={cn(
          "absolute inset-y-0 right-0 flex w-full flex-col overflow-y-auto bg-dark-900 shadow-2xl shadow-dark-950/60",
          "border-l border-dark-750",
          "sm:w-[42%] sm:min-w-[440px]",
        )}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.42, ease: EASE }}
      >
        <button
          type="button"
          onClick={onClose}
          title="Close"
          aria-label="Close panel"
          data-cuelume-press
          className="absolute top-5 right-5 z-3 flex size-8 items-center justify-center rounded-sm text-dark-400 transition-colors hover:bg-dark-800 hover:text-title"
        >
          <X className="size-4" aria-hidden />
        </button>

        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-8 px-6 py-10 sm:px-8"
        >
          <motion.div variants={item} className="flex flex-col gap-4">
            <span className="flex size-12 items-center justify-center rounded-xl bg-dark-850 ring-1 ring-dark-700">
              <Icon className="size-5 text-dark-100" aria-hidden />
            </span>
            <div className="flex flex-col gap-1">
              <h2 className="text-xl text-title">{work.name}</h2>
              <p className="text-sm text-description">
                {work.position} · {work.years.join(" / ")}
              </p>
            </div>
            <div className="h-px w-full bg-dark-750" />
          </motion.div>

          {work.detail.summary.map((paragraph, i) => (
            <motion.p
              key={`summary-${i}`}
              variants={item}
              className="text-sm leading-relaxed text-description"
            >
              {paragraph}
            </motion.p>
          ))}

          <motion.div
            variants={item}
            className="grid grid-cols-1 gap-4 lg:grid-cols-2"
          >
            {work.detail.stats.map((stat, i) => (
              <WorkGauge
                key={`stat-${i}`}
                stat={stat}
                active
                delay={0.3 + i * 0.12}
              />
            ))}
          </motion.div>

          {work.detail.sections.map((section, i) => (
            <motion.div
              key={`section-${i}`}
              variants={item}
              className="flex flex-col gap-3"
            >
              <div className="flex items-center gap-2">
                <h3 className="text-base text-title">{section.heading}</h3>
                {section.placeholder ? (
                  <span className="rounded-full border border-dark-700 px-2 py-0.5 text-[0.65rem] tracking-wide text-dark-400 uppercase">
                    Placeholder
                  </span>
                ) : null}
              </div>
              {section.body.map((paragraph, j) => (
                <p
                  key={`section-${i}-body-${j}`}
                  className="text-sm leading-relaxed text-description"
                >
                  {paragraph}
                </p>
              ))}
            </motion.div>
          ))}
        </motion.div>
      </motion.aside>
    </motion.div>,
    document.body,
  );
}
