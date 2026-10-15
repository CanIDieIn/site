import type { Locale } from "./locales";

// The text of the streaming guide, src/pages/streaming.astro, in each language.
// The rest of the site's text is in ui.ts beside this file.
//
// English comes first and sets the shape. Each other language must supply the
// same entries, and TypeScript reports any that are missing.
//
// Some entries hold a little HTML: <code> for something to type, <strong> for
// the name of a menu, and <a> for the one link, which the page points at the
// main list. The page adds their styling. Menu names in Streamer.bot are left
// in English everywhere, as that is how the program shows them. So are "true"
// and "false", which are what the API sends.

const en = {
  title: "Use It On Your Stream",
  description:
    "Ask whether you can die in a game by its Twitch category name, from Nightbot, StreamElements, Fossabot or Streamer.bot.",
  intro:
    "Send us the name of your Twitch category and we will tell you whether you can die in that game. Your bot can use the answer to switch a death counter on or off.",

  request: {
    heading: "The request",
    text: "It is one GET request, with the category name on the end of the address. No key or sign-up is needed.",
    /** Stands in for the name in the example address. */
    placeholder: "category name",
    repliesIntro: "The reply is plain text, and one of three things:",
    yes: "You can die in this game.",
    no: "You cannot die in this game.",
    notFound:
      "An empty reply. No game has that name, or we have no answer for it yet.",
    slugNote:
      "A game's slug works in place of its name. The slug is the last part of the address of the game's page here, such as <code>baldurs-gate-iii</code>.",
  },

  bots: {
    heading: "Setting up your bot",
    intro:
      "Each example below reads your current category and asks about it, so the answer follows you when you change game. Chat bots post the answer as the word “true” or “false”.",
    /** What the bot says in chat before the answer. `game` is the bot's own code for the category. */
    question: (game: string) => `Can you die in ${game}?`,
    streamerBot: {
      intro: "Add these two sub-actions to an action, in this order:",
      step1:
        "<strong>Twitch › User › Get User Info for Target</strong>, with User Login set to <code>%broadcastUserName%</code>. This puts your category in <code>%game%</code>. If the action is not started by a Twitch trigger, put <strong>Add Broadcaster Information</strong> before it.",
      step2:
        "<strong>Core › Network › Fetch URL</strong>, with Variable Name set to <code>canDie</code> and this as the URL:",
      after:
        "<code>%canDie%</code> then holds <code>true</code>, <code>false</code>, or nothing when there is no answer. Test it with an If/Else sub-action.",
    },
    nightbot: {
      intro: "Send this in your chat to add a <code>!candie</code> command:",
      noAnswer:
        "When there is no answer, Nightbot posts an error message of its own in place of the answer.",
    },
    streamElements: {
      intro: "Send this in your chat:",
      noAnswer:
        "When there is no answer, StreamElements posts “The remote server returned status code 404”.",
    },
    fossabot: {
      intro: "Create a command with this as its response:",
      noAnswer: "When there is no answer, Fossabot leaves the answer blank.",
    },
    other: {
      heading: "Anything else",
      text: "Any tool that can fetch a web address will work. Browser sources and overlays can call it too, from any site.",
    },
  },

  matching: {
    heading: "How names are matched",
    intro:
      "Our game names come from IGDB, which is also where Twitch gets its categories, so most names match as they are. Capitals, accents and punctuation are ignored, and a sequel's number can be written either way: “3” finds “III”, and “III” finds “3”. Here is what some names return right now:",
    nameColumn: "Name sent",
    replyColumn: "Reply",
    whyColumn: "Why",
    /** Shown in the Reply column when there is no answer. */
    empty: "404, empty",
    /** One for each example in the table, by the `note` it names. */
    notes: {
      plain:
        "A plain name. Capitals do not matter, so “firewatch” and “FIREWATCH” work too.",
      accent:
        "Accents are optional. “Pokemon Red Version” finds the same game.",
      punctuation: "Punctuation is ignored, so the colon can be left out.",
      apostrophe:
        "Apostrophes are optional. “Friday Night Funkin” works as well.",
      numeral:
        "Twitch names this category with a 3, where our data has III. Roman numerals and ordinary numbers are treated as the same, so the Twitch name still finds it.",
      numeralReverse:
        "The same the other way round. Our data has this game as “Forza Horizon 5”.",
      slash: "A slash in the name works, written as it is or as %2F.",
      percent:
        "A percent sign has to be sent as %25. Bots do this for you when you use their encoding variable.",
      shared:
        "Several games share this name. You get the one we have an answer for, and the most popular of those.",
      notGame: "Not a game, so there is no answer.",
      slug: "A slug, taken from the address of the game's page here. It always finds exactly that game.",
    },
    helpQuestion: "Category finds nothing?",
    help: "Search for the game on <a>the main list</a> and use the slug from its page instead.",
  },
};

export type StreamingText = typeof en;

