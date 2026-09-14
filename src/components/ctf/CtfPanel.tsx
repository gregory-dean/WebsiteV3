"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { CTF_FLAGS, CTF_SESSION_ID } from "@/data/ctf";
import { useSignal } from "@/components/signal/SignalProvider";
import { cn } from "@/lib/cn";
import {
  getCtfHint,
  getCtfStatus,
  hydrateCtf,
  lastCapturedId,
  resetCtf,
  submitCtf,
  useCtf,
  type SubmitResult,
} from "@/lib/ctf-store";

declare global {
  interface Window {
    ctf?: {
      submit: (input: string) => Promise<SubmitResult>;
      hint: (id?: string) => string | string[];
      status: () => { found: number; total: number; ids: readonly string[] };
    };
  }
}

let bannerPrinted = false;
let winPrinted = false;

function printBanner() {
  if (bannerPrinted) return;
  bannerPrinted = true;
  console.log(
    "%cflag{open_the_console}",
    "color:#39ff14;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:14px",
  );
  console.log(
    "%cwindow.ctf.submit / hint / status",
    "color:#4a9a4a;font-family:ui-monospace,SFMono-Regular,Menlo,monospace",
  );
}

function printWin() {
  if (winPrinted) return;
  winPrinted = true;
  console.log(
    "%call flags captured",
    "color:#39ff14;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:14px",
  );
}

function installWindowCtf() {
  window.ctf = {
    submit: submitCtf,
    hint: getCtfHint,
    status: getCtfStatus,
  };
}

function feedbackMessage(result: SubmitResult) {
  if (result === "captured") {
    const id = lastCapturedId();
    return id ? `captured · ${id}` : "captured";
  }
  if (result === "duplicate") return "already captured";
  if (result === "unavailable") return "needs https";
  return "not a flag";
}

export function CtfPanel() {
  const { on: active } = useSignal();
  const ctf = useCtf();
  const inputId = useId();
  /** null means "no choice yet": open while hunting, collapsed at 5/5 so the burst is visible. */
  const [userOpen, setUserOpen] = useState<boolean | null>(null);
  const open = userOpen ?? !ctf.complete;
  const [value, setValue] = useState("");
  const [feedback, setFeedback] = useState("");
  const [busy, setBusy] = useState(false);
  const [hints, setHints] = useState<ReadonlySet<string>>(new Set());

  useEffect(() => {
    hydrateCtf();
  }, []);

  useEffect(() => {
    if (!active) {
      delete window.ctf;
      return;
    }
    installWindowCtf();
    printBanner();
    return () => {
      delete window.ctf;
    };
  }, [active]);

  useEffect(() => {
    if (active && ctf.complete) printWin();
  }, [active, ctf.complete]);

  if (!active) return null;

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      const result = await submitCtf(value);
      setFeedback(feedbackMessage(result));
      if (result === "captured") setValue("");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 sm:inset-x-auto sm:right-4 sm:bottom-4 sm:w-80">
      {open ? (
        <div className="border-t border-dark-700 bg-dark-950/90 font-mono text-[11px] sm:rounded-md sm:border">
          <div className="flex items-center justify-between gap-3 border-b border-dark-700 px-3 py-1.5 text-dark-400">
            <span className="uppercase">flag hunt</span>
            <div className="flex items-center gap-2">
              <span className="truncate" title="session id">
                sid {CTF_SESSION_ID}
              </span>
              <button
                type="button"
                onClick={() => setUserOpen(false)}
                className="text-dark-400 hover:text-title"
              >
                hide
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 px-3 py-2.5">
            <ol className="flex flex-wrap gap-2">
              {CTF_FLAGS.map((flag) => {
                const got = ctf.found.includes(flag.id);
                return (
                  <li key={flag.id} className="flex items-center gap-1">
                    <span className={got ? "text-accent" : "text-dark-400"}>
                      {got ? "✓" : "·"} {flag.label}
                    </span>
                    {!got ? (
                      <button
                        type="button"
                        onClick={() =>
                          setHints((current) => {
                            const next = new Set(current);
                            if (next.has(flag.id)) next.delete(flag.id);
                            else next.add(flag.id);
                            return next;
                          })
                        }
                        className="text-dark-400 hover:text-title"
                      >
                        hint
                      </button>
                    ) : null}
                  </li>
                );
              })}
            </ol>

            {CTF_FLAGS.some((flag) => hints.has(flag.id) && !ctf.found.includes(flag.id)) ? (
              <ul className="flex flex-col gap-1 text-description">
                {CTF_FLAGS.filter(
                  (flag) => hints.has(flag.id) && !ctf.found.includes(flag.id),
                ).map((flag) => (
                  <li key={`hint-${flag.id}`}>
                    {flag.label}: {flag.hint}
                  </li>
                ))}
              </ul>
            ) : null}

            {ctf.complete ? (
              <div className="flex flex-col gap-1 text-description">
                <p className="text-accent">all flags captured</p>
                {CTF_FLAGS.map((flag) => (
                  <p key={`reveal-${flag.id}`}>
                    {flag.label}: {flag.reveal}
                  </p>
                ))}
              </div>
            ) : (
              <form onSubmit={onSubmit} className="flex gap-2">
                <label htmlFor={inputId} className="sr-only">
                  Submit a flag
                </label>
                <input
                  id={inputId}
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="flag{...}"
                  className="min-w-0 flex-1 rounded-sm border border-dark-700 bg-dark-900 px-2 py-1 text-title outline-none placeholder:text-dark-500 focus:border-dark-400"
                />
                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-sm px-2 py-1 text-title ring-1 ring-dark-700 hover:bg-dark-800"
                >
                  submit
                </button>
              </form>
            )}

            <p aria-live="polite" className="min-h-4 text-accent">
              {feedback}
            </p>

            <p className="text-dark-400">
              Five flags. None of this is real security. Flags are checked as
              SHA-256 hashes. Two of them have to exist client-side to be drawn,
              so reading the bundle is fair game.
            </p>

            <button
              type="button"
              onClick={() => {
                resetCtf();
                winPrinted = false;
                setUserOpen(null);
                setFeedback("progress cleared");
                setHints(new Set());
              }}
              className="self-start text-dark-400 hover:text-title"
            >
              reset
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setUserOpen(true)}
          className={cn(
            "w-full border-t border-dark-700 bg-dark-950/90 px-3 py-2 font-mono text-[11px] text-title sm:w-auto sm:rounded-md sm:border",
          )}
        >
          flags {ctf.found.length}/{ctf.total}
        </button>
      )}
    </div>
  );
}
