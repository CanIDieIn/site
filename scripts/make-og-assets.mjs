// Draws the fixed pieces of the social media cards and saves them as images:
//
//   src/assets/og/stamp-yes.png      the three rubber stamps, laid over each
//   src/assets/og/stamp-no.png       game's artwork by src/pages/og/[slug].jpg.ts
//   src/assets/og/stamp-unsure.png
//   public/og.jpg                    the card for pages that are not about one game
//
// Run it with `npm run og:assets`. It only needs running again if the look
// changes, and the results are committed like any other asset.
//
// WHY THIS IS DONE AHEAD OF TIME: drawing text needs a font, and a server
// often has none installed. Drawing these once, on a machine that has the
// font, means the server only ever layers finished images together.
//
// The font is Segoe UI, which comes with Windows, to match the site there. On
// another system, change FONT below to a heavy font you have installed.
import fs from "node:fs";
import sharp from "sharp";

const FONT = "Segoe UI";
const HEAVY = "Segoe UI Black";

// The answer colours, taken from the dark theme in src/styles/theme.css. The
// dark theme's colours are the bright ones, which show up over artwork.
const COLOURS = { yes: "#ff8f85", no: "#6fd39a", unsure: "#d0d0d0" };
const PAGE = "#121212";
const TEXT = "#f2f2f2";

const WIDTH = 1200;
const HEIGHT = 630;

/** A stamp as SVG: a word in capitals inside a heavy box, tilted. */
const stampSvg = ({ word, colour, tilt, fontSize, boxWidth, dashed }) => {
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
      font-size="${fontSize}" fill="${colour}" letter-spacing="-3">${word}</text>
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

const stamps = {
  yes: { word: "YES", colour: COLOURS.yes, tilt: -4, fontSize: 250, boxWidth: 600 },
  no: { word: "NO", colour: COLOURS.no, tilt: 3, fontSize: 250, boxWidth: 500 },
  unsure: { word: "UNSURE", colour: COLOURS.unsure, tilt: -2, fontSize: 150, boxWidth: 720, dashed: true },
};

fs.mkdirSync("src/assets/og", { recursive: true });
for (const [name, options] of Object.entries(stamps)) {
  const file = `src/assets/og/stamp-${name}.png`;
  fs.writeFileSync(file, await withShadow(stampSvg(options)));
  console.log("wrote", file);
}

// The card for the main list and any other page that is not about one game.
const defaultSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <radialGradient id="wash" cx="50%" cy="0%" r="75%">
      <stop offset="0%" stop-color="${COLOURS.yes}" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="${COLOURS.yes}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${PAGE}"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#wash)"/>
  <text x="${WIDTH / 2}" y="300" text-anchor="middle" font-family="${FONT}" font-weight="600" font-size="118"
    fill="${TEXT}" letter-spacing="-3">Can I Die In...</text>
  <text x="${WIDTH / 2}" y="392" text-anchor="middle" font-family="${FONT}" font-weight="400" font-size="40"
    fill="#b8b8b8">Find out whether a game can kill you.</text>
</svg>`;
await sharp(Buffer.from(defaultSvg)).jpeg({ quality: 88, mozjpeg: true }).toFile("public/og.jpg");
console.log("wrote public/og.jpg");