const fr: StreamingText = {
  title: "À utiliser sur votre stream",
  description:
    "Demandez si l'on peut mourir dans un jeu à partir du nom de sa catégorie Twitch, depuis Nightbot, StreamElements, Fossabot ou Streamer.bot.",
  intro:
    "Envoyez-nous le nom de votre catégorie Twitch et nous vous dirons si l'on peut mourir dans ce jeu. Votre bot peut utiliser la réponse pour activer ou désactiver un compteur de morts.",

  request: {
    heading: "La requête",
    text: "C'est une simple requête GET, avec le nom de la catégorie à la fin de l'adresse. Aucune clé ni inscription n'est nécessaire.",
    placeholder: "nom de la catégorie",
    repliesIntro:
      "La réponse est en texte brut, et prend l'une de ces trois formes :",
    yes: "On peut mourir dans ce jeu.",
    no: "On ne peut pas mourir dans ce jeu.",
    notFound:
      "Une réponse vide. Aucun jeu ne porte ce nom, ou nous n'avons pas encore de réponse pour lui.",
    slugNote:
      "Le slug d'un jeu fonctionne à la place de son nom. Le slug est la dernière partie de l'adresse de la page du jeu sur ce site, par exemple <code>baldurs-gate-iii</code>.",
  },

  bots: {
    heading: "Configurer votre bot",
    intro:
      "Chaque exemple ci-dessous lit votre catégorie actuelle et pose la question, de sorte que la réponse vous suit quand vous changez de jeu. Les bots de chat publient la réponse sous la forme du mot « true » ou « false ».",
    question: (game) => `Peut-on mourir dans ${game} ?`,
    streamerBot: {
      intro: "Ajoutez ces deux sous-actions à une action, dans cet ordre :",
      step1:
        "<strong>Twitch › User › Get User Info for Target</strong>, avec User Login réglé sur <code>%broadcastUserName%</code>. Votre catégorie se retrouve alors dans <code>%game%</code>. Si l'action n'est pas lancée par un déclencheur Twitch, placez <strong>Add Broadcaster Information</strong> avant.",
      step2:
        "<strong>Core › Network › Fetch URL</strong>, avec Variable Name réglé sur <code>canDie</code> et cette adresse comme URL :",
      after:
        "<code>%canDie%</code> contient alors <code>true</code>, <code>false</code>, ou rien quand il n'y a pas de réponse. Testez-le avec une sous-action If/Else.",
    },
    nightbot: {
      intro:
        "Envoyez ceci dans votre chat pour ajouter une commande <code>!candie</code> :",
      noAnswer:
        "Quand il n'y a pas de réponse, Nightbot publie son propre message d'erreur à la place.",
    },
    streamElements: {
      intro: "Envoyez ceci dans votre chat :",
      noAnswer:
        "Quand il n'y a pas de réponse, StreamElements publie « The remote server returned status code 404 ».",
    },
    fossabot: {
      intro: "Créez une commande avec ceci comme réponse :",
      noAnswer:
        "Quand il n'y a pas de réponse, Fossabot laisse la réponse vide.",
    },
    other: {
      heading: "Tout autre outil",
      text: "Tout outil capable de charger une adresse web fonctionne. Les sources navigateur et les overlays peuvent aussi l'appeler, depuis n'importe quel site.",
    },
  },

  matching: {
    heading: "Comment les noms sont reconnus",
    intro:
      "Nos noms de jeux viennent d'IGDB, tout comme les catégories de Twitch, donc la plupart des noms correspondent tels quels. Les majuscules, les accents et la ponctuation sont ignorés, et le numéro d'une suite peut s'écrire des deux façons : « 3 » trouve « III », et « III » trouve « 3 ». Voici ce que renvoient quelques noms en ce moment :",
    nameColumn: "Nom envoyé",
    replyColumn: "Réponse",
    whyColumn: "Pourquoi",
    empty: "404, vide",
    notes: {
      plain:
        "Un nom simple. Les majuscules ne comptent pas : « firewatch » et « FIREWATCH » fonctionnent aussi.",
      accent:
        "Les accents sont facultatifs. « Pokemon Red Version » trouve le même jeu.",
      punctuation:
        "La ponctuation est ignorée : les deux-points peuvent être omis.",
      apostrophe:
        "Les apostrophes sont facultatives. « Friday Night Funkin » fonctionne aussi.",
      numeral:
        "Twitch nomme cette catégorie avec un 3, là où nos données ont III. Chiffres romains et chiffres ordinaires sont traités de la même façon, donc le nom Twitch trouve quand même le jeu.",
      numeralReverse:
        "Pareil dans l'autre sens. Nos données ont ce jeu sous « Forza Horizon 5 ».",
      slash:
        "Une barre oblique dans le nom fonctionne, écrite telle quelle ou sous la forme %2F.",
      percent:
        "Un signe pour cent doit être envoyé sous la forme %25. Les bots le font pour vous quand vous utilisez leur variable d'encodage.",
      shared:
        "Plusieurs jeux portent ce nom. Vous obtenez celui pour lequel nous avons une réponse, et le plus populaire d'entre eux.",
      notGame: "Ce n'est pas un jeu, donc il n'y a pas de réponse.",
      slug: "Un slug, tiré de l'adresse de la page du jeu sur ce site. Il trouve toujours exactement ce jeu.",
    },
    helpQuestion: "Votre catégorie ne donne rien ?",
    help: "Cherchez le jeu dans <a>la liste principale</a> et utilisez plutôt le slug de sa page.",
  },
};

const es: StreamingText = {
  title: "Úsalo en tu directo",
  description:
    "Pregunta si se puede morir en un juego por el nombre de su categoría de Twitch, desde Nightbot, StreamElements, Fossabot o Streamer.bot.",
  intro:
    "Envíanos el nombre de tu categoría de Twitch y te diremos si se puede morir en ese juego. Tu bot puede usar la respuesta para activar o desactivar un contador de muertes.",

  request: {
    heading: "La petición",
    text: "Es una sola petición GET, con el nombre de la categoría al final de la dirección. No hace falta clave ni registro.",
    placeholder: "nombre de la categoría",
    repliesIntro: "La respuesta es texto sin formato, y es una de estas tres:",
    yes: "Se puede morir en este juego.",
    no: "No se puede morir en este juego.",
    notFound:
      "Una respuesta vacía. Ningún juego tiene ese nombre, o todavía no tenemos respuesta para él.",
    slugNote:
      "El slug de un juego sirve en lugar de su nombre. El slug es la última parte de la dirección de la página del juego en este sitio, por ejemplo <code>baldurs-gate-iii</code>.",
  },

  bots: {
    heading: "Configura tu bot",
    intro:
      "Cada ejemplo de abajo lee tu categoría actual y pregunta por ella, así que la respuesta te sigue cuando cambias de juego. Los bots de chat publican la respuesta como la palabra «true» o «false».",
    question: (game) => `¿Se puede morir en ${game}?`,
    streamerBot: {
      intro: "Añade estas dos subacciones a una acción, en este orden:",
      step1:
        "<strong>Twitch › User › Get User Info for Target</strong>, con User Login puesto en <code>%broadcastUserName%</code>. Esto deja tu categoría en <code>%game%</code>. Si la acción no la inicia un disparador de Twitch, pon <strong>Add Broadcaster Information</strong> antes.",
      step2:
        "<strong>Core › Network › Fetch URL</strong>, con Variable Name puesto en <code>canDie</code> y esta dirección como URL:",
      after:
        "<code>%canDie%</code> contiene entonces <code>true</code>, <code>false</code>, o nada cuando no hay respuesta. Compruébalo con una subacción If/Else.",
    },
    nightbot: {
      intro:
        "Envía esto en tu chat para añadir un comando <code>!candie</code>:",
      noAnswer:
        "Cuando no hay respuesta, Nightbot publica su propio mensaje de error en su lugar.",
    },
    streamElements: {
      intro: "Envía esto en tu chat:",
      noAnswer:
        "Cuando no hay respuesta, StreamElements publica «The remote server returned status code 404».",
    },
    fossabot: {
      intro: "Crea un comando con esto como respuesta:",
      noAnswer:
        "Cuando no hay respuesta, Fossabot deja la respuesta en blanco.",
    },
    other: {
      heading: "Cualquier otra herramienta",
      text: "Sirve cualquier herramienta que pueda cargar una dirección web. Las fuentes de navegador y los overlays también pueden llamarla, desde cualquier sitio.",
    },
  },

  matching: {
    heading: "Cómo se reconocen los nombres",
    intro:
      "Nuestros nombres de juegos vienen de IGDB, de donde Twitch también saca sus categorías, así que la mayoría de los nombres coinciden tal cual. Se ignoran las mayúsculas, los acentos y la puntuación, y el número de una secuela puede escribirse de las dos formas: «3» encuentra «III», y «III» encuentra «3». Esto es lo que devuelven algunos nombres ahora mismo:",
    nameColumn: "Nombre enviado",
    replyColumn: "Respuesta",
    whyColumn: "Por qué",
    empty: "404, vacía",
    notes: {
      plain:
        "Un nombre sencillo. Las mayúsculas no importan: «firewatch» y «FIREWATCH» también funcionan.",
      accent:
        "Los acentos son opcionales. «Pokemon Red Version» encuentra el mismo juego.",
      punctuation:
        "La puntuación se ignora, así que los dos puntos pueden omitirse.",
      apostrophe:
        "Los apóstrofos son opcionales. «Friday Night Funkin» también funciona.",
      numeral:
        "Twitch nombra esta categoría con un 3, donde nuestros datos tienen III. Los números romanos y los normales se tratan igual, así que el nombre de Twitch lo encuentra de todos modos.",
      numeralReverse:
        "Lo mismo al revés. Nuestros datos tienen este juego como «Forza Horizon 5».",
      slash: "Una barra en el nombre funciona, escrita tal cual o como %2F.",
      percent:
        "Un signo de porcentaje debe enviarse como %25. Los bots lo hacen por ti cuando usas su variable de codificación.",
      shared:
        "Varios juegos comparten este nombre. Recibes aquel para el que tenemos respuesta, y el más popular de ellos.",
      notGame: "No es un juego, así que no hay respuesta.",
      slug: "Un slug, tomado de la dirección de la página del juego en este sitio. Siempre encuentra exactamente ese juego.",
    },
    helpQuestion: "¿Tu categoría no encuentra nada?",
    help: "Busca el juego en <a>la lista principal</a> y usa el slug de su página.",
  },
};

