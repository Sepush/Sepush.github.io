import { presetWind3 } from "@unocss/preset-wind3";
import { defineConfig, presetAttributify, presetIcons, transformerAttributifyJsx, transformerDirectives } from "unocss";

export default defineConfig({
  content: {
    filesystem: [
      "src/**/*.{astro,vue,tsx,ts,js}",
    ],
  },
  safelist: [
    "i-tabler-brand-github",
    "i-tabler-brand-x",
    "i-tabler-brand-telegram",
    "i-tabler-mail",
    "i-tabler-link",
    "i-tabler-menu-2",
    "i-tabler-x",
  ],
  theme: {
    colors: {
      primary: {
        50: "oklch(0.98 0.002 106)",
        100: "oklch(0.96 0.003 106)",
        200: "oklch(0.93 0.005 106)",
        300: "oklch(0.89 0.008 106)",
        400: "oklch(0.78 0.015 106)",
        500: "oklch(0.55 0.016 106)",
        600: "oklch(0.45 0.018 106)",
        700: "oklch(0.35 0.020 106)",
        800: "oklch(0.27 0.022 106)",
        900: "oklch(0.21 0.025 106)",
        950: "oklch(0.15 0.030 106)",
      },
      accent: {
        50: "oklch(0.97 0.02 160)",
        100: "oklch(0.94 0.04 160)",
        200: "oklch(0.86 0.08 160)",
        300: "oklch(0.78 0.12 160)",
        400: "oklch(0.70 0.16 160)",
        500: "oklch(0.62 0.20 160)",
        600: "oklch(0.54 0.24 160)",
        700: "oklch(0.46 0.28 160)",
        800: "oklch(0.38 0.32 160)",
        900: "oklch(0.30 0.36 160)",
      },
      surface: {
        50: "oklch(1.00 0.000 106)",
        100: "oklch(0.98 0.002 106)",
        200: "oklch(0.96 0.003 106)",
        300: "oklch(0.93 0.005 106)",
        400: "oklch(0.89 0.008 106)",
        500: "oklch(0.78 0.015 106)",
      },
    },
    fontFamily: {
      mono: ["var(--a-font-mono)"],
      sans: ["var(--a-font-system)"],
    },
    borderRadius: {
      "xl": "1rem",
      "2xl": "1.5rem",
      "3xl": "2rem",
    },
    boxShadow: {
      "elegant": "0 4px 20px -2px rgba(0, 0, 0, 0.08), 0 2px 8px -2px rgba(0, 0, 0, 0.04)",
      "float": "0 8px 30px -6px rgba(0, 0, 0, 0.12), 0 4px 16px -4px rgba(0, 0, 0, 0.08)",
      "glow": "0 0 20px -4px oklch(0.55 0.016 106 / 0.3)",
    },
  },
  shortcuts: [
    {
      "card-modern":
        "bg-white/80 backdrop-blur-sm rounded-2xl shadow-elegant hover:shadow-float transition-all duration-500 border border-white/20",
    },
    { "bg-gradient-primary": "bg-gradient-to-br from-gray-50 via-white to-gray-50" },
  ],
  transformers: [
    transformerDirectives(),
    transformerAttributifyJsx(),
  ],
  presets: [
    presetWind3(),
    presetAttributify(),
    presetIcons({
      collections: {
        tabler: () => import("@iconify-json/tabler/icons.json").then(i => i.default as any),
      },
      extraProperties: {
        "display": "inline-block",
        "vertical-align": "middle",
      },
    }),
  ],
});
