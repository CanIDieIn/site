import type { Locale } from "./locales";

// Every piece of text the site shows, in each language, apart from the
// streaming guide, which has its own file beside this one.
//
// English comes first and sets the shape. Each other language must supply the
// same entries, and TypeScript reports any that are missing.
//
// Text that changes with a number or a name is a small function. Counts and
// dates arrive already written the way the language writes them.
//
// Game names and the reasons behind answers are not here. They come from the
// data files, and fall back to English when a language has none.

/** The three answers a game can have. */
export type Answer = "yes" | "no" | "unsure";

const en = {
  /** The site's name, and the start of the question every game page asks. */
  siteName: "Can I Die In...",
  tagline: "Find out whether a game can kill you.",
  skipToContent: "Skip to main content",
  languageMenu: "Language",
  fullStop: ".",

  /** The answers as they are stamped. The site sets them in capitals. */
  answers: { yes: "Yes", no: "No", unsure: "Unsure" } as Record<Answer, string>,

  definition: {
    question: "What counts as dying?",
    text: "Your character is killed or knocked out, or you lose a whole run. Crashing in a race or losing a match on points doesn't count.",
  },

  home: {
    description:
      "Search hundreds of thousands of video games to find out whether you can die in them.",
    lead: "Pick a game to find out whether you can die in it.",
    moreNav: "More on this site",
  },

  /** The panels that link between the main pages. */
  cards: {
    noDeathsTitle: "Games you can't die in",
    noDeathsText: (count: string) => `${count} confirmed so far`,
    everyGameTitle: "Every game",
    everyGameText: "Search the whole catalogue",
    streamingTitle: "Streaming?",
    streamingText: "Connect your stream bot",
  },

  noDeaths: {
    title: "Games You Can't Die In",
    description:
      "Every video game we have confirmed you cannot die in, so there are no deaths to count.",
    lead: (count: string, n: number) =>
      n === 1
        ? "The one game we have confirmed has no deaths to count."
        : `The ${count} games we have confirmed have no deaths to count.`,
  },

  browser: {
    formLabel: "Find a game",
    search: "Search by name",
    sortBy: "Sort by",
    order: "Order",
    sorts: { popularity: "Popularity", name: "Alphabetical", release: "Release Date" },
    directions: { asc: "Ascending", desc: "Descending" },
    submit: "Search",
    noMatch: (query: string) => `No games match "${query}".`,
    none: "No games to show yet.",
    showing: (from: string, to: string, total: string, n: number, query: string) =>
      `Showing ${from} to ${to} of ${total} ${n === 1 ? "game" : "games"}${query ? ` matching "${query}"` : ""}.`,
    clear: "Clear search",
    /** Read out before a release date, for people who cannot see where it sits. */
    released: "Released ",
    pagesNav: "Pages of results",
    previous: "Previous",
    previousPage: "Previous page",
    next: "Next",
    nextPage: "Next page",
    unavailable: (label: string) => `${label}, not available`,
    page: "Page",
    ofPages: (total: string) => `of ${total}`,
    go: "Go",
    goToPage: "Go to page",
  },

  game: {
    title: (name: string) => `Can I Die In ${name}?`,
    notFoundTitle: "Game not found",
    notFoundText: "There is no game at this address.",
    /** The one-line summary search engines show. `answer` is from `answerSentence`. */
    description: (name: string, answer: string) => `Can you die in ${name}? ${answer}`,
    answerSentence: { yes: "Yes.", no: "No.", unsure: "We are not sure yet." } as Record<
      Answer,
      string
    >,
    cardAlt: (name: string, answer: string) => `${name}, stamped with the answer: ${answer}.`,
    knowAnswer: "Know the answer?",
    notRight: "Not right?",
    tellUs: "Tell us on GitHub",
    suggest: "Suggest a correction on GitHub",
    gameId: (id: number) => `This is game ID ${id}.`,
    browseAll: "Browse all games",
    backToNoDeaths: "Back to games you can't die in",
  },
};

export type Ui = typeof en;

