declare namespace App {
  // Set for every request by src/middleware.ts.
  interface Locals {
    /** The language the page should be written in. */
    locale: import("./i18n/locales").Locale;
    /** The requested address without its language code, such as "/portal". */
    path: string;
  }
}
