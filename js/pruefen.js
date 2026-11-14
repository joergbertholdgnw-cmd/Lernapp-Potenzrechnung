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

  // toleranz: relative Abweichung bei Sachaufgaben mit Rundung (z. B. 0.01 = 1 %); sonst exakt
  // bzw. bei nicht abbrechenden Werten auf mindestens zwei Nachkommastellen gerundet.
  function istRichtig(eingabe, sollwert, toleranz) {
    const zahlen = zahlenAusEingabe(eingabe);
    const nachkomma = (() => { const m = String(eingabe).match(/[.,](\d+)(?!.*[.,])/); return m ? m[1].length : 0; })();
    return zahlen.some((x) => {
      if (Math.abs(x - sollwert) <= 1e-9 * Math.max(1, Math.abs(sollwert))) return true;
      if (toleranz) return Math.abs(x - sollwert) <= toleranz * Math.abs(sollwert);
      if (endlich(sollwert) || nachkomma < 2) return false;
      const gerundet = Math.round(sollwert * 10 ** nachkomma) / 10 ** nachkomma;
      return Math.abs(x - gerundet) < 1e-9 && Math.abs(x - sollwert) <= 0.015 * Math.abs(sollwert);
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
