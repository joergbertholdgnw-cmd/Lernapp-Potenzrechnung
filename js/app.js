// Lernapp für Schülerinnen und Schüler: Anmeldung, Abschnitte, Übungen, Tests zur Selbstkontrolle.
(function () {
  const STAND = "pr_stand";
  const K = window.KONFIG;
  const app = document.getElementById("app");

  const sterne = (n) => "★".repeat(n) + '<span class="stern-leer">' + "★".repeat(3 - n) + "</span>";
  const esc = (s) => String(s).replace(/[&<>"']/g, (z) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[z]));
  const zufallAus = (liste) => liste[Math.floor(Math.random() * liste.length)];
  const istAuswahl = (t) => t.typ === "auswahl";
  const ohneHtml = (s) => String(s).replace(/<sup[^>]*>/g, "^").replace(/<\/span><span>/g, "/").replace(/<\/?[a-z][^>]*>/gi, "").replace(/\s+/g, " ").trim();
  const uebungenVon = (ab) => UEBUNGEN.filter((u) => u.abschnitt === ab);
  // Abschnittstests 1–4 und Abschlusstest 5
  // Eingangstest 0, Abschnittstests 1–4, Abschlusstest 5
  const aufUebersicht = (ab) => ab === ABSCHLUSS.id || ab === EINGANG.id;
  const testInfo = (ab) => (ab === ABSCHLUSS.id ? ABSCHLUSS : ab === EINGANG.id ? EINGANG : ABSCHNITTE.find((x) => x.id === ab));
  const testZurueck = (ab) => (aufUebersicht(ab) ? zeigeUebersicht : () => zeigeAbschnitt(ab));
  const testOrt = (ab) => (ab === ABSCHLUSS.id ? "alle Abschnitte" : ab === EINGANG.id ? "Vorwissen" : `Abschnitt ${testInfo(ab).nr}`);
  const abschnittName = (a) => (a.id === EINGANG.id ? a.titel : `Abschnitt ${a.nr}: ${a.titel}`);
  const zurueckText = (ab) => (aufUebersicht(ab) ? "Übersicht" : abschnittName(testInfo(ab)));
  // Ältere Versionen des Google-Skripts speichern Abschnitt 0 als 1; der Eingangstest ist an „T0“ erkennbar.
  const abschnittVon = (e) => (String(e.aufgabe) === "T0" ? EINGANG.id : Number(e.abschnitt));

  const LOB = ["Richtig!", "Genau!", "Sauber gelöst!", "Das sitzt!", "Stark!", "Treffer!"];
  const NOCHMAL = ["Noch nicht richtig. Nutze die Hilfe oder lies das Merkwissen."];

  // ───────────── Zustand ─────────────
  let stand = Speicher.lies(STAND, null);
  const speichern = () => Speicher.schreib(STAND, stand);

  function neuerStand(name) {
    const id = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random()).replace(/-/g, "").slice(0, 8);
    return { name, id, uebungen: {}, tests: {}, themaFehler: {}, training: {} };
  }
  function uebungStand(uid) {
    if (!stand.uebungen[uid]) stand.uebungen[uid] = { teile: {}, abgeschlossen: false, durchgang: 1 };
    return stand.uebungen[uid];
  }
  function teilStand(uid, tid) {
    const u = uebungStand(uid);
    if (!u.teile[tid]) u.teile[tid] = { versuche: 0, richtig: false, fertig: false, hilfen: 0, eingaben: [], lw: false };
    return u.teile[tid];
  }
  function testStand(ab) {
    if (!stand.tests[ab]) stand.tests[ab] = { durchgang: 1, eingaben: {}, abgegeben: false, verlauf: [] };
    return stand.tests[ab];
  }

  const punkteVon = (t) => (t.richtig && !t.lw ? (t.versuche === 1 ? 2 : 1) : 0);
  function auswertung(u) {
    const s = stand.uebungen[u.id];
    let punkte = 0, lw = 0;
    for (const t of u.teile) if (s && s.teile[t.id]) { punkte += punkteVon(s.teile[t.id]); if (s.teile[t.id].lw) lw++; }
    const max = u.teile.length * 2;
    return { punkte, lw, max, prozent: Math.round((100 * punkte) / max) };
  }
  const fertigeUebungen = (ab) => uebungenVon(ab).filter((u) => stand.uebungen[u.id]?.abgeschlossen);
  const besterTest = (ab) => { const v = stand.tests[ab]?.verlauf || []; return v.length ? Math.max(...v) : null; };

  // Beherrschung: Ein Abschnitt gilt als beherrscht, wenn der LETZTE Abschnittstest mindestens das Ziel (75 %) erreicht.
  // Die Einheit gilt als beherrscht, wenn alle Abschnitte beherrscht sind und der letzte Abschlusstest das Ziel erreicht,
  // mit höchstens einem Fehler je Abschnitt.
  const ZIEL = () => K.BEHERRSCHT_AB || 75;
  const letzterTest = (ab) => { const v = stand.tests[ab]?.verlauf || []; return v.length ? v[v.length - 1] : null; };
  const abschnittBeherrscht = (ab) => (letzterTest(ab) ?? -1) >= ZIEL();
  const abschlussLuecken = () => { const pa = stand.tests[ABSCHLUSS.id]?.proAbschnitt || {}; return ABSCHNITTE.filter((a) => (pa[a.id] ?? 0) < ABSCHLUSS.jeAbschnitt - 1); };
  const abschlussBeherrscht = () => (letzterTest(ABSCHLUSS.id) ?? -1) >= ZIEL() && !abschlussLuecken().length;
  const einheitBeherrscht = () => ABSCHNITTE.every((a) => abschnittBeherrscht(a.id)) && abschlussBeherrscht();
  // Nach einem Test unter dem Ziel müssen die verfehlten Themen erst trainiert werden
  const offeneThemen = (ab) => (stand.tests[ab]?.abgegeben ? stand.tests[ab].offeneThemen || [] : []);
  // je Thema: true, wenn alle Fragen dazu im Test richtig waren
  function themenErgebnis(teile) {
    const t = {};
    for (const x of teile) if (THEMEN[x.thema]) t[x.thema] = (t[x.thema] ?? true) && !!x.richtig;
    return t;
  }
  const themenVon = (ab) => Object.keys(THEMEN).filter((th) => THEMEN[th].abschnitt === ab);
  const abschnittVonThema = (th) => (THEMEN[th].abschnitt === EINGANG.id ? EINGANG : ABSCHNITTE.find((x) => x.id === THEMEN[th].abschnitt));
  // Freischaltung (KONFIG.FREISCHALTEN): Abschnittstest erst nach den ★- und ★★-Übungen,
  // Abschlusstest erst, wenn jeder Abschnittstest einmal mit mindestens 50 % abgegeben wurde.
  function testGesperrt(ab) {
    if (!K.FREISCHALTEN) return "";
    if (ab === ABSCHLUSS.id) {
      const fehlt = ABSCHNITTE.filter((a) => !(stand.tests[a.id]?.verlauf || []).some((p) => p >= 50));
      return fehlt.length ? `Den Abschlusstest kannst du schreiben, sobald du in jedem Abschnittstest mindestens 50 % erreicht hast. Noch offen: ${fehlt.map((a) => "Abschnitt " + a.nr).join(", ")}.` : "";
    }
    const offen = uebungenVon(ab).filter((u) => u.niveau <= 2 && !stand.uebungen[u.id]?.abgeschlossen);
    return offen.length ? `Bearbeite zuerst die Übungen ${offen.map((u) => u.id.split("-")[1]).join(", ")} dieses Abschnitts (★ und ★★). Dann wird der Test freigeschaltet.` : "";
  }

  // Antwortmöglichkeiten fest, aber je Teilaufgabe verschieden gemischt
  function reihenfolge(schluessel, n) {
    let s = hash(schluessel) % 233280;
    const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    return Array.from({ length: n }, (_, i) => [i, r()]).sort((x, y) => x[1] - y[1]).map(([i]) => i);
  }

  // ───────────── Eingabefelder ─────────────
  function eingabeHtml(t, schluessel, vorbelegt, knoepfe = "") {
    if (istAuswahl(t)) {
      const ordnung = t.gemischt ? t.optionen.map((_, i) => i) : reihenfolge(schluessel, t.optionen.length);
      return `<fieldset class="auswahl"><legend class="klein">Wähle eine Antwort:</legend>
        ${ordnung.map((i) => `<label class="option"><input type="radio" name="w-${schluessel}" value="${i}" ${String(vorbelegt) === String(i) ? "checked" : ""}> <span>${t.optionen[i]}</span></label>`).join("")}
        </fieldset>${knoepfe ? `<div class="knopfreihe">${knoepfe}</div>` : ""}`;
    }
    if (t.typ === "wiss") {
      const [a, n] = Array.isArray(vorbelegt) ? vorbelegt : ["", ""];
      return `<div class="eingabe-zeile wiss">
        <input class="vorfaktor" inputmode="decimal" autocomplete="off" aria-label="Vorfaktor" placeholder="Vorfaktor" value="${esc(a)}">
        <span class="mal">· 10</span><input class="exponent" inputmode="numeric" autocomplete="off" aria-label="Exponent" placeholder="Exp." value="${esc(n)}">
        ${t.einheit ? `<span class="einheit">${t.einheit}</span>` : ""}${knoepfe}</div>`;
    }
    return `<div class="eingabe-zeile">${t.vor ? `<span class="vor">${t.vor}</span>` : ""}
      <input class="zahl" inputmode="text" autocomplete="off" aria-label="Ergebnis" placeholder="Ergebnis" value="${esc(vorbelegt ?? "")}">
      ${t.einheit ? `<span class="einheit">${t.einheit}</span>` : ""}${knoepfe}</div>`;
  }

  // Liest die Eingabe aus einem Bereich; null, wenn noch nichts eingegeben ist
  function eingabeLesen(t, bereich) {
    if (istAuswahl(t)) { const g = bereich.querySelector("input[type=radio]:checked"); return g ? g.value : null; }
    if (t.typ === "wiss") {
      const a = bereich.querySelector(".vorfaktor").value.trim(), n = bereich.querySelector(".exponent").value.trim();
      return a || n ? [a, n] : null;
    }
    const v = bereich.querySelector("input.zahl").value.trim();
    return v || null;
  }

  // Prüft eine Eingabe: { ok, lesbar, meldung }
  function bewerte(t, eingabe) {
    if (istAuswahl(t)) return { ok: Number(eingabe) === t.richtig, lesbar: true };
    if (t.typ === "wiss") {
      const r = pruefeWiss(eingabe[0], eingabe[1], t.wert, t.toleranz);
      if (!r.lesbar) return { ok: false, lesbar: false, meldung: "Bitte Vorfaktor und ganzzahligen Exponenten eingeben, z. B. 4,5 und 3." };
      return { ok: r.ok, lesbar: true, meldung: r.nurVorfaktor ? "Der Wert stimmt, aber der Vorfaktor muss mindestens 1 und kleiner als 10 sein." : "" };
    }
    if (!zahlenAusEingabe(eingabe).length) return { ok: false, lesbar: false, meldung: "Bitte eine Zahl eingeben, z. B. 0,25 oder 1/4." };
    const ok = istRichtig(eingabe, t.wert, { toleranz: t.toleranz, exakt: t.exakt, stellen: t.stellen });
    let meldung = "";
    if (!ok && (t.exakt || t.stellen) && istRichtig(eingabe, t.wert, { toleranz: t.toleranz }))
      meldung = t.exakt ? `${esc(eingabe)} ist nur ein Näherungswert. Gib den genauen Wert als Bruch an, z. B. 2/3.` : `Runde auf ${t.stellen} Nachkommastellen.`;
    if (!ok && !meldung) meldung = (t.fehler || []).find((f) => istRichtig(eingabe, f.wert))?.text || "";
    return { ok, lesbar: true, meldung };
  }
  const eingabeAlsText = (t, e) => (e == null ? "" : istAuswahl(t) ? String(e) : t.typ === "wiss" ? `${e[0]}·10^${e[1]}` : String(e));
  function antwortAnzeige(t, e) {
    if (istAuswahl(t)) return t.optionen[Number(e)] ?? "";
    if (t.typ === "wiss") return `${esc(e[0])} · 10<sup>${esc(e[1]).replace("-", "−")}</sup>${t.einheit ? " " + t.einheit : ""}`;
    return `${t.vor ? t.vor + " " : ""}${esc(e)}${t.einheit ? " " + t.einheit : ""}`;
  }

  // ───────────── Anmeldung ─────────────
  function zeigeStart() {
    app.innerHTML = `
      <section class="karte start">
        <h1>Rechnen mit Potenzen</h1>
        <p class="lead">Vier Abschnitte: negative Exponenten, Zehnerpotenzen, rationale Exponenten und Potenzgesetze. Du startest mit einem kurzen Eingangstest zum Vorwissen. In jedem Abschnitt findest du Merkwissen, Übungen mit Hilfen und am Ende einen Test zur Selbstkontrolle.</p>
        <ul class="legende">
          <li><b>★</b> Basis: Grundaufgaben</li>
          <li><b>★★</b> Standard: Aufgaben, die mehrere Schritte brauchen</li>
          <li><b>★★★</b> Vertiefung: Sachaufgaben, Fehlersuche und Begründungen</li>
        </ul>
        <form id="nameForm" class="formular" autocomplete="off">
          <label>Vorname <input id="vorname" required maxlength="30" placeholder="z. B. Lena"></label>
          <label>Erster Buchstabe deines Nachnamens <input id="kuerzel" required maxlength="2" placeholder="z. B. M" class="kurz"></label>
          <p class="klein">Deine Ergebnisse werden unter diesem Namen für deine Lehrkraft gespeichert. Trage dich jedes Mal genau gleich ein. Beim ersten Mal wird dein Name mit diesem Gerät verbunden; arbeite deshalb immer am selben Gerät und im selben Browser.</p>
          <p class="fehler" id="anmeldeFehler" role="alert"></p>
          <button class="knopf haupt" type="submit">Los geht’s</button>
        </form>
      </section>`;
    document.getElementById("nameForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const v = document.getElementById("vorname").value.trim().replace(/\s+/g, " ");
      const k = document.getElementById("kuerzel").value.trim().replace(/\.$/, "").toUpperCase();
      if (!v || !k) return;
      const name = `${v.charAt(0).toUpperCase() + v.slice(1)} ${k}.`;
      if (stand && stand.name === name) { zeigeUebersicht(); return; }
      const knopf = e.target.querySelector("button[type=submit]");
      knopf.disabled = true;
      knopf.textContent = "Anmelden …";
      anmelden(name).then((ok) => {
        if (ok) return zeigeUebersicht();
        knopf.disabled = false;
        knopf.textContent = "Los geht’s";
      });
    });
  }

  // Name prüfen bzw. an dieses Gerät binden und bisherige Ergebnisse übernehmen
  async function anmelden(name) {
    const fehlerFeld = document.getElementById("anmeldeFehler");
    let liste;
    try {
      const a = await Speicher.anmelden(name);
      if (a.gebunden) { fehlerFeld.textContent = a.fehler; return false; }
      liste = a.ergebnisse || [];
    } catch {
      stand = neuerStand(name);
      speichern();
      toast("Keine Verbindung: Dein bisheriger Stand konnte nicht geladen werden. Du kannst trotzdem üben.", 4000);
      return true;
    }
    stand = neuerStand(name);
    const neueste = {};
    for (const e of liste) {
      if (e.schuelerId) stand.id = String(e.schuelerId);
      if (e.art === "test") {
        const ab = abschnittVon(e);
        const ts = testStand(ab);
        ts.verlauf.push(Math.round((100 * e.punkte) / e.max));
        ts.durchgang = Math.max(ts.durchgang, (Number(e.durchgang) || 1) + 1);
        ts.themen = themenErgebnis(e.teile || []);
        if (ab === ABSCHLUSS.id) {
          ts.proAbschnitt = {};
          for (const t of e.teile || []) { const x = THEMEN[t.thema]?.abschnitt; if (x) ts.proAbschnitt[x] = (ts.proAbschnitt[x] || 0) + (t.richtig ? 1 : 0); }
        }
        for (const t of e.teile || []) if (!t.richtig && THEMEN[t.thema]) stand.themaFehler[t.thema] = (stand.themaFehler[t.thema] || 0) + 1;
        continue;
      }
      const u = UEBUNGEN.find((x) => x.id === String(e.aufgabe));
      if (!u) continue;
      for (const t of e.teile || []) if ((!t.richtig || t.lw) && THEMEN[t.thema]) stand.themaFehler[t.thema] = (stand.themaFehler[t.thema] || 0) + 1;
      if (!neueste[u.id] || (Number(e.durchgang) || 1) >= neueste[u.id].durchgang) neueste[u.id] = { durchgang: Number(e.durchgang) || 1, teile: e.teile || [] };
    }
    for (const [uid, n] of Object.entries(neueste)) {
      const teile = {};
      for (const t of n.teile) teile[t.id] = { versuche: t.versuche, richtig: !!t.richtig, fertig: true, hilfen: t.hilfen || 0, eingaben: t.eingaben || [], lw: !!t.lw };
      stand.uebungen[uid] = { teile, abgeschlossen: true, durchgang: n.durchgang, gesendet: true };
    }
    speichern();
    const nU = Object.keys(neueste).length, nT = Object.values(stand.tests).reduce((s, t) => s + t.verlauf.length, 0);
    if (nU || nT) toast(`Willkommen zurück! ${nU} Übung(en) und ${nT} Test(s) hast du schon bearbeitet.`, 3500);
    return true;
  }

  // ───────────── Übersicht ─────────────
  function kopf(zurueck) {
    return `<header class="leiste">
      ${zurueck ? `<button class="knopf leise" id="zurueck">← ${zurueck}</button>` : `<div><span class="klein">Angemeldet als</span> <b>${esc(stand.name)}</b> <button class="link" id="abmelden">Abmelden</button></div>`}
      <button class="knopf leise" id="merkwissen">📘 Merkwissen</button>
    </header>
    ${Speicher.istDemo() ? '<p class="hinweis-demo">Demo-Modus: Die Ergebnisse werden nur auf diesem Gerät gespeichert.</p>' : ""}
    ${Speicher.offen() ? `<p class="hinweis-demo">${Speicher.offen()} Ergebnis(se) warten noch auf Internet und werden automatisch nachgeschickt.</p>` : ""}`;
  }
  function kopfVerdrahten(zurueck) {
    document.getElementById("merkwissen").addEventListener("click", zeigeMerkwissen);
    if (zurueck) document.getElementById("zurueck").addEventListener("click", zurueck);
    else document.getElementById("abmelden").addEventListener("click", abmelden);
  }

  function zeigeUebersicht() {
    const gesamt = UEBUNGEN.length, fertig = UEBUNGEN.filter((u) => stand.uebungen[u.id]?.abgeschlossen).length;
    const tests = ABSCHNITTE.filter((a) => besterTest(a.id) !== null).length;
    const beherrscht = ABSCHNITTE.filter((a) => abschnittBeherrscht(a.id)).length;
    const naechster = ABSCHNITTE.find((a) => !abschnittBeherrscht(a.id));
    const eingang = stand.tests[EINGANG.id], eingangFertig = !!eingang?.verlauf?.length;
    const schwach = Object.entries(stand.themaFehler).filter(([, n]) => n >= K.WIEDERHOLUNG_AB).map(([s]) => s);

    let html = kopf() + `
      <section class="karte fortschritt">
        <div class="ring" style="--p:${(fertig / gesamt) * 100}"><span>${fertig}<small>/${gesamt}</small></span></div>
        <div>
          <h2>${einheitBeherrscht() ? "Ziel erreicht: Du beherrschst das Rechnen mit Potenzen!" : fertig === 0 && tests === 0 ? "Willkommen!" : "Dein Fortschritt"}</h2>
          <p><b>${beherrscht} von 4 Abschnitten beherrscht</b> (Ziel: mindestens ${ZIEL()} % im letzten Test des Abschnitts). ${fertig} von ${gesamt} Übungen erledigt.</p>
          <div class="knopfreihe">
          ${!eingangFertig ? '<button class="knopf haupt" id="eingangStarten">Starte mit dem Eingangstest</button>'
            : naechster ? `<button class="knopf haupt" data-abschnitt="${naechster.id}">Weiter mit ${esc(abschnittName(naechster))}</button>`
            : !abschlussBeherrscht() ? '<button class="knopf haupt" id="zumAbschluss">Weiter mit dem Abschlusstest</button>' : ""}
          <button class="knopf leise" id="kompetenzpass">📄 Mein Kompetenzpass</button></div>
        </div>
      </section>`;

    if (schwach.length) {
      html += `<section class="karte wiederholen"><h3>🔁 Wiederholen lohnt sich</h3><p>Bei diesen Themen hat es mehrmals gehakt. Trainiere sie mit neuen Zahlen, bis drei Aufgaben in Folge ohne Hilfe sitzen:</p>
        <div class="chips">${schwach.map((s) => `<button class="chip" data-training="${s}">🔁 ${THEMEN[s].name}</button>`).join("")}</div></section>`;
    }

    const lE = letzterTest(EINGANG.id), sperreE = offeneThemen(EINGANG.id);
    html += `<section class="karte eingang">
        <h2>🧭 ${EINGANG.titel}</h2>
        ${!eingangFertig ? `<p>Sechs kurze Fragen zu Potenzen, Quadratwurzeln und Brüchen aus Klasse 9. So siehst du, ob du gut vorbereitet bist. Dauer: etwa 5 Minuten.</p>
          <div class="knopfreihe"><button class="knopf haupt" id="eingangStarten2">${eingang && !eingang.abgegeben && Object.keys(eingang.eingaben).length ? "Eingangstest fortsetzen" : "Eingangstest starten"}</button></div>`
        : abschnittBeherrscht(EINGANG.id) ? `<p>✓ Bestanden (${lE} %). Dein Vorwissen sitzt.</p>`
        : `<p>Letztes Ergebnis: ${lE} %. Frische diese Themen auf:</p>
          <div class="chips">${themenVon(EINGANG.id).filter((th) => stand.tests[EINGANG.id].themen?.[th] === false).map((th) => `<button class="chip" data-training="${th}">🔁 ${THEMEN[th].name}</button>`).join("")}</div>
          ${sperreE.length ? "" : '<div class="knopfreihe"><button class="knopf leise" id="eingangStarten2">Eingangstest wiederholen</button></div>'}`}
      </section>`;
    html += `<h2 class="abschnitte-titel">Abschnitte</h2><div class="raster abschnitte">`;
    for (const a of ABSCHNITTE) {
      const f = fertigeUebungen(a.id).length, n = uebungenVon(a.id).length, l = letzterTest(a.id);
      const ganz = abschnittBeherrscht(a.id);
      const testText = l === null ? "Test: noch offen" : ganz ? `✓ beherrscht (letzter Test ${l} %)` : `Test: ${l} %, Ziel ${ZIEL()} % noch nicht erreicht`;
      html += `<button class="abschnitt-kachel ${ganz ? "ist-fertig" : ""}" data-abschnitt="${a.id}">
        <span class="nr">Abschnitt ${a.nr}</span>
        <span class="titel">${esc(a.titel)}</span>
        <span class="mini-balken"><span style="width:${(100 * f) / n}%"></span></span>
        <span class="klein">Übungen ${f}/${n}</span>
        <span class="status ${ganz ? "fertig" : l === null ? "" : "begonnen"}">${testText}</span>
      </button>`;
    }
    html += `</div>`;
    const bA = besterTest(ABSCHLUSS.id), tA = stand.tests[ABSCHLUSS.id], lA = letzterTest(ABSCHLUSS.id), sperreA = offeneThemen(ABSCHLUSS.id);
    html += `<section class="karte test-karte abschluss">
        <h2>🏁 ${ABSCHLUSS.titel}</h2>
        <p>${4 * ABSCHLUSS.jeAbschnitt} Fragen aus allen vier Abschnitten, je ${ABSCHLUSS.jeAbschnitt} pro Abschnitt, ohne Hilfen und ohne Taschenrechner. Jeder Durchgang stellt neue Fragen mit neuen Zahlen. Nach der Abgabe siehst du, in welchem Abschnitt du noch üben solltest.</p>
        <p><b>Ziel:</b> mindestens ${ZIEL()} % und in jedem Abschnitt höchstens ein Fehler.</p>
        ${bA !== null ? `<p><b>Bisher:</b> ${tA.verlauf.map((p) => p + " %").join(" · ")}. ${abschlussBeherrscht() ? "✓ Ziel erreicht." : `Ziel noch nicht erreicht${abschlussLuecken().length && lA >= ZIEL() ? ` (zu viele Fehler in ${abschlussLuecken().map((x) => "Abschnitt " + x.nr).join(", ")})` : ""}.`}</p>` : ""}
        ${testGesperrt(ABSCHLUSS.id) ? `<p class="sperre">🔒 ${testGesperrt(ABSCHLUSS.id)}</p>` : sperreA.length ? sperreHtml(sperreA) : `<div class="knopfreihe"><button class="knopf haupt" id="abschlusstest">${tA && !tA.abgegeben && Object.keys(tA.eingaben).length ? "Abschlusstest fortsetzen" : bA !== null ? "Neuen Abschlusstest starten" : "Abschlusstest starten"}</button></div>`}
        ${beherrscht < 4 && !testGesperrt(ABSCHLUSS.id) ? '<p class="klein">Tipp: Beherrsche zuerst die vier Abschnitte, bevor du den Abschlusstest schreibst.</p>' : ""}
      </section>`;
    app.innerHTML = html;
    kopfVerdrahten();
    document.getElementById("abschlusstest")?.addEventListener("click", () => zeigeTest(ABSCHLUSS.id));
    ["eingangStarten", "eingangStarten2"].forEach((id) => document.getElementById(id)?.addEventListener("click", () => zeigeTest(EINGANG.id)));
    document.getElementById("kompetenzpass").addEventListener("click", zeigeKompetenzpass);
    document.getElementById("zumAbschluss")?.addEventListener("click", () => document.querySelector(".abschluss").scrollIntoView({ behavior: "smooth" }));
    app.querySelectorAll("[data-abschnitt]").forEach((b) => b.addEventListener("click", () => zeigeAbschnitt(+b.dataset.abschnitt)));
    verdrahteTraining(app);
    window.scrollTo(0, 0);
  }

  // ───────────── Abschnitt ─────────────
  function zeigeAbschnitt(ab) {
    const a = ABSCHNITTE.find((x) => x.id === ab);
    const ts = stand.tests[ab];
    const b = besterTest(ab), l = letzterTest(ab), sperre = offeneThemen(ab);
    let html = kopf("Übersicht") + `
      <section class="karte">
        <p class="klein">Abschnitt ${a.nr}</p>
        <h1>${esc(a.titel)}</h1>
        <div class="merke">${a.merke}</div>
      </section>
      <h2>Übungen</h2><div class="raster">`;
    for (const u of uebungenVon(ab)) {
      const s = stand.uebungen[u.id];
      const ausw = s ? auswertung(u) : null;
      let status = '<span class="status">neu</span>';
      if (s?.abgeschlossen && ausw.lw) status = '<span class="status begonnen">👁 Lösungsweg angesehen</span>';
      else if (s?.abgeschlossen) status = `<span class="status ${ausw.prozent >= 50 ? "fertig" : "begonnen"}">✓ ${ausw.prozent} %</span>`;
      else if (s && Object.keys(s.teile).length) status = '<span class="status begonnen">begonnen</span>';
      html += `<button class="aufgabe-kachel ${s?.abgeschlossen && !ausw.lw ? "ist-fertig" : ""}" data-uebung="${u.id}">
        <span class="nr"><span class="sterne">${sterne(u.niveau)}</span> Übung ${u.id.split("-")[1]}</span><span class="titel">${esc(u.titel)}</span>${status}</button>`;
    }
    html += `</div>
      <section class="karte test-karte">
        <h2>🎯 Test zur Selbstkontrolle</h2>
        <p>Acht Fragen zu diesem Abschnitt, ohne Hilfen und ohne Taschenrechner. Jede Frage zählt einen Punkt. Nach der Abgabe siehst du die Lösungen und bekommst Tipps, was du wiederholen solltest. Jeder neue Durchgang hat neue Zahlen.</p>
        <p><b>Ziel:</b> mindestens ${ZIEL()} % im Test. Dann beherrschst du diesen Abschnitt.</p>
        ${b !== null ? `<p><b>Bisher:</b> ${ts.verlauf.map((p) => p + " %").join(" · ")}. ${abschnittBeherrscht(ab) ? "✓ Abschnitt beherrscht." : "Ziel noch nicht erreicht."}</p>` : ""}
        ${testGesperrt(ab) ? `<p class="sperre">🔒 ${testGesperrt(ab)}</p>` : sperre.length ? sperreHtml(sperre) : `<div class="knopfreihe"><button class="knopf haupt" id="testStarten">${ts && !ts.abgegeben && Object.keys(ts.eingaben).length ? "Test fortsetzen" : b !== null ? "Neuen Test starten" : "Test starten"}</button></div>`}
        ${!K.FREISCHALTEN && fertigeUebungen(ab).length < uebungenVon(ab).length ? '<p class="klein">Tipp: Bearbeite zuerst die Übungen. Du kannst den Test aber jederzeit machen.</p>' : ""}
      </section>
      <section class="karte">
        <h2>🔁 Training mit neuen Zahlen</h2>
        <p>Übe ein Thema mit immer neuen Aufgaben, mit Hilfe auf Wunsch. Geschafft ist es, wenn drei Aufgaben in Folge ohne Hilfe richtig sind.</p>
        <div class="chips">${themenVon(ab).map((th) => `<button class="chip" data-training="${th}">${THEMEN[th].name}${(stand.training?.[th]?.geschafft || 0) ? " ✓" : ""}</button>`).join("")}</div>
      </section>`;
    app.innerHTML = html;
    kopfVerdrahten(zeigeUebersicht);
    app.querySelectorAll("[data-uebung]").forEach((k) => k.addEventListener("click", () => zeigeUebung(k.dataset.uebung)));
    document.getElementById("testStarten")?.addEventListener("click", () => zeigeTest(ab));
    verdrahteTraining(app);
    window.scrollTo(0, 0);
  }

  // Hinweis statt Testknopf: erst die verfehlten Themen trainieren
  function sperreHtml(themen) {
    return `<div class="sperre"><p><b>Vor dem nächsten Test:</b> Trainiere zuerst ${themen.length === 1 ? "dieses Thema" : "diese Themen"} aus deinem letzten Test, bis jeweils drei Aufgaben in Folge ohne Hilfe sitzen.</p>
      <div class="chips">${themen.map((th) => `<button class="chip" data-training="${th}">🔁 ${THEMEN[th].name}</button>`).join("")}</div></div>`;
  }
  function verdrahteTraining(bereich) {
    bereich.querySelectorAll("[data-training]").forEach((b) => b.addEventListener("click", () => { document.querySelector(".overlay")?.remove(); zeigeTraining(b.dataset.training); }));
  }

  // ───────────── Training je Thema ─────────────
  // Aufgaben mit neuen Zahlen aus den Testgeneratoren, zwei Versuche, Merkwissen als Hilfe.
  // Geschafft: drei Aufgaben in Folge ohne Hilfe richtig. Danach ist das Thema nicht mehr gesperrt.
  const TRAINING_ZIEL = 3;
  function trainingStand(th) {
    stand.training = stand.training || {};
    if (!stand.training[th]) stand.training[th] = { nr: 0, folge: 0, geschafft: 0, aktuell: null };
    const tr = stand.training[th];
    if (!tr.aktuell) tr.aktuell = { versuche: 0, hilfe: false, fertig: false, richtig: false, eingaben: [] };
    return tr;
  }
  const trainingsAufgabe = (th, tr) => ({ ...erzeugeTraining(th, `${stand.id}|training|${th}|${tr.nr}`), gemischt: true });

  function zeigeTraining(th) {
    const w = THEMEN[th], a = abschnittVonThema(th);
    const tr = trainingStand(th);
    speichern();
    const t = trainingsAufgabe(th, tr), z = tr.aktuell;
    const punkte = Array.from({ length: TRAINING_ZIEL }, (_, i) => `<span class="punkt ${i < tr.folge ? "voll" : ""}"></span>`).join("");
    let rueck = "";
    if (z.fertig && z.richtig) rueck = `<p class="rueck gut">✓ Richtig${z.hilfe ? ", mit Hilfe. Die nächste Aufgabe schaffst du ohne!" : "!"}</p>`;
    else if (z.fertig) rueck = `<p class="rueck schlecht">✗ Leider nicht richtig. Richtig ist: ${t.vor && t.typ !== "auswahl" ? t.vor + " " : ""}${loesungText(t)}${t.einheit && t.typ !== "auswahl" ? " " + t.einheit : ""}</p>`;
    else if (z.versuche === 1) rueck = `<p class="rueck mittel">${z.meldung || "Noch nicht richtig."} Du hast noch einen Versuch.</p>`;
    const hilfe = z.hilfe ? `<div class="hilfe"><p><b>Merkwissen:</b> ${w.merke}</p>${w.tipps.length ? `<ul>${w.tipps.map((x) => `<li>${x}</li>`).join("")}</ul>` : ""}</div>` : "";
    const geschafft = tr.folge >= TRAINING_ZIEL;
    let html = kopf(a.id === EINGANG.id ? "Übersicht" : abschnittName(a)) + `
      <article class="karte aufgabe">
        <p class="klein">Training · ${esc(abschnittName(a))}</p>
        <h1>🔁 ${w.name}</h1>
        <p class="training-stand">Richtig in Folge ohne Hilfe: <span class="punkte">${punkte}</span> ${tr.folge} von ${TRAINING_ZIEL}</p>`;
    if (geschafft) {
      html += `<section class="ergebnis feiern"><h2>Geschafft!</h2><p>Du hast ${TRAINING_ZIEL} Aufgaben in Folge ohne Hilfe richtig gelöst. Das Thema „${w.name}“ sitzt.</p>
        <div class="knopfreihe">${testKnopfNachTraining(th)}<button class="knopf leise" id="weiterTrainieren">Weiter trainieren</button><button class="knopf leise" id="zumAbschnitt">${a.id === EINGANG.id ? "Zur Übersicht" : "Zum Abschnitt"}</button></div></section>`;
    } else {
      html += `<div class="teil"><p class="aufgabentext">${t.text}</p>
        ${z.fertig ? "" : `<form class="eingabe" novalidate>${eingabeHtml(t, `tr-${th}-${tr.nr}`, null, `<button class="knopf haupt" type="submit">Prüfen</button>${z.hilfe ? "" : '<button class="knopf leise" type="button" id="hilfeKnopf">💡 Hilfe</button>'}`)}<p class="fehler" role="alert"></p></form>`}
        ${hilfe}${rueck}
        ${z.fertig ? '<div class="knopfreihe"><button class="knopf haupt" id="naechste">Nächste Aufgabe</button></div>' : ""}</div>`;
    }
    html += `</article>`;
    app.innerHTML = html;
    kopfVerdrahten(testZurueck(a.id));
    document.getElementById("hilfeKnopf")?.addEventListener("click", () => { z.hilfe = true; speichern(); zeigeTraining(th); });
    document.getElementById("naechste")?.addEventListener("click", () => { tr.nr++; tr.aktuell = null; speichern(); zeigeTraining(th); });
    document.getElementById("weiterTrainieren")?.addEventListener("click", () => { tr.folge = 0; tr.nr++; tr.aktuell = null; speichern(); zeigeTraining(th); });
    document.getElementById("zumAbschnitt")?.addEventListener("click", testZurueck(a.id));
    document.getElementById("testNachTraining")?.addEventListener("click", (e) => zeigeTest(+e.currentTarget.dataset.test));
    const form = app.querySelector("form.eingabe");
    if (form) {
      form.querySelector("input:not([type=radio])")?.focus();
      form.addEventListener("input", () => { form.querySelector(".fehler").textContent = ""; });
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const ein = eingabeLesen(t, form);
        const fehler = form.querySelector(".fehler");
        if (ein == null) { fehler.textContent = istAuswahl(t) ? "Bitte wähle zuerst eine Antwort aus." : "Bitte gib zuerst ein Ergebnis ein."; return; }
        const b = bewerte(t, ein);
        if (!b.lesbar) { fehler.textContent = b.meldung; return; }
        z.versuche++;
        z.eingaben.push(eingabeAlsText(t, ein));
        z.meldung = b.meldung || "";
        if (b.ok) { z.richtig = true; z.fertig = true; tr.folge = z.hilfe ? 0 : tr.folge + 1; toast(zufallAus(LOB)); }
        else if (istAuswahl(t) || z.versuche >= 2) { z.fertig = true; tr.folge = 0; }
        if (tr.folge >= TRAINING_ZIEL) trainingGeschafft(th);
        speichern();
        zeigeTraining(th);
      });
    }
    window.scrollTo(0, 0);
  }

  function trainingGeschafft(th) {
    const tr = stand.training[th];
    tr.geschafft = (tr.geschafft || 0) + 1;
    stand.themaFehler[th] = 0;
    for (const ts of Object.values(stand.tests)) if (ts.offeneThemen) ts.offeneThemen = ts.offeneThemen.filter((x) => x !== th);
  }
  // Nach dem Training: zum Test, für den das Thema gesperrt war, sobald nichts mehr offen ist
  function testKnopfNachTraining(th) {
    for (const ab of [THEMEN[th].abschnitt, ABSCHLUSS.id]) {
      const ts = stand.tests[ab];
      if (ts?.abgegeben && !abschnittOderAbschlussBeherrscht(ab) && !offeneThemen(ab).length && !testGesperrt(ab))
        return `<button class="knopf haupt" id="testNachTraining" data-test="${ab}">${ab === ABSCHLUSS.id ? "Neuen Abschlusstest starten" : "Neuen Test starten"}</button>`;
    }
    return "";
  }
  const abschnittOderAbschlussBeherrscht = (ab) => (ab === ABSCHLUSS.id ? abschlussBeherrscht() : abschnittBeherrscht(ab));

  // ───────────── Übung ─────────────
  function zeigeUebung(uid) {
    const u = UEBUNGEN.find((x) => x.id === uid);
    const a = ABSCHNITTE.find((x) => x.id === u.abschnitt);
    uebungStand(uid);
    speichern();
    let html = kopf(abschnittName(a)) + `
      <article class="karte aufgabe">
        <p class="sterne gross">${sterne(u.niveau)} <span class="klein">${NIVEAUS[u.niveau]}</span></p>
        <h1>Übung ${u.id.split("-")[1]}: ${esc(u.titel)}</h1>
        <p class="einleitung">${u.einleitung}</p>
        <p class="klein">Pro Teilaufgabe hast du zwei Versuche, bei Auswahlfragen einen. Brüche kannst du als 3/4 eingeben, Zehnerpotenzen mit getrenntem Vorfaktor und Exponenten. Den Lösungsweg kannst du dir zeigen lassen; die Teilaufgabe zählt dann als nicht gelöst.</p>
        <ol class="teile">`;
    for (const t of u.teile) html += `<li class="teil" id="teil-${t.id}">${teilHtml(u, t)}</li>`;
    html += `</ol><div id="abschluss"></div></article>`;
    app.innerHTML = html;
    kopfVerdrahten(() => zeigeAbschnitt(u.abschnitt));
    for (const t of u.teile) verdrahteTeil(u, t);
    abschlussPruefen(u);
    window.scrollTo(0, 0);
  }

  function teilHtml(u, t) {
    const ts = teilStand(u.id, t.id);
    const letzte = ts.eingaben[ts.eingaben.length - 1];
    let rueck = "";
    if (ts.lw && ts.richtig) rueck = `<p class="rueck mittel">Richtig beantwortet, aber der Lösungsweg wurde angesehen. Die Teilaufgabe zählt als nicht gelöst.</p>`;
    else if (ts.lw && !ts.versuche) rueck = `<p class="rueck mittel">👁 Lösungsweg angesehen. Rechne die Aufgabe trotzdem einmal selbst nach!</p>`;
    else if (ts.fertig && ts.richtig) rueck = `<p class="rueck gut">✓ Richtig${ts.versuche === 1 && !istAuswahl(t) ? " im ersten Versuch" : ""}: ${antwortAnzeige(t, letzte)}</p>`;
    else if (ts.fertig) rueck = `<p class="rueck schlecht">✗ Leider nicht richtig. Richtig ist: ${loesungText(t)}${t.einheit && !istAuswahl(t) ? " " + t.einheit : ""}</p>`;
    else if (ts.versuche === 1) rueck = `<p class="rueck mittel">${ts.meldung || zufallAus(NOCHMAL)} Du hast noch einen Versuch.</p>`;

    const hilfen = t.hilfen.slice(0, ts.hilfen).map((h, i) => `<p class="hilfe"><b>Hilfe ${i + 1}:</b> ${h}</p>`).join("");
    const lwKnopf = !ts.lw && !(ts.fertig && ts.richtig) ? `<button class="knopf leise lw-knopf" type="button">🔎 Lösungsweg</button>` : "";
    let eingabe = "";
    if (!ts.fertig) {
      const hilfeKnopf = ts.hilfen < t.hilfen.length ? `<button class="knopf leise hilfe-knopf" type="button">💡 Hilfe ${ts.hilfen + 1}</button>` : "";
      const knoepfe = `<button class="knopf haupt" type="submit">Prüfen</button>${hilfeKnopf}${lwKnopf}`;
      eingabe = `<form class="eingabe" novalidate>${eingabeHtml(t, u.id + t.id, null, knoepfe)}<p class="fehler" role="alert"></p></form>`;
    }
    const weg = ts.lw || ts.fertig ? `<details class="loesungsweg" ${ts.lw ? "open" : ""}><summary>Lösungsweg</summary>${t.weg}</details>` : "";
    return `
      <div class="teil-kopf"><b>${t.id})</b></div>
      <p class="aufgabentext">${t.text}</p>
      ${hilfen}
      ${eingabe}
      ${rueck}
      ${ts.fertig && !ts.lw && lwKnopf ? `<div class="knopfreihe">${lwKnopf}</div>` : ""}
      ${ts.fertig ? weg : ts.lw ? weg : ""}`;
  }

  function verdrahteTeil(u, t) {
    const li = document.getElementById("teil-" + t.id);
    li.querySelectorAll(".lw-knopf").forEach((k) => k.addEventListener("click", () => loesungswegZeigen(u, t)));
    const form = li.querySelector("form");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const ts = teilStand(u.id, t.id);
      const eingabe = eingabeLesen(t, form);
      const fehler = form.querySelector(".fehler");
      if (eingabe == null) { fehler.textContent = istAuswahl(t) ? "Bitte wähle zuerst eine Antwort aus." : "Bitte gib zuerst ein Ergebnis ein."; return; }
      const b = bewerte(t, eingabe);
      if (!b.lesbar) { fehler.textContent = b.meldung; return; }
      ts.versuche++;
      ts.eingaben.push(istAuswahl(t) ? eingabe : eingabe);
      ts.meldung = b.meldung || "";
      if (b.ok) { ts.richtig = true; ts.fertig = true; toast(zufallAus(LOB)); }
      else if (istAuswahl(t) || ts.versuche >= 2) { ts.fertig = true; themaFehler(t.thema); }
      speichern();
      neuZeichnen(u, t);
    });
    form.querySelectorAll("input").forEach((f) => f.addEventListener("input", () => { form.querySelector(".fehler").textContent = ""; }));
    const hk = form.querySelector(".hilfe-knopf");
    if (hk) hk.addEventListener("click", () => { teilStand(u.id, t.id).hilfen++; speichern(); neuZeichnen(u, t, true); });
  }

  function loesungswegZeigen(u, t) {
    const ts = teilStand(u.id, t.id);
    if (!ts.fertig && !confirm("Lösungsweg anzeigen? Diese Teilaufgabe zählt dann als nicht gelöst, und deine Lehrkraft sieht, dass du den Lösungsweg angeschaut hast.")) return;
    if (!ts.fertig) themaFehler(t.thema);
    ts.lw = true;
    ts.fertig = true;
    speichern();
    neuZeichnen(u, t);
  }

  function neuZeichnen(u, t, fokus) {
    const li = document.getElementById("teil-" + t.id);
    li.innerHTML = teilHtml(u, t);
    verdrahteTeil(u, t);
    const ts = teilStand(u.id, t.id);
    if (ts.fertig && !ts.lw) {
      const naechster = u.teile.find((x) => !teilStand(u.id, x.id).fertig);
      if (naechster) document.querySelector(`#teil-${naechster.id} input`)?.focus();
    } else if (fokus) li.querySelector("input")?.focus();
    abschlussPruefen(u);
  }

  function themaFehler(thema) {
    if (!THEMEN[thema]) return;
    stand.themaFehler[thema] = (stand.themaFehler[thema] || 0) + 1;
    if (stand.themaFehler[thema] % K.WIEDERHOLUNG_AB === 0) setTimeout(() => zeigeKarte(thema, true), 400);
  }

  function abschlussPruefen(u) {
    const s = uebungStand(u.id);
    const box = document.getElementById("abschluss");
    if (!u.teile.every((t) => teilStand(u.id, t.id).fertig)) { box.innerHTML = ""; return; }
    const ausw = auswertung(u);
    if (!s.abgeschlossen) {
      s.abgeschlossen = true;
      s.zeit = Date.now();
      speichern();
      uebungSenden(u, ausw);
    }
    const liste = uebungenVon(u.abschnitt);
    const naechste = liste.slice(liste.indexOf(u) + 1).find((x) => !stand.uebungen[x.id]?.abgeschlossen) || liste.find((x) => !stand.uebungen[x.id]?.abgeschlossen);
    const satz = ausw.lw ? `Bei ${ausw.lw} Teilaufgabe(n) hast du den Lösungsweg angesehen. Rechne die Übung später noch einmal ohne Lösungsweg.`
      : ausw.prozent === 100 ? "Perfekt! Alle Teilaufgaben richtig." : ausw.prozent >= 75 ? "Sehr gut gemacht!" : ausw.prozent >= 50 ? "Gute Arbeit, du bist auf dem richtigen Weg." : "Dranbleiben lohnt sich! Lies das Merkwissen noch einmal und rechne die Übung später neu.";
    box.innerHTML = `
      <section class="karte ergebnis ${ausw.prozent >= 75 && !ausw.lw ? "feiern" : ""}">
        <h2>Übung abgeschlossen: ${ausw.punkte} von ${ausw.max} Punkten (${ausw.prozent} %)</h2>
        <p>${satz}</p>
        <p class="klein" id="sendestatus">${s.gesendet ? "✓ Ergebnis wurde eingetragen." : "Ergebnis wird eingetragen …"}</p>
        <div class="knopfreihe">
          ${naechste ? `<button class="knopf haupt" id="weiter">Weiter: ${esc(naechste.titel)} ${"★".repeat(naechste.niveau)}</button>` : `<button class="knopf haupt" id="zumTest">🎯 Zum Test</button>`}
          <button class="knopf leise" id="nochmal">Übung wiederholen (gleiche Zahlen)</button>
          <button class="knopf leise" id="zumAbschnitt">Zum Abschnitt</button>
        </div>
      </section>`;
    document.getElementById("weiter")?.addEventListener("click", () => zeigeUebung(naechste.id));
    document.getElementById("zumTest")?.addEventListener("click", () => zeigeTest(u.abschnitt));
    document.getElementById("zumAbschnitt").addEventListener("click", () => zeigeAbschnitt(u.abschnitt));
    document.getElementById("nochmal").addEventListener("click", () => {
      if (!confirm("Übung noch einmal von vorn rechnen? Dein bisheriges Ergebnis bleibt bei deiner Lehrkraft gespeichert.")) return;
      stand.uebungen[u.id] = { teile: {}, abgeschlossen: false, durchgang: (s.durchgang || 1) + 1 };
      speichern();
      zeigeUebung(u.id);
    });
  }

  async function uebungSenden(u, ausw) {
    const s = stand.uebungen[u.id];
    const ergebnis = {
      name: stand.name, schuelerId: stand.id, art: "uebung", aufgabe: u.id, abschnitt: u.abschnitt, titel: u.titel, niveau: u.niveau,
      durchgang: s.durchgang || 1, punkte: ausw.punkte, max: ausw.max,
      teile: u.teile.map((t) => { const ts = s.teile[t.id]; return { id: t.id, thema: t.thema, richtig: ts.richtig, versuche: ts.versuche, hilfen: ts.hilfen, lw: !!ts.lw, eingaben: ts.eingaben.map((e) => eingabeAlsText(t, e)) }; }),
      wiederholen: Object.entries(stand.themaFehler).filter(([, n]) => n >= K.WIEDERHOLUNG_AB).map(([th]) => th)
    };
    sendestatus(await Speicher.senden(ergebnis), () => { s.gesendet = true; speichern(); });
  }
  function sendestatus(r, beiErfolg) {
    const el = document.getElementById("sendestatus");
    if (r.ok) { beiErfolg(); if (el) el.textContent = r.demo ? "✓ Ergebnis gespeichert (Demo-Modus, nur auf diesem Gerät)." : "✓ Ergebnis wurde eingetragen."; }
    else if (r.gebunden) { if (el) el.textContent = "⚠ " + r.fehler + " Das Ergebnis wurde nicht eingetragen."; }
    else if (el) el.textContent = "Keine Verbindung. Das Ergebnis ist gemerkt und wird automatisch nachgeschickt.";
  }

  // ───────────── Test zur Selbstkontrolle ─────────────
  const testFragen = (ab, ts) => erzeugeTest(ab, `${stand.id}|${ab}|${ts.durchgang}`).map((f) => ({ ...f, gemischt: true }));

  function zeigeTest(ab) {
    const a = testInfo(ab);
    const ts = testStand(ab);
    if (offeneThemen(ab).length) { toast("Trainiere zuerst die Themen aus deinem letzten Test.", 3000); testZurueck(ab)(); return; }
    if (testGesperrt(ab) && !(ts.eingaben && Object.keys(ts.eingaben).length && !ts.abgegeben)) { toast(testGesperrt(ab), 4000); testZurueck(ab)(); return; }
    if (ts.abgegeben) { ts.durchgang++; ts.eingaben = {}; ts.abgegeben = false; ts.ergebnis = null; speichern(); }
    const fragen = testFragen(ab, ts);
    const istAbschluss = ab === ABSCHLUSS.id;
    let html = kopf(zurueckText(ab)) + `
      <article class="karte aufgabe">
        <p class="klein">Test zur Selbstkontrolle · ${testOrt(ab)} · Durchgang ${ts.durchgang}</p>
        <h1>${istAbschluss ? `🏁 ${esc(a.titel)}` : ab === EINGANG.id ? `🧭 ${esc(a.titel)}` : `🎯 Test: ${esc(a.titel)}`}</h1>
        <p class="klein">Beantworte alle ${fragen.length} Fragen ohne Hilfen und ohne Taschenrechner. Brüche kannst du als 3/4 eingeben. Erst mit „Test abgeben“ wird ausgewertet; bis dahin kannst du alles ändern.</p>
        <form id="testForm" novalidate><ol class="teile">`;
    for (const f of fragen) html += `<li class="teil" data-frage="${f.id}"><div class="teil-kopf"><b>Frage ${f.id}</b></div><p class="aufgabentext">${f.text}</p>${eingabeHtml(f, `t${ab}-${f.id}`, ts.eingaben[f.id])}<p class="fehler" role="alert"></p></li>`;
    html += `</ol><div class="knopfreihe"><button class="knopf haupt" type="submit">Test abgeben</button></div></form></article>`;
    app.innerHTML = html;
    kopfVerdrahten(testZurueck(ab));
    const form = document.getElementById("testForm");
    // Eingaben zwischenspeichern, damit nach einem Neuladen nichts verloren geht
    form.addEventListener("input", (e) => {
      const li = e.target.closest("[data-frage]");
      const f = fragen.find((x) => x.id === li.dataset.frage);
      ts.eingaben[f.id] = eingabeLesen(f, li);
      li.querySelector(".fehler").textContent = "";
      speichern();
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let offen = 0, unlesbar = null;
      for (const f of fragen) {
        const li = form.querySelector(`[data-frage="${f.id}"]`);
        const ein = eingabeLesen(f, li);
        if (ein == null) { offen++; continue; }
        const b = bewerte(f, ein);
        if (!b.lesbar) { li.querySelector(".fehler").textContent = b.meldung; unlesbar = unlesbar || li; }
      }
      if (unlesbar) { unlesbar.scrollIntoView({ behavior: "smooth", block: "center" }); return; }
      if (offen && !confirm(`${offen} Frage(n) sind noch unbeantwortet. Trotzdem abgeben? Unbeantwortete Fragen zählen als falsch.`)) return;
      testAuswerten(ab, fragen);
    });
    window.scrollTo(0, 0);
  }

  function testAuswerten(ab, fragen) {
    const ts = testStand(ab);
    const teile = fragen.map((f) => {
      const ein = ts.eingaben[f.id];
      const ok = ein != null && bewerte(f, ein).ok;
      if (!ok) themaFehlerStill(f.thema);
      return { id: f.id, thema: f.thema, richtig: ok, versuche: ein == null ? 0 : 1, hilfen: 0, lw: false, eingaben: ein == null ? [] : [eingabeAlsText(f, ein)], soll: ohneHtml(f.typ === "auswahl" ? f.optionen[f.richtig] : loesungText(f)).slice(0, 40), frage: ohneHtml(f.text).slice(0, 80) };
    });
    const punkte = teile.filter((t) => t.richtig).length;
    const prozent = Math.round((100 * punkte) / fragen.length);
    ts.abgegeben = true;
    ts.verlauf.push(prozent);
    ts.ergebnis = { punkte, max: fragen.length, prozent };
    ts.themen = themenErgebnis(teile);
    if (ab === ABSCHLUSS.id) {
      ts.proAbschnitt = {};
      fragen.forEach((f, i) => { ts.proAbschnitt[f.abschnitt] = (ts.proAbschnitt[f.abschnitt] || 0) + (teile[i].richtig ? 1 : 0); });
    }
    const verfehlt = [...new Set(teile.filter((t) => !t.richtig).map((t) => t.thema))];
    for (const th of new Set(teile.map((t) => t.thema))) if (!verfehlt.includes(th)) stand.themaFehler[th] = 0;
    ts.offeneThemen = abschnittOderAbschlussBeherrscht(ab) ? [] : verfehlt;
    speichern();
    const a = testInfo(ab);
    Speicher.senden({ name: stand.name, schuelerId: stand.id, art: "test", aufgabe: "T" + ab, abschnitt: ab, titel: ab === ABSCHLUSS.id ? "Abschlusstest" : ab === EINGANG.id ? "Eingangstest" : `Test ${a.nr}`, niveau: 0, durchgang: ts.durchgang, punkte, max: fragen.length, teile,
      wiederholen: Object.entries(stand.themaFehler).filter(([, n]) => n >= K.WIEDERHOLUNG_AB).map(([th]) => th) })
      .then((r) => sendestatus(r, () => {}));
    zeigeTestErgebnis(ab, fragen);
  }
  function themaFehlerStill(thema) { if (THEMEN[thema]) stand.themaFehler[thema] = (stand.themaFehler[thema] || 0) + 1; }

  function zeigeTestErgebnis(ab, fragen) {
    const a = testInfo(ab);
    const istAbschluss = ab === ABSCHLUSS.id;
    const ts = testStand(ab);
    const { punkte, max, prozent } = ts.ergebnis;
    const falscheThemen = [...new Set(fragen.filter((f) => !(ts.eingaben[f.id] != null && bewerte(f, ts.eingaben[f.id]).ok)).map((f) => f.thema))];
    const erreicht = abschnittOderAbschlussBeherrscht(ab);
    const urteil = ab === EINGANG.id
      ? (erreicht ? "Dein Vorwissen aus Klasse 9 sitzt. Los geht’s mit Abschnitt 1!" : "Frische zuerst die Themen unten mit dem Auffrischungstraining auf. Danach kannst du den Eingangstest wiederholen oder direkt mit Abschnitt 1 beginnen.")
      : erreicht
      ? (istAbschluss ? "Ziel erreicht: Du beherrschst das Rechnen mit Potenzen!" : `Ziel erreicht: Du beherrschst Abschnitt ${a.nr}.`) + (prozent < 100 ? " Schau dir die Fehler unten trotzdem an." : "")
      : istAbschluss && prozent >= ZIEL()
        ? `Ziel noch nicht erreicht: In ${abschlussLuecken().map((x) => "Abschnitt " + x.nr).join(", ")} waren es mehr als ein Fehler. Trainiere die Themen unten und schreib dann einen neuen Abschlusstest.`
        : `Ziel noch nicht erreicht (mindestens ${ZIEL()} %). Trainiere die Themen unten mit neuen Zahlen und mach dann einen neuen Test.`;
    const richtig = (f) => ts.eingaben[f.id] != null && bewerte(f, ts.eingaben[f.id]).ok;
    let html = kopf(zurueckText(ab)) + `
      <section class="karte ergebnis ${erreicht ? "feiern" : ""}">
        <p class="klein">Test zur Selbstkontrolle · ${testOrt(ab)} · Durchgang ${ts.durchgang}</p>
        <h1>${punkte} von ${max} Punkten (${prozent} %)</h1>
        <p>${urteil}</p>
        <p class="klein" id="sendestatus">Ergebnis wird eingetragen …</p>
      </section>`;
    if (istAbschluss) {
      html += `<section class="karte"><h2>Ergebnis je Abschnitt</h2><div class="balken-liste">` + ABSCHNITTE.map((x) => {
        const teil = fragen.filter((f) => f.abschnitt === x.id), n = teil.filter(richtig).length, p = Math.round((100 * n) / teil.length);
        const schwach = teil.find((f) => !richtig(f))?.thema;
        return `<button class="balken-zeile" data-zum-abschnitt="${x.id}"><span>${esc(abschnittName(x))}</span><span class="balken"><span style="width:${p}%" class="${p >= 75 ? "gut" : p >= 50 ? "mittel" : "schlecht"}"></span></span><span class="klein">${n}/${teil.length}</span></button>
          ${n < ABSCHLUSS.jeAbschnitt - 1 && schwach ? `<div class="knopfreihe hier-ueben"><span class="klein">Hier noch üben:</span><button class="knopf leise" data-training="${schwach}">🔁 ${THEMEN[schwach].name}</button></div>` : ""}`;
      }).join("") + `</div><p class="klein">Tippe auf einen Abschnitt, um dort weiterzuüben.</p></section>`;
    }
    if (falscheThemen.length) {
      html += `<section class="karte wiederholen"><h2>🔁 Das solltest du wiederholen</h2>` +
        falscheThemen.map((th) => `<div class="empfehlung"><h3>${istAbschluss ? `Abschnitt ${ABSCHNITTE.find((x) => x.id === THEMEN[th].abschnitt).nr} · ` : ""}${THEMEN[th].name}</h3><p>${THEMEN[th].merke}</p><div class="knopfreihe"><button class="knopf leise" data-training="${th}">🔁 Trainieren</button></div></div>`).join("") +
        `</section>`;
    }
    html += `<section class="karte"><h2>Deine Antworten</h2><ol class="teile">`;
    for (const f of fragen) {
      const ein = ts.eingaben[f.id];
      const ok = ein != null && bewerte(f, ein).ok;
      html += `<li class="teil ${ok ? "ist-richtig" : "ist-falsch"}"><div class="teil-kopf"><b>Frage ${f.id}</b>${istAbschluss ? ` <span class="klein">· aus Abschnitt ${ABSCHNITTE.find((x) => x.id === f.abschnitt).nr}</span>` : ""}</div><p class="aufgabentext">${f.text}</p>
        <p class="rueck ${ok ? "gut" : "schlecht"}">${ok ? "✓ Richtig" : "✗ Nicht richtig"} · Deine Antwort: ${ein == null ? "keine" : antwortAnzeige(f, ein)}</p>
        ${ok ? "" : `<p class="klein">Richtig ist: ${f.vor && f.typ !== "auswahl" ? f.vor + " " : ""}${loesungText(f)}${f.einheit && f.typ !== "auswahl" ? " " + f.einheit : ""}</p>`}</li>`;
    }
    html += `</ol><div class="knopfreihe">${offeneThemen(ab).length ? "" : `<button class="knopf haupt" id="neuerTest">${istAbschluss ? "Neuer Abschlusstest" : "Neuer Test mit neuen Zahlen"}</button>`}<button class="knopf leise" id="zumAbschnitt">${aufUebersicht(ab) ? "Zur Übersicht" : "Zum Abschnitt"}</button></div>
      ${offeneThemen(ab).length ? '<p class="klein">Einen neuen Test kannst du starten, sobald du die Themen oben trainiert hast.</p>' : ""}</section>`;
    app.innerHTML = html;
    kopfVerdrahten(testZurueck(ab));
    document.getElementById("neuerTest")?.addEventListener("click", () => zeigeTest(ab));
    verdrahteTraining(app);
    document.getElementById("zumAbschnitt").addEventListener("click", testZurueck(ab));
    app.querySelectorAll("[data-zum-abschnitt]").forEach((b) => b.addEventListener("click", () => zeigeAbschnitt(+b.dataset.zumAbschnitt)));
    window.scrollTo(0, 0);
  }

  // ───────────── Kompetenzpass ─────────────
  // Übersicht der beherrschten Abschnitte und Themen zum Ausdrucken, ohne Noten.
  function themaStatus(th) {
    if ((stand.training?.[th]?.geschafft || 0) > 0) return ["sicher", "✓ sicher (Training geschafft)"];
    // maßgeblich ist der letzte Test des Abschnitts, sonst der letzte Abschlusstest
    const ergebnis = stand.tests[THEMEN[th].abschnitt]?.themen?.[th] ?? stand.tests[ABSCHLUSS.id]?.themen?.[th];
    if (ergebnis === undefined) return ["offen", "– noch nicht geprüft"];
    return ergebnis ? ["sicher", "✓ sicher"] : ["ueben", "◐ noch üben"];
  }
  function zeigeKompetenzpass() {
    const heute = new Date().toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" });
    const zeile = (th) => { const [k, t] = themaStatus(th); return `<tr><td>${THEMEN[th].name}</td><td class="zelle ${k === "sicher" ? "gut" : k === "ueben" ? "mittel" : ""}">${t}</td></tr>`; };
    let html = kopf("Übersicht") + `
      <article class="karte kompetenzpass">
        <h1>Kompetenzpass: Rechnen mit Potenzen</h1>
        <p><b>${esc(stand.name)}</b> · Stand: ${heute}</p>
        <p class="klein">Der Pass zeigt, was du schon sicher kannst. Er enthält keine Noten. „Sicher“ heißt: Im letzten Test waren alle Fragen zu diesem Thema richtig, oder du hast das Training geschafft.</p>
        <h2>${einheitBeherrscht() ? "✓ Ziel der Einheit erreicht" : "Ziel der Einheit noch nicht erreicht"}</h2>`;
    for (const a of ABSCHNITTE) {
      const l = letzterTest(a.id);
      html += `<h3>${esc(abschnittName(a))} – ${abschnittBeherrscht(a.id) ? "✓ beherrscht" : l === null ? "noch nicht getestet" : `noch nicht beherrscht (letzter Test ${l} %)`}</h3>
        <div class="tabelle-huelle"><table><tbody>${themenVon(a.id).map(zeile).join("")}</tbody></table></div>`;
    }
    const lA = letzterTest(ABSCHLUSS.id);
    html += `<h3>Abschlusstest – ${abschlussBeherrscht() ? "✓ bestanden" : lA === null ? "noch nicht geschrieben" : `noch nicht bestanden (letzter Test ${lA} %)`}</h3>
      <div class="knopfreihe"><button class="knopf haupt" id="drucken">🖨 Drucken oder als PDF speichern</button></div></article>`;
    app.innerHTML = html;
    kopfVerdrahten(zeigeUebersicht);
    document.getElementById("drucken").addEventListener("click", () => window.print());
    window.scrollTo(0, 0);
  }

  // ───────────── Overlays ─────────────
  function zeigeKarte(thema, automatisch) {
    const w = THEMEN[thema];
    overlay(`
      ${automatisch ? `<p class="klein">Bei diesem Thema hat es jetzt ${stand.themaFehler[thema]}-mal nicht geklappt. Eine kurze Wiederholung hilft!</p>` : ""}
      <h2>🔁 ${w.name}</h2>
      <div class="merke"><p>${w.merke}</p></div>
      ${w.tipps.length ? `<h3>Typische Stolperstellen</h3><ul>${w.tipps.map((t) => `<li>${t}</li>`).join("")}</ul>` : ""}
      <div class="knopfreihe"><button class="knopf leise" data-training="${thema}">🔁 Jetzt trainieren</button></div>`);
    verdrahteTraining(document.querySelector(".overlay"));
  }

  function zeigeMerkwissen() {
    overlay(`<h2>📘 Merkwissen</h2>` + ABSCHNITTE.map((a) => `<h3>${abschnittName(a)}</h3><div class="merke">${a.merke}</div>`).join(""));
  }

  function abmelden() {
    document.querySelector(".overlay")?.remove();
    const wartend = Speicher.offen();
    const o = document.createElement("div");
    o.className = "overlay";
    o.innerHTML = `<div class="overlay-box" role="dialog" aria-modal="true">
      <h2>Abmelden?</h2>
      <p>Deine abgeschlossenen Übungen und Tests sind bei deiner Lehrkraft gespeichert. Auf diesem Gerät wird dein Fortschritt gelöscht, damit die nächste Person neu beginnen kann.</p>
      ${wartend ? `<p class="hinweis-demo">${wartend} Ergebnis(se) warten noch auf Internet. Sie bleiben auf diesem Gerät und werden automatisch nachgeschickt.</p>` : ""}
      <div class="knopfreihe"><button class="knopf haupt" id="abmeldenJa">Ja, abmelden</button>
      <button class="knopf leise schliessen">Abbrechen</button></div></div>`;
    document.body.appendChild(o);
    const zu = () => o.remove();
    o.querySelector(".schliessen").addEventListener("click", zu);
    o.addEventListener("click", (e) => { if (e.target === o) zu(); });
    o.querySelector("#abmeldenJa").addEventListener("click", () => {
      stand = null;
      Speicher.schreib(STAND, null);
      zu();
      zeigeStart();
      window.scrollTo(0, 0);
      toast("Abgemeldet. Das Gerät ist frei für die nächste Person.", 2600);
    });
    o.querySelector("#abmeldenJa").focus();
  }

  function overlay(inhalt) {
    document.querySelector(".overlay")?.remove();
    const o = document.createElement("div");
    o.className = "overlay";
    o.innerHTML = `<div class="overlay-box" role="dialog" aria-modal="true">${inhalt}<div class="knopfreihe"><button class="knopf haupt schliessen">Verstanden</button></div></div>`;
    document.body.appendChild(o);
    const zu = () => o.remove();
    o.querySelector(".schliessen").addEventListener("click", zu);
    o.addEventListener("click", (e) => { if (e.target === o) zu(); });
    o.querySelector(".schliessen").focus();
  }

  function toast(text, dauer = 1800) {
    const t = document.createElement("div");
    t.className = "toast";
    t.setAttribute("role", "status");
    t.textContent = text;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add("weg"), dauer);
    setTimeout(() => t.remove(), dauer + 500);
  }

  document.addEventListener("keydown", (e) => { if (e.key === "Escape") document.querySelector(".overlay")?.remove(); });

  // ───────────── Start ─────────────
  Speicher.nachsenden().then((n) => { if (n) toast(`${n} gemerkte(s) Ergebnis(se) nachgeschickt.`); });
  if (stand && stand.name) zeigeUebersicht(); else zeigeStart();
})();
