import { THEME_STORAGE_KEY, themes, type ThemeId } from "@/data/themes";

export const DEFAULT_THEME: ThemeId = "mono";

export function isThemeId(value: string | null | undefined): value is ThemeId {
  return Boolean(value && themes.some((t) => t.id === value));
}

export function applyTheme(id: ThemeId) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = id;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, id);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent("gd-theme", { detail: id }));
}

export function readStoredTheme(): ThemeId {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (isThemeId(saved)) return saved;
  } catch {
    /* ignore */
  }
  return DEFAULT_THEME;
}

/** Particle tint per theme — keeps morph field on-palette. */
export const themeParticleTint: Record<ThemeId, string> = {
  base: "#b6baca",
  terminal: "#7fb897",
  amber: "#e2c89a",
  ocean: "#b7d7e8",
  paper: "#3f3a30",
  graphite: "#d0d0d0",
  nord: "#e5e9f0",
  copper: "#e6c4a4",
  crimson: "#e6b8c0",
  moss: "#d2dcb8",
  arctic: "#cfe0eb",
  mono: "#f0f0f0",
  sand: "#e4d6be",
  ink: "#cfd9f0",
  signal: "#7ad07a",
  dusk: "#dccff0",
  honey: "#f0d89a",
  fog: "#2a303a",
  carbon: "#d2dae2",
  wine: "#e8c0d0",
};
