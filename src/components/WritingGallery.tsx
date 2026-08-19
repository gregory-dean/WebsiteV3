"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { reveal } from "@/data/site";
import { StatusBadge } from "@/components/StatusBadge";
import { cn } from "@/lib/cn";
import { formatDate, type WritingMeta } from "@/lib/types";

const kindLabel: Record<WritingMeta["kind"], string> = {
  writeup: "Writeup",
  project: "Project",
  note: "Note",
};

function KindPill({ kind }: { kind: WritingMeta["kind"] }) {
  return (
    <span className="rounded-sm bg-dark-950/80 px-1.5 py-0.5 text-xs uppercase tracking-widest text-title ring-1 ring-dark-700 backdrop-blur-sm">
      {kindLabel[kind]}
    </span>
  );
}

function Cover({
  post,
  className,
  priority = false,
}: {
  post: WritingMeta;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-dark-850", className)}>
      {post.cover ? (
        <Image
          src={post.cover}
          alt={post.coverAlt ?? post.title}
          width={1600}
          height={900}
          priority={priority}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      ) : (
        <div className="flex h-full min-h-40 w-full items-center justify-center text-xs uppercase tracking-widest text-dark-400">
          {kindLabel[post.kind]}
        </div>
      )}
      <span className="absolute top-3 left-3">
        <KindPill kind={post.kind} />
      </span>
    </div>
  );
}

function Tags({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-sm bg-dark-850 px-1.5 py-0.5 text-xs text-dark-400 ring-1 ring-dark-700"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

function FeaturedCard({ post }: { post: WritingMeta }) {
  return (
    <Link
      href={`/writing/${post.slug}`}
      data-cuelume-press
      className="group grid overflow-hidden rounded-lg bg-dark-850/40 ring-1 ring-dark-700 transition-all duration-300 hover:bg-dark-850/70 hover:ring-dark-500 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]"
    >
      <Cover
        post={post}
        priority
        className="aspect-[16/9] sm:aspect-auto sm:h-full sm:min-h-64"
      />
      <div className="flex flex-col justify-center gap-3 p-5 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={post.status} />
          <span className="text-xs text-dark-400">{formatDate(post.date)}</span>
        </div>
        <h2 className="text-xl text-title group-hover:text-white sm:text-2xl">
          {post.title}
        </h2>
        <p className="text-sm text-description">{post.summary}</p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
          <Tags tags={post.tags} />
          <span className="flex shrink-0 items-center gap-1 text-xs text-dark-400 transition-colors group-hover:text-title">
            Read
            <ArrowUpRight className="size-3.5" aria-hidden />
          </span>
        </div>
      </div>
    </Link>
  );
}

function GridCard({ post }: { post: WritingMeta }) {
  return (
    <Link
      href={`/writing/${post.slug}`}
      data-cuelume-press
      className="group flex flex-col overflow-hidden rounded-lg bg-dark-850/40 ring-1 ring-dark-700 transition-all duration-300 hover:bg-dark-850/70 hover:ring-dark-500"
    >
      <Cover post={post} className="aspect-[16/9]" />
      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-base text-title group-hover:text-white">
            {post.title}
          </p>
          <StatusBadge status={post.status} />
        </div>
        <p className="text-sm text-description">{post.summary}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-dark-400">
          <span>{formatDate(post.date)}</span>
          <span className="flex items-center gap-1 transition-colors group-hover:text-title">
            Read
            <ArrowUpRight className="size-3.5" aria-hidden />
          </span>
        </div>
        <Tags tags={post.tags} />
      </div>
    </Link>
  );
}

export function WritingGallery({ posts }: { posts: WritingMeta[] }) {
  const [featured, ...rest] = posts;

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={reveal}
      className="flex w-full flex-col gap-8"
    >
      <div className="flex flex-col gap-2">
        <p className="text-base text-title">Projects, Writing & Labs</p>
        <p className="text-sm text-description">
          Homelab work, tools, and writeups
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-sm text-description">
          New writeups will land here as labs and assessments get documented.
        </p>
      ) : (
        <>
          {featured ? <FeaturedCard post={featured} /> : null}
          {rest.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {rest.map((post) => (
                <GridCard key={post.slug} post={post} />
              ))}
            </div>
          ) : null}
        </>
      )}
    </motion.section>
  );
}
