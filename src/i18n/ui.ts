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
    sorts: {
      popularity: "Popularity",
      name: "Alphabetical",
      release: "Release Date",
    },
    directions: { asc: "Ascending", desc: "Descending" },
    submit: "Search",
    noMatch: (query: string) => `No games match "${query}".`,
    none: "No games to show yet.",
    showing: (
      from: string,
      to: string,
      total: string,
      n: number,
      query: string,
    ) =>
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
    description: (name: string, answer: string) =>
      `Can you die in ${name}? ${answer}`,
    answerSentence: {
      yes: "Yes.",
      no: "No.",
      unsure: "We are not sure yet.",
    } as Record<Answer, string>,
    cardAlt: (name: string, answer: string) =>
      `${name}, stamped with the answer: ${answer}.`,
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
    sorts: {
      popularity: "Popularité",
      name: "Alphabétique",
      release: "Date de sortie",
    },
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
    answerSentence: {
      yes: "Oui.",
      no: "Non.",
      unsure: "Nous ne le savons pas encore.",
    },
    cardAlt: (name, answer) =>
      `${name}, avec la réponse en tampon : ${answer}.`,
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
    sorts: {
      popularity: "Popularidad",
      name: "Alfabético",
      release: "Fecha de lanzamiento",
    },
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
    cardAlt: (name, answer) =>
      `${name}, con la respuesta estampada: ${answer}.`,
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
    sorts: {
      popularity: "Beliebtheit",
      name: "Alphabetisch",
      release: "Erscheinungsdatum",
    },
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
    answerSentence: {
      yes: "Ja.",
      no: "Nein.",
      unsure: "Das wissen wir noch nicht.",
    },
    cardAlt: (name, answer) =>
      `${name}, gestempelt mit der Antwort: ${answer}.`,
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
    description:
      "数十万本のゲームから、そのゲームで死ぬことがあるかどうかを調べられます。",
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
    description:
      "死ぬことがないと確認できたゲームの一覧です。数えるデス数はありません。",
    lead: (count) =>
      `デス数を数える必要がないと確認できたゲームは${count}本です。`,
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
    answerSentence: {
      yes: "はい。",
      no: "いいえ。",
      unsure: "まだわかっていません。",
    },
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

