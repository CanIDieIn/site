// Lists games with no answer in deaths.json, or finds answers to copy.
//
//   node find-missing.mjs [--top 1000]
//     The games in the top N by popularity, as the site sorts them, with no
//     entry in deaths.json. Prints rank, id, name, slug and release year.
//
//   node find-missing.mjs --like "ship|sunk"
//     Existing answers whose game name or reason matches the pattern (case is
//     ignored), to see how a similar game was ruled and worded.
//
// Run from the repository root.
import fs from "node:fs";

const args = process.argv.slice(2);
const option = (name) => {
  const at = args.indexOf(name);
  return at === -1 ? undefined : args[at + 1];
};

const games = JSON.parse(fs.readFileSync("src/data/games.json", "utf8"));
const deaths = JSON.parse(fs.readFileSync("src/data/deaths.json", "utf8"));
const verdict = (entry) => (typeof entry === "boolean" ? { deaths: entry } : entry);

const like = option("--like");
if (like) {
  const pattern = new RegExp(like, "i");
  const byId = new Map(games.map((game) => [String(game.id), game]));
  for (const [id, entry] of Object.entries(deaths)) {
    const { deaths: canDie, reason = "" } = verdict(entry);
    const name = byId.get(id)?.name ?? "?";
    if (pattern.test(name) || pattern.test(reason)) {
      console.log(`${id}\t${name}\t${canDie}\t${reason}`);
    }
  }
  process.exit(0);
}

// The site's "most popular" order: games with a popularity score, highest
// first. Games with no score come last there, so they are never in the top N.
const top = Number(option("--top") ?? 1000);
const ranked = games
  .filter((game) => game.popularity)
  .sort((a, b) => b.popularity - a.popularity)
  .slice(0, top);

const missing = ranked
  .map((game, index) => ({ game, rank: index + 1 }))
  .filter(({ game }) => !(String(game.id) in deaths));

for (const { game, rank } of missing) {
  const year = game.released
    ? new Date(game.released * 1000).getUTCFullYear()
    : "";
  console.log(`${rank}\t${game.id}\t${game.name}\t${game.slug}\t${year}`);
}
console.error(`${missing.length} of the top ${ranked.length} have no answer.`);
