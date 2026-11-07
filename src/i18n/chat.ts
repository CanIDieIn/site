import type { Locale } from "./locales";

// The sentences the chat API, src/pages/api/chat/[...slug].ts, posts into a
// stream's chat, in each language. They are asked for with `?lang=` and are in
// English otherwise. The rest of the site's text is in ui.ts beside this file.
//
// Each is posted on its own, so each is a whole sentence. `name` is the game's
// name in that language where it has one, and `category` is a Twitch category
// as the bot sent it. The link to GitHub, when there is one, is put after
// `unknown` by the API, so it is not part of the text here.

const en = {
  yes: (name: string) => `You are able to die in ${name}.`,
  no: (name: string) => `You are not able to die in ${name}.`,
  unknown: "We don't know if you can die in this game, let us know on GitHub!",
  notGame: (category: string) =>
    `${category} isn't a game, so there's no answer for it.`,
};

export type ChatText = typeof en;

const chat: Record<Locale, ChatText> = {
  en,
  fr: {
    yes: (name) => `Vous pouvez mourir dans ${name}.`,
    no: (name) => `Vous ne pouvez pas mourir dans ${name}.`,
    unknown:
      "Nous ne savons pas si l'on peut mourir dans ce jeu, dites-le-nous sur GitHub !",
    notGame: (category) =>
      `${category} n'est pas un jeu, donc il n'y a pas de réponse.`,
  },
  es: {
    yes: (name) => `Puedes morir en ${name}.`,
    no: (name) => `No puedes morir en ${name}.`,
    unknown:
      "No sabemos si se puede morir en este juego, ¡cuéntanoslo en GitHub!",
    notGame: (category) =>
      `${category} no es un juego, así que no hay respuesta.`,
  },
  de: {
    yes: (name) => `Du kannst in ${name} sterben.`,
    no: (name) => `Du kannst in ${name} nicht sterben.`,
    unknown:
      "Wir wissen nicht, ob man in diesem Spiel sterben kann. Sag es uns auf GitHub!",
    notGame: (category) =>
      `${category} ist kein Spiel, daher gibt es keine Antwort.`,
  },
  ja: {
    yes: (name) => `${name}では死ぬことがあります。`,
    no: (name) => `${name}では死ぬことはありません。`,
    unknown:
      "このゲームで死ぬことがあるかはまだわかりません。GitHubで教えてください！",
    notGame: (category) =>
      `${category}はゲームではないため、答えはありません。`,
  },
  ko: {
    yes: (name) => `${name}에서는 죽을 수 있습니다.`,
    no: (name) => `${name}에서는 죽지 않습니다.`,
    unknown: "이 게임에서 죽을 수 있는지 아직 모릅니다. GitHub에서 알려주세요!",
    notGame: (category) => `${category}은(는) 게임이 아니라서 답이 없습니다.`,
  },
  zh: {
    yes: (name) => `《${name}》里会死。`,
    no: (name) => `《${name}》里不会死。`,
    unknown: "我们还不知道这款游戏里会不会死，请在 GitHub 上告诉我们！",
    notGame: (category) => `“${category}”不是游戏，所以没有答案。`,
  },
  it: {
    yes: (name) => `In ${name} puoi morire.`,
    no: (name) => `In ${name} non puoi morire.`,
    unknown:
      "Non sappiamo se in questo gioco si può morire, faccelo sapere su GitHub!",
    notGame: (category) =>
      `${category} non è un gioco, quindi non c'è una risposta.`,
  },
  ru: {
    yes: (name) => `В ${name} можно умереть.`,
    no: (name) => `В ${name} нельзя умереть.`,
    unknown:
      "Мы пока не знаем, можно ли умереть в этой игре. Напишите нам на GitHub!",
    notGame: (category) => `${category} — не игра, поэтому ответа нет.`,
  },
  ar: {
    yes: (name) => `يمكنك أن تموت في ${name}.`,
    no: (name) => `لا يمكنك أن تموت في ${name}.`,
    unknown: "لا نعرف إن كان يمكن الموت في هذه اللعبة، أخبرنا على GitHub!",
    notGame: (category) => `${category} ليست لعبة، لذلك لا توجد إجابة.`,
  },
};

export const chatTextFor = (locale: Locale): ChatText => chat[locale];
