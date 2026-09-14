"use client";

import { ArrowRight, Building2, Shield, Wifi, X } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useSyncExternalStore } from "react";
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
const FOCUSABLE =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

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
  work: ExperienceItem | null;
  onClose: () => void;
}) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!work) return;

    restoreFocus.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const nodes = [
        ...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ].filter((el) => !el.hasAttribute("disabled"));
      if (nodes.length === 0) return;
      const first = nodes[0]!;
      const last = nodes[nodes.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.getElementById("app-root")?.setAttribute("inert", "");
    const focusId = window.requestAnimationFrame(() => {
      closeRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(focusId);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      document.getElementById("app-root")?.removeAttribute("inert");
      restoreFocus.current?.focus();
    };
  }, [work, onClose]);

  if (!mounted) return null;

  const Icon = work ? icons[work.icon] : icons.building;

  return createPortal(
    <AnimatePresence>
      {work ? (
        <m.div key={work.id} className="fixed inset-0 z-50">
          <m.div
            aria-hidden
            onClick={onClose}
            className="absolute inset-0 bg-dark-950/45 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          />

          <m.aside
            ref={panelRef}
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
              ref={closeRef}
              type="button"
              onClick={onClose}
              title="Close"
              aria-label="Close panel"
              data-cuelume-press
              className="absolute top-5 right-5 z-3 flex size-8 items-center justify-center rounded-sm text-dark-400 transition-colors hover:bg-dark-800 hover:text-title"
            >
              <X className="size-4" aria-hidden />
            </button>

            <m.div
              variants={container}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-8 px-6 py-10 sm:px-8"
            >
              <m.div variants={item} className="flex flex-col gap-4">
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
              </m.div>

              {work.detail.summary.map((paragraph, i) => (
                <m.p
                  key={`summary-${i}`}
                  variants={item}
                  className="text-sm leading-relaxed text-description"
                >
                  {paragraph}
                </m.p>
              ))}

              {work.detail.image ? (
                <m.div
                  variants={item}
                  className="overflow-hidden rounded-lg ring-1 ring-dark-700"
                >
                  <Image
                    src={work.detail.image.src}
                    alt={work.detail.image.alt}
                    width={1600}
                    height={900}
                    className="aspect-[16/9] w-full object-cover"
                  />
                </m.div>
              ) : null}

              {work.detail.stats?.length ? (
                <m.div
                  variants={item}
                  className={cn(
                    "grid grid-cols-1 gap-2",
                    work.detail.stats.length > 1 && "lg:grid-cols-2",
                  )}
                >
                  {work.detail.stats.map((stat, i) => (
                    <WorkGauge
                      key={`stat-${i}`}
                      stat={stat}
                      active
                      delay={0.3 + i * 0.12}
                    />
                  ))}
                </m.div>
              ) : null}

              {work.detail.highlights?.length ? (
                <m.ul
                  variants={item}
                  className="flex flex-col rounded-lg border border-dark-750 bg-dark-850/40"
                >
                  {work.detail.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex items-start gap-3 border-b border-dark-750 px-4 py-3 text-sm leading-relaxed text-description last:border-none"
                    >
                      <ArrowRight
                        className="mt-1 size-3.5 shrink-0 text-dark-400"
                        aria-hidden
                      />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </m.ul>
              ) : null}

              {work.detail.sections.map((section, i) => (
                <m.div
                  key={`section-${i}`}
                  variants={item}
                  className="flex flex-col gap-3"
                >
                  <h3 className="text-base text-title">{section.heading}</h3>
                  {section.body.map((paragraph, j) => (
                    <p
                      key={`section-${i}-body-${j}`}
                      className="text-sm leading-relaxed text-description"
                    >
                      {paragraph}
                    </p>
                  ))}
                </m.div>
              ))}
            </m.div>
          </m.aside>
        </m.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
