import fs from "node:fs";
import path from "node:path";

// Load the IGDB keys from .env using Node's built-in loader. Variables already
// set in the environment win, and a missing file is fine, so the keys can
// also be supplied directly, for example by a CI job.
if (fs.existsSync(".env")) process.loadEnvFile(".env");

const CLIENT_KEY = process.env.IGDB_CLIENT_KEY!;
const CLIENT_SECRET = process.env.IGDB_CLIENT_SECRET!;

export const getAuthToken = async (): Promise<string> => {
  try {
    const result = await fetch(`https://id.twitch.tv/oauth2/token`, {
      headers: { "content-type": "application/x-www-form-urlencoded" },
      method: "POST",
      body: new URLSearchParams({
        client_id: CLIENT_KEY,
        client_secret: CLIENT_SECRET,
        grant_type: "client_credentials",
      }),
    });
    const { access_token } = await result.json();
    return access_token;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    return "";
  }
};

// Records may carry extra custom fields, which are always preserved.
export type Game = {
  id: number;
  name: string;
  slug?: string;
  released?: number;
  art?: string;
  cover?: string;
  popularity?: number;
  [field: string]: unknown;
};

// The fields owned by IGDB. These are kept in sync; all others are custom.
// `first_release_date` is the game's earliest release anywhere, in seconds
// since 1970. It is absent when IGDB has no date, and in the future for games
// that are announced but not out.
//
// `artworks` and `cover` are the game's images. Each has an `image_id`, which
// is all that is needed to build an address on IGDB's image server.
type IgdbArtwork = {
  image_id?: string;
  artwork_type?: number;
  width?: number;
  height?: number;
};
type IgdbGame = {
  id: number;
  name: string;
  slug: string;
  first_release_date?: number;
  artworks?: IgdbArtwork[];
  cover?: { image_id?: string };
};

// Which artwork to use behind a game's page and social media card. This is a
// list of IGDB's artwork types, most preferred first. Only one is allowed:
// 2, key art without the game's logo. That is official publisher artwork.
//
// Two types are deliberately left out:
//   1, general "Artwork". Anyone can upload to it, and it contains fan art.
//      Only official artwork should represent a game here.
//   3, key art WITH the logo. These images are used as backgrounds, and a
//      logo behind the page's own text is a distraction.
//
// A game with no type 2 artwork uses its cover instead, which is official too.
const ARTWORK_TYPE_PREFERENCE = [2];

/**
 * Picks the image for a game's social media card. Returns `art`, the id of a
 * landscape artwork, or failing that `cover`, the id of its portrait cover.
 * A game with neither gets nothing, and its card is drawn without an image.
 */
const pickImage = ({ artworks = [], cover }: IgdbGame): { art?: string; cover?: string } => {
  const landscape = artworks.filter(
    (artwork) =>
      artwork.image_id &&
      ARTWORK_TYPE_PREFERENCE.includes(artwork.artwork_type ?? 0) &&
      // Wide enough to fill a card without being stretched, and wider than tall.
      (artwork.width ?? 0) >= 1000 &&
      (artwork.width ?? 0) >= (artwork.height ?? 0) * 1.3,
  );
  // The card is about 1.9 times as wide as it is tall. Within the best type
  // available, take the artwork closest to that shape, so the least is cropped.
  const shapeError = (artwork: IgdbArtwork) =>
    Math.abs((artwork.width ?? 0) / (artwork.height ?? 1) - 1200 / 630);
  for (const type of ARTWORK_TYPE_PREFERENCE) {
    const [best] = landscape
      .filter((artwork) => artwork.artwork_type === type)
      .sort((a, b) => shapeError(a) - shapeError(b));
    if (best) return { art: best.image_id };
  }
  return cover?.image_id ? { cover: cover.image_id } : {};
};

const IGDB_PAGE_SIZE = 500; // the maximum IGDB allows per request
const IGDB_MIN_INTERVAL_MS = 300; // IGDB allows 4 requests per second
const IGDB_MAX_ATTEMPTS = 6;

// Only games with a Twitch category are kept. IGDB lists each game's ids on
// other services as "external games", and source 14 is Twitch. This leaves out
// most DLC, bundles, special editions and mods, which have no category there.
// Unreleased games are included, as Twitch gives them a category in advance.
const IGDB_TWITCH_FILTER = "external_games.external_game_source = 14";

