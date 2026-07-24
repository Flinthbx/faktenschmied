# Navigations- & Inhalts-Feinschliff — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fünf abgegrenzte Markup/CSS-Edits an der bestehenden Astro-Site umsetzen: Startseiten-Foto statt Balkendiagramm, Use-Cases-Untermenü, Team-Menüpunkt, Veterinär aus dem Menü, neue FAQ-Frage.

**Architecture:** Statische Astro-4-Site. Alle Änderungen sind reine Edits an vorhandenen `.astro`-Dateien plus eine CSS-Zeile in `global.css`. Keine neuen Komponenten, keine neuen Abhängigkeiten, keine JS-Logik.

**Tech Stack:** Astro 4, handgeschriebenes CSS (`src/styles/global.css`), GSAP (nur für das bestehende Overlay-Menü — wird nicht angefasst).

## Global Constraints

- Kein Test-Framework vorhanden. Verifikation je Task = `npm run build` läuft fehlerfrei durch **und** visuelle Sichtprüfung im `npm run dev`-Server.
- Sprache aller sichtbaren Texte: Deutsch (Formulierungen wörtlich aus dieser Spec übernehmen).
- **Header der Startseite NICHT anfassen** (Amboss `hero-anvil-trans.png` + Navy-Blob bleiben).
- **Veterinär-Seite `src/pages/brandfacts/veterinaer-werbemonitoring.astro` NICHT löschen**; Footer-Link, Sitemap-Eintrag und Startseiten-Karte (03 Branchen) bleiben ebenfalls.
- Bestehende Muster/Klassen wiederverwenden (`.forge-frame`, `.menu-sublabel`, `.menu-tag`) — nichts neu erfinden.
- `node_modules/` ist vorhanden; falls ein Build „Cannot find package" meldet, zuerst `npm install`.

---

### Task 1: Startseite (01) — Foto statt Balkendiagramm

**Files:**
- Modify: `src/pages/index.astro` (rechte Spalte im Abschnitt `<section id="produkt">`, aktuell `<div class="panel">` mit `.schem`-Balken)

**Interfaces:**
- Consumes: vorhandenes Bild `public/img/forge-jennifer.webp` (880×1100), vorhandene CSS-Klasse `.forge-frame` in `global.css`.
- Produces: nichts, worauf spätere Tasks aufbauen.

- [ ] **Step 1: Balkendiagramm-Panel durch `.forge-frame`-Bild ersetzen**

In `src/pages/index.astro` diesen Block **exakt** ersetzen:

```astro
      <div class="reveal" style="transition-delay:.12s">
        <div class="panel">
          <div class="ph"><span class="t">werbedruck · wettbewerbsvergleich</span><span class="seg"><b class="on">Print</b><b>Digital</b></span></div>
          <div class="schem">
            <div class="schem-plot">
              <div class="schem-grp"><span class="sb b" style="height:40%"></span><span class="sb a" style="height:55%"></span></div>
              <div class="schem-grp"><span class="sb b" style="height:52%"></span><span class="sb a" style="height:47%"></span></div>
              <div class="schem-grp"><span class="sb b" style="height:46%"></span><span class="sb a" style="height:64%"></span></div>
              <div class="schem-grp"><span class="sb b" style="height:60%"></span><span class="sb a" style="height:72%"></span></div>
              <div class="schem-grp"><span class="sb b" style="height:54%"></span><span class="sb a" style="height:86%"></span></div>
              <div class="schem-grp"><span class="sb b" style="height:66%"></span><span class="sb a" style="height:96%"></span></div>
            </div>
            <div class="schem-foot"><span class="schem-leg"><i class="a"></i>Ihre Marke</span><span class="schem-leg"><i class="b"></i>Wettbewerb</span><span class="schem-time">Zeitverlauf →</span></div>
          </div>
          <div class="cap">// schematische Darstellung</div>
        </div>
      </div>
```

durch:

```astro
      <div class="reveal forge-frame" style="transition-delay:.12s">
        <img src="/img/forge-jennifer.webp" alt="FaktenSchmied — am Amboss wird aus glühendem Material Form geschmiedet: aus Rohdaten werden belastbare Fakten." width="880" height="1100" loading="lazy" />
        <div class="cap">// aus glühenden Rohdaten werden belastbare Fakten</div>
      </div>
```

