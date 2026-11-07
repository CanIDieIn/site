import type { APIRoute } from "astro";
import { answerFor, plainText } from "../../lib/api";

// Answered per request, so no file is built for each of the 225,000 games.
export const prerender = false;

/**
 * Plain-text answer for tools such as Streamer.bot: `true` if you can die in
 * the game, `false` if not.
 *
 * The game is named in the address, either by its slug or by its name:
 *
 *   /api/baldurs-gate-iii
 *   /api/Baldur's Gate 3
 *
 * This route takes the whole rest of the address, so a name with a slash in
 * it, such as "Fate/stay night", works too. For a sentence to post straight
 * into chat instead, see api/chat/[...slug].ts.
 *
 * Anything else is a 404 with an empty body. That covers an address
 * that matches no game, and a game with no entry in `deaths.json` yet. There
 * is no third value, so a caller only ever has to handle true, false, or no
 * answer.
 */
export const GET: APIRoute = (context) => {
  const { canDie } = answerFor(context, "boolean");
  if (canDie === undefined) return plainText(null, 404);
  return plainText(String(canDie));
};
