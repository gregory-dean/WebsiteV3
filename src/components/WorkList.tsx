"use client";

import {
  AppWindow,
  ArrowUpRight,
  Building2,
  Shield,
  Wifi,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { experience, reveal, type ExperienceItem } from "@/data/site";
import { cn } from "@/lib/cn";
import { WorkDetailPanel } from "@/components/WorkDetailPanel";

const icons = {
  building: Building2,
  shield: Shield,
  wifi: Wifi,
} as const;

function isExternal(href: string) {
  return /^https?:\/\//.test(href);
}

const actionButton =
  "flex size-7 items-center justify-center rounded-sm text-dark-400 transition-colors hover:bg-dark-800 hover:text-title";

function Row({
  work,
  onOpen,
}: {
  work: ExperienceItem;
  onOpen: () => void;
}) {
  const Icon = icons[work.icon];

  return (
    <div className="relative flex w-full flex-col items-center justify-center border-b border-b-dark-750 last:border-none">
      <div
        className={cn(
          "relative flex w-full flex-col gap-4 pt-8 pb-8 transition-opacity",
          "sm:flex-row sm:items-start sm:gap-6",
          "group-hover/list:opacity-60 hover:opacity-100!",
        )}
      >
        <button
          type="button"
          onClick={onOpen}
          title={`Open ${work.name}`}
          aria-label={`Open ${work.name} details`}
          data-cuelume-press
          className="relative z-3 flex size-10 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-dark-850 text-dark-100 ring-1 ring-dark-700 transition-all hover:ring-dark-500 hover:brightness-125"
        >
          <Icon className="size-4" aria-hidden />
        </button>

        <div className="flex min-w-0 flex-1 flex-col gap-1 sm:max-w-[11rem]">
          <p className="text-base text-title">{work.name}</p>
          {work.position ? (
            <p className="text-sm text-description">{work.position}</p>
          ) : null}
          <p className="text-sm text-dark-400">{work.years.join(" / ")}</p>
        </div>

        <p className="flex-1 text-sm text-description sm:pt-0.5">
          {work.description}
        </p>

        <div className="flex shrink-0 flex-row gap-1 sm:flex-col">
          <button
            type="button"
            onClick={onOpen}
            title="Open details"
            aria-label={`Open ${work.name} details`}
            data-cuelume-press
            className={cn(actionButton, "cursor-pointer")}
          >
            <AppWindow className="size-3.5" aria-hidden />
          </button>

          {work.link ? (
            isExternal(work.link.href) ? (
              <a
                href={work.link.href}
                target="_blank"
                rel="noopener noreferrer"
                title={work.link.label}
                data-cuelume-press
                className={actionButton}
              >
                <ArrowUpRight className="size-3.5" aria-hidden />
              </a>
            ) : (
              <Link
                href={work.link.href}
                title={work.link.label}
                data-cuelume-press
                className={actionButton}
              >
                <ArrowUpRight className="size-3.5" aria-hidden />
              </Link>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function WorkList() {
  const [selected, setSelected] = useState<ExperienceItem | null>(null);

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      variants={reveal}
      className="flex w-full flex-col gap-6"
    >
      <p className="text-base text-title">Experience</p>
      <div className="group/list flex w-full flex-col">
        {experience.map((work) => (
          <Row key={work.id} work={work} onOpen={() => setSelected(work)} />
        ))}
      </div>

      <AnimatePresence>
        {selected ? (
          <WorkDetailPanel
            work={selected}
            onClose={() => setSelected(null)}
          />
        ) : null}
      </AnimatePresence>
    </motion.section>
  );
}
