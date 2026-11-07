import type { Category } from "../lib/categories";
import type { Locale } from "./locales";

// The sentences the chat API, src/pages/api/chat/[...slug].ts, posts into a
// stream's chat, in each language. They are asked for with `?lang=` and are in
// English otherwise. The rest of the site's text is in ui.ts beside this file.
//
// Each is posted on its own, so each is a whole sentence. `name` is the game's
// name in that language where it has one, and `category` is a Twitch category
// as Twitch writes it. The link to GitHub, when there is one, is put after
// `unknown` by the API, so it is not part of the text here.
//
// A Twitch category that is not a game, such as "Just Chatting", gets a joke
// rather than an answer. One is picked at random each time, from the
// category's own lines in `notGame.byCategory` when the language has some, and
// from `notGame.any` otherwise. Keep them short and kind to the streamer. Add
// as many as you like.

type NotGame = {
  /** Lines for any category, which is passed in. */
  any: ((category: string) => string)[];
  /** Lines for one category, which name it themselves or need not. */
  byCategory: Partial<Record<Category, string[]>>;
};

const en = {
  yes: (name: string) => `You are able to die in ${name}.`,
  no: (name: string) => `You are not able to die in ${name}.`,
  unknown: "We don't know if you can die in this game, let us know on GitHub!",
  notGame: {
    any: [
      (category) =>
        `Nothing dies in ${category}, except maybe the conversation.`,
      (category) =>
        `No deaths in ${category}. The death counter gets the day off.`,
      (category) => `Nobody has ever died in ${category}. We checked.`,
    ],
    byCategory: {
      "Just Chatting": [
        "The only thing that can die in Just Chatting is chat.",
        "No deaths in Just Chatting, though the vibes might.",
        "Just Chatting has no game over. It just keeps going.",
      ],
      IRL: [
        "IRL? Yes, you can die. No respawns, so please don't.",
        "IRL has permadeath and no save files. Play carefully.",
      ],
      Art: [
        "Only the eraser dies in Art.",
        "No deaths in Art. Your motivation, on the other hand…",
      ],
      Music: [
        "Nothing dies in Music, though that high note came close.",
        "The only thing getting killed in Music is the beat.",
      ],
      ASMR: ["Nobody dies in ASMR. Falling asleep doesn't count."],
      "Talk Shows & Podcasts": ["Only the mic battery dies on a podcast."],
      Sports: ["No death counter for Sports. Stretch first anyway."],
      "Travel & Outdoors": ["No health packs out there. Stay hydrated."],
      "Food & Drink": [
        "Food comas don't count as deaths.",
        "Your diet might not survive Food & Drink.",
      ],
      "Special Events": ["Nobody dies at Special Events. Enjoy the show!"],
      "Science & Technology": [
        "Can you die in Science & Technology? Please don't test that.",
      ],
      "Software and Game Development": [
        "Your code crashes enough for both of you.",
        "Not a game yet. Give it a few more sprints.",
      ],
      "Makers & Crafting": ["Nothing dies here. Mind the hot glue gun."],
      "Beauty & Body Art": ["No deaths here, though that eyeliner is killer."],
      "Fitness & Health": ["Leg day only feels like dying."],
      "Pools, Hot Tubs, and Beaches": [
        "No deaths at the pool. Wear sunscreen anyway.",
      ],
      Politics: ["Politics isn't a game, whatever the comments say."],
      "Animals, Aquariums, and Zoos": [
        "Everyone survives this one. Especially the otters.",
      ],
      "Co-working & Studying": ["Exams only feel like dying."],
      "Writing & Reading": ["Only the characters die in Writing & Reading."],
      "Games + Demos": [
        "Games + Demos could be anything. Try the game's own name.",
      ],
      "Always On": ["Always On never stops, so it can't die."],
      Crypto: ["The only thing that can die in Crypto is your portfolio."],
    },
  } as NotGame,
};

export type ChatText = typeof en;

