import { defineMiddleware } from "astro:middleware";
import { DEFAULT_LOCALE, splitLocale } from "./i18n/locales";

// Works out which language a request is for, from the code on the front of
// its address, and stores it in `Astro.locals.locale` for the page to use.
//
// A request for /fr/portal is then answered by the same page as /portal: the
// code is taken off and the request passed on. The visitor's address bar still
// shows /fr/portal. See src/i18n/locales.ts for how the addresses are laid out.
export const onRequest = defineMiddleware((context, next) => {
  const { locale, path, prefixed } = splitLocale(context.url.pathname);
  context.locals.locale = locale;
  // The address the visitor asked for, without its language code. Pages use
  // this to link to the same page in each other language.
  context.locals.path = path;
  if (!prefixed) return next();

  // The API answers the same in every language, so it has one address.
  if (path === "/api" || path.startsWith("/api/")) {
    return context.redirect(`${path}${context.url.search}`, 301);
  }
  // "/en" on its own is just the home page.
  if (locale === DEFAULT_LOCALE && path === "/") return context.redirect("/", 301);

  return next(new Request(new URL(`${path}${context.url.search}`, context.url), context.request));
});
