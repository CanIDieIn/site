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
  /** The id of a landscape artwork on IGDB's image server, for the game's social media card. */
  art?: string;
  /** The id of the game's portrait cover, used for the card when there is no artwork. */
  cover?: string;
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

// IGDB reuses names: a remake often shares its name with the original, and
// there are four games called "Dead Space". When a name is looked up, a game
// with an answer in `deaths.json` beats one without, then the more popular
// game wins, then the older record.
const preferredForName = (a: Game, b: Game) =>
  Number(deathsById.has(b.id)) - Number(deathsById.has(a.id)) ||
  (b.popularity ?? 0) - (a.popularity ?? 0) ||
  a.id - b.id;

// Keyed by normalised name, so case, accents and punctuation do not matter.
// Names made only of symbols normalise to nothing and are left out.
const gamesByName = new Map<string, Game>();
for (const { game, key } of keyed) {
  if (key === "") continue;
  const current = gamesByName.get(key);
  if (!current || preferredForName(game, current) < 0) {
    gamesByName.set(key, game);
  }
}

/**
 * The game with this name, if it is in the catalogue. Meant for Twitch
 * category names, which are taken from IGDB and so match the names here.
 * "Baldur's Gate 3", "baldurs gate 3" and "BALDUR'S GATE 3" all find the same
 * game.
 */
export const findGameByName = (name: string | undefined): Game | undefined =>
  name === undefined ? undefined : gamesByName.get(normalise(name));

/**
 * Whether you can die in the game: `true`, `false`, or `undefined` when the
 * game has no entry in `deaths.json` and nobody has decided yet.
 *
 * The rule is one question: would it make a fun moment to call this a death?
 *
 * These rulings settle the borderline cases. The first 2,700 answers in
 * deaths.json follow them, so new answers should too:
 *
 *   - Knocked out or fainting, with no death: yes only if it costs you items,
 *     money or progress. Stardew Valley is a yes. Animal Crossing is a no.
 *   - A game over with no character to die: yes only when a whole run is
 *     lost. Suika Game and Balatro are a yes. Failing one song or level and
 *     retrying it is a no, as in Beat Saber.
 *   - Vehicles: yes only when the vehicle is your character in a fight, such
 *     as tanks, warships and starfighters. Racing crashes, and Rocket League,
 *     are a no.
 *   - Units you command: usually only "you" count. They count when losing
 *     them means a game over or a reset, as in XCOM, The Sims or Civilization.
 *   - Knocked out of a round or match: yes. Fighting games, Super Smash Bros.
 *     and Fall Guys are a yes. Losing on points, as in football, is a no.
 *   - Card games: yes when your hero or avatar is destroyed, as in
 *     Hearthstone. No when there is none, as in Marvel Snap.
 *   - Deaths that are only part of the story: no. Detroit: Become Human and
 *     Until Dawn are a no. Dying has to be a risk of normal play.
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
