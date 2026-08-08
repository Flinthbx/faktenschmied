# Startseite auf Foto-Stage umstellen, Varianten entfernen, KI-Bildnachweis

**Datum:** 2026-08-08
**Status:** Zur Review
**Repo:** Desktop-Root (`Faktenschmied Website`, branch `main`, remote `origin`)

## Ziel

Die Startseiten-Variante **„Variante 1" (Vollbild-Foto-Stage) wurde als Design gewählt**.
Die Startseite wird darauf umgestellt, das temporäre `/varianten`-Vorschausystem wird
entfernt, und im Impressum kommt ein rechtlich nötiger **KI-Bildnachweis** dazu.

## Entscheidungen (mit dem Nutzer festgelegt)

1. **Startseiten-Hero:** Das aktuelle Amboss-/Blob-Hero wird durch die **Vollbild-Foto-Stage**
   ersetzt (Design von Variante 1: `forge-home.webp` als Vollbild + Scrim + Glow + Text).
   Das Amboss-/Blob-Hero **entfällt** komplett.
2. **Restlicher Startseiten-Inhalt bleibt unverändert.** Wichtig: Die Startseite behält ihren
   **inline-Body** (u. a. Schmiede-Foto `forge-jennifer.webp` in der Problem-Sektion aus dem
   Wechsel „Balkendiagramm → Schmiede-Foto"). Es wird **NICHT** auf `HomeBody` umgestellt,
   denn `HomeBody` enthält noch das alte Balkendiagramm.
3. **Varianten-System entfernen:** `/varianten` (v1–v5 + Übersicht) und die nur dafür
   genutzten Komponenten werden gelöscht.
4. **KI-Bildnachweis:** Neuer Abschnitt „Bildnachweis" im Impressum, **neutral** formuliert
   („KI-generiert", ohne Tool-Namen). Betroffen: die Schmiede-/Illustrationsmotive. Team-
   Porträts sind echte Fotos.
5. **Rollout:** lokal bauen + visuell prüfen; **Commit/Push erst nach ausdrücklichem OK.**

## Ist-Zustand (relevant)

- `src/pages/index.astro`: Hero = Amboss (`.hero home` + `.hero-blob`-SVG + `hero-anvil-trans.png`,
  Zeilen ~39–68). Darunter **inline** der komplette Startseiten-Body (Proof, Problem/Value mit
  `forge-jennifer.webp`, Features, Branchen, Use Cases, Methodik, Team, Demo, Final-CTA).
- `src/pages/varianten/{v1..v5,index}.astro`: Vorschau-Varianten, nutzen `HomeBody`,
  `VariantSwitcher`, `VariantStyles`, `FontSwitcher`.
- `VariantStyles.astro`: enthält u. a. den `.vh1`-Stage-Stil (Zeilen 9–20) und `.vh-micro`.
- `global.css`: Amboss-Hero-Regeln unter `body.home` (Cream-Hero, Textfarben, `.hero-visual`
  absolut, mobiler dunkler Menü-Toggle) + `.hero-art` / `.hero-blob`.
  **`.hero.home .wrap`-Grid (Zeilen 89, 414) wird von Produktseiten benutzt** (`brandfacts`,
  `rx-…`, `dental-…` mit `class="hero interior home"`) → **muss bleiben.**
- Abhängigkeits-Check (grep): `HomeBody`, `VariantSwitcher`, `VariantStyles`, `FontSwitcher`
  werden **ausschließlich** von den `/varianten`-Seiten importiert. `hero-art`/`hero-blob`
  nur von `index.astro`. `/varianten`-Links nur in `VariantSwitcher`/`varianten/index`.

## Umsetzung

### 1. Startseiten-Hero → Vollbild-Foto-Stage
- In `index.astro` den `<section class="hero home">…</section>`-Block (Amboss, Z. 39–68)
  ersetzen durch eine Stage-Sektion (Markup analog `varianten/v1.astro` Z. 10–23), mit
  **permanenter Klasse `.hero-stage`** statt `.vh1`:
  ```astro
  <section class="hero-stage">
    <div class="bg"><img src="/img/forge-home.webp" alt="FaktenSchmied — Blick in die Schmiede, sinnbildlich für das Schmieden belastbarer Fakten aus Rohdaten." width="1600" height="1000" loading="eager" fetchpriority="high" /></div>
    <div class="scrim"></div><div class="glow"></div>
    <div class="wrap"><div class="inner">
      <div class="ey on-dark reveal">Healthcare-Werbemonitoring</div>
      <h1 class="reveal" style="transition-delay:.08s">Sehen Sie, <span class="serif-it o">wie Ihr Markt wirbt</span> — bevor es Ihre Wettbewerber tun.</h1>
      <p class="sub reveal" style="transition-delay:.16s">BrandFacts analysiert den Werbedruck, Werbeinhalte und Werbespendings im Healthcare-Sektor für die Region D-A-CH. Erfasst werden die Fachzeitschriften sowie die Newsletter der Verlage. Mithilfe dieser Werbe-Beobachtung treffen Sie bessere Budget-, Kampagnen- und Positionierungsentscheidungen.</p>
      <div class="acts reveal" style="transition-delay:.24s">
        <a class="btn btn-primary btn-lg" href="/demo" id="magnet"><span class="lbl">Kostenlose Demo anfragen <span class="ar">→</span></span></a>
        <a class="btn btn-onnavy btn-lg" href="/brandfacts"><span class="lbl">BrandFacts entdecken</span></a>
      </div>
      <div class="vh-micro reveal" style="transition-delay:.32s"><span class="dot"></span>Kostenloses Teams-Meeting · Bedarf klären · unverbindlich</div>
    </div></div>
  </section>
  ```
- `HeroLoader` bleibt darüber. Der Rest von `index.astro` (Proof … Final-CTA) bleibt **unangetastet**.

### 2. Stage-Styles nach `global.css`
- Die `.vh1`-Regeln (aus `VariantStyles`) als **`.hero-stage`** dauerhaft in `global.css`
  aufnehmen (inkl. `.bg/.scrim/.glow/.wrap/.inner/h1/.sub/.acts`), plus `.vh-micro`
  (+ dessen `.dot`). Menü bleibt hell (Default) — passt auf das dunkle Foto in allen
  Zuständen (oben/gescrollt/mobil). Kein `body.home`-Menü-Sonderfall mehr nötig.

### 3. Amboss-Hero-CSS entfernen
- Aus `global.css` entfernen: die `body.home`-Regeln (Cream-Hero-Hintergrund + Textfarben,
  `.hero-visual` absolut + mobil, Menü-Toggle-Farbe) sowie `.hero-art` und `.hero-blob`.
- **Behalten:** `.hero.home .wrap`-Grid (Produktseiten), alle übrigen Hero-/Interior-Regeln.

### 4. Varianten-System löschen
- Löschen: `src/pages/varianten/` (v1–v5, index.astro) und
  `src/components/{VariantSwitcher,VariantStyles,FontSwitcher,HomeBody}.astro`.
- Nicht mehr genutztes Asset entfernen: `public/img/hero-anvil-trans.png`
  (die Root-Arbeitsdatei `transparent.png` ebenfalls, da nicht mehr gebraucht).

### 5. KI-Bildnachweis im Impressum
- In `src/pages/impressum.astro` einen Abschnitt „Bildnachweis" ergänzen, neutral:
  > **Bildnachweis** — Die auf dieser Website verwendeten Schmiede- und Illustrationsmotive
  > wurden mit Hilfe künstlicher Intelligenz (KI) erstellt. Die Porträtfotos des Teams sind
  > echte Fotografien.

## Verifikation
- `npm run build` erfolgreich; keine toten Importe (alle Variant-Komponenten mit den
  Seiten entfernt).
- Startseite: Vollbild-Foto-Stage, Text lesbar, Menü lesbar (oben/gescrollt/mobil),
  Problem-Sektion zeigt weiterhin das Schmiede-Foto (nicht das Balkendiagramm).
- `/varianten*` liefert 404 (Seiten weg); keine Links mehr ins Leere (`VariantSwitcher` weg).
- Produktseiten-Heros (`brandfacts`/`rx`/`dental` mit `.hero interior home`) unverändert.
- Impressum zeigt den Bildnachweis.
- Mobile/Reduced-Motion unverändert korrekt.

## Abgrenzung (YAGNI)
- Kein Umbau des restlichen Startseiten-Inhalts, keine anderen Seiten außer Impressum.
- Kein neues Bildmaterial; vorhandene `forge-*.webp` werden genutzt.
