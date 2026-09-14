"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { SIGNAL_STORAGE_KEY } from "@/data/themes";
import { SIGNAL_EVENT, setLastSignal } from "@/lib/signal-event";
import { applyTheme, DEFAULT_THEME } from "@/lib/theme";

export { SIGNAL_EVENT };

type SignalSnapshot = {
  on: boolean;
};

type SignalContextValue = SignalSnapshot & {
  toggle: () => void;
};

const listeners = new Set<() => void>();

const SERVER_SNAPSHOT: SignalSnapshot = { on: false };

let snapshot: SignalSnapshot = SERVER_SNAPSHOT;

function emit() {
  setLastSignal(snapshot);
  listeners.forEach((listener) => listener());
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(SIGNAL_EVENT, { detail: snapshot }));
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

function getServerSnapshot(): SignalSnapshot {
  return SERVER_SNAPSHOT;
}

function persist(on: boolean) {
  try {
    localStorage.setItem(SIGNAL_STORAGE_KEY, on ? "on" : "off");
  } catch {
    /* ignore */
  }
}

/** `?signal=ctf` turns the hunt on, so shared links land with it lit. */
function readQuerySignal(): boolean {
  return new URLSearchParams(window.location.search).get("signal") === "ctf";
}

function readClientSnapshot(): SignalSnapshot {
  if (readQuerySignal()) return { on: true };
  try {
    return { on: localStorage.getItem(SIGNAL_STORAGE_KEY) === "on" };
  } catch {
    return { on: false };
  }
}

function commit(next: SignalSnapshot) {
  if (snapshot.on === next.on) {
    applyTheme(next.on ? "signal" : DEFAULT_THEME);
    persist(next.on);
    emit();
    return;
  }
  snapshot = next;
  persist(next.on);
  applyTheme(next.on ? "signal" : DEFAULT_THEME);
  emit();
}

const SignalContext = createContext<SignalContextValue | null>(null);

export function SignalProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    commit(readClientSnapshot());
  }, []);

  const toggle = useCallback(() => {
    commit({ on: !snapshot.on });
  }, []);

  const value = useMemo<SignalContextValue>(
    () => ({ ...state, toggle }),
    [state, toggle],
  );

  return (
    <SignalContext.Provider value={value}>{children}</SignalContext.Provider>
  );
}

export function useSignal() {
  const context = useContext(SignalContext);
  if (!context) {
    throw new Error("useSignal requires SignalProvider");
  }
  return context;
}
