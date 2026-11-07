import type { APIRoute } from "astro";
import { answerFor, chatLocale, chatReply, plainText } from "../../../lib/api";

// Answered per request, like the true/false API beside it.
export const prerender = false;

/**
 * The answer as a sentence, ready for a chat bot to post as it is:
 *
 *   /api/chat/baldurs-gate-iii
 *   → You are able to die in Baldur's Gate III. Characters can be killed…
 *   /api/chat/baldurs-gate-iii?lang=fr
 *   → Vous pouvez mourir dans Baldur's Gate III.
 *
 * The game is named the same way as for /api/<game>, by slug or by name.
 * No game in the catalogue is called "chat", so this address takes nothing
 * away from that one. `?lang=` takes any of the site's language codes, and
 * the reply is in English without one. See `chatReply` for what is said.
 *
 * Every reply is a 200, including the one for a game with no answer yet, a
 * Twitch category that is not a game, or a name that matches no game, as some
 * bots post an error rather than the body of a 404.
 */
export const GET: APIRoute = (context) => {
  const locale = chatLocale(context.url);
  return plainText(chatReply(answerFor(context, "chat", locale), locale));
};