// IGDB has no single popularity figure. It publishes several scores per game
// ("popularity primitives"), each of one type and recalculated daily. This is
// the type used for the `popularity` field: 3 is "Playing", based on how many
// IGDB users currently mark the game as being played. Alternatives include
// 1 "Visits", 5 "24hr Peak Players" (Steam only) and 34 "24hr Hours Watched"
// (Twitch). The full list is at the `popularity_types` endpoint.
const IGDB_POPULARITY_TYPE = 3;

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

/** POSTs a query to IGDB, retrying rate limits, server errors and network failures. */
const igdbQuery = async <T>(
  endpoint: string,
  token: string,
  body: string,
): Promise<T> => {
  let lastError: unknown;
  for (let attempt = 1; attempt <= IGDB_MAX_ATTEMPTS; attempt++) {
    if (attempt > 1) await sleep(Math.min(500 * 2 ** (attempt - 2), 15_000));
    let response: Response;
    try {
      response = await fetch(`https://api.igdb.com/v4/${endpoint}`, {
        method: "POST",
        headers: {
          "Client-ID": CLIENT_KEY,
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body,
        signal: AbortSignal.timeout(30_000),
      });
    } catch (err) {
      lastError = err; // network failure or timeout
      continue;
    }
    if (response.ok) return (await response.json()) as T;
    lastError = new Error(
      `IGDB ${endpoint} responded ${response.status}: ${await response.text()}`,
    );
    // Only rate limits and server errors are worth retrying.
    if (response.status !== 429 && response.status < 500) break;
  }
  throw lastError;
};

/** Reads the saved games list, or returns an empty list if there is none yet. */
const readSavedGames = (file: string): Game[] => {
  if (!fs.existsSync(file)) return [];
  const saved: unknown = JSON.parse(fs.readFileSync(file, "utf-8"));
  if (!Array.isArray(saved)) {
    throw new Error(`${file} does not contain an array of games.`);
  }
  return saved;
};

/**
 * Pulls the current popularity score of every game that has one. Most games
 * have none. Scores are small fractions that only mean something relative to
 * each other: higher is more popular.
 */
const fetchPopularity = async (token: string): Promise<Map<number, number>> => {
  type Primitive = { id: number; game_id: number; value: number };
  const filter = `popularity_type = ${IGDB_POPULARITY_TYPE}`;
  const { count } = await igdbQuery<{ count: number }>(
    "popularity_primitives/count",
    token,
    `where ${filter};`,
  );
  const popularityById = new Map<number, number>();
  let lastId = 0;
  let seen = 0;

  while (true) {
    const startedAt = Date.now();
    const page = await igdbQuery<Primitive[]>(
      "popularity_primitives",
      token,
      `fields game_id,value; where ${filter} & id > ${lastId}; sort id asc; limit ${IGDB_PAGE_SIZE};`,
    );
    if (page.length === 0) break;
    for (const { game_id, value } of page) {
      if (typeof value !== "number" || value <= 0) continue;
      popularityById.set(
        game_id,
        Math.max(value, popularityById.get(game_id) ?? 0),
      );
    }
    lastId = page[page.length - 1].id;
    seen += page.length;
    console.log(`Fetched ${seen} of ~${count} popularity scores`);
    if (page.length < IGDB_PAGE_SIZE) break;
    await sleep(IGDB_MIN_INTERVAL_MS - (Date.now() - startedAt));
  }
  return popularityById;
};

/**
 * Pulls the id, name and slug of every IGDB game that has a Twitch category,
 * released or not, plus its current popularity score where it has one, and brings `outFile`
 * in line with them.
 *
 * Games are matched by id. A new id is appended as `{ id, name, slug }`, and
 * a changed (or missing) name or slug is updated in place. `art` or `cover`
 * (the image for the game's social media card), `released` (the
 * first release date, in seconds since 1970) and `popularity` are replaced
 * with their values at the time of the run, and removed from games that no
 * longer have one. Saved games that IGDB no longer returns, or that have no
 * Twitch category, are removed. Custom fields and record order are kept.
 *
 * Pages by id ("where id > last seen") instead of by offset, so records added
 * or removed mid-run cannot cause skipped or duplicated games.
 */
export const fetchAllGames = async (
  outFile = "./src/data/games.json",
): Promise<Game[]> => {
  readSavedGames(outFile); // fail now, not after the pull, if the file is unreadable
  const token = await getAuthToken();
  if (!token) {
    throw new Error(
      "Twitch auth returned no access token. Check the .env keys.",
    );
  }

  const filter = IGDB_TWITCH_FILTER;
  const { count } = await igdbQuery<{ count: number }>(
    "games/count",
    token,
    `where ${filter};`,
  );
  const fetched: IgdbGame[] = [];
  let lastId = 0;

  while (true) {
    const startedAt = Date.now();
    const page = await igdbQuery<IgdbGame[]>(
      "games",
      token,
      `fields name,slug,first_release_date,cover.image_id,artworks.image_id,artworks.artwork_type,artworks.width,artworks.height; where ${filter} & id > ${lastId}; sort id asc; limit ${IGDB_PAGE_SIZE};`,
    );
    if (page.length === 0) break;
    for (const game of page) fetched.push(game);
    lastId = page[page.length - 1].id;
    console.log(`Fetched ${fetched.length} of ~${count} games`);
    if (page.length < IGDB_PAGE_SIZE) break;
    await sleep(IGDB_MIN_INTERVAL_MS - (Date.now() - startedAt));
  }

  // Removing games relies on the pull being complete, so refuse to prune the
  // file against a pull that came back far short of what IGDB reported.
  if (fetched.length < count * 0.9) {
    throw new Error(
      `Only fetched ${fetched.length} of ~${count} games. Nothing was saved.`,
    );
  }
  const popularityById = await fetchPopularity(token);

  // Re-read the file here so edits made to it during the pull are kept.
  const savedGames = readSavedGames(outFile);
  const fetchedIds = new Set(fetched.map((game) => game.id));
  const games = savedGames.filter((game) => fetchedIds.has(game.id));
  const removed = savedGames.length - games.length;
  const indexById = new Map(games.map((game, index) => [game.id, index]));
  let added = 0;
  let updated = 0;
  for (const { id, name, slug } of fetched) {
    const index = indexById.get(id);
    if (index === undefined) {
      games.push({ id, name, slug });
      added++;
      continue;
    }
    const saved = games[index];
    if (saved.name === name && saved.slug === slug) continue;
    // Rebuild the record so a newly added slug sits beside the name, ahead
    // of any custom fields. Later keys overwrite in place, keeping the order.
    // @ts-expect-error Weirdness
    games[index] = { id, name, slug, ...saved, name, slug };
    updated++;
  }

  // Release date, image and popularity are brought in line with this run on
  // every record, and dropped from games that no longer have them.
  const releasedById = new Map<number, number>();
  const imageById = new Map<number, { art?: string; cover?: string }>();
  for (const game of fetched) {
    if (typeof game.first_release_date === "number") {
      releasedById.set(game.id, game.first_release_date);
    }
    imageById.set(game.id, pickImage(game));
  }
  let redated = 0;
  let reimaged = 0;
  let rescored = 0;
  for (let index = 0; index < games.length; index++) {
    const {
      id,
      name,
      slug,
      released: savedReleased,
      art: savedArt,
      cover: savedCover,
      popularity: savedPopularity,
      ...custom
    } = games[index];
    const released = releasedById.get(id);
    const { art, cover } = imageById.get(id) ?? {};
    const popularity = popularityById.get(id);
    const sameImage = savedArt === art && savedCover === cover;
    if (savedReleased === released && sameImage && savedPopularity === popularity) continue;
    // Rebuild the record so these sit after the slug, ahead of any custom
    // fields.
    games[index] = {
      id,
      name,
      ...(slug !== undefined && { slug }),
      ...(released !== undefined && { released }),
      ...(art !== undefined && { art }),
      ...(cover !== undefined && { cover }),
      ...(popularity !== undefined && { popularity }),
      ...custom,
    };
    if (savedReleased !== released) redated++;
    if (!sameImage) reimaged++;
    if (savedPopularity !== popularity) rescored++;
  }
  console.log(
    `${added} games added, ${updated} updated, ${removed} removed, ${redated} release dates changed, ${reimaged} images changed, ${rescored} popularity scores changed`,
  );
  if (added + updated + removed + redated + reimaged + rescored === 0) return games;

  // Compact JSON with one game per line. The file is not meant to be read or
  // edited by hand, but a line per game keeps the diff between runs small.
  const lines = games.map((game) => JSON.stringify(game));
  const output = "[\n" + lines.join(",\n") + "\n]\n";

  // Write to a temp file first so a crash never leaves a half-written file.
  const tempFile = `${outFile}.tmp`;
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(tempFile, output, "utf-8");
  fs.renameSync(tempFile, outFile);
  return games;
};

// Optional first argument overrides the output path.
await fetchAllGames(process.argv[2]);
