# Design: Navigations- & Inhalts-Feinschliff (Startseite, Menü, FAQ)

**Datum:** 2026-07-24
**Status:** Freigegeben (User-OK am 2026-07-24)

## Ziel

Fünf voneinander unabhängige Verbesserungen an der bestehenden Astro-Site, um mehr
visuelle Abwechslung zu schaffen, das Menü nutzbarer zu machen und die FAQ zu ergänzen.
Kein Umbau der Architektur — reine, klar abgegrenzte Edits an vorhandenen Dateien.

**Explizit NICHT im Scope (vom User zurückgezogen):**
- Der Startseiten-Header bleibt **unverändert** (Amboss `hero-anvil-trans.png` + CSS-Navy-Blob).
- Die Veterinär-Seite wird **nicht gelöscht** — sie bleibt vollständig erhalten.

## Die fünf Änderungen

### 1. Startseite (01) „Das Problem": Foto statt Balkendiagramm

**Datei:** `src/pages/index.astro` (Abschnitt `#produkt`, aktuell die rechte Spalte
`<div class="reveal" style="transition-delay:.12s">` mit `<div class="panel">` … `.schem` …).

Das schematische Balkendiagramm-Panel (`werbedruck · wettbewerbsvergleich` mit den
`.schem`-Balken) wird ersetzt durch ein Schmiede-Foto im vorhandenen `.forge-frame`-Stil
(dieselbe Behandlung wie auf `/ueber-uns`).

- **Bild:** `/img/forge-jennifer.webp` (Person am Amboss, 880×1100).
  Begründung: Der Header behält den Amboss, `forge-home` läuft weiter unten in der
  Methodik-Sektion → forge-jennifer ist frei und passt thematisch am besten. Auf der
  Startseite erscheinen damit zwei verschiedene Fotos (01 = forge-jennifer, Methodik = forge-home).
- **Markup (Zielzustand):**
  ```astro
  <div class="reveal forge-frame" style="transition-delay:.12s">
    <img src="/img/forge-jennifer.webp"
         alt="FaktenSchmied — am Amboss wird aus glühendem Material Form geschmiedet: aus Rohdaten werden belastbare Fakten."
         width="880" height="1100" loading="lazy" />
    <div class="cap">// aus glühenden Rohdaten werden belastbare Fakten</div>
  </div>
  ```
- **CSS:** `.forge-frame` existiert bereits in `global.css` (Zeile ~344) — keine neue CSS nötig.
- Das alte `.panel`/`.schem`-Markup wird vollständig entfernt.

### 2. Overlay-Menü: Use-Cases als Gruppe mit Unterpunkten

**Datei:** `src/layouts/Base.astro`

Aktuell springt der Hauptlink „Use Cases" direkt auf `/use-cases/wettbewerbsanalyse`.
Neu: „Use Cases" wird eine **Gruppen-Überschrift mit drei wählbaren Unterlinks** —
kein Direktsprung mehr. Umsetzung im selben Muster wie die bestehende Gruppe
„BrandFacts-Branchen" (`menu-sublabel` + `menu-tag`-Links im `menu-col-sub`).

