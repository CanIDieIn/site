import {
  DEFAULT_SORT,
  listingFor,
  normalise,
  parseDirection,
  parseSort,
  numberedNameFor,
  searchableNamesFor,
  sortOption,
  withoutRomanNumerals,
  type Direction,
  type Game,
  type Scope,
  type Sort,
} from "./catalogue";
import { DEFAULT_LOCALE, type Locale } from "../i18n/locales";

// The search, sort and paging behind every page that lists games. A page calls
// `browse` with its own address and which games it covers, then hands the
// result to the GameBrowser component to draw.

const PAGE_SIZE = 50;

export type BrowseView = {
  /** The page's own address, such as "/" or "/fr/no-deaths". */
  basePath: string;
  /** The page's language. */
  locale: Locale;
  query: string;
  sort: Sort;
  direction: Direction;
  /** The direction this sort starts in. Only a different one goes in the address. */
  defaultDirection: Direction;
  page: number;
  totalPages: number;
  /** How many games match, across all pages. */
  total: number;
  /** The position of this page's first game among all matches, from 0. */
  start: number;
  /** This page's games, with each release date ready to show. */
  games: { game: Game; released?: { iso: string; text: string } }[];
  /** Link to another page of the current search, keeping the sort and direction. */
  pageHref: (target: number, keepQuery?: boolean) => string;
  /**
   * Set when the requested address is not in its tidiest form. The page should
   * redirect here instead of rendering.
   */
  redirect?: string;
};

/**
 * Release dates are written the way the visitor's own language and region
 * write them: "3 Mar 2017" in the UK, "Mar 3, 2017" in the US. The browser
 * states its preference in the Accept-Language header, most preferred first.
 *
 * Only preferences in the page's own language are used, so a French page
 * never shows a date in English. A visitor from Canada still gets French
 * Canadian dates on it. With no such preference, the page's language decides.
 */
const dateFormatFor = (request: Request, locale: Locale) => {
  const preferred = (request.headers.get("accept-language") ?? "")
    .split(",")
    .map((entry) => entry.split(";")[0].trim())
    .filter((preference) => {
      try {
        return (
          Intl.DateTimeFormat.supportedLocalesOf(preference).length > 0 &&
          new Intl.Locale(preference).language === locale
        );
      } catch {
        return false; // not a valid locale name, such as "*"
      }
    });
  // IGDB dates are whole days at midnight UTC, so format in UTC to avoid the
  // date slipping a day in other time zones.
  return new Intl.DateTimeFormat(preferred.length ? preferred : locale, {
    dateStyle: "medium",
    timeZone: "UTC",
  });
};

/**
 * Works out what a listing page should show for a request.
 *
 * @param request  The incoming request, for the visitor's language.
 * @param url      The requested address, for the search, sort and page number.
 * @param basePath The page's own address, used to build its links.
 * @param scope    Which games the page covers.
 * @param locale   The page's language, for dates. Searching does not use it:
 *                 every language's names are searched from every page.
 */
