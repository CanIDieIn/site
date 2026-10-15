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

/**
 * The language the visitor would most like to read, taken from their browser's
 * `Accept-Language` header, or undefined when it asks for none this site is
 * written in.
 *
 * The header is a list of languages, each with an optional quality from 0 to
 * 1, such as "fr-CA,fr;q=0.9,en;q=0.8". They are read in quality order, and a
 * region is ignored: Canadian French counts as French, and Swiss German as
 * German. "*" means "anything", which tells us nothing, so it is passed over.
 *
 * This is what the browser has been told to ask for, which is not quite where
 * the visitor is. Someone in Tokyo reading in English asks for English, and
 * gets it. That is the better guess of the two.
 */
export const preferredLocale = (header: string | null): Locale | undefined => {
  if (!header) return undefined;
  const wanted = header
    .split(",")
    .map((entry) => {
      const [tag = "", ...parameters] = entry.trim().split(";");
      const quality = parameters
        .map((parameter) => /^q=([\d.]+)$/.exec(parameter.trim())?.[1])
        .find((value) => value !== undefined);
      return { tag: tag.trim().toLowerCase(), quality: Number(quality ?? 1) };
    })
    .filter(({ tag, quality }) => tag !== "" && tag !== "*" && quality > 0)
    // A stable sort, so languages asked for equally keep the browser's order.
    .sort((a, b) => b.quality - a.quality);
  for (const { tag } of wanted) {
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }
  return undefined;
};

// The language to try for a visitor whose browser asked for none this site is
// written in, by the country they are connecting from.
//
// Only countries with one clear language among the ten are listed. Switzerland,
// Belgium and Canada are deliberately left out: each has more than one, and
// guessing wrong is worse than falling back to English, which every one of
// their languages' readers can change in two clicks.
//
// This is a weaker signal than the browser's own list and is only consulted
// after it, because where someone is says less than what they asked to read.
const LOCALE_BY_COUNTRY: Record<string, Locale> = {
  FR: "fr", MC: "fr", SN: "fr", CI: "fr", ML: "fr", BF: "fr", NE: "fr",
  TD: "fr", CD: "fr", CG: "fr", GA: "fr", CM: "fr", MG: "fr", BJ: "fr",
  ES: "es", MX: "es", AR: "es", CO: "es", CL: "es", PE: "es", VE: "es",
  EC: "es", GT: "es", CU: "es", BO: "es", DO: "es", HN: "es", PY: "es",
  SV: "es", NI: "es", CR: "es", PA: "es", UY: "es", GQ: "es",
  DE: "de", AT: "de", LI: "de",
  JP: "ja",
  KR: "ko",
  CN: "zh", TW: "zh", HK: "zh", MO: "zh",
  IT: "it", SM: "it", VA: "it",
  RU: "ru", BY: "ru", KZ: "ru", KG: "ru",
  SA: "ar", EG: "ar", AE: "ar", DZ: "ar", MA: "ar", IQ: "ar", SD: "ar",
  SY: "ar", YE: "ar", TN: "ar", JO: "ar", LY: "ar", LB: "ar", PS: "ar",
  OM: "ar", KW: "ar", QA: "ar", BH: "ar", MR: "ar", SO: "ar", DJ: "ar",
};

/**
 * The language to try for a visitor in this country, or undefined when the
 * country is unknown or speaks more than one of the site's languages.
 *
 * `country` is a two letter ISO 3166 code. Cloudflare sends one as the
 * `CF-IPCountry` header on every request it proxies; without a proxy that
 * fills it in there is nothing to read, and this is simply never reached.
 */
export const localeForCountry = (
  country: string | null,
): Locale | undefined => {
  if (!country) return undefined;
  return LOCALE_BY_COUNTRY[country.trim().toUpperCase()];
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
