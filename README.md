# Lernapp „Rechnen mit Potenzen“ (Jahrgang 10)

Gymnasium Neu Wulmstorf, Fachgruppe Mathematik. Die App ist unter GitHub Pages veröffentlicht: Lernapp unter `index.html`, Lehrerbereich unter `admin.html`.

Lernapp zum Kapitel „Potenzen“ von Elemente der Mathematik 10 (Niedersachsen G9), S. 44–71. Sie hat vier Abschnitte:

| Abschnitt | Buch | Inhalt |
|---|---|---|
| 1 Potenzen mit ganzzahligen Exponenten | S. 43–48 | natürliche und negative Exponenten, Exponent null, Zehnerpotenzen und Vorsilben |
| 2 Zahlen mit abgetrennten Zehnerpotenzen | S. 49–51, 62–63 | große und kleine Zahlen, Einheiten, Licht und Weltall, ppm und ppb |
| 3 Potenzen mit rationalen Exponenten | S. 52–59 | n-te Wurzeln, a^(1/n), a^(m/n), Wurzel- und Potenzschreibweise |
| 4 Potenzgesetze und ihre Anwendung | S. 64–71 | P1–P3, Summen von Potenzen, Terme mit Variablen, Überschläge |

Abschnitt 2.4 (irrationale Exponenten) ist absichtlich nicht enthalten.

- Die App nennt keine Buchseiten; die Spalte „Buch“ oben dient nur der Planung. Jeder Abschnitt enthält Merkwissen und fünf Übungen (★ bis ★★★). Jede Teilaufgabe hat zwei gestufte Hilfen und einen Lösungsweg auf Wunsch. Bei Rechenaufgaben gibt es zwei Versuche, bei Auswahlfragen einen.
- Am Ende jedes Abschnitts steht ein **Test zur Selbstkontrolle** mit acht Fragen ohne Hilfen. Jeder neue Durchgang erzeugt neue Zahlen. Nach der Abgabe zeigt die App die Lösungen und empfiehlt je verfehltem Thema das passende Merkwissen.
- **Ziel: Beherrschung für alle.** Ein Abschnitt gilt als beherrscht, wenn der letzte Abschnittstest mindestens 75 % hat (`BEHERRSCHT_AB` in `js/config.js`). Die Einheit gilt als beherrscht, wenn zusätzlich der letzte Abschlusstest mindestens 75 % hat, mit höchstens einem Fehler je Abschnitt. Kacheln, „Weiter mit …“ und die Fortschrittsanzeige richten sich danach.
- **Training je Thema:** Aufgaben mit immer neuen Zahlen aus den Testgeneratoren, Merkwissen als Hilfe, geschafft nach drei Aufgaben in Folge ohne Hilfe. Nach einem Test unter dem Ziel gibt die App den nächsten Test erst frei, wenn die verfehlten Themen trainiert sind. Der Trainingsstand bleibt auf dem Gerät und wird nicht an die Tabelle geschickt.
- **Freischaltung** (`FREISCHALTEN` in `js/config.js`, Standard: an): Ein Abschnittstest wird erst nach den ★- und ★★-Übungen des Abschnitts freigegeben, der Abschlusstest erst, wenn jeder Abschnittstest einmal mit mindestens 50 % abgegeben wurde.
- **Rückmeldungen:** Häufige Fehleingaben (z. B. 4⁻² = −16 oder −3⁴ = 81) erkennt die App und meldet gezielt zurück; die Hilfen sind gestuft (erst Frage oder Strategie, dann der entscheidende Schritt).
- **Comics zu den Regeln:** Zu jeder Potenzregel gibt es ein Comic (P1 Multiplizieren und Dividieren, P2, P3, Exponent null, negative Exponenten, Summen von Potenzen). Der Fehlerkobold Patzi macht den typischen Fehler, eine Zahlenfigur stellt ihn richtig. Die Comics stehen in Abschnitt 1 und 4 und in der Wiederholungskarte des passenden Themas. Die Bilder liegen als `comics/comic-1.png` bis `comic-7.png`; Titel und Bildbeschreibungen stehen in `COMICS` in `js/aufgaben.js`. Fehlt eine Bilddatei, blendet die App das Comic aus.
- **Eingangstest** (6 Fragen zu Potenzen, Quadratwurzeln und Bruchrechnung aus Klasse 9): Wer ihn nicht besteht, bekommt ein Auffrischungstraining zu den verfehlten Themen.
- **Kompetenzpass:** eine druckbare Übersicht, welche Abschnitte und Themen schon sicher sitzen, ohne Noten.
- Zum Schluss gibt es auf der Übersichtsseite einen **Abschlusstest über alle Abschnitte**: 12 Fragen, je 3 aus jedem Abschnittstest auf festen Plätzen (jeder Durchgang prüft dieselben Kernthemen, mit neuen Varianten und Zahlen). Nach der Abgabe zeigt die App das Ergebnis je Abschnitt und führt direkt in den Abschnitt, in dem noch geübt werden sollte.
- Eingaben: Brüche (3/4), Dezimalzahlen mit Komma oder Punkt; Zehnerpotenzen mit getrenntem Vorfaktor und Exponenten (Vorfaktor a mit 1 ≤ a < 10). Abbrechende Werte werden exakt verlangt, nicht abbrechende gelten als richtig, wenn sie mit mindestens zwei geltenden Ziffern richtig gerundet sind (1/27 ≈ 0,037, nicht 0,04). Verlangt eine Aufgabe „Runde auf zwei Nachkommastellen“, prüft die App genau das. Exponenten von Variablen und Aufgaben mit „Gib das Ergebnis als Bruch an“ werden nur exakt angenommen (x^(2/3), nicht x^0,67).
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

Nach der Passworteingabe zeigt der Lehrerbereich die belegten Plätze (z. B. 28 / 35), wie viele die Einheit beherrschen und wie viele gefährdet sind, und eine Tabelle mit **Status** je Person, Ergebnis des Eingangstests, **Lösungsweg-Quote** (Anteil der Übungs-Teilaufgaben mit angesehenem Lösungsweg) und letzter Aktivität (gefährdet, auf dem Weg, nicht begonnen, beherrscht; nach Status sortierbar) je Person und Abschnitt: gelöste Übungen (mindestens 75 % ohne Lösungsweg) und das letzte und beste Testergebnis mit Anzahl der Durchgänge; ✓ markiert beherrschte Abschnitte, dazu eine Spalte für den Abschlusstest. Dazu kommen die Lösungsquote je Thema in Tests und Übungen und eine Detailansicht je Person mit allen Eingaben; bei Tests stehen dort Frage und Sollwert. Außerdem gibt es einen CSV-Export, das Lösen der Gerätebindung und einen Neustart für eine neue Lerngruppe mit Archivblatt.

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
