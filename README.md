# ANCHOR · Emergency Response App

**Accountability, Needs, and Coordination Hub for Operational Response**, a concept by the UP Resilience Institute.

This is a React + TypeScript build of the Claude Design prototype *ANCHOR App v2 Drawer* (Concept 2). Modules sit in a sliding drawer, and each module's own features sit on the bottom bar. The first screen is the DRRM AID saved on the phone, so SOS, ID, alerts, the evacuation map and hotlines all work before anyone signs in.

## Run it

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # type-checks, then builds to dist/
npm test           # unit tests (Vitest)
npm run lint       # oxlint
```

On a wide screen the app sits in a 390×844 phone frame next to the concept notes and a **Tweaks** panel. Below 480 px wide it fills the screen as a phone app, with no frame and with safe-area insets.

## Demo settings (Tweaks)

There is no real credential check yet. The Tweaks panel decides what a sign-in does:

| Setting | Values | Effect |
| --- | --- | --- |
| `demoResult` | `match`, `mismatch`, `duress`, `alternate` | Result of the IMT code check. `mismatch` leaves only DRRM AID and logs every later action for the IC. `duress` signs in normally and alerts command. `alternate` also opens the covered position's modules. |
| `codePosition` | `ic`, `ops`, `log`, `fin` | The IMT position the code decodes to. The position decides which modules open. |
| `logoConcept` | `A`, `B`, `C`, `D` | Beacon Anchor, Response Shield, Anchor Pin, Converge. |
| `opMode` | `drill`, `actual` | Drill or actual incident. The drawer's Drill/Actual switch changes the same setting. |

Any code and PIN work. The same settings can be passed in the URL, which is the only way to set them on a phone: `/?demoResult=mismatch&codePosition=ops&logoConcept=C&opMode=actual`.

To see the IC's view of a wrong code: set **Wrong code**, sign in, tap **Try again**, set **Match**, sign in as IC, then open **Command → Activity**.

## Code layout

```
src/
  App.tsx                    Holds the demo settings and app state; picks framed or full-screen layout
  settings.ts                Demo settings: defaults and URL parsing
  showcase/                  Desktop presentation: concept notes, Tweaks panel, phone frame
  anchor/
    useAnchorController.ts   All app state, derived values and actions
    context.ts               useAnchor() hook for screens
    data.ts                  Modules, positions, tabs, icons, logos, seed data
    logic.ts                 Pure helpers (permissions, QR pattern, stock checks…), unit-tested
    tokens.ts                Fonts and the shared colour palette
    AnchorScreen.tsx         The phone screen: header, current screen, bottom bar, overlays
    shell/                   Status bar, headers, operation banner, bottom bar, drawer, sheet, toast
    screens/                 One file per module; screens/index.ts maps "<module>_<tab>" to a screen
    ui/                      Icon, LogoMark, small shared components and style helpers
```

Styles are inline, matching the prototype's values. Pressed, hover and focus states, and the scanner animation, are in `src/index.css`. Fonts (Barlow and Barlow Semi Condensed) are bundled through Fontsource, so the app works offline.

## Differences from the prototype

- The prototype's Tweaks came from the design tool. Here they are a panel in the notes column, plus URL parameters.
- The links to Concept 1 and the logo board were removed. Those prototypes are not part of this build.
- Below 480 px wide the app runs full screen instead of inside the drawn phone frame.
- Accessibility: form fields have labels, Enter submits sign-in, the closed drawer is inert, and screens scroll back to the top when you switch tabs.
- The DRRM ID QR is drawn as one SVG instead of 441 cells. It uses the same pattern.
