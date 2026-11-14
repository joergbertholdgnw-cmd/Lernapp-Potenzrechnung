// Einstellungen der Lernapp „Rechnen mit Potenzen“.
window.KONFIG = {
  // Web-App-Adresse des Google-Skripts (endet auf /exec). Leer = Demo-Modus, Ergebnisse bleiben nur auf diesem Gerät.
  SKRIPT_URL: "https://script.google.com/macros/s/AKfycbzbvwdDSrzE-0-hvi3B-BBWxMEl7TZJyspEC3zhdU7dlfAJn55gxljJMxJLB0iaiO0VAQ/exec",
  // Nach so vielen verfehlten Teilaufgaben zum selben Thema erscheint eine Wiederholungskarte.
  WIEDERHOLUNG_AB: 2,
  // Beherrschungskriterium in Prozent: Ein Abschnitt gilt als beherrscht, wenn der letzte Abschnittstest
  // mindestens diesen Wert erreicht. Die Einheit gilt als beherrscht, wenn zusätzlich der letzte Abschlusstest
  // diesen Wert erreicht und in jedem Abschnitt höchstens ein Fehler war. Gilt auch für „gelöst“ im Lehrerbereich.
  BEHERRSCHT_AB: 75,
  // Freischaltung: true = Abschnittstest erst nach den ★- und ★★-Übungen des Abschnitts,
  // Abschlusstest erst, wenn jeder Abschnittstest einmal mit mindestens 50 % abgegeben wurde.
  // false = alle Tests jederzeit möglich.
  FREISCHALTEN: true
};
