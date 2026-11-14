// Prüft Aufbau der Übungen und Tests sowie die Eingabe-Erkennung.
// Die Sollwerte selbst rechnet tools/nachrechnen.py unabhängig mit sympy nach.
// Aufruf: node tools/pruefe-aufgaben.js
const A = require("../js/aufgaben.js");
const { zahlenAusEingabe, istRichtig, pruefeWiss } = require("../js/pruefen.js");

let fehler = 0;
const melde = (text) => { fehler++; console.log("FEHLER: " + text); };
const deutsch = (x) => String(x).replace(".", ",");

// Übungen
for (const ab of A.ABSCHNITTE) {
  const liste = A.UEBUNGEN.filter((u) => u.abschnitt === ab.id);
  if (liste.length !== 5) melde(`Abschnitt ${ab.nr}: ${liste.length} statt 5 Übungen`);
  liste.forEach((u, i) => { if (u.id !== `${ab.id}-${i + 1}`) melde(`Übung an Stelle ${i + 1} in ${ab.nr} heißt ${u.id}`); });
}
for (const u of A.UEBUNGEN) {
  const ids = u.teile.map((t) => t.id).join("");
  if (ids !== "abcdefgh".slice(0, u.teile.length)) melde(`Übung ${u.id}: Teilaufgaben heißen ${ids}`);
  if (u.teile.length < 4) melde(`Übung ${u.id}: weniger als 4 Teilaufgaben`);
  for (const t of u.teile) {
    const name = `Übung ${u.id}${t.id}`;
    if (!A.THEMEN[t.thema]) melde(`${name}: unbekanntes Thema „${t.thema}“`);
    if (A.THEMEN[t.thema] && A.THEMEN[t.thema].abschnitt !== u.abschnitt) melde(`${name}: Thema „${t.thema}“ gehört zu einem anderen Abschnitt`);
    if (!t.hilfen || t.hilfen.length !== 2) melde(`${name}: nicht genau zwei Hilfen`);
    if (!t.weg) melde(`${name}: Lösungsweg fehlt`);
    pruefeTeil(name, t);
  }
}

// Tests: viele Startwerte, damit alle Zweige der Generatoren vorkommen
for (const ab of A.ABSCHNITTE) {
  for (let s = 0; s < 400; s++) {
    const fragen = A.erzeugeTest(ab.id, "probe|" + s);
    if (fragen.length !== 8) melde(`Test ${ab.nr}: ${fragen.length} Fragen`);
    for (const f of fragen) {
      if (!A.THEMEN[f.thema]) melde(`Test ${ab.nr}/${f.id}: unbekanntes Thema ${f.thema}`);
      pruefeTeil(`Test ${ab.nr} (Start ${s}) Frage ${f.id}`, f, true);
    }
  }
  // Derselbe Startwert ergibt denselben Test
  if (JSON.stringify(A.erzeugeTest(ab.id, "x")) !== JSON.stringify(A.erzeugeTest(ab.id, "x"))) melde(`Test ${ab.nr}: nicht reproduzierbar`);
}

// Abschlusstest: 12 Fragen, je 3 aus jedem Abschnitt, Themen passend zum Abschnitt
const S = A.ABSCHLUSS;
for (let s = 0; s < 400; s++) {
  const fragen = A.erzeugeTest(S.id, "probe|" + s);
  if (fragen.length !== 4 * S.jeAbschnitt) melde(`Abschlusstest (Start ${s}): ${fragen.length} Fragen`);
  for (const ab of [1, 2, 3, 4]) {
    const teil = fragen.filter((f) => f.abschnitt === ab);
    if (teil.length !== S.jeAbschnitt) melde(`Abschlusstest (Start ${s}): ${teil.length} Fragen aus Abschnitt ${ab}`);
    if (new Set(teil.map((f) => f.text)).size !== teil.length) melde(`Abschlusstest (Start ${s}): doppelte Frage aus Abschnitt ${ab}`);
  }
  for (const f of fragen) {
    if (!A.THEMEN[f.thema] || A.THEMEN[f.thema].abschnitt !== f.abschnitt) melde(`Abschlusstest (Start ${s}) Frage ${f.id}: Thema passt nicht zum Abschnitt`);
    pruefeTeil(`Abschlusstest (Start ${s}) Frage ${f.id}`, f, true);
  }
}
if (JSON.stringify(A.erzeugeTest(S.id, "x")) !== JSON.stringify(A.erzeugeTest(S.id, "x"))) melde("Abschlusstest: nicht reproduzierbar");

