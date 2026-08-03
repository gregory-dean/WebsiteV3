"use client";

import {
  ArrowUpRight,
  Building2,
  GalleryHorizontalEnd,
  Shield,
  Wifi,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { experience, reveal } from "@/data/site";
import { cn } from "@/lib/cn";

const icons = {
  building: Building2,
  shield: Shield,
  wifi: Wifi,
} as const;

type Item = (typeof experience)[number];

function Row({ item }: { item: Item }) {
  const Icon = icons[item.icon as keyof typeof icons];
  return (
    <div className="relative flex w-full flex-col items-center justify-center border-b border-b-dark-750 last:border-none">
      <div
        className={cn(
          "relative flex w-full flex-col gap-4 pt-8 pb-8 transition-opacity",
          "sm:flex-row sm:items-start sm:gap-6",
          "group-hover/list:opacity-60 hover:opacity-100!",
        )}
      >
        <div className="relative z-3 flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-dark-850 ring-1 ring-dark-700">
          <Icon className="size-4 text-dark-100" aria-hidden />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1 sm:max-w-[11rem]">
          <p className="text-base text-title">{item.name}</p>
          {item.position ? (
            <p className="text-sm text-description">{item.position}</p>
          ) : null}
          <p className="text-sm text-dark-400">{item.years.join(" / ")}</p>
        </div>

        <p className="flex-1 text-sm text-description sm:pt-0.5">
          {item.description}
        </p>

        <div className="flex shrink-0 flex-row gap-1 sm:flex-col">
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            title="Visit"
            data-cuelume-press
            className="flex size-7 items-center justify-center rounded-sm text-dark-400 transition-colors hover:bg-dark-800 hover:text-title"
          >
            <ArrowUpRight className="size-3.5" aria-hidden />
          </a>
          {"story" in item && item.story ? (
            <Link
              href={item.story}
              title="Read story"
              data-cuelume-press
              className="flex size-7 items-center justify-center rounded-sm text-dark-400 transition-colors hover:bg-dark-800 hover:text-title"
            >
              <GalleryHorizontalEnd className="size-3.5" aria-hidden />
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function WorkList() {
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
        {experience.map((item) => (
          <Row key={item.id} item={item} />
        ))}
      </div>
    </motion.section>
  );
}
