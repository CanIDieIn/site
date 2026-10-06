// The languages the site is written in, and how each one's addresses work.
//
// English lives at the root: /, /portal, /no-deaths. Every other language has
// the same pages under its own code: /fr, /fr/portal, /fr/no-deaths. The
// middleware in src/middleware.ts reads the code off the front of the address
// and hands the rest to the ordinary pages, so each page is written once.
//
// TO ADD A LANGUAGE: add its code here, then a block for it in ui.ts and
// streaming.ts. TypeScript will point out every string that is missing. Run
// `npm run og:assets` to draw its stamps. To pull game names in that language
// from IGDB, see IGDB_NAME_REGIONS in data.ts.

export const LOCALES = ["en", "fr", "es", "de", "ja"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Each language's own name for itself, for the language menu. */
export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  es: "Español",
  de: "Deutsch",
  ja: "日本語",
};

export const isLocale = (value: string | undefined): value is Locale =>
  (LOCALES as readonly string[]).includes(value ?? "");

/**
 * Splits an address into its language and the rest: "/fr/portal" is French
 * and "/portal". An address with no language code is English.
 *
 * "/en/portal" is accepted too. It is only needed for the rare game whose slug
 * is itself a language code, such as the game "Es", whose English page cannot
 * live at /es because that is the Spanish home page. See `gameHref`.
 */
export const splitLocale = (pathname: string): { locale: Locale; path: string; prefixed: boolean } => {
  const [, first, ...rest] = pathname.split("/");
  if (!isLocale(first)) return { locale: DEFAULT_LOCALE, path: pathname, prefixed: false };
  return { locale: first, path: `/${rest.join("/")}`, prefixed: true };
};

/**
 * The address of a page in a language: `localePath("fr", "/streaming")` is
 * "/fr/streaming". `path` is the page's English address.
 */
export const localePath = (locale: Locale, path: string) => {
  if (locale === DEFAULT_LOCALE) {
    // An English address that would otherwise be read as another language's
    // page, such as the game with the slug "es".
    return isLocale(path.split("/")[1]) ? `/${DEFAULT_LOCALE}${path}` : path;
  }
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
};

/** The address of a game's page in a language. */
export const gameHref = (locale: Locale, slug: string) => localePath(locale, `/${slug}`);
