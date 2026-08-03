"use client";

import { Mail, Radio } from "lucide-react";
import { useEffect, useState } from "react";
import { site } from "@/data/site";
import { applyTheme, DEFAULT_THEME, readStoredTheme } from "@/lib/theme";
import type { ThemeId } from "@/data/themes";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V23h-4V8.5zM8.5 8.5h3.8v2h.05c.53-1 1.82-2.05 3.75-2.05 4 0 4.75 2.63 4.75 6.05V23h-4v-6.5c0-1.55-.03-3.55-2.15-3.55-2.15 0-2.48 1.68-2.48 3.43V23h-4V8.5z" />
    </svg>
  );
}

const items = [
  {
    title: `GitHub @gregory-dean`,
    href: site.links.github,
    icon: GitHubIcon,
  },
  {
    title: `LinkedIn`,
    href: site.links.linkedin,
    icon: LinkedInIcon,
  },
  {
    title: site.email,
    href: site.links.email,
    icon: Mail,
  },
] as const;

export function SocialLinks() {
  const [theme, setTheme] = useState<ThemeId>(DEFAULT_THEME);

  useEffect(() => {
    const current = readStoredTheme();
    setTheme(current);
    applyTheme(current);

    const onTheme = (event: Event) => {
      const detail = (event as CustomEvent<ThemeId>).detail;
      if (detail) setTheme(detail);
    };
    window.addEventListener("gd-theme", onTheme);
    return () => window.removeEventListener("gd-theme", onTheme);
  }, []);

  const signalOn = theme === "signal";

  return (
    <div className="-ml-1.5 flex flex-row flex-wrap items-center gap-2 transition-colors duration-200 *:cursor-pointer *:text-dark-400 *:hover:text-title">
      {items.map(({ title, href, icon: Icon }) => (
        <a
          key={href}
          title={title}
          className="rounded-sm"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div
            data-cuelume-press
            className="flex size-8 cursor-pointer items-center justify-center rounded-sm transition-colors hover:bg-dark-800"
          >
            <Icon className="size-4" />
          </div>
        </a>
      ))}
      <button
        type="button"
        title={signalOn ? "Return to mono" : "Signal"}
        aria-label={signalOn ? "Switch theme back to mono" : "Switch theme to signal"}
        aria-pressed={signalOn}
        data-cuelume-press
        onClick={() => {
          const next: ThemeId = signalOn ? DEFAULT_THEME : "signal";
          setTheme(next);
          applyTheme(next);
        }}
        className="rounded-sm text-dark-400 hover:text-title"
      >
        <div className="flex size-8 cursor-pointer items-center justify-center rounded-sm transition-colors hover:bg-dark-800">
          <Radio
            className={`size-4 transition-colors ${signalOn ? "text-accent" : ""}`}
          />
        </div>
      </button>
    </div>
  );
}