export const browse = (
  request: Request,
  url: URL,
  basePath: string,
  scope: Scope,
  locale: Locale = DEFAULT_LOCALE,
): BrowseView => {
  const sort = parseSort(url.searchParams.get("sort"));
  const { defaultDirection } = sortOption(sort);
  const direction = parseDirection(url.searchParams.get("dir"), sort);
  const { games: sortedGames, searchable } = listingFor(sort, direction, scope);

  const query = (url.searchParams.get("q") ?? "").trim().slice(0, 100);
  const needle = normalise(query);
  const words = [...new Set(needle.split(" ").filter(Boolean))];

  let results = sortedGames;
  if (query) {
    // A game matches when its name contains every word of the query, in any
    // order. Results are ranked into tiers, best first, and the chosen sort
    // order applies within each tier:
    //   0 the name is exactly the query
    //   1 the name starts with the query
    //   2 the name contains the query as a phrase
    //   3 every query word starts a word in the name
    //   4 every query word appears somewhere in the name
    //   5 the name only matches once Roman numerals and ordinary numbers are
    //     treated as the same, so "baldurs gate 3" finds "Baldur's Gate III"
    //
    // Tier 5 comes last so a name that matches as written always ranks above
    // one that matches only after its numerals were rewritten. That keeps
    // "Mega Man 10" ahead of "Mega Man X" for someone searching the former,
    // while still leaving the other findable.
    //
    // A game's name in every other language is searched as well as its English
    // name, whatever language the page is in, and the best match counts. So
    // searching "原神" finds Genshin Impact from the English page, and someone
    // who knows a game only by its Russian name finds it anywhere.
    const NUMERAL_TIER = 5;
    const tiers: Game[][] = [[], [], [], [], [], []];
    /** Ranks names against one written form of the query. */
    const tierer = (text: string) => {
      const parts = [...new Set(text.split(" ").filter(Boolean))];
      const partStarts = parts.map((word) => ` ${word}`);
      return (name: string) => {
        if (!parts.every((word) => name.includes(word))) return Infinity;
        if (name === text) return 0;
        if (name.startsWith(text)) return 1;
        if (name.includes(text)) return 2;
        if (partStarts.every((word) => ` ${name}`.includes(word))) return 3;
        return 4;
      };
    };
    const tierOf = tierer(needle);
    // The query with its own Roman numerals written as ordinary numbers, so it
    // meets the names that have been through the same change.
    const numberedNeedle = withoutRomanNumerals(needle);
    const tierOfNumbered = tierer(numberedNeedle);
    const needleRenumbered = numberedNeedle !== needle;

    for (let i = 0; words.length > 0 && i < sortedGames.length; i++) {
      const { id } = sortedGames[i];
      let tier = tierOf(searchable[i]);
      // Most games have no other names, so this usually costs one lookup.
      for (const localName of searchableNamesFor(id) ?? []) {
        if (tier === 0) break; // nothing can beat an exact match
        tier = Math.min(tier, tierOf(localName));
      }
      if (tier === Infinity) {
        // Only worth rewriting numerals when one side or the other has one,
        // which for most games and most searches is neither.
        const numberedName = numberedNameFor(id);
        if (numberedName !== undefined || needleRenumbered) {
          const name = numberedName ?? searchable[i];
          if (tierOfNumbered(name) !== Infinity) tier = NUMERAL_TIER;
        }
      }
      if (tier !== Infinity) tiers[tier].push(sortedGames[i]);
    }
    results = tiers.flat();
  }

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const requestedPage = Number.parseInt(
    url.searchParams.get("page") ?? "1",
    10,
  );
  const page = Math.min(
    Math.max(Number.isNaN(requestedPage) ? 1 : requestedPage, 1),
    totalPages,
  );
  const start = (page - 1) * PAGE_SIZE;

  /** The query string for a page of the current search, without the "?". */
  const searchFor = (target: number, keepQuery = true) => {
    const params = new URLSearchParams();
    if (query && keepQuery) params.set("q", query);
    if (sort !== DEFAULT_SORT) params.set("sort", sort);
    if (direction !== defaultDirection) params.set("dir", direction);
    if (target > 1) params.set("page", String(target));
    return params.toString();
  };
  const pageHref = (target: number, keepQuery = true) => {
    const search = searchFor(target, keepQuery);
    return search ? `${basePath}?${search}` : basePath;
  };

  // Keep the address bar tidy. The search form always sends every field, so
  // picking a sort with no search text would leave "?q=" behind. Any address
  // that is not in its shortest form is redirected to it: empty or default
  // values are dropped and an out-of-range page number is corrected. Both
  // sides are compared after re-encoding, so a differently encoded address
  // cannot cause a redirect loop.
  const requested = new URLSearchParams(url.search).toString();
  const redirect = requested === searchFor(page) ? undefined : pageHref(page);

  const dateFormat = dateFormatFor(request, locale);
  const games = results.slice(start, start + PAGE_SIZE).map((game) => {
    if (game.released === undefined) return { game };
    const date = new Date(game.released * 1000);
    return {
      game,
      released: {
        iso: date.toISOString().slice(0, 10),
        text: dateFormat.format(date),
      },
    };
  });

  return {
    basePath,
    locale,
    query,
    sort,
    direction,
    defaultDirection,
    page,
    totalPages,
    total: results.length,
    start,
    games,
    pageHref,
    redirect,
  };
};