const ko: Ui = {
  siteName: "이 게임에서 죽나요?",
  tagline: "그 게임에서 죽을 수 있는지 알아보세요.",
  skipToContent: "본문으로 건너뛰기",
  languageMenu: "언어",
  fullStop: ".",

  answers: { yes: "예", no: "아니요", unsure: "미확인" },

  definition: {
    question: "무엇이 죽음에 해당하나요?",
    text: "캐릭터가 죽거나 기절하거나, 한 판을 전부 잃는 것입니다. 레이스에서의 충돌이나 점수 차 패배는 포함하지 않습니다.",
  },

  home: {
    description:
      "수십만 개의 비디오 게임을 검색해 그 게임에서 죽을 수 있는지 알아보세요.",
    lead: "게임을 골라 죽을 수 있는지 확인해 보세요.",
    moreNav: "이 사이트의 다른 페이지",
  },

  cards: {
    noDeathsTitle: "죽지 않는 게임",
    noDeathsText: (count) => `지금까지 ${count}개 확인`,
    everyGameTitle: "모든 게임",
    everyGameText: "전체 목록 검색",
    streamingTitle: "방송하시나요?",
    streamingText: "방송 봇 연결하기",
  },

  noDeaths: {
    title: "죽지 않는 게임",
    description:
      "죽을 수 없다고 확인된 모든 비디오 게임입니다. 세어야 할 죽음이 없습니다.",
    lead: (count) => `세어야 할 죽음이 없다고 확인된 게임은 ${count}개입니다.`,
  },

  browser: {
    formLabel: "게임 찾기",
    search: "이름으로 검색",
    sortBy: "정렬 기준",
    order: "순서",
    sorts: { popularity: "인기", name: "이름순", release: "출시일" },
    directions: { asc: "오름차순", desc: "내림차순" },
    submit: "검색",
    noMatch: (query) => `"${query}"와 일치하는 게임이 없습니다.`,
    none: "아직 표시할 게임이 없습니다.",
    showing: (from, to, total, _n, query) =>
      `${query ? `"${query}"와 일치하는 ` : ""}게임 ${total}개 중 ${from}~${to}번째를 표시하고 있습니다.`,
    clear: "검색 지우기",
    released: "출시일: ",
    pagesNav: "결과 페이지",
    previous: "이전",
    previousPage: "이전 페이지",
    next: "다음",
    nextPage: "다음 페이지",
    unavailable: (label) => `${label}, 사용할 수 없음`,
    page: "페이지",
    ofPages: (total) => `/ ${total}`,
    go: "이동",
    goToPage: "해당 페이지로 이동",
  },

  game: {
    title: (name) => `${name}에서 죽나요?`,
    notFoundTitle: "게임을 찾을 수 없습니다",
    notFoundText: "이 주소에는 게임이 없습니다.",
    description: (name, answer) => `${name}에서 죽을 수 있나요? ${answer}`,
    answerSentence: {
      yes: "예.",
      no: "아니요.",
      unsure: "아직 확실하지 않습니다.",
    },
    cardAlt: (name, answer) => `${name}, 도장으로 표시된 답: ${answer}.`,
    knowAnswer: "답을 아시나요?",
    notRight: "잘못된 내용인가요?",
    tellUs: "GitHub에서 알려주세요",
    suggest: "GitHub에서 수정 제안하기",
    gameId: (id) => `게임 ID: ${id}`,
    browseAll: "모든 게임 보기",
    backToNoDeaths: "죽지 않는 게임 목록으로 돌아가기",
  },
};

const zh: Ui = {
  siteName: "这游戏会死吗？",
  tagline: "查一查这款游戏里会不会死。",
  skipToContent: "跳到主要内容",
  languageMenu: "语言",
  fullStop: "。",

  answers: { yes: "会", no: "不会", unsure: "未知" },

  definition: {
    question: "怎样算“死”？",
    text: "角色被杀死、被击倒，或者整局进度全部失去。赛车中撞车或比分落败不算。",
  },

  home: {
    description: "在数十万款电子游戏中搜索，看看哪些游戏里会死。",
    lead: "选一款游戏，看看在里面会不会死。",
    moreNav: "本站其他页面",
  },

  cards: {
    noDeathsTitle: "不会死的游戏",
    noDeathsText: (count) => `目前已确认 ${count} 款`,
    everyGameTitle: "所有游戏",
    everyGameText: "搜索完整目录",
    streamingTitle: "在做直播？",
    streamingText: "连接你的直播机器人",
  },

  noDeaths: {
    title: "不会死的游戏",
    description: "我们已确认不会死的所有电子游戏，因此没有死亡次数可数。",
    lead: (count) => `我们已确认有 ${count} 款游戏没有死亡次数可数。`,
  },

  browser: {
    formLabel: "查找游戏",
    search: "按名称搜索",
    sortBy: "排序方式",
    order: "顺序",
    sorts: { popularity: "热门度", name: "按字母", release: "发行日期" },
    directions: { asc: "升序", desc: "降序" },
    submit: "搜索",
    noMatch: (query) => `没有与“${query}”匹配的游戏。`,
    none: "暂无可显示的游戏。",
    showing: (from, to, total, _n, query) =>
      `正在显示${query ? `与“${query}”匹配的` : ""} ${total} 款游戏中的第 ${from} 至 ${to} 款。`,
    clear: "清除搜索",
    released: "发行日期：",
    pagesNav: "结果页",
    previous: "上一页",
    previousPage: "转到上一页",
    next: "下一页",
    nextPage: "转到下一页",
    unavailable: (label) => `${label}，不可用`,
    page: "页",
    ofPages: (total) => `/ 共 ${total} 页`,
    go: "前往",
    goToPage: "前往指定页",
  },

  game: {
    title: (name) => `《${name}》里会死吗？`,
    notFoundTitle: "未找到游戏",
    notFoundText: "此地址没有对应的游戏。",
    description: (name, answer) => `《${name}》里会死吗？${answer}`,
    answerSentence: {
      yes: "会。",
      no: "不会。",
      unsure: "我们还不确定。",
    },
    cardAlt: (name, answer) => `${name}，印章上的答案：${answer}。`,
    knowAnswer: "知道答案？",
    notRight: "有误？",
    tellUs: "在 GitHub 上告诉我们",
    suggest: "在 GitHub 上提交更正",
    gameId: (id) => `这是游戏 ID ${id}。`,
    browseAll: "浏览所有游戏",
    backToNoDeaths: "返回不会死的游戏列表",
  },
};

