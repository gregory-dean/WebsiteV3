import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, getAllWriting, getWriting } from "@/lib/content";

export function generateStaticParams() {
  return getAllWriting().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getWriting(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Gregory Dean`,
    description: post.summary,
  };
}

export default async function WritingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getWriting(slug);
  if (!post) notFound();

  return (
    <main className="flex w-full flex-col items-center gap-8 pt-10 pb-40 sm:pt-20">
      <article className="mx-auto flex w-full max-w-2xl flex-col px-3 sm:px-6 md:px-0">
        <Link
          href="/writing"
          className="mb-8 text-sm text-dark-400 transition-colors hover:text-title"
        >
          ← Projects, Writing & Labs
        </Link>

        <p className="text-xs uppercase tracking-widest text-dark-400">
          {post.kind} · {formatDate(post.date)}
        </p>
        <h1 className="mt-2 text-2xl text-title sm:text-4xl">{post.title}</h1>
        <p className="mt-3 text-base text-description">{post.summary}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-sm bg-dark-850 px-1.5 py-0.5 text-xs text-dark-300 ring-1 ring-dark-700"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="prose-cyber mt-10">
          <MDXRemote source={post.content} />
        </div>
      </article>
    </main>
  );
}