const de: StreamingText = {
  title: "Nutze es in deinem Stream",
  description:
    "Frage per Twitch-Kategorienamen ab, ob man in einem Spiel sterben kann – mit Nightbot, StreamElements, Fossabot oder Streamer.bot.",
  intro:
    "Schick uns den Namen deiner Twitch-Kategorie, und wir sagen dir, ob man in diesem Spiel sterben kann. Dein Bot kann mit der Antwort einen Todeszähler ein- oder ausschalten.",

  request: {
    heading: "Die Anfrage",
    text: "Es ist eine einzige GET-Anfrage, mit dem Kategorienamen am Ende der Adresse. Du brauchst weder Schlüssel noch Anmeldung.",
    placeholder: "Kategoriename",
    repliesIntro:
      "Die Antwort ist reiner Text und eine von drei Möglichkeiten:",
    yes: "In diesem Spiel kann man sterben.",
    no: "In diesem Spiel kann man nicht sterben.",
    notFound:
      "Eine leere Antwort. Kein Spiel trägt diesen Namen, oder wir haben noch keine Antwort dafür.",
    slugNote:
      "Statt des Namens funktioniert auch der Slug eines Spiels. Der Slug ist der letzte Teil der Adresse der Spielseite hier, zum Beispiel <code>baldurs-gate-iii</code>.",
  },

  bots: {
    heading: "Deinen Bot einrichten",
    intro:
      "Jedes Beispiel unten liest deine aktuelle Kategorie und fragt danach, sodass die Antwort mitwechselt, wenn du das Spiel wechselst. Chatbots posten die Antwort als das Wort „true“ oder „false“.",
    question: (game) => `Kann man in ${game} sterben?`,
    streamerBot: {
      intro:
        "Füge einer Aktion diese beiden Sub-Actions hinzu, in dieser Reihenfolge:",
      step1:
        "<strong>Twitch › User › Get User Info for Target</strong>, mit User Login auf <code>%broadcastUserName%</code> gesetzt. Damit steht deine Kategorie in <code>%game%</code>. Wird die Aktion nicht durch einen Twitch-Trigger gestartet, setze <strong>Add Broadcaster Information</strong> davor.",
      step2:
        "<strong>Core › Network › Fetch URL</strong>, mit Variable Name auf <code>canDie</code> gesetzt und dieser Adresse als URL:",
      after:
        "<code>%canDie%</code> enthält dann <code>true</code>, <code>false</code> oder nichts, wenn es keine Antwort gibt. Prüfe es mit einer If/Else-Sub-Action.",
    },
    nightbot: {
      intro:
        "Sende das in deinem Chat, um einen <code>!candie</code>-Befehl anzulegen:",
      noAnswer:
        "Gibt es keine Antwort, postet Nightbot stattdessen eine eigene Fehlermeldung.",
    },
    streamElements: {
      intro: "Sende das in deinem Chat:",
      noAnswer:
        "Gibt es keine Antwort, postet StreamElements „The remote server returned status code 404“.",
    },
    fossabot: {
      intro: "Lege einen Befehl mit dieser Antwort an:",
      noAnswer: "Gibt es keine Antwort, lässt Fossabot die Antwort leer.",
    },
    other: {
      heading: "Alles andere",
      text: "Jedes Werkzeug, das eine Webadresse abrufen kann, funktioniert. Auch Browserquellen und Overlays können sie aufrufen, von jeder Website aus.",
    },
  },

  matching: {
    heading: "Wie Namen erkannt werden",
    intro:
      "Unsere Spielnamen stammen von IGDB, woher auch Twitch seine Kategorien bezieht, daher passen die meisten Namen unverändert. Groß- und Kleinschreibung, Akzente und Satzzeichen werden ignoriert, und die Nummer einer Fortsetzung kann auf beide Arten geschrieben werden: „3“ findet „III“, und „III“ findet „3“. Das liefern einige Namen im Moment:",
    nameColumn: "Gesendeter Name",
    replyColumn: "Antwort",
    whyColumn: "Warum",
    empty: "404, leer",
    notes: {
      plain:
        "Ein einfacher Name. Groß- und Kleinschreibung spielt keine Rolle: „firewatch“ und „FIREWATCH“ funktionieren auch.",
      accent:
        "Akzente sind optional. „Pokemon Red Version“ findet dasselbe Spiel.",
      punctuation:
        "Satzzeichen werden ignoriert, der Doppelpunkt kann also wegfallen.",
      apostrophe:
        "Apostrophe sind optional. „Friday Night Funkin“ funktioniert ebenfalls.",
      numeral:
        "Twitch schreibt diese Kategorie mit einer 3, in unseren Daten steht III. Römische und normale Zahlen werden gleich behandelt, der Twitch-Name findet das Spiel also trotzdem.",
      numeralReverse:
        "Dasselbe andersherum. In unseren Daten heißt dieses Spiel „Forza Horizon 5“.",
      slash:
        "Ein Schrägstrich im Namen funktioniert, so geschrieben oder als %2F.",
      percent:
        "Ein Prozentzeichen muss als %25 gesendet werden. Bots erledigen das für dich, wenn du ihre Kodierungsvariable verwendest.",
      shared:
        "Mehrere Spiele tragen diesen Namen. Du bekommst das, für das wir eine Antwort haben, und davon das beliebteste.",
      notGame: "Kein Spiel, also gibt es keine Antwort.",
      slug: "Ein Slug, aus der Adresse der Spielseite hier. Er findet immer genau dieses Spiel.",
    },
    helpQuestion: "Deine Kategorie findet nichts?",
    help: "Suche das Spiel in <a>der Hauptliste</a> und nimm stattdessen den Slug von seiner Seite.",
  },
};