function pruefeTeil(name, t, still) {
  if (t.typ === "auswahl") {
    if (!Array.isArray(t.optionen) || t.optionen.length < 3) melde(`${name}: weniger als drei Antwortmöglichkeiten`);
    if (!Number.isInteger(t.richtig) || !t.optionen[t.richtig]) melde(`${name}: richtige Antwort fehlt`);
    if (new Set(t.optionen).size !== t.optionen.length) melde(`${name}: doppelte Antwortmöglichkeiten`);
    return;
  }
  if (!Number.isFinite(t.wert)) { melde(`${name}: Wert ist keine Zahl`); return; }
  if (!t.pruef) melde(`${name}: kein sympy-Ausdruck zum Nachrechnen`);
  if (t.typ === "wiss") {
    const n = Math.floor(Math.log10(Math.abs(t.wert)) + 1e-12);
    const a = Math.round((t.wert / 10 ** n) * 1e6) / 1e6;
    if (!pruefeWiss(deutsch(a), String(n), t.wert, t.toleranz).ok) melde(`${name}: richtige Eingabe ${a} · 10^${n} wird abgelehnt`);
    if (pruefeWiss(deutsch(a * 10), String(n - 1), t.wert, t.toleranz).ok) melde(`${name}: Vorfaktor ≥ 10 wird angenommen`);
    return;
  }
  // Die angezeigte Lösung muss als Eingabe akzeptiert werden
  const anzeige = A.loesungText(t).replace(/<[^>]+>/g, "").replace(/[≈=].*$/, "").trim();
  const loes = (t.loesung || "").split(/[=≈]/).map((s) => s.trim()).filter((s) => /^[−\-\d]/.test(s) && !/[√^(]/.test(s));
  for (const x of [anzeige, ...loes]) if (x && !/[√^(]/.test(x) && !istRichtig(x, t.wert, t.toleranz)) melde(`${name}: angezeigte Lösung „${x}“ wird abgelehnt (Soll ${t.wert})`);
  if (!istRichtig(deutsch(t.wert), t.wert, t.toleranz) && !istRichtig(String(Math.round(t.wert * 100) / 100).replace(".", ","), t.wert, t.toleranz)) melde(`${name}: Sollwert als Eingabe wird abgelehnt`);
}

// Eingabe-Erkennung
const faelle = [["3/4", 0.75], ["−1/8", -0.125], ["0,0625", 0.0625], ["2,5·10^-3", 0.0025], ["2,5*10^(-3)", 0.0025], ["1 000", 1000], ["1.069,5", 1069.5], ["7.5e-1", 0.75], ["−3", -3]];
for (const [ein, soll] of faelle) if (!zahlenAusEingabe(ein).some((x) => Math.abs(x - soll) < 1e-12)) melde(`Eingabe „${ein}“ wird nicht als ${soll} erkannt`);
const sollFalsch = [["0,3", 1 / 3], ["0,06", 1 / 16], ["1,4", Math.SQRT2], ["−9", 1 / 9], ["6", 5]];
for (const [ein, soll] of sollFalsch) if (istRichtig(ein, soll)) melde(`Eingabe „${ein}“ gilt fälschlich als richtig für ${soll}`);
const sollRichtig = [["0,33", 1 / 3], ["1/3", 1 / 3], ["1,41", Math.SQRT2], ["8/7", 8 / 7], ["1,14", 8 / 7]];
for (const [ein, soll] of sollRichtig) if (!istRichtig(ein, soll)) melde(`Eingabe „${ein}“ wird für ${soll} abgelehnt`);

const n = A.UEBUNGEN.reduce((s, u) => s + u.teile.length, 0);
console.log(fehler ? `\n${fehler} Fehler gefunden.` : `Alles in Ordnung: ${A.UEBUNGEN.length} Übungen mit ${n} Teilaufgaben, 4 Abschnittstests und Abschlusstest × 400 Startwerte.`);
process.exit(fehler ? 1 : 0);
