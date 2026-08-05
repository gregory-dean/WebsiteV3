"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { copyTextToClipboard } from "@/lib/clipboard";

/** Inline email text that copies the address to the clipboard on click. */
export function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => window.clearTimeout(timer.current);
  }, []);

  const copyEmail = async () => {
    if (!(await copyTextToClipboard(site.email))) return;
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button
      type="button"
      data-cuelume-press
      onClick={copyEmail}
      title={`Copy ${site.email}`}
      aria-label={`Copy email address ${site.email}`}
      className="cursor-pointer text-title transition-colors hover:text-white"
    >
      {copied ? "Copied" : site.email}
    </button>
  );
}