const it: Ui = {
  siteName: "Posso Morire In...",
  tagline: "Scopri se un gioco può ucciderti.",
  skipToContent: "Vai al contenuto principale",
  languageMenu: "Lingua",
  fullStop: ".",

  answers: { yes: "Sì", no: "No", unsure: "Incerto" },

  definition: {
    question: "Cosa conta come morire?",
    text: "Il tuo personaggio viene ucciso o messo KO, oppure perdi un'intera partita. Schiantarsi in una gara o perdere ai punti non conta.",
  },

  home: {
    description:
      "Cerca tra centinaia di migliaia di videogiochi per scoprire se puoi morirci.",
    lead: "Scegli un gioco per scoprire se puoi morirci.",
    moreNav: "Altro su questo sito",
  },

  cards: {
    noDeathsTitle: "Giochi in cui non puoi morire",
    noDeathsText: (count) => `${count} confermati finora`,
    everyGameTitle: "Tutti i giochi",
    everyGameText: "Cerca nell'intero catalogo",
    streamingTitle: "Fai streaming?",
    streamingText: "Collega il tuo bot",
  },

  noDeaths: {
    title: "Giochi In Cui Non Puoi Morire",
    description:
      "Tutti i videogiochi in cui abbiamo confermato che non puoi morire, quindi non ci sono morti da contare.",
    lead: (count, n) =>
      n === 1
        ? "L'unico gioco in cui abbiamo confermato che non ci sono morti da contare."
        : `I ${count} giochi in cui abbiamo confermato che non ci sono morti da contare.`,
  },

  browser: {
    formLabel: "Trova un gioco",
    search: "Cerca per nome",
    sortBy: "Ordina per",
    order: "Ordine",
    sorts: {
      popularity: "Popolarità",
      name: "Alfabetico",
      release: "Data di uscita",
    },
    directions: { asc: "Crescente", desc: "Decrescente" },
    submit: "Cerca",
    noMatch: (query) => `Nessun gioco corrisponde a "${query}".`,
    none: "Nessun gioco da mostrare per ora.",
    showing: (from, to, total, n, query) =>
      `Visualizzazione da ${from} a ${to} di ${total} ${n === 1 ? "gioco" : "giochi"}${query ? ` corrispondenti a "${query}"` : ""}.`,
    clear: "Cancella la ricerca",
    released: "Uscito il ",
    pagesNav: "Pagine di risultati",
    previous: "Precedente",
    previousPage: "Pagina precedente",
    next: "Successiva",
    nextPage: "Pagina successiva",
    unavailable: (label) => `${label}, non disponibile`,
    page: "Pagina",
    ofPages: (total) => `di ${total}`,
    go: "Vai",
    goToPage: "Vai alla pagina",
  },

  game: {
    title: (name) => `Posso morire in ${name}?`,
    notFoundTitle: "Gioco non trovato",
    notFoundText: "Non c'è nessun gioco a questo indirizzo.",
    description: (name, answer) => `Puoi morire in ${name}? ${answer}`,
    answerSentence: {
      yes: "Sì.",
      no: "No.",
      unsure: "Non ne siamo ancora sicuri.",
    },
    cardAlt: (name, answer) => `${name}, timbrato con la risposta: ${answer}.`,
    knowAnswer: "Conosci la risposta?",
    notRight: "Non è corretto?",
    tellUs: "Dillo su GitHub",
    suggest: "Suggerisci una correzione su GitHub",
    gameId: (id) => `Questo è l'ID gioco ${id}.`,
    browseAll: "Sfoglia tutti i giochi",
    backToNoDeaths: "Torna ai giochi in cui non puoi morire",
  },
};

