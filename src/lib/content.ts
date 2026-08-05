import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { WritingMeta, WritingPost, WritingStatus } from "@/lib/types";

export type { WritingMeta, WritingPost };
export { formatDate } from "@/lib/types";

const writingDir = path.join(process.cwd(), "content/writing");

function ensureDir() {
  if (!fs.existsSync(writingDir)) {
    fs.mkdirSync(writingDir, { recursive: true });
  }
}

function normalizeDate(value: unknown): string {
  if (!value) return "";
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) return trimmed.slice(0, 10);
    const parsed = new Date(trimmed);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString().slice(0, 10);
    }
  }
  return String(value);
}

const STATUSES: readonly WritingStatus[] = ["active", "lab", "complete"];

function parseStatus(value: unknown): WritingStatus | undefined {
  return STATUSES.includes(value as WritingStatus)
    ? (value as WritingStatus)
    : undefined;
}

function parseMeta(data: Record<string, unknown>, slug: string): WritingMeta {
  return {
    slug,
    title: String(data.title ?? slug),
    summary: String(data.summary ?? ""),
    date: normalizeDate(data.date),
    kind: (data.kind as WritingMeta["kind"]) ?? "writeup",
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    draft: Boolean(data.draft),
    cover: data.cover ? String(data.cover) : undefined,
    coverAlt: data.coverAlt ? String(data.coverAlt) : undefined,
    status: parseStatus(data.status),
  };
}

export function getAllWriting(): WritingMeta[] {
  ensureDir();
  const files = fs
    .readdirSync(writingDir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  return files
    .map((file) => {
      const slug = file.replace(/\.mdx?$/, "");
      const raw = fs.readFileSync(path.join(writingDir, file), "utf8");
      const { data } = matter(raw);
      return parseMeta(data, slug);
    })
    .filter((p) => !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getWriting(slug: string): WritingPost | null {
  ensureDir();
  const candidates = [`${slug}.mdx`, `${slug}.md`];
  for (const file of candidates) {
    const full = path.join(writingDir, file);
    if (!fs.existsSync(full)) continue;
    const raw = fs.readFileSync(full, "utf8");
    const { data, content } = matter(raw);
    return { ...parseMeta(data, slug), content };
  }
  return null;
}
