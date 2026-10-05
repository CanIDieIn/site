import {
  DEFAULT_SORT,
  listingFor,
  normalise,
  parseDirection,
  parseSort,
  sortOption,
  type Direction,
  type Game,
  type Scope,
  type Sort,
} from "./catalogue";

// The search, sort and paging behind every page that lists games. A page calls
// `browse` with its own address and which games it covers, then hands the
// result to the GameBrowser component to draw.

const PAGE_SIZE = 50;

export type BrowseView = {
  /** The page's own address, such as "/" or "/no-deaths". */
  basePath: string;
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
 */
const dateFormatFor = (request: Request) => {
  const preferred = (request.headers.get("accept-language") ?? "")
    .split(",")
    .map((entry) => entry.split(";")[0].trim())
    .filter((locale) => {
      try {
        return Intl.DateTimeFormat.supportedLocalesOf(locale).length > 0;
      } catch {
        return false; // not a valid locale name, such as "*"
      }
    });
  // IGDB dates are whole days at midnight UTC, so format in UTC to avoid the
  // date slipping a day in other time zones.
  return new Intl.DateTimeFormat(preferred.length ? preferred : "en", {
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
 */
export const browse = (request: Request, url: URL, basePath: string, scope: Scope): BrowseView => {
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
    const tiers: Game[][] = [[], [], [], [], []];
    const wordStarts = words.map((word) => ` ${word}`);
    for (let i = 0; words.length > 0 && i < sortedGames.length; i++) {
      const name = searchable[i];
      if (!words.every((word) => name.includes(word))) continue;
      let tier = 4;
      if (name === needle) tier = 0;
      else if (name.startsWith(needle)) tier = 1;
      else if (name.includes(needle)) tier = 2;
      else if (wordStarts.every((word) => ` ${name}`.includes(word))) tier = 3;
      tiers[tier].push(sortedGames[i]);
    }
    results = tiers.flat();
  }

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const requestedPage = Number.parseInt(url.searchParams.get("page") ?? "1", 10);
  const page = Math.min(Math.max(Number.isNaN(requestedPage) ? 1 : requestedPage, 1), totalPages);
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

  const dateFormat = dateFormatFor(request);
  const games = results.slice(start, start + PAGE_SIZE).map((game) => {
    if (game.released === undefined) return { game };
    const date = new Date(game.released * 1000);
    return {
      game,
      released: { iso: date.toISOString().slice(0, 10), text: dateFormat.format(date) },
    };
  });

  return {
    basePath,
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
