import type { APIContext } from "astro";
import { chatTextFor, notGameLine } from "../i18n/chat";
import { DEFAULT_LOCALE, isLocale, type Locale } from "../i18n/locales";
import { trackEvent } from "./analytics";
import {
  canDieIn,
  findGame,
  findGameByName,
  nameIn,
  reasonFor,
  type Game,
} from "./catalogue";
import { nonGameCategory, type Category } from "./categories";
import { githubUrl } from "./github";

// What the plain-text endpoints under src/pages/api share: how a reply is
// sent, how the game is read from the address, how a call is counted, and the
// sentence the chat endpoint posts.

export const plainText = (body: string | null, status = 200) =>
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

export type Lookup = {
  game: Game | undefined;
  canDie: boolean | undefined;
  /** The Twitch category, when the name is one that is not a game. */
  category: Category | undefined;
};

/**
 * The game a name or slug asks for, and whether you can die in it. The slug is
 * tried first. The name is there so a streaming tool can send the current
 * Twitch category as it is, without knowing the slug.
 *
 * A Twitch category that is not a game, such as "Just Chatting", is never
 * looked up as one. It is checked before the slug, so the game called "Crypto"
 * cannot be asked for at all, and "Sports!" only by its slug, sports--1.
 * Neither has a popularity score, so this costs very little.
 */
export const lookUp = (named: string | undefined): Lookup => {
  const category = nonGameCategory(named);
  const game = category
    ? undefined
    : (findGame(named) ?? findGameByName(named));
  return { game, canDie: game && canDieIn(game), category };
};

/**
 * Looks up the game named by the rest of the address, as `lookUp` does, and
 * counts the call as an "api" event in Umami, with what was asked for and what
 * it got. The address alone would say the first but not the second, and the
 * two together are what shows which games are being watched with no answer
 * written yet. `format` says which endpoint answered, and `lang` which
 * language a chat reply was in.
 *
 * `asked` is usually a Twitch category sent as it is by a stream bot, so it is
 * cut to a sensible length. `game` is missing when nothing matched it at all,
 * which tells a name the catalogue does not know from a game in it that nobody
 * has answered for.
 */
export const answerFor = (
  context: APIContext,
  format: "boolean" | "chat",
  locale?: Locale,
): Lookup => {
  const named = context.params.slug && decoded(context.params.slug);
  const found = lookUp(named);
  const { game, canDie, category } = found;

  trackEvent(context, "api", {
    asked: (named || "").slice(0, 100),
    answer: category
      ? "category"
      : canDie === undefined
        ? "unsure"
        : String(canDie),
    format,
    ...(locale ? { lang: locale } : {}),
    ...(game ? { game: game.slug } : {}),
  });

  return found;
};

/**
 * The language a chat reply is asked for in, from `?lang=`, such as `fr`.
 * Anything missing or unknown is English.
 */
export const chatLocale = (url: URL): Locale => {
  const asked = url.searchParams.get("lang")?.trim().toLowerCase();
  return isLocale(asked) ? asked : DEFAULT_LOCALE;
};

/**
 * The sentence the chat API posts for a lookup, in a language. The text is in
 * src/i18n/chat.ts. A Twitch category that is not a game gets a joke, picked at
 * random, so the same category can get a different reply each time.
 *
 * The game is named as it is in that language where it has a name in it. The
 * reason for the answer follows only when it is written in that language too,
 * as a French sentence followed by an English one reads worse in chat than the
 * answer on its own. Today every reason is in English, so only the English
 * replies have one.
 */
export const chatReply = (
  { game, canDie, category }: Lookup,
  locale: Locale,
): string => {
  const t = chatTextFor(locale);
  if (category) return notGameLine(t, category);
  if (!game || canDie === undefined) {
    return githubUrl ? `${t.unknown} ${githubUrl}` : t.unknown;
  }
  const name = nameIn(game, locale);
  const answer = canDie ? t.yes(name) : t.no(name);
  const reason = reasonFor(game, locale);
  return reason && reason.locale === locale
    ? `${answer} ${reason.text}`
    : answer;
};