const fr: Ui = {
  siteName: "Peut-on mourir dans…",
  tagline: "Découvrez si un jeu peut vous tuer.",
  skipToContent: "Aller au contenu principal",
  languageMenu: "Langue",
  fullStop: ".",

  answers: { yes: "Oui", no: "Non", unsure: "Incertain" },

  definition: {
    question: "Qu'est-ce qui compte comme une mort ?",
    text: "Votre personnage est tué ou mis K.-O., ou vous perdez une partie entière. Un accident en course ou une défaite aux points ne comptent pas.",
  },

  home: {
    description:
      "Cherchez parmi des centaines de milliers de jeux vidéo pour savoir si l'on peut y mourir.",
    lead: "Choisissez un jeu pour savoir si l'on peut y mourir.",
    moreNav: "Ailleurs sur le site",
  },

  cards: {
    noDeathsTitle: "Jeux où l'on ne peut pas mourir",
    noDeathsText: (count) => `${count} confirmés à ce jour`,
    everyGameTitle: "Tous les jeux",
    everyGameText: "Chercher dans tout le catalogue",
    streamingTitle: "Vous streamez ?",
    streamingText: "Connectez votre bot de stream",
  },

  noDeaths: {
    title: "Jeux où l'on ne peut pas mourir",
    description:
      "Tous les jeux vidéo où nous avons confirmé que l'on ne peut pas mourir : aucune mort à compter.",
    lead: (count, n) =>
      n === 1
        ? "Le seul jeu confirmé sans aucune mort à compter."
        : `Les ${count} jeux confirmés sans aucune mort à compter.`,
  },

  browser: {
    formLabel: "Trouver un jeu",
    search: "Rechercher par nom",
    sortBy: "Trier par",
    order: "Ordre",
    sorts: { popularity: "Popularité", name: "Alphabétique", release: "Date de sortie" },
    directions: { asc: "Croissant", desc: "Décroissant" },
    submit: "Rechercher",
    noMatch: (query) => `Aucun jeu ne correspond à « ${query} ».`,
    none: "Aucun jeu à afficher pour l'instant.",
    showing: (from, to, total, _n, query) =>
      `Jeux ${from} à ${to} sur ${total}${query ? ` correspondant à « ${query} »` : ""}.`,
    clear: "Effacer la recherche",
    released: "Sortie : ",
    pagesNav: "Pages de résultats",
    previous: "Précédent",
    previousPage: "Page précédente",
    next: "Suivant",
    nextPage: "Page suivante",
    unavailable: (label) => `${label}, indisponible`,
    page: "Page",
    ofPages: (total) => `sur ${total}`,
    go: "Aller",
    goToPage: "Aller à la page",
  },

  game: {
    title: (name) => `Peut-on mourir dans ${name} ?`,
    notFoundTitle: "Jeu introuvable",
    notFoundText: "Il n'y a aucun jeu à cette adresse.",
    description: (name, answer) => `Peut-on mourir dans ${name} ? ${answer}`,
    answerSentence: { yes: "Oui.", no: "Non.", unsure: "Nous ne le savons pas encore." },
    cardAlt: (name, answer) => `${name}, avec la réponse en tampon : ${answer}.`,
    knowAnswer: "Vous connaissez la réponse ?",
    notRight: "Ce n'est pas correct ?",
    tellUs: "Dites-le-nous sur GitHub",
    suggest: "Proposez une correction sur GitHub",
    gameId: (id) => `Identifiant du jeu : ${id}.`,
    browseAll: "Parcourir tous les jeux",
    backToNoDeaths: "Retour aux jeux où l'on ne peut pas mourir",
  },
};

