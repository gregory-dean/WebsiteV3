"use client";

import { ArrowRight, GalleryHorizontalEnd } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { reveal } from "@/data/site";
import { StatusBadge } from "@/components/StatusBadge";
import { cn } from "@/lib/cn";
import { formatDate, type WritingMeta } from "@/lib/types";

function CoverThumb({ post }: { post: WritingMeta }) {
  return (
    <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-dark-850 ring-1 ring-dark-700">
      {post.cover ? (
        <Image
          src={post.cover}
          alt=""
          width={80}
          height={80}
          className="size-full object-cover"
        />
      ) : (
        <GalleryHorizontalEnd
          className="size-4 text-dark-100"
          aria-hidden
        />
      )}
    </div>
  );
}

export function WritingList({ posts }: { posts: WritingMeta[] }) {
  return (
    <motion.section
      id="projects"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      variants={reveal}
      className="flex w-full scroll-mt-8 flex-col gap-6"
    >
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-base text-title">Projects, Writing & Labs</p>
        <Link
          href="/writing"
          data-cuelume-press
          aria-label="View all projects, writing, and labs"
          className="group/all inline-flex items-center gap-1 text-sm text-dark-400 transition-colors hover:text-title"
        >
          View all
          <ArrowRight
            className="size-3.5 transition-transform group-hover/all:translate-x-0.5"
            aria-hidden
          />
        </Link>
      </div>

      <div className="group/list flex w-full flex-col">
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
              className={cn(
                "group relative flex w-full flex-col gap-2 border-b border-b-dark-750 py-6 transition-opacity last:border-none sm:flex-row sm:items-start sm:gap-6",
                "group-hover/list:opacity-60 hover:opacity-100!",
              )}
            >
              <CoverThumb post={post} />
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
