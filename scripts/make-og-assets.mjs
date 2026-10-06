// Draws the fixed pieces of the social media cards and saves them as images,
// once for each language the site is in:
//
//   src/assets/og/stamp-en-yes.png     the three rubber stamps, laid over each
//   src/assets/og/stamp-en-no.png      game's artwork by src/pages/og/[slug].jpg.ts
//   src/assets/og/stamp-en-unsure.png
//   src/assets/og/stamp-fr-yes.png     and the same for every other language
//   ...
//   public/og.jpg                      the card for pages that are not about one game
//   public/og-fr.jpg                   and the same for every other language
//   ...
//
// The words come from src/i18n/ui.ts, so the cards always say what the site
// says.
//
// Run it with `npm run og:assets`. It only needs running again if the look
// changes, and the results are committed like any other asset.
//
// WHY THIS IS DONE AHEAD OF TIME: drawing text needs a font, and a server
// often has none installed. Drawing these once, on a machine that has the
// font, means the server only ever layers finished images together.
//
// The font is Segoe UI, which comes with Windows, to match the site there. It
// has no Japanese, so Yu Gothic UI, also from Windows, is named after it and
// is used for any character Segoe UI lacks. On another system, change the
// fonts below to ones you have installed.
import fs from "node:fs";
import sharp from "sharp";
import { DEFAULT_LOCALE, LOCALES } from "../src/i18n/locales.ts";
import { uiFor } from "../src/i18n/ui.ts";

const FONT = "Segoe UI, Yu Gothic UI";
const HEAVY = "Segoe UI Black, Yu Gothic UI";

// The answer colours, taken from the dark theme in src/styles/theme.css. The
// dark theme's colours are the bright ones, which show up over artwork.
const COLOURS = { yes: "#ff8f85", no: "#6fd39a", unsure: "#d0d0d0" };
const PAGE = "#121212";
const TEXT = "#f2f2f2";

const WIDTH = 1200;
const HEIGHT = 630;

// How wide a character is, as a share of the font size. Latin capitals in the
// heavy font are about two thirds of it. Japanese characters are square.
const charWidth = (char) => (char.charCodeAt(0) > 0x2e7f ? 1 : 0.66);

/** A stamp as SVG: a word in capitals inside a heavy box, tilted. */
const stampSvg = ({ word, colour, tilt, fontSize, boxWidth, dashed }) => {
  // Yu Gothic UI has no weight as heavy as Segoe UI Black. Japanese words get
  // an outline in their own colour, which thickens each stroke to match.
  const thicken = [...word].some((char) => charWidth(char) === 1)
    ? `stroke="${colour}" stroke-width="${Math.round(fontSize * 0.045)}" stroke-linejoin="round"`
    : "";
  const w = 820;
  const h = 440;
  const boxHeight = 290;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <g transform="rotate(${tilt} ${w / 2} ${h / 2})">
    <!-- A dark tint inside the box. Without it the word can vanish over bright artwork: its contrast
         could fall to 1.5 to 1. With it the worst case is above 5 to 1, measured over pure white. -->
    <rect x="${(w - boxWidth) / 2}" y="${(h - boxHeight) / 2}" width="${boxWidth}" height="${boxHeight}" rx="16"
      fill="#000000" fill-opacity="0.6"/>
    <rect x="${(w - boxWidth) / 2}" y="${(h - boxHeight) / 2}" width="${boxWidth}" height="${boxHeight}" rx="16"
      fill="none" stroke="${colour}" stroke-width="24" ${dashed ? 'stroke-dasharray="46 26"' : ""}/>
    <text x="${w / 2}" y="${h / 2 + fontSize * 0.355}" text-anchor="middle" font-family="${HEAVY}" font-weight="900"
      font-size="${fontSize}" fill="${colour}" letter-spacing="-3" ${thicken}>${word}</text>
  </g>
</svg>`;
};

/** Renders SVG to a PNG with a soft dark shadow behind it, so it reads over any artwork. */
const withShadow = async (svg, blur = 10) => {
  const shape = await sharp(Buffer.from(svg)).png().toBuffer();
  // The shadow is the same drawing in black, minus any filled areas. Leaving the
  // tint in would stack shadow on top of it and turn the inside solid black.
  const outline = svg
    .replace(/<rect[^>]*fill-opacity[^>]*>/g, "")
    .replace(/#[0-9a-f]{6}/gi, "#000000");
  const shadow = await sharp(Buffer.from(outline))
    .blur(blur)
    .png()
    .toBuffer();
  return sharp(shadow)
    .composite([
      { input: shadow, blend: "over" },
      { input: shape, blend: "over" },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();
};

// How each kind of stamp looks, whatever word is on it.
const styles = {
  yes: { colour: COLOURS.yes, tilt: -4 },
  no: { colour: COLOURS.no, tilt: 3 },
  unsure: { colour: COLOURS.unsure, tilt: -2, dashed: true },
};

/**
 * Sizes a stamp to its word: as big as the tallest stamp allows, shrunk until
 * the word fits across the picture, with the box drawn to match.
 */
const fitted = (word) => {
  const units = [...word].reduce((sum, char) => sum + charWidth(char), 0);
  const fontSize = Math.round(Math.min(250, 660 / units));
  const boxWidth = Math.round(Math.min(770, units * fontSize + 150));
  return { fontSize, boxWidth };
};

fs.mkdirSync("src/assets/og", { recursive: true });
// Clear out stamps from earlier runs, such as those of a language since removed.
for (const file of fs.readdirSync("src/assets/og")) {
  if (/^stamp-.*\.png$/.test(file)) fs.rmSync(`src/assets/og/${file}`);
}
for (const locale of LOCALES) {
  const { answers } = uiFor(locale);
  for (const [name, style] of Object.entries(styles)) {
    const word = answers[name].toLocaleUpperCase(locale);
    const file = `src/assets/og/stamp-${locale}-${name}.png`;
    fs.writeFileSync(file, await withShadow(stampSvg({ word, ...style, ...fitted(word) })));
    console.log("wrote", file);
  }
}

/** Escapes the characters that mean something in SVG. */
const escaped = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;");

// The card for the main list and any other page that is not about one game.
for (const locale of LOCALES) {
  const { siteName, tagline } = uiFor(locale);
  // A long name is set smaller so it stays inside the card.
  const nameSize = Math.round(Math.min(118, 1560 / [...siteName].reduce((sum, char) => sum + charWidth(char), 0)));
  const defaultSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <radialGradient id="wash" cx="50%" cy="0%" r="75%">
      <stop offset="0%" stop-color="${COLOURS.yes}" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="${COLOURS.yes}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${PAGE}"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#wash)"/>
  <text x="${WIDTH / 2}" y="300" text-anchor="middle" font-family="${FONT}" font-weight="600" font-size="${nameSize}"
    fill="${TEXT}" letter-spacing="-3">${escaped(siteName)}</text>
  <text x="${WIDTH / 2}" y="392" text-anchor="middle" font-family="${FONT}" font-weight="400" font-size="40"
    fill="#b8b8b8">${escaped(tagline)}</text>
</svg>`;
  const file = locale === DEFAULT_LOCALE ? "public/og.jpg" : `public/og-${locale}.jpg`;
  await sharp(Buffer.from(defaultSvg)).jpeg({ quality: 88, mozjpeg: true }).toFile(file);
  console.log("wrote", file);
}
