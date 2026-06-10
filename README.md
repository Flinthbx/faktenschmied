# FaktenSchmied — Website  (Astro)

Produktionsnahe Umsetzung des Relaunches. Premium-Designsprache, datenorientiert, SEO-stark, WCAG-2.2-AA-orientiert, DSGVO-vorbereitet.

## Stack & Begründung
- **Astro 4 + TypeScript** — statische Generierung, standardmäßig 0 KB JS, exzellente Core Web Vitals; ideal für eine inhalts-/SEO-getriebene B2B-Seite. Interaktivität (Reveals, Counter, Tilt) ist schlankes Vanilla-JS im Base-Layout.
- **Ein gemeinsames Stylesheet** (`src/styles/global.css`) als Design-System-Quelle (Firmenfarben als Tokens: Orange `#EF7800`, Navy `#15183B`).
- **Komponenten-Layout** (`src/layouts/Base.astro`) liefert Head/SEO, Header, Footer, Navigation und die Interaktionen für alle Seiten.

## Projektstruktur
```
src/
  layouts/Base.astro        # Head/SEO, Header, Footer, JS
  styles/global.css         # Design-System (Tokens + Komponenten)
  pages/
    index.astro             # /
    brandfacts.astro        # /brandfacts
    brandfacts/rx-werbemonitoring.astro
    brandfacts/dental-werbemonitoring.astro
    brandfacts/veterinaer-werbemonitoring.astro
    use-cases/{wettbewerbsanalyse,mediaplanung,kampagnenentwicklung}.astro
    methodik.astro · insights.astro · ueber-uns.astro · demo.astro
    impressum.astro · datenschutz.astro · 404.astro
public/
  robots.txt · sitemap.xml
```
> Hinweis: Ein evtl. vorhandener Ordner `src/src/` ist Build-irrelevant und kann gelöscht werden.

## Entwicklung
```bash
npm install
npm run dev       # lokal unter http://localhost:4321
npm run build     # statischer Build nach dist/
npm run preview   # gebauten Stand lokal servieren
```
> Wichtig: `dist/` nutzt absolute Pfade (Domain-Root). Zum lokalen Ansehen `npm run dev`/`preview` verwenden – ein Doppelklick auf `dist/index.html` lädt das CSS nicht korrekt.

## Deployment (Vercel)
- Repo mit Vercel verbinden → Framework „Astro“ wird erkannt → Build `npm run build`, Output `dist/`.
- Alternativ den fertigen `dist/`-Ordner als statische Site deployen.

## SEO / Technik bereits umgesetzt
- Pro Seite: Title, Meta-Description, Canonical, Open Graph, `theme-color`.
- Strukturierte Daten: Organization, WebSite, SoftwareApplication, BreadcrumbList.
- `sitemap.xml` + `robots.txt`, saubere sprechende URLs, 404-Seite.
- Reduzierte Bewegung via `prefers-reduced-motion`.

## Offene Punkte vor Live-Gang (Hardening)
1. **Demo-Formular-Backend** anbinden (Vercel Serverless Function, Formspree o. Ä.) inkl. Spam-Schutz und Zustellung an das Team.
2. **Consent-Banner** für nicht-essenzielle Dienste; **Fonts self-hosten** (aktuell Google Fonts → für strikte DSGVO lokal einbinden), dann kein Drittanbieter-Request vor Einwilligung.
3. **Logo & OG-Bild** als Originaldateien einsetzen (aktuell „FS“-Platzhalter; `og-default.png` in `public/` ergänzen).
4. **Impressum/Datenschutz** juristisch finalisieren (Platzhalter).
5. **Insights-Inhalte** (Content Collection) befüllen; „seit 2007“ und Veterinär-Zahlen intern verifizieren.
6. Lighthouse-/Accessibility-Audit auf der Preview-URL.

Alle Zahlen/Texte stammen aus verifizierten Quellen (siehe `../01_Brand_Fakten_VERIFIZIERT.md`).
