// Testet apps-script/Code.gs lokal mit einer nachgebauten Google-Tabelle:
// Grenze von MAX_SCHUELER Namen, Gerätebindung, Wiederanmeldung, Lösen der Bindung und Neustart.
// Aufruf: node tools/pruefe-skript.js
const fs = require("fs");
const path = require("path");

// ── Nachbau der benötigten Google-Dienste ──
function neuesBlatt(name) {
  const zeilen = [];
  return {
    name, zeilen,
    appendRow: (z) => zeilen.push(z.slice()),
    setFrozenRows: () => {},
    getDataRange: () => ({ getValues: () => zeilen.map((z) => z.slice()) }),
    getLastRow: () => zeilen.length,
    deleteRows: (ab, n) => zeilen.splice(ab - 1, n),
    deleteRow: (i) => zeilen.splice(i - 1, 1),
    copyTo: () => ({ setName: () => {} }),
  };
}
const blaetter = {};
const tabelle = {
  getSheetByName: (n) => blaetter[n] || null,
  insertSheet: (n) => (blaetter[n] = neuesBlatt(n)),
};
const umgebung = {
  SpreadsheetApp: { getActiveSpreadsheet: () => tabelle },
  LockService: { getScriptLock: () => ({ waitLock: () => {}, releaseLock: () => {} }) },
  ContentService: { createTextOutput: (t) => ({ text: t, setMimeType() { return this; } }), MimeType: { JSON: "json" } },
  PropertiesService: { getScriptProperties: () => ({ getProperty: () => "geheim" }) },
  CacheService: { getScriptCache: () => ({ get: () => null, put: () => {}, remove: () => {} }) },
  Utilities: { sleep: () => {}, formatDate: () => "jetzt" },
  Session: { getScriptTimeZone: () => "Europe/Berlin" },
};
const code = fs.readFileSync(path.join(__dirname, "..", "apps-script", "Code.gs"), "utf8");
const skript = new Function(...Object.keys(umgebung), code + "\nreturn { doPost, MAX_SCHUELER };")(...Object.values(umgebung));
const anfrage = (daten) => JSON.parse(skript.doPost({ postData: { contents: JSON.stringify(daten) } }).text);

let fehler = 0;
const erwarte = (bedingung, text) => { if (!bedingung) { fehler++; console.log("FEHLER: " + text); } };
const geraet = (i) => ("geraet" + i).padEnd(24, "x");
const ergebnis = (name) => ({ name, schuelerId: "abc", art: "uebung", aufgabe: "1-1", abschnitt: 1, titel: "T", niveau: 1, durchgang: 1, punkte: 2, max: 4, teile: [] });

const MAX = skript.MAX_SCHUELER;
erwarte(MAX === 35, `MAX_SCHUELER ist ${MAX}, erwartet 35`);
for (let i = 1; i <= MAX; i++) erwarte(anfrage({ aktion: "anmelden", name: `Kind${i} A.`, geraet: geraet(i) }).ok, `Anmeldung ${i} abgelehnt`);

const zuViel = anfrage({ aktion: "anmelden", name: "Neu Z.", geraet: geraet(99) });
erwarte(!zuViel.ok && zuViel.voll && zuViel.gebunden && /voll/.test(zuViel.fehler), "36. Anmeldung wurde nicht als „voll“ abgelehnt");
erwarte(!anfrage({ aktion: "speichern", ergebnis: ergebnis("Neu Z."), geraet: geraet(99) }).ok, "36. Person konnte über „speichern“ eintragen");
erwarte(anfrage({ aktion: "anmelden", name: "kind7  a.", geraet: geraet(7) }).ok, "Wiederanmeldung (andere Schreibweise) abgelehnt");
erwarte(anfrage({ aktion: "speichern", ergebnis: ergebnis("Kind7 A."), geraet: geraet(7) }).ok, "Eingetragene Person kann nicht speichern");
erwarte(!anfrage({ aktion: "anmelden", name: "Kind7 A.", geraet: geraet(8) }).ok, "Fremdes Gerät wurde akzeptiert");

const liste = anfrage({ aktion: "liste", passwort: "geheim" });
erwarte(liste.plaetze && liste.plaetze.belegt === MAX && liste.plaetze.max === MAX, `Plätze: ${JSON.stringify(liste.plaetze)}`);

// Gelöste Bindung macht keinen Platz frei, solange die Person Ergebnisse hat; sie selbst kommt wieder herein
erwarte(anfrage({ aktion: "freigeben", passwort: "geheim", name: "Kind7 A." }).ok, "Freigeben fehlgeschlagen");
erwarte(!anfrage({ aktion: "anmelden", name: "Neu Z.", geraet: geraet(99) }).ok, "Nach dem Lösen einer Bindung kam ein neuer Name herein");
erwarte(anfrage({ aktion: "anmelden", name: "Kind7 A.", geraet: geraet(77) }).ok, "Person mit gelöster Bindung kommt nicht wieder herein");

// Neustart für eine neue Lerngruppe gibt alle Plätze frei
erwarte(anfrage({ aktion: "zuruecksetzen", passwort: "geheim", archivieren: false }).ok, "Zurücksetzen fehlgeschlagen");
erwarte(anfrage({ aktion: "anmelden", name: "Neu Z.", geraet: geraet(99) }).ok, "Nach dem Neustart wird ein neuer Name abgelehnt");

console.log(fehler ? `\n${fehler} Fehler gefunden.` : `Alles in Ordnung: Grenze von ${MAX} Namen, Wiederanmeldung, Gerätebindung und Neustart funktionieren.`);
process.exit(fehler ? 1 : 0);
