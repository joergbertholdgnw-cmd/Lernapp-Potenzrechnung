// Erkennt Zahleneingaben (Dezimalzahl, Bruch, Zehnerpotenz) und vergleicht sie mit dem Sollwert.
(function () {
  // Liest eine Dezimalzahl in deutscher oder englischer Schreibweise; liefert alle plausiblen Lesarten.
  function dezimal(s) {
    const lesarten = new Set();
    const versuche = (t) => { if (/^[+-]?(\d+\.?\d*|\.\d+)$/.test(t)) lesarten.add(Number(t)); };
    if (s.includes(",") && s.includes(".")) {
      if (s.lastIndexOf(",") > s.lastIndexOf(".")) versuche(s.replace(/\./g, "").replace(",", "."));
      else versuche(s.replace(/,/g, ""));
    } else if (s.includes(",")) {
      if ((s.match(/,/g) || []).length > 1) versuche(s.replace(/,/g, ""));
      else versuche(s.replace(",", "."));
    } else if ((s.match(/\./g) || []).length > 1) {
      versuche(s.replace(/\./g, ""));
    } else {
      versuche(s);
      if (/^[+-]?\d{1,3}\.\d{3}$/.test(s)) versuche(s.replace(".", "")); // Tausenderpunkt
    }
    return [...lesarten];
  }

  // Gibt alle plausiblen Werte einer Eingabe zurück, z. B. „3/4“, „0,75“, „7,5·10^-1“, „7.5e-1“.
  function zahlenAusEingabe(eingabe) {
    let s = String(eingabe).trim()
      .replace(/[−–]/g, "-").replace(/\s+/g, "").replace(/['’]/g, "")
      .replace(/[×x*]/g, "·").replace(/⋅/g, "·");
    // hochgestellte Ziffern, falls jemand sie kopiert
    s = s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]/g, (z) => "^" + ({ "⁰": 0, "¹": 1, "²": 2, "³": 3, "⁴": 4, "⁵": 5, "⁶": 6, "⁷": 7, "⁸": 8, "⁹": 9, "⁻": "-" })[z]).replace(/\^(?=\^)/g, "");
    if (!s) return [];
    // Zehnerpotenz: a·10^n, 10^n, aEn
    let m = s.match(/^([+-]?)(?:([\d.,]+)·)?10\^\(?([+-]?\d+)\)?$/);
    if (m) {
      const faktoren = m[2] === undefined ? [1] : dezimal(m[2]);
      return faktoren.map((f) => (m[1] === "-" ? -1 : 1) * f * Math.pow(10, Number(m[3])));
    }
    m = s.match(/^([+-]?[\d.,]+)e([+-]?\d+)$/i);
    if (m) return dezimal(m[1]).map((f) => f * Math.pow(10, Number(m[2])));
    // Bruch a/b, auch mit Vorzeichen und Dezimalzahlen
    m = s.match(/^([+-]?)\(?([+-]?[\d.,]+)\)?\/\(?([+-]?[\d.,]+)\)?$/);
    if (m) {
      const z = dezimal(m[2]), n = dezimal(m[3]);
      const werte = [];
      for (const a of z) for (const b of n) if (b !== 0) werte.push((m[1] === "-" ? -1 : 1) * a / b);
      return werte;
    }
    return dezimal(s);
  }

  // Endet der Wert nach höchstens 6 Nachkommastellen? Dann wird er exakt verlangt.
  function endlich(w) {
    const x = Math.abs(w) * 1e6;
    return Math.abs(x - Math.round(x)) < 1e-6;
  }

  // Anzahl der Nachkommastellen und der geltenden Ziffern einer Dezimaleingabe („0,037“ → 3 und 2)
  function stellenVon(eingabe) {
    const s = String(eingabe).trim().replace(/[−–+-]/g, "").replace(/\s+/g, "");
    if (!/^\d*[.,]?\d*$/.test(s)) return { nachkomma: 0, geltend: 0 };
    const [ganz, komma = ""] = s.split(/[.,]/);
    const ziffern = (ganz + komma).replace(/^0+/, "");
    return { nachkomma: komma.length, geltend: ziffern.length };
  }

  // Regeln:
  // - optionen.toleranz: relative Abweichung bei Sachaufgaben mit Messwerten (z. B. 0.01 = 1 %)
  // - optionen.exakt: nur der exakte Wert (Bruch oder abbrechende Dezimalzahl), z. B. bei Exponenten
  // - optionen.stellen: verlangte Nachkommastellen bei Rundungsaufgaben („Runde auf zwei Nachkommastellen“)
  // - sonst: abbrechende Werte exakt; nicht abbrechende Werte richtig gerundet mit mindestens zwei geltenden Ziffern
  // Der dritte Parameter darf aus älteren Aufrufen auch eine Zahl (Toleranz) sein.
  function istRichtig(eingabe, sollwert, optionen) {
    const o = typeof optionen === "number" ? { toleranz: optionen } : optionen || {};
    const zahlen = zahlenAusEingabe(eingabe);
    const { nachkomma, geltend } = stellenVon(eingabe);
    return zahlen.some((x) => {
      if (Math.abs(x - sollwert) <= 1e-9 * Math.max(1, Math.abs(sollwert))) return true;
      if (o.exakt) return false;
      if (o.toleranz) return Math.abs(x - sollwert) <= o.toleranz * Math.abs(sollwert);
      if (endlich(sollwert)) return false;
      if (o.stellen ? nachkomma < o.stellen : geltend < 2) return false;
      // richtig gerundet: Abstand höchstens eine halbe Einheit der letzten angegebenen Stelle
      return Math.abs(x - sollwert) <= 0.5 * 10 ** -nachkomma + 1e-12;
    });
  }

  // Abgetrennte Zehnerpotenz: Vorfaktor und Exponent getrennt eingegeben
  function pruefeWiss(vorfaktor, exponent, sollwert, toleranz) {
    const a = zahlenAusEingabe(vorfaktor), n = zahlenAusEingabe(exponent).filter(Number.isInteger);
    if (!a.length || !n.length) return { ok: false, lesbar: false };
    let wertRichtig = false;
    for (const x of a) for (const k of n) {
      const wert = x * Math.pow(10, k);
      const passt = Math.abs(wert - sollwert) <= (toleranz || 1e-9) * Math.abs(sollwert);
      if (!passt) continue;
      wertRichtig = true;
      if (Math.abs(x) >= 1 && Math.abs(x) < 10) return { ok: true, lesbar: true };
    }
    return { ok: false, lesbar: true, nurVorfaktor: wertRichtig };
  }

  const ziel = typeof window !== "undefined" ? window : globalThis;
  Object.assign(ziel, { zahlenAusEingabe, istRichtig, pruefeWiss });
  if (typeof module !== "undefined") module.exports = { zahlenAusEingabe, istRichtig, pruefeWiss };
})();
