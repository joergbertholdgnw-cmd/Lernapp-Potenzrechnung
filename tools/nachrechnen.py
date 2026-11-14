# Unabhängige Zweitrechnung aller Sollwerte mit sympy.
# Jede Teilaufgabe und jede Testfrage trägt in js/aufgaben.js einen sympy-Ausdruck („pruef“),
# der die Aufgabe direkt aus den Angaben beschreibt. Dieses Skript wertet ihn exakt aus und
# vergleicht mit dem Sollwert, den die App in JavaScript berechnet.
# Aufruf: python tools/nachrechnen.py   (liest die Aufgaben über node)
import json
import subprocess
import sys
from pathlib import Path

from sympy import (Integer as I, Rational as R, Symbol, expand, floor, log, nsimplify, powsimp,
                   root, simplify, sqrt, sympify)

ordner = Path(__file__).resolve().parent.parent
x = Symbol("x", positive=True)
y = Symbol("y", positive=True)


def exv(term, var):
    """Exponent der Variablen var in einem Produkt von Potenzen."""
    term = powsimp(simplify(term), force=True)
    return term.as_powers_dict().get(var, 0)


def ex(term):
    return exv(term, x)


NAMEN = {"I": I, "R": R, "x": x, "y": y, "log": log, "root": root, "sqrt": sqrt, "floor": floor,
         "nsimplify": nsimplify, "expand": expand, "simplify": simplify, "ex": ex, "exv": exv}

js = r"""
const A = require('./js/aufgaben.js');
const liste = [];
for (const u of A.UEBUNGEN) for (const t of u.teile) if (t.typ !== 'auswahl') liste.push({ name: `Übung ${u.id}${t.id}`, wert: t.wert, pruef: t.pruef, toleranz: t.toleranz || 0 });
for (const ab of [1, 2, 3, 4, 5]) for (let s = 0; s < 300; s++) for (const f of A.erzeugeTest(ab, 'probe|' + s))
  if (f.typ !== 'auswahl') liste.push({ name: `Test ${ab} Start ${s} Frage ${f.id}`, wert: f.wert, pruef: f.pruef, toleranz: f.toleranz || 0 });
console.log(JSON.stringify(liste));
"""
daten = json.loads(subprocess.run(["node", "-e", js], cwd=ordner, capture_output=True, text=True, check=True, encoding="utf-8").stdout)

fehler = 0
gesehen = {}
for eintrag in daten:
    ausdruck = eintrag["pruef"]
    if ausdruck not in gesehen:
        gesehen[ausdruck] = sympify(sympify(ausdruck, locals=NAMEN))
    exakt = gesehen[ausdruck]
    wert = float(exakt.evalf(30))
    soll = eintrag["wert"]
    # Die App rechnet in Gleitkommazahlen; exakt heißt hier: bis auf Rundungsrauschen gleich.
    if abs(wert - soll) > 1e-9 * max(1, abs(wert)):
        fehler += 1
        print(f"FEHLER {eintrag['name']}: App {soll}, sympy {exakt} = {wert}")

print(f"{len(daten)} Sollwerte geprüft ({len(gesehen)} verschiedene Ausdrücke), {fehler} Abweichungen.")
sys.exit(1 if fehler else 0)
