<!--
Thanks for helping out.

This template is for adding or correcting a game's answer in src/data/deaths.json.
Changing the site itself instead? Add ?template=site_change.md to the end of this
page's address to get the right template.
-->

## What this changes

<!-- Tick one. Put an x between the brackets: [x] -->

- [ ] Adds an answer for a game that currently shows **Unsure**
- [ ] Corrects an existing answer or reason

## The games

<!--
One row per game. The Game ID is on the game's page, in the line that says
"This is game ID 1234". It is the number IGDB gives the game, and it is how the
site tells apart games that share a name.
-->

| Game ID | Game | Can you die? | Reason |
| ------- | ---- | ------------ | ------ |
|         |      | Yes / No     |        |

## How do you know?

<!--
Tell us you have played it, or link to something that shows it: a wiki page, a
clip or a review. One line is plenty.
-->

## What counts as dying?

Your character is killed or knocked out, or you lose a whole run. Crashing in a race or losing a match on points doesn't count.

For borderline games, the rulings are listed beside `canDieIn` in `src/lib/catalogue.ts`.

## Checklist

- [ ] Each entry uses the game's **Game ID** as its key, not its name
- [ ] Each entry has both `"deaths"` (`true` or `false`) and a `"reason"`
- [ ] Each reason says what actually happens in the game, in one or two short sentences
- [ ] Each reason would make sense to someone who has never played the game
- [ ] The file is formatted with Prettier, which also keeps the entries in Game ID order

<!--
For reference, an entry looks like this:

  "311949": {
    "deaths": true,
    "reason": "Turrets, toxic goo, long falls and neurotoxin can all kill you."
  }
-->
