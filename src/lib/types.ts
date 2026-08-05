export type WritingMeta = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  kind: "writeup" | "project" | "note";
  tags: string[];
  draft?: boolean;
  /** Cover image path under /public, rendered in a fixed 16:9 frame. */
  cover?: string;
  /** Alt text for the cover image. Falls back to the post title. */
  coverAlt?: string;
};

export type WritingPost = WritingMeta & {
  content: string;
};

export function formatDate(date: string) {
  if (!date) return "";
  const iso = /^\d{4}-\d{2}-\d{2}/.test(date)
    ? `${date.slice(0, 10)}T12:00:00Z`
    : date;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
