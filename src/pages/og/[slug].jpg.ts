import type { APIRoute } from "astro";
import sharp from "sharp";
import stampNo from "../../assets/og/stamp-no.png?inline";
import stampUnsure from "../../assets/og/stamp-unsure.png?inline";
import stampYes from "../../assets/og/stamp-yes.png?inline";
import { canDieIn, findGame, type Game } from "../../lib/catalogue";

// The picture shown when a game's page is shared on social media or in a chat
// app: the game's artwork from IGDB, darkened, with the site's rubber stamp
// answer over the top. It lives at /og/<slug>.jpg and is drawn on request.
//
// The card carries no other text. The page's title, shown beside the picture
// wherever a link is shared, already says which game it is.
//
// Nothing here draws text, because a server may have no fonts. The stamps are
// finished images, made by scripts/make-og-assets.mjs.
export const prerender = false;

// The size every major platform expects for a large link preview.
const WIDTH = 1200;
const HEIGHT = 630;
const PAGE_COLOUR = "#121212";

// How much every card's image is blurred. Light enough that the game stays
// recognisable. It matches the light blur on the game pages' backdrops.
const BLUR = 4;

/** Turns one of the `?inline` imports above, a data address, back into image bytes. */
const bytes = (dataUrl: string) => Buffer.from(dataUrl.slice(dataUrl.indexOf(",") + 1), "base64");
const stamps = { yes: bytes(stampYes), no: bytes(stampNo), unsure: bytes(stampUnsure) };

// IGDB serves each image at several sizes, chosen by a name in the address.
const igdbImage = (size: string, id: string) =>
  `https://images.igdb.com/igdb/image/upload/t_${size}/${id}.jpg`;

/** Downloads an image, or returns nothing if IGDB is slow or the image is gone. */
const download = async (url: string) => {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!response.ok) return undefined;
    return Buffer.from(await response.arrayBuffer());
  } catch {
    return undefined;
  }
};

/** A black layer of the given strength, to darken artwork so the stamp stands out. */
const shade = (opacity: number) => ({
  input: {
    create: { width: WIDTH, height: HEIGHT, channels: 4 as const, background: { r: 0, g: 0, b: 0, alpha: opacity } },
  },
});

type Card = { image: Buffer; hasArtwork: boolean };

/** Draws the card for a game. `hasArtwork` is false when it had to fall back to a plain card. */
const drawCard = async (game: Game): Promise<Card> => {
  const answer = canDieIn(game);
  const stamp = stamps[answer === undefined ? "unsure" : answer ? "yes" : "no"];
  const { width: stampWidth = 820, height: stampHeight = 440 } = await sharp(stamp).metadata();
  const centred = { left: Math.round((WIDTH - stampWidth) / 2), top: Math.round((HEIGHT - stampHeight) / 2) };

  // The same image the game's page uses as its backdrop: official key art, or
  // the cover if there is none. Both get the same treatment, so every card is
  // drawn alike: the image filling the card, lightly blurred and darkened,
  // with the stamp in the middle. A portrait cover is the wrong shape for a
  // wide card, so only a band across its middle shows.
  const imageId = game.art ?? game.cover;
  const picture = imageId && (await download(igdbImage("1080p", imageId)));
  if (picture) {
    try {
      const image = await sharp(picture)
        .resize(WIDTH, HEIGHT, { fit: "cover" })
        .blur(BLUR)
        .composite([shade(0.45), { input: stamp, ...centred }])
        .jpeg({ quality: 82, mozjpeg: true })
        .toBuffer();
      return { image, hasArtwork: true };
    } catch {
      // Not a usable image. Fall through to the plain card.
    }
  }

  // No usable image: the stamp on the site's own dark background.
  const image = await sharp({ create: { width: WIDTH, height: HEIGHT, channels: 3, background: PAGE_COLOUR } })
    .composite([{ input: stamp, ...centred }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
  return { image, hasArtwork: false };
};

// Cards are kept in memory after first being drawn, so a link shared in a busy
// channel is only drawn once. The oldest are dropped once there are too many.
// A card is drawn again after a restart, which is also when answers change.
const MAX_CACHED = 300;
const cache = new Map<string, Card>();

export const GET: APIRoute = async ({ params }) => {
  const game = findGame(params.slug);
  if (!game) return new Response("not found", { status: 404 });

  let card = cache.get(game.slug);
  if (!card) {
    card = await drawCard(game);
    // A plain card for a game that should have artwork means the download
    // failed. Do not keep it, so the next request tries again.
    if (card.hasArtwork || !(game.art || game.cover)) {
      cache.set(game.slug, card);
      if (cache.size > MAX_CACHED) cache.delete(cache.keys().next().value!);
    }
  }

  return new Response(new Uint8Array(card.image), {
    headers: {
      "Content-Type": "image/jpeg",
      // Let browsers and platforms keep it for a day. Failed downloads are retried sooner.
      "Cache-Control": card.hasArtwork || !(game.art || game.cover) ? "public, max-age=86400" : "public, max-age=300",
    },
  });
};
