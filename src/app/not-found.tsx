import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex w-full flex-col items-center pt-24 pb-40">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-3 sm:px-6 md:px-0">
        <p className="font-mono text-xs tracking-widest text-dark-400 uppercase">
          404
        </p>
        <h1 className="text-2xl text-title">This path does not exist</h1>
        <p className="text-base text-description">
          The page is gone, or the URL is wrong. The rest of the site is still
          here.
        </p>
        <Link href="/" className="text-title underline-offset-3 hover:underline">
          ← Home
        </Link>
      </div>
    </main>
  );
}
