import type { APIRoute } from "astro";
import { canDieIn, findGame } from "../../../lib/catalogue";

// Answered per request, so no file is built for each of the 225,000 games.
export const prerender = false;

const text = (body: string, status = 200) =>
  new Response(body, {
    status,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      // Lets browser-based tools, such as stream overlays, call this too.
      "Access-Control-Allow-Origin": "*",
    },
  });

/**
 * Plain-text answer for tools such as Streamer.bot: `true` if you can die in
 * the game, `false` if not.
 *
 * Anything else is a 404 with the body `not found`. That covers a slug that
 * matches no game, and a game with no entry in `deaths.json` yet. There is no
 * third value, so a caller only ever has to handle true, false, or no answer.
 */
export const GET: APIRoute = ({ params }) => {
  const game = findGame(params.slug);
  const canDie = game && canDieIn(game);
  if (canDie === undefined) return text("not found", 404);
  return text(String(canDie));
};
