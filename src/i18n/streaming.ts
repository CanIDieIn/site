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

const text: Record<Locale, StreamingText> = { en, fr, es, de, ja };

/** The streaming guide's text in a language. */
export const streamingTextFor = (locale: Locale): StreamingText => text[locale];
