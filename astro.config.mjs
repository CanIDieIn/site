// @ts-check
import node from "@astrojs/node";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  // The site's public address. Links in social media cards must be complete
  // addresses, and they are built from this.
  site: "https://can-i-die.in",

  // Game pages used to live under /game/. Send those addresses to the root.
  redirects: {
    "/game/[slug]": "/[slug]",
    "/api/game/[slug]": "/api/[slug]",
  },

  adapter: node({
    mode: "standalone",
  }),

  vite: {
    plugins: [tailwindcss()],
  },
});