const ja: StreamingText = {
  title: "配信で使う",
  description:
    "Twitchのカテゴリ名から、そのゲームで死ぬことがあるかどうかを問い合わせできます。Nightbot、StreamElements、Fossabot、Streamer.botに対応。",
  intro:
    "Twitchのカテゴリ名を送ると、そのゲームで死ぬことがあるかどうかをお答えします。ボットはその答えを使って、デスカウンターのオン・オフを切り替えられます。",

  request: {
    heading: "リクエスト",
    text: "アドレスの末尾にカテゴリ名を付けた、1回のGETリクエストです。キーも登録も必要ありません。",
    placeholder: "カテゴリ名",
    repliesIntro: "返答はプレーンテキストで、次の3つのいずれかです。",
    yes: "このゲームでは死ぬことがあります。",
    no: "このゲームでは死ぬことがありません。",
    notFound:
      "空の返答です。その名前のゲームがないか、まだ答えが登録されていません。",
    slugNote:
      "名前の代わりに、ゲームのスラッグも使えます。スラッグは、このサイトのゲームページのアドレスの最後の部分です（例：<code>baldurs-gate-iii</code>）。",
  },

  bots: {
    heading: "ボットの設定",
    intro:
      "以下の例はどれも、現在のカテゴリを読み取って問い合わせるので、ゲームを変えても答えが追従します。チャットボットは、答えを「true」または「false」という単語で投稿します。",
    question: (game) => `${game}で死ぬことはある？`,
    streamerBot: {
      intro: "アクションに、次の2つのサブアクションをこの順番で追加します。",
      step1:
        "<strong>Twitch › User › Get User Info for Target</strong>：User Login を <code>%broadcastUserName%</code> に設定します。これでカテゴリが <code>%game%</code> に入ります。アクションがTwitchのトリガーで始まらない場合は、その前に <strong>Add Broadcaster Information</strong> を置いてください。",
      step2:
        "<strong>Core › Network › Fetch URL</strong>：Variable Name を <code>canDie</code> に設定し、URLに次のアドレスを入れます。",
      after:
        "これで <code>%canDie%</code> に <code>true</code> か <code>false</code> が入ります。答えがない場合は空になります。If/Else サブアクションで判定してください。",
    },
    nightbot: {
      intro:
        "チャットで次を送信すると、<code>!candie</code> コマンドが追加されます。",
      noAnswer:
        "答えがない場合、Nightbotは代わりに独自のエラーメッセージを投稿します。",
    },
    streamElements: {
      intro: "チャットで次を送信します。",
      noAnswer:
        "答えがない場合、StreamElementsは「The remote server returned status code 404」と投稿します。",
    },
    fossabot: {
      intro: "次を応答とするコマンドを作成します。",
      noAnswer: "答えがない場合、Fossabotは答えの部分を空欄にします。",
    },
    other: {
      heading: "その他のツール",
      text: "ウェブアドレスを取得できるツールなら何でも使えます。ブラウザソースやオーバーレイからも、どのサイトからでも呼び出せます。",
    },
  },

  matching: {
    heading: "名前の照合方法",
    intro:
      "このサイトのゲーム名はIGDBから取得しており、Twitchのカテゴリも同じIGDBが元なので、ほとんどの名前はそのまま一致します。大文字・小文字、アクセント記号、句読点は無視され、続編の番号はどちらの書き方でも構いません。「3」で「III」が、「III」で「3」が見つかります。現在、いくつかの名前は次のように返されます。",
    nameColumn: "送信した名前",
    replyColumn: "返答",
    whyColumn: "理由",
    empty: "404（空）",
    notes: {
      plain:
        "単純な名前です。大文字・小文字は区別されないので、「firewatch」や「FIREWATCH」でも大丈夫です。",
      accent:
        "アクセント記号は省略できます。「Pokemon Red Version」でも同じゲームが見つかります。",
      punctuation: "句読点は無視されるので、コロンは省略できます。",
      apostrophe:
        "アポストロフィは省略できます。「Friday Night Funkin」でも大丈夫です。",
      numeral:
        "Twitchではこのカテゴリ名に「3」を使いますが、当サイトのデータでは「III」です。ローマ数字と通常の数字は同じものとして扱われるので、Twitchの名前でも見つかります。",
      numeralReverse:
        "逆の場合も同じです。当サイトのデータでは、このゲームは「Forza Horizon 5」です。",
      slash:
        "名前にスラッシュが入っていても大丈夫です。そのままでも、%2F と書いても構いません。",
      percent:
        "パーセント記号は %25 として送る必要があります。ボットのエンコード用変数を使えば、自動的に変換されます。",
      shared:
        "同じ名前のゲームが複数あります。答えが登録されているもののうち、最も人気のあるものが返されます。",
      notGame: "ゲームではないので、答えはありません。",
      slug: "スラッグです。このサイトのゲームページのアドレスから取ったもので、必ずそのゲームだけが見つかります。",
    },
    helpQuestion: "カテゴリで何も見つからない場合は？",
    help: "<a>メインの一覧</a>でゲームを検索し、そのページのスラッグを代わりに使ってください。",
  },
};

