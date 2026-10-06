<!--
This template is for changes to the site itself: pages, design, the API or the
data sync. For adding or correcting a game's answer, use the default template.
-->

## What this changes

<!-- A sentence or two on what is different, and why. -->

## How to check it

<!-- The page or address to open, and what a reviewer should see there. -->

## Checklist

- [ ] `npm run build` passes
- [ ] The main list, a game page and `/api/game/<slug>` all still work
- [ ] Any new colour is a variable in `src/styles/theme.css`, not a fixed value in a page
- [ ] This does not change any answers in `src/data/deaths.json`. Those go in their own pull request, with a Game ID and a reason for each

<!--
If this changes what counts as a death, say so plainly above. The rule lives in
two places that must agree:

  src/components/DeathDefinition.astro   the wording visitors see
  src/lib/catalogue.ts                   the rule beside the code, for maintainers
-->
