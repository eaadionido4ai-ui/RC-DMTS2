# ANCHOR · Emergency Response App

**Accountability, Needs, and Coordination Hub for Operational Response**, a concept by the UP Resilience Institute.

ANCHOR is an installable web app (PWA) built with React + TypeScript from the Claude Design prototype *ANCHOR App v2 Drawer*. Modules sit in a sliding drawer, and each module's own features sit on the bottom bar. The first screen is the DRRM AID saved on the phone, so SOS, ID, alerts, the evacuation map and hotlines all work before anyone signs in.

**Live app:** https://eaadionido4ai-ui.github.io/RC-DMTS2/

## Install it on a phone

- **Android (Chrome):** open the link, then tap **Install app** (or **⋮ → Add to Home screen**).
- **iPhone (Safari):** open the link, tap **Share**, then **Add to Home Screen**.

It opens full screen like a native app. After the first visit everything is stored on the phone, so it opens and runs with no signal. New versions download in the background and take effect the next time the app is opened.

On a computer, the app shows in a phone-width column in the middle of the window.

## Develop

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # type-checks, then builds the app and service worker to dist/
npm run preview    # serve the build, service worker included
npm test           # unit tests (Vitest)
npm run lint       # oxlint
```

Every push to `main` is linted, tested, built and published to GitHub Pages by `.github/workflows/deploy.yml`. Pull requests run the same checks without deploying. In the repository settings, **Pages → Source** must be set to **GitHub Actions**.

## Trying other sign-in outcomes

There is no real credential check yet, so any IMT code and PIN sign in as the Incident Commander. To try the other outcomes, add these to the URL:

| Parameter | Values | Effect |
| --- | --- | --- |
| `demoResult` | `match` (default), `mismatch`, `duress`, `alternate` | Result of the IMT code check. `mismatch` leaves only DRRM AID and logs every later action for the IC. `duress` signs in normally and alerts command. `alternate` also opens the covered position's modules. |
| `codePosition` | `ic` (default), `ops`, `log`, `fin` | The IMT position the code decodes to. The position decides which modules open. |
| `logoConcept` | `A` (default), `B`, `C`, `D` | Beacon Anchor, Response Shield, Anchor Pin, Converge. |
| `opMode` | `drill` (default), `actual` | Starting operation mode. The drawer's Drill/Actual switch changes it too. |

For example: `https://eaadionido4ai-ui.github.io/RC-DMTS2/?demoResult=mismatch`. Changing the URL reloads the app, which resets its sample data.

## Code layout

```
src/
  App.tsx                    Reads the URL settings and holds app state
  settings.ts                URL parameters and their defaults
  anchor/
    useAnchorController.ts   All app state, derived values and actions
    context.ts               useAnchor() hook for screens
    data.ts                  Modules, positions, tabs, icons, logos, seed data
    logic.ts                 Pure helpers (permissions, QR pattern, stock checks…), unit-tested
    tokens.ts                Fonts and the shared colour palette
    AnchorScreen.tsx         The app shell: header, current screen, bottom bar, overlays
    shell/                   Headers, operation banner, bottom bar, drawer, sheet, toast
    screens/                 One file per module; screens/index.ts maps "<module>_<tab>" to a screen
    ui/                      Icon, LogoMark, small shared components and style helpers
public/icons/                App icons (standard, maskable, Apple touch)
vite.config.ts               Build and PWA settings (manifest, service worker)
```

Styles are inline, matching the prototype's values. Pressed, hover and focus states, and the scanner animation, are in `src/index.css`. Fonts (Barlow and Barlow Semi Condensed) are bundled through Fontsource and cached with the app.

## Not built yet

This is the complete front end with sample data. There is no server: data lives in the browser and resets on reload, sign-in does not check a real credential, SOS and alerts do not reach anyone, the ID QR is a placeholder pattern, scanning is simulated, the SIPAT map is a schematic, and GAB.ai gives fixed answers.
