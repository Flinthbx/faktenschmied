# Arbeitsanweisungen für Claude

## Projekt
Faktenschmied-Website. Astro 4 (statisch), TypeScript, kein Framework-JS.
Deployment: Vercel-Projekt `faktenschmied-7ev3`, baut automatisch bei jedem Push auf `main`.

## Struktur
- `src/layouts/Base.astro` — Head/SEO, Header, Overlay-Menü, Footer, globales JS
- `src/styles/global.css` — Design-System (Tokens + Komponenten). Einzige Style-Quelle.
- `src/pages/**` — jede Datei = eine Route
- `src/components/**` — Astro-Komponenten (Effekte, Switcher)
- `public/img/**` — Bilder (webp/png)
- `api/demo.js` — Serverless-Funktion für das Demo-Formular

## Regeln
- Farben/Abstände immer über CSS-Tokens aus `global.css`, keine Hex-Werte inline.
  Firmenfarben: Orange `#EF7800`, Navy `#15183B`.
- Kein neues JS-Framework, keine neuen Dependencies ohne Rückfrage.
- Alle Inhalte auf Deutsch, Du-freie B2B-Ansprache wie bestehend.
- Animationen immer mit `prefers-reduced-motion`-Fallback.
- Menü-Links werden von GSAP SplitText zeilenweise maskiert: `line-height`
  unter ~1.2 schneidet Unterlängen (g, y) ab. Nicht wieder verkleinern.
- Seiten unter `src/pages/varianten/**` sind reine Design-Vorschauen, nicht Produktion.

## Zusammenarbeit
Am Repo arbeiten zwei Personen. Vor jeder Änderung `git fetch` und den Stand
von `origin/main` prüfen. Kein `push --force`.

## Vor jedem Commit
```bash
npm run build   # muss fehlerfrei durchlaufen
```

## Commits
- Commit-Messages auf Deutsch, knapp, im Imperativ/beschreibend.
- Push geht direkt auf `main` → löst Production-Deploy auf Vercel aus.