- Das `nav`-Array verliert den `usecases`-Eintrag; übrig bleiben BrandFacts, Insights
  (+ Team, siehe #3) als Haupt-Links im `menu-col-main`.
- Im `menu-col-sub` kommt **vor** „BrandFacts-Branchen" eine neue Gruppe:
  ```astro
  <div class="menu-sublabel">Use Cases</div>
  <div class="menu-tag"><a href="/use-cases/wettbewerbsanalyse">Wettbewerbsanalyse</a></div>
  <div class="menu-tag"><a href="/use-cases/mediaplanung">Mediaplanung</a></div>
  <div class="menu-tag"><a href="/use-cases/kampagnenentwicklung">Kampagnenentwicklung</a></div>
  ```
- Bei zwei `menu-sublabel`-Gruppen untereinander braucht die zweite etwas Abstand nach oben
  (kleiner `margin-top`-Zusatz per CSS oder Inline-Style prüfen/ergänzen).
- Die GSAP-SplitText-Animation zielt bereits auf `.menu-tag a` — die neuen Links animieren
  automatisch korrekt mit.
- `aria-current="page"` optional auf den passenden Use-Case-Tag setzen (die Use-Case-Seiten
  nutzen weiterhin `active="usecases"`).

### 3. Overlay-Menü: Hauptpunkt „Team"

**Dateien:** `src/layouts/Base.astro`, `src/pages/ueber-uns.astro`

- Neuer Haupt-Link im `nav`-Array: `{ key: 'team', label: 'Team', href: '/ueber-uns' }`.
- `/ueber-uns` enthält bereits das komplette Team mit klickbaren `tel:`-Nummern — keine
  inhaltliche Änderung an der Seite nötig.
- `src/pages/ueber-uns.astro`: `active=""` → `active="team"`, damit der Menüpunkt als
  aktiv markiert wird.

Endgültiges `nav`-Array:
```js
const nav = [
  { key: 'brandfacts', label: 'BrandFacts', href: '/brandfacts' },
  { key: 'insights',   label: 'Insights',   href: '/insights' },
  { key: 'team',       label: 'Team',       href: '/ueber-uns' },
];
```

### 4. Veterinär aus dem Overlay-Menü nehmen

**Datei:** `src/layouts/Base.astro`

- Nur die eine Zeile im Overlay-Menü entfernen:
  `<div class="menu-tag"><a href="/brandfacts/veterinaer-werbemonitoring">Veterinär-Werbemonitoring</a></div>`
- **Bleibt unverändert:** die Seite selbst, der Footer-Link (Base.astro ~Zeile 124),
  der Sitemap-Eintrag (`public/sitemap.xml`) und die Karte „Veterinär-Werbemonitoring"
  auf der Startseite (Abschnitt 03 Branchen, verlinkt ohnehin auf `/demo`).
- „BrandFacts-Branchen" im Menü zeigt danach nur noch Rx und Dental.

### 5. FAQ: Frage zu Mediaebene/Motiven

**Datei:** `src/pages/insights.astro` (`faqs`-Array)

Ein neues Objekt ins `faqs`-Array einfügen (thematisch nahe „Welche Werbeformen sind
enthalten?"). Das JSON-LD `FAQPage`-Schema mappt das Array automatisch — kein Extra-Schritt.

```js
{
  q: 'Erfasst BrandFacts auch die Werbemotive selbst?',
  a: 'Ja. Auf der Werbemittel-Ebene erfassen wir zu jeder Platzierung das konkrete Anzeigenmotiv bzw. Key Visual samt Kernbotschaft. So sehen Sie nicht nur, wer wie viel und wo wirbt, sondern auch, mit welchen Motiven und Aussagen.',
}
```

## Umsetzungs-Reihenfolge & Verifikation

Reihenfolge egal (Änderungen sind unabhängig). Nach Umsetzung:
- `npm run dev` starten und visuell prüfen: Startseite (01)-Foto, Overlay-Menü
  (Use-Cases-Gruppe, Team, kein Veterinär), FAQ-Eintrag auf `/insights`.
- `npm run build` muss fehlerfrei durchlaufen.
- Kurzer Blick auf Mobile-Breakpoint (Menü-Overlay, (01)-Foto im gestapelten Grid).

## Risiken / offene Feinheiten

- **Zwei Fotos oben auf der Startseite** gibt es NICHT mehr (Header bleibt Amboss), also
  kein Redundanz-Risiko.
- **Menü-Höhe:** Mit zwei Sublabel-Gruppen im `menu-col-sub` wird die Spalte höher —
  auf kleinen Höhen prüfen, dass nichts abgeschnitten wird.
- **Menü-Hierarchie:** „Use Cases" wird visuell zu den kleineren Tags demotiert (bewusst
  so gewählt: „Überschrift + Unterlinks"). Falls es zu unauffällig wirkt, ist das
  nachträglich leicht anzupassen.