// Every other language has its own lines for IRL, as it is the one category
// where you really can die, so the general lines would be wrong for it.
const chat: Record<Locale, ChatText> = {
  en,
  fr: {
    yes: (name) => `Vous pouvez mourir dans ${name}.`,
    no: (name) => `Vous ne pouvez pas mourir dans ${name}.`,
    unknown:
      "Nous ne savons pas si l'on peut mourir dans ce jeu, dites-le-nous sur GitHub !",
    notGame: {
      any: [
        (category) =>
          `Rien ne meurt dans ${category}, sauf peut-être la conversation.`,
        (category) =>
          `Aucune mort dans ${category}. Le compteur de morts prend sa journée.`,
        (category) =>
          `Personne n'est jamais mort dans ${category}. Nous avons vérifié.`,
      ],
      byCategory: {
        IRL: [
          "IRL ? Là, oui, on peut mourir. Pas de sauvegarde, alors prudence.",
        ],
      },
    },
  },
  es: {
    yes: (name) => `Puedes morir en ${name}.`,
    no: (name) => `No puedes morir en ${name}.`,
    unknown:
      "No sabemos si se puede morir en este juego, ¡cuéntanoslo en GitHub!",
    notGame: {
      any: [
        (category) => `Nada muere en ${category}, salvo quizá la conversación.`,
        (category) =>
          `Ninguna muerte en ${category}. El contador de muertes se toma el día libre.`,
        (category) =>
          `Nadie ha muerto nunca en ${category}. Lo hemos comprobado.`,
      ],
      byCategory: {
        IRL: [
          "¿IRL? Ahí sí puedes morir, y no hay partidas guardadas. Cuidado.",
        ],
      },
    },
  },
  de: {
    yes: (name) => `Du kannst in ${name} sterben.`,
    no: (name) => `Du kannst in ${name} nicht sterben.`,
    unknown:
      "Wir wissen nicht, ob man in diesem Spiel sterben kann. Sag es uns auf GitHub!",
    notGame: {
      any: [
        (category) =>
          `In ${category} stirbt nichts, außer vielleicht das Gespräch.`,
        (category) =>
          `Keine Tode in ${category}. Der Todeszähler hat heute frei.`,
        (category) =>
          `In ${category} ist noch nie jemand gestorben. Wir haben nachgesehen.`,
      ],
      byCategory: {
        IRL: [
          "IRL? Da kannst du wirklich sterben, und Spielstände gibt es keine.",
        ],
      },
    },
  },
  ja: {
    yes: (name) => `${name}では死ぬことがあります。`,
    no: (name) => `${name}では死ぬことはありません。`,
    unknown:
      "このゲームで死ぬことがあるかはまだわかりません。GitHubで教えてください！",
    notGame: {
      any: [
        (category) => `${category}で死ぬものはありません。会話以外は。`,
        (category) =>
          `${category}に死亡はありません。死亡カウンターは今日はお休みです。`,
        (category) => `${category}で死んだ人はいません。確認済みです。`,
      ],
      byCategory: {
        IRL: [
          "IRL？そこでは本当に死ねますし、セーブもありません。お気をつけて。",
        ],
      },
    },
  },
  ko: {
    yes: (name) => `${name}에서는 죽을 수 있습니다.`,
    no: (name) => `${name}에서는 죽지 않습니다.`,
    unknown: "이 게임에서 죽을 수 있는지 아직 모릅니다. GitHub에서 알려주세요!",
    notGame: {
      any: [
        (category) =>
          `${category}에서는 아무것도 죽지 않습니다. 대화라면 몰라도요.`,
        (category) =>
          `${category}에는 죽음이 없습니다. 사망 카운터는 오늘 쉽니다.`,
        (category) =>
          `${category}에서 죽은 사람은 아무도 없습니다. 확인했어요.`,
      ],
      byCategory: {
        IRL: [
          "IRL이요? 거기서는 정말 죽을 수 있고, 세이브도 없습니다. 조심하세요.",
        ],
      },
    },
  },
  zh: {
    yes: (name) => `《${name}》里会死。`,
    no: (name) => `《${name}》里不会死。`,
    unknown: "我们还不知道这款游戏里会不会死，请在 GitHub 上告诉我们！",
    notGame: {
      any: [
        (category) => `“${category}”里什么都不会死，除了聊天气氛。`,
        (category) => `“${category}”里没有死亡，死亡计数器今天放假。`,
        (category) => `从来没有人在“${category}”里死过。我们查过了。`,
      ],
      byCategory: {
        IRL: ["IRL？那里是真的会死，而且没有存档。小心点。"],
      },
    },
  },
  it: {
    yes: (name) => `In ${name} puoi morire.`,
    no: (name) => `In ${name} non puoi morire.`,
    unknown:
      "Non sappiamo se in questo gioco si può morire, faccelo sapere su GitHub!",
    notGame: {
      any: [
        (category) =>
          `In ${category} non muore niente, tranne forse la conversazione.`,
        (category) =>
          `Nessuna morte in ${category}. Il contatore di morti si prende il giorno libero.`,
        (category) =>
          `Nessuno è mai morto in ${category}. Abbiamo controllato.`,
      ],
      byCategory: {
        IRL: [
          "IRL? Lì puoi morire davvero, e non ci sono salvataggi. Attenzione.",
        ],
      },
    },
  },
  pl: {
    yes: (name) => `Możesz zginąć w ${name}.`,
    no: (name) => `Nie możesz zginąć w ${name}.`,
    unknown:
      "Nie wiemy, czy w tej grze można zginąć. Daj nam znać na GitHubie!",
    notGame: {
      any: [
        (category) => `W ${category} nic nie ginie, może poza rozmową.`,
        (category) =>
          `Zero zgonów w ${category}. Licznik śmierci ma dziś wolne.`,
        (category) => `Nikt jeszcze nie zginął w ${category}. Sprawdzaliśmy.`,
      ],
      byCategory: {
        IRL: [
          "IRL? Tu naprawdę można zginąć i nie ma zapisów gry. Uważaj na siebie.",
        ],
      },
    },
  },
  ru: {
    yes: (name) => `В ${name} можно умереть.`,
    no: (name) => `В ${name} нельзя умереть.`,
    unknown:
      "Мы пока не знаем, можно ли умереть в этой игре. Напишите нам на GitHub!",
    notGame: {
      any: [
        (category) => `В ${category} ничего не умирает, разве что разговор.`,
        (category) =>
          `В ${category} смертей нет. Счётчик смертей сегодня отдыхает.`,
        (category) => `В ${category} ещё никто не умирал. Мы проверили.`,
      ],
      byCategory: {
        IRL: [
          "IRL? Там умереть можно по-настоящему, и сохранений нет. Берегите себя.",
        ],
      },
    },
  },
  ar: {
    yes: (name) => `يمكنك أن تموت في ${name}.`,
    no: (name) => `لا يمكنك أن تموت في ${name}.`,
    unknown: "لا نعرف إن كان يمكن الموت في هذه اللعبة، أخبرنا على GitHub!",
    notGame: {
      any: [
        (category) => `لا شيء يموت في ${category}، إلا الحديث ربما.`,
        (category) => `لا وفيات في ${category}. عدّاد الوفيات في إجازة اليوم.`,
        (category) => `لم يمت أحد قط في ${category}. لقد تحققنا.`,
      ],
      byCategory: {
        IRL: [
          "IRL؟ هناك يمكنك أن تموت فعلًا، ولا يوجد حفظ للعبة. انتبه لنفسك.",
        ],
      },
    },
  },
};

export const chatTextFor = (locale: Locale): ChatText => chat[locale];

/**
 * One line, picked at random, for a Twitch category that is not a game. The
 * category's own lines are used when the language has any.
 */
export const notGameLine = (t: ChatText, category: Category): string => {
  const own = t.notGame.byCategory[category];
  const lines = own?.length ? own : t.notGame.any.map((line) => line(category));
  return lines[Math.floor(Math.random() * lines.length)];
};
