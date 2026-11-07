// Adds answers to src/data/deaths.json from a JSON file of new entries:
//
//   { "278790": { "deaths": true, "reason": "Your ship can be sunk…" } }
//
//   node add-answers.mjs new.json [--replace]
//
// Each id must be a game in games.json. An id that already has an answer is
// refused unless --replace is given, so existing answers are not overwritten
// by accident. The file is written in its usual form: ids in ascending order,
// two-space indents, and a closing newline.
//
// Run from the repository root.
import fs from "node:fs";

const [file, ...flags] = process.argv.slice(2);
if (!file) {
  console.error("Usage: node add-answers.mjs new.json [--replace]");
  process.exit(1);
}
const replace = flags.includes("--replace");

const path = "src/data/deaths.json";
const deaths = JSON.parse(fs.readFileSync(path, "utf8"));
const additions = JSON.parse(fs.readFileSync(file, "utf8"));
const ids = new Set(
  JSON.parse(fs.readFileSync("src/data/games.json", "utf8")).map((game) =>
    String(game.id),
  ),
);

const problems = [];
for (const [id, entry] of Object.entries(additions)) {
  if (!ids.has(id)) problems.push(`${id}: no such game in games.json`);
  if (id in deaths && !replace) problems.push(`${id}: already answered`);
  if (typeof entry.deaths !== "boolean") problems.push(`${id}: deaths must be true or false`);
  if (typeof entry.reason !== "string" || !entry.reason.trim()) {
    problems.push(`${id}: reason is missing`);
  } else {
    if (entry.reason.length > 110) problems.push(`${id}: reason is over 110 characters`);
    if (!/[.!?…]$/.test(entry.reason)) problems.push(`${id}: reason must end with a full stop`);
  }
}
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}

Object.assign(deaths, additions);
// Integer-like keys keep ascending order in a JavaScript object, which is the
// order the file is kept in.
fs.writeFileSync(path, `${JSON.stringify(deaths, null, 2)}\n`);
console.log(`Added ${Object.keys(additions).length} answers.`);
