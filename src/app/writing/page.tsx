import Link from "next/link";
import { WritingGallery } from "@/components/WritingGallery";
import { getAllWriting } from "@/lib/content";

export const metadata = {
  title: "Projects, Writing & Labs · Gregory Dean",
  description:
    "Projects, labs, and writeups by Gregory Dean.",
};

export default function WritingIndexPage() {
  const posts = getAllWriting();

  return (
    <main className="flex w-full flex-col items-center gap-8 pt-10 pb-40 sm:gap-16 sm:pt-20">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-start px-3 sm:px-6 md:px-8">
        <Link
          href="/"
          className="mb-8 text-sm text-dark-400 transition-colors hover:text-title"
        >
          ← Home
        </Link>
        <WritingGallery posts={posts} />
      </div>
    </main>
  );
}
