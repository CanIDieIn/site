import games from "../data/games.json";
import deaths from "../data/deaths.json";

// This module is evaluated once when the server starts, so the sorting and
// name normalising below is not repeated on every request.

/**
 * `released` is the first release date in seconds since 1970, absent when IGDB
 * has none. `popularity` is IGDB's "Playing" score. Most games have no score.
 * Both are as of the last data refresh.
 */
export type Game = {
  id: number;
  name: string;
  slug: string;
  released?: number;
  popularity?: number;
};

/**
 * Reduces text to plain lowercase words: accents and apostrophes are dropped
 * and other punctuation becomes a space. "Baldur's Gate" becomes "baldurs gate"
 * and "Pokémon" becomes "pokemon".
 */
export const normalise = (text: string) =>
  text
    .normalize("NFD")
    .replace(/\p{M}|['’`]/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();

type Keyed = { game: Game; key: string };

const collator = new Intl.Collator("en", { numeric: true });
// How far ahead the list looks. The data includes games dated many years out,
// often as publisher placeholders such as 31 December 2040. Those are left off
// the list and out of search until they come within this window. Games with no
// release date at all are kept. Part months work, so 0.5 is about two weeks.
//
// The window slides: it is measured from today, whatever day the site was
// built or started. See listingFor below.
const UPCOMING_WINDOW_MONTHS = 0.5;
const SECONDS_PER_DAY = 24 * 60 * 60;
const SECONDS_PER_MONTH = (365.25 * SECONDS_PER_DAY) / 12; // an average month

const keyed: Keyed[] = (games as Game[]).map((game) => ({
  game,
  key: normalise(game.name),
}));

/** The games in one display order, alongside their normalised names. */
const ordered = (compare: (a: Keyed, b: Keyed) => number) => {
  const sorted = [...keyed].sort(compare);
  return {
    games: sorted.map((entry) => entry.game),
    searchable: sorted.map((entry) => entry.key),
  };
};

export type Direction = "asc" | "desc";

/**
 * A to Z, or Z to A. Ignores case, accents and punctuation, and counts numbers
 * properly, so "Portal 2" comes before "Portal 10". Names made only of symbols
 * have nothing to sort on, so they go last in both directions. The id is a
 * tie-break so the order is always the same.
 */
const byName = (direction: Direction) => {
  const sign = direction === "asc" ? 1 : -1;
  return (a: Keyed, b: Keyed) =>
    Number(a.key === "") - Number(b.key === "") ||
    sign * collator.compare(a.key, b.key) ||
    a.game.id - b.game.id;
};

/**
 * Most or least popular first. Most games have no score, so those go last in
 * both directions, alphabetically. Otherwise "least popular first" would open
 * with 200,000 unscored games.
 */
const byPopularity = (direction: Direction) => {
  const sign = direction === "asc" ? 1 : -1;
  const alphabetical = byName("asc");
  return (a: Keyed, b: Keyed) =>
    Number(!a.game.popularity) - Number(!b.game.popularity) ||
    sign * ((a.game.popularity ?? 0) - (b.game.popularity ?? 0)) ||
    alphabetical(a, b);
};

/**
 * Newest or oldest first. Games announced for a future date count as newest.
 * Games with no release date go last in both directions, alphabetically.
 */
const byRelease = (direction: Direction) => {
  const sign = direction === "asc" ? 1 : -1;
  const alphabetical = byName("asc");
  return (a: Keyed, b: Keyed) =>
    Number(a.game.released === undefined) -
      Number(b.game.released === undefined) ||
    sign * ((a.game.released ?? 0) - (b.game.released ?? 0)) ||
    alphabetical(a, b);
};

const bothDirections = (
  compare: (direction: Direction) => (a: Keyed, b: Keyed) => number,
) => ({
  asc: ordered(compare("asc")),
  desc: ordered(compare("desc")),
});

// Every game in every order, including games too far off to be listed. Sorting
// 300,000 games takes seconds, so it is done once, here, when the server starts.
const catalogues = {
  popularity: bothDirections(byPopularity),
  name: bothDirections(byName),
  release: bothDirections(byRelease),
};

/** Which games a list covers: all of them, or only those marked as no deaths. */
export type Scope = "all" | "no-deaths";

type Listing = { games: Game[]; searchable: string[] };
const listings = new Map<string, { day: number; listing: Listing }>();

/**
 * The games to list today in the given order, alongside their normalised
 * names. Entry 5 of each list describes the same game.
 *
 * For "all", this is the full catalogue minus games releasing beyond the
 * upcoming window. The window is measured from the current day, so a game
 * appears by itself once its date comes into range, with no rebuild or
 * restart. The result is kept for the rest of the day, so only the first
 * request each day does the filtering. Days are counted in UTC, which is how
 * IGDB dates are stored.
 *
 * For "no-deaths", this is every game explicitly marked in `deaths.json` as
 * one you cannot die in. The upcoming window does not apply, as each of those
 * games was marked by hand.
 */
export const listingFor = (
  sort: Sort,
  direction: Direction,
  scope: Scope = "all",
  now = Date.now(),
): Listing => {
  const day = Math.floor(now / 1000 / SECONDS_PER_DAY);
  const key = `${scope}:${sort}:${direction}`;
  const cached = listings.get(key);
  if (cached?.day === day) return cached.listing;

  // Up to the end of today, plus the window.
  const latestRelease =
    (day + 1) * SECONDS_PER_DAY + UPCOMING_WINDOW_MONTHS * SECONDS_PER_MONTH;
  const all = catalogues[sort][direction];
  const listing: Listing = { games: [], searchable: [] };
  for (let i = 0; i < all.games.length; i++) {
    const { id, released } = all.games[i];
    if (scope === "no-deaths") {
      if (deathsById.get(id)?.deaths !== false) continue;
    } else if (released !== undefined && released > latestRelease) {
      continue;
    }
    listing.games.push(all.games[i]);
    listing.searchable.push(all.searchable[i]);
  }
  listings.set(key, { day, listing });
  return listing;
};

export type Sort = keyof typeof catalogues;

/** Each sort and the direction it starts in. */
export const SORTS: {
  value: Sort;
  label: string;
  defaultDirection: Direction;
}[] = [
  // Descending by default, so the most popular games come first.
  { value: "popularity", label: "Popularity", defaultDirection: "desc" },
  { value: "name", label: "Alphabetical", defaultDirection: "asc" },
  // Descending by default, so the newest games come first.
  { value: "release", label: "Release Date", defaultDirection: "desc" },
];

/** The same two choices, in the same order, for every sort. */
export const DIRECTIONS: { value: Direction; label: string }[] = [
  { value: "asc", label: "Ascending" },
  { value: "desc", label: "Descending" },
];

export const DEFAULT_SORT: Sort = "popularity";

/** The sort named in a request, or the default if it is missing or unknown. */
export const parseSort = (value: string | null): Sort =>
  SORTS.find((sort) => sort.value === value)?.value ?? DEFAULT_SORT;

/** The settings for one sort. */
export const sortOption = (sort: Sort) =>
  SORTS.find((option) => option.value === sort)!;

/** The direction named in a request, or the sort's own default. */
export const parseDirection = (value: string | null, sort: Sort): Direction =>
  value === "asc" || value === "desc"
    ? value
    : sortOption(sort).defaultDirection;

// My own data, joined to the IGDB catalogue by game id. The file is one object
// mapping each game id to its answer and a short reason for it:
//
//   { "71": { "deaths": true, "reason": "Turrets and toxic goo can kill you." } }
//
// The reason is optional. A bare `true` or `false` also works, as a quick way
// to record an answer with no reason: `{ "71": true }`.
type Verdict = { deaths: boolean; reason?: string };
const deathsById = new Map<number, Verdict>(
  Object.entries(deaths as Record<string, boolean | Verdict>).map(
    ([id, entry]) => [
      Number(id),
      typeof entry === "boolean" ? { deaths: entry } : entry,
    ],
  ),
);
// Every game in the data, including those too far off to be listed, so a
// direct link to any game's page still works.
const gamesBySlug = new Map((games as Game[]).map((game) => [game.slug, game]));

/** The game with this slug, if it is in the catalogue. */
export const findGame = (slug: string | undefined): Game | undefined =>
  slug === undefined ? undefined : gamesBySlug.get(slug);

/**
 * Whether you can die in the game: `true`, `false`, or `undefined` when the
 * game has no entry in `deaths.json` and nobody has decided yet.
 *
 * The rule is one question: would it make a fun moment to call this a death?
 * Killed, knocked out, blown up, game over: all yes. If nothing in the game
 * could ever earn a "you died", it is a no.
 */
export const canDieIn = (game: Game): boolean | undefined =>
  deathsById.get(game.id)?.deaths;

/** A short explanation of the game's answer, if one has been written. */
export const reasonFor = (game: Game): string | undefined =>
  deathsById.get(game.id)?.reason;

/**
 * Every game explicitly marked in `deaths.json` as one you cannot die in, A to
 * Z. Games with no entry are left out: unknown is not the same as no. Games too
 * far off to be on the main list are included, as each was marked by hand.
 */
export const gamesWithoutDeaths: Game[] = keyed
  .filter((entry) => deathsById.get(entry.game.id)?.deaths === false)
  .sort(byName("asc"))
  .map((entry) => entry.game);
