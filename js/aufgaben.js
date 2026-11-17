/*
 * Lernapp „Rechnen mit Potenzen“ (Jahrgang 10) – Abschnitte, Übungen und Tests zur Selbstkontrolle.
 * Die Buchangaben (seiten, buch) erscheinen nur in der Lehrkräfte-Übersicht, nicht in der App.
 *
 * Grundlage: Elemente der Mathematik 10 (Niedersachsen G9), Kapitel 2, S. 44–71.
 * Aufbau und Aufgabenarten orientieren sich am Buch; Texte und Zahlen sind eigene.
 *
 * Teilaufgabe:
 *   typ     "zahl" (Standard), "wiss" (Vorfaktor und Exponent getrennt) oder "auswahl"
 *   wert    exakter Sollwert; loesung: Anzeige der Lösung (sonst aus wert)
 *   pruef   sympy-Ausdruck für die unabhängige Nachrechnung (tools/nachrechnen.py)
 *   toleranz  relative Abweichung bei Sachaufgaben (sonst exakt bzw. gerundet)
 *   vor     Text direkt vor dem Eingabefeld, z. B. „2 hoch“
 *   thema   Schlüssel in THEMEN; daraus entstehen Wiederholungshinweise
 */
(function () {
  // ───────────── Darstellung ─────────────
  const mz = (x) => String(x).replace(/-/g, "−");
  const P = (b, e) => `${b}<sup>${mz(e)}</sup>`;
  const B = (z, n) => `<span class="bruch"><span>${z}</span><span>${n}</span></span>`;
  const W = (n, x) => `<span class="wurzel">${n === 2 ? "" : `<sup class="index">${n}</sup>`}√<span class="radikand">${x}</span></span>`;
  // Zahl auf Deutsch: Komma, schmales Leerzeichen bei Tausendern, echtes Minus
  function zf(x, stellen = 6) {
    const s = Number(x).toLocaleString("de-DE", { maximumFractionDigits: stellen, useGrouping: true }).replace(/\./g, " ").replace("-", "−");
    const [ganz, komma] = s.split(",");
    return komma === undefined ? ganz : `${ganz},${komma.replace(/(\d{3})(?=\d)/g, "$1 ")}`;
  }
  const WS = (a, n) => `${zf(a)} · 10<sup>${mz(n)}</sup>`;

  // ───────────── Abschnitte ─────────────
  const ABSCHNITTE = [
    {
      id: 1, nr: "1", titel: "Potenzen mit ganzzahligen Exponenten", seiten: "S. 44–48 (Einstieg S. 43)",
      merke: `<p>Für eine Zahl a und eine natürliche Zahl n ≥ 2 ist ${P("a", "n")} = a · a · … · a (n Faktoren). Dazu gilt ${P("a", 1)} = a und für a ≠ 0 auch ${P("a", 0)} = 1.</p>
        <p>Für a ≠ 0 gilt ${P("a", "−n")} = ${B(1, P("a", "n"))}. Ein negativer Exponent bedeutet also: Kehrwert der Potenz mit positivem Exponenten, nicht „negative Zahl“: ${P(2, -3)} = ${B(1, 8)}.</p>
        <p>Achte auf Klammern: ${P("(−3)", 2)} = 9, aber −${P(3, 2)} = −9.</p>`,
      buch: "Information S. 44–45, Übungen S. 46 Nr. 2, 3, 6, 8, 9; S. 47 Nr. 13, 16; S. 48 Nr. 23"
    },
    {
      id: 2, nr: "2", titel: "Zahlen mit abgetrennten Zehnerpotenzen", seiten: "S. 49–51 und 62–63",
      merke: `<p>Sehr große und sehr kleine Zahlen schreibt man als Vorfaktor a mit 1 ≤ a < 10 mal Zehnerpotenz (1 ist erlaubt, 10 nicht: 10 · ${P(10, 3)} schreibt man als 1 · ${P(10, 4)}):</p>
        <p class="formel">52 000 = ${WS(5.2, 4)} &nbsp;&nbsp; 0,0034 = ${WS(3.4, -3)}</p>
        <p>Der Exponent gibt an, um wie viele Stellen das Komma verschoben wird: positiv bei großen Zahlen, negativ bei Zahlen zwischen 0 und 1.</p>
        <p>Vorsilben: Kilo ${P(10, 3)}, Mega ${P(10, 6)}, Giga ${P(10, 9)}, Tera ${P(10, 12)}; Milli ${P(10, -3)}, Mikro ${P(10, -6)}, Nano ${P(10, -9)}. Kleine Anteile: 1 ppm = ${P(10, -6)}, 1 ppb = ${P(10, -9)}.</p>`,
      buch: "Selbstlernseiten S. 49–51 mit Nr. 1–3, 5, 7–9, 11; Im Blickpunkt S. 62–63 Nr. 2, 3"
    },
    {
      id: 3, nr: "3", titel: "Potenzen mit rationalen Exponenten", seiten: "S. 52–59",
      merke: `<p>Für a ≥ 0 ist ${W("n", "a")} die nichtnegative Zahl, deren n-te Potenz a ergibt: ${W(3, 64)} = 4, denn ${P(4, 3)} = 64.</p>
        <p>Für a ≥ 0 gilt ${P("a", "1/n")} = ${W("n", "a")}, und für a > 0, m ∈ ℤ und n ∈ ℕ mit n ≥ 2 gilt ${P("a", "m/n")} = ${W("n", P("a", "m"))} = ${P(`(${W("n", "a")})`, "m")}.</p>
        <p>Rechentipp: zuerst die Wurzel ziehen, dann potenzieren: ${P(8, "2/3")} = ${P("(∛8)", 2)} = ${P(2, 2)} = 4.</p>`,
      buch: "Information S. 53–54 und 57, Übungen S. 55 Nr. 4, 5, 9; S. 58 Nr. 4–7; S. 59 Nr. 8, 11, 14"
    },
    {
      id: 4, nr: "4", titel: "Potenzgesetze und ihre Anwendung", seiten: "S. 64–71",
      merke: `<p>Die Gesetze gelten für ganzzahlige Exponenten, wenn die Basen ≠ 0 sind, und für rationale Exponenten, wenn die Basen > 0 sind.</p>
        <p><b>P1</b> gleiche Basis: ${P("a", "m")} · ${P("a", "n")} = ${P("a", "m+n")} und ${P("a", "m")} : ${P("a", "n")} = ${P("a", "m−n")}</p>
        <p><b>P2</b> gleicher Exponent: ${P("a", "n")} · ${P("b", "n")} = ${P("(a · b)", "n")} und ${P("a", "n")} : ${P("b", "n")} = ${P("(a : b)", "n")}</p>
        <p><b>P3</b> Potenz einer Potenz: ${P(`(${P("a", "m")})`, "n")} = ${P("a", "m · n")}</p>
        <p>Summen und Differenzen lassen sich nur zusammenfassen, wenn die Glieder gleichartig sind: 3${P("a", "n")} + 5${P("a", "n")} = 8${P("a", "n")}, aber ${P(2, 3)} + ${P(4, 3)} ≠ ${P(6, 3)}. Auch ${P("(a + b)", "n")} ist nicht ${P("a", "n")} + ${P("b", "n")}.</p>`,
      buch: "Information S. 64 und 66, Übungen S. 67 Nr. 6, 7; S. 68 Nr. 9, 13, 14; S. 69 Nr. 19, 20; S. 70 Nr. 26, 28"
    }
  ];

  // ───────────── Themen für Rückmeldung und Wiederholung ─────────────
  const THEMEN = {
    nat: { abschnitt: 1, name: "Potenzen mit natürlichen Exponenten", merke: `${P("a", "n")} ist ein Produkt aus n gleichen Faktoren a. Bei negativer Basis entscheidet der Exponent über das Vorzeichen: gerade → positiv, ungerade → negativ.`, tipps: [`Klammer beachten: ${P("(−2)", 4)} = 16, aber −${P(2, 4)} = −16.`, "Brüche: Zähler und Nenner einzeln potenzieren."], buch: "S. 44 (1) und S. 46 Nr. 2, 8" },
    neg: { abschnitt: 1, name: "Negative Exponenten", merke: `${P("a", "−n")} = ${B(1, P("a", "n"))} für a ≠ 0. Bei Brüchen (a, b ≠ 0): ${P(`(${B("a", "b")})`, "−n")} = ${P(`(${B("b", "a")})`, "n")}.`, tipps: [`${P(3, -2)} ist positiv: ${B(1, 9)}, nicht −9.`, `${P(0, -1)} ist nicht definiert.`], buch: "S. 45 (2) und S. 46 Nr. 6, 9; S. 47 Nr. 13" },
    null: { abschnitt: 1, name: "Exponent null", merke: `${P("a", 0)} = 1 für jede Zahl a ≠ 0.`, tipps: [`${P(7, 0)} = 1, nicht 0 und nicht 7.`], buch: "S. 44 Definition und S. 46 Nr. 6" },
    zehn: { abschnitt: 1, name: "Zehnerpotenzen und Vorsilben", merke: `${P(10, "n")} ist eine 1 mit n Nullen, ${P(10, "−n")} hat die 1 an der n-ten Stelle nach dem Komma.`, tipps: ["Mikro (µ) = 10⁻⁶, Nano = 10⁻⁹, Giga = 10⁹, Tera = 10¹²."], buch: "S. 45 (3), (4) und S. 46 Nr. 2" },
    gross: { abschnitt: 2, name: "Große Zahlen mit Zehnerpotenz", merke: `Vorfaktor a mit 1 ≤ a < 10, Exponent = Anzahl der Stellen, um die das Komma nach rechts wandert: 38 000 = ${WS(3.8, 4)}.`, tipps: [`${WS(38, 3)} hat den richtigen Wert, aber der Vorfaktor 38 ist nicht kleiner als 10.`], buch: "S. 49 Beispiel und Nr. 1, 3" },
    klein: { abschnitt: 2, name: "Kleine Zahlen mit Zehnerpotenz", merke: `Bei Zahlen zwischen 0 und 1 ist der Exponent negativ: 0,0052 = ${WS(5.2, -3)}.`, tipps: ["Verschiebe das Komma nach rechts, bis genau eine von null verschiedene Ziffer davor steht. Die Anzahl der Stellen ist der Betrag des Exponenten."], buch: "S. 49 und S. 50 Nr. 7, 8; S. 51 Nr. 9" },
    einheit: { abschnitt: 2, name: "Vorsilben und Anteile (ppm, ppb)", merke: `Vorsilbe durch Zehnerpotenz ersetzen: 40 µm = 40 · ${P(10, -6)} m = ${WS(4, -5)} m. 1 ppm = ${P(10, -6)}, 1 ppb = ${P(10, -9)}.`, tipps: ["Billion im Englischen = Milliarde im Deutschen."], buch: "S. 45 Tabelle, S. 51 Nr. 11, 12; S. 62–63" },
    sach: { abschnitt: 2, name: "Sachaufgaben mit Zehnerpotenzen", merke: `Vorfaktoren und Zehnerpotenzen getrennt verrechnen: (3 · ${P(10, 5)}) · (6 · ${P(10, 1)}) = 18 · ${P(10, 6)} = ${WS(1.8, 7)}.`, tipps: ["Am Ende den Vorfaktor wieder in den Bereich 1 ≤ a < 10 bringen.", "Einheiten mitschreiben."], buch: "S. 50 Nr. 5, 6; S. 63 Nr. 3, 5" },
    wurzel: { abschnitt: 3, name: "n-te Wurzeln", merke: `${W("n", "a")} ist für a ≥ 0 die nichtnegative Zahl, deren n-te Potenz a ist.`, tipps: [`${W(4, 16)} = 2, nicht ±2.`, "Bekannte Potenzen helfen: 2⁵ = 32, 3⁴ = 81, 5³ = 125."], buch: "S. 53 Definition und S. 55 Nr. 4, 5, 6" },
    stamm: { abschnitt: 3, name: "Stammbrüche als Exponenten", merke: `${P("a", "1/n")} = ${W("n", "a")} für a ≥ 0.`, tipps: [`${P(9, "1/2")} = 3, nicht 4,5.`], buch: "S. 54 Definition und S. 55 Nr. 9" },
    rational: { abschnitt: 3, name: "Rationale Exponenten", merke: `${P("a", "m/n")} = ${P(`(${W("n", "a")})`, "m")} für a > 0. Negativer Exponent: zusätzlich den Kehrwert bilden.`, tipps: ["Erst Wurzel, dann Potenz: kleinere Zahlen.", "Dezimalexponenten in Brüche umwandeln: 0,6 = 3/5."], buch: "S. 57 Definition und S. 59 Nr. 8, 11" },
    umform: { abschnitt: 3, name: "Wurzel- und Potenzschreibweise", merke: `${W("n", P("x", "m"))} = ${P("x", "m/n")}: Der Wurzelexponent wird zum Nenner.`, tipps: [`${B(1, W(2, "x"))} = ${P("x", "−1/2")}`], buch: "S. 58 Nr. 4–7; S. 59 Nr. 14, 15" },
    p1: { abschnitt: 4, name: "Potenzgesetz P1 (gleiche Basis)", merke: `${P("a", "m")} · ${P("a", "n")} = ${P("a", "m+n")}, ${P("a", "m")} : ${P("a", "n")} = ${P("a", "m−n")}`, tipps: [`Die Basis bleibt: ${P(4, 3)} · ${P(4, 2)} = ${P(4, 5)}, nicht ${P(16, 5)}.`], buch: "S. 64 und S. 67 Nr. 6, 7" },
    p2: { abschnitt: 4, name: "Potenzgesetz P2 (gleicher Exponent)", merke: `${P("a", "n")} · ${P("b", "n")} = ${P("(ab)", "n")}`, tipps: ["Passende Partner suchen, deren Produkt eine glatte Zahl ist (2 · 5, 4 · 25)."], buch: "S. 66 und S. 68 Nr. 13" },
    p3: { abschnitt: 4, name: "Potenzgesetz P3 (Potenz einer Potenz)", merke: `${P(`(${P("a", "m")})`, "n")} = ${P("a", "m · n")}`, tipps: [`${P(`(${P(2, 3)})`, 2)} = ${P(2, 6)}, nicht ${P(2, 5)}.`], buch: "S. 66 und S. 69 Nr. 19, 20; S. 70 Nr. 26" },
    summe: { abschnitt: 4, name: "Summen von Potenzen", merke: `Nur gleichartige Glieder zusammenfassen: ${P(2, 5)} + ${P(2, 5)} = 2 · ${P(2, 5)} = ${P(2, 6)}.`, tipps: [`${P(2, 3)} + ${P(4, 3)} ≠ ${P(6, 3)}: Für Summen gibt es kein Potenzgesetz.`, `${P("(2 + 3)", 2)} = 25, nicht ${P(2, 2)} + ${P(3, 2)} = 13.`], buch: "S. 67 (Addieren und Subtrahieren) und S. 68 Nr. 14" },
    vw_pot: { abschnitt: 0, name: "Vorwissen: Potenzen", merke: `${P("a", "n")} = a · a · … · a (n Faktoren). Klammern beachten: ${P("(−3)", 2)} = 9, aber −${P(3, 2)} = −9.`, tipps: [`${P(2, 5)} ist nicht 2 · 5.`], buch: "Wiederholung aus Klasse 9" },
    vw_wurzel: { abschnitt: 0, name: "Vorwissen: Quadratwurzeln", merke: `${W(2, "a")} (a ≥ 0) ist die nichtnegative Zahl, deren Quadrat a ist: ${W(2, 49)} = 7. Bei Brüchen: Wurzel aus Zähler und Nenner.`, tipps: ["Quadratzahlen bis 20 · 20 = 400 helfen.", `${W(2, 49)} ist nicht 49 : 2.`], buch: "Wiederholung aus Klasse 9" },
    vw_bruch: { abschnitt: 0, name: "Vorwissen: Bruchrechnung", merke: `Brüche multiplizieren: Zähler mal Zähler, Nenner mal Nenner. Potenzieren: Zähler und Nenner einzeln potenzieren.`, tipps: ["Vor dem Multiplizieren kürzen spart Arbeit.", `${P(`(${B(2, 3)})`, 2)} = ${B(4, 9)}, nicht ${B(4, 3)}.`], buch: "Wiederholung aus Klasse 9" },
    terme: { abschnitt: 4, name: "Terme mit Variablen", merke: "Gesetze nacheinander anwenden: erst Klammern (P2, P3), dann gleiche Basen zusammenfassen (P1).", tipps: ["Bei Wurzeln und Brüchen im Exponenten gilt die Bedingung x > 0."], buch: "S. 68 Nr. 9, 10; S. 71 Nr. 39, 41" }
  };

  // ───────────── Comics ─────────────
  // Je Potenzregel ein Comic (erstellt mit Canva, Beispiele mit sympy geprüft).
  // Der Fehlerkobold Patzi macht den typischen Fehler, eine Zahlenfigur stellt ihn richtig.
  // Die Bilder liegen in comics/; fehlt eine Datei, blendet die App das Comic aus.
  const COMICS = [
    { nr: 1, thema: "p1", titel: "Gleiche Basis: Exponenten addieren", alt: "Comic: Patzi rechnet 2³ · 2⁴ = 4⁷. Richtig ist 2³ · 2⁴ = 2⁷ = 128, denn die Basis bleibt gleich und die Exponenten werden addiert." },
    { nr: 2, thema: "p1", titel: "Gleiche Basis: Exponenten subtrahieren", alt: "Comic: Patzi teilt bei 5⁶ : 5⁴ die Exponenten. Richtig ist 5⁶ : 5⁴ = 5² = 25, denn beim Dividieren werden die Exponenten subtrahiert." },
    { nr: 3, thema: "p2", titel: "Gleicher Exponent: Basen zusammenfassen", alt: "Comic: Patzi rechnet 2³ · 5³ = 10⁶. Richtig ist 2³ · 5³ = 10³ = 1000 und 12² : 4² = 3² = 9." },
    { nr: 4, thema: "p3", titel: "Potenz einer Potenz: Exponenten multiplizieren", alt: "Comic: Patzi rechnet (2³)² = 2⁵. Richtig ist (2³)² = 2³ · 2³ = 2⁶ = 64." },
    { nr: 5, thema: "null", titel: "Exponent null: Es kommt 1 heraus", alt: "Comic: Die Treppe 2³ = 8, 2² = 4, 2¹ = 2 zeigt, dass jede Stufe durch 2 teilt. Deshalb ist 2⁰ = 1, nicht 0. Merke: a⁰ = 1 für a ≠ 0." },
    { nr: 6, thema: "neg", titel: "Negative Exponenten: Kehrwert bilden", alt: "Comic: Die Treppe geht weiter mit 2⁻¹ = 1/2, 2⁻² = 1/4, 2⁻³ = 1/8. Patzi meint, 2⁻² sei −4. Merke: a⁻ⁿ = 1/aⁿ für a ≠ 0." },
    { nr: 7, thema: "summe", titel: "Achtung, Plus-Falle!", alt: "Comic: Patzi rechnet 2³ + 2⁴ = 2⁷. Nachrechnen ergibt 8 + 16 = 24, aber 2⁷ = 128. Merke: Für Summen gibt es kein Potenzgesetz." }
  ].map((c) => ({ ...c, bild: `comics/comic-${c.nr}.png` }));

  // ───────────── Comic-Geschichte ─────────────
  // Rahmenhandlung, die die sieben Comics zu einer Detektivgeschichte verbindet (Übersicht, vor den Abschnitten).
  // Jeder Fall hat einen Detektiv-Check mit drei Antworten; richtig ist der Eintrag mit Index „richtig“.
  // Werte mit sympy nachgerechnet: 2⁵·2³ = 2⁸, 3⁷:3² = 3⁵, 4²·25² = 100² = 10 000, (5²)⁴ = 5⁸, 7⁰ = 1, 10⁻³ = 1/1000, 3² + 3² = 18.
  const COMIC_STORY = {
    titel: "Patzi und die Potenz-Pannen",
    untertitel: "Eine Detektivgeschichte in sieben Fällen",
    intro: [
      "Alarm im Rechenwerk von Potenzhausen! Der Fehlerkobold Patzi ist aus einem alten Klassenarbeitsheft entwischt. Seitdem schleicht er durch die Stadt und flüstert den Zahlen falsche Rechenregeln ins Ohr.",
      "Die Zahlenfiguren sind ratlos. Die Bürgermeisterin, eine ziemlich gestresste 10, hat nur noch eine Hoffnung: dich. Ab sofort ermittelst du als Fehlerdetektivin oder Fehlerdetektiv.",
      "Sieben Fälle, sieben Regeln. Lies jeden Comic genau, entlarve Patzis Trick und beweise mit dem Detektiv-Check, dass du ihn durchschaut hast. Jede gelöste Regel landet als Beweisstück in deinem Merkheft."
    ],
    faelle: [
      { comic: 1, ort: "Die Party der Zweien",
        vorher: "Erster Einsatz: Im Festsaal treffen drei Zweien auf vier Zweien und wollen zusammen feiern. Patzi steht am Eingang und hat eine „geniale Abkürzung“, wie man die Gäste zählt.",
        nachher: "Patzi hat einfach die Basen addiert. Dabei wird nur gezählt, wie viele Zweien insgesamt da sind: 3 + 4 = 7. Die Basis bleibt 2. Erwischt! Patzi schlüpft durch die Hintertür und rennt Richtung Bahnhof.",
        check: { frage: "Wie viel ist 2⁵ · 2³?", optionen: ["2⁸", "4⁸", "2¹⁵"], richtig: 0, erklaerung: "Gleiche Basis, also Exponenten addieren: 5 + 3 = 8. Die Basis bleibt 2." } },
      { comic: 2, ort: "Kürzen am Bahnhof",
        vorher: "Am Bahnhof soll ein Zug mit sechs Fünfen durch einen Zug mit vier Fünfen geteilt werden. Patzi sitzt am Fahrkartenschalter und rechnet die Fahrpreise mit seiner eigenen Methode aus.",
        nachher: "Teilen heißt hier kürzen: Vier Fünfen fallen weg, zwei bleiben übrig. Die Exponenten werden subtrahiert, nicht geteilt. Patzi springt auf den letzten Waggon und fährt ins Rathaus.",
        check: { frage: "Wie viel ist 3⁷ : 3²?", optionen: ["3⁹", "3⁵", "1⁵"], richtig: 1, erklaerung: "Gleiche Basis beim Dividieren: Exponenten subtrahieren, 7 − 2 = 5. Die Basis 3 bleibt." } },
      { comic: 3, ort: "Die Fusion im Rathaus",
        vorher: "Im Rathaus wollen sich eine 2 und eine 5 zusammenschließen. Beide tragen den Exponenten 3. Patzi hat den Vertrag schon aufgesetzt, mit sehr kleinem Kleingedruckten.",
        nachher: "Bei gleichem Exponenten dürfen sich die Basen zusammentun: 2 · 5 = 10. Der Exponent bleibt aber 3. Patzis Vertrag ist ungültig. Wütend verschwindet er in der Druckerei nebenan.",
        check: { frage: "Wie viel ist 4² · 25²?", optionen: ["100²", "100⁴", "29²"], richtig: 0, erklaerung: "Gleicher Exponent, also Basen multiplizieren: 4 · 25 = 100. Der Exponent bleibt 2, also 100² = 10 000." } },
      { comic: 4, ort: "Die Kopiermaschine",
        vorher: "In der Druckerei steht eine Kopiermaschine. Steckt man (2³) hinein und drückt „hoch 2“, kommen zwei Kopien heraus. Patzi hat heimlich am Zählwerk geschraubt.",
        nachher: "Zwei Kopien von 2³ sind 2³ · 2³ = 2⁶. Bei einer Potenz einer Potenz werden die Exponenten multipliziert. Patzi flieht ins Treppenhaus und nimmt immer zwei Stufen auf einmal.",
        check: { frage: "Wie viel ist (5²)⁴?", optionen: ["5⁶", "5¹⁶", "5⁸"], richtig: 2, erklaerung: "Potenz einer Potenz: Exponenten multiplizieren, 2 · 4 = 8." } },
      { comic: 5, ort: "Die Treppe nach unten",
        vorher: "Auf jeder Stufe des Treppenhauses steht eine Zweierpotenz, und mit jeder Stufe nach unten wird der Exponent um 1 kleiner. Unten ruft Patzi triumphierend: „Bei 2⁰ ist nichts mehr übrig, also 0!“",
        nachher: "Jede Stufe nach unten teilt durch 2: 8, 4, 2 und dann 1. Also ist 2⁰ = 1 und nicht 0. Doch die Treppe ist noch nicht zu Ende. Patzi verschwindet durch eine Tür in den Keller.",
        check: { frage: "Wie viel ist 7⁰?", optionen: ["0", "1", "7"], richtig: 1, erklaerung: "Für jede Basis a ≠ 0 gilt a⁰ = 1." } },
      { comic: 6, ort: "Im Keller der Kehrwerte",
        vorher: "Im Keller wird es dunkel, und die Exponenten werden negativ. Patzi hofft, dass du dich hier unten im Minus verirrst.",
        nachher: "Die Treppe teilt einfach weiter durch 2: 1/2, 1/4, 1/8. Ein negativer Exponent macht die Zahl nicht negativ, er bildet den Kehrwert. Patzi bleibt nur noch ein Fluchtweg: die Plus-Brücke.",
        check: { frage: "Wie viel ist 10⁻³?", optionen: ["−1000", "1/1000", "−30"], richtig: 1, erklaerung: "Negativer Exponent heißt Kehrwert: 10⁻³ = 1/10³ = 1/1000 = 0,001." } },
      { comic: 7, ort: "Die Plus-Falle",
        vorher: "Showdown auf der Plus-Brücke! Hier hat Patzi seine gemeinste Falle gebaut. Er wettet, dass auch du darauf hereinfällst.",
        nachher: "Bei Plus gibt es kein Potenzgesetz. Erst ausrechnen, dann addieren: 8 + 16 = 24. Patzi tritt rückwärts in seine eigene Falle und plumpst zurück ins Klassenarbeitsheft. Klappe zu!",
        check: { frage: "Wie viel ist 3² + 3²?", optionen: ["3⁴", "18", "9⁴"], richtig: 1, erklaerung: "Erst ausrechnen: 9 + 9 = 18. Gleiche Potenzen darfst du zusammenfassen: 3² + 3² = 2 · 3² = 18. Aber 3⁴ wäre 81." } }
    ],
    schluss: [
      "Fall abgeschlossen! Patzi sitzt wieder im Heft und schmollt. Die Bürgermeisterin verleiht dir das Abzeichen „Meisterdetektiv der Potenzen“.",
      "Aber Vorsicht: Kobolde sind zäh. In den Übungen und Tests wird Patzi es bestimmt noch einmal versuchen. Mit den sieben Beweisstücken in deinem Merkheft bist du vorbereitet."
    ],
    // HTML mit <sup>, weil Hochzahlen wie ⁿ und ᵐ nicht in jeder Schrift sauber erscheinen
    merkheft: [
      "a<sup>m</sup> · a<sup>n</sup> = a<sup>m+n</sup>", "a<sup>m</sup> : a<sup>n</sup> = a<sup>m−n</sup> (a ≠ 0)",
      "a<sup>n</sup> · b<sup>n</sup> = (a · b)<sup>n</sup> und a<sup>n</sup> : b<sup>n</sup> = (a : b)<sup>n</sup> (b ≠ 0)",
      "(a<sup>m</sup>)<sup>n</sup> = a<sup>m·n</sup>", "a<sup>0</sup> = 1 (a ≠ 0)", "a<sup>−n</sup> = 1/a<sup>n</sup> (a ≠ 0)",
      "Für Summen gibt es kein Potenzgesetz: erst ausrechnen!"
    ]
  };

  const NIVEAUS = { 1: "Basis", 2: "Standard", 3: "Vertiefung" };

  // ───────────── Übungen ─────────────
  // Je Abschnitt fünf Übungen; id "Abschnitt-Nummer".
  // Hilfen nach dem Muster: Hilfe 1 = Frage oder Strategie, Hilfe 2 = entscheidender Schritt (Gutachten B5).
  // fehler: typische Fehleingaben mit gezielter Rückmeldung (B6).
  const UEBUNGEN = [
    // ── Abschnitt 1 ──
    {
      id: "1-1", abschnitt: 1, niveau: 1, titel: "Potenzen mit natürlichen Exponenten",
      einleitung: `Eine Potenz ${P("a", "n")} ist ein Produkt aus n gleichen Faktoren a. Berechne ohne Taschenrechner. Brüche darfst du als Bruch (z. B. 3/4) oder als Dezimalzahl eingeben.`,
      teile: [
        { id: "a", thema: "nat", text: `${P(2, 6)}`, wert: 64, pruef: "I(2)**6",
          hilfen: ["Wie viele Faktoren 2 werden miteinander multipliziert?", "Verdopple sechsmal, beginnend bei 1: 2, 4, 8, …"],
          fehler: [{ wert: 12, text: `${P(2, 6)} ist nicht 2 · 6. Der Exponent gibt an, wie viele Faktoren 2 multipliziert werden.` }],
          weg: `${P(2, 6)} = 2 · 2 · 2 · 2 · 2 · 2 = 64` },
        { id: "b", thema: "nat", text: `${P("(−3)", 4)}`, wert: 81, pruef: "I(-3)**4",
          hilfen: ["Gehört das Minuszeichen zur Basis? Achte auf die Klammer.", "Viermal der Faktor −3: Bei einer geraden Anzahl negativer Faktoren ist das Produkt positiv."],
          fehler: [{ wert: -81, text: "Die Klammer gehört zur Basis. Bei vier negativen Faktoren ist das Produkt positiv." }, { wert: -12, text: "Der Exponent gibt die Anzahl der Faktoren an, er wird nicht mit der Basis multipliziert." }],
          weg: `${P("(−3)", 4)} = (−3) · (−3) · (−3) · (−3) = 81` },
        { id: "c", thema: "nat", text: `−${P(3, 4)}`, wert: -81, pruef: "-I(3)**4",
          hilfen: ["Gehört das Minuszeichen hier zur Basis? Es steht keine Klammer.", `Berechne zuerst ${P(3, 4)} und setze dann das Minus davor.`],
          fehler: [{ wert: 81, text: `Ohne Klammer gehört das Minus nicht zur Basis: −${P(3, 4)} = −(${P(3, 4)}).` }],
          weg: `−${P(3, 4)} = −(3 · 3 · 3 · 3) = −81` },
        { id: "d", thema: "nat", text: `${P(`(${B(2, 3)})`, 3)}`, wert: 8 / 27, loesung: "8/27 ≈ 0,30", pruef: "R(2,3)**3",
          hilfen: ["Was geschieht mit Zähler und Nenner, wenn man einen Bruch potenziert?", `Potenziere Zähler und Nenner einzeln: ${P(2, 3)} und ${P(3, 3)}.`],
          fehler: [{ wert: 8 / 3, text: "Auch der Nenner wird potenziert." }, { wert: 2, text: `${P(`(${B(2, 3)})`, 3)} ist nicht ${B(2, 3)} · 3.` }],
          weg: `${P(`(${B(2, 3)})`, 3)} = ${B(P(2, 3), P(3, 3))} = ${B(8, 27)} ≈ 0,30` },
        { id: "e", thema: "nat", typ: "auswahl", text: `Entscheide, welches Vorzeichen ${P("(−5)", 7)} hat.`,
          optionen: ["negativ, weil der Exponent ungerade ist", "positiv, weil eine Potenz nie negativ ist", "positiv, weil 7 eine Primzahl ist"], richtig: 0,
          hilfen: ["Wie viele Faktoren −5 sind es? Ist die Anzahl gerade oder ungerade?", "Je zwei negative Faktoren ergeben ein positives Produkt. Bleibt einer übrig?"],
          weg: `Sieben negative Faktoren: Sechs davon ergeben ein positives Produkt, der siebte macht es negativ. Also ist ${P("(−5)", 7)} negativ.` }
      ]
    },
    {
      id: "1-2", abschnitt: 1, niveau: 1, titel: "Negative Exponenten",
      einleitung: `Ein Algenteppich auf einem Teich verdoppelt seine Fläche jeden Tag. Heute (t = 0) ist er 1 m² groß. Nach t Tagen ist er A(t) = ${P(2, "t")} m² groß. Die Formel passt auch für vergangene Tage, also für t < 0.`,
      teile: [
        { id: "a", thema: "neg", text: "Berechne, wie groß der Algenteppich gestern (t = −1) war.", einheit: "m²", wert: 0.5, loesung: "1/2 = 0,5", pruef: "I(2)**-1",
          hilfen: ["Wie verändert sich die Fläche, wenn du einen Tag zurückgehst?", `Setze t = −1 in A(t) = ${P(2, "t")} ein.`],
          fehler: [{ wert: -2, text: `Ein negativer Exponent macht die Fläche nicht negativ: ${P(2, -1)} ist der Kehrwert von 2.` }],
          weg: `A(−1) = ${P(2, -1)} = ${B(1, 2)} = 0,5 (m²)` },
        { id: "b", thema: "neg", text: "Berechne, wie groß er vor drei Tagen (t = −3) war.", einheit: "m²", wert: 0.125, loesung: "1/8 = 0,125", pruef: "I(2)**-3",
          hilfen: ["Wie oft halbiert sich die Fläche, wenn du drei Tage zurückgehst?", `${P(2, -3)} = ${B(1, P(2, 3))}`],
          fehler: [{ wert: -8, text: `${P(2, -3)} ist der Kehrwert von ${P(2, 3)}, nicht −8.` }, { wert: -6, text: `${P(2, -3)} ist nicht 2 · (−3).` }],
          weg: `A(−3) = ${P(2, -3)} = ${B(1, P(2, 3))} = ${B(1, 8)} = 0,125 (m²)` },
        { id: "c", thema: "neg", text: `Gib ${B(1, 32)} als Potenz mit der Basis 2 an.`, vor: "2 hoch", wert: -5, pruef: "log(R(1,32),2)",
          hilfen: ["Als welche Potenz von 2 kannst du 32 schreiben?", `${B(1, P("a", "n"))} = ${P("a", "−n")}`],
          fehler: [{ wert: 5, text: `${B(1, 32)} ist kleiner als 1. Der Exponent muss deshalb negativ sein.` }],
          weg: `${B(1, 32)} = ${B(1, P(2, 5))} = ${P(2, -5)}` },
        { id: "d", thema: "neg", text: `Berechne ${P(4, -2)}.`, wert: 1 / 16, loesung: "1/16 = 0,0625", pruef: "I(4)**-2",
          hilfen: ["Was bedeutet ein negativer Exponent?", `${P(4, -2)} = ${B(1, P(4, 2))}`],
          fehler: [{ wert: -16, text: "Ein negativer Exponent bedeutet Kehrwert, nicht negative Zahl." }, { wert: -8, text: `${P(4, -2)} ist nicht 4 · (−2).` }],
          weg: `${P(4, -2)} = ${B(1, P(4, 2))} = ${B(1, 16)} = 0,0625` },
        { id: "e", thema: "zehn", text: `Berechne ${P(10, -4)} und gib das Ergebnis als Dezimalzahl an.`, wert: 0.0001, loesung: "0,0001", pruef: "I(10)**-4",
          hilfen: [`Schreibe ${P(10, -4)} als Bruch.`, `${B(1, "10 000")}: An welcher Nachkommastelle steht die 1?`],
          fehler: [{ wert: 0.00001, text: `Eine Null zu viel: Bei ${P(10, -4)} steht die 1 an der 4. Nachkommastelle.` }, { wert: 0.001, text: `Eine Null zu wenig: Bei ${P(10, -4)} steht die 1 an der 4. Nachkommastelle.` }, { wert: -10000, text: "Ein negativer Exponent bedeutet Kehrwert, nicht negative Zahl." }],
          weg: `${P(10, -4)} = ${B(1, "10 000")} = 0,0001 (die 1 steht an der 4. Nachkommastelle)` },
        { id: "f", thema: "neg", typ: "auswahl", text: `Entscheide, welche Begründung erklärt, warum die Festlegung ${P(2, -1)} = ${B(1, 2)} sinnvoll ist.`,
          optionen: [`In der Reihe ${P(2, 3)} = 8, ${P(2, 2)} = 4, ${P(2, 1)} = 2, ${P(2, 0)} = 1 halbiert sich der Wert, wenn der Exponent um 1 kleiner wird. Ein Schritt weiter ergibt ${P(2, -1)} = ${B(1, 2)}.`,
            `Weil −1 negativ ist, muss auch ${P(2, -1)} negativ sein.`, "Das ist eine Festlegung, für die es keinen Grund gibt."], richtig: 0,
          hilfen: [`Schreibe ${P(2, 3)}, ${P(2, 2)}, ${P(2, 1)}, ${P(2, 0)} mit ihren Werten untereinander. Was geschieht, wenn der Exponent um 1 kleiner wird?`, "Der Wert halbiert sich jedes Mal. Setze das Muster um einen Schritt fort."],
          weg: `Wird der Exponent um 1 kleiner, halbiert sich der Wert: 8, 4, 2, 1. Setzt man das Muster fort, ergibt sich ${P(2, -1)} = ${B(1, 2)}. Die Festlegung ${P("a", "−n")} = ${B(1, P("a", "n"))} setzt diese Regelmäßigkeit fort.` }
      ]
    },
    {
      id: "1-3", abschnitt: 1, niveau: 1, titel: "Zehnerpotenzen und Vorsilben",
      einleitung: `Vorsilben vor Maßeinheiten stehen für Zehnerpotenzen, z. B. Kilo für ${P(10, 3)} und Milli für ${P(10, -3)}. Gib jeweils den Exponenten an.`,
      teile: [
        { id: "a", thema: "zehn", text: `1 Megawatt = 10<sup>?</sup> Watt`, vor: "10 hoch", wert: 6, pruef: "log(10**6,10)",
          hilfen: ["Für welche Zahl steht die Vorsilbe Mega?", "Zähle die Nullen von 1 000 000."],
          fehler: [{ wert: 3, text: `Das wäre Kilo. Mega steht für eine Million.` }],
          weg: `1 MW = 1 000 000 W = ${P(10, 6)} W` },
        { id: "b", thema: "zehn", text: `1 Mikrometer (1 µm) = 10<sup>?</sup> m`, vor: "10 hoch", wert: -6, pruef: "log(R(1,10**6),10)",
          hilfen: ["Mikro bedeutet ein Millionstel. Wie schreibst du das als Bruch?", `${B(1, "1 000 000")} = ${B(1, P(10, 6))}`],
          fehler: [{ wert: 6, text: "Ein Mikrometer ist kleiner als ein Meter. Der Exponent muss negativ sein." }],
          weg: `1 µm = ${B(1, "1 000 000")} m = ${P(10, -6)} m` },
        { id: "c", thema: "zehn", text: `1 Nanosekunde = 10<sup>?</sup> s`, vor: "10 hoch", wert: -9, pruef: "log(R(1,10**9),10)",
          hilfen: ["Nano bedeutet ein Milliardstel. Welche Zehnerpotenz ist eine Milliarde?", `Eine Milliarde = ${P(10, 9)}. Bilde den Kehrwert.`],
          fehler: [{ wert: 9, text: "Eine Nanosekunde ist kleiner als eine Sekunde. Der Exponent muss negativ sein." }],
          weg: `1 ns = ${B(1, "1 000 000 000")} s = ${P(10, -9)} s` },
        { id: "d", thema: "zehn", text: "Gib 0,000 01 als Zehnerpotenz an.", vor: "10 hoch", wert: -5, pruef: "log(R(1,100000),10)",
          hilfen: ["An welcher Stelle nach dem Komma steht die 1?", `${P(10, "−n")} hat die 1 an der n-ten Nachkommastelle.`],
          fehler: [{ wert: -4, text: "Zähle die Nachkommastellen bis einschließlich der 1." }, { wert: 5, text: "0,000 01 ist kleiner als 1. Der Exponent muss negativ sein." }],
          weg: `0,000 01 = ${B(1, "100 000")} = ${P(10, -5)}` },
        { id: "e", thema: "nat", text: `In der Informatik bedeutet 1 Kibibyte (1 KiB) genau ${P(2, 10)} Byte. Berechne, wie viele Byte das sind.`, einheit: "Byte", wert: 1024, pruef: "I(2)**10",
          hilfen: [`Zerlege ${P(2, 10)} in zwei gleiche Potenzen. Was ist ${P(2, 5)}?`, `${P(2, 10)} = ${P(2, 5)} · ${P(2, 5)} = 32 · 32`],
          fehler: [{ wert: 1000, text: `${P(2, 10)} ist nur ungefähr 1000. Rechne genau.` }, { wert: 20, text: `${P(2, 10)} ist nicht 2 · 10.` }],
          weg: `${P(2, 10)} = 32 · 32 = 1024 (Byte), also etwas mehr als ${P(10, 3)}.` }
      ]
    },
    {
      id: "1-4", abschnitt: 1, niveau: 2, titel: "Brüche, negative Basen und die Null",
      einleitung: "Berechne ohne Taschenrechner. Brüche darfst du als Bruch (z. B. −1/8) oder als Dezimalzahl eingeben.",
      teile: [
        { id: "a", thema: "neg", text: `${P(`(${B(1, 3)})`, -2)}`, wert: 9, pruef: "R(1,3)**-2",
          hilfen: ["Was bewirkt der negative Exponent bei einem Bruch?", `Kehrwert: ${P(`(${B(1, 3)})`, -2)} = ${P(3, 2)}`],
          fehler: [{ wert: 1 / 9, text: "Der negative Exponent verlangt den Kehrwert des Bruchs." }, { wert: -9, text: "Ein negativer Exponent bedeutet Kehrwert, nicht negative Zahl." }],
          weg: `${P(`(${B(1, 3)})`, -2)} = ${P(`(${B(3, 1)})`, 2)} = ${P(3, 2)} = 9` },
        { id: "b", thema: "neg", text: `${P(`(${B(2, 5)})`, -3)}`, wert: 125 / 8, loesung: "125/8 = 15,625", pruef: "R(2,5)**-3",
          hilfen: ["Womit beginnst du: mit dem Kehrwert oder mit dem Potenzieren?", `${P(`(${B(5, 2)})`, 3)}: Potenziere Zähler und Nenner einzeln.`],
          fehler: [{ wert: 8 / 125, text: "Der negative Exponent verlangt den Kehrwert des Bruchs." }],
          weg: `${P(`(${B(2, 5)})`, -3)} = ${P(`(${B(5, 2)})`, 3)} = ${B(125, 8)} = 15,625` },
        { id: "c", thema: "neg", text: `${P("(−2)", -3)}`, wert: -0.125, loesung: "−1/8 = −0,125", pruef: "I(-2)**-3",
          hilfen: ["Bearbeite Kehrwert und Vorzeichen nacheinander. Womit beginnst du?", `${B(1, P("(−2)", 3))}: Berechne zuerst ${P("(−2)", 3)}.`],
          fehler: [{ wert: 0.125, text: "Drei negative Faktoren: Das Ergebnis ist negativ." }, { wert: -8, text: "Der Kehrwert fehlt." }, { wert: 8, text: "Der Kehrwert fehlt, und drei negative Faktoren ergeben ein negatives Produkt." }],
          weg: `${P("(−2)", -3)} = ${B(1, P("(−2)", 3))} = ${B(1, "−8")} = −0,125` },
        { id: "d", thema: "null", text: `${P(7, 0)} + ${P(7, -1)}`, wert: 8 / 7, loesung: "8/7 ≈ 1,14", pruef: "I(7)**0 + I(7)**-1",
          hilfen: ["Was ergibt eine Zahl ≠ 0 hoch 0?", `${P(7, 0)} = 1 und ${P(7, -1)} = ${B(1, 7)}. Addiere.`],
          fehler: [{ wert: 1 / 7, text: `${P(7, 0)} ist 1, nicht 0.` }, { wert: 7 + 1 / 7, text: `${P(7, 0)} ist 1, nicht 7.` }],
          weg: `${P(7, 0)} + ${P(7, -1)} = 1 + ${B(1, 7)} = ${B(8, 7)} ≈ 1,14` },
        { id: "e", thema: "neg", typ: "auswahl", text: `Paula schreibt: ${P(3, -2)} = −9. Entscheide, welche Aussage richtig ist.`,
          optionen: [`Falsch: ${P(3, -2)} = ${B(1, 9)}. Der negative Exponent macht die Potenz nicht negativ.`, "Richtig, denn der Exponent ist negativ.", `Falsch: ${P(3, -2)} = −6.`], richtig: 0,
          hilfen: ["Was bedeutet ein negativer Exponent nach der Definition?", `Wende ${P("a", "−n")} = ${B(1, P("a", "n"))} auf ${P(3, -2)} an.`],
          weg: `${P(3, -2)} = ${B(1, P(3, 2))} = ${B(1, 9)}. Das Ergebnis ist positiv.` }
      ]
    },
    {
      id: "1-5", abschnitt: 1, niveau: 3, titel: "Zerfall und Begründungen",
      einleitung: `Ein radioaktiver Stoff zerfällt so, dass sich seine Masse jede Woche halbiert. Zu Beginn der Messung (t = 0) sind 640 mg vorhanden. Nach t Wochen sind es m(t) = 640 · ${P(2, "−t")} mg.`,
      teile: [
        { id: "a", thema: "neg", text: "Berechne, wie viel mg nach 5 Wochen noch vorhanden sind.", einheit: "mg", wert: 20, pruef: "640*I(2)**-5",
          hilfen: ["Welchen Wert setzt du für t ein?", `640 · ${P(2, -5)} = 640 : ${P(2, 5)}`],
          fehler: [{ wert: 64, text: `Du hast durch 10 geteilt. ${P(2, -5)} = ${B(1, 32)}.` }],
          weg: `m(5) = 640 · ${P(2, -5)} = ${B(640, 32)} = 20 (mg)` },
        { id: "b", thema: "neg", text: "Berechne, wie viel mg 2 Wochen vor Messbeginn (t = −2) vorhanden waren.", einheit: "mg", wert: 2560, pruef: "640*I(2)**2",
          hilfen: ["War vor Messbeginn mehr oder weniger vorhanden?", "Setze t = −2 ein. Dann ist −t = 2."],
          fehler: [{ wert: 160, text: `Für t = −2 ist −t = +2: Du musst mit ${P(2, 2)} multiplizieren.` }],
          weg: `m(−2) = 640 · ${P(2, 2)} = 640 · 4 = 2560 (mg)` },
        { id: "c", thema: "neg", text: "Bestimme, nach wie vielen Wochen nur noch 2,5 mg vorhanden sind.", einheit: "Wochen", wert: 8, pruef: "log(640/R(5,2),2)",
          hilfen: ["Um welchen Faktor ist die Masse von 640 mg auf 2,5 mg gesunken?", `640 : 2,5 = 256. Welche Potenz von 2 ist 256?`],
          fehler: [{ wert: 256, text: "256 ist der Faktor. Gesucht ist die Anzahl der Halbierungen." }],
          weg: `640 · ${P(2, "−t")} = 2,5 ⇔ ${P(2, "t")} = 640 : 2,5 = 256 = ${P(2, 8)}, also t = 8 (Wochen).` },
        { id: "d", thema: "neg", typ: "auswahl", text: `Entscheide, für welche Zahlen a gilt: ${P("a", -2)} > 1.`,
          optionen: ["für alle a mit 0 < |a| < 1, z. B. a = 0,5 oder a = −0,5", "für alle a > 1", "für keine Zahl, denn ein negativer Exponent macht die Potenz klein"], richtig: 0,
          hilfen: [`Probiere a = 0,5 und a = 2 aus.`, `${P("a", -2)} = ${B(1, P("a", 2))}. Wann ist ein Kehrwert größer als 1?`],
          weg: `${P("a", -2)} = ${B(1, P("a", 2))} > 1 genau dann, wenn 0 < ${P("a", 2)} < 1, also 0 < |a| < 1. Beispiel: ${P("0,5", -2)} = 4.` },
        { id: "e", thema: "nat", typ: "auswahl", text: `Entscheide, welche Aussage über ${P("(−1)", "n")} mit einer natürlichen Zahl n richtig ist.`,
          optionen: [`${P("(−1)", "n")} = 1 genau dann, wenn n gerade ist.`, `${P("(−1)", "n")} ist für alle n negativ.`, `${P("(−1)", "n")} = −1 genau dann, wenn n gerade ist.`], richtig: 0,
          hilfen: [`Berechne ${P("(−1)", 2)}, ${P("(−1)", 3)} und ${P("(−1)", 4)}. Erkennst du ein Muster?`, "Je zwei Faktoren −1 ergeben +1."],
          weg: `Bei gerader Anzahl von Faktoren −1 ist das Produkt 1, bei ungerader −1. Auch ${P("(−1)", 0)} = 1 passt dazu.` },
        { id: "f", thema: "null", typ: "auswahl", text: `Entscheide, welche Begründung für ${P("a", 0)} = 1 (a ≠ 0) trägt.`,
          optionen: [`In der Reihe ${P("a", 3)}, ${P("a", 2)}, ${P("a", 1)} wird bei jedem Schritt durch a geteilt. Ein Schritt weiter ergibt ${P("a", 1)} : a = 1, also ${P("a", 0)} = 1.`,
            "Weil 0 nichts ist, bleibt nur die 1 übrig.", "Jede Potenz ist mindestens 1."], richtig: 0,
          hilfen: [`Wie kommst du von ${P("a", 3)} zu ${P("a", 2)} und von ${P("a", 2)} zu ${P("a", 1)}?`, "Bei jedem Schritt wird durch a geteilt. Setze das Muster um einen Schritt fort."],
          weg: `Wird der Exponent um 1 kleiner, wird durch a geteilt. Aus ${P("a", 1)} = a wird so a : a = 1. Damit die Regel weiter gilt, legt man ${P("a", 0)} = 1 fest. Für a = 0 klappt das nicht, weil man nicht durch 0 teilen kann.` }
      ]
    },
    // ── Abschnitt 2 ──
    {
      id: "2-1", abschnitt: 2, niveau: 1, titel: "Große Zahlen kurz schreiben",
      einleitung: `Gib die Zahlen mit abgetrennter Zehnerpotenz an: Vorfaktor a mit 1 ≤ a < 10, dann · ${P(10, "n")}. Beispiel: 52 000 = ${WS(5.2, 4)}.`,
      teile: [
        { id: "a", thema: "gross", typ: "wiss", text: "38 000", wert: 38000, pruef: "38000",
          hilfen: ["Setze das Komma so, dass genau eine Ziffer davor steht. Welcher Vorfaktor entsteht?", "Um wie viele Stellen muss das Komma von 3,8 nach rechts wandern, damit 38 000 herauskommt?"],
          weg: `38 000 = 3,8 · 10 000 = ${WS(3.8, 4)}` },
        { id: "b", thema: "gross", typ: "wiss", text: "6 050 000", wert: 6050000, pruef: "6050000",
          hilfen: ["Welcher Vorfaktor entsteht, wenn genau eine Ziffer vor dem Komma steht?", "Um wie viele Stellen wandert das Komma von 6,05 bis 6 050 000?"],
          weg: `6 050 000 = 6,05 · 1 000 000 = ${WS(6.05, 6)}` },
        { id: "c", thema: "gross", typ: "wiss", text: "Der Durchmesser der Sonne beträgt etwa 1 392 000 km.", einheit: "km", wert: 1392000, pruef: "1392000",
          hilfen: ["Bestimme zuerst den Vorfaktor mit 1 ≤ a < 10.", "Zähle die Ziffern hinter der ersten Ziffer."],
          weg: `1 392 000 km = ${WS(1.392, 6)} km` },
        { id: "d", thema: "gross", text: `Gib ${WS(4.07, 5)} ohne Zehnerpotenz an.`, wert: 407000, pruef: "R(407,100)*10**5",
          hilfen: ["In welche Richtung wandert das Komma bei einem positiven Exponenten?", "Verschiebe das Komma von 4,07 um fünf Stellen nach rechts und fülle mit Nullen auf."],
          fehler: [{ wert: 40700, text: "Das Komma muss um fünf Stellen wandern, nicht um vier." }, { wert: 4070000, text: "Das Komma muss um fünf Stellen wandern, nicht um sechs." }],
          weg: `${WS(4.07, 5)} = 4,07 · 100 000 = 407 000` }
      ]
    },
    {
      id: "2-2", abschnitt: 2, niveau: 1, titel: "Kleine Zahlen kurz schreiben",
      einleitung: `Gib die Zahlen mit abgetrennter Zehnerpotenz an. Bei Zahlen zwischen 0 und 1 ist der Exponent negativ. Beispiel: 0,0034 = ${WS(3.4, -3)}.`,
      teile: [
        { id: "a", thema: "klein", typ: "wiss", text: "0,009", wert: 0.009, pruef: "R(9,1000)",
          hilfen: ["Welcher Vorfaktor entsteht, wenn genau eine Ziffer ungleich 0 vor dem Komma steht?", "Um wie viele Stellen muss das Komma von 9 nach links wandern, damit 0,009 herauskommt?"],
          weg: `0,009 = ${B(9, 1000)} = ${WS(9, -3)}` },
        { id: "b", thema: "klein", typ: "wiss", text: "0,000 52", wert: 0.00052, pruef: "R(52,100000)",
          hilfen: ["Bestimme zuerst den Vorfaktor mit 1 ≤ a < 10.", "Zähle die Nachkommastellen bis einschließlich der 5."],
          weg: `0,000 52 = ${WS(5.2, -4)}` },
        { id: "c", thema: "klein", typ: "wiss", text: "Ein rotes Blutkörperchen ist etwa 0,000 007 5 m breit.", einheit: "m", wert: 0.0000075, pruef: "R(75,10**7)",
          hilfen: ["Bestimme zuerst den Vorfaktor mit 1 ≤ a < 10.", "An welcher Nachkommastelle steht die 7?"],
          weg: `0,000 007 5 m = ${WS(7.5, -6)} m` },
        { id: "d", thema: "klein", text: `Gib ${WS(6.1, -4)} als Dezimalzahl an.`, wert: 0.00061, pruef: "R(61,10)*I(10)**-4",
          hilfen: ["In welche Richtung wandert das Komma bei einem negativen Exponenten?", "Verschiebe das Komma von 6,1 um vier Stellen nach links."],
          fehler: [{ wert: 0.0061, text: "Das Komma muss um vier Stellen wandern, nicht um drei." }, { wert: 0.000061, text: "Das Komma muss um vier Stellen wandern, nicht um fünf." }, { wert: 61000, text: "Bei einem negativen Exponenten wandert das Komma nach links." }],
          weg: `${WS(6.1, -4)} = 6,1 · 0,0001 = 0,000 61` }
      ]
    },
    {
      id: "2-3", abschnitt: 2, niveau: 2, titel: "Maßeinheiten umrechnen",
      einleitung: `Nutze die Vorsilben: Milli = ${P(10, -3)}, Mikro (µ) = ${P(10, -6)}, Nano = ${P(10, -9)}, Kilo = ${P(10, 3)}, Mega = ${P(10, 6)}, Giga = ${P(10, 9)}, Tera = ${P(10, 12)}.`,
      teile: [
        { id: "a", thema: "einheit", typ: "wiss", text: "Ein feines Haar ist 40 µm dick. Gib die Dicke in Metern an.", einheit: "m", wert: 0.00004, pruef: "40*I(10)**-6",
          hilfen: ["Ersetze die Vorsilbe µ durch die passende Zehnerpotenz.", `40 · ${P(10, -6)} m: Schreibe 40 als 4 · ${P(10, 1)} und fasse die Zehnerpotenzen zusammen.`],
          weg: `40 µm = 40 · ${P(10, -6)} m = 4 · ${P(10, 1)} · ${P(10, -6)} m = ${WS(4, -5)} m` },
        { id: "b", thema: "einheit", typ: "wiss", text: "Rotes Licht hat eine Wellenlänge von etwa 650 nm. Gib sie in Metern an.", einheit: "m", wert: 6.5e-7, pruef: "650*I(10)**-9",
          hilfen: ["Ersetze die Vorsilbe Nano durch die passende Zehnerpotenz.", `650 = 6,5 · ${P(10, 2)}; fasse die Zehnerpotenzen zusammen.`],
          weg: `650 nm = 6,5 · ${P(10, 2)} · ${P(10, -9)} m = ${WS(6.5, -7)} m` },
        { id: "c", thema: "einheit", typ: "wiss", text: "Ein Kraftwerk leistet 2,3 Gigawatt. Gib die Leistung in Watt an.", einheit: "W", wert: 2.3e9, pruef: "R(23,10)*10**9",
          hilfen: ["Für welche Zehnerpotenz steht Giga?", "Der Vorfaktor 2,3 erfüllt schon 1 ≤ a < 10."],
          weg: `2,3 GW = ${WS(2.3, 9)} W` },
        { id: "d", thema: "sach", text: `Auf eine Festplatte mit 1 TB (${P(10, 12)} Byte) sollen Fotos zu je 4 MB (4 · ${P(10, 6)} Byte) gespeichert werden. Berechne, wie viele Fotos darauf passen.`, einheit: "Fotos", wert: 250000, pruef: "10**12/(4*10**6)",
          hilfen: ["Welche Rechenart brauchst du, wenn du wissen willst, wie oft 4 MB in 1 TB passen?", `${P(10, 12)} : (4 · ${P(10, 6)}): Teile Vorfaktoren und Zehnerpotenzen getrennt.`],
          fehler: [{ wert: 4e18, text: "Du hast multipliziert. Gesucht ist, wie oft ein Foto in den Speicher passt: teilen." }],
          weg: `${B(P(10, 12), `4 · ${P(10, 6)}`)} = 0,25 · ${P(10, 6)} = 250 000 (Fotos)` }
      ]
    },
    {
      id: "2-4", abschnitt: 2, niveau: 2, titel: "Mit Licht rechnen",
      einleitung: `Licht legt in einer Sekunde etwa 3 · ${P(10, 5)} km zurück. Ein Jahr hat etwa 3,15 · ${P(10, 7)} Sekunden. Rechne Vorfaktoren und Zehnerpotenzen getrennt.`,
      teile: [
        { id: "a", thema: "sach", typ: "wiss", text: "Berechne, wie weit Licht in einer Minute kommt.", einheit: "km", wert: 1.8e7, pruef: "3*10**5*60",
          hilfen: ["Wie viele Sekunden hat eine Minute, und welche Rechenart brauchst du?", `3 · ${P(10, 5)} · 60: Multipliziere die Vorfaktoren 3 · 60 und bringe das Ergebnis in die Form 1 ≤ a < 10.`],
          weg: `3 · ${P(10, 5)} km · 60 = 180 · ${P(10, 5)} km = ${WS(1.8, 7)} km` },
        { id: "b", thema: "sach", typ: "wiss", text: "Ein Lichtjahr ist die Strecke, die Licht in einem Jahr zurücklegt. Berechne, wie viele km das sind.", einheit: "km", wert: 9.45e12, toleranz: 0.01, pruef: "3*10**5*R(315,100)*10**7",
          hilfen: ["Strecke = Geschwindigkeit · Zeit. Welche zwei Zahlen multiplizierst du?", `Multipliziere die Vorfaktoren 3 · 3,15 und die Zehnerpotenzen ${P(10, 5)} · ${P(10, 7)} getrennt.`],
          weg: `3 · 3,15 · ${P(10, 5)} · ${P(10, 7)} km = 9,45 · ${P(10, 12)} km` },
        { id: "c", thema: "sach", text: `Die Sonne ist etwa 1,5 · ${P(10, 8)} km von der Erde entfernt. Berechne, wie viele Sekunden ihr Licht bis zur Erde braucht.`, einheit: "s", wert: 500, pruef: "R(15,10)*10**8/(3*10**5)",
          hilfen: ["Wie hängen Zeit, Strecke und Geschwindigkeit zusammen?", `Zeit = Strecke : Geschwindigkeit. Teile Vorfaktoren (1,5 : 3) und Zehnerpotenzen (${P(10, 8)} : ${P(10, 5)}) getrennt.`],
          fehler: [{ wert: 4.5e13, text: "Du hast multipliziert. Zeit = Strecke : Geschwindigkeit." }, { wert: 5000, text: `${P(10, 8)} : ${P(10, 5)} = ${P(10, 3)}. Prüfe die Zehnerpotenz.` }],
          weg: `${B(`1,5 · ${P(10, 8)}`, `3 · ${P(10, 5)}`)} s = 0,5 · ${P(10, 3)} s = 500 s (gut 8 Minuten)` },
        { id: "d", thema: "sach", typ: "wiss", text: `Der Stern Wega ist etwa 25 Lichtjahre entfernt. Berechne die Entfernung in km. Rechne mit 1 Lichtjahr ≈ 9,45 · ${P(10, 12)} km.`, einheit: "km", wert: 2.3625e14, toleranz: 0.01, pruef: "25*R(945,100)*10**12",
          hilfen: ["Multipliziere die Vorfaktoren; die Zehnerpotenz bleibt zunächst stehen.", `236,25 = 2,3625 · ${P(10, 2)}. Fasse die Zehnerpotenzen zusammen.`],
          weg: `25 · 9,45 · ${P(10, 12)} km = 236,25 · ${P(10, 12)} km ≈ ${WS(2.36, 14)} km` }
      ]
    },
    {
      id: "2-5", abschnitt: 2, niveau: 3, titel: "Kleine Anteile: ppm und ppb",
      einleitung: `Sehr kleine Anteile gibt man in ppm (parts per million, 1 ppm = ${P(10, -6)}) oder ppb (parts per billion; englisch billion = Milliarde, 1 ppb = ${P(10, -9)}) an.`,
      teile: [
        { id: "a", thema: "einheit", text: "Ein Liter Leitungswasser (Masse etwa 1 kg) enthält 10 µg Blei. Berechne den Massenanteil des Bleis in ppb.", einheit: "ppb", wert: 10, pruef: "(10*I(10)**-6)/1000/I(10)**-9",
          hilfen: ["Rechne beide Massen in dieselbe Einheit um. Wie viel Gramm sind 10 µg, wie viel Gramm sind 1 kg?", `Anteil = 10 · ${P(10, -6)} g : ${P(10, 3)} g. Wie viele ppb, also Vielfache von ${P(10, -9)}, sind das?`],
          fehler: [{ wert: 0.01, text: "Das ist der Anteil in ppm. Gefragt ist der Anteil in ppb." }, { wert: 10000, text: "Prüfe die Umrechnung: 1 kg = 1000 g, 1 µg = 10⁻⁶ g." }],
          weg: `10 µg = 10 · ${P(10, -6)} g = ${P(10, -5)} g; 1 kg = ${P(10, 3)} g. Anteil = ${P(10, -5)} : ${P(10, 3)} = ${P(10, -8)} = 10 · ${P(10, -9)} = 10 ppb.` },
        { id: "b", thema: "einheit", text: "Der Anteil von Kohlenstoffdioxid in der Luft ist von etwa 280 ppm (um das Jahr 1750) auf etwa 420 ppm gestiegen. Berechne, um wie viel Prozent er gestiegen ist.", einheit: "%", wert: 50, pruef: "(420-280)*100/I(280)",
          hilfen: ["Wie groß ist die Zunahme in ppm, und auf welchen Wert beziehst du sie?", "Teile die Zunahme von 140 ppm durch den Ausgangswert 280 ppm."],
          fehler: [{ wert: 140, text: "140 ppm ist die Zunahme. Gefragt ist die Zunahme in Prozent." }, { wert: 100 / 3, text: "Bezugsgröße ist der Ausgangswert 280 ppm, nicht der neue Wert." }, { wert: 150, text: "Gefragt ist die Zunahme, nicht der neue Wert in Prozent des alten." }],
          weg: `Zunahme: 420 ppm − 280 ppm = 140 ppm. 140 : 280 = 0,5 = 50 %. Die Einheit ppm kürzt sich dabei heraus.` },
        { id: "c", thema: "sach", text: "Ein Stück Würfelzucker (3 g) wird so in Wasser gelöst, dass der Massenanteil des Zuckers 1 ppm beträgt. Berechne, wie viel Kilogramm Wasser man ungefähr braucht.", einheit: "kg", wert: 3000, toleranz: 0.01, pruef: "3/I(10)**-6/1000",
          hilfen: ["3 g sollen ein Millionstel der Gesamtmasse sein. Wie groß ist dann die Gesamtmasse?", `Gesamtmasse = 3 g : ${P(10, -6)} = 3 · ${P(10, 6)} g. Rechne in Kilogramm um.`],
          fehler: [{ wert: 3e6, text: "Das ist die Masse in Gramm. Rechne in Kilogramm um." }, { wert: 0.003, text: "Du hast mit 10⁻⁶ multipliziert. Die Gesamtmasse ist viel größer als 3 g." }],
          weg: `3 g : ${P(10, -6)} = 3 · ${P(10, 6)} g = 3 · ${P(10, 3)} kg = 3000 kg, also etwa 3 Tonnen Wasser.` },
        { id: "d", thema: "sach", text: "Luft enthält etwa 18 ppm Neon (Volumenanteil). Berechne, wie viel Milliliter Neon in 1 Liter Luft enthalten sind.", einheit: "ml", wert: 0.018, pruef: "18*I(10)**-6*1000",
          hilfen: ["Welcher Bruchteil von 1 Liter ist Neon?", `18 ppm von 1 L sind 18 · ${P(10, -6)} L. Rechne mit 1 L = ${P(10, 3)} ml in Milliliter um.`],
          fehler: [{ wert: 0.000018, text: "Das ist das Volumen in Litern. Rechne in Milliliter um." }, { wert: 18, text: "18 ppm bedeutet 18 Millionstel, nicht 18 ml." }],
          weg: `18 · ${P(10, -6)} L = 18 · ${P(10, -6)} · ${P(10, 3)} ml = 18 · ${P(10, -3)} ml = 0,018 ml` }
      ]
    },
    // ── Abschnitt 3 ──
    {
      id: "3-1", abschnitt: 3, niveau: 1, titel: "n-te Wurzeln",
      einleitung: `Die n-te Wurzel ${W("n", "a")} (a ≥ 0) ist die nichtnegative Zahl, die hoch n genommen a ergibt. Beispiel: ${W(3, 64)} = 4, denn ${P(4, 3)} = 64. Berechne ohne Taschenrechner.`,
      teile: [
        { id: "a", thema: "wurzel", text: W(3, 216), wert: 6, pruef: "root(216,3)",
          hilfen: ["Welche Zahl ergibt hoch 3 genommen 216? Probiere kleine Zahlen aus.", `${P(5, 3)} = 125 ist zu klein. Probiere die nächste Zahl.`],
          fehler: [{ wert: 72, text: `${W(3, 216)} ist nicht 216 : 3.` }],
          weg: `${W(3, 216)} = 6, denn ${P(6, 3)} = 216` },
        { id: "b", thema: "wurzel", text: W(4, 625), wert: 5, pruef: "root(625,4)",
          hilfen: ["Welche Zahl ergibt hoch 4 genommen 625?", `Ziehe zweimal nacheinander die Quadratwurzel: ${W(2, 625)} = 25.`],
          fehler: [{ wert: 25, text: "Das ist die Quadratwurzel. Gesucht ist die vierte Wurzel." }],
          weg: `${W(4, 625)} = 5, denn ${P(5, 4)} = 625` },
        { id: "c", thema: "wurzel", text: W(5, 32), wert: 2, pruef: "root(32,5)",
          hilfen: ["Welche Zahl fünfmal mit sich selbst multipliziert ergibt 32?", "Zerlege 32 in gleiche Faktoren."],
          fehler: [{ wert: 6.4, text: "Wurzelziehen ist nicht Teilen." }],
          weg: `${W(5, 32)} = 2, denn ${P(2, 5)} = 32` },
        { id: "d", thema: "wurzel", text: W(3, "0,008"), wert: 0.2, pruef: "root(R(8,1000),3)",
          hilfen: ["Schreibe 0,008 als Bruch.", `0,008 = ${B(8, 1000)}. Ziehe die Wurzel aus Zähler und Nenner.`],
          fehler: [{ wert: 0.02, text: `Prüfe durch Potenzieren: ${P("0,02", 3)} = 0,000 008.` }, { wert: 2, text: `Prüfe durch Potenzieren: ${P(2, 3)} = 8, nicht 0,008.` }],
          weg: `${W(3, "0,008")} = ${W(3, B(8, 1000))} = ${B(2, 10)} = 0,2, denn ${P("0,2", 3)} = 0,008` },
        { id: "e", thema: "wurzel", text: W(4, B(81, 16)), wert: 1.5, loesung: "3/2 = 1,5", pruef: "root(R(81,16),4)",
          hilfen: ["Wie gehst du bei der Wurzel aus einem Bruch vor?", "Ziehe die vierte Wurzel aus Zähler und Nenner einzeln."],
          weg: `${W(4, B(81, 16))} = ${B(3, 2)} = 1,5, denn ${P(`(${B(3, 2)})`, 4)} = ${B(81, 16)}` },
        { id: "f", thema: "wurzel", text: `Bestimme, zwischen welchen aufeinanderfolgenden natürlichen Zahlen ${W(3, 30)} liegt. Gib die kleinere an.`, wert: 3, pruef: "floor(root(30,3))",
          hilfen: [`Berechne einige Kubikzahlen: ${P(1, 3)}, ${P(2, 3)}, ${P(3, 3)}, ${P(4, 3)}.`, "Zwischen welchen Kubikzahlen liegt 30?"],
          fehler: [{ wert: 10, text: `${W(3, 30)} ist nicht 30 : 3. Prüfe mit ${P(10, 3)} = 1000.` }, { wert: 5, text: "Das ist ungefähr die Quadratwurzel. Gesucht ist die dritte Wurzel." }],
          weg: `${P(3, 3)} = 27 < 30 < 64 = ${P(4, 3)}, also 3 < ${W(3, 30)} < 4.` }
      ]
    },
    {
      id: "3-2", abschnitt: 3, niveau: 1, titel: "Stammbrüche als Exponenten",
      einleitung: `Für a ≥ 0 gilt ${P("a", "1/n")} = ${W("n", "a")}. Beispiel: ${P(27, "1/3")} = ${W(3, 27)} = 3. Berechne ohne Taschenrechner.`,
      teile: [
        { id: "a", thema: "stamm", text: P(36, "1/2"), wert: 6, pruef: "I(36)**R(1,2)",
          hilfen: ["Welche Wurzel gehört zum Exponenten 1/2?", `${P(36, "1/2")} = ${W(2, 36)}`],
          fehler: [{ wert: 18, text: `${P(36, "1/2")} ist nicht 36 · ${B(1, 2)}. Der Exponent 1/2 bedeutet Quadratwurzel.` }],
          weg: `${P(36, "1/2")} = ${W(2, 36)} = 6` },
        { id: "b", thema: "stamm", text: P(125, "1/3"), wert: 5, pruef: "I(125)**R(1,3)",
          hilfen: ["Welche Wurzel gehört zum Exponenten 1/3?", `Berechne ${W(3, 125)}.`],
          fehler: [{ wert: 125 / 3, text: "Der Exponent 1/3 bedeutet dritte Wurzel, nicht durch 3 teilen." }],
          weg: `${P(125, "1/3")} = ${W(3, 125)} = 5` },
        { id: "c", thema: "stamm", text: P("10 000", "1/4"), wert: 10, pruef: "I(10000)**R(1,4)",
          hilfen: ["Schreibe 10 000 als Zehnerpotenz.", `10 000 = ${P(10, 4)}. Ziehe die vierte Wurzel.`],
          fehler: [{ wert: 2500, text: "Der Exponent 1/4 bedeutet vierte Wurzel, nicht durch 4 teilen." }, { wert: 100, text: "Das ist die Quadratwurzel. Gesucht ist die vierte Wurzel." }],
          weg: `${P("10 000", "1/4")} = ${W(4, "10 000")} = 10` },
        { id: "d", thema: "stamm", text: P("0,01", "1/2"), wert: 0.1, pruef: "R(1,100)**R(1,2)",
          hilfen: ["Schreibe 0,01 als Bruch.", `${W(2, B(1, 100))}: Ziehe die Wurzel aus Zähler und Nenner.`],
          fehler: [{ wert: 0.005, text: "Der Exponent 1/2 bedeutet Quadratwurzel, nicht halbieren." }, { wert: 0.01, text: `Prüfe durch Quadrieren: ${P("0,01", 2)} = 0,0001.` }],
          weg: `${P("0,01", "1/2")} = ${W(2, "0,01")} = 0,1, denn ${P("0,1", 2)} = 0,01` },
        { id: "e", thema: "stamm", typ: "auswahl", text: `Entscheide, welcher Term gleich ${P(6, "1/4")} ist.`,
          optionen: [W(4, 6), B(6, 4), P(6, -4), `${W(6, 4)}`], richtig: 0,
          hilfen: ["Welche Rolle spielt der Nenner des Exponenten?", `${P("a", "1/n")} = ${W("n", "a")}`],
          weg: `${P(6, "1/4")} = ${W(4, 6)}` }
      ]
    },
    {
      id: "3-3", abschnitt: 3, niveau: 2, titel: "Rationale Exponenten berechnen",
      einleitung: `Für a > 0 gilt ${P("a", "m/n")} = ${P(`(${W("n", "a")})`, "m")}. Meist ist es leichter, zuerst die Wurzel zu ziehen und dann zu potenzieren. Berechne ohne Taschenrechner.`,
      teile: [
        { id: "a", thema: "rational", text: P(27, "2/3"), wert: 9, pruef: "I(27)**R(2,3)",
          hilfen: ["Der Nenner 3 im Exponenten steht für eine Wurzel. Welche?", `Berechne zuerst ${W(3, 27)} und quadriere dann.`],
          fehler: [{ wert: 18, text: `${P(27, "2/3")} ist nicht 27 · ${B(2, 3)}. Der Exponent bedeutet: dritte Wurzel, dann quadrieren.` }],
          weg: `${P(27, "2/3")} = ${P(`(${W(3, 27)})`, 2)} = ${P(3, 2)} = 9` },
        { id: "b", thema: "rational", text: P(4, "3/2"), wert: 8, pruef: "I(4)**R(3,2)",
          hilfen: ["Welche Wurzel gehört zum Nenner 2, welche Potenz zum Zähler 3?", `Berechne zuerst ${W(2, 4)} und nimm das Ergebnis hoch 3.`],
          fehler: [{ wert: 6, text: `${P(4, "3/2")} ist nicht 4 · ${B(3, 2)}.` }],
          weg: `${P(4, "3/2")} = ${P(`(${W(2, 4)})`, 3)} = ${P(2, 3)} = 8` },
        { id: "c", thema: "rational", text: P(81, "3/4"), wert: 27, pruef: "I(81)**R(3,4)",
          hilfen: ["Zerlege den Exponenten: Welche Wurzel, welche Potenz?", `Berechne ${W(4, 81)} und nimm das Ergebnis hoch 3.`],
          fehler: [{ wert: 60.75, text: `${P(81, "3/4")} ist nicht 81 · ${B(3, 4)}.` }],
          weg: `${P(81, "3/4")} = ${P(`(${W(4, 81)})`, 3)} = ${P(3, 3)} = 27` },
        { id: "d", thema: "rational", text: P(16, "−1/2"), wert: 0.25, loesung: "1/4 = 0,25", pruef: "I(16)**R(-1,2)",
          hilfen: ["Was bewirkt das Minuszeichen im Exponenten?", `${P(16, "−1/2")} = ${B(1, P(16, "1/2"))}`],
          fehler: [{ wert: -4, text: `Der negative Exponent bedeutet Kehrwert, nicht −${W(2, 16)}.` }, { wert: -8, text: "Der negative Exponent bedeutet Kehrwert, und 1/2 bedeutet Quadratwurzel." }],
          weg: `${P(16, "−1/2")} = ${B(1, P(16, "1/2"))} = ${B(1, 4)} = 0,25` },
        { id: "e", thema: "rational", text: P(32, "0,6"), wert: 8, pruef: "I(32)**R(3,5)",
          hilfen: ["Schreibe den Exponenten 0,6 als Bruch.", `0,6 = ${B(3, 5)}: Berechne ${W(5, 32)} und nimm das Ergebnis hoch 3.`],
          fehler: [{ wert: 19.2, text: `${P(32, "0,6")} ist nicht 32 · 0,6.` }],
          weg: `${P(32, "0,6")} = ${P(32, "3/5")} = ${P(`(${W(5, 32)})`, 3)} = ${P(2, 3)} = 8` },
        { id: "f", thema: "stamm", text: `Bestimme die Basis b, für die ${P("b", "1/2")} = 7 gilt.`, vor: "b =", wert: 49, pruef: "I(7)**2",
          hilfen: [`${P("b", "1/2")} ist eine Wurzel. Welche?`, `${W(2, "b")} = 7: Welche Zahl hat die Quadratwurzel 7?`],
          fehler: [{ wert: 3.5, text: "Gesucht ist b mit √b = 7, also nicht 7 : 2." }, { wert: 14, text: "Gesucht ist b mit √b = 7, also nicht 7 · 2." }],
          weg: `${P("b", "1/2")} = ${W(2, "b")} = 7 ⇒ b = ${P(7, 2)} = 49` }
      ]
    },
    {
      id: "3-4", abschnitt: 3, niveau: 2, titel: "Zwischen Wurzel und Potenz wechseln",
      einleitung: `Es gilt x > 0. Gib den Term als Potenz von x an. Gib den Exponenten als Bruch an, z. B. 2/3.`,
      teile: [
        { id: "a", thema: "umform", text: W(3, P("x", 2)), vor: "x hoch", wert: 2 / 3, loesung: "2/3", pruef: "ex(root(x**2,3))",
          hilfen: ["Welche Zahl wird zum Nenner, welche zum Zähler des Exponenten?", `${W("n", P("x", "m"))} = ${P("x", "m/n")}`],
          fehler: [{ wert: 3 / 2, text: "Zähler und Nenner sind vertauscht: Der Wurzelexponent kommt in den Nenner." }, { wert: 6, text: "Der Wurzelexponent wird nicht multipliziert, er kommt in den Nenner." }],
          weg: `${W(3, P("x", 2))} = ${P("x", "2/3")}` },
        { id: "b", thema: "umform", text: B(1, W(2, "x")), vor: "x hoch", wert: -0.5, loesung: "−1/2", pruef: "ex(1/sqrt(x))",
          hilfen: [`Schreibe zuerst ${W(2, "x")} als Potenz von x.`, "Beim Kehrwert bekommt der Exponent ein Minuszeichen."],
          fehler: [{ wert: 0.5, text: `Der Kehrwert fehlt: ${B(1, P("x", "1/2"))} = ${P("x", "−1/2")}.` }, { wert: -2, text: `${W(2, "x")} = ${P("x", "1/2")}, nicht ${P("x", 2)}.` }],
          weg: `${B(1, W(2, "x"))} = ${B(1, P("x", "1/2"))} = ${P("x", "−1/2")}` },
        { id: "c", thema: "umform", text: W(4, P("x", 6)), vor: "x hoch", wert: 1.5, loesung: "6/4 = 3/2", pruef: "ex(root(x**6,4))",
          hilfen: ["Welcher Bruch entsteht als Exponent?", `${P("x", "6/4")}: Kürze den Bruch.`],
          fehler: [{ wert: 4 / 6, text: "Zähler und Nenner sind vertauscht: Der Wurzelexponent kommt in den Nenner." }],
          weg: `${W(4, P("x", 6))} = ${P("x", "6/4")} = ${P("x", "3/2")}` },
        { id: "d", thema: "umform", text: `x · ${W(2, "x")}`, vor: "x hoch", wert: 1.5, loesung: "3/2", pruef: "ex(x*sqrt(x))",
          hilfen: ["Schreibe beide Faktoren als Potenzen von x.", `${P("x", 1)} · ${P("x", "1/2")}: Gleiche Basis, die Exponenten werden addiert (das kennst du als Potenzgesetz P1).`],
          fehler: [{ wert: 0.5, text: `Der Faktor x = ${P("x", 1)} fehlt.` }],
          weg: `x · ${W(2, "x")} = ${P("x", 1)} · ${P("x", "1/2")} = ${P("x", "3/2")}` },
        { id: "e", thema: "umform", typ: "auswahl", text: `Entscheide, welche Wurzelschreibweise zu ${P("x", "0,75")} gehört.`,
          optionen: [W(4, P("x", 3)), W(3, P("x", 4)), W(75, "x"), `${B(P("x", 3), 4)}`], richtig: 0,
          hilfen: ["Schreibe 0,75 als Bruch.", "Nenner → Wurzelexponent, Zähler → Exponent unter der Wurzel."],
          weg: `${P("x", "0,75")} = ${P("x", "3/4")} = ${W(4, P("x", 3))}` }
      ]
    },
    {
      id: "3-5", abschnitt: 3, niveau: 3, titel: "Bakterien, Basen und Abschätzungen",
      einleitung: `Eine Bakterienkultur verdoppelt ihr Volumen jede Stunde. Zu Beginn ist sie 1 cm³ groß, nach t Stunden V(t) = ${P(2, "t")} cm³ – auch für Bruchteile von Stunden.`,
      teile: [
        { id: "a", thema: "stamm", text: "Berechne, wie groß die Kultur nach einer halben Stunde ist. Runde auf zwei Nachkommastellen.", einheit: "cm³", stellen: 2, wert: Math.SQRT2, loesung: "√2 ≈ 1,41", pruef: "sqrt(2)",
          hilfen: ["Welchen Wert hat t bei einer halben Stunde?", `${P(2, "1/2")} = ${W(2, 2)}; runde auf zwei Nachkommastellen.`],
          fehler: [{ wert: 1, text: `${P(2, "1/2")} ist nicht 2 · ${B(1, 2)}. Der Exponent 1/2 bedeutet Quadratwurzel.` }, { wert: 1.5, text: "In einer halben Stunde wächst die Kultur nicht um die Hälfte, sondern um den Faktor √2." }],
          weg: `V(½) = ${P(2, "1/2")} = ${W(2, 2)} ≈ 1,41 (cm³). Zweimal eine halbe Stunde ergibt den Faktor ${W(2, 2)} · ${W(2, 2)} = ${P(2, "1/2 + 1/2")} = 2 (Potenzgesetz P1).` },
        { id: "b", thema: "rational", text: "Berechne, wie groß sie nach 1 Stunde 30 Minuten ist. Runde auf zwei Nachkommastellen.", einheit: "cm³", stellen: 2, wert: 2 ** 1.5, loesung: "2^(3/2) ≈ 2,83", pruef: "I(2)**R(3,2)",
          hilfen: ["Schreibe 1 h 30 min als Bruch von Stunden.", `${P(2, "3/2")} = ${W(2, P(2, 3))} = ${W(2, 8)}`],
          fehler: [{ wert: 3, text: "1,5 Stunden bedeuten den Faktor 2^(3/2), nicht 2 · 1,5." }],
          weg: `V(3/2) = ${P(2, "3/2")} = ${W(2, 8)} ≈ 2,83 (cm³)` },
        { id: "c", thema: "rational", text: `Bestimme die Basis b, für die ${P("b", "2/3")} = 16 gilt.`, vor: "b =", wert: 64, pruef: "16**R(3,2)",
          hilfen: [`Schreibe ${P("b", "2/3")} = ${P(`(${W(3, "b")})`, 2)}. Welche positive Zahl ergibt quadriert 16?`, `${W(3, "b")} = 4. Welche Zahl hat die dritte Wurzel 4?`],
          fehler: [{ wert: 4, text: `4 ist ${W(3, "b")}. Gesucht ist b selbst.` }, { wert: 24, text: `b ist nicht 16 : ${B(2, 3)}. Arbeite mit Wurzel und Potenz.` }],
          weg: `${P(`(${W(3, "b")})`, 2)} = 16 ⇒ ${W(3, "b")} = 4 ⇒ b = ${P(4, 3)} = 64` },
        { id: "d", thema: "wurzel", text: `Bestimme, zwischen welchen aufeinanderfolgenden natürlichen Zahlen ${W(4, 200)} liegt. Gib die kleinere an.`, wert: 3, pruef: "floor(root(200,4))",
          hilfen: [`Berechne einige vierte Potenzen: ${P(2, 4)}, ${P(3, 4)}, ${P(4, 4)}.`, "Zwischen welchen vierten Potenzen liegt 200?"],
          fehler: [{ wert: 50, text: `${W(4, 200)} ist nicht 200 : 4.` }, { wert: 14, text: "Das ist ungefähr die Quadratwurzel. Gesucht ist die vierte Wurzel." }],
          weg: `${P(3, 4)} = 81 < 200 < 256 = ${P(4, 4)}, also 3 < ${W(4, 200)} < 4.` },
        { id: "e", thema: "wurzel", typ: "auswahl", text: "Entscheide, welche Aussage richtig ist.",
          optionen: [`${W(4, 16)} = 2, denn eine n-te Wurzel ist nie negativ.`, `${W(4, 16)} = ±2, denn auch ${P("(−2)", 4)} = 16.`, `${W(4, "−16")} = −2`], richtig: 0,
          hilfen: ["Lies die Definition der n-ten Wurzel noch einmal genau.", "Welche Bedingung gilt für den Radikanden, welche für das Ergebnis?"],
          weg: `Nach Definition ist ${W(4, 16)} die nichtnegative Zahl mit vierter Potenz 16, also 2. ${W(4, "−16")} ist nicht definiert.` }
      ]
    },
    // ── Abschnitt 4 ──
    {
      id: "4-1", abschnitt: 4, niveau: 1, titel: "Gleiche Basis: Exponenten addieren",
      einleitung: `Potenzgesetz P1: ${P("a", "m")} · ${P("a", "n")} = ${P("a", "m+n")} und ${P("a", "m")} : ${P("a", "n")} = ${P("a", "m−n")} (a ≠ 0). Berechne ohne Taschenrechner.`,
      teile: [
        { id: "a", thema: "p1", text: `Gib ${P(3, 4)} · ${P(3, 5)} als Potenz von 3 an.`, vor: "3 hoch", wert: 9, pruef: "log(I(3)**4*I(3)**5,3)",
          hilfen: ["Was geschieht bei gleicher Basis mit der Basis, was mit den Exponenten?", "Addiere die Exponenten 4 und 5."],
          fehler: [{ wert: 20, text: "Beim Multiplizieren von Potenzen mit gleicher Basis werden die Exponenten addiert, nicht multipliziert." }],
          weg: `${P(3, 4)} · ${P(3, 5)} = ${P(3, "4+5")} = ${P(3, 9)}` },
        { id: "b", thema: "p1", text: `${P(2, -3)} · ${P(2, 7)}`, wert: 16, pruef: "I(2)**-3*I(2)**7",
          hilfen: ["Gleiche Basis: Was geschieht mit den Exponenten?", "Addiere −3 und 7 und berechne die Potenz."],
          fehler: [{ wert: 1024, text: "Achte auf das Vorzeichen: −3 + 7 = 4." }, { wert: 2 ** -21, text: "Exponenten werden addiert, nicht multipliziert." }],
          weg: `${P(2, -3)} · ${P(2, 7)} = ${P(2, 4)} = 16` },
        { id: "c", thema: "p1", text: `${P(5, 8)} : ${P(5, 6)}`, wert: 25, pruef: "I(5)**8/I(5)**6",
          hilfen: ["Was geschieht beim Dividieren mit den Exponenten?", "Subtrahiere: 8 − 6."],
          fehler: [{ wert: 5 ** (4 / 3), text: "Beim Dividieren werden die Exponenten subtrahiert, nicht dividiert." }, { wert: 2, text: `Die Basis 5 bleibt erhalten: ${P(5, "8−6")}.` }],
          weg: `${P(5, 8)} : ${P(5, 6)} = ${P(5, 2)} = 25` },
        { id: "d", thema: "p1", text: `${P(10, -2)} · ${P(10, 5)}`, wert: 1000, pruef: "I(10)**-2*I(10)**5",
          hilfen: ["Gleiche Basis: Was geschieht mit den Exponenten?", "Addiere −2 und 5."],
          fehler: [{ wert: 1e7, text: "Achte auf das Vorzeichen von −2." }, { wert: 1e-10, text: "Exponenten werden addiert, nicht multipliziert." }],
          weg: `${P(10, -2)} · ${P(10, 5)} = ${P(10, 3)} = 1000` },
        { id: "e", thema: "p1", text: `Gib ${P("a", 4)} · ${P("a", -7)} als Potenz von a an (a ≠ 0).`, vor: "a hoch", wert: -3, pruef: "ex(x**4*x**-7)",
          hilfen: ["Gleiche Basis: Was geschieht mit den Exponenten?", "Addiere 4 und −7. Das Ergebnis darf negativ sein."],
          fehler: [{ wert: -28, text: "Exponenten werden addiert, nicht multipliziert." }, { wert: 11, text: "Achte auf das Vorzeichen: 4 + (−7)." }],
          weg: `${P("a", 4)} · ${P("a", -7)} = ${P("a", "4+(−7)")} = ${P("a", -3)}` },
        { id: "f", thema: "p1", text: `Gib ${P("a", "1/2")} · ${P("a", "1/2")} als Potenz von a an (a > 0).`, vor: "a hoch", wert: 1, pruef: "ex(x**R(1,2)*x**R(1,2))",
          hilfen: ["Gilt P1 auch für Exponenten, die Brüche sind?", `Addiere ${B(1, 2)} + ${B(1, 2)}.`],
          fehler: [{ wert: 0.25, text: "Exponenten werden addiert, nicht multipliziert." }],
          weg: `${P("a", "1/2")} · ${P("a", "1/2")} = ${P("a", "1/2 + 1/2")} = ${P("a", 1)} = a. Das passt zu ${W(2, "a")} · ${W(2, "a")} = a.` }
      ]
    },
    {
      id: "4-2", abschnitt: 4, niveau: 1, titel: "Gleicher Exponent: Basen multiplizieren",
      einleitung: `Potenzgesetz P2: ${P("a", "n")} · ${P("b", "n")} = ${P("(a · b)", "n")} und ${P("a", "n")} : ${P("b", "n")} = ${P("(a : b)", "n")} (b ≠ 0). Suche Partner, deren Produkt eine glatte Zahl ist. Berechne ohne Taschenrechner.`,
      teile: [
        { id: "a", thema: "p2", text: `${P(2, 4)} · ${P(5, 4)}`, wert: 10000, pruef: "I(2)**4*I(5)**4",
          hilfen: ["Die Exponenten sind gleich. Was kannst du mit den Basen tun?", `Fasse zu ${P("(2 · 5)", 4)} zusammen.`],
          fehler: [{ wert: 1e8, text: "Bei gleichem Exponenten bleibt der Exponent 4 erhalten, er wird nicht verdoppelt." }],
          weg: `${P(2, 4)} · ${P(5, 4)} = ${P(10, 4)} = 10 000` },
        { id: "b", thema: "p2", text: `${P("0,5", 3)} · ${P(8, 3)}`, wert: 64, pruef: "R(1,2)**3*I(8)**3",
          hilfen: ["Welches Produkt der Basen ergibt eine glatte Zahl?", `${P("(0,5 · 8)", 3)} = ${P(4, 3)}`],
          weg: `${P("0,5", 3)} · ${P(8, 3)} = ${P("(0,5 · 8)", 3)} = ${P(4, 3)} = 64` },
        { id: "c", thema: "p2", text: `${P(15, 3)} : ${P(5, 3)}`, wert: 27, pruef: "I(15)**3/I(5)**3",
          hilfen: ["Gleicher Exponent: Was kannst du mit den Basen tun?", `Fasse zu ${P("(15 : 5)", 3)} zusammen.`],
          fehler: [{ wert: 3, text: `Der Exponent bleibt erhalten: ${P("(15 : 5)", 3)}.` }],
          weg: `${P(15, 3)} : ${P(5, 3)} = ${P("(15 : 5)", 3)} = ${P(3, 3)} = 27` },
        { id: "d", thema: "p2", text: `${W(2, 8)} · ${W(2, 2)}`, wert: 4, pruef: "sqrt(8)*sqrt(2)",
          hilfen: ["Schreibe beide Wurzeln als Potenzen mit dem Exponenten 1/2.", `${P(8, "1/2")} · ${P(2, "1/2")} = ${P("(8 · 2)", "1/2")}`],
          fehler: [{ wert: Math.sqrt(10), text: `Unter der Wurzel wird multipliziert: ${W(2, 8)} · ${W(2, 2)} = ${W(2, "8 · 2")}.` }],
          weg: `${W(2, 8)} · ${W(2, 2)} = ${W(2, "8 · 2")} = ${W(2, 16)} = 4` },
        { id: "e", thema: "p2", text: `Bestimme k so, dass ${P("(3x)", 2)} = k · ${P("x", 2)} gilt.`, vor: "k =", wert: 9, pruef: "expand((3*x)**2)/x**2",
          hilfen: ["Welche Faktoren stehen in der Klammer, und welche davon werden quadriert?", `${P("(3x)", 2)} = ${P(3, 2)} · ${P("x", 2)}`],
          fehler: [{ wert: 3, text: "Auch der Faktor 3 wird quadriert." }, { wert: 6, text: `${P(3, 2)} ist nicht 3 · 2.` }],
          weg: `${P("(3x)", 2)} = ${P(3, 2)} · ${P("x", 2)} = 9${P("x", 2)}, also k = 9` }
      ]
    },
    {
      id: "4-3", abschnitt: 4, niveau: 2, titel: "Potenz einer Potenz",
      einleitung: `Potenzgesetz P3: ${P(`(${P("a", "m")})`, "n")} = ${P("a", "m · n")}. Die Exponenten werden multipliziert. Berechne ohne Taschenrechner.`,
      teile: [
        { id: "a", thema: "p3", text: `Gib ${P(`(${P(2, 3)})`, 4)} als Potenz von 2 an.`, vor: "2 hoch", wert: 12, pruef: "log((I(2)**3)**4,2)",
          hilfen: ["Welches Potenzgesetz gilt für eine Potenz einer Potenz?", "Multipliziere die Exponenten 3 und 4."],
          fehler: [{ wert: 7, text: "Bei einer Potenz einer Potenz werden die Exponenten multipliziert, nicht addiert." }, { wert: 81, text: `${P(3, 4)} ist hier nicht gefragt: Die Basis ist 2, die Exponenten werden multipliziert.` }],
          weg: `${P(`(${P(2, 3)})`, 4)} = ${P(2, "3 · 4")} = ${P(2, 12)}` },
        { id: "b", thema: "p3", text: P(`(${P(3, -1)})`, -2), wert: 9, pruef: "(I(3)**-1)**-2",
          hilfen: ["Welches Potenzgesetz gilt für eine Potenz einer Potenz?", "Multipliziere die Exponenten: (−1) · (−2)."],
          fehler: [{ wert: 1 / 9, text: "(−1) · (−2) ist positiv." }, { wert: 1 / 27, text: "Die Exponenten werden multipliziert, nicht addiert." }],
          weg: `${P(`(${P(3, -1)})`, -2)} = ${P(3, 2)} = 9` },
        { id: "c", thema: "p3", text: `Gib ${P(`(${P("x", 6)})`, "1/3")} als Potenz von x an (x > 0).`, vor: "x hoch", wert: 2, pruef: "ex((x**6)**R(1,3))",
          hilfen: ["Was geschieht bei einer Potenz einer Potenz mit den Exponenten?", `Multipliziere 6 mit ${B(1, 3)}.`],
          fehler: [{ wert: 18, text: `Multipliziere mit ${B(1, 3)}, nicht mit 3.` }, { wert: 19 / 3, text: "Die Exponenten werden multipliziert, nicht addiert." }],
          weg: `${P(`(${P("x", 6)})`, "1/3")} = ${P("x", `6 · ${B(1, 3)}`)} = ${P("x", 2)}` },
        { id: "d", thema: "p3", text: P(`(−${P(2, 2)})`, 3), wert: -64, pruef: "(-I(2)**2)**3",
          hilfen: [`Was ist bei −${P(2, 2)} die Basis, und wohin gehört das Minus?`, `Berechne zuerst −${P(2, 2)} und nimm das Ergebnis hoch 3.`],
          fehler: [{ wert: 64, text: `−${P(2, 2)} = −4, und eine ungerade Potenz einer negativen Zahl ist negativ.` }],
          weg: `−${P(2, 2)} = −4, also ${P(`(−${P(2, 2)})`, 3)} = ${P("(−4)", 3)} = −64` },
        { id: "e", thema: "p3", text: `${P(8, "4/3")} (Tipp: 8 = ${P(2, 3)})`, wert: 16, pruef: "I(8)**R(4,3)",
          hilfen: ["Schreibe 8 als Potenz von 2.", `${P(`(${P(2, 3)})`, "4/3")}: Multipliziere die Exponenten.`],
          fehler: [{ wert: 32 / 3, text: `${P(8, "4/3")} ist nicht 8 · ${B(4, 3)}.` }],
          weg: `${P(8, "4/3")} = ${P(`(${P(2, 3)})`, "4/3")} = ${P(2, 4)} = 16` },
        { id: "f", thema: "p3", text: `Es gilt ${P(2, 10)} = 1024 ≈ ${P(10, 3)}. Bestimme damit einen Näherungswert für ${P(2, 20)} in der Form ${P(10, "k")}.`, vor: "10 hoch", wert: 6, pruef: "2*3",
          hilfen: [`Schreibe ${P(2, 20)} als Potenz von ${P(2, 10)}.`, `${P(2, 20)} = ${P(`(${P(2, 10)})`, 2)} ≈ ${P(`(${P(10, 3)})`, 2)}`],
          fehler: [{ wert: 5, text: `${P(`(${P(10, 3)})`, 2)} = ${P(10, "3 · 2")}: Exponenten multiplizieren.` }, { wert: 9, text: `${P(`(${P(10, 3)})`, 2)} = ${P(10, "3 · 2")}, nicht ${P(10, P(3, 2))}.` }],
          weg: `${P(2, 20)} = ${P(`(${P(2, 10)})`, 2)} ≈ ${P(`(${P(10, 3)})`, 2)} = ${P(10, 6)}, also etwa eine Million.` }
      ]
    },
    {
      id: "4-4", abschnitt: 4, niveau: 2, titel: "Summen und typische Fehler",
      einleitung: `Die Potenzgesetze gelten für Produkte und Quotienten. Summen von Potenzen kann man nur zusammenfassen, wenn die Glieder gleichartig sind: 3${P("a", "n")} + 5${P("a", "n")} = 8${P("a", "n")}.`,
      teile: [
        { id: "a", thema: "summe", typ: "auswahl", text: "Entscheide, welche Umformung richtig ist.",
          optionen: [`${P(2, 5)} + ${P(2, 5)} = ${P(2, 6)}`, `${P(2, 5)} + ${P(2, 5)} = ${P(2, 10)}`, `${P(2, 5)} + ${P(2, 5)} = ${P(4, 5)}`], richtig: 0,
          hilfen: [`Wie oft kommt ${P(2, 5)} in der Summe vor?`, `Schreibe die Summe als Produkt mit dem Faktor 2 = ${P(2, 1)}.`],
          weg: `${P(2, 5)} + ${P(2, 5)} = 2 · ${P(2, 5)} = ${P(2, 1)} · ${P(2, 5)} = ${P(2, 6)}` },
        { id: "b", thema: "summe", text: `Gib ${P(3, 4)} + ${P(3, 4)} + ${P(3, 4)} als Potenz von 3 an.`, vor: "3 hoch", wert: 5, pruef: "log(3*I(3)**4,3)",
          hilfen: ["Schreibe die Summe als Produkt.", `3 · ${P(3, 4)}: Schreibe 3 als ${P(3, 1)}.`],
          fehler: [{ wert: 12, text: "Bei einer Summe werden die Exponenten nicht addiert. Schreibe die Summe als Produkt." }],
          weg: `${P(3, 4)} + ${P(3, 4)} + ${P(3, 4)} = 3 · ${P(3, 4)} = ${P(3, 5)}` },
        { id: "c", thema: "summe", text: `Tim behauptet: ${P(2, 3)} + ${P(4, 3)} = ${P(6, 3)}. Zeige an diesem Beispiel, dass Tims Regel falsch ist: Berechne den Unterschied ${P(6, 3)} − (${P(2, 3)} + ${P(4, 3)}).`, wert: 144, pruef: "I(6)**3-(I(2)**3+I(4)**3)",
          hilfen: ["Berechne beide Seiten von Tims Gleichung einzeln.", `${P(2, 3)} = 8 und ${P(4, 3)} = 64. Was ist ${P(6, 3)}?`],
          weg: `${P(6, 3)} − (${P(2, 3)} + ${P(4, 3)}) = 216 − 72 = 144 ≠ 0. Tims Regel ist falsch.` },
        { id: "d", thema: "p1", typ: "auswahl", text: `Tom rechnet: ${P(4, 3)} · ${P(4, 2)} = ${P(16, 5)}. Entscheide, welche Aussage richtig ist.`,
          optionen: [`Er hat die Basen multipliziert; richtig ist ${P(4, 5)}.`, `Er hätte die Exponenten multiplizieren müssen: ${P(4, 6)}.`, "Das ist richtig."], richtig: 0,
          hilfen: ["Was geschieht bei gleicher Basis mit der Basis, was mit den Exponenten?", "Prüfe, ob bei P1 die Basis 4 erhalten bleibt."],
          weg: `${P(4, 3)} · ${P(4, 2)} = ${P(4, 5)} = 1024, aber ${P(16, 5)} = 1 048 576.` },
        { id: "e", thema: "summe", text: `Bestimme k so, dass 5${P("x", 3)} + 2${P("x", 3)} − ${P("x", 3)} = k · ${P("x", 3)} gilt.`, vor: "k =", wert: 6, pruef: "simplify((5*x**3+2*x**3-x**3)/x**3)",
          hilfen: ["Sind die drei Glieder gleichartig?", "Fasse nur die Vorfaktoren 5, 2 und −1 zusammen."],
          fehler: [{ wert: 7, text: `Das Glied −${P("x", 3)} hat den Vorfaktor −1.` }, { wert: 8, text: `Das Glied −${P("x", 3)} wird abgezogen.` }],
          weg: `5${P("x", 3)} + 2${P("x", 3)} − 1${P("x", 3)} = (5 + 2 − 1)${P("x", 3)} = 6${P("x", 3)}` },
        { id: "f", thema: "summe", typ: "auswahl", text: `Lea rechnet: ${P("(2 + 3)", 2)} = ${P(2, 2)} + ${P(3, 2)} = 13. Entscheide, welche Aussage richtig ist.`,
          optionen: [`Falsch: ${P("(2 + 3)", 2)} = ${P(5, 2)} = 25. Für eine Summe in der Basis gibt es kein Potenzgesetz.`, "Richtig nach dem Potenzgesetz P2.", `Falsch: Es ergibt ${P(2, 2)} · ${P(3, 2)} = 36.`], richtig: 0,
          hilfen: ["Berechne zuerst die Klammer und dann die Potenz.", "P2 gilt für Produkte in der Basis, nicht für Summen."],
          weg: `${P("(2 + 3)", 2)} = ${P(5, 2)} = 25 ≠ 13. Allgemein gilt ${P("(a + b)", 2)} = ${P("a", 2)} + 2ab + ${P("b", 2)}, nicht ${P("a", 2)} + ${P("b", 2)}. Ebenso ist ${W(2, "a + b")} ≠ ${W(2, "a")} + ${W(2, "b")}.` },
        { id: "g", thema: "p2", typ: "auswahl", text: `Entscheide, welche Umformung von ${P(2, 3)} · ${P(3, 2)} richtig ist.`,
          optionen: [`${P(2, 3)} · ${P(3, 2)} = 8 · 9 = 72`, `${P(2, 3)} · ${P(3, 2)} = ${P(6, 5)}`, `${P(2, 3)} · ${P(3, 2)} = ${P(6, 6)}`], richtig: 0,
          hilfen: ["Haben die Potenzen dieselbe Basis oder denselben Exponenten?", "Weder P1 noch P2 passt. Berechne die Potenzen einzeln."],
          weg: `Basen und Exponenten sind verschieden, deshalb hilft kein Potenzgesetz: ${P(2, 3)} · ${P(3, 2)} = 8 · 9 = 72.` }
      ]
    },
    {
      id: "4-5", abschnitt: 4, niveau: 3, titel: "Terme und Überschläge",
      einleitung: "Hier brauchst du mehrere Potenzgesetze nacheinander. Es gilt a > 0, x > 0 und y > 0.",
      teile: [
        { id: "a", thema: "terme", text: `Gib ${P("a", 3)} · ${P("a", "−1/2")} als Potenz von a an.`, vor: "a hoch", wert: 2.5, loesung: "5/2", pruef: "ex(x**3*x**R(-1,2))",
          hilfen: ["Gleiche Basis: Was geschieht mit den Exponenten?", `Berechne 3 + (−${B(1, 2)}). Schreibe 3 als ${B(6, 2)}.`],
          fehler: [{ wert: -1.5, text: "Exponenten werden addiert, nicht multipliziert." }, { wert: 3.5, text: "Achte auf das Minuszeichen im Exponenten." }],
          weg: `${P("a", 3)} · ${P("a", "−1/2")} = ${P("a", "3 − 1/2")} = ${P("a", "5/2")}` },
        { id: "b", thema: "terme", text: `Forme ${P(`(${P("x", 2)} · ${P("y", -1)})`, 3)} · ${P("y", 4)} in die Form ${P("x", "p")} · ${P("y", "q")} um. Gib p an.`, vor: "x hoch", wert: 6, pruef: "exv((x**2*y**-1)**3*y**4, x)",
          hilfen: [`Womit beginnst du: mit der Klammer oder mit dem Faktor ${P("y", 4)}?`, `Löse die Klammer mit P2 und P3 auf: ${P(`(${P("x", 2)})`, 3)} = ${P("x", "2 · 3")}.`],
          fehler: [{ wert: 5, text: "Potenz einer Potenz: Exponenten multiplizieren, nicht addieren." }],
          weg: `${P(`(${P("x", 2)} · ${P("y", -1)})`, 3)} · ${P("y", 4)} = ${P("x", 6)} · ${P("y", -3)} · ${P("y", 4)} = ${P("x", 6)} · ${P("y", 1)}` },
        { id: "c", thema: "terme", text: `Gib für denselben Term ${P(`(${P("x", 2)} · ${P("y", -1)})`, 3)} · ${P("y", 4)} den Exponenten q von y an.`, vor: "y hoch", wert: 1, pruef: "exv((x**2*y**-1)**3*y**4, y)",
          hilfen: ["Welcher Exponent entsteht für y, wenn du die Klammer auflöst?", `${P(`(${P("y", -1)})`, 3)} = ${P("y", -3)}; fasse mit ${P("y", 4)} zusammen.`],
          fehler: [{ wert: 7, text: `${P(`(${P("y", -1)})`, 3)} = ${P("y", -3)}, nicht ${P("y", 3)}.` }, { wert: 3, text: `Der Faktor ${P("y", 4)} muss noch dazu.` }],
          weg: `${P("y", -3)} · ${P("y", 4)} = ${P("y", 1)} = y` },
        { id: "d", thema: "p3", text: `Es gilt ${P(2, 10)} = 1024 ≈ ${P(10, 3)}. Bestimme damit einen Näherungswert für ${P(2, 40)} in der Form ${P(10, "k")}.`, vor: "10 hoch", wert: 12, pruef: "4*3",
          hilfen: [`Schreibe ${P(2, 40)} als Potenz von ${P(2, 10)}.`, `${P(2, 40)} = ${P(`(${P(2, 10)})`, 4)} ≈ ${P(`(${P(10, 3)})`, 4)}`],
          fehler: [{ wert: 7, text: `${P(`(${P(10, 3)})`, 4)} = ${P(10, "3 · 4")}: Exponenten multiplizieren.` }, { wert: 40, text: `${P(2, 40)} ist viel kleiner als ${P(10, 40)}. Nutze ${P(2, 10)} ≈ ${P(10, 3)}.` }],
          weg: `${P(2, 40)} = ${P(`(${P(2, 10)})`, 4)} ≈ ${P(`(${P(10, 3)})`, 4)} = ${P(10, 12)}` },
        { id: "e", thema: "p1", typ: "wiss", text: `Eine Galaxie hat etwa 2 · ${P(10, 11)} Sterne. Im Weltall gibt es geschätzt ${P(10, 11)} Galaxien. Berechne, wie viele Sterne es dann ungefähr gibt.`, einheit: "Sterne", wert: 2e22, pruef: "2*10**11*10**11",
          hilfen: ["Welche Rechenart verbindet die Sterne je Galaxie mit der Anzahl der Galaxien?", "Multipliziere. Bei gleicher Basis 10 werden die Exponenten addiert."],
          weg: `2 · ${P(10, 11)} · ${P(10, 11)} = ${WS(2, 22)}` }
      ]
    }
  ];

  // ───────────── Tests zur Selbstkontrolle ─────────────
  // Jeder Durchgang erzeugt aus einem Startwert neue Zahlen. Acht Fragen je Abschnitt, je 1 Punkt.
  function zufall(startwert) {
    let a = startwert >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hash(text) {
    let h = 2166136261;
    for (const z of String(text)) h = Math.imul(h ^ z.codePointAt(0), 16777619);
    return h >>> 0;
  }
  // Antwortmöglichkeiten mischen; die richtige steht vorher an Stelle 0
  function mische(r, frage) {
    const reihenfolge = frage.optionen.map((o, i) => [i, r()]).sort((x, y) => x[1] - y[1]).map(([i]) => i);
    return { ...frage, optionen: reihenfolge.map((i) => frage.optionen[i]), richtig: reihenfolge.indexOf(0) };
  }
  const bruchText = (z, n) => (n === 1 ? String(z) : `${z}/${n}`).replace("-", "−");
  const ggT = (a, b) => (b ? ggT(b, a % b) : Math.abs(a));
  function kuerze(z, n) { const g = ggT(z, n); return n / g < 0 ? [-z / g, -n / g] : [z / g, n / g]; }

  const TESTS = {
    // Eingangstest: sechs Fragen zum Vorwissen aus Klasse 9 (Gutachten M-C3)
    0: function (r) {
      const w = (l) => l[Math.floor(r() * l.length)];
      const f = [];
      { const [b, n] = w([[2, 5], [2, 6], [3, 3], [3, 4], [4, 3], [5, 3], [10, 4], [2, 7]]); f.push({ thema: "vw_pot", text: P(b, n), wert: b ** n, pruef: `I(${b})**${n}` }); }
      { const b = w([2, 3, 4, 5]), n = w([2, 3]), mitKlammer = r() < 0.5;
        f.push({ thema: "vw_pot", text: mitKlammer ? P(`(−${b})`, n) : `−${P(b, n)}`, wert: mitKlammer ? (-b) ** n : -(b ** n), pruef: mitKlammer ? `I(-${b})**${n}` : `-I(${b})**${n}` }); }
      { const k = w([7, 8, 9, 11, 12, 13, 14, 15, 16]); f.push({ thema: "vw_wurzel", text: W(2, k * k), wert: k, pruef: `sqrt(${k * k})` }); }
      { const [p, q] = w([[3, 4], [2, 5], [5, 6], [4, 7], [3, 8], [7, 9], [1, 6], [9, 10]]);
        f.push({ thema: "vw_wurzel", text: W(2, B(p * p, q * q)) + ` <span class="klein">Gib das Ergebnis als Bruch an.</span>`, exakt: true, wert: p / q, loesung: bruchText(p, q), pruef: `sqrt(R(${p * p},${q * q}))` }); }
      { const [a, b, c, d] = w([[2, 3, 9, 4], [3, 5, 10, 9], [4, 7, 21, 8], [5, 6, 3, 10], [2, 9, 3, 4], [6, 7, 14, 9], [3, 8, 4, 9], [5, 12, 4, 15]]); const [z, n] = kuerze(a * c, b * d);
        f.push({ thema: "vw_bruch", text: `${B(a, b)} · ${B(c, d)} <span class="klein">Gib das Ergebnis als gekürzten Bruch an.</span>`, exakt: true, wert: (a * c) / (b * d), loesung: bruchText(z, n), pruef: `R(${a},${b})*R(${c},${d})` }); }
      { const [p, q] = w([[2, 3], [3, 4], [2, 5], [3, 5], [4, 5], [1, 3], [5, 6], [3, 7]]), n = w([2, 3]);
        f.push({ thema: "vw_bruch", text: `${P(`(${B(p, q)})`, n)} <span class="klein">Gib das Ergebnis als Bruch an.</span>`, exakt: true, wert: p ** n / q ** n, loesung: bruchText(p ** n, q ** n), pruef: `R(${p},${q})**${n}` }); }
      return f;
    },
    1: function (r) {
      const w = (l) => l[Math.floor(r() * l.length)];
      const f = [];
      { const b = w([2, 3, 4]), n = w([3, 4, 5]); f.push({ thema: "nat", text: `${P(`(−${b})`, n)}`, wert: (-b) ** n, pruef: `I(-${b})**${n}` }); }
      { const b = w([2, 3, 4, 5]), n = w([2, 4]); f.push({ thema: "nat", text: `−${P(b, n)}`, wert: -(b ** n), pruef: `-I(${b})**${n}` }); }
      { const b = w([2, 3, 4, 5, 6]), n = w([2, 3]); f.push({ thema: "neg", text: `${P(b, -n)} <span class="klein">Gib das Ergebnis als Bruch an.</span>`, exakt: true, wert: 1 / b ** n, loesung: `1/${b ** n}`, pruef: `I(${b})**-${n}` }); }
      { const [p, q] = w([[2, 3], [3, 4], [2, 5], [3, 5]]), n = w([2, 3]); const [z, m] = [q ** n, p ** n];
        f.push({ thema: "neg", text: `${P(`(${B(p, q)})`, -n)} <span class="klein">Gib das Ergebnis als Bruch an.</span>`, exakt: true, wert: z / m, loesung: `${bruchText(z, m)}`, pruef: `R(${p},${q})**-${n}` }); }
      { const b = w([2, 3, 4, 5, 6, 7, 8, 9]); const [z, n] = kuerze(b + 1, b);
        f.push({ thema: "null", text: `${P(b, 0)} + ${P(b, -1)} <span class="klein">Gib das Ergebnis als Bruch an.</span>`, exakt: true, wert: (b + 1) / b, loesung: bruchText(z, n), pruef: `I(${b})**0 + I(${b})**-1` }); }
      { const k = w([2, 3, 4, 5, 6, 7, 8, 9]); f.push({ thema: "neg", text: `Gib ${B(1, 2 ** k)} als Potenz mit der Basis 2 an.`, vor: "2 hoch", wert: -k, pruef: `log(R(1,${2 ** k}),2)` }); }
      { const [name, e] = w([["Mikrogramm (µg)", -6], ["Nanometer (nm)", -9], ["Milligramm (mg)", -3], ["Gigabyte (GB)", 9], ["Megahertz (MHz)", 6], ["Kilometer (km)", 3], ["Mikrosekunde (µs)", -6], ["Terabyte (TB)", 12], ["Millisekunde (ms)", -3]]);
        const einheit = name.match(/\((.+)\)/)[1].replace(/^(µ|n|m|G|M|k|T)/, "");
        f.push({ thema: "zehn", text: `1 ${name} = 10<sup>?</sup> ${einheit}`, vor: "10 hoch", wert: e, pruef: `${e}` }); }
      { const b = w([2, 4, 5]), n = w([2, 3]);
        f.push(mische(r, { thema: "neg", typ: "auswahl", text: `Entscheide, welche Aussage über ${P(b, -n)} richtig ist.`,
          optionen: [`${P(b, -n)} = ${B(1, b ** n)}`, `${P(b, -n)} = −${b ** n}`, `${P(b, -n)} = −${B(1, b ** n)}`, `${P(b, -n)} = ${B(1, `${b} · ${n}`)}`] })); }
      return f;
    },
    2: function (r) {
      const w = (l) => l[Math.floor(r() * l.length)];
      const ganz = (a, b) => a + Math.floor(r() * (b - a + 1));
      const f = [];
      // Ziffernfolge mit zwei bis drei geltenden Ziffern
      const vorfaktor = () => { const z = ganz(11, 99) ; const v = z % 10 === 0 ? z + 1 : z; return v / 10; };
      { const a = vorfaktor(), n = ganz(4, 7); const x = Math.round(a * 10 ** n);
        f.push({ thema: "gross", typ: "wiss", text: zf(x), wert: x, pruef: `${x}` }); }
      { const a = vorfaktor(), n = ganz(3, 6); const z = Math.round(a * 10); const x = z / 10 ** (n + 1);
        f.push({ thema: "klein", typ: "wiss", text: zf(x, 12), wert: x, pruef: `R(${z},10**${n + 1})` }); }
      { const a = vorfaktor(), n = ganz(4, 6); const z = Math.round(a * 10); const x = z * 10 ** (n - 1);
        f.push({ thema: "gross", text: `Gib ${WS(a, n)} ohne Zehnerpotenz an.`, wert: x, loesung: zf(x), pruef: `R(${z},10)*10**${n}` }); }
      { const a = vorfaktor(), n = ganz(2, 4); const z = Math.round(a * 10); const x = z / 10 ** (n + 1);
        f.push({ thema: "klein", text: `Gib ${WS(a, -n)} als Dezimalzahl an.`, wert: x, loesung: zf(x, 12), pruef: `R(${z},10)*I(10)**-${n}` }); }
      { const [vs, e] = w([["µm", -6], ["nm", -9], ["mm", -3]]); const z = ganz(2, 9) * 10 + ganz(1, 9); const x = z * 10 ** e;
        f.push({ thema: "einheit", typ: "wiss", text: `Gib ${z} ${vs} in Metern an.`, einheit: "m", wert: x, pruef: `${z}*I(10)**(${e})` }); }
      { const a = ganz(2, 4), b = ganz(2, 4), m = ganz(3, 8), n = ganz(2, 6);
        f.push({ thema: "sach", typ: "wiss", text: `(${a} · ${P(10, m)}) · (${b} · ${P(10, n)})`, wert: a * b * 10 ** (m + n), pruef: `${a}*10**${m}*${b}*10**${n}` }); }
      { const k = ganz(1, 3), m = ganz(7, 9); const s = 3 * k;
        f.push({ thema: "sach", typ: "wiss", text: `Eine Raumsonde ist ${s} · ${P(10, m)} km von der Erde entfernt. Berechne, wie viele Sekunden ein Funksignal (Lichtgeschwindigkeit 3 · ${P(10, 5)} km/s) bis zur Erde braucht.`, einheit: "s", wert: k * 10 ** (m - 5), pruef: `${s}*10**${m}/(3*10**5)` }); }
      { const [anteil, e] = w([["ppm", -6], ["ppb", -9]]); const z = ganz(2, 9);
        f.push({ thema: "einheit", text: `Ein Anteil von ${z} ${anteil} entspricht ${z} · ${P(10, "?")}. Gib den Exponenten an.`, vor: "10 hoch", wert: e, pruef: `${e}` }); }
      return f;
    },
    3: function (r) {
      const w = (l) => l[Math.floor(r() * l.length)];
      const f = [];
      { const [n, b] = w([[3, 3], [3, 4], [3, 5], [3, 6], [4, 2], [4, 3], [4, 4], [5, 2], [5, 3]]); f.push({ thema: "wurzel", text: W(n, b ** n), wert: b, pruef: `root(${b ** n},${n})` }); }
      { const [a, n] = w([[49, 2], [64, 3], [81, 4], [32, 5], [1000, 3], [8, 3], [243, 5], [16, 4], [343, 3]]); f.push({ thema: "stamm", text: P(zf(a), `1/${n}`), wert: Math.round(a ** (1 / n)), pruef: `I(${a})**R(1,${n})` }); }
      { const [a, m, n] = w([[8, 2, 3], [16, 3, 4], [27, 2, 3], [4, 5, 2], [25, 3, 2], [32, 2, 5], [9, 3, 2], [64, 2, 3], [125, 2, 3]]); const x = Math.round(a ** (m / n));
        f.push({ thema: "rational", text: P(a, `${m}/${n}`), wert: x, pruef: `I(${a})**R(${m},${n})` }); }
      { const [a, m, n] = w([[16, 1, 2], [8, 2, 3], [27, 1, 3], [9, 3, 2], [16, 3, 4], [25, 1, 2], [64, 2, 3], [125, 1, 3], [4, 3, 2]]); const x = Math.round(a ** (m / n));
        f.push({ thema: "rational", text: P(a, `−${m}/${n}`) + ` <span class="klein">Gib das Ergebnis als Bruch an.</span>`, exakt: true, wert: 1 / x, loesung: `1/${x}`, pruef: `I(${a})**R(-${m},${n})` }); }
      { const [m, n] = w([[2, 3], [3, 4], [2, 5], [3, 2], [5, 3], [4, 5], [5, 2], [7, 3], [5, 4]]); const [z, nn] = kuerze(m, n);
        f.push({ thema: "umform", text: `Gib ${W(n, P("x", m))} als Potenz von x an (x > 0).`, vor: "x hoch", wert: m / n, loesung: bruchText(z, nn), pruef: `ex(root(x**${m},${n}))` }); }
      { const [m, n] = w([[3, 4], [2, 3], [3, 5], [4, 3], [2, 5], [5, 2], [5, 3], [3, 2], [4, 5]]);
        f.push(mische(r, { thema: "umform", typ: "auswahl", text: `Entscheide, welche Wurzelschreibweise zu ${P("x", `${m}/${n}`)} gehört (x > 0).`,
          optionen: [W(n, P("x", m)), W(m, P("x", n)), B(P("x", m), n), W(m * n, "x")] })); }
      { const [b, m, n] = w([[8, 2, 3], [27, 2, 3], [4, 3, 2], [9, 3, 2], [16, 3, 4], [125, 2, 3], [16, 1, 2], [32, 2, 5]]); const y = Math.round(b ** (m / n));
        f.push({ thema: "rational", text: `Bestimme die Basis b, für die ${P("b", `${m}/${n}`)} = ${y} gilt.`, vor: "b =", wert: b, pruef: `I(${y})**R(${n},${m})` }); }
      { const [n, a] = w([[3, 50], [3, 100], [4, 50], [4, 300], [5, 100], [3, 200], [3, 500], [5, 1000]]);
        f.push({ thema: "wurzel", text: `Bestimme, zwischen welchen aufeinanderfolgenden natürlichen Zahlen ${W(n, a)} liegt. Gib die kleinere an.`, wert: Math.floor(a ** (1 / n) + 1e-12), pruef: `floor(root(${a},${n}))` }); }
      return f;
    },
    4: function (r) {
      const w = (l) => l[Math.floor(r() * l.length)];
      const ganz = (a, b) => a + Math.floor(r() * (b - a + 1));
      const f = [];
      { const b = w([2, 3]), m = ganz(-4, -1), n = ganz(3, 6); f.push({ thema: "p1", text: `${P(b, m)} · ${P(b, n)}`, wert: b ** (m + n), ...(m + n < 0 ? { loesung: `1/${b ** -(m + n)}` } : {}), pruef: `I(${b})**(${m})*I(${b})**${n}` }); }
      { const b = w([2, 5, 10]), n = ganz(3, 6), m = n + ganz(1, 3); f.push({ thema: "p1", text: `${P(b, m)} : ${P(b, n)}`, wert: b ** (m - n), pruef: `I(${b})**${m}/I(${b})**${n}` }); }
      { const [a, b] = w([[2, 5], [4, 25], [0.5, 4], [2.5, 4], [20, 5]]); const n = w([2, 3]);
        const at = zf(a), bt = zf(b);
        f.push({ thema: "p2", text: `${P(at, n)} · ${P(bt, n)}`, wert: Math.round((a * b) ** n * 1e9) / 1e9, pruef: `nsimplify(${a})**${n}*nsimplify(${b})**${n}` }); }
      { const b = w([2, 3, 5]), m = ganz(2, 5), n = w([-3, -2, 2, 3, 4]);
        f.push({ thema: "p3", text: `Gib ${P(`(${P(b, m)})`, n)} als Potenz von ${b} an.`, vor: `${b} hoch`, wert: m * n, pruef: `log((I(${b})**${m})**(${n}),${b})` }); }
      { const m = ganz(3, 8), n = ganz(2, 6), k = ganz(4, 12);
        f.push({ thema: "p1", text: `Gib ${B(`${P("x", m)} · ${P("x", n)}`, P("x", k))} als Potenz von x an (x ≠ 0).`, vor: "x hoch", wert: m + n - k, pruef: `ex(x**${m}*x**${n}/x**${k})` }); }
      { const [p, q] = w([[1, 2], [1, 3], [2, 3], [1, 4]]), [s, t] = w([[1, 3], [1, 2], [1, 6], [3, 4]]);
        const [z, n] = kuerze(p * t + s * q, q * t);
        f.push({ thema: "terme", text: `Gib ${P("a", `${p}/${q}`)} · ${P("a", `${s}/${t}`)} als Potenz von a an (a > 0).`, vor: "a hoch", wert: z / n, loesung: bruchText(z, n), pruef: `ex(x**R(${p},${q})*x**R(${s},${t}))` }); }
      if (r() < 0.5) { const b = w([2, 3, 5]), n = ganz(3, 6);
        f.push(mische(r, { thema: "summe", typ: "auswahl", text: "Entscheide, welche Umformung richtig ist.",
          optionen: [`${b} · ${P(b, n)} = ${P(b, n + 1)}`, `${P(b, n)} + ${P(b, n)} = ${P(b, 2 * n)}`, `${P(b, n)} · ${P(b, 2)} = ${P(b, 2 * n)}`, `${P(b, n)} + ${P(b, 2)} = ${P(b, n + 2)}`] })); }
      else { const [p, q] = w([[1, 2], [1, 3], [2, 3], [2, 5], [3, 4]]), n = w([2, 3]);
        f.push(mische(r, { thema: "summe", typ: "auswahl", text: `Entscheide, welche Aussage über ${P(`(${p} + ${q})`, n)} richtig ist.`,
          optionen: [`${P(`(${p} + ${q})`, n)} = ${P(p + q, n)} = ${(p + q) ** n}`, `${P(`(${p} + ${q})`, n)} = ${P(p, n)} + ${P(q, n)} = ${p ** n + q ** n}`, `${P(`(${p} + ${q})`, n)} = ${P(p, n)} · ${P(q, n)} = ${(p * q) ** n}`] })); }
      { const k = ganz(2, 9); f.push({ thema: "p3", text: `Es gilt ${P(2, 10)} ≈ ${P(10, 3)}. Bestimme damit einen Näherungswert für ${P(2, 10 * k)} in der Form ${P(10, "k")}.`, vor: "10 hoch", wert: 3 * k, pruef: `3*${k}` }); }
      return f;
    }
  };

  // Test erzeugen: dieselbe Person, derselbe Abschnitt und derselbe Durchgang ergeben dieselben Fragen.
  // Ein gerundeter Exponent ist eine andere Zahl (x^0,67 ≠ ∛x²): Exponenten von Variablen nur exakt annehmen.
  function exponentExakt(t) {
    if (t.vor && /^[a-z] hoch$/.test(t.vor)) t.exakt = true;
    return t;
  }
  for (const u of UEBUNGEN) u.teile.forEach(exponentExakt);

  // Training je Thema: eine Aufgabe mit neuen Zahlen aus dem Testgenerator des Abschnitts
  function erzeugeTraining(thema, startwert) {
    const ab = THEMEN[thema].abschnitt;
    for (let versuch = 0; versuch < 20; versuch++) {
      const passend = erzeugeTest(ab, `${startwert}|${versuch}`).filter((f) => f.thema === thema);
      if (passend.length) return { ...passend[Math.floor(zufall(hash(startwert + "|wahl|" + versuch))() * passend.length)], id: "1" };
    }
    return null;
  }

  // Abschlusstest über alle Abschnitte: aus jedem Abschnittstest drei verschiedene Fragen,
  // jeweils aus einem eigenen Zufallsstrom, damit die Zahlen unabhängig vom Abschnittstest sind.
  const ABSCHLUSS = { id: 5, nr: "Abschluss", titel: "Abschlusstest über alle Abschnitte", jeAbschnitt: 3 };
  const EINGANG = { id: 0, nr: "0", titel: "Eingangstest: Wissen aus Klasse 9" };
  // Feste Plätze (Fragennummern der Abschnittstests, ab 0): jeder Abschlusstest prüft dieselben Kernthemen.
  const ABSCHLUSS_PLAETZE = {
    1: [[2, 3], [0, 1], [5, 7]], // negativer Exponent, Vorzeichen, Potenz von 2 bzw. Aussage über a⁻ⁿ
    2: [[0, 1], [2, 3], [5, 6]], // in Zehnerpotenz, aus Zehnerpotenz, Sachaufgabe
    3: [[0, 1], [2, 3], [4, 5]], // Wurzel bzw. Stammbruch, rationaler Exponent, Umformen
    4: [[0, 1], [3, 4], [6]]     // P1, P3 bzw. Terme, Summen
  };
  TESTS[5] = function (r) {
    const f = [];
    for (const ab of [1, 2, 3, 4]) {
      const pool = TESTS[ab](zufall(Math.floor(r() * 4294967296)));
      for (const platz of ABSCHLUSS_PLAETZE[ab]) f.push({ ...pool[platz[Math.floor(r() * platz.length)]], abschnitt: ab });
    }
    return f;
  };

  function erzeugeTest(abschnitt, startwert) {
    const r = zufall(hash(startwert));
    return TESTS[abschnitt](r).map((fr, i) => exponentExakt({ id: String(i + 1), typ: "zahl", ...fr }));
  }

  // Lösung zum Anzeigen
  function loesungText(t) {
    if (t.typ === "auswahl") return t.optionen[t.richtig];
    if (t.loesung) return t.loesung.replace(/-/g, "−");
    if (t.typ === "wiss") {
      const n = Math.floor(Math.log10(Math.abs(t.wert)) + 1e-12);
      const a = Math.round((t.wert / 10 ** n) * 1e6) / 1e6;
      return `${zf(a)} · 10<sup>${mz(n)}</sup>`;
    }
    return zf(t.wert, 6);
  }

  const daten = { ABSCHNITTE, ABSCHLUSS, EINGANG, THEMEN, NIVEAUS, COMICS, COMIC_STORY, UEBUNGEN, erzeugeTest, erzeugeTraining, loesungText, hash, zf };
  const ziel = typeof window !== "undefined" ? window : globalThis;
  Object.assign(ziel, daten);
  if (typeof module !== "undefined") module.exports = daten;
})();
