// @ts-check
import node from "@astrojs/node";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";

// https://astro.build/config
export default defineConfig({
  // Game pages used to live under /game/. Send those addresses to the root.
  redirects: {
    "/game/[slug]": "/[slug]",
  },

  adapter: node({
    mode: "standalone",
  }),

  // The site's two typefaces. Astro downloads them when the site is built and
  // serves them from the site itself, so no visitor data goes to a font host.
  // To change a typeface, change its name here. Layout.astro and starwind.css
  // refer to the fonts by their cssVariable, so they need no changes.
  fonts: [
    {
      // Headings, game names and the big answer.
      provider: fontProviders.fontsource(),
      name: "Fraunces",
      cssVariable: "--font-fraunces",
      weights: ["100 900"],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext"],
      fallbacks: ["Georgia", "serif"],
    },
    {
      // Small print: dates, counts, labels and buttons.
      provider: fontProviders.fontsource(),
      name: "IBM Plex Mono",
      cssVariable: "--font-plex-mono",
      weights: [400, 500],
      styles: ["normal"],
      subsets: ["latin", "latin-ext"],
      fallbacks: ["ui-monospace", "monospace"],
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
