export type ThemeId =
  | "base"
  | "terminal"
  | "amber"
  | "ocean"
  | "paper"
  | "graphite"
  | "nord"
  | "copper"
  | "crimson"
  | "moss"
  | "arctic"
  | "mono"
  | "sand"
  | "ink"
  | "signal"
  | "dusk"
  | "honey"
  | "fog"
  | "carbon"
  | "wine";

export type ThemeOption = {
  id: ThemeId;
  label: string;
  swatch: string;
  description: string;
};

/** Palettes — `mono` is the site default; Signal is the footer easter egg. */
export const themes: ThemeOption[] = [
  {
    id: "mono",
    label: "Mono",
    swatch: "#0a0a0a",
    description: "Black & white (default)",
  },
  {
    id: "base",
    label: "Base",
    swatch: "#0b0d12",
    description: "Cool charcoal",
  },
  {
    id: "terminal",
    label: "Terminal",
    swatch: "#07140f",
    description: "Deep green phosphor",
  },
  {
    id: "amber",
    label: "Amber",
    swatch: "#120e09",
    description: "Warm CRT amber",
  },
  {
    id: "ocean",
    label: "Ocean",
    swatch: "#071018",
    description: "Blue-steel ops",
  },
  {
    id: "graphite",
    label: "Graphite",
    swatch: "#121212",
    description: "Neutral near-black",
  },
  {
    id: "nord",
    label: "Nord",
    swatch: "#2e3440",
    description: "Soft polar slate",
  },
  {
    id: "copper",
    label: "Copper",
    swatch: "#16110e",
    description: "Burnished metal warmth",
  },
  {
    id: "crimson",
    label: "Crimson",
    swatch: "#14090c",
    description: "Dark red SOC alert",
  },
  {
    id: "moss",
    label: "Moss",
    swatch: "#10140d",
    description: "Muted olive field",
  },
  {
    id: "arctic",
    label: "Arctic",
    swatch: "#0c1218",
    description: "Icy blue-gray",
  },
  {
    id: "sand",
    label: "Sand",
    swatch: "#1a1712",
    description: "Desert night",
  },
  {
    id: "ink",
    label: "Ink",
    swatch: "#0a1020",
    description: "Deep indigo night",
  },
  {
    id: "signal",
    label: "Signal",
    swatch: "#050805",
    description: "High-contrast matrix",
  },
  {
    id: "dusk",
    label: "Dusk",
    swatch: "#15121c",
    description: "Muted evening violet",
  },
  {
    id: "honey",
    label: "Honey",
    swatch: "#1a1408",
    description: "Golden low light",
  },
  {
    id: "fog",
    label: "Fog",
    swatch: "#d8dde4",
    description: "Light cool gray",
  },
  {
    id: "carbon",
    label: "Carbon",
    swatch: "#101316",
    description: "Industrial steel",
  },
  {
    id: "wine",
    label: "Wine",
    swatch: "#160c12",
    description: "Deep burgundy dark",
  },
  {
    id: "paper",
    label: "Paper",
    swatch: "#ece7dc",
    description: "Light field notes",
  },
];

export const THEME_STORAGE_KEY = "gd-theme";
