import { normalise } from "./catalogue";

// Twitch categories that are not games. A stream bot sends the current
// category as it is, so without this list "Just Chatting" would get the same
// "we don't know" reply as a game nobody has answered yet, and "Crypto" or
// "Sports" would be answered for a game that shares the name.
//
// Names are written as Twitch writes them, and matched the same loose way as
// game names. Only categories that are never a game go here: Chess, Poker and
// Virtual Casino are left out, as they are games and are answered as games.
const CATEGORIES = [
  "Just Chatting",
  "IRL",
  "Art",
  "Music",
  "ASMR",
  "Talk Shows & Podcasts",
  "Sports",
  "Travel & Outdoors",
  "Food & Drink",
  "Special Events",
  "Science & Technology",
  "Software and Game Development",
  "Makers & Crafting",
  "Beauty & Body Art",
  "Fitness & Health",
  "Pools, Hot Tubs, and Beaches",
  "Politics",
  "Animals, Aquariums, and Zoos",
  "Co-working & Studying",
  "Writing & Reading",
  "Games + Demos",
  "Always On",
  "Crypto",
];

const categoriesByName = new Map(
  CATEGORIES.map((category) => [normalise(category), category]),
);

/**
 * The Twitch category, as Twitch writes it, when the name is one that is not a
 * game, and undefined otherwise.
 */
export const nonGameCategory = (name: string | undefined) =>
  name === undefined ? undefined : categoriesByName.get(normalise(name));
