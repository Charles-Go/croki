# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

See the root `../CLAUDE.md` for full project documentation. This file covers implementation details specific to the `croki/` package.

## Build Quirks

- `npm run dev` uses Turbopack, but `npm run build` uses webpack (required by `@ducanh2912/next-pwa`)
- The `turbopack: {}` in `next.config.ts` silences a warning; PWA is disabled in dev mode
- `partysocket` is in `transpilePackages` for client-side usage

## Game Logic Notes

- The PartyKit server (`party/index.ts`) is the single source of truth for game state
- Word is filtered out of `sync_state` messages sent to the current guesser (server-side filtering in `broadcastState`)
- Guess matching: `normalizeText` strips accents/ligatures (œ→oe, æ→ae), then Levenshtein distance with tolerance (1 char for words ≤5, 2 for ≤10, 3 for longer)
- Drawing timer and guess timer (30s per reveal) are managed via server-side `setTimeout` — clients only receive `timerEndTime` timestamps and render countdown locally
- The `usedWords` array on the server prevents word repeats within a game session (not persisted across reconnects)

## tldraw Specifics

- tldraw v4 API: `editor.toImage()` returns `{ blob }` — used to capture drawings as PNG
- `GeoShapeGeoStyle` is set to `'ellipse'` on mount and enforced via `registerBeforeChangeHandler` to force circles
- The `components` prop nulls out all default tldraw UI; a custom `Toolbar` component provides select/line/circle/eraser
- Canvas `ref` exposes `getImageData()` via `useImperativeHandle`

## Word List

`src/lib/words.ts` contains ~250 French words organized by difficulty (`facile`, `moyen`, `difficile`) and category (animal, objet, nature, nourriture, etc.). The `'mixte'` difficulty setting picks from all levels.
