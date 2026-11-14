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
    const s = Number(x).toLocaleString("de-DE", { maximumFractionDigits: stellen, useGrouping: true });
    return s.replace(/\./g, " ").replace("-", "−");
  }
  const WS = (a, n) => `${zf(a)} · 10<sup>${mz(n)}</sup>`;

  // ───────────── Abschnitte ─────────────
  const ABSCHNITTE = [
    {
      id: 1, nr: "1", titel: "Potenzen mit ganzzahligen Exponenten", seiten: "S. 43–48",
      merke: `<p>Für eine Zahl a und eine natürliche Zahl n ≥ 2 ist ${P("a", "n")} = a · a · … · a (n Faktoren). Dazu gilt ${P("a", 1)} = a und für a ≠ 0 auch ${P("a", 0)} = 1.</p>
        <p>Für a ≠ 0 gilt ${P("a", "−n")} = ${B(1, P("a", "n"))}. Ein negativer Exponent bedeutet also „Kehrwert“, nicht „negative Zahl“: ${P(2, -3)} = ${B(1, 8)}.</p>
        <p>Achte auf Klammern: ${P("(−3)", 2)} = 9, aber −${P(3, 2)} = −9.</p>`,
      buch: "Information S. 44–45, Übungen S. 46 Nr. 2, 3, 6, 8, 9; S. 47 Nr. 13, 16; S. 48 Nr. 23"
    },
    {
      id: 2, nr: "2", titel: "Zahlen mit abgetrennten Zehnerpotenzen", seiten: "S. 49–51 und 62–63",
      merke: `<p>Sehr große und sehr kleine Zahlen schreibt man als Vorfaktor zwischen 1 und 10 mal Zehnerpotenz:</p>
        <p class="formel">52 000 = ${WS(5.2, 4)} &nbsp;&nbsp; 0,0034 = ${WS(3.4, -3)}</p>
        <p>Der Exponent gibt an, um wie viele Stellen das Komma verschoben wird: positiv bei großen Zahlen, negativ bei Zahlen zwischen 0 und 1.</p>
        <p>Vorsilben: Kilo ${P(10, 3)}, Mega ${P(10, 6)}, Giga ${P(10, 9)}, Tera ${P(10, 12)}; Milli ${P(10, -3)}, Mikro ${P(10, -6)}, Nano ${P(10, -9)}. Kleine Anteile: 1 ppm = ${P(10, -6)}, 1 ppb = ${P(10, -9)}.</p>`,
      buch: "Selbstlernseiten S. 49–51 mit Nr. 1–3, 5, 7–9, 11; Im Blickpunkt S. 62–63 Nr. 2, 3"
    },
    {
      id: 3, nr: "3", titel: "Potenzen mit rationalen Exponenten", seiten: "S. 52–59",
      merke: `<p>Für a ≥ 0 ist ${W("n", "a")} die nichtnegative Zahl, deren n-te Potenz a ergibt: ${W(3, 64)} = 4, denn ${P(4, 3)} = 64.</p>
        <p>Für a ≥ 0 gilt ${P("a", "1/n")} = ${W("n", "a")}, und für a > 0 gilt ${P("a", "m/n")} = ${W("n", P("a", "m"))} = ${P(`(${W("n", "a")})`, "m")}.</p>
        <p>Rechentipp: zuerst die Wurzel ziehen, dann potenzieren: ${P(8, "2/3")} = ${P("(∛8)", 2)} = ${P(2, 2)} = 4.</p>`,
      buch: "Information S. 53–54 und 57, Übungen S. 55 Nr. 4, 5, 9; S. 58 Nr. 4–7; S. 59 Nr. 8, 11, 14"
    },
    {
      id: 4, nr: "4", titel: "Potenzgesetze und ihre Anwendung", seiten: "S. 64–71",
      merke: `<p><b>P1</b> gleiche Basis: ${P("a", "m")} · ${P("a", "n")} = ${P("a", "m+n")} und ${P("a", "m")} : ${P("a", "n")} = ${P("a", "m−n")}</p>
        <p><b>P2</b> gleicher Exponent: ${P("a", "n")} · ${P("b", "n")} = ${P("(a · b)", "n")} und ${P("a", "n")} : ${P("b", "n")} = ${P("(a : b)", "n")}</p>
        <p><b>P3</b> Potenz einer Potenz: ${P(`(${P("a", "m")})`, "n")} = ${P("a", "m · n")}</p>
        <p>Summen und Differenzen lassen sich nur zusammenfassen, wenn die Glieder gleichartig sind: 3${P("a", "n")} + 5${P("a", "n")} = 8${P("a", "n")}, aber ${P(2, 3)} + ${P(4, 3)} ≠ ${P(6, 3)}.</p>`,
      buch: "Information S. 64 und 66, Übungen S. 67 Nr. 6, 7; S. 68 Nr. 9, 13, 14; S. 69 Nr. 19, 20; S. 70 Nr. 26, 28"
    }
  ];

  // ───────────── Themen für Rückmeldung und Wiederholung ─────────────
  const THEMEN = {
    nat: { abschnitt: 1, name: "Potenzen mit natürlichen Exponenten", merke: `${P("a", "n")} ist ein Produkt aus n gleichen Faktoren a. Bei negativer Basis entscheidet der Exponent über das Vorzeichen: gerade → positiv, ungerade → negativ.`, tipps: [`Klammer beachten: ${P("(−2)", 4)} = 16, aber −${P(2, 4)} = −16.`, "Brüche: Zähler und Nenner einzeln potenzieren."], buch: "S. 44 (1) und S. 46 Nr. 2, 8" },
    neg: { abschnitt: 1, name: "Negative Exponenten", merke: `${P("a", "−n")} = ${B(1, P("a", "n"))} für a ≠ 0. Bei Brüchen: ${P(`(${B("a", "b")})`, "−n")} = ${P(`(${B("b", "a")})`, "n")}.`, tipps: [`${P(3, -2)} ist positiv: ${B(1, 9)}, nicht −9.`, `${P(0, -1)} ist nicht definiert.`], buch: "S. 45 (2) und S. 46 Nr. 6, 9; S. 47 Nr. 13" },
    null: { abschnitt: 1, name: "Exponent null", merke: `${P("a", 0)} = 1 für jede Zahl a ≠ 0.`, tipps: [`${P(7, 0)} = 1, nicht 0 und nicht 7.`], buch: "S. 44 Definition und S. 46 Nr. 6" },
    zehn: { abschnitt: 1, name: "Zehnerpotenzen und Vorsilben", merke: `${P(10, "n")} ist eine 1 mit n Nullen, ${P(10, "−n")} hat die 1 an der n-ten Stelle nach dem Komma.`, tipps: ["Mikro (µ) = 10⁻⁶, Nano = 10⁻⁹, Giga = 10⁹, Tera = 10¹²."], buch: "S. 45 (3), (4) und S. 46 Nr. 2" },
    gross: { abschnitt: 2, name: "Große Zahlen mit Zehnerpotenz", merke: `Vorfaktor zwischen 1 und 10, Exponent = Anzahl der Stellen, um die das Komma nach rechts wandert: 38 000 = ${WS(3.8, 4)}.`, tipps: [`${WS(38, 3)} hat den richtigen Wert, aber keinen Vorfaktor zwischen 1 und 10.`], buch: "S. 49 Beispiel und Nr. 1, 3" },
    klein: { abschnitt: 2, name: "Kleine Zahlen mit Zehnerpotenz", merke: `Bei Zahlen zwischen 0 und 1 ist der Exponent negativ: 0,0052 = ${WS(5.2, -3)}.`, tipps: ["Zähle die Stellen bis hinter die erste von null verschiedene Ziffer."], buch: "S. 49 und S. 50 Nr. 7, 8; S. 51 Nr. 9" },
    einheit: { abschnitt: 2, name: "Vorsilben und Anteile (ppm, ppb)", merke: `Vorsilbe durch Zehnerpotenz ersetzen: 40 µm = 40 · ${P(10, -6)} m = ${WS(4, -5)} m. 1 ppm = ${P(10, -6)}, 1 ppb = ${P(10, -9)}.`, tipps: ["Billion im Englischen = Milliarde im Deutschen."], buch: "S. 45 Tabelle, S. 51 Nr. 11, 12; S. 62–63" },
    sach: { abschnitt: 2, name: "Sachaufgaben mit Zehnerpotenzen", merke: `Vorfaktoren und Zehnerpotenzen getrennt verrechnen: (3 · ${P(10, 5)}) · (6 · ${P(10, 1)}) = 18 · ${P(10, 6)} = ${WS(1.8, 7)}.`, tipps: ["Am Ende den Vorfaktor wieder zwischen 1 und 10 bringen.", "Einheiten mitschreiben."], buch: "S. 50 Nr. 5, 6; S. 63 Nr. 3, 5" },
    wurzel: { abschnitt: 3, name: "n-te Wurzeln", merke: `${W("n", "a")} ist für a ≥ 0 die nichtnegative Zahl, deren n-te Potenz a ist.`, tipps: [`${W(4, 16)} = 2, nicht ±2.`, "Bekannte Potenzen helfen: 2⁵ = 32, 3⁴ = 81, 5³ = 125."], buch: "S. 53 Definition und S. 55 Nr. 4, 5, 6" },
    stamm: { abschnitt: 3, name: "Stammbrüche als Exponenten", merke: `${P("a", "1/n")} = ${W("n", "a")} für a ≥ 0.`, tipps: [`${P(9, "1/2")} = 3, nicht 4,5.`], buch: "S. 54 Definition und S. 55 Nr. 9" },
    rational: { abschnitt: 3, name: "Rationale Exponenten", merke: `${P("a", "m/n")} = ${P(`(${W("n", "a")})`, "m")} für a > 0. Negativer Exponent: zusätzlich den Kehrwert bilden.`, tipps: ["Erst Wurzel, dann Potenz: kleinere Zahlen.", "Dezimalexponenten in Brüche umwandeln: 0,6 = 3/5."], buch: "S. 57 Definition und S. 59 Nr. 8, 11" },
    umform: { abschnitt: 3, name: "Wurzel- und Potenzschreibweise", merke: `${W("n", P("x", "m"))} = ${P("x", "m/n")}: Der Wurzelexponent wird zum Nenner.`, tipps: [`${B(1, W(2, "x"))} = ${P("x", "−1/2")}`], buch: "S. 58 Nr. 4–7; S. 59 Nr. 14, 15" },
    p1: { abschnitt: 4, name: "Potenzgesetz P1 (gleiche Basis)", merke: `${P("a", "m")} · ${P("a", "n")} = ${P("a", "m+n")}, ${P("a", "m")} : ${P("a", "n")} = ${P("a", "m−n")}`, tipps: [`Die Basis bleibt: ${P(4, 3)} · ${P(4, 2)} = ${P(4, 5)}, nicht ${P(16, 5)}.`], buch: "S. 64 und S. 67 Nr. 6, 7" },
    p2: { abschnitt: 4, name: "Potenzgesetz P2 (gleicher Exponent)", merke: `${P("a", "n")} · ${P("b", "n")} = ${P("(ab)", "n")}`, tipps: ["Passende Partner suchen, deren Produkt eine glatte Zahl ist (2 · 5, 4 · 25)."], buch: "S. 66 und S. 68 Nr. 13" },
    p3: { abschnitt: 4, name: "Potenzgesetz P3 (Potenz einer Potenz)", merke: `${P(`(${P("a", "m")})`, "n")} = ${P("a", "m · n")}`, tipps: [`${P(`(${P(2, 3)})`, 2)} = ${P(2, 6)}, nicht ${P(2, 5)}.`], buch: "S. 66 und S. 69 Nr. 19, 20; S. 70 Nr. 26" },
    summe: { abschnitt: 4, name: "Summen von Potenzen", merke: `Nur gleichartige Glieder zusammenfassen: ${P(2, 5)} + ${P(2, 5)} = 2 · ${P(2, 5)} = ${P(2, 6)}.`, tipps: [`${P(2, 3)} + ${P(4, 3)} ≠ ${P(6, 3)}: Für Summen gibt es kein Potenzgesetz.`], buch: "S. 67 (Addieren und Subtrahieren) und S. 68 Nr. 14" },
    terme: { abschnitt: 4, name: "Terme mit Variablen", merke: "Gesetze nacheinander anwenden: erst Klammern (P2, P3), dann gleiche Basen zusammenfassen (P1).", tipps: ["Bei Wurzeln und Brüchen im Exponenten gilt die Bedingung x > 0."], buch: "S. 68 Nr. 9, 10; S. 71 Nr. 39, 41" }
  };

  const NIVEAUS = { 1: "Basis", 2: "Standard", 3: "Expert" };

  // ───────────── Übungen ─────────────
  // Je Abschnitt fünf Übungen; id "Abschnitt-Nummer".
  const UEBUNGEN = [
    // ── Abschnitt 1 ──
    {
      id: "1-1", abschnitt: 1, niveau: 1, titel: "Potenzen mit natürlichen Exponenten",
      einleitung: `Eine Potenz ${P("a", "n")} ist ein Produkt aus n gleichen Faktoren a. Berechne ohne Taschenrechner. Brüche darfst du als Bruch (z. B. 3/4) oder als Dezimalzahl eingeben.`,
      teile: [
        { id: "a", thema: "nat", text: `${P(2, 6)}`, wert: 64, pruef: "I(2)**6",
          hilfen: [`${P(2, 6)} = 2 · 2 · 2 · 2 · 2 · 2`, "Verdopple sechsmal, beginnend bei 1: 2, 4, 8, …"],
          weg: `${P(2, 6)} = 2 · 2 · 2 · 2 · 2 · 2 = 64` },
        { id: "b", thema: "nat", text: `${P("(−3)", 4)}`, wert: 81, pruef: "I(-3)**4",
          hilfen: ["Die Klammer gehört zur Basis: Viermal wird −3 mit sich selbst multipliziert.", "Bei einer geraden Anzahl negativer Faktoren ist das Produkt positiv."],
          weg: `${P("(−3)", 4)} = (−3) · (−3) · (−3) · (−3) = 81` },
        { id: "c", thema: "nat", text: `−${P(3, 4)}`, wert: -81, pruef: "-I(3)**4",
          hilfen: ["Ohne Klammer gehört das Minus nicht zur Basis. Die Basis ist 3.", `−${P(3, 4)} = −(3 · 3 · 3 · 3)`],
          weg: `−${P(3, 4)} = −(3 · 3 · 3 · 3) = −81` },
        { id: "d", thema: "nat", text: `${P(`(${B(2, 3)})`, 3)}`, wert: 8 / 27, loesung: "8/27 ≈ 0,30", pruef: "R(2,3)**3",
          hilfen: ["Potenziere Zähler und Nenner einzeln.", `${P(`(${B(2, 3)})`, 3)} = ${B("2 · 2 · 2", "3 · 3 · 3")}`],
          weg: `${P(`(${B(2, 3)})`, 3)} = ${B(P(2, 3), P(3, 3))} = ${B(8, 27)} ≈ 0,30` },
        { id: "e", thema: "nat", typ: "auswahl", text: `Welches Vorzeichen hat ${P("(−5)", 7)}?`,
          optionen: ["negativ, weil der Exponent ungerade ist", "positiv, weil eine Potenz nie negativ ist", "positiv, weil 7 eine Primzahl ist"], richtig: 0,
          hilfen: ["Schreibe das Produkt aus: sieben Faktoren −5.", "Jeweils zwei negative Faktoren ergeben ein positives Produkt. Bleibt einer übrig?"],
          weg: `Sieben negative Faktoren: Sechs davon ergeben ein positives Produkt, der siebte macht es negativ. Also ist ${P("(−5)", 7)} negativ.` }
      ]
    },
    {
      id: "1-2", abschnitt: 1, niveau: 1, titel: "Negative Exponenten",
      einleitung: `Ein Algenteppich auf einem Teich verdoppelt seine Fläche jeden Tag. Heute (t = 0) ist er 1 m² groß. Nach t Tagen ist er A(t) = ${P(2, "t")} m² groß. Die Formel passt auch für vergangene Tage, also für t < 0.`,
      teile: [
        { id: "a", thema: "neg", text: "Wie groß war der Algenteppich gestern (t = −1)?", einheit: "m²", wert: 0.5, loesung: "1/2 = 0,5", pruef: "I(2)**-1",
          hilfen: ["Gestern war der Teppich halb so groß wie heute.", `A(−1) = ${P(2, -1)}`],
          weg: `A(−1) = ${P(2, -1)} = ${B(1, 2)} = 0,5 (m²)` },
        { id: "b", thema: "neg", text: "Wie groß war er vor drei Tagen (t = −3)?", einheit: "m²", wert: 0.125, loesung: "1/8 = 0,125", pruef: "I(2)**-3",
          hilfen: ["Mit jedem Tag zurück halbiert sich die Fläche.", `${P(2, -3)} = ${B(1, P(2, 3))}`],
          weg: `A(−3) = ${P(2, -3)} = ${B(1, P(2, 3))} = ${B(1, 8)} = 0,125 (m²)` },
        { id: "c", thema: "neg", text: `Schreibe ${B(1, 32)} als Potenz mit der Basis 2.`, vor: "2 hoch", wert: -5, pruef: "log(R(1,32),2)",
          hilfen: [`32 = ${P(2, 5)}`, `${B(1, P("a", "n"))} = ${P("a", "−n")}`],
          weg: `${B(1, 32)} = ${B(1, P(2, 5))} = ${P(2, -5)}` },
        { id: "d", thema: "neg", text: `${P(4, -2)}`, wert: 1 / 16, loesung: "1/16 = 0,0625", pruef: "I(4)**-2",
          hilfen: ["Ein negativer Exponent bedeutet: Kehrwert der Potenz mit positivem Exponenten.", `${P(4, -2)} = ${B(1, P(4, 2))}`],
          weg: `${P(4, -2)} = ${B(1, P(4, 2))} = ${B(1, 16)} = 0,0625` },
        { id: "e", thema: "zehn", text: `${P(10, -4)}`, wert: 0.0001, loesung: "0,0001", pruef: "I(10)**-4",
          hilfen: [`${P(10, -4)} = ${B(1, P(10, 4))}`, `${P(10, 4)} = 10 000`],
          weg: `${P(10, -4)} = ${B(1, "10 000")} = 0,0001 (die 1 steht an der 4. Nachkommastelle)` }
      ]
    },
    {
      id: "1-3", abschnitt: 1, niveau: 2, titel: "Brüche, negative Basen und die Null",
      einleitung: "Berechne ohne Taschenrechner. Brüche darfst du als Bruch (z. B. −1/8) oder als Dezimalzahl eingeben.",
      teile: [
        { id: "a", thema: "neg", text: `${P(`(${B(1, 3)})`, -2)}`, wert: 9, pruef: "R(1,3)**-2",
          hilfen: ["Ein negativer Exponent bedeutet: Kehrwert nehmen.", `${P(`(${B(1, 3)})`, -2)} = ${P(3, 2)}`],
          weg: `${P(`(${B(1, 3)})`, -2)} = ${P(`(${B(3, 1)})`, 2)} = ${P(3, 2)} = 9` },
        { id: "b", thema: "neg", text: `${P(`(${B(2, 5)})`, -3)}`, wert: 125 / 8, loesung: "125/8 = 15,625", pruef: "R(2,5)**-3",
          hilfen: [`Kehrwert: ${P(`(${B(2, 5)})`, -3)} = ${P(`(${B(5, 2)})`, 3)}`, "Zähler und Nenner einzeln potenzieren."],
          weg: `${P(`(${B(2, 5)})`, -3)} = ${P(`(${B(5, 2)})`, 3)} = ${B(125, 8)} = 15,625` },
        { id: "c", thema: "neg", text: `${P("(−2)", -3)}`, wert: -0.125, loesung: "−1/8 = −0,125", pruef: "I(-2)**-3",
          hilfen: [`Erst den Kehrwert: ${B(1, P("(−2)", 3))}`, `${P("(−2)", 3)} = −8`],
          weg: `${P("(−2)", -3)} = ${B(1, P("(−2)", 3))} = ${B(1, "−8")} = −0,125` },
        { id: "d", thema: "null", text: `${P(7, 0)} + ${P(7, -1)}`, wert: 8 / 7, loesung: "8/7 ≈ 1,14", pruef: "I(7)**0 + I(7)**-1",
          hilfen: [`Jede Zahl a ≠ 0 hoch 0 ergibt 1.`, `${P(7, -1)} = ${B(1, 7)}`],
          weg: `${P(7, 0)} + ${P(7, -1)} = 1 + ${B(1, 7)} = ${B(8, 7)} ≈ 1,14` },
        { id: "e", thema: "neg", typ: "auswahl", text: `Paula schreibt: ${P(3, -2)} = −9. Was stimmt?`,
          optionen: [`Falsch: ${P(3, -2)} = ${B(1, 9)}. Der negative Exponent macht die Potenz nicht negativ.`, "Richtig, denn der Exponent ist negativ.", `Falsch: ${P(3, -2)} = −6.`], richtig: 0,
          hilfen: ["Was bedeutet ein negativer Exponent nach der Definition?", `${P("a", "−n")} = ${B(1, P("a", "n"))}`],
          weg: `${P(3, -2)} = ${B(1, P(3, 2))} = ${B(1, 9)}. Das Ergebnis ist positiv.` }
      ]
    },
    {
      id: "1-4", abschnitt: 1, niveau: 2, titel: "Zehnerpotenzen und Vorsilben",
      einleitung: `Vorsilben vor Maßeinheiten stehen für Zehnerpotenzen, z. B. Kilo für ${P(10, 3)} und Milli für ${P(10, -3)}. Gib jeweils den Exponenten an.`,
      teile: [
        { id: "a", thema: "zehn", text: `1 Megawatt = 10<sup>?</sup> Watt`, vor: "10 hoch", wert: 6, pruef: "log(10**6,10)",
          hilfen: ["Mega steht für eine Million.", "1 000 000 hat sechs Nullen."],
          weg: `1 MW = 1 000 000 W = ${P(10, 6)} W` },
        { id: "b", thema: "zehn", text: `1 Mikrometer (1 µm) = 10<sup>?</sup> m`, vor: "10 hoch", wert: -6, pruef: "log(R(1,10**6),10)",
          hilfen: ["Mikro bedeutet ein Millionstel.", `${B(1, "1 000 000")} = ${B(1, P(10, 6))}`],
          weg: `1 µm = ${B(1, "1 000 000")} m = ${P(10, -6)} m` },
        { id: "c", thema: "zehn", text: `1 Nanosekunde = 10<sup>?</sup> s`, vor: "10 hoch", wert: -9, pruef: "log(R(1,10**9),10)",
          hilfen: ["Nano bedeutet ein Milliardstel.", "Eine Milliarde = 10⁹."],
          weg: `1 ns = ${B(1, "1 000 000 000")} s = ${P(10, -9)} s` },
        { id: "d", thema: "zehn", text: "Schreibe 0,000 01 als Zehnerpotenz.", vor: "10 hoch", wert: -5, pruef: "log(R(1,100000),10)",
          hilfen: ["An welcher Stelle nach dem Komma steht die 1?", `${P(10, "−n")} hat die 1 an der n-ten Nachkommastelle.`],
          weg: `0,000 01 = ${B(1, "100 000")} = ${P(10, -5)}` },
        { id: "e", thema: "zehn", text: `Bei Speichern bedeutet 1 Kibibyte (1 KiB) genau ${P(2, 10)} Byte. Wie viele Byte sind das?`, einheit: "Byte", wert: 1024, pruef: "I(2)**10",
          hilfen: [`${P(2, 5)} = 32`, `${P(2, 10)} = ${P(2, 5)} · ${P(2, 5)}`],
          weg: `${P(2, 10)} = 32 · 32 = 1024 (Byte), also etwas mehr als ${P(10, 3)}.` }
      ]
    },
    {
      id: "1-5", abschnitt: 1, niveau: 3, titel: "Zerfall und Vorzeichen",
      einleitung: `Ein radioaktiver Stoff zerfällt so, dass sich seine Masse jede Woche halbiert. Zu Beginn der Messung (t = 0) sind 640 mg vorhanden. Nach t Wochen sind es m(t) = 640 · ${P(2, "−t")} mg.`,
      teile: [
        { id: "a", thema: "neg", text: "Wie viel mg sind nach 5 Wochen noch vorhanden?", einheit: "mg", wert: 20, pruef: "640*I(2)**-5",
          hilfen: ["Setze t = 5 ein.", `${P(2, -5)} = ${B(1, 32)}`],
          weg: `m(5) = 640 · ${P(2, -5)} = ${B(640, 32)} = 20 (mg)` },
        { id: "b", thema: "neg", text: "Wie viel mg waren 2 Wochen vor Messbeginn (t = −2) vorhanden?", einheit: "mg", wert: 2560, pruef: "640*I(2)**2",
          hilfen: ["Vor Messbeginn war mehr vorhanden. Setze t = −2 ein.", "−(−2) = 2"],
          weg: `m(−2) = 640 · ${P(2, 2)} = 640 · 4 = 2560 (mg)` },
        { id: "c", thema: "neg", text: "Nach wie vielen Wochen sind nur noch 2,5 mg vorhanden?", einheit: "Wochen", wert: 8, pruef: "log(640/R(5,2),2)",
          hilfen: ["640 : 2,5 = 256. Um welchen Faktor ist die Masse kleiner geworden?", `256 = ${P(2, "?")}`],
          weg: `640 · ${P(2, "−t")} = 2,5 ⇔ ${P(2, "t")} = 640 : 2,5 = 256 = ${P(2, 8)}, also t = 8 (Wochen).` },
        { id: "d", thema: "neg", typ: "auswahl", text: `Für welche Zahlen a gilt ${P("a", -2)} > 1?`,
          optionen: ["für alle a mit 0 < |a| < 1, z. B. a = 0,5 oder a = −0,5", "für alle a > 1", "für keine Zahl, denn ein negativer Exponent macht die Potenz klein"], richtig: 0,
          hilfen: [`Probiere a = 0,5 und a = 2 aus: ${P("a", -2)} = ${B(1, P("a", 2))}.`, "Der Kehrwert einer Zahl zwischen 0 und 1 ist größer als 1."],
          weg: `${P("a", -2)} = ${B(1, P("a", 2))} > 1 genau dann, wenn 0 < ${P("a", 2)} < 1, also 0 < |a| < 1. Beispiel: ${P("0,5", -2)} = 4.` },
        { id: "e", thema: "nat", typ: "auswahl", text: "Welche Aussage über (−1)<sup>n</sup> mit einer natürlichen Zahl n ist richtig?",
          optionen: [`${P("(−1)", "n")} = 1 genau dann, wenn n gerade ist.`, `${P("(−1)", "n")} ist für alle n negativ.`, `${P("(−1)", "n")} = −1 genau dann, wenn n gerade ist.`], richtig: 0,
          hilfen: [`Berechne ${P("(−1)", 2)}, ${P("(−1)", 3)} und ${P("(−1)", 4)}.`, "Je zwei Faktoren −1 ergeben +1."],
          weg: `Bei gerader Anzahl von Faktoren −1 ist das Produkt 1, bei ungerader −1. Auch ${P("(−1)", 0)} = 1 passt dazu.` }
      ]
    },
    // ── Abschnitt 2 ──
    {
      id: "2-1", abschnitt: 2, niveau: 1, titel: "Große Zahlen kurz schreiben",
      einleitung: `Schreibe mit abgetrennter Zehnerpotenz: Vorfaktor zwischen 1 und 10, dann · ${P(10, "n")}. Beispiel: 52 000 = ${WS(5.2, 4)}.`,
      teile: [
        { id: "a", thema: "gross", typ: "wiss", text: "38 000", wert: 38000, pruef: "38000",
          hilfen: ["Setze das Komma hinter die erste Ziffer: 3,8.", "Um wie viele Stellen musst du das Komma von 3,8 nach rechts schieben, um 38 000 zu erhalten?"],
          weg: `38 000 = 3,8 · 10 000 = ${WS(3.8, 4)}` },
        { id: "b", thema: "gross", typ: "wiss", text: "6 050 000", wert: 6050000, pruef: "6050000",
          hilfen: ["Vorfaktor: 6,05.", "Das Komma wandert sechs Stellen."],
          weg: `6 050 000 = 6,05 · 1 000 000 = ${WS(6.05, 6)}` },
        { id: "c", thema: "gross", typ: "wiss", text: "Der Durchmesser der Sonne beträgt etwa 1 392 000 km.", einheit: "km", wert: 1392000, pruef: "1392000",
          hilfen: ["Vorfaktor: 1,392.", "Zähle die Stellen hinter der ersten Ziffer."],
          weg: `1 392 000 km = ${WS(1.392, 6)} km` },
        { id: "d", thema: "gross", text: `Schreibe ${WS(4.07, 5)} ohne Zehnerpotenz.`, wert: 407000, pruef: "R(407,100)*10**5",
          hilfen: [`${P(10, 5)} = 100 000`, "Das Komma von 4,07 wandert fünf Stellen nach rechts."],
          weg: `${WS(4.07, 5)} = 4,07 · 100 000 = 407 000` }
      ]
    },
    {
      id: "2-2", abschnitt: 2, niveau: 1, titel: "Kleine Zahlen kurz schreiben",
      einleitung: `Bei Zahlen zwischen 0 und 1 ist der Exponent negativ. Beispiel: 0,0034 = ${WS(3.4, -3)}.`,
      teile: [
        { id: "a", thema: "klein", typ: "wiss", text: "0,009", wert: 0.009, pruef: "R(9,1000)",
          hilfen: ["Vorfaktor: 9.", "Um wie viele Stellen wandert das Komma von 9 nach links bis 0,009?"],
          weg: `0,009 = ${B(9, 1000)} = ${WS(9, -3)}` },
        { id: "b", thema: "klein", typ: "wiss", text: "0,000 52", wert: 0.00052, pruef: "R(52,100000)",
          hilfen: ["Vorfaktor: 5,2.", "Die 5 steht an der 4. Nachkommastelle."],
          weg: `0,000 52 = ${WS(5.2, -4)}` },
        { id: "c", thema: "klein", typ: "wiss", text: "Ein rotes Blutkörperchen ist etwa 0,000 007 5 m breit.", einheit: "m", wert: 0.0000075, pruef: "R(75,10**7)",
          hilfen: ["Vorfaktor: 7,5.", "Die 7 steht an der 6. Nachkommastelle."],
          weg: `0,000 007 5 m = ${WS(7.5, -6)} m` },
        { id: "d", thema: "klein", text: `Schreibe ${WS(6.1, -4)} als Dezimalzahl.`, wert: 0.00061, pruef: "R(61,10)*I(10)**-4",
          hilfen: [`${P(10, -4)} = 0,0001`, "Das Komma von 6,1 wandert vier Stellen nach links."],
          weg: `${WS(6.1, -4)} = 6,1 · 0,0001 = 0,000 61` }
      ]
    },
    {
      id: "2-3", abschnitt: 2, niveau: 2, titel: "Maßeinheiten umrechnen",
      einleitung: `Nutze die Vorsilben: Milli = ${P(10, -3)}, Mikro (µ) = ${P(10, -6)}, Nano = ${P(10, -9)}, Kilo = ${P(10, 3)}, Mega = ${P(10, 6)}, Giga = ${P(10, 9)}, Tera = ${P(10, 12)}.`,
      teile: [
        { id: "a", thema: "einheit", typ: "wiss", text: "Ein feines Haar ist 40 µm dick. Gib die Dicke in Metern an.", einheit: "m", wert: 0.00004, pruef: "40*I(10)**-6",
          hilfen: [`40 µm = 40 · ${P(10, -6)} m`, `40 = 4 · ${P(10, 1)}`],
          weg: `40 µm = 40 · ${P(10, -6)} m = 4 · ${P(10, 1)} · ${P(10, -6)} m = ${WS(4, -5)} m` },
        { id: "b", thema: "einheit", typ: "wiss", text: "Rotes Licht hat eine Wellenlänge von etwa 650 nm. Gib sie in Metern an.", einheit: "m", wert: 6.5e-7, pruef: "650*I(10)**-9",
          hilfen: [`650 nm = 650 · ${P(10, -9)} m`, `650 = 6,5 · ${P(10, 2)}`],
          weg: `650 nm = 6,5 · ${P(10, 2)} · ${P(10, -9)} m = ${WS(6.5, -7)} m` },
        { id: "c", thema: "einheit", typ: "wiss", text: "Ein Kraftwerk leistet 2,3 Gigawatt. Gib die Leistung in Watt an.", einheit: "W", wert: 2.3e9, pruef: "R(23,10)*10**9",
          hilfen: [`Giga = ${P(10, 9)}`, "Der Vorfaktor 2,3 liegt schon zwischen 1 und 10."],
          weg: `2,3 GW = ${WS(2.3, 9)} W` },
        { id: "d", thema: "sach", text: `Auf eine Festplatte mit 1 TB (${P(10, 12)} Byte) sollen Fotos zu je 4 MB (4 · ${P(10, 6)} Byte) gespeichert werden. Wie viele Fotos passen darauf?`, einheit: "Fotos", wert: 250000, pruef: "10**12/(4*10**6)",
          hilfen: ["Teile die Speichergröße durch die Größe eines Fotos.", `${B(P(10, 12), `4 · ${P(10, 6)}`)} = ${B(1, 4)} · ${P(10, 6)}`],
          weg: `${B(P(10, 12), `4 · ${P(10, 6)}`)} = 0,25 · ${P(10, 6)} = 250 000 (Fotos)` }
      ]
    },
    {
      id: "2-4", abschnitt: 2, niveau: 2, titel: "Mit Licht rechnen",
      einleitung: `Licht legt in einer Sekunde etwa 3 · ${P(10, 5)} km zurück. Ein Jahr hat etwa 3,15 · ${P(10, 7)} Sekunden. Rechne Vorfaktoren und Zehnerpotenzen getrennt.`,
      teile: [
        { id: "a", thema: "sach", typ: "wiss", text: "Wie weit kommt Licht in einer Minute?", einheit: "km", wert: 1.8e7, pruef: "3*10**5*60",
          hilfen: ["Eine Minute hat 60 Sekunden.", `3 · ${P(10, 5)} · 60 = 180 · ${P(10, 5)}`],
          weg: `3 · ${P(10, 5)} km · 60 = 180 · ${P(10, 5)} km = ${WS(1.8, 7)} km` },
        { id: "b", thema: "sach", typ: "wiss", text: "Ein Lichtjahr ist die Strecke, die Licht in einem Jahr zurücklegt. Wie viele km sind das?", einheit: "km", wert: 9.45e12, toleranz: 0.01, pruef: "3*10**5*R(315,100)*10**7",
          hilfen: [`Multipliziere 3 · ${P(10, 5)} mit 3,15 · ${P(10, 7)}.`, `Vorfaktoren: 3 · 3,15; Zehnerpotenzen: ${P(10, 5)} · ${P(10, 7)}`],
          weg: `3 · 3,15 · ${P(10, 5)} · ${P(10, 7)} km = 9,45 · ${P(10, 12)} km` },
        { id: "c", thema: "sach", text: `Die Sonne ist etwa 1,5 · ${P(10, 8)} km von der Erde entfernt. Wie viele Sekunden braucht ihr Licht bis zur Erde?`, einheit: "s", wert: 500, pruef: "R(15,10)*10**8/(3*10**5)",
          hilfen: ["Zeit = Strecke : Geschwindigkeit", `${B("1,5", 3)} = 0,5 und ${B(P(10, 8), P(10, 5))} = ${P(10, 3)}`],
          weg: `${B(`1,5 · ${P(10, 8)}`, `3 · ${P(10, 5)}`)} s = 0,5 · ${P(10, 3)} s = 500 s (gut 8 Minuten)` },
        { id: "d", thema: "sach", typ: "wiss", text: `Der Stern Wega ist etwa 25 Lichtjahre entfernt. Wie viele km sind das? Rechne mit 1 Lichtjahr ≈ 9,45 · ${P(10, 12)} km.`, einheit: "km", wert: 2.3625e14, toleranz: 0.01, pruef: "25*R(945,100)*10**12",
          hilfen: ["25 · 9,45 = 236,25", `236,25 · ${P(10, 12)}: Bringe den Vorfaktor zwischen 1 und 10.`],
          weg: `25 · 9,45 · ${P(10, 12)} km = 236,25 · ${P(10, 12)} km ≈ ${WS(2.36, 14)} km` }
      ]
    },
    {
      id: "2-5", abschnitt: 2, niveau: 3, titel: "Kleine Anteile: ppm und ppb",
      einleitung: `Sehr kleine Anteile gibt man in ppm (parts per million, 1 ppm = ${P(10, -6)}) oder ppb (parts per billion; englisch billion = Milliarde) an.`,
      teile: [
        { id: "a", thema: "einheit", text: `1 ppb = 10<sup>?</sup>`, vor: "10 hoch", wert: -9, pruef: "log(R(1,10**9),10)",
          hilfen: ["ppb: ein Teil von einer Milliarde.", `Eine Milliarde = ${P(10, 9)}`],
          weg: `1 ppb = ${B(1, P(10, 9))} = ${P(10, -9)}` },
        { id: "b", thema: "einheit", typ: "wiss", text: "Die Luft enthält etwa 420 ppm Kohlenstoffdioxid. Schreibe diesen Anteil mit abgetrennter Zehnerpotenz.", wert: 0.00042, pruef: "420*I(10)**-6",
          hilfen: [`420 ppm = 420 · ${P(10, -6)}`, `420 = 4,2 · ${P(10, 2)}`],
          weg: `420 · ${P(10, -6)} = 4,2 · ${P(10, 2)} · ${P(10, -6)} = ${WS(4.2, -4)}` },
        { id: "c", thema: "sach", text: "Ein Stück Würfelzucker (3 g) wird so in Wasser gelöst, dass der Massenanteil des Zuckers 1 ppm beträgt. Wie viel Kilogramm Wasser braucht man ungefähr?", einheit: "kg", wert: 3000, toleranz: 0.01, pruef: "3/I(10)**-6/1000",
          hilfen: [`3 g sind ${P(10, -6)} der Gesamtmasse. Die Gesamtmasse ist also 3 g : ${P(10, -6)}.`, `3 g : ${P(10, -6)} = 3 · ${P(10, 6)} g; 1 kg = 1000 g`],
          weg: `3 g : ${P(10, -6)} = 3 · ${P(10, 6)} g = 3 · ${P(10, 3)} kg = 3000 kg, also etwa 3 Tonnen Wasser.` },
        { id: "d", thema: "sach", text: "In einer Luftprobe beträgt der Volumenanteil von Ozon 8 ppm. Wie viel Milliliter Ozon sind in 1 Liter dieser Luft?", einheit: "mL", wert: 0.008, pruef: "8*I(10)**-6*1000",
          hilfen: [`8 ppm von 1 L sind 8 · ${P(10, -6)} L.`, `1 L = ${P(10, 3)} mL`],
          weg: `8 · ${P(10, -6)} L = 8 · ${P(10, -6)} · ${P(10, 3)} mL = 8 · ${P(10, -3)} mL = 0,008 mL` }
      ]
    },
    // ── Abschnitt 3 ──
    {
      id: "3-1", abschnitt: 3, niveau: 1, titel: "n-te Wurzeln",
      einleitung: `Die n-te Wurzel ${W("n", "a")} (a ≥ 0) ist die nichtnegative Zahl, die hoch n genommen a ergibt. Beispiel: ${W(3, 64)} = 4, denn ${P(4, 3)} = 64.`,
      teile: [
        { id: "a", thema: "wurzel", text: W(3, 216), wert: 6, pruef: "root(216,3)",
          hilfen: ["Welche Zahl ergibt hoch 3 genommen 216?", `${P(5, 3)} = 125. Probiere die nächste Zahl.`],
          weg: `${W(3, 216)} = 6, denn ${P(6, 3)} = 216` },
        { id: "b", thema: "wurzel", text: W(4, 625), wert: 5, pruef: "root(625,4)",
          hilfen: ["Welche Zahl ergibt hoch 4 genommen 625?", `${P(5, 2)} = 25 und ${P(25, 2)} = 625`],
          weg: `${W(4, 625)} = 5, denn ${P(5, 4)} = 625` },
        { id: "c", thema: "wurzel", text: W(5, 32), wert: 2, pruef: "root(32,5)",
          hilfen: ["Fünfmal derselbe Faktor ergibt 32.", "32 = 2 · 2 · 2 · 2 · 2"],
          weg: `${W(5, 32)} = 2, denn ${P(2, 5)} = 32` },
        { id: "d", thema: "wurzel", text: W(3, "0,008"), wert: 0.2, pruef: "root(R(8,1000),3)",
          hilfen: [`0,008 = ${B(8, 1000)}`, `${W(3, 8)} = 2 und ${W(3, 1000)} = 10`],
          weg: `${W(3, "0,008")} = ${W(3, B(8, 1000))} = ${B(2, 10)} = 0,2, denn ${P("0,2", 3)} = 0,008` },
        { id: "e", thema: "wurzel", text: W(4, B(81, 16)), wert: 1.5, loesung: "3/2 = 1,5", pruef: "root(R(81,16),4)",
          hilfen: ["Ziehe die Wurzel aus Zähler und Nenner einzeln.", `${P(3, 4)} = 81 und ${P(2, 4)} = 16`],
          weg: `${W(4, B(81, 16))} = ${B(3, 2)} = 1,5, denn ${P(`(${B(3, 2)})`, 4)} = ${B(81, 16)}` }
      ]
    },
    {
      id: "3-2", abschnitt: 3, niveau: 1, titel: "Stammbrüche als Exponenten",
      einleitung: `Für a ≥ 0 gilt ${P("a", "1/n")} = ${W("n", "a")}. Beispiel: ${P(27, "1/3")} = ${W(3, 27)} = 3.`,
      teile: [
        { id: "a", thema: "stamm", text: P(36, "1/2"), wert: 6, pruef: "I(36)**R(1,2)",
          hilfen: [`${P(36, "1/2")} = ${W(2, 36)}`, "Welche positive Zahl ergibt quadriert 36?"],
          weg: `${P(36, "1/2")} = ${W(2, 36)} = 6` },
        { id: "b", thema: "stamm", text: P(125, "1/3"), wert: 5, pruef: "I(125)**R(1,3)",
          hilfen: [`${P(125, "1/3")} = ${W(3, 125)}`, `${P(5, 3)} = ?`],
          weg: `${P(125, "1/3")} = ${W(3, 125)} = 5` },
        { id: "c", thema: "stamm", text: P("10 000", "1/4"), wert: 10, pruef: "I(10000)**R(1,4)",
          hilfen: [`10 000 = ${P(10, 4)}`, `${W(4, P(10, 4))} = ?`],
          weg: `${P("10 000", "1/4")} = ${W(4, "10 000")} = 10` },
        { id: "d", thema: "stamm", text: P("0,01", "1/2"), wert: 0.1, pruef: "R(1,100)**R(1,2)",
          hilfen: [`0,01 = ${B(1, 100)}`, `${W(2, B(1, 100))} = ${B(1, 10)}`],
          weg: `${P("0,01", "1/2")} = ${W(2, "0,01")} = 0,1, denn ${P("0,1", 2)} = 0,01` },
        { id: "e", thema: "stamm", typ: "auswahl", text: `Welcher Term ist gleich ${P(6, "1/4")}?`,
          optionen: [W(4, 6), B(6, 4), P(6, -4), `${W(6, 4)}`], richtig: 0,
          hilfen: ["Der Nenner des Exponenten wird zum Wurzelexponenten.", `${P("a", "1/n")} = ${W("n", "a")}`],
          weg: `${P(6, "1/4")} = ${W(4, 6)}` }
      ]
    },
    {
      id: "3-3", abschnitt: 3, niveau: 2, titel: "Rationale Exponenten berechnen",
      einleitung: `Für a > 0 gilt ${P("a", "m/n")} = ${P(`(${W("n", "a")})`, "m")}. Meist ist es leichter, zuerst die Wurzel zu ziehen und dann zu potenzieren.`,
      teile: [
        { id: "a", thema: "rational", text: P(27, "2/3"), wert: 9, pruef: "I(27)**R(2,3)",
          hilfen: [`Zuerst ${W(3, 27)} = 3.`, `Dann ${P(3, 2)}.`],
          weg: `${P(27, "2/3")} = ${P(`(${W(3, 27)})`, 2)} = ${P(3, 2)} = 9` },
        { id: "b", thema: "rational", text: P(4, "3/2"), wert: 8, pruef: "I(4)**R(3,2)",
          hilfen: [`Zuerst ${W(2, 4)} = 2.`, `Dann ${P(2, 3)}.`],
          weg: `${P(4, "3/2")} = ${P(`(${W(2, 4)})`, 3)} = ${P(2, 3)} = 8` },
        { id: "c", thema: "rational", text: P(81, "3/4"), wert: 27, pruef: "I(81)**R(3,4)",
          hilfen: [`${W(4, 81)} = 3`, `${P(3, 3)} = ?`],
          weg: `${P(81, "3/4")} = ${P(`(${W(4, 81)})`, 3)} = ${P(3, 3)} = 27` },
        { id: "d", thema: "rational", text: P(16, "−1/2"), wert: 0.25, loesung: "1/4 = 0,25", pruef: "I(16)**R(-1,2)",
          hilfen: ["Negativer Exponent: Kehrwert bilden.", `${P(16, "1/2")} = 4`],
          weg: `${P(16, "−1/2")} = ${B(1, P(16, "1/2"))} = ${B(1, 4)} = 0,25` },
        { id: "e", thema: "rational", text: P(32, "0,6"), wert: 8, pruef: "I(32)**R(3,5)",
          hilfen: [`0,6 = ${B(3, 5)}`, `${W(5, 32)} = 2`],
          weg: `${P(32, "0,6")} = ${P(32, "3/5")} = ${P(`(${W(5, 32)})`, 3)} = ${P(2, 3)} = 8` }
      ]
    },
    {
      id: "3-4", abschnitt: 3, niveau: 2, titel: "Zwischen Wurzel und Potenz wechseln",
      einleitung: `Es gilt x > 0. Schreibe als Potenz von x. Gib den Exponenten als Bruch an, z. B. 2/3.`,
      teile: [
        { id: "a", thema: "umform", text: W(3, P("x", 2)), vor: "x hoch", wert: 2 / 3, loesung: "2/3", pruef: "ex(root(x**2,3))",
          hilfen: ["Der Wurzelexponent wird zum Nenner des Exponenten.", `${W("n", P("x", "m"))} = ${P("x", "m/n")}`],
          weg: `${W(3, P("x", 2))} = ${P("x", "2/3")}` },
        { id: "b", thema: "umform", text: B(1, W(2, "x")), vor: "x hoch", wert: -0.5, loesung: "−1/2", pruef: "ex(1/sqrt(x))",
          hilfen: [`${W(2, "x")} = ${P("x", "1/2")}`, `${B(1, P("a", "n"))} = ${P("a", "−n")}`],
          weg: `${B(1, W(2, "x"))} = ${B(1, P("x", "1/2"))} = ${P("x", "−1/2")}` },
        { id: "c", thema: "umform", text: W(4, P("x", 6)), vor: "x hoch", wert: 1.5, loesung: "6/4 = 3/2", pruef: "ex(root(x**6,4))",
          hilfen: [`${W(4, P("x", 6))} = ${P("x", "6/4")}`, "Kürze den Bruch."],
          weg: `${W(4, P("x", 6))} = ${P("x", "6/4")} = ${P("x", "3/2")}` },
        { id: "d", thema: "umform", text: `x · ${W(2, "x")}`, vor: "x hoch", wert: 1.5, loesung: "3/2", pruef: "ex(x*sqrt(x))",
          hilfen: [`x = ${P("x", 1)} und ${W(2, "x")} = ${P("x", "1/2")}`, "Gleiche Basis: Exponenten addieren."],
          weg: `x · ${W(2, "x")} = ${P("x", 1)} · ${P("x", "1/2")} = ${P("x", "3/2")}` },
        { id: "e", thema: "umform", typ: "auswahl", text: `Welche Wurzelschreibweise gehört zu ${P("x", "0,75")}?`,
          optionen: [W(4, P("x", 3)), W(3, P("x", 4)), W(75, "x"), `${B(P("x", 3), 4)}`], richtig: 0,
          hilfen: [`0,75 = ${B(3, 4)}`, "Nenner → Wurzelexponent, Zähler → Exponent unter der Wurzel."],
          weg: `${P("x", "0,75")} = ${P("x", "3/4")} = ${W(4, P("x", 3))}` }
      ]
    },
    {
      id: "3-5", abschnitt: 3, niveau: 3, titel: "Bakterien, Basen und Abschätzungen",
      einleitung: `Eine Bakterienkultur verdoppelt ihr Volumen jede Stunde. Zu Beginn ist sie 1 cm³ groß, nach t Stunden V(t) = ${P(2, "t")} cm³ – auch für Bruchteile von Stunden.`,
      teile: [
        { id: "a", thema: "stamm", text: "Wie groß ist die Kultur nach einer halben Stunde? Runde auf zwei Nachkommastellen.", einheit: "cm³", stellen: 2, wert: Math.SQRT2, loesung: "√2 ≈ 1,41", pruef: "sqrt(2)",
          hilfen: [`V(½) = ${P(2, "1/2")}`, `${P(2, "1/2")} = ${W(2, 2)}`],
          weg: `V(½) = ${P(2, "1/2")} = ${W(2, 2)} ≈ 1,41 (cm³). Zweimal eine halbe Stunde ergibt den Faktor ${W(2, 2)} · ${W(2, 2)} = 2.` },
        { id: "b", thema: "rational", text: "Wie groß ist sie nach 1 Stunde 30 Minuten? Runde auf zwei Nachkommastellen.", einheit: "cm³", stellen: 2, wert: 2 ** 1.5, loesung: "2^(3/2) ≈ 2,83", pruef: "I(2)**R(3,2)",
          hilfen: ["1 h 30 min = 3/2 h", `${P(2, "3/2")} = ${W(2, P(2, 3))} = ${W(2, 8)}`],
          weg: `V(3/2) = ${P(2, "3/2")} = ${W(2, 8)} ≈ 2,83 (cm³)` },
        { id: "c", thema: "rational", text: `Für welche Basis b gilt ${P("b", "2/3")} = 16?`, vor: "b =", wert: 64, pruef: "16**R(3,2)",
          hilfen: [`${P("b", "2/3")} = ${P(`(${W(3, "b")})`, 2)} = 16, also ${W(3, "b")} = 4.`, `b = ${P(4, 3)}`],
          weg: `${P(`(${W(3, "b")})`, 2)} = 16 ⇒ ${W(3, "b")} = 4 ⇒ b = ${P(4, 3)} = 64` },
        { id: "d", thema: "wurzel", text: `Zwischen welchen aufeinanderfolgenden natürlichen Zahlen liegt ${W(4, 200)}? Gib die kleinere an.`, wert: 3, pruef: "floor(root(200,4))",
          hilfen: [`Berechne ${P(3, 4)} und ${P(4, 4)}.`, "Zwischen welchen vierten Potenzen liegt 200?"],
          weg: `${P(3, 4)} = 81 < 200 < 256 = ${P(4, 4)}, also 3 < ${W(4, 200)} < 4.` },
        { id: "e", thema: "wurzel", typ: "auswahl", text: "Welche Aussage ist richtig?",
          optionen: [`${W(4, 16)} = 2, denn eine n-te Wurzel ist nie negativ.`, `${W(4, 16)} = ±2, denn auch ${P("(−2)", 4)} = 16.`, `${W(4, "−16")} = −2`], richtig: 0,
          hilfen: ["Lies die Definition der n-ten Wurzel noch einmal genau.", "Der Radikand muss ≥ 0 sein, und das Ergebnis ist ≥ 0."],
          weg: `Nach Definition ist ${W(4, 16)} die nichtnegative Zahl mit vierter Potenz 16, also 2. ${W(4, "−16")} ist nicht definiert.` }
      ]
    },
    // ── Abschnitt 4 ──
    {
      id: "4-1", abschnitt: 4, niveau: 1, titel: "Gleiche Basis: Exponenten addieren",
      einleitung: `Potenzgesetz P1: ${P("a", "m")} · ${P("a", "n")} = ${P("a", "m+n")} und ${P("a", "m")} : ${P("a", "n")} = ${P("a", "m−n")} (a ≠ 0). Berechne ohne Taschenrechner.`,
      teile: [
        { id: "a", thema: "p1", text: `${P(3, 4)} · ${P(3, 5)} als Potenz von 3`, vor: "3 hoch", wert: 9, pruef: "log(I(3)**4*I(3)**5,3)",
          hilfen: ["Die Basis bleibt gleich.", "Addiere die Exponenten."],
          weg: `${P(3, 4)} · ${P(3, 5)} = ${P(3, "4+5")} = ${P(3, 9)}` },
        { id: "b", thema: "p1", text: `${P(2, -3)} · ${P(2, 7)}`, wert: 16, pruef: "I(2)**-3*I(2)**7",
          hilfen: ["Exponenten addieren: −3 + 7.", `${P(2, 4)} = ?`],
          weg: `${P(2, -3)} · ${P(2, 7)} = ${P(2, 4)} = 16` },
        { id: "c", thema: "p1", text: `${P(5, 8)} : ${P(5, 6)}`, wert: 25, pruef: "I(5)**8/I(5)**6",
          hilfen: ["Beim Dividieren werden die Exponenten subtrahiert.", `${P(5, "8−6")}`],
          weg: `${P(5, 8)} : ${P(5, 6)} = ${P(5, 2)} = 25` },
        { id: "d", thema: "p1", text: `${P(10, -2)} · ${P(10, 5)}`, wert: 1000, pruef: "I(10)**-2*I(10)**5",
          hilfen: ["−2 + 5 = 3", `${P(10, 3)} = ?`],
          weg: `${P(10, -2)} · ${P(10, 5)} = ${P(10, 3)} = 1000` },
        { id: "e", thema: "p1", text: `${P("a", 4)} · ${P("a", -7)} als Potenz von a (a ≠ 0)`, vor: "a hoch", wert: -3, pruef: "ex(x**4*x**-7)",
          hilfen: ["Exponenten addieren: 4 + (−7).", "Das Ergebnis darf negativ sein."],
          weg: `${P("a", 4)} · ${P("a", -7)} = ${P("a", "4+(−7)")} = ${P("a", -3)}` }
      ]
    },
    {
      id: "4-2", abschnitt: 4, niveau: 1, titel: "Gleicher Exponent: Basen multiplizieren",
      einleitung: `Potenzgesetz P2: ${P("a", "n")} · ${P("b", "n")} = ${P("(a · b)", "n")} und ${P("a", "n")} : ${P("b", "n")} = ${P("(a : b)", "n")}. Suche Partner, deren Produkt eine glatte Zahl ist.`,
      teile: [
        { id: "a", thema: "p2", text: `${P(2, 4)} · ${P(5, 4)}`, wert: 10000, pruef: "I(2)**4*I(5)**4",
          hilfen: ["Gleicher Exponent: Basen multiplizieren.", `${P("(2 · 5)", 4)} = ${P(10, 4)}`],
          weg: `${P(2, 4)} · ${P(5, 4)} = ${P(10, 4)} = 10 000` },
        { id: "b", thema: "p2", text: `${P("0,5", 3)} · ${P(8, 3)}`, wert: 64, pruef: "R(1,2)**3*I(8)**3",
          hilfen: ["0,5 · 8 = 4", `${P(4, 3)} = ?`],
          weg: `${P("0,5", 3)} · ${P(8, 3)} = ${P("(0,5 · 8)", 3)} = ${P(4, 3)} = 64` },
        { id: "c", thema: "p2", text: `${P(15, 3)} : ${P(5, 3)}`, wert: 27, pruef: "I(15)**3/I(5)**3",
          hilfen: ["Gleicher Exponent: Basen dividieren.", "15 : 5 = 3"],
          weg: `${P(15, 3)} : ${P(5, 3)} = ${P("(15 : 5)", 3)} = ${P(3, 3)} = 27` },
        { id: "d", thema: "p2", text: `${W(2, 8)} · ${W(2, 2)}`, wert: 4, pruef: "sqrt(8)*sqrt(2)",
          hilfen: [`${W(2, 8)} = ${P(8, "1/2")}, ${W(2, 2)} = ${P(2, "1/2")}`, `${P(8, "1/2")} · ${P(2, "1/2")} = ${P(16, "1/2")}`],
          weg: `${W(2, 8)} · ${W(2, 2)} = ${W(2, "8 · 2")} = ${W(2, 16)} = 4` },
        { id: "e", thema: "p2", text: `${P("(3x)", 2)} = k · ${P("x", 2)}. Bestimme k.`, vor: "k =", wert: 9, pruef: "expand((3*x)**2)/x**2",
          hilfen: [`${P("(3x)", 2)} = ${P(3, 2)} · ${P("x", 2)}`, "Beide Faktoren werden quadriert."],
          weg: `${P("(3x)", 2)} = ${P(3, 2)} · ${P("x", 2)} = 9${P("x", 2)}, also k = 9` }
      ]
    },
    {
      id: "4-3", abschnitt: 4, niveau: 2, titel: "Potenz einer Potenz",
      einleitung: `Potenzgesetz P3: ${P(`(${P("a", "m")})`, "n")} = ${P("a", "m · n")}. Die Exponenten werden multipliziert.`,
      teile: [
        { id: "a", thema: "p3", text: `${P(`(${P(2, 3)})`, 4)} als Potenz von 2`, vor: "2 hoch", wert: 12, pruef: "log((I(2)**3)**4,2)",
          hilfen: ["Potenz einer Potenz: Exponenten multiplizieren.", "3 · 4 = ?"],
          weg: `${P(`(${P(2, 3)})`, 4)} = ${P(2, "3 · 4")} = ${P(2, 12)}` },
        { id: "b", thema: "p3", text: P(`(${P(3, -1)})`, -2), wert: 9, pruef: "(I(3)**-1)**-2",
          hilfen: ["(−1) · (−2) = 2", `${P(3, 2)} = ?`],
          weg: `${P(`(${P(3, -1)})`, -2)} = ${P(3, 2)} = 9` },
        { id: "c", thema: "p3", text: `${P(`(${P("x", 6)})`, "1/3")} als Potenz von x (x > 0)`, vor: "x hoch", wert: 2, pruef: "ex((x**6)**R(1,3))",
          hilfen: [`6 · ${B(1, 3)} = ?`, `Das ist ${W(3, P("x", 6))}.`],
          weg: `${P(`(${P("x", 6)})`, "1/3")} = ${P("x", `6 · ${B(1, 3)}`)} = ${P("x", 2)}` },
        { id: "d", thema: "p3", text: P(`(−${P(2, 2)})`, 3), wert: -64, pruef: "(-I(2)**2)**3",
          hilfen: [`Berechne zuerst −${P(2, 2)}. Die Basis von ${P(2, 2)} ist 2, das Minus steht davor.`, `−${P(2, 2)} = −4; ${P("(−4)", 3)} = ?`],
          weg: `−${P(2, 2)} = −4, also ${P(`(−${P(2, 2)})`, 3)} = ${P("(−4)", 3)} = −64` },
        { id: "e", thema: "p3", text: `${P(8, "4/3")} (Tipp: 8 = ${P(2, 3)})`, wert: 16, pruef: "I(8)**R(4,3)",
          hilfen: [`${P(8, "4/3")} = ${P(`(${P(2, 3)})`, "4/3")}`, `3 · ${B(4, 3)} = 4`],
          weg: `${P(8, "4/3")} = ${P(`(${P(2, 3)})`, "4/3")} = ${P(2, 4)} = 16` }
      ]
    },
    {
      id: "4-4", abschnitt: 4, niveau: 2, titel: "Summen und typische Fehler",
      einleitung: `Die Potenzgesetze gelten für Produkte und Quotienten. Summen von Potenzen kann man nur zusammenfassen, wenn die Glieder gleichartig sind: 3${P("a", "n")} + 5${P("a", "n")} = 8${P("a", "n")}.`,
      teile: [
        { id: "a", thema: "summe", typ: "auswahl", text: "Welche Umformung ist richtig?",
          optionen: [`${P(2, 5)} + ${P(2, 5)} = ${P(2, 6)}`, `${P(2, 5)} + ${P(2, 5)} = ${P(2, 10)}`, `${P(2, 5)} + ${P(2, 5)} = ${P(4, 5)}`], richtig: 0,
          hilfen: [`${P(2, 5)} + ${P(2, 5)} = 2 · ${P(2, 5)}`, `2 = ${P(2, 1)}`],
          weg: `${P(2, 5)} + ${P(2, 5)} = 2 · ${P(2, 5)} = ${P(2, 1)} · ${P(2, 5)} = ${P(2, 6)}` },
        { id: "b", thema: "summe", text: `${P(3, 4)} + ${P(3, 4)} + ${P(3, 4)} als Potenz von 3`, vor: "3 hoch", wert: 5, pruef: "log(3*I(3)**4,3)",
          hilfen: [`Drei gleiche Summanden: 3 · ${P(3, 4)}`, `3 = ${P(3, 1)}`],
          weg: `${P(3, 4)} + ${P(3, 4)} + ${P(3, 4)} = 3 · ${P(3, 4)} = ${P(3, 5)}` },
        { id: "c", thema: "summe", text: `Tim behauptet: ${P(2, 3)} + ${P(4, 3)} = ${P(6, 3)}. Berechne den Unterschied ${P(6, 3)} − (${P(2, 3)} + ${P(4, 3)}).`, wert: 144, pruef: "I(6)**3-(I(2)**3+I(4)**3)",
          hilfen: [`${P(2, 3)} = 8, ${P(4, 3)} = 64`, `${P(6, 3)} = 216`],
          weg: `${P(6, 3)} − (${P(2, 3)} + ${P(4, 3)}) = 216 − 72 = 144. Tims Behauptung ist falsch.` },
        { id: "d", thema: "p1", typ: "auswahl", text: `Tom rechnet: ${P(4, 3)} · ${P(4, 2)} = ${P(16, 5)}. Was stimmt?`,
          optionen: [`Er hat die Basen multipliziert; richtig ist ${P(4, 5)}.`, `Er hätte die Exponenten multiplizieren müssen: ${P(4, 6)}.`, "Das ist richtig."], richtig: 0,
          hilfen: ["Bei gleicher Basis: Was passiert mit der Basis, was mit den Exponenten?", "Die Basis bleibt, die Exponenten werden addiert."],
          weg: `${P(4, 3)} · ${P(4, 2)} = ${P(4, 5)} = 1024, aber ${P(16, 5)} = 1 048 576.` },
        { id: "e", thema: "summe", text: `Fasse zusammen: 5${P("x", 3)} + 2${P("x", 3)} − ${P("x", 3)} = k · ${P("x", 3)}. Bestimme k.`, vor: "k =", wert: 6, pruef: "simplify((5*x**3+2*x**3-x**3)/x**3)",
          hilfen: ["Gleichartige Glieder: Nur die Vorfaktoren werden addiert.", "5 + 2 − 1"],
          weg: `5${P("x", 3)} + 2${P("x", 3)} − 1${P("x", 3)} = (5 + 2 − 1)${P("x", 3)} = 6${P("x", 3)}` }
      ]
    },
    {
      id: "4-5", abschnitt: 4, niveau: 3, titel: "Terme und Überschläge",
      einleitung: "Hier brauchst du mehrere Potenzgesetze nacheinander. Es gilt a > 0, x > 0 und y > 0.",
      teile: [
        { id: "a", thema: "terme", text: `${P("a", 3)} · ${P("a", "−1/2")} als Potenz von a`, vor: "a hoch", wert: 2.5, loesung: "5/2", pruef: "ex(x**3*x**R(-1,2))",
          hilfen: ["Exponenten addieren: 3 + (−½).", `3 = ${B(6, 2)}`],
          weg: `${P("a", 3)} · ${P("a", "−1/2")} = ${P("a", "3 − 1/2")} = ${P("a", "5/2")}` },
        { id: "b", thema: "terme", text: `Vereinfache ${P(`(${P("x", 2)} · ${P("y", -1)})`, 3)} · ${P("y", 4)} = ${P("x", "?")} · ${P("y", "?")}. Exponent von x:`, vor: "x hoch", wert: 6, pruef: "exv((x**2*y**-1)**3*y**4, x)",
          hilfen: [`Zuerst die Klammer (P2 und P3): ${P(`(${P("x", 2)})`, 3)} · ${P(`(${P("y", -1)})`, 3)}`, "2 · 3 = ?"],
          weg: `${P(`(${P("x", 2)} · ${P("y", -1)})`, 3)} · ${P("y", 4)} = ${P("x", 6)} · ${P("y", -3)} · ${P("y", 4)} = ${P("x", 6)} · ${P("y", 1)}` },
        { id: "c", thema: "terme", text: `Derselbe Term ${P(`(${P("x", 2)} · ${P("y", -1)})`, 3)} · ${P("y", 4)}: Exponent von y:`, vor: "y hoch", wert: 1, pruef: "exv((x**2*y**-1)**3*y**4, y)",
          hilfen: [`${P(`(${P("y", -1)})`, 3)} = ${P("y", -3)}`, `${P("y", -3)} · ${P("y", 4)} = ?`],
          weg: `${P("y", -3)} · ${P("y", 4)} = ${P("y", 1)} = y` },
        { id: "d", thema: "p3", text: `Es gilt ${P(2, 10)} = 1024 ≈ ${P(10, 3)}. Schätze damit ${P(2, 40)} ≈ ${P(10, "?")}.`, vor: "10 hoch", wert: 12, pruef: "4*3",
          hilfen: [`${P(2, 40)} = ${P(`(${P(2, 10)})`, 4)}`, `${P(`(${P(10, 3)})`, 4)} = ?`],
          weg: `${P(2, 40)} = ${P(`(${P(2, 10)})`, 4)} ≈ ${P(`(${P(10, 3)})`, 4)} = ${P(10, 12)}` },
        { id: "e", thema: "p1", typ: "wiss", text: `Eine Galaxie hat etwa 2 · ${P(10, 11)} Sterne. Im Weltall gibt es geschätzt ${P(10, 11)} Galaxien. Wie viele Sterne gibt es dann ungefähr?`, einheit: "Sterne", wert: 2e22, pruef: "2*10**11*10**11",
          hilfen: [`Multipliziere 2 · ${P(10, 11)} mit ${P(10, 11)}.`, `${P(10, 11)} · ${P(10, 11)} = ${P(10, "11+11")}`],
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
    1: function (r) {
      const w = (l) => l[Math.floor(r() * l.length)];
      const f = [];
      { const b = w([2, 3]), n = w([3, 4, 5]); f.push({ thema: "nat", text: `${P(`(−${b})`, n)}`, wert: (-b) ** n, pruef: `I(-${b})**${n}` }); }
      { const b = w([2, 3, 4]), n = w([2, 4]); f.push({ thema: "nat", text: `−${P(b, n)}`, wert: -(b ** n), pruef: `-I(${b})**${n}` }); }
      { const b = w([2, 3, 5]), n = w([2, 3]); f.push({ thema: "neg", text: `${P(b, -n)} <span class="klein">Gib das Ergebnis als Bruch an.</span>`, exakt: true, wert: 1 / b ** n, loesung: `1/${b ** n}`, pruef: `I(${b})**-${n}` }); }
      { const [p, q] = w([[2, 3], [3, 4], [2, 5], [3, 5]]), n = w([2, 3]); const [z, m] = [q ** n, p ** n];
        f.push({ thema: "neg", text: `${P(`(${B(p, q)})`, -n)} <span class="klein">Gib das Ergebnis als Bruch an.</span>`, exakt: true, wert: z / m, loesung: `${bruchText(z, m)}`, pruef: `R(${p},${q})**-${n}` }); }
      { const b = w([3, 4, 5, 8]); const [z, n] = kuerze(b + 1, b);
        f.push({ thema: "null", text: `${P(b, 0)} + ${P(b, -1)} <span class="klein">Gib das Ergebnis als Bruch an.</span>`, exakt: true, wert: (b + 1) / b, loesung: bruchText(z, n), pruef: `I(${b})**0 + I(${b})**-1` }); }
      { const k = w([3, 4, 5, 6]); f.push({ thema: "neg", text: `Schreibe ${B(1, 2 ** k)} als Potenz mit der Basis 2.`, vor: "2 hoch", wert: -k, pruef: `log(R(1,${2 ** k}),2)` }); }
      { const [name, e] = w([["Mikrogramm (µg)", -6], ["Nanometer (nm)", -9], ["Milligramm (mg)", -3], ["Gigabyte (GB)", 9], ["Megahertz (MHz)", 6]]);
        const einheit = name.match(/\((.+)\)/)[1].replace(/^(µ|n|m|G|M)/, "");
        f.push({ thema: "zehn", text: `1 ${name} = 10<sup>?</sup> ${einheit}`, vor: "10 hoch", wert: e, pruef: `${e}` }); }
      { const b = w([2, 4, 5]), n = w([2, 3]);
        f.push(mische(r, { thema: "neg", typ: "auswahl", text: `Welche Aussage über ${P(b, -n)} ist richtig?`,
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
        f.push({ thema: "gross", text: `Schreibe ${WS(a, n)} ohne Zehnerpotenz.`, wert: x, loesung: zf(x), pruef: `R(${z},10)*10**${n}` }); }
      { const a = vorfaktor(), n = ganz(2, 4); const z = Math.round(a * 10); const x = z / 10 ** (n + 1);
        f.push({ thema: "klein", text: `Schreibe ${WS(a, -n)} als Dezimalzahl.`, wert: x, loesung: zf(x, 12), pruef: `R(${z},10)*I(10)**-${n}` }); }
      { const [vs, e] = w([["µm", -6], ["nm", -9], ["mm", -3]]); const z = ganz(2, 9) * 10 + ganz(1, 9); const x = z * 10 ** e;
        f.push({ thema: "einheit", typ: "wiss", text: `Gib ${z} ${vs} in Metern an.`, einheit: "m", wert: x, pruef: `${z}*I(10)**(${e})` }); }
      { const a = ganz(2, 4), b = ganz(2, 4), m = ganz(3, 8), n = ganz(2, 6);
        f.push({ thema: "sach", typ: "wiss", text: `(${a} · ${P(10, m)}) · (${b} · ${P(10, n)})`, wert: a * b * 10 ** (m + n), pruef: `${a}*10**${m}*${b}*10**${n}` }); }
      { const k = ganz(1, 3), m = ganz(7, 10); const s = 3 * k;
        f.push({ thema: "sach", typ: "wiss", text: `Eine Raumsonde ist ${s} · ${P(10, m)} km von der Erde entfernt. Wie viele Sekunden braucht ein Funksignal (Lichtgeschwindigkeit 3 · ${P(10, 5)} km/s) bis zur Erde?`, einheit: "s", wert: k * 10 ** (m - 5), pruef: `${s}*10**${m}/(3*10**5)` }); }
      { const [anteil, e] = w([["ppm", -6], ["ppb", -9]]); const z = ganz(2, 9);
        f.push({ thema: "einheit", text: `Ein Anteil von ${z} ${anteil} entspricht ${z} · ${P(10, "?")}.`, vor: "10 hoch", wert: e, pruef: `${e}` }); }
      return f;
    },
    3: function (r) {
      const w = (l) => l[Math.floor(r() * l.length)];
      const f = [];
      { const [n, b] = w([[3, 3], [3, 4], [3, 5], [4, 2], [4, 3], [5, 2]]); f.push({ thema: "wurzel", text: W(n, b ** n), wert: b, pruef: `root(${b ** n},${n})` }); }
      { const [a, n] = w([[49, 2], [64, 3], [81, 4], [32, 5], [1000, 3]]); f.push({ thema: "stamm", text: P(zf(a), `1/${n}`), wert: Math.round(a ** (1 / n)), pruef: `I(${a})**R(1,${n})` }); }
      { const [a, m, n] = w([[8, 2, 3], [16, 3, 4], [27, 2, 3], [4, 5, 2], [25, 3, 2], [32, 2, 5]]); const x = Math.round(a ** (m / n));
        f.push({ thema: "rational", text: P(a, `${m}/${n}`), wert: x, pruef: `I(${a})**R(${m},${n})` }); }
      { const [a, m, n] = w([[16, 1, 2], [8, 2, 3], [27, 1, 3], [9, 3, 2], [16, 3, 4]]); const x = Math.round(a ** (m / n));
        f.push({ thema: "rational", text: P(a, `−${m}/${n}`) + ` <span class="klein">Gib das Ergebnis als Bruch an.</span>`, exakt: true, wert: 1 / x, loesung: `1/${x}`, pruef: `I(${a})**R(-${m},${n})` }); }
      { const [m, n] = w([[2, 3], [3, 4], [2, 5], [3, 2], [5, 3]]); const [z, nn] = kuerze(m, n);
        f.push({ thema: "umform", text: `Schreibe ${W(n, P("x", m))} als Potenz von x (x > 0).`, vor: "x hoch", wert: m / n, loesung: bruchText(z, nn), pruef: `ex(root(x**${m},${n}))` }); }
      { const [m, n] = w([[3, 4], [2, 3], [3, 5], [4, 3]]);
        f.push(mische(r, { thema: "umform", typ: "auswahl", text: `Welche Wurzelschreibweise gehört zu ${P("x", `${m}/${n}`)} (x > 0)?`,
          optionen: [W(n, P("x", m)), W(m, P("x", n)), B(P("x", m), n), W(m * n, "x")] })); }
      { const [b, m, n] = w([[8, 2, 3], [27, 2, 3], [4, 3, 2], [9, 3, 2], [16, 3, 4]]); const y = Math.round(b ** (m / n));
        f.push({ thema: "rational", text: `Für welche Basis b gilt ${P("b", `${m}/${n}`)} = ${y}?`, vor: "b =", wert: b, pruef: `I(${y})**R(${n},${m})` }); }
      { const [n, a] = w([[3, 50], [3, 100], [4, 50], [4, 300], [5, 100], [3, 200]]);
        f.push({ thema: "wurzel", text: `Zwischen welchen aufeinanderfolgenden natürlichen Zahlen liegt ${W(n, a)}? Gib die kleinere an.`, wert: Math.floor(a ** (1 / n) + 1e-12), pruef: `floor(root(${a},${n}))` }); }
      return f;
    },
    4: function (r) {
      const w = (l) => l[Math.floor(r() * l.length)];
      const ganz = (a, b) => a + Math.floor(r() * (b - a + 1));
      const f = [];
      { const b = w([2, 3]), m = ganz(-4, -1), n = ganz(3, 6); f.push({ thema: "p1", text: `${P(b, m)} · ${P(b, n)}`, wert: b ** (m + n), pruef: `I(${b})**(${m})*I(${b})**${n}` }); }
      { const b = w([2, 5, 10]), n = ganz(3, 6), m = n + ganz(1, 3); f.push({ thema: "p1", text: `${P(b, m)} : ${P(b, n)}`, wert: b ** (m - n), pruef: `I(${b})**${m}/I(${b})**${n}` }); }
      { const [a, b] = w([[2, 5], [4, 25], [0.5, 4], [2.5, 4], [20, 5]]); const n = w([2, 3]);
        const at = zf(a), bt = zf(b);
        f.push({ thema: "p2", text: `${P(at, n)} · ${P(bt, n)}`, wert: Math.round((a * b) ** n * 1e9) / 1e9, pruef: `nsimplify(${a})**${n}*nsimplify(${b})**${n}` }); }
      { const b = w([2, 3, 5]), m = ganz(2, 5), n = w([-3, -2, 2, 3, 4]);
        f.push({ thema: "p3", text: `${P(`(${P(b, m)})`, n)} als Potenz von ${b}`, vor: `${b} hoch`, wert: m * n, pruef: `log((I(${b})**${m})**(${n}),${b})` }); }
      { const m = ganz(3, 8), n = ganz(2, 6), k = ganz(4, 12);
        f.push({ thema: "p1", text: `${B(`${P("x", m)} · ${P("x", n)}`, P("x", k))} als Potenz von x (x ≠ 0)`, vor: "x hoch", wert: m + n - k, pruef: `ex(x**${m}*x**${n}/x**${k})` }); }
      { const [p, q] = w([[1, 2], [1, 3], [2, 3], [1, 4]]), [s, t] = w([[1, 3], [1, 2], [1, 6], [3, 4]]);
        const [z, n] = kuerze(p * t + s * q, q * t);
        f.push({ thema: "terme", text: `${P("a", `${p}/${q}`)} · ${P("a", `${s}/${t}`)} als Potenz von a (a > 0)`, vor: "a hoch", wert: z / n, loesung: bruchText(z, n), pruef: `ex(x**R(${p},${q})*x**R(${s},${t}))` }); }
      { const b = w([2, 3, 5]), n = ganz(3, 6);
        f.push(mische(r, { thema: "summe", typ: "auswahl", text: "Welche Umformung ist richtig?",
          optionen: [`${b} · ${P(b, n)} = ${P(b, n + 1)}`, `${P(b, n)} + ${P(b, n)} = ${P(b, 2 * n)}`, `${P(b, n)} · ${P(b, 2)} = ${P(b, 2 * n)}`, `${P(b, n)} + ${P(b, 2)} = ${P(b, n + 2)}`] })); }
      { const k = ganz(2, 5); f.push({ thema: "p3", text: `Es gilt ${P(2, 10)} ≈ ${P(10, 3)}. Schätze ${P(2, 10 * k)} ≈ ${P(10, "?")}.`, vor: "10 hoch", wert: 3 * k, pruef: `3*${k}` }); }
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
  TESTS[5] = function (r) {
    const f = [];
    for (const ab of [1, 2, 3, 4]) {
      const pool = TESTS[ab](zufall(Math.floor(r() * 4294967296)));
      const nummern = pool.map((_, i) => [i, r()]).sort((x, y) => x[1] - y[1]).slice(0, ABSCHLUSS.jeAbschnitt).map(([i]) => i).sort((x, y) => x - y);
      for (const i of nummern) f.push({ ...pool[i], abschnitt: ab });
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

  const daten = { ABSCHNITTE, ABSCHLUSS, THEMEN, NIVEAUS, UEBUNGEN, erzeugeTest, erzeugeTraining, loesungText, hash, zf };
  const ziel = typeof window !== "undefined" ? window : globalThis;
  Object.assign(ziel, daten);
  if (typeof module !== "undefined") module.exports = daten;
})();
