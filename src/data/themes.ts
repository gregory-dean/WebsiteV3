export type ThemeId = "mono" | "signal";

export type ThemeOption = {
  id: ThemeId;
  label: string;
  swatch: string;
  description: string;
};

/** Palettes — `mono` is the site default; Signal is the easter egg. */
export const themes: ThemeOption[] = [
  {
    id: "mono",
    label: "Mono",
    swatch: "#0a0a0a",
    description: "Black & white (default)",
  },
  {
    id: "signal",
    label: "Signal",
    swatch: "#050805",
    description: "High-contrast matrix",
  },
];

export const THEME_STORAGE_KEY = "gd-theme";
export const SIGNAL_STORAGE_KEY = "gd-signal";