- [ ] **Step 2: Build prüfen**

Run: `npm run build`
Expected: Build endet mit „Complete!" / Exit 0, keine Fehler.

- [ ] **Step 3: Visuell prüfen**

Run: `npm run dev`, im Browser `http://localhost:4321/` öffnen, zu „(01) Das Problem" scrollen.
Expected: Rechts steht jetzt das Schmiede-Foto (forge-jennifer) im gerahmten Look mit der Bildunterschrift-Zeile „// aus glühenden Rohdaten …" — kein Balkendiagramm mehr. Auf schmaler Breite (Fenster < 920px) steht das Bild sauber unter dem Text.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "Startseite (01): Schmiede-Foto statt Balkendiagramm"
```

---

### Task 2: Overlay-Menü umbauen (Use-Cases-Gruppe, Team, Veterinär raus)

**Files:**
- Modify: `src/layouts/Base.astro` (`nav`-Array + `menu-col-sub`-Block im Overlay)
- Modify: `src/styles/global.css` (Abstand zwischen zwei `menu-sublabel`-Gruppen)
- Modify: `src/pages/ueber-uns.astro` (`active`-Prop)

**Interfaces:**
- Consumes: vorhandene Klassen `.menu-sublabel`, `.menu-tag`, `.menu-cta`; GSAP-SplitText zielt bereits auf `.menu-tag a` (neue Tags animieren automatisch).
- Produces: nichts, worauf spätere Tasks aufbauen.

- [ ] **Step 1: `nav`-Array anpassen (Use Cases raus, Team rein)**

In `src/layouts/Base.astro` ersetzen:

```astro
const nav = [
  { key: 'brandfacts', label: 'BrandFacts', href: '/brandfacts' },
  { key: 'usecases', label: 'Use Cases', href: '/use-cases/wettbewerbsanalyse' },
  { key: 'insights', label: 'Insights', href: '/insights' },
];
```

durch:

```astro
const nav = [
  { key: 'brandfacts', label: 'BrandFacts', href: '/brandfacts' },
  { key: 'insights', label: 'Insights', href: '/insights' },
  { key: 'team', label: 'Team', href: '/ueber-uns' },
];
```

- [ ] **Step 2: Sub-Spalte umbauen (Use-Cases-Gruppe ergänzen, Veterinär-Tag entfernen)**

In `src/layouts/Base.astro` ersetzen:

```astro
            <div class="menu-col menu-col-sub">
              <div class="menu-sublabel">BrandFacts-Branchen</div>
              <div class="menu-tag"><a href="/brandfacts/rx-werbemonitoring">Rx-Werbemonitoring</a></div>
              <div class="menu-tag"><a href="/brandfacts/dental-werbemonitoring">Dental-Werbemonitoring</a></div>
              <div class="menu-tag"><a href="/brandfacts/veterinaer-werbemonitoring">Veterinär-Werbemonitoring</a></div>
              <div class="menu-cta"><a class="btn btn-primary" href="/demo"><span class="lbl">Demo anfragen <span class="ar">→</span></span></a></div>
            </div>
```

durch:

```astro
            <div class="menu-col menu-col-sub">
              <div class="menu-sublabel">Use Cases</div>
              <div class="menu-tag"><a href="/use-cases/wettbewerbsanalyse">Wettbewerbsanalyse</a></div>
              <div class="menu-tag"><a href="/use-cases/mediaplanung">Mediaplanung</a></div>
              <div class="menu-tag"><a href="/use-cases/kampagnenentwicklung">Kampagnenentwicklung</a></div>
              <div class="menu-sublabel">BrandFacts-Branchen</div>
              <div class="menu-tag"><a href="/brandfacts/rx-werbemonitoring">Rx-Werbemonitoring</a></div>
              <div class="menu-tag"><a href="/brandfacts/dental-werbemonitoring">Dental-Werbemonitoring</a></div>
              <div class="menu-cta"><a class="btn btn-primary" href="/demo"><span class="lbl">Demo anfragen <span class="ar">→</span></span></a></div>
            </div>
