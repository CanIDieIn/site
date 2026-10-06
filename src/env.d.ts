declare namespace App {
  // Set for every request by src/middleware.ts.
  interface Locals {
    /** The language the page should be written in. */
    locale: import("./i18n/locales").Locale;
    /** The requested address without its language code, such as "/portal". */
    path: string;
    /**
     * The page's title, left here by src/layouts/Layout.astro as the page is
     * drawn, so the analytics in src/lib/analytics.ts can name the page the
     * way the visitor saw it. Nothing but a page sets it.
     */
    title?: string;
  }
}