const ru: Ui = {
  siteName: "Можно ли умереть в...",
  tagline: "Узнайте, можно ли умереть в игре.",
  skipToContent: "Перейти к основному содержанию",
  languageMenu: "Язык",
  fullStop: ".",

  answers: { yes: "Да", no: "Нет", unsure: "Неизвестно" },

  definition: {
    question: "Что считается смертью?",
    text: "Вашего персонажа убивают или он теряет сознание, либо вы теряете весь забег. Авария в гонке и поражение по очкам не считаются.",
  },

  home: {
    description:
      "Поиск по сотням тысяч видеоигр: узнайте, можно ли в них умереть.",
    lead: "Выберите игру, чтобы узнать, можно ли в ней умереть.",
    moreNav: "Другие страницы сайта",
  },

  cards: {
    noDeathsTitle: "Игры, в которых нельзя умереть",
    noDeathsText: (count) => `подтверждено: ${count}`,
    everyGameTitle: "Все игры",
    everyGameText: "Поиск по всему каталогу",
    streamingTitle: "Ведёте стрим?",
    streamingText: "Подключите своего бота",
  },

  noDeaths: {
    title: "Игры, В Которых Нельзя Умереть",
    description:
      "Все видеоигры, в которых, как мы подтвердили, умереть нельзя, поэтому смерти считать не нужно.",
    lead: (count) =>
      `Игр, в которых, как мы подтвердили, смерти считать не нужно: ${count}.`,
  },

  browser: {
    formLabel: "Найти игру",
    search: "Поиск по названию",
    sortBy: "Сортировка",
    order: "Порядок",
    sorts: {
      popularity: "Популярность",
      name: "По алфавиту",
      release: "Дата выхода",
    },
    directions: { asc: "По возрастанию", desc: "По убыванию" },
    submit: "Искать",
    noMatch: (query) => `Нет игр, соответствующих «${query}».`,
    none: "Пока нечего показать.",
    showing: (from, to, total, _n, query) =>
      `Показаны ${from}–${to} из ${total}${query ? ` по запросу «${query}»` : ""}.`,
    clear: "Очистить поиск",
    released: "Дата выхода: ",
    pagesNav: "Страницы результатов",
    previous: "Назад",
    previousPage: "Предыдущая страница",
    next: "Вперёд",
    nextPage: "Следующая страница",
    unavailable: (label) => `${label} — недоступно`,
    page: "Страница",
    ofPages: (total) => `из ${total}`,
    go: "Перейти",
    goToPage: "Перейти на страницу",
  },

  game: {
    title: (name) => `Можно ли умереть в ${name}?`,
    notFoundTitle: "Игра не найдена",
    notFoundText: "По этому адресу нет игры.",
    description: (name, answer) => `Можно ли умереть в ${name}? ${answer}`,
    answerSentence: {
      yes: "Да.",
      no: "Нет.",
      unsure: "Мы пока не знаем.",
    },
    cardAlt: (name, answer) => `${name}, штамп с ответом: ${answer}.`,
    knowAnswer: "Знаете ответ?",
    notRight: "Что-то не так?",
    tellUs: "Напишите нам на GitHub",
    suggest: "Предложить исправление на GitHub",
    gameId: (id) => `Это игра с ID ${id}.`,
    browseAll: "Смотреть все игры",
    backToNoDeaths: "Назад к играм, в которых нельзя умереть",
  },
};

