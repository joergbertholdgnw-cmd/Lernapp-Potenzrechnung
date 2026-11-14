# Lernapp „Potenzen“ (Jahrgang 10)

Gymnasium Neu Wulmstorf, Fachgruppe Mathematik. Die App ist unter GitHub Pages veröffentlicht: Lernapp unter `index.html`, Lehrerbereich unter `admin.html`.

Lernapp zum Kapitel „Potenzen“ von Elemente der Mathematik 10 (Niedersachsen G9), S. 44–71. Sie hat vier Abschnitte:

| Abschnitt | Buch | Inhalt |
|---|---|---|
| 2.1 Potenzen mit ganzzahligen Exponenten | S. 43–48 | natürliche und negative Exponenten, Exponent null, Zehnerpotenzen und Vorsilben |
| 2.2 Zahlen mit abgetrennten Zehnerpotenzen | S. 49–51, 62–63 | große und kleine Zahlen, Einheiten, Licht und Weltall, ppm und ppb |
| 2.3 Potenzen mit rationalen Exponenten | S. 52–59 | n-te Wurzeln, a^(1/n), a^(m/n), Wurzel- und Potenzschreibweise |
| 2.5 Potenzgesetze und ihre Anwendung | S. 64–71 | P1–P3, Summen von Potenzen, Terme mit Variablen, Überschläge |

Abschnitt 2.4 (irrationale Exponenten) ist absichtlich nicht enthalten.

- Jeder Abschnitt enthält Merkwissen mit Verweisen auf Buchseiten und -aufgaben sowie fünf Übungen (★ bis ★★★). Jede Teilaufgabe hat zwei gestufte Hilfen und einen Lösungsweg auf Wunsch. Bei Rechenaufgaben gibt es zwei Versuche, bei Auswahlfragen einen.
- Am Ende jedes Abschnitts steht ein **Test zur Selbstkontrolle** mit acht Fragen ohne Hilfen. Jeder neue Durchgang erzeugt neue Zahlen. Nach der Abgabe zeigt die App die Lösungen und empfiehlt je verfehltem Thema Merkwissen und Buchaufgaben.
- Zum Schluss gibt es auf der Übersichtsseite einen **Abschlusstest über alle Abschnitte**: 12 Fragen, je 3 aus jedem Abschnittstest, bei jedem Durchgang neu ausgewählt und mit neuen Zahlen. Nach der Abgabe zeigt die App das Ergebnis je Abschnitt und führt direkt in den Abschnitt, in dem noch geübt werden sollte.
- Eingaben: Brüche (3/4), Dezimalzahlen mit Komma oder Punkt; Zehnerpotenzen mit getrenntem Vorfaktor und Exponenten (der Vorfaktor muss zwischen 1 und 10 liegen). Nicht abbrechende Werte gelten auf zwei Nachkommastellen gerundet als richtig.
- Anmeldung, Gerätebindung, Abmelden und Lehrerbereich funktionieren wie bei der App „Kosinussatz mit Sternen“.
- **Höchstens 35 Schülerinnen und Schüler je Tabelle:** Ab dem 36. neuen Namen lehnt das Google-Skript die Anmeldung mit einem Hinweis ab. Bereits eingetragene Namen können weiterarbeiten; das Lösen einer Gerätebindung gibt keinen Platz frei, erst „Alle Ergebnisse zurücksetzen“. Die Zahl steht oben in `apps-script/Code.gs` bei `MAX_SCHUELER`. Im Demo-Modus gilt die Grenze nicht.

## Einrichtung (einmalig, etwa 10 Minuten)

Die App ist eine statische Webseite. Die Ergebnisse speichert ein Google-Apps-Script in einer **eigenen** Google-Tabelle der Lehrkraft.

1. Neue Google-Tabelle anlegen, z. B. „Ergebnisse Potenzen“, dann **Erweiterungen → Apps Script**.
2. Den Inhalt von [`apps-script/Code.gs`](apps-script/Code.gs) in `Code.gs` kopieren und speichern.
3. **Projekteinstellungen → Skripteigenschaften**: Eigenschaft `ADMIN_PASSWORT` mit dem Passwort für den Lehrerbereich anlegen. Das Passwort steht bewusst nicht im Repository.
4. **Bereitstellen → Neue Bereitstellung → Web-App**, Ausführen als „Ich“, Zugriff „Jeder“. Die URL (endet auf `/exec`) kopieren.
5. In [`js/config.js`](js/config.js) die URL bei `SKRIPT_URL` eintragen.
6. Veröffentlichen, z. B. mit GitHub Pages wie bei den anderen Lernapps. Die Lernapp liegt dann unter `…/index.html`, der Lehrerbereich unter `…/admin.html`.

Ohne eingetragene URL läuft die App im **Demo-Modus**: Ergebnisse bleiben im Browser des Geräts, und der Lehrerbereich nimmt dort jedes Passwort an.

## Lehrerbereich (`admin.html`)

Nach der Passworteingabe zeigt der Lehrerbereich die belegten Plätze (z. B. 28 / 35) und eine Tabelle je Person und Abschnitt: gelöste Übungen (ohne Lösungsweg) und das beste Testergebnis mit Anzahl der Durchgänge, dazu eine Spalte für den Abschlusstest. Dazu kommen die Lösungsquote je Thema in Tests und Übungen und eine Detailansicht je Person mit allen Eingaben; bei Tests stehen dort Frage und Sollwert. Außerdem gibt es einen CSV-Export, das Lösen der Gerätebindung und einen Neustart für eine neue Lerngruppe mit Archivblatt.

## Prüfen nach Änderungen

```
node tools/pruefe-aufgaben.js   # Aufbau, Themen, Hilfen, Eingabe-Erkennung; Tests mit 400 Startwerten je Abschnitt
python tools/nachrechnen.py     # Zweitrechnung aller Sollwerte mit sympy (Übungen und 300 Testdurchgänge je Abschnitt)
node tools/pruefe-skript.js     # Google-Skript mit nachgebauter Tabelle: Grenze von 35 Namen, Gerätebindung, Neustart
```

Jede Teilaufgabe trägt in `js/aufgaben.js` einen sympy-Ausdruck (`pruef`), der die Aufgabe aus den Angaben beschreibt. Das Skript rechnet ihn exakt aus und vergleicht ihn mit dem Sollwert der App.

## Grenzen

- Sollwerte und Lösungen werden im Browser berechnet, damit die Rückmeldung sofort erscheint. Wer den Quelltext liest, findet sie.
- Ein Taschenrechner lässt sich nicht technisch sperren.
- Datenschutz: Gespeichert werden nur Vorname mit Anfangsbuchstabe, eine zufällige Gerätekennung und die Eingaben. Vor dem Einsatz klären, ob die Schule Google-Tabellen dafür erlaubt.