const ko: StreamingText = {
  title: "방송에서 사용하기",
  description:
    "Nightbot, StreamElements, Fossabot 또는 Streamer.bot에서 트위치 카테고리 이름으로 그 게임에서 죽을 수 있는지 물어보세요.",
  intro:
    "트위치 카테고리 이름을 보내주시면 그 게임에서 죽을 수 있는지 알려드립니다. 봇은 그 답을 이용해 데스 카운터를 켜거나 끌 수 있습니다.",

  request: {
    heading: "요청",
    text: "주소 끝에 카테고리 이름을 붙인 GET 요청 한 번이면 됩니다. 키나 가입은 필요하지 않습니다.",
    placeholder: "카테고리 이름",
    repliesIntro: "응답은 일반 텍스트이며, 다음 세 가지 중 하나입니다:",
    yes: "이 게임에서는 죽을 수 있습니다.",
    no: "이 게임에서는 죽지 않습니다.",
    notFound: "빈 응답입니다. 해당 이름의 게임이 없거나, 아직 답이 없습니다.",
    slugNote:
      "게임 이름 대신 슬러그를 써도 됩니다. 슬러그는 이 사이트에 있는 게임 페이지 주소의 마지막 부분으로, 예를 들어 <code>baldurs-gate-iii</code>입니다.",
  },

  bots: {
    heading: "봇 설정하기",
    intro:
      "아래 예시는 현재 카테고리를 읽어 질문하므로, 게임을 바꾸면 답도 따라갑니다. 채팅 봇은 답을 “true” 또는 “false”라는 단어로 올립니다.",
    question: (game) => `${game}에서 죽나요?`,
    streamerBot: {
      intro: "액션에 다음 두 하위 작업을 이 순서로 추가하세요:",
      step1:
        "<strong>Twitch › User › Get User Info for Target</strong>에서 User Login을 <code>%broadcastUserName%</code>으로 설정합니다. 그러면 카테고리가 <code>%game%</code>에 들어갑니다. 액션이 트위치 트리거로 시작되지 않는 경우에는 그 앞에 <strong>Add Broadcaster Information</strong>을 넣으세요.",
      step2:
        "<strong>Core › Network › Fetch URL</strong>에서 Variable Name을 <code>canDie</code>로 설정하고 URL을 다음과 같이 지정합니다:",
      after:
        "그러면 <code>%canDie%</code>에 <code>true</code> 또는 <code>false</code>가 들어가며, 답이 없을 때는 비어 있습니다. If/Else 하위 작업으로 확인해 보세요.",
    },
    nightbot: {
      intro: "<code>!candie</code> 명령어를 추가하려면 채팅에 다음을 보내세요:",
      noAnswer: "답이 없으면 Nightbot이 답 대신 자체 오류 메시지를 올립니다.",
    },
    streamElements: {
      intro: "채팅에 다음을 보내세요:",
      noAnswer:
        "답이 없으면 StreamElements가 “The remote server returned status code 404”를 올립니다.",
    },
    fossabot: {
      intro: "다음을 응답으로 하는 명령어를 만드세요:",
      noAnswer: "답이 없으면 Fossabot은 답을 비워 둡니다.",
    },
    other: {
      heading: "그 밖의 도구",
      text: "웹 주소를 가져올 수 있는 도구라면 무엇이든 동작합니다. 브라우저 소스와 오버레이에서도 어느 사이트에서나 호출할 수 있습니다.",
    },
  },

  matching: {
    heading: "이름을 찾는 방법",
    intro:
      "게임 이름은 IGDB에서 가져오며, 트위치도 같은 곳에서 카테고리를 가져오므로 대부분의 이름은 그대로 일치합니다. 대소문자, 발음 구별 기호, 문장 부호는 무시되고, 속편 번호는 어느 쪽으로 써도 됩니다. “3”으로 “III”을 찾고, “III”으로 “3”을 찾습니다. 지금 몇 가지 이름이 돌려주는 값은 다음과 같습니다:",
    nameColumn: "보낸 이름",
    replyColumn: "응답",
    whyColumn: "이유",
    empty: "404, 빈 응답",
    notes: {
      plain:
        "평범한 이름입니다. 대소문자는 상관없으므로 “firewatch”와 “FIREWATCH”도 됩니다.",
      accent:
        "발음 구별 기호는 생략해도 됩니다. “Pokemon Red Version”으로도 같은 게임을 찾습니다.",
      punctuation: "문장 부호는 무시되므로 콜론은 빼도 됩니다.",
      apostrophe:
        "아포스트로피는 생략해도 됩니다. “Friday Night Funkin”도 됩니다.",
      numeral:
        "트위치는 이 카테고리를 3으로 적지만, 우리 데이터에는 III으로 있습니다. 로마 숫자와 일반 숫자를 같게 취급하므로 트위치 이름으로도 찾을 수 있습니다.",
      numeralReverse:
        "반대의 경우입니다. 우리 데이터에는 이 게임이 “Forza Horizon 5”로 있습니다.",
      slash: "이름에 있는 슬래시는 그대로 써도 되고 %2F로 써도 됩니다.",
      percent:
        "퍼센트 기호는 %25로 보내야 합니다. 봇의 인코딩 변수를 쓰면 알아서 처리해 줍니다.",
      shared:
        "여러 게임이 이 이름을 함께 씁니다. 그중 답이 있는 게임, 그리고 그중에서 가장 인기 있는 게임이 나옵니다.",
      notGame: "게임이 아니므로 답이 없습니다.",
      slug: "이 사이트의 게임 페이지 주소에서 가져온 슬러그입니다. 항상 바로 그 게임을 찾습니다.",
    },
    helpQuestion: "카테고리로 아무것도 찾지 못했나요?",
    help: "<a>전체 목록</a>에서 게임을 찾아 그 페이지의 슬러그를 대신 사용하세요.",
  },
};