const ar: Ui = {
  siteName: "هل يمكن أن أموت في...",
  tagline: "اعرف ما إذا كانت اللعبة قد تقتلك.",
  skipToContent: "تخطَّ إلى المحتوى الرئيسي",
  languageMenu: "اللغة",
  fullStop: ".",

  answers: { yes: "نعم", no: "لا", unsure: "غير مؤكد" },

  definition: {
    question: "ما الذي يُعدّ موتًا؟",
    text: "أن تُقتل شخصيتك أو تفقد وعيها، أو أن تخسر جولة كاملة. أما الاصطدام في سباق أو الخسارة بالنقاط فلا يُحتسب.",
  },

  home: {
    description:
      "ابحث في مئات الآلاف من ألعاب الفيديو لتعرف ما إذا كان بإمكانك أن تموت فيها.",
    lead: "اختر لعبة لتعرف ما إذا كان بإمكانك أن تموت فيها.",
    moreNav: "المزيد في هذا الموقع",
  },

  cards: {
    noDeathsTitle: "ألعاب لا يمكنك أن تموت فيها",
    noDeathsText: (count) => `تم تأكيد ${count} حتى الآن`,
    everyGameTitle: "كل الألعاب",
    everyGameText: "ابحث في الفهرس كاملًا",
    streamingTitle: "تبثّ مباشرة؟",
    streamingText: "اربط بوت البث الخاص بك",
  },

  noDeaths: {
    title: "ألعاب لا يمكنك أن تموت فيها",
    description:
      "كل ألعاب الفيديو التي أكّدنا أنه لا يمكنك أن تموت فيها، فلا وفيات تُحتسب.",
    lead: (count) => `عدد الألعاب التي أكّدنا أنها بلا وفيات تُحتسب: ${count}.`,
  },

  browser: {
    formLabel: "ابحث عن لعبة",
    search: "ابحث بالاسم",
    sortBy: "ترتيب حسب",
    order: "الاتجاه",
    sorts: {
      popularity: "الشهرة",
      name: "أبجديًا",
      release: "تاريخ الإصدار",
    },
    directions: { asc: "تصاعدي", desc: "تنازلي" },
    submit: "بحث",
    noMatch: (query) => `لا توجد ألعاب تطابق «${query}».`,
    none: "لا توجد ألعاب لعرضها بعد.",
    showing: (from, to, total, _n, query) =>
      `عرض ${from} إلى ${to} من ${total}${query ? ` مما يطابق «${query}»` : ""}.`,
    clear: "امسح البحث",
    released: "صدرت في ",
    pagesNav: "صفحات النتائج",
    previous: "السابق",
    previousPage: "الصفحة السابقة",
    next: "التالي",
    nextPage: "الصفحة التالية",
    unavailable: (label) => `${label}، غير متاح`,
    page: "صفحة",
    ofPages: (total) => `من ${total}`,
    go: "اذهب",
    goToPage: "اذهب إلى الصفحة",
  },

  game: {
    title: (name) => `هل يمكن أن أموت في ${name}؟`,
    notFoundTitle: "لم يتم العثور على اللعبة",
    notFoundText: "لا توجد لعبة على هذا العنوان.",
    description: (name, answer) => `هل يمكنك أن تموت في ${name}؟ ${answer}`,
    answerSentence: {
      yes: "نعم.",
      no: "لا.",
      unsure: "لسنا متأكدين بعد.",
    },
    cardAlt: (name, answer) => `${name}، مختومة بالإجابة: ${answer}.`,
    knowAnswer: "تعرف الإجابة؟",
    notRight: "هل هذا غير صحيح؟",
    tellUs: "أخبرنا على GitHub",
    suggest: "اقترح تصحيحًا على GitHub",
    gameId: (id) => `معرّف اللعبة: ${id}`,
    browseAll: "تصفّح كل الألعاب",
    backToNoDeaths: "العودة إلى الألعاب التي لا يمكنك أن تموت فيها",
  },
};

const ui: Record<Locale, Ui> = { en, fr, es, de, ja, ko, zh, it, ru, ar };

/** The site's text in a language. */
export const uiFor = (locale: Locale): Ui => ui[locale];