const es: Ui = {
  siteName: "¿Se puede morir en…?",
  tagline: "Descubre si un juego puede matarte.",
  skipToContent: "Saltar al contenido principal",
  languageMenu: "Idioma",
  fullStop: ".",

  answers: { yes: "Sí", no: "No", unsure: "Incierto" },

  definition: {
    question: "¿Qué cuenta como morir?",
    text: "Tu personaje muere o queda fuera de combate, o pierdes una partida entera. Chocar en una carrera o perder un partido por puntos no cuenta.",
  },

  home: {
    description:
      "Busca entre cientos de miles de videojuegos para saber si se puede morir en ellos.",
    lead: "Elige un juego para saber si se puede morir en él.",
    moreNav: "Más en este sitio",
  },

  cards: {
    noDeathsTitle: "Juegos en los que no se puede morir",
    noDeathsText: (count) => `${count} confirmados hasta ahora`,
    everyGameTitle: "Todos los juegos",
    everyGameText: "Busca en todo el catálogo",
    streamingTitle: "¿Haces directos?",
    streamingText: "Conecta tu bot de stream",
  },

  noDeaths: {
    title: "Juegos en los que no se puede morir",
    description:
      "Todos los videojuegos en los que hemos confirmado que no se puede morir, así que no hay muertes que contar.",
    lead: (count, n) =>
      n === 1
        ? "El único juego confirmado sin muertes que contar."
        : `Los ${count} juegos confirmados sin muertes que contar.`,
  },

  browser: {
    formLabel: "Buscar un juego",
    search: "Buscar por nombre",
    sortBy: "Ordenar por",
    order: "Orden",
    sorts: { popularity: "Popularidad", name: "Alfabético", release: "Fecha de lanzamiento" },
    directions: { asc: "Ascendente", desc: "Descendente" },
    submit: "Buscar",
    noMatch: (query) => `Ningún juego coincide con «${query}».`,
    none: "Todavía no hay juegos que mostrar.",
    showing: (from, to, total, n, query) =>
      `Mostrando del ${from} al ${to} de ${total} ${n === 1 ? "juego" : "juegos"}${query ? ` que coinciden con «${query}»` : ""}.`,
    clear: "Borrar la búsqueda",
    released: "Lanzamiento: ",
    pagesNav: "Páginas de resultados",
    previous: "Anterior",
    previousPage: "Página anterior",
    next: "Siguiente",
    nextPage: "Página siguiente",
    unavailable: (label) => `${label}, no disponible`,
    page: "Página",
    ofPages: (total) => `de ${total}`,
    go: "Ir",
    goToPage: "Ir a la página",
  },

  game: {
    title: (name) => `¿Se puede morir en ${name}?`,
    notFoundTitle: "Juego no encontrado",
    notFoundText: "No hay ningún juego en esta dirección.",
    description: (name, answer) => `¿Se puede morir en ${name}? ${answer}`,
    answerSentence: { yes: "Sí.", no: "No.", unsure: "Aún no lo sabemos." },
    cardAlt: (name, answer) => `${name}, con la respuesta estampada: ${answer}.`,
    knowAnswer: "¿Sabes la respuesta?",
    notRight: "¿No es correcto?",
    tellUs: "Cuéntanoslo en GitHub",
    suggest: "Sugiere una corrección en GitHub",
    gameId: (id) => `ID del juego: ${id}.`,
    browseAll: "Ver todos los juegos",
    backToNoDeaths: "Volver a los juegos en los que no se puede morir",
  },
};

const de: Ui = {
  siteName: "Kann man sterben in …",
  tagline: "Finde heraus, ob ein Spiel dich töten kann.",
  skipToContent: "Zum Hauptinhalt springen",
  languageMenu: "Sprache",
  fullStop: ".",

  answers: { yes: "Ja", no: "Nein", unsure: "Unklar" },

  definition: {
    question: "Was zählt als Sterben?",
    text: "Deine Spielfigur wird getötet oder k. o. geschlagen, oder du verlierst einen ganzen Durchlauf. Ein Unfall im Rennen oder eine Niederlage nach Punkten zählt nicht.",
  },

  home: {
    description:
      "Durchsuche Hunderttausende Videospiele und finde heraus, ob man in ihnen sterben kann.",
    lead: "Wähle ein Spiel und finde heraus, ob man darin sterben kann.",
    moreNav: "Mehr auf dieser Website",
  },

  cards: {
    noDeathsTitle: "Spiele, in denen man nicht sterben kann",
    noDeathsText: (count) => `Bisher ${count} bestätigt`,
    everyGameTitle: "Alle Spiele",
    everyGameText: "Den ganzen Katalog durchsuchen",
    streamingTitle: "Du streamst?",
    streamingText: "Verbinde deinen Stream-Bot",
  },

  noDeaths: {
    title: "Spiele, in denen man nicht sterben kann",
    description:
      "Alle Videospiele, bei denen wir bestätigt haben, dass man nicht sterben kann – es gibt also keine Tode zu zählen.",
    lead: (count, n) =>
      n === 1
        ? "Das eine Spiel, bei dem es bestätigt keine Tode zu zählen gibt."
        : `Die ${count} Spiele, bei denen es bestätigt keine Tode zu zählen gibt.`,
  },

  browser: {
    formLabel: "Spiel finden",
    search: "Nach Namen suchen",
    sortBy: "Sortieren nach",
    order: "Reihenfolge",
    sorts: { popularity: "Beliebtheit", name: "Alphabetisch", release: "Erscheinungsdatum" },
    directions: { asc: "Aufsteigend", desc: "Absteigend" },
    submit: "Suchen",
    noMatch: (query) => `Kein Spiel passt zu „${query}“.`,
    none: "Noch keine Spiele vorhanden.",
    showing: (from, to, total, n, query) =>
      `${from} bis ${to} von ${total} ${n === 1 ? "Spiel" : "Spielen"}${query ? ` passend zu „${query}“` : ""}.`,
    clear: "Suche zurücksetzen",
    released: "Erschienen: ",
    pagesNav: "Ergebnisseiten",
    previous: "Zurück",
    previousPage: "Vorherige Seite",
    next: "Weiter",
    nextPage: "Nächste Seite",
    unavailable: (label) => `${label}, nicht verfügbar`,
    page: "Seite",
    ofPages: (total) => `von ${total}`,
    go: "Los",
    goToPage: "Zur Seite gehen",
  },

  game: {
    title: (name) => `Kann man in ${name} sterben?`,
    notFoundTitle: "Spiel nicht gefunden",
    notFoundText: "Unter dieser Adresse gibt es kein Spiel.",
    description: (name, answer) => `Kann man in ${name} sterben? ${answer}`,
    answerSentence: { yes: "Ja.", no: "Nein.", unsure: "Das wissen wir noch nicht." },
    cardAlt: (name, answer) => `${name}, gestempelt mit der Antwort: ${answer}.`,
    knowAnswer: "Du kennst die Antwort?",
    notRight: "Stimmt nicht?",
    tellUs: "Sag es uns auf GitHub",
    suggest: "Schlage auf GitHub eine Korrektur vor",
    gameId: (id) => `Spiel-ID: ${id}.`,
    browseAll: "Alle Spiele durchsuchen",
    backToNoDeaths: "Zurück zu den Spielen, in denen man nicht sterben kann",
  },
};

