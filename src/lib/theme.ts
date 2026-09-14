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
  mono: "#f0f0f0",
  signal: "#7ad07a",
};
