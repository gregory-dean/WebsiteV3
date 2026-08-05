"use client";

import { GalleryHorizontalEnd } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { reveal } from "@/data/site";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDate, type WritingMeta } from "@/lib/types";

export function WritingList({ posts }: { posts: WritingMeta[] }) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      variants={reveal}
      className="flex w-full flex-col gap-6"
    >
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-base text-title">Projects, Writing & Labs</p>
        <p className="text-sm text-dark-400">
          Homelab work, tools, and writeups
        </p>
      </div>

      <div className="flex w-full flex-col">
        {posts.length === 0 ? (
          <p className="text-sm text-description">
            New writeups will land here as labs and assessments get documented.
          </p>
        ) : (
          posts.map((post) => (
            <Link
              key={post.slug}
              href={`/writing/${post.slug}`}
              data-cuelume-press
              className="group relative flex w-full flex-col gap-2 border-b border-dashed border-b-dark-500 py-6 transition-opacity last:border-none hover:opacity-100 group-hover:not-hover:opacity-60 sm:flex-row sm:items-start sm:gap-6"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-dark-850 ring-1 ring-dark-700">
                <GalleryHorizontalEnd
                  className="size-4 text-dark-100"
                  aria-hidden
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <p className="text-base text-title group-hover:text-white">
                    {post.title}
                  </p>
                  <span className="text-xs uppercase tracking-widest text-dark-400">
                    {post.kind}
                  </span>
                  <StatusBadge status={post.status} />
                </div>
                <p className="mt-1 text-sm text-description">{post.summary}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-dark-400">
                  <span>{formatDate(post.date)}</span>
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-sm bg-dark-850 px-1.5 py-0.5 ring-1 ring-dark-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </motion.section>
  );
}