const ja: Ui = {
  siteName: "このゲームで死ぬ？",
  tagline: "そのゲームで死ぬことがあるか調べよう。",
  skipToContent: "本文へスキップ",
  languageMenu: "言語",
  fullStop: "。",

  answers: { yes: "はい", no: "いいえ", unsure: "不明" },

  definition: {
    question: "「死ぬ」とは？",
    text: "キャラクターが倒される、気絶する、または1回のプレイをまるごと失うことです。レースでのクラッシュや、得点差での負けは含みません。",
  },

  home: {
    description: "数十万本のゲームから、そのゲームで死ぬことがあるかどうかを調べられます。",
    lead: "ゲームを選んで、死ぬことがあるかどうかを確かめましょう。",
    moreNav: "サイト内のその他のページ",
  },

  cards: {
    noDeathsTitle: "死なないゲーム",
    noDeathsText: (count) => `これまでに${count}本を確認`,
    everyGameTitle: "すべてのゲーム",
    everyGameText: "全カタログから検索",
    streamingTitle: "配信者の方へ",
    streamingText: "配信ボットと連携する",
  },

  noDeaths: {
    title: "死なないゲーム",
    description: "死ぬことがないと確認できたゲームの一覧です。数えるデス数はありません。",
    lead: (count) => `デス数を数える必要がないと確認できたゲームは${count}本です。`,
  },

  browser: {
    formLabel: "ゲームを探す",
    search: "名前で検索",
    sortBy: "並べ替え",
    order: "順序",
    sorts: { popularity: "人気", name: "名前", release: "発売日" },
    directions: { asc: "昇順", desc: "降順" },
    submit: "検索",
    noMatch: (query) => `「${query}」に一致するゲームはありません。`,
    none: "表示できるゲームはまだありません。",
    showing: (from, to, total, _n, query) =>
      `${query ? `「${query}」に一致する` : ""}${total}本中 ${from}～${to}本目を表示。`,
    clear: "検索をクリア",
    released: "発売日：",
    pagesNav: "結果のページ",
    previous: "前へ",
    previousPage: "前のページ",
    next: "次へ",
    nextPage: "次のページ",
    unavailable: (label) => `${label}（利用できません）`,
    page: "ページ",
    ofPages: (total) => `/ ${total}`,
    go: "移動",
    goToPage: "ページへ移動",
  },

  game: {
    title: (name) => `${name}で死ぬことはある？`,
    notFoundTitle: "ゲームが見つかりません",
    notFoundText: "このアドレスにゲームはありません。",
    description: (name, answer) => `${name}で死ぬことはある？${answer}`,
    answerSentence: { yes: "はい。", no: "いいえ。", unsure: "まだわかっていません。" },
    cardAlt: (name, answer) => `${name}。スタンプで示された答え：${answer}。`,
    knowAnswer: "答えをご存じですか？",
    notRight: "間違っていますか？",
    tellUs: "GitHubで教えてください",
    suggest: "GitHubで修正を提案する",
    gameId: (id) => `ゲームID：${id}`,
    browseAll: "すべてのゲームを見る",
    backToNoDeaths: "死なないゲームの一覧に戻る",
  },
};

const ui: Record<Locale, Ui> = { en, fr, es, de, ja };

/** The site's text in a language. */
export const uiFor = (locale: Locale): Ui => ui[locale];