const zh: StreamingText = {
  title: "在你的直播中使用",
  description:
    "通过 Twitch 分类名称查询游戏里会不会死，适用于 Nightbot、StreamElements、Fossabot 和 Streamer.bot。",
  intro:
    "把你的 Twitch 分类名称发给我们，我们会告诉你那款游戏里会不会死。你的机器人可以根据答案打开或关闭死亡计数器。",

  request: {
    heading: "请求",
    text: "只需一个 GET 请求，把分类名称放在地址末尾即可。不需要密钥，也不需要注册。",
    placeholder: "分类名称",
    repliesIntro: "回复是纯文本，只有三种情况：",
    yes: "这款游戏里会死。",
    no: "这款游戏里不会死。",
    notFound: "空回复。没有这个名称的游戏，或者我们还没有答案。",
    slugNote:
      "也可以用游戏的 slug 代替名称。slug 是本站该游戏页面地址的最后一段，例如 <code>baldurs-gate-iii</code>。",
  },

  bots: {
    heading: "设置你的机器人",
    intro:
      "下面每个示例都会读取你当前的分类并据此查询，所以换游戏时答案也会跟着变。聊天机器人会把答案发成“true”或“false”。",
    question: (game) => `《${game}》里会死吗？`,
    streamerBot: {
      intro: "按这个顺序把这两个子操作添加到一个 action 中：",
      step1:
        "<strong>Twitch › User › Get User Info for Target</strong>，把 User Login 设为 <code>%broadcastUserName%</code>。这会把你的分类放进 <code>%game%</code>。如果该 action 不是由 Twitch 触发器启动的，请在它前面加上 <strong>Add Broadcaster Information</strong>。",
      step2:
        "<strong>Core › Network › Fetch URL</strong>，把 Variable Name 设为 <code>canDie</code>，URL 设为：",
      after:
        "之后 <code>%canDie%</code> 的值为 <code>true</code>、<code>false</code>，没有答案时为空。可以用 If/Else 子操作来测试。",
    },
    nightbot: {
      intro: "在聊天中发送这条消息来添加 <code>!candie</code> 命令：",
      noAnswer: "没有答案时，Nightbot 会用它自己的错误提示代替答案。",
    },
    streamElements: {
      intro: "在聊天中发送这条消息：",
      noAnswer:
        "没有答案时，StreamElements 会发送“The remote server returned status code 404”。",
    },
    fossabot: {
      intro: "创建一个命令，并把它的回复设为：",
      noAnswer: "没有答案时，Fossabot 会留空。",
    },
    other: {
      heading: "其他工具",
      text: "任何能请求网址的工具都可以使用。浏览器源和覆盖层也能从任意网站调用它。",
    },
  },

  matching: {
    heading: "名称如何匹配",
    intro:
      "我们的游戏名称来自 IGDB，Twitch 的分类也来自同一来源，所以大多数名称可以直接匹配。大小写、变音符号和标点都会被忽略，续作编号两种写法都行：“3”能找到“III”，“III”也能找到“3”。下面是一些名称目前返回的结果：",
    nameColumn: "发送的名称",
    replyColumn: "回复",
    whyColumn: "原因",
    empty: "404，空回复",
    notes: {
      plain: "普通名称。大小写无关，所以“firewatch”和“FIREWATCH”也可以。",
      accent: "变音符号可以省略。“Pokemon Red Version”也能找到同一款游戏。",
      punctuation: "标点会被忽略，所以冒号可以不写。",
      apostrophe: "撇号可以省略。“Friday Night Funkin”同样可以。",
      numeral:
        "Twitch 把这个分类写成 3，而我们的数据里是 III。罗马数字和普通数字视为相同，所以用 Twitch 的名称也能找到。",
      numeralReverse: "反过来也一样。我们的数据里这款游戏是“Forza Horizon 5”。",
      slash: "名称中的斜杠可以照原样写，也可以写成 %2F。",
      percent: "百分号必须写成 %25。使用机器人的编码变量时，它会帮你处理。",
      shared:
        "有多款游戏同名。你会得到我们有答案的那一款，并且是其中最热门的。",
      notGame: "这不是游戏，所以没有答案。",
      slug: "取自本站游戏页面地址的 slug。它总能精确找到那款游戏。",
    },
    helpQuestion: "分类查不到结果？",
    help: "在<a>主列表</a>中搜索这款游戏，改用它页面上的 slug。",
  },
};

const it: StreamingText = {
  title: "Usalo sul tuo stream",
  description:
    "Chiedi se si può morire in un gioco partendo dal nome della sua categoria Twitch, da Nightbot, StreamElements, Fossabot o Streamer.bot.",
  intro:
    "Inviaci il nome della tua categoria Twitch e ti diremo se si può morire in quel gioco. Il tuo bot può usare la risposta per attivare o disattivare un contatore di morti.",

  request: {
    heading: "La richiesta",
    text: "È una sola richiesta GET, con il nome della categoria alla fine dell'indirizzo. Non serve né una chiave né un'iscrizione.",
    placeholder: "nome della categoria",
    repliesIntro: "La risposta è testo semplice, e può essere una di tre cose:",
    yes: "In questo gioco si può morire.",
    no: "In questo gioco non si può morire.",
    notFound:
      "Una risposta vuota. Nessun gioco ha quel nome, o non abbiamo ancora una risposta.",
    slugNote:
      "Al posto del nome funziona anche lo slug di un gioco. Lo slug è l'ultima parte dell'indirizzo della sua pagina qui, per esempio <code>baldurs-gate-iii</code>.",
  },

  bots: {
    heading: "Configurare il bot",
    intro:
      "Ogni esempio qui sotto legge la tua categoria attuale e chiede di quella, così la risposta ti segue quando cambi gioco. I bot di chat scrivono la risposta come la parola “true” o “false”.",
    question: (game) => `Si può morire in ${game}?`,
    streamerBot: {
      intro: "Aggiungi queste due sub-action a un'action, in questo ordine:",
      step1:
        "<strong>Twitch › User › Get User Info for Target</strong>, con User Login impostato su <code>%broadcastUserName%</code>. Questo mette la tua categoria in <code>%game%</code>. Se l'action non parte da un trigger Twitch, mettici davanti <strong>Add Broadcaster Information</strong>.",
      step2:
        "<strong>Core › Network › Fetch URL</strong>, con Variable Name impostato su <code>canDie</code> e questo come URL:",
      after:
        "<code>%canDie%</code> conterrà poi <code>true</code>, <code>false</code>, o nulla quando non c'è risposta. Puoi verificarlo con una sub-action If/Else.",
    },
    nightbot: {
      intro:
        "Invia questo in chat per aggiungere un comando <code>!candie</code>:",
      noAnswer:
        "Quando non c'è risposta, Nightbot scrive un proprio messaggio di errore al posto della risposta.",
    },
    streamElements: {
      intro: "Invia questo in chat:",
      noAnswer:
        "Quando non c'è risposta, StreamElements scrive “The remote server returned status code 404”.",
    },
    fossabot: {
      intro: "Crea un comando con questo come risposta:",
      noAnswer: "Quando non c'è risposta, Fossabot lascia la risposta vuota.",
    },
    other: {
      heading: "Qualsiasi altro strumento",
      text: "Funziona qualsiasi strumento in grado di richiamare un indirizzo web. Possono farlo anche le browser source e le overlay, da qualsiasi sito.",
    },
  },

  matching: {
    heading: "Come vengono abbinati i nomi",
    intro:
      "I nostri nomi dei giochi vengono da IGDB, da cui Twitch prende anche le sue categorie, quindi la maggior parte dei nomi corrisponde già così. Maiuscole, accenti e punteggiatura vengono ignorati, e il numero di un sequel si può scrivere in entrambi i modi: “3” trova “III” e “III” trova “3”. Ecco cosa restituiscono alcuni nomi in questo momento:",
    nameColumn: "Nome inviato",
    replyColumn: "Risposta",
    whyColumn: "Perché",
    empty: "404, vuota",
    notes: {
      plain:
        "Un nome semplice. Le maiuscole non contano, quindi funzionano anche “firewatch” e “FIREWATCH”.",
      accent:
        "Gli accenti sono facoltativi. “Pokemon Red Version” trova lo stesso gioco.",
      punctuation:
        "La punteggiatura viene ignorata, quindi i due punti si possono omettere.",
      apostrophe:
        "Gli apostrofi sono facoltativi. Funziona anche “Friday Night Funkin”.",
      numeral:
        "Twitch chiama questa categoria con un 3, mentre i nostri dati hanno III. I numeri romani e quelli normali sono trattati allo stesso modo, quindi il nome di Twitch lo trova comunque.",
      numeralReverse:
        "Lo stesso al contrario. Nei nostri dati questo gioco è “Forza Horizon 5”.",
      slash: "Una barra nel nome funziona, scritta così com'è o come %2F.",
      percent:
        "Il segno di percentuale va inviato come %25. I bot lo fanno per te se usi la loro variabile di codifica.",
      shared:
        "Diversi giochi hanno questo nome. Ottieni quello per cui abbiamo una risposta, e il più popolare tra quelli.",
      notGame: "Non è un gioco, quindi non c'è risposta.",
      slug: "Uno slug, preso dall'indirizzo della pagina del gioco qui. Trova sempre esattamente quel gioco.",
    },
    helpQuestion: "La categoria non trova nulla?",
    help: "Cerca il gioco nell'<a>elenco principale</a> e usa invece lo slug dalla sua pagina.",
  },
};

