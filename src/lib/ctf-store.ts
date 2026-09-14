import { useSyncExternalStore } from "react";
import {
  CTF_FLAG_IDS,
  CTF_FLAGS,
  CTF_STORAGE_KEY,
  CTF_TOTAL,
  type CtfFlagId,
} from "@/data/ctf";
import { CTF_EVENT, setLastCtf, type CtfEventDetail } from "@/lib/ctf-event";

export type SubmitResult = "captured" | "duplicate" | "miss" | "unavailable";

export type CtfSnapshot = {
  found: readonly CtfFlagId[];
  total: number;
  complete: boolean;
};

const listeners = new Set<() => void>();

const SERVER_SNAPSHOT: CtfSnapshot = {
  found: [],
  total: CTF_TOTAL,
  complete: false,
};

let snapshot: CtfSnapshot = SERVER_SNAPSHOT;

function emit() {
  const detail: CtfEventDetail = {
    found: snapshot.found.length,
    total: snapshot.total,
  };
  setLastCtf(detail);
  listeners.forEach((listener) => listener());
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CTF_EVENT, { detail }));
  }
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

function getSnapshot() {
  return snapshot;
}

function getServerSnapshot() {
  return SERVER_SNAPSHOT;
}

function persist(found: readonly CtfFlagId[]) {
  try {
    localStorage.setItem(CTF_STORAGE_KEY, JSON.stringify(found));
  } catch {
    /* ignore */
  }
}

function readFound(): CtfFlagId[] {
  try {
    const raw = localStorage.getItem(CTF_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is CtfFlagId => CTF_FLAG_IDS.has(id));
  } catch {
    return [];
  }
}

function commit(found: readonly CtfFlagId[]) {
  const next: CtfSnapshot = {
    found,
    total: CTF_TOTAL,
    complete: found.length === CTF_TOTAL,
  };
  snapshot = next;
  persist(found);
  emit();
}

export function hydrateCtf() {
  const found = readFound();
  snapshot = {
    found,
    total: CTF_TOTAL,
    complete: found.length === CTF_TOTAL,
  };
  emit();
}

export function resetCtf() {
  commit([]);
}

async function sha256Hex(value: string): Promise<string | null> {
  if (!globalThis.crypto?.subtle) return null;
  const data = new TextEncoder().encode(value);
  const buffer = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function submitCtf(input: string): Promise<SubmitResult> {
  const normalized = input.trim().toLowerCase();
  if (!normalized) return "miss";
  const hash = await sha256Hex(normalized);
  if (!hash) return "unavailable";
  const match = CTF_FLAGS.find((flag) => flag.hash === hash);
  if (!match) return "miss";
  if (snapshot.found.includes(match.id)) return "duplicate";
  commit([...snapshot.found, match.id]);
  return "captured";
}

export function getCtfStatus() {
  return {
    found: snapshot.found.length,
    total: snapshot.total,
    ids: snapshot.found,
  };
}

export function getCtfHint(id?: string) {
  if (!id) {
    return CTF_FLAGS.filter((flag) => !snapshot.found.includes(flag.id)).map(
      (flag) => `${flag.label}: ${flag.hint}`,
    );
  }
  const flag = CTF_FLAGS.find((item) => item.id === id || item.label === id);
  return flag?.hint ?? "unknown flag";
}

export function lastCapturedId() {
  return snapshot.found.at(-1) ?? null;
}

export function useCtf() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key !== CTF_STORAGE_KEY) return;
    const found = readFound();
    snapshot = {
      found,
      total: CTF_TOTAL,
      complete: found.length === CTF_TOTAL,
    };
    emit();
  });
}
