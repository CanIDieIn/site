import type { APIContext } from "astro";
import { defineMiddleware } from "astro:middleware";
import { Umami, type UmamiEventData, type UmamiPayload } from "@umami/node";

// How the site is measured: every page view is reported from the server to
// Umami, and nothing at all is measured in the visitor's browser. No script is
// sent to the page and no cookie is set.
//
// Counting here rather than in the browser is what lets the plain-text API be
// counted at all. A stream bot asking /api/<game> runs no JavaScript, so a
// browser-based counter would never see the busiest part of the site. Its
// calls are reported as events rather than page views, with the game that was
// asked for and the answer it got: see src/pages/api/[...slug].ts.
//
// TO SWITCH IT ON: put both of these in .env. Until both are set every call
// below quietly does nothing, so the site runs exactly as it did before.
//
//   UMAMI_WEBSITE_ID   the website's id in Umami, from its settings page
//   UMAMI_HOST_URL     where Umami itself lives, such as https://cloud.umami.is
//
// A value in the real environment is preferred to one in .env, so a deployed
// site can be pointed at another Umami without being built again.

const setting = (environment: string | undefined, file: string | undefined) =>
  (environment ?? file ?? "").trim();

const websiteId = setting(
  process.env.UMAMI_WEBSITE_ID,
  import.meta.env.UMAMI_WEBSITE_ID,
);
// Umami's own address, with any trailing slash taken off: the client below
// adds the rest of the path itself.
const hostUrl = setting(
  process.env.UMAMI_HOST_URL,
  import.meta.env.UMAMI_HOST_URL,
).replace(/\/+$/, "");

const enabled = Boolean(websiteId && hostUrl);

// Umami is told about a request after the answer has already been sent, and a
// report that fails is never retried: analytics must not slow a page down or
// break it. A broken setting would otherwise say so on every single request,
// so the first failure is reported and the rest are kept quiet.
let complained = false;
const complain = (reason: unknown) => {
  if (complained) return;
  complained = true;
  console.warn(
    `[analytics] Umami at ${hostUrl} did not accept a report. Further failures will not be mentioned.`,
    reason,
  );
};

/**
 * The visitor's most preferred language, such as "en-GB", for Umami's
 * languages report. This is what their browser asks for, which is not always
 * the language of the page they are reading.
 */
const languageOf = (request: Request) => {
  const preferred = (request.headers.get("accept-language") ?? "")
    .split(",")[0]
    .split(";")[0]
    .trim();
  // "*" means the browser has no preference, which is not a language.
  return preferred && preferred !== "*" ? preferred : undefined;
};

/**
 * The address the visitor's request came from.
 *
 * A site behind a proxy or a CDN is reached by that proxy and not by the
 * visitor, so the visitor's own address arrives in a header instead. Astro only
 * trusts those headers when the site lists its own domains in `allowedDomains`,
 * which this one does not, so they are read here. Where there are none, the
 * request came straight from the visitor and its own address is the right one.
 *
 * Nothing here decides what a visitor is allowed to do, so a forged header can
 * do no more than add a visit that never happened, which is as true of any
 * counter that runs in the browser.
 */
const addressOf = (context: APIContext) => {
  const { headers } = context.request;
  const forwarded =
    // One address, set by the CDN or proxy the site sits behind.
    headers.get("cf-connecting-ip") ??
    headers.get("true-client-ip") ??
    headers.get("x-real-ip") ??
    // A list: the visitor, then each proxy that passed the request on.
    headers.get("x-forwarded-for")?.split(",")[0];
  if (forwarded?.trim()) return forwarded.trim();
  try {
    return context.clientAddress || undefined;
  } catch {
    // Only a page built ahead of time has no address to give, and every page
    // here is drawn per request. The report is still worth sending without it.
    return undefined;
  }
};

/**
 * Reports one page view or event to Umami, and returns at once without waiting
 * for it to arrive.
 */
const report = (context: APIContext, hit: Partial<UmamiPayload>) => {
  if (!enabled) return;
  const { request, url } = context;

  // Umami works out the browser, operating system and device from the user
  // agent, and also uses it to leave bots out of the figures, so the visitor's
  // own is passed on.
  //
  // A client of its own per request, because the user agent belongs to the
  // request and a shared one would hand it to whichever request came next.
  const client = new Umami({
    hostUrl,
    websiteId,
    userAgent: request.headers.get("user-agent") ?? undefined,
  });

  client
    .track({
      // Reports arrive from the server here, not from the visitor's browser,
      // so unless Umami is told whose visit this is it reads every one as
      // coming from the server itself: one country for the whole world, and
      // everybody using the same browser counted as a single visitor, since it
      // tells visitors apart by their address and browser together.
      //
      // Given an address, Umami works out the country from that instead, and
      // ignores any header a CDN of its own has added. It keeps the country,
      // not the address. The client's own types do not list this field, but it
      // is the one Umami prefers above all the others it looks in.
      ip: addressOf(context),
      hostname: url.hostname,
      // The address as asked for, query string and all, so a search or a sort
      // shows up in the report as well as the page it was made on.
      url: `${url.pathname}${url.search}`,
      referrer: request.headers.get("referer") ?? undefined,
      language: languageOf(request),
      ...hit,
    })
    .then((response) => {
      if (!response.ok) complain(`${response.status} ${response.statusText}`);
    }, complain);
};

/**
 * Reports something a visitor did beyond reading a page, such as a call to the
 * API, under `name`, with whatever else is worth knowing about it in `data`.
 * Each entry in `data` becomes a property to group that event by in Umami.
 */
export const trackEvent = (
  context: APIContext,
  name: string,
  data?: UmamiEventData,
) => report(context, { name, data });

/**
 * Reports a page view for every page the site draws.
 *
 * This runs around the rest of the middleware, so the address recorded is the
 * one the visitor asked for, language code and all: /fr/portal is reported as
 * /fr/portal and not as the /portal page that answers it.
 *
 * A page is anything the site answers with as HTML, which includes the page
 * for a game it does not have: those show which games people expect it to know
 * about. Nothing else counts as a page view. The API reports its own calls,
 * with more about each one than an address could say, and a social media card,
 * a stylesheet, a picture or a redirect is not something anybody reads.
 */
export const analytics = defineMiddleware(async (context, next) => {
  const response = await next();
  if (!enabled || context.request.method !== "GET") return response;
  const type = response.headers.get("content-type") ?? "";
  if (!type.startsWith("text/html")) return response;
  // The page's own title, which the layout leaves in `locals` as it draws, so
  // the report names the page the way the visitor saw it.
  report(context, { title: context.locals.title });
  return response;
});
