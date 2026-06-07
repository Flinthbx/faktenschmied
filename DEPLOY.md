# Deployment auf Vercel

Das Projekt ist build-verifiziert (15 Seiten, 0 Fehler) und für Vercel vorbereitet (Astro wird automatisch erkannt: Build `npm run build`, Output `dist/`).

Dein Vercel-Team: **Vinzent** (`captncookiede-2060s-projects`).

Der Push muss von dir kommen (CLI-Login bzw. Git) — danach kann ich das Deployment über die Vercel-Verbindung prüfen (Build-Logs, Status, Live-Check).

## Option A — Vercel CLI (schnellster Weg)
```bash
cd webapp
npx vercel            # Preview-Deployment (einmalig Login im Browser)
# später:
npx vercel --prod     # Produktions-Deployment
```
Beim ersten Lauf fragt die CLI nach Login und Projektzuordnung — „captncookiede-2060s-projects" wählen. Du erhältst eine Preview-URL.

## Option B — GitHub + Vercel-Integration
PowerShell kennt kein `&&` — Befehle einzeln ausführen (jede Zeile separat):
```powershell
cd webapp
git init
git add -A
git commit -m "FaktenSchmied Relaunch"
git branch -M main
git remote add origin <DEIN_REPO_URL>
git push -u origin main
```
Anschließend auf vercel.com „New Project“ → das Repo importieren. Jeder Push erzeugt automatisch eine Preview; `main` → Produktion.

## Nach dem Deploy
Sag mir die Preview-URL (oder dass deployt wurde) — dann prüfe ich über die Vercel-Verbindung Build-Status, Logs und die Live-Seite und gehe die finale QA durch (Core Web Vitals, Mobile/Desktop, SEO).

## Custom Domain (faktenschmied.de)
Später im Vercel-Projekt unter Settings → Domains hinzufügen. Die `site`-URL in `astro.config.mjs` steht bereits auf `https://www.faktenschmied.de` (für Canonicals/Sitemap).

## Hinweis
- `node_modules/` und der versehentliche Ordner `src/src/` können gelöscht werden (Build nutzt nur `src/pages`).
- Vor Produktion: offene Punkte aus `README.md` (Formular-Backend, Impressum/Datenschutz, Logo/OG-Bild).
