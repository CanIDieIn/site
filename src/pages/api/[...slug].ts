import type { APIRoute } from "astro";
import { canDieIn, findGame, findGameByName } from "../../lib/catalogue";

// Answered per request, so no file is built for each of the 225,000 games.
export const prerender = false;

const text = (body: string | null, status = 200) =>
  new Response(body, {
    status,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      // Lets browser-based tools, such as stream overlays, call this too.
      "Access-Control-Allow-Origin": "*",
    },
  });

/**
 * Undoes any percent-encoding still left in the address, such as `%2F` for a
 * slash. A name with a real percent sign in it, such as "100% Orange Juice",
 * is not valid encoding and is returned as it is.
 */
const decoded = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

/**
 * Plain-text answer for tools such as Streamer.bot: `true` if you can die in
 * the game, `false` if not.
 *
 * The game is named in the address, either by its slug or by its name:
 *
 *   /api/baldurs-gate-iii
 *   /api/Baldur's Gate 3
 *
 * The name is there so a streaming tool can send the current Twitch category
 * as it is, without knowing the slug. The slug is tried first. This route
 * takes the whole rest of the address, so a name with a slash in it, such as
 * "Fate/stay night", works too.
 *
 * Anything else is a 404 with an empty body. That covers an address
 * that matches no game, and a game with no entry in `deaths.json` yet. There
 * is no third value, so a caller only ever has to handle true, false, or no
 * answer.
 */
export const GET: APIRoute = ({ params }) => {
  const named = params.slug && decoded(params.slug);
  const game = findGame(named) ?? findGameByName(named);
  const canDie = game && canDieIn(game);
  if (canDie === undefined) return text(null, 404);
  return text(String(canDie));
};