```

- [ ] **Step 3: CSS-Abstand zwischen zwei Sublabel-Gruppen**

In `src/styles/global.css` direkt **nach** dieser vorhandenen Zeile (~627):

```css
.menu-sublabel{font-family:var(--mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#6B70A0;margin-bottom:4px}
```

diese neue Zeile einfügen:

```css
.menu-col-sub .menu-sublabel ~ .menu-sublabel{margin-top:26px}
```

- [ ] **Step 4: `active`-Prop auf der Über-uns-Seite setzen**

In `src/pages/ueber-uns.astro` in der `<Base …>`-Zeile ersetzen:

```astro
path="/ueber-uns" active="">
```

durch:

```astro
path="/ueber-uns" active="team">
```

- [ ] **Step 5: Build prüfen**

Run: `npm run build`
Expected: Exit 0, keine Fehler.

- [ ] **Step 6: Visuell prüfen**

Run: `npm run dev`, `http://localhost:4321/` öffnen, Menü-Button „Menü" oben rechts klicken.
Expected im Overlay:
- Haupt-Spalte zeigt **BrandFacts · Insights · Team** (kein „Use Cases" mehr als Großlink).
- Sub-Spalte zeigt oben die Gruppe **„Use Cases"** mit Wettbewerbsanalyse / Mediaplanung / Kampagnenentwicklung, darunter mit Abstand **„BrandFacts-Branchen"** mit nur noch Rx und Dental (kein Veterinär).
- Klick auf „Team" führt zu `/ueber-uns`; dort ist im Menü „Team" orange (aktiv).
- Klick auf „Mediaplanung" führt zu `/use-cases/mediaplanung`.

- [ ] **Step 7: Commit**

```bash
git add src/layouts/Base.astro src/styles/global.css src/pages/ueber-uns.astro
git commit -m "Menü: Use-Cases-Untergruppe + Team-Punkt, Veterinär aus Overlay"
```

---

### Task 3: Neue FAQ-Frage zu Mediaebene/Motiven

**Files:**
- Modify: `src/pages/insights.astro` (`faqs`-Array)

**Interfaces:**
- Consumes: vorhandenes `faqs`-Array; das JSON-LD `FAQPage`-Schema mappt das Array automatisch (kein Extra-Schritt).
- Produces: nichts.

- [ ] **Step 1: FAQ-Eintrag ergänzen**

In `src/pages/insights.astro` diese vorhandene Zeile:

```js
  { q: 'Welche Werbeformen sind enthalten?', a: 'Klassische Werbeanzeigen, bezahlte PR, Advertorials und Sonderveröffentlichungen aus dem Print-Bereich sowie Anzeigen und PR in Verlags-Newslettern.' },
```

ersetzen durch diese zwei Zeilen (Original bleibt, neue Zeile folgt darauf):

```js
  { q: 'Welche Werbeformen sind enthalten?', a: 'Klassische Werbeanzeigen, bezahlte PR, Advertorials und Sonderveröffentlichungen aus dem Print-Bereich sowie Anzeigen und PR in Verlags-Newslettern.' },
  { q: 'Erfasst BrandFacts auch die Werbemotive selbst?', a: 'Ja. Auf der Werbemittel-Ebene erfassen wir zu jeder Platzierung das konkrete Anzeigenmotiv bzw. Key Visual samt Kernbotschaft. So sehen Sie nicht nur, wer wie viel und wo wirbt, sondern auch, mit welchen Motiven und Aussagen.' },
```

- [ ] **Step 2: Build prüfen**

Run: `npm run build`
Expected: Exit 0, keine Fehler.

- [ ] **Step 3: Visuell prüfen**

Run: `npm run dev`, `http://localhost:4321/insights` öffnen, zum FAQ-Abschnitt „Häufige Fragen" scrollen.
Expected: Zwischen „Welche Werbeformen sind enthalten?" und „Wie werden die Werbespendings ermittelt?" steht jetzt die neue Frage „Erfasst BrandFacts auch die Werbemotive selbst?"; Aufklappen zeigt die Antwort.

- [ ] **Step 4: Commit**

```bash
git add src/pages/insights.astro
git commit -m "FAQ: Frage zur Werbemittel-Ebene/Motiven ergänzt"
```

---

## Notes für die Umsetzung

- Reihenfolge der Tasks ist frei — sie sind unabhängig.
- Falls `npm run dev` bereits läuft, reicht ein Browser-Refresh (Astro HMR).
- Die Umlaute in den Ersetzungs-Strings müssen exakt erhalten bleiben (UTF-8).
