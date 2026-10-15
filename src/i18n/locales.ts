// The languages the site is written in, and how each one's addresses work.
//
// English lives at the root: /, /portal, /no-deaths. Every other language has
// the same pages under its own code: /fr, /fr/portal, /fr/no-deaths. The
// middleware in src/middleware.ts reads the code off the front of the address
// and hands the rest to the ordinary pages, so each page is written once.
//
// TO ADD A LANGUAGE: add its code here, then a block for it in ui.ts and
// streaming.ts. TypeScript will point out every string that is missing. Run
// `npm run og:assets` to draw its stamps, checking first that the fonts it
// names cover the language's script. To pull game names in that language from
// IGDB, see IGDB_NAME_REGIONS and IGDB_NAME_COMMENTS in data.ts.

export const LOCALES = [
  "en",
  "fr",
  "es",
  "de",
  "ja",
  "ko",
  "zh",
  "it",
  "ru",
  "ar",
] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Each language's own name for itself, for the language menu. */
export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  es: "Español",
  de: "Deutsch",
  ja: "日本語",
  ko: "한국어",
  // The interface is in simplified characters, and a game's Chinese name is
  // its simplified one wherever IGDB has one. See IGDB_NAME_COMMENTS.
  zh: "简体中文",
  it: "Italiano",
  ru: "Русский",
  ar: "العربية",
};

/**
 * The languages written right to left. Every other language is written left to
 * right.
 *
 * A page sets this as the `dir` of its <html>, which is what flips the whole
 * layout: the styles are written with logical properties, so "start" means the
 * left in English and the right in Arabic, and nothing needs saying twice.
 */
const RTL_LOCALES = new Set<Locale>(["ar"]);

/** Which way a language is written, for the `dir` attribute. */
export const directionOf = (locale: Locale): "ltr" | "rtl" =>
  RTL_LOCALES.has(locale) ? "rtl" : "ltr";

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
export const splitLocale = (
  pathname: string,
): { locale: Locale; path: string; prefixed: boolean } => {
  const [, first, ...rest] = pathname.split("/");
  if (!isLocale(first))
    return { locale: DEFAULT_LOCALE, path: pathname, prefixed: false };
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
export const gameHref = (locale: Locale, slug: string) =>
  localePath(locale, `/${slug}`);
