// Lehrerbereich: Ergebnisse der Übungen und Tests ansehen, exportieren und für eine neue Lerngruppe zurücksetzen.
// Das Passwort wird nicht hier, sondern vom Google-Skript geprüft.
(function () {
  const wurzel = document.getElementById("admin");
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (z) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[z]));
  const klasse = (p) => (p >= 75 ? "gut" : p >= 50 ? "mittel" : "schlecht");
  const schluessel = (name) => String(name).trim().toLowerCase().replace(/\s+/g, " ");
  const prozentVon = (e) => Math.round((100 * e.punkte) / e.max);
  const lwVon = (e) => (e.teile || []).filter((t) => t.lw).length;
  const uebungenVon = (ab) => UEBUNGEN.filter((u) => u.abschnitt === ab);
  let passwort = "";
  let daten = [];
  let bindungen = {};
  let plaetze = null; // { belegt, max } vom Google-Skript
  let nachStatus = false; // Tabelle nach Status statt nach Namen sortieren
  const ZIEL = () => (window.KONFIG && KONFIG.BEHERRSCHT_AB) || 75;
  const STATUS = {
    gefaehrdet: { text: "gefährdet", klasse: "schlecht", rang: 0, info: "letzter Test unter 50 % oder zwei Tests in Folge unter dem Ziel" },
    unterwegs: { text: "auf dem Weg", klasse: "mittel", rang: 1, info: "noch nicht alle Abschnitte und der Abschlusstest beherrscht" },
    offen: { text: "nicht begonnen", klasse: "", rang: 2, info: "angemeldet, aber noch kein Ergebnis" },
    beherrscht: { text: "beherrscht", klasse: "gut", rang: 3, info: "alle Abschnitte und der Abschlusstest beherrscht" },
  };

  function zeigeAnmeldung(meldung) {
    wurzel.innerHTML = `
      <section class="karte">
        <h1>Lehrerbereich: Rechnen mit Potenzen</h1>
        ${Speicher.istDemo() ? '<p class="hinweis-demo">Demo-Modus: Es ist noch kein Google-Skript eingetragen. Angezeigt werden nur Ergebnisse, die auf diesem Gerät entstanden sind. Das Passwort wird erst mit dem Google-Skript geprüft.</p>' : ""}
        <form id="login" class="formular">
          <label>Passwort <input type="password" id="pw" required autocomplete="current-password"></label>
          <button class="knopf haupt">Anmelden</button>
          ${meldung ? `<p class="fehler">${esc(meldung)}</p>` : ""}
        </form>
      </section>`;
    document.getElementById("login").addEventListener("submit", async (e) => {
      e.preventDefault();
      passwort = document.getElementById("pw").value;
      await laden();
    });
    document.getElementById("pw").focus();
  }

  async function laden() {
    wurzel.innerHTML = "<p>Ergebnisse werden geladen …</p>";
    try {
      const a = await Speicher.holen(passwort);
      if (!a.ok) { passwort = ""; return zeigeAnmeldung(a.fehler || "Anmeldung fehlgeschlagen."); }
      daten = a.ergebnisse || [];
      bindungen = Object.fromEntries((a.bindungen || []).map((b) => [b.schluessel, b.seit]));
      plaetze = a.plaetze || null;
      zeigeUebersicht();
    } catch (e) {
      zeigeAnmeldung("Keine Verbindung zum Google-Skript (" + e.message + "). Häufigste Ursache: Bei der Bereitstellung ist nicht „Zugriff: Jeder“ eingestellt.");
    }
  }

  // Je Person: bestes Ergebnis je Übung (gelöst nur ohne Lösungsweg) und alle Testergebnisse je Abschnitt
  function auswerten() {
    const personen = new Map();
    for (const e of daten) {
      const k = schluessel(e.name);
      if (!personen.has(k)) personen.set(k, { name: e.name, geraete: new Set(), uebungen: {}, tests: { 1: [], 2: [], 3: [], 4: [], 5: [] }, wiederholen: new Set(), eintraege: [], proAbschnitt: {} });
      const p = personen.get(k);
      p.geraete.add(e.schuelerId);
      p.eintraege.push(e);
      // Die App schickt mit jedem Ergebnis die aktuelle Liste; die neueste gilt (Training setzt Themen zurück)
      p.wiederholen = new Set(e.wiederholen || []);
      if (e.art === "test") {
        (p.tests[e.abschnitt] ||= []).push(prozentVon(e));
        if (Number(e.abschnitt) === ABSCHLUSS.id) {
          p.proAbschnitt = {};
          for (const t of e.teile || []) { const x = THEMEN[t.thema]?.abschnitt; if (x) p.proAbschnitt[x] = (p.proAbschnitt[x] || 0) + (t.richtig ? 1 : 0); }
        }
        continue;
      }
      // Gelöst heißt: ohne Lösungsweg mit mindestens dem Ziel; nach einem angesehenen Lösungsweg nur mit Zusatz
      const alt = p.uebungen[e.aufgabe] || { prozent: -1, geloest: false, nachLw: false, lwGesehen: false, durchgaenge: 0 };
      const geschafft = !lwVon(e) && prozentVon(e) >= ZIEL();
      p.uebungen[e.aufgabe] = {
        prozent: Math.max(prozentVon(e), alt.prozent), durchgaenge: alt.durchgaenge + 1,
        geloest: alt.geloest || (geschafft && !alt.lwGesehen), nachLw: alt.nachLw || (geschafft && alt.lwGesehen),
        lwGesehen: alt.lwGesehen || lwVon(e) > 0,
      };
    }
    // Angemeldete Namen ohne Ergebnis ebenfalls zeigen
    for (const k of Object.keys(bindungen)) if (!personen.has(k))
      personen.set(k, { name: k.replace(/(^|\s)\S/g, (z) => z.toUpperCase()), geraete: new Set(), uebungen: {}, tests: { 1: [], 2: [], 3: [], 4: [], 5: [] }, wiederholen: new Set(), eintraege: [], proAbschnitt: {} });
    const liste = [...personen.values()];
    liste.forEach((p) => { p.status = statusVon(p); });
    return liste.sort((a, b) => (nachStatus ? STATUS[a.status].rang - STATUS[b.status].rang : 0) || a.name.localeCompare(b.name, "de"));
  }

  const letzter = (v) => (v.length ? v[v.length - 1] : null);
  const abschnittBeherrscht = (p, ab) => (letzter(p.tests[ab]) ?? -1) >= ZIEL();
  const abschlussBeherrscht = (p) => (letzter(p.tests[ABSCHLUSS.id]) ?? -1) >= ZIEL() && ABSCHNITTE.every((a) => (p.proAbschnitt[a.id] ?? 0) >= ABSCHLUSS.jeAbschnitt - 1);
  function statusVon(p) {
    if (!p.eintraege.length) return "offen";
    if (ABSCHNITTE.every((a) => abschnittBeherrscht(p, a.id)) && abschlussBeherrscht(p)) return "beherrscht";
    const gefaehrdet = [...ABSCHNITTE.map((a) => a.id), ABSCHLUSS.id].some((ab) => {
      const v = p.tests[ab];
      if (!v.length) return false;
      if (v[v.length - 1] < 50) return true;
      return v.length >= 2 && v[v.length - 1] < ZIEL() && v[v.length - 2] < ZIEL() && !(ab === ABSCHLUSS.id ? abschlussBeherrscht(p) : abschnittBeherrscht(p, ab));
    });
    return gefaehrdet ? "gefaehrdet" : "unterwegs";
  }
  // Testzelle: letztes Ergebnis groß, bestes klein dahinter, falls verschieden; Farbe nach dem letzten
  function testZelle(v, beherrscht) {
    if (!v.length) return '<td class="zelle"></td>';
    const l = v[v.length - 1], b = Math.max(...v);
    return `<td class="zelle ${beherrscht ? "gut" : klasse(l)}" title="Durchgänge: ${v.join(" %, ")} %">${l}${b !== l ? ` <small>/ ${b}</small>` : ""}${v.length > 1 ? ` <small>(${v.length})</small>` : ""}${beherrscht ? " ✓" : ""}</td>`;
  }

  function themenStatistik(art) {
    const s = {};
    for (const e of daten) {
      if ((e.art === "test") !== (art === "test")) continue;
      for (const t of e.teile || []) {
        if (!THEMEN[t.thema]) continue;
        s[t.thema] = s[t.thema] || { richtig: 0, gesamt: 0 };
        s[t.thema].gesamt++;
        if (t.richtig && !t.lw) s[t.thema].richtig++;
      }
    }
    return s;
  }

  function balken(stat) {
    const zeilen = Object.keys(THEMEN).filter((th) => stat[th]).map((th) => {
      const w = stat[th], p = Math.round((100 * w.richtig) / w.gesamt);
      return `<div class="balken-zeile"><span>${THEMEN[th].name}</span><span class="balken"><span style="width:${p}%" class="${klasse(p)}"></span></span><span class="klein">${p} % (${w.gesamt})</span></div>`;
    });
    return zeilen.length ? `<div class="balken-liste">${zeilen.join("")}</div>` : '<p class="klein">Noch keine Daten.</p>';
  }

  function zeigeUebersicht() {
    const personen = auswerten();
    const nTests = daten.filter((e) => e.art === "test").length;
    let html = `
      <header class="leiste"><h1>Lehrerbereich: Ergebnisse</h1>
        <div class="knopfreihe"><button class="knopf leise" id="neu">↻ Aktualisieren</button><button class="knopf leise" id="csv">⬇ CSV-Export</button><button class="knopf leise" id="abmelden">Abmelden</button></div>
      </header>
      ${Speicher.istDemo() ? '<p class="hinweis-demo">Demo-Modus: nur Ergebnisse dieses Geräts.</p>' : ""}
      ${plaetze && plaetze.belegt >= plaetze.max ? `<p class="hinweis-demo">Die Tabelle ist voll: ${plaetze.max} Namen sind angemeldet. Neue Namen werden abgelehnt, bis die Ergebnisse für eine neue Lerngruppe zurückgesetzt werden.</p>` : ""}
      <section class="karte kennzahlen">
        <div class="kennzahl"><b>${plaetze ? `${plaetze.belegt} / ${plaetze.max}` : personen.length}</b>${plaetze ? "Plätze belegt" : "Schülerinnen und Schüler"}</div>
        <div class="kennzahl"><b>${personen.filter((p) => p.status === "beherrscht").length} / ${personen.length}</b>beherrschen die Einheit</div>
        <div class="kennzahl"><b>${personen.filter((p) => p.status === "gefaehrdet").length}</b>gefährdet</div>
        <div class="kennzahl"><b>${daten.length - nTests}</b>bearbeitete Übungen</div>
        <div class="kennzahl"><b>${nTests}</b>Tests abgegeben</div>
        <div class="kennzahl"><b>${daten.reduce((n, e) => n + lwVon(e), 0)}</b>Lösungswege angesehen</div>
      </section>`;

    if (!personen.length) html += '<section class="karte"><p>Noch keine Ergebnisse eingegangen.</p></section>';
    else {
      html += `<section class="karte"><h2>Übersicht je Abschnitt</h2>
        <p class="klein"><b>Ziel:</b> Ein Abschnitt ist beherrscht, wenn der letzte Test mindestens ${ZIEL()} % hat (✓). Die Einheit ist beherrscht, wenn zusätzlich der letzte Abschlusstest mindestens ${ZIEL()} % hat, mit höchstens einem Fehler je Abschnitt.<br>
        <b>Ü</b> = Übungen mit mindestens ${ZIEL()} % ohne Lösungsweg (von 5; „+n LW“ = erst nach angesehenem Lösungsweg). <b>Test</b> = letztes Ergebnis in %, dahinter / bestes und (Anzahl der Durchgänge). <b>Status:</b> ${Object.values(STATUS).map((x) => `${x.text} = ${x.info}`).join("; ")}. Klick auf einen Namen zeigt alle Einzelheiten. 🔒 = an ein Gerät gebunden, ⚠ = mehrere Geräte.</p>
        <div class="knopfreihe"><button class="knopf leise" id="sortieren">${nachStatus ? "Nach Namen sortieren" : "Nach Status sortieren (gefährdet zuerst)"}</button></div>
        <div class="tabelle-huelle"><table><thead><tr><th rowspan="2">Name</th><th rowspan="2">Status</th>${ABSCHNITTE.map((a) => `<th colspan="2" title="${esc(a.titel)}">Abschnitt ${a.nr}</th>`).join("")}<th rowspan="2" title="Abschlusstest über alle Abschnitte">Abschluss-<br>test</th><th rowspan="2">Wiederholen</th></tr>
        <tr>${ABSCHNITTE.map(() => "<th>Ü</th><th>Test</th>").join("")}</tr></thead><tbody>`;
      personen.forEach((p, i) => {
        html += `<tr class="klickbar" data-person="${i}"><td>${esc(p.name)} ${bindungen[schluessel(p.name)] ? '<span title="an ein Gerät gebunden">🔒</span>' : ""} ${p.geraete.size > 1 ? `<span title="${p.geraete.size} Geräte">⚠</span>` : ""}</td>
          <td class="zelle ${STATUS[p.status].klasse}" title="${STATUS[p.status].info}">${STATUS[p.status].text}</td>`;
        for (const a of ABSCHNITTE) {
          const liste = uebungenVon(a.id);
          const bearbeitet = liste.filter((u) => p.uebungen[u.id]).length;
          const geloest = liste.filter((u) => p.uebungen[u.id]?.geloest).length;
          const nachLw = liste.filter((u) => !p.uebungen[u.id]?.geloest && p.uebungen[u.id]?.nachLw).length;
          html += bearbeitet ? `<td class="zelle ${klasse((100 * geloest) / liste.length)}" title="${bearbeitet} bearbeitet">${geloest}/${liste.length}${nachLw ? ` <small>+${nachLw} LW</small>` : ""}</td>` : '<td class="zelle"></td>';
          html += testZelle(p.tests[a.id], abschnittBeherrscht(p, a.id));
        }
        html += testZelle(p.tests[ABSCHLUSS.id], abschlussBeherrscht(p));
        html += `<td>${[...p.wiederholen].map((s) => esc(THEMEN[s]?.name || s)).join(", ")}</td></tr>`;
      });
      html += `</tbody></table></div></section>
        <section class="karte"><h2>Themen in den Tests</h2><p class="klein">Anteil richtiger Antworten in allen Testdurchgängen, Abschlusstest eingeschlossen.</p>${balken(themenStatistik("test"))}</section>
        <section class="karte"><h2>Themen in den Übungen</h2><p class="klein">Teilaufgaben mit angesehenem Lösungsweg zählen als nicht richtig.</p>${balken(themenStatistik("uebung"))}</section>`;
    }

    html += `
      <section class="karte">
        <h2>Neu starten für eine neue Lerngruppe</h2>
        <p>Löscht alle Ergebnisse und Gerätebindungen. Lade vorher am besten den CSV-Export herunter.</p>
        <label class="klein"><input type="checkbox" id="archiv" checked class="haken"> Alte Ergebnisse als Archivblatt in der Google-Tabelle behalten</label>
        <div class="knopfreihe"><button class="knopf gefahr" id="reset">Alle Ergebnisse zurücksetzen</button></div>
      </section>`;

    wurzel.innerHTML = html;
    wurzel.querySelectorAll("[data-person]").forEach((tr) => tr.addEventListener("click", () => zeigePerson(personen[+tr.dataset.person])));
    document.getElementById("sortieren")?.addEventListener("click", () => { nachStatus = !nachStatus; zeigeUebersicht(); });
    document.getElementById("neu").addEventListener("click", laden);
    document.getElementById("csv").addEventListener("click", csvExport);
    document.getElementById("abmelden").addEventListener("click", () => { passwort = ""; daten = []; zeigeAnmeldung(); });
    document.getElementById("reset").addEventListener("click", zuruecksetzen);
    window.scrollTo(0, 0);
  }

  // Auswahlantworten werden als Nummer gespeichert
  function eingabeText(e, t, x) {
    if (e.art === "test") return esc(x);
    const teil = UEBUNGEN.find((u) => u.id === String(e.aufgabe))?.teile.find((y) => y.id === t.id);
    if (teil?.typ !== "auswahl") return esc(x);
    return `${Number(x) === teil.richtig ? "richtige" : "falsche"} Antwort`;
  }

  function zeigePerson(p) {
    const eintraege = [...p.eintraege].sort((a, b) => String(b.zeit).localeCompare(String(a.zeit)));
    const k = schluessel(p.name);
    let html = `<header class="leiste"><button class="knopf leise" id="zurueck">← Übersicht</button></header>
      <section class="karte"><h2>${esc(p.name)}</h2>
      <p><b>Status: ${STATUS[p.status].text}</b> (${STATUS[p.status].info}). Beherrscht: ${ABSCHNITTE.filter((a) => abschnittBeherrscht(p, a.id)).map((a) => "Abschnitt " + a.nr).join(", ") || "noch kein Abschnitt"}${abschlussBeherrscht(p) ? ", Abschlusstest" : ""}.</p>
      <p>${Object.keys(p.uebungen).length} von ${UEBUNGEN.length} Übungen bearbeitet, ${Object.values(p.uebungen).filter((x) => x.geloest).length} mit mindestens ${ZIEL()} % ohne Lösungsweg gelöst · ${Object.values(p.tests).flat().length} Testdurchgänge · ${p.geraete.size} Gerät(e)</p>
      ${bindungen[k]
        ? `<p>🔒 An ein Gerät gebunden seit ${new Date(bindungen[k]).toLocaleString("de-DE")}.</p>
           <p class="klein">Muss die Person das Gerät wechseln (neues Gerät, gelöschte Browserdaten, privates Fenster), hier die Bindung lösen. Die nächste Anmeldung verbindet den Namen mit dem neuen Gerät; alle Ergebnisse bleiben erhalten.</p>
           <div class="knopfreihe"><button class="knopf leise" id="freigeben">Gerätebindung lösen</button></div>`
        : "<p>Nicht an ein Gerät gebunden.</p>"}
      ${p.wiederholen.size ? `<p><b>Empfohlene Wiederholung:</b> ${[...p.wiederholen].map((s) => esc(THEMEN[s]?.name || s)).join(", ")}</p>` : ""}</section>`;
    for (const e of eintraege) {
      const test = e.art === "test";
      const lw = lwVon(e);
      html += `<section class="karte"><h3>${test ? "🎯 " : ""}${esc(test ? e.titel : `Übung ${e.aufgabe}: ${e.titel}`)} ${test ? "" : `<span class="sterne">${"★".repeat(e.niveau)}</span>`} · ${e.punkte}/${e.max} Punkte (${prozentVon(e)} %)${e.durchgang > 1 ? ` · ${e.durchgang}. Durchgang` : ""}${lw ? ' · <span class="lw-marke">Lösungsweg angesehen</span>' : ""}</h3>
        <p class="klein">${new Date(e.zeit).toLocaleString("de-DE")}</p>
        <div class="tabelle-huelle"><table><thead><tr><th>Teil</th>${test ? "<th>Frage</th><th>Soll</th>" : "<th>Thema</th>"}<th>Ergebnis</th>${test ? "" : "<th>Versuche</th><th>Hilfen</th>"}<th>Eingaben</th></tr></thead><tbody>` +
        (e.teile || []).map((t) => {
          const erg = t.lw ? ["schlecht", "Lösungsweg"] : t.richtig ? ["gut", "richtig"] : ["schlecht", "falsch"];
          return `<tr><td>${esc(t.id)}</td>${test ? `<td>${esc(t.frage || THEMEN[t.thema]?.name || t.thema)}</td><td>${esc(t.soll || "")}</td>` : `<td>${esc(THEMEN[t.thema]?.name || t.thema)}</td>`}<td class="zelle ${erg[0]}">${erg[1]}</td>${test ? "" : `<td>${t.versuche}</td><td>${t.hilfen}</td>`}<td>${(t.eingaben || []).map((x) => eingabeText(e, t, x)).join(" → ") || "–"}</td></tr>`;
        }).join("") + `</tbody></table></div></section>`;
    }
    wurzel.innerHTML = html;
    document.getElementById("zurueck").addEventListener("click", zeigeUebersicht);
    document.getElementById("freigeben")?.addEventListener("click", async (ev) => {
      if (!confirm(`Gerätebindung für ${p.name} lösen?`)) return;
      ev.target.disabled = true;
      try {
        const a = await Speicher.freigeben(passwort, p.name);
        if (!a.ok) throw new Error(a.fehler || "unbekannt");
        delete bindungen[k];
        zeigePerson(p);
      } catch (err) {
        ev.target.disabled = false;
        alert("Lösen hat nicht geklappt: " + err.message);
      }
    });
    window.scrollTo(0, 0);
  }

  function csvExport() {
    const zeilen = [["Zeit", "Name", "Geraet", "Art", "Abschnitt", "Aufgabe", "Titel", "Niveau", "Durchgang", "Punkte", "Max", "Prozent", "Loesungswege", "Teilaufgaben (richtig/Versuche/Hilfen, LW = Loesungsweg)", "Wiederholen"]];
    for (const e of daten) zeilen.push([e.zeit, e.name, e.schuelerId, e.art === "test" ? "Test" : "Uebung", e.abschnitt, e.aufgabe, e.titel, e.niveau, e.durchgang, e.punkte, e.max, prozentVon(e), lwVon(e),
      (e.teile || []).map((t) => `${t.id}:${t.richtig ? "r" : "f"}/${t.versuche}/${t.hilfen}${t.lw ? "/LW" : ""}`).join(" "), (e.wiederholen || []).join(" ")]);
    const csv = "﻿" + zeilen.map((z) => z.map((f) => `"${String(f ?? "").replace(/"/g, '""')}"`).join(";")).join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    a.download = `ergebnisse-potenzen-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  async function zuruecksetzen() {
    const archivieren = document.getElementById("archiv").checked;
    const eingabe = prompt(`Wirklich alle ${daten.length} Einträge zurücksetzen?${archivieren ? "" : " Sie werden endgültig gelöscht!"}\nZur Bestätigung NEUSTART eintippen:`);
    if (eingabe !== "NEUSTART") return;
    try {
      const a = await Speicher.zuruecksetzen(passwort, archivieren);
      if (!a.ok) return alert(a.fehler || "Zurücksetzen fehlgeschlagen.");
      alert(a.archiv ? `Erledigt. Die alten Ergebnisse liegen im Blatt „${a.archiv}“.` : "Erledigt. Alle Ergebnisse wurden gelöscht.");
      await laden();
    } catch { alert("Keine Verbindung zum Google-Skript."); }
  }

  zeigeAnmeldung();
})();
