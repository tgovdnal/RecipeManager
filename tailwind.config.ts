import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "on-primary-fixed": "#3e0400",
        "secondary": "#615e5b",
        "on-error-container": "#93000a",
        "tertiary": "#5f5c4f",
        "surface-container-high": "#eae7e7",
        "on-primary-fixed-variant": "#8c1803",
        "secondary-fixed-dim": "#cac6c2",
        "on-primary": "#ffffff",
        "surface-container": "#f0eded",
        "on-secondary-fixed": "#1d1b19",
        "primary-fixed-dim": "#ffb4a5",
        "on-background": "#1c1b1b",
        "inverse-on-surface": "#f3f0ef",
        "surface-container-highest": "#e5e2e1",
        "surface-tint": "#ae3119",
        "on-surface": "#1c1b1b",
        "on-tertiary-fixed-variant": "#4a473b",
        "surface-container-low": "#f6f3f2",
        "secondary-fixed": "#e7e1de",
        "inverse-primary": "#ffb4a5",
        "outline": "#8d716b",
        "on-secondary-container": "#676461",
        "surface-variant": "#e5e2e1",
        "on-secondary": "#ffffff",
        "on-error": "#ffffff",
        "outline-variant": "#e1bfb8",
        "primary": "#ab2e17",
        "background": "#fcf9f8",
        "tertiary-fixed-dim": "#ccc6b7",
        "inverse-surface": "#313030",
        "tertiary-fixed": "#e8e2d2",
        "on-surface-variant": "#59413c",
        "on-secondary-fixed-variant": "#494644",
        "error": "#ba1a1a",
        "on-tertiary-fixed": "#1e1c12",
        "secondary-container": "#e7e1de",
        "primary-fixed": "#ffdad3",
        "surface-dim": "#dcd9d9",
        "surface": "#fcf9f8",
        "surface-container-lowest": "#ffffff",
        "on-tertiary": "#ffffff",
        "surface-bright": "#fcf9f8",
        "on-tertiary-container": "#fffbff",
        "error-container": "#ffdad6",
        "tertiary-container": "#787467",
        "on-primary-container": "#fffbff",
        "primary-container": "#cd462d"
      },
      fontFamily: {
        headline: ["Noto Serif"],
        body: ["Be Vietnam Pro"],
        label: ["Plus Jakarta Sans"]
      }
    },
  },
  plugins: [],
};
export default config;