const ru: StreamingText = {
  title: "Используйте на своём стриме",
  description:
    "Узнайте, можно ли умереть в игре, по названию её категории на Twitch — из Nightbot, StreamElements, Fossabot или Streamer.bot.",
  intro:
    "Пришлите нам название своей категории на Twitch, и мы ответим, можно ли умереть в этой игре. Ваш бот может по этому ответу включать и выключать счётчик смертей.",

  request: {
    heading: "Запрос",
    text: "Это один GET-запрос, с названием категории в конце адреса. Ключ и регистрация не нужны.",
    placeholder: "название категории",
    repliesIntro: "Ответ приходит обычным текстом и бывает одним из трёх:",
    yes: "В этой игре можно умереть.",
    no: "В этой игре умереть нельзя.",
    notFound:
      "Пустой ответ. Игры с таким названием нет, либо у нас пока нет ответа.",
    slugNote:
      "Вместо названия подойдёт slug игры. Slug — это последняя часть адреса её страницы на этом сайте, например <code>baldurs-gate-iii</code>.",
  },

  bots: {
    heading: "Настройка бота",
    intro:
      "Каждый пример ниже читает вашу текущую категорию и спрашивает про неё, поэтому ответ меняется вместе с игрой. Чат-боты пишут ответ словом «true» или «false».",
    question: (game) => `Можно ли умереть в ${game}?`,
    streamerBot: {
      intro: "Добавьте в action эти два sub-action, в таком порядке:",
      step1:
        "<strong>Twitch › User › Get User Info for Target</strong>, где User Login задан как <code>%broadcastUserName%</code>. Это положит вашу категорию в <code>%game%</code>. Если action запускается не триггером Twitch, поставьте перед ним <strong>Add Broadcaster Information</strong>.",
      step2:
        "<strong>Core › Network › Fetch URL</strong>, где Variable Name задан как <code>canDie</code>, а URL — такой:",
      after:
        "После этого в <code>%canDie%</code> будет <code>true</code>, <code>false</code> или ничего, если ответа нет. Проверить можно sub-action If/Else.",
    },
    nightbot: {
      intro:
        "Отправьте это в чат, чтобы добавить команду <code>!candie</code>:",
      noAnswer:
        "Если ответа нет, Nightbot вместо него напишет собственное сообщение об ошибке.",
    },
    streamElements: {
      intro: "Отправьте это в чат:",
      noAnswer:
        "Если ответа нет, StreamElements напишет «The remote server returned status code 404».",
    },
    fossabot: {
      intro: "Создайте команду с таким ответом:",
      noAnswer: "Если ответа нет, Fossabot оставит ответ пустым.",
    },
    other: {
      heading: "Что-то ещё",
      text: "Подойдёт любой инструмент, умеющий запрашивать веб-адрес. Браузерные источники и оверлеи тоже могут обращаться к нему с любого сайта.",
    },
  },

  matching: {
    heading: "Как сопоставляются названия",
    intro:
      "Названия игр мы берём из IGDB, откуда Twitch берёт и свои категории, поэтому большинство названий совпадает как есть. Регистр, диакритика и знаки препинания не учитываются, а номер продолжения можно писать любым способом: «3» находит «III», а «III» находит «3». Вот что сейчас возвращают некоторые названия:",
    nameColumn: "Отправленное название",
    replyColumn: "Ответ",
    whyColumn: "Почему",
    empty: "404, пусто",
    notes: {
      plain:
        "Обычное название. Регистр не важен, поэтому «firewatch» и «FIREWATCH» тоже подойдут.",
      accent:
        "Диакритику можно не писать. «Pokemon Red Version» находит ту же игру.",
      punctuation:
        "Знаки препинания не учитываются, поэтому двоеточие можно опустить.",
      apostrophe:
        "Апострофы необязательны. «Friday Night Funkin» тоже работает.",
      numeral:
        "Twitch называет эту категорию с 3, а в наших данных стоит III. Римские и обычные числа считаются одним и тем же, поэтому название из Twitch всё равно её находит.",
      numeralReverse:
        "То же самое наоборот. В наших данных эта игра — «Forza Horizon 5».",
      slash: "Косая черта в названии работает — как есть или в виде %2F.",
      percent:
        "Знак процента нужно отправлять как %25. Боты делают это сами, если использовать их переменную кодирования.",
      shared:
        "Это название носят несколько игр. Вы получите ту, для которой у нас есть ответ, а из таких — самую популярную.",
      notGame: "Это не игра, поэтому ответа нет.",
      slug: "Slug, взятый из адреса страницы игры здесь. Он всегда находит именно эту игру.",
    },
    helpQuestion: "Категория ничего не находит?",
    help: "Найдите игру в <a>основном списке</a> и используйте slug с её страницы.",
  },
};

