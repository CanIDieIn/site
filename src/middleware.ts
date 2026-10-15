import { defineMiddleware, sequence } from "astro:middleware";
import type { APIContext } from "astro";
import {
  DEFAULT_LOCALE,
  localeForCountry,
  localePath,
  preferredLocale,
  splitLocale,
  type Locale,
} from "./i18n/locales";
import { analytics } from "./lib/analytics";

// Where the visitor's language is remembered, and for how long.
const LOCALE_COOKIE = "locale";
const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // a year

/**
 * Remembers the language a request was answered in, when that is not what is
 * already remembered.
 *
 * Only writing it when it changes keeps `Set-Cookie` off nearly every
 * response, which matters in front of a cache: a CDN will not store a reply
 * that carries one.
 */
const remember = (context: APIContext, locale: Locale) => {
  if (context.cookies.get(LOCALE_COOKIE)?.value === locale) return;
  context.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: "lax",
    httpOnly: true,
    // The visitor reaches the proxy over HTTPS even where it speaks to this
    // server over HTTP, so the cookie is marked for HTTPS in production.
    secure: import.meta.env.PROD,
  });
};

/**
 * The language to send a first-time visitor to, or undefined to leave them in
 * English.
 *
 * What their browser asks for comes first, as it is what they chose. Where it
 * names none of the site's languages, and a proxy in front of us has said
 * which country the request came from, that is tried next. Cloudflare sends
 * the country as `CF-IPCountry`; with no such proxy the header is absent and
 * only the browser's own list is read.
 */
const wantedLocale = (request: Request): Locale | undefined =>
  preferredLocale(request.headers.get("accept-language")) ??
  localeForCountry(request.headers.get("cf-ipcountry"));

// Works out which language a request is for, from the code on the front of
// its address, and stores it in `Astro.locals.locale` for the page to use.
//
// A request for /fr/portal is then answered by the same page as /portal: the
// code is taken off and the request passed on. The visitor's address bar still
// shows /fr/portal. See src/i18n/locales.ts for how the addresses are laid out.
//
// An address with no language code is English, unless this is the visitor's
// first time here and their browser asks for a language the site is written
// in, in which case they are sent to it. See `negotiated` below.
const locale = defineMiddleware((context, next) => {
  const { locale, path, prefixed } = splitLocale(context.url.pathname);
  context.locals.locale = locale;
  // The address the visitor asked for, without its language code. Pages use
  // this to link to the same page in each other language.
  context.locals.path = path;

  // The API answers the same in every language, so it has one address and no
  // language of its own to remember.
  const isApi = path === "/api" || path.startsWith("/api/");
  if (isApi) {
    return prefixed
      ? context.redirect(`${path}${context.url.search}`, 301)
      : next();
  }

  if (!prefixed) {
    // Send a visitor who has not been here before to the language their
    // browser asks for. Only when they have no cookie yet: whatever language
    // they are served sets one, so anyone who then picks English from the menu
    // stays in English instead of being sent away again on the next click.
    const chosen = context.cookies.has(LOCALE_COOKIE);
    const wanted = chosen ? undefined : wantedLocale(context.request);
    if (
      wanted !== undefined &&
      wanted !== DEFAULT_LOCALE &&
      context.request.method === "GET"
    ) {
      remember(context, wanted);
      const response = context.redirect(
        `${localePath(wanted, path)}${context.url.search}`,
        302,
      );
      // This answer is for one visitor only: it is worked out from the
      // language their browser asks for, where they are, and whether they have
      // been here before.
      //
      // `Vary` says so, but Cloudflare honours `Vary` on `Accept-Encoding`
      // alone and would otherwise be free to hand this redirect to the next
      // person through. So the reply is also marked as never to be stored,
      // which every cache does obey.
      response.headers.set("Vary", "Accept-Language, Cookie");
      response.headers.set("Cache-Control", "private, no-store");
      return response;
    }
    remember(context, locale);
    return next();
  }

  remember(context, locale);

  // "/en" on its own is just the home page.
  if (locale === DEFAULT_LOCALE && path === "/")
    return context.redirect("/", 301);

  return next(
    new Request(
      new URL(`${path}${context.url.search}`, context.url),
      context.request,
    ),
  );
});

// Analytics comes first, so it sees each request as it arrived: the address
// with its language code, before the language work above takes it off again.
export const onRequest = sequence(analytics, locale);
