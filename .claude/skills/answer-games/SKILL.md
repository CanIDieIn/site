---
name: answer-games
description: Research and record whether you can die in games, in src/data/deaths.json. Use when asked to answer, check, or add games, to fill in the most popular games with no answer (such as "the top 1000"), to write or fix a game's reason, or to settle a borderline ruling.
---

# Answering games

Each answer in `src/data/deaths.json` is a yes or no, plus a one-line reason. It
shows on the game's page and in the API. The chat endpoint posts the reason
straight after "You are able to die in <game>.", so a bad reason ends up in
someone's Twitch chat.

## Before you start

Read these each time. They are the source of truth, and this skill does not
repeat them:

- **The rulings**: the comment above `canDieIn` in `src/lib/catalogue.ts`. It
  covers knockouts, game overs with no character, vehicles, units, rounds, card
  games and story deaths. The test is "would it make a fun moment to call this
  a death?"
- **The entry format**: the comment above `type Verdict` in the same file.

## Workflow

1. **Find the gaps.** Run this from the repository root:

   ```
   node .claude/skills/answer-games/scripts/find-missing.mjs --top 1000
   ```

   This uses the site's "most popular" order. Games with no popularity score are
   never in the top N.

2. **Leave existing answers alone.** Don't re-judge a game that already has a
   `true` or `false` unless asked. Only games with no entry are in scope.

3. **Research each game.** Find evidence of what actually happens, not what the
   genre suggests:
   - Search the web for the game's name with "Steam", or with "can you die",
     "game over", "respawn" or "permadeath". Use an extended search for niche or
     very new games.
   - Read the Steam store page, Steam guides and discussions, the developer's
     own pages, fan wikis, reviews and walkthroughs.
   - IGDB game pages refuse automated fetches (403). Get IGDB's description
     from search results instead. The same goes for some APK and mobile store
     mirrors.
   - Many top-1000 games are small or odd: fan games, browser sites, Twitch
     chat games, mobile merge games. Work out what the thing is before judging
     it.

4. **Check precedent.** Before deciding a borderline case, look at how similar
   games were ruled and worded:

   ```
   node .claude/skills/answer-games/scripts/find-missing.mjs --like "tower defense|bloons"
   ```

   Match the existing answer for the same kind of game. For example, a sunk
   warship is a yes (World of Warships), and Tetris topping out is a yes.

5. **Leave a game out when unsure.** A game with no entry shows as "Unsure",
   which is honest. Never guess from the genre or the title. Leaving a game out
   with a note is better than a wrong answer.

6. **Write the entries.** Put the new entries in a JSON file in the scratchpad,
   then run:

   ```
   node .claude/skills/answer-games/scripts/add-answers.mjs <file>
   ```

   The script refuses ids that already have an answer (use `--replace` only when
   asked to fix one), ids missing from `games.json`, long reasons, and reasons
   that don't end in a full stop. It keeps the file's order and formatting.

7. **Report back.** For each game, give its rank, name, answer and the evidence
   behind it, with source links. Say which calls are weakest and why, and list
   the games you left out.

## Writing the reason

Look at a few existing reasons before writing new ones. The house style:

- **One sentence, occasionally two.** About 60 characters is typical, and stay
  under 100, joke included.
- **Don't repeat the game's name or the answer.** The page and chat already say
  them. Start with who or what: the hero's name ("Garrett can be killed…"),
  "Your ship…", "Zombies…", "Let the blocks reach the top…".
- **Say what kills you, and what happens next**: you reload a save, respawn,
  lose the run, or are taken out of the match.
- **For a no, say what kind of game it is and what happens instead**: "A racing
  game. Crashes cost you time, and nothing can kill you." or "A dress-up game
  with nothing that can die."
- **Only state what a source supports.** If a guide says you can die but not who
  dies, don't name the character.
- **A joke is welcome.** A reason gets read out in Twitch chat, so a little wit
  is better than a dry summary, in the same spirit as the non-game category
  lines in `src/i18n/chat.ts`. The fact still comes first: someone who has
  never played should come away knowing what kills you, or why nothing can.
  - "Garrett can be killed by guards and falls. Mostly falls."
  - "A cosy farming game. The crops die if you forget them, but you won't."
  - Keep jokes about the game, not about players or streamers. Leave the joke
    out when the deaths are real-world or grim, for example in war or
    tragedy games.
- **British spelling** ("armoured", "desynchronisation") and plain words.

`reason` is always English. Only add translations in `reasons` when asked. When
you do, the chat API uses them for that language, and leaves the reason off
for any language that has none.

## Not games

Twitch categories that are not games, such as Just Chatting or IRL, are listed
in `src/lib/categories.ts` and never get an answer. If a "game" in the list is
really one of these, leave it out and say so.