const ar: StreamingText = {
  title: "استخدمه في بثّك",
  description:
    "اسأل عمّا إذا كان بإمكانك أن تموت في لعبة انطلاقًا من اسم تصنيفها على Twitch، من Nightbot أو StreamElements أو Fossabot أو Streamer.bot.",
  intro:
    "أرسل لنا اسم تصنيفك على Twitch وسنخبرك ما إذا كان بإمكانك أن تموت في تلك اللعبة. ويمكن لبوتك أن يستخدم الإجابة لتشغيل عدّاد الوفيات أو إيقافه.",

  request: {
    heading: "الطلب",
    text: "طلب GET واحد، مع اسم التصنيف في نهاية العنوان. لا حاجة إلى مفتاح ولا إلى تسجيل.",
    placeholder: "اسم التصنيف",
    repliesIntro: "الرد نص عادي، وهو واحد من ثلاثة:",
    yes: "يمكنك أن تموت في هذه اللعبة.",
    no: "لا يمكنك أن تموت في هذه اللعبة.",
    notFound: "رد فارغ. لا توجد لعبة بهذا الاسم، أو ليست لدينا إجابة بعد.",
    slugNote:
      "يصلح المعرّف النصّي للعبة بدلًا من اسمها. وهو الجزء الأخير من عنوان صفحة اللعبة هنا، مثل <code>baldurs-gate-iii</code>.",
  },

  bots: {
    heading: "إعداد البوت",
    intro:
      "كل مثال أدناه يقرأ تصنيفك الحالي ويسأل عنه، فتتبعك الإجابة عند تغيير اللعبة. وتنشر بوتات الدردشة الإجابة بكلمة “true” أو “false”.",
    question: (game) => `هل يمكن أن تموت في ${game}؟`,
    streamerBot: {
      intro: "أضف هذين الإجراءين الفرعيين إلى إجراء واحد، بهذا الترتيب:",
      step1:
        "<strong>Twitch › User › Get User Info for Target</strong>، مع ضبط User Login على <code>%broadcastUserName%</code>. يضع هذا تصنيفك في <code>%game%</code>. وإن لم يكن الإجراء مبدوءًا بمشغّل من Twitch، فضع <strong>Add Broadcaster Information</strong> قبله.",
      step2:
        "<strong>Core › Network › Fetch URL</strong>، مع ضبط Variable Name على <code>canDie</code> وهذا هو العنوان:",
      after:
        "عندها يحمل <code>%canDie%</code> القيمة <code>true</code> أو <code>false</code>، أو لا شيء عند غياب الإجابة. جرّبه بإجراء فرعي If/Else.",
    },
    nightbot: {
      intro: "أرسل هذا في دردشتك لإضافة أمر <code>!candie</code>:",
      noAnswer: "عند غياب الإجابة، ينشر Nightbot رسالة خطأ خاصة به بدلًا منها.",
    },
    streamElements: {
      intro: "أرسل هذا في دردشتك:",
      noAnswer:
        "عند غياب الإجابة، ينشر StreamElements “The remote server returned status code 404”.",
    },
    fossabot: {
      intro: "أنشئ أمرًا يكون هذا هو ردّه:",
      noAnswer: "عند غياب الإجابة، يترك Fossabot الرد فارغًا.",
    },
    other: {
      heading: "أي أداة أخرى",
      text: "تصلح أي أداة تستطيع جلب عنوان وِب. ويمكن لمصادر المتصفح والطبقات أن تستدعيه أيضًا، من أي موقع.",
    },
  },

  matching: {
    heading: "كيف تُطابَق الأسماء",
    intro:
      "تأتي أسماء الألعاب لدينا من IGDB، وهي المصدر نفسه الذي يأخذ منه Twitch تصنيفاته، فتتطابق معظم الأسماء كما هي. وتُتجاهل حالة الأحرف والعلامات وعلامات الترقيم، ويمكن كتابة رقم الجزء بأي من الطريقتين: فـ“3” تجد “III”، و“III” تجد “3”. وهذا ما تعيده بعض الأسماء الآن:",
    nameColumn: "الاسم المُرسل",
    replyColumn: "الرد",
    whyColumn: "السبب",
    empty: "404، فارغ",
    notes: {
      plain:
        "اسم عادي. حالة الأحرف لا تهم، فتصلح “firewatch” و“FIREWATCH” أيضًا.",
      accent: "العلامات اختيارية. فـ“Pokemon Red Version” تجد اللعبة نفسها.",
      punctuation: "تُتجاهل علامات الترقيم، فيمكن حذف النقطتين.",
      apostrophe: "الفاصلة العليا اختيارية. و“Friday Night Funkin” تصلح كذلك.",
      numeral:
        "يسمّي Twitch هذا التصنيف بالرقم 3، بينما في بياناتنا III. وتُعامل الأرقام الرومانية والعادية على أنها سواء، فيجدها اسم Twitch رغم ذلك.",
      numeralReverse:
        "والعكس كذلك. ففي بياناتنا هذه اللعبة باسم “Forza Horizon 5”.",
      slash: "تصلح الشرطة المائلة في الاسم، مكتوبة كما هي أو على هيئة %2F.",
      percent:
        "يجب إرسال علامة النسبة المئوية على هيئة %25. وتفعل البوتات ذلك نيابة عنك عند استخدام متغيّر الترميز لديها.",
      shared:
        "تتشارك عدة ألعاب هذا الاسم. فتحصل على التي لدينا إجابة عنها، وأشهرها بينها.",
      notGame: "ليست لعبة، فلا توجد إجابة.",
      slug: "معرّف نصّي مأخوذ من عنوان صفحة اللعبة هنا. وهو يجد تلك اللعبة بعينها دائمًا.",
    },
    helpQuestion: "ألا يجد التصنيف شيئًا؟",
    help: "ابحث عن اللعبة في <a>القائمة الرئيسية</a> واستخدم المعرّف النصّي من صفحتها بدلًا من ذلك.",
  },
};

const text: Record<Locale, StreamingText> = {
  en,
  fr,
  es,
  de,
  ja,
  ko,
  zh,
  it,
  ru,
  ar,
};

/** The streaming guide's text in a language. */
export const streamingTextFor = (locale: Locale): StreamingText => text[locale];
