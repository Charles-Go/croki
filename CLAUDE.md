# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Croki is a multiplayer drawing-guessing game inspired by Pikto. Players draw using only lines and circles, and one player per round must guess the word. The game uses French words and a French UI.

All project code lives in the `croki/` subdirectory.

## Development Commands

All commands run from `croki/`:

```bash
cd croki
npm install

# Run both Next.js + PartyKit dev servers concurrently
npm run dev:all

# Or separately:
npm run dev            # Next.js on http://localhost:3000 (uses Turbopack)
npm run dev:partykit   # PartyKit on http://localhost:1999

npm run build          # Production build (uses webpack, not Turbopack — required for PWA plugin)
npm run lint           # ESLint (flat config, Next.js + TypeScript rules)
npm run deploy:partykit # Deploy PartyKit server
npm run generate-icons  # Generate PWA icons from SVG
```

No test framework is configured.

## Architecture

### Two-Server Model

The app runs two servers in development:
1. **Next.js** (port 3000) — serves the frontend (App Router)
2. **PartyKit** (port 1999) — handles multiplayer game logic and real-time sync

### Dual Communication Channels

PartyKit manages two independent data flows over the same WebSocket connection:
- **Game state (JSON messages)**: Game logic (phases, scores, words, player management) sent as JSON via `party/index.ts`. The server maintains authoritative `GameState` and broadcasts filtered copies to clients (word is hidden from the guesser).
- **Canvas sync (Yjs binary)**: tldraw canvas CRDT data synced via `y-partykit`. Binary messages are ignored by the game state handler in `useGame.ts`.

### Game Flow (State Machine)

`GamePhase`: `waiting` → `drawing` → `revealing` → `round_end` → (loop or `game_over`)

- **waiting**: Lobby. Host configures settings, players ready up. Requires 3+ players.
- **drawing**: Drawers see the word and draw on tldraw canvas. Guesser waits. Timer runs server-side with `setTimeout`.
- **revealing**: Drawings revealed one at a time, sorted by object count (fewest first). Guesser submits text guesses. Guess matching uses Levenshtein distance with accent normalization.
- **round_end**: Scores shown. Drawer gets 2 pts for their drawing being guessed, guesser gets 1 pt.
- **game_over**: Final standings.

### Key Files

- `party/index.ts` — PartyKit server: all game logic, state management, word selection, guess validation
- `src/lib/useGame.ts` — React hook wrapping PartySocket; provides all game actions to components
- `src/lib/gameState.ts` — Shared TypeScript types for `GameState`, `GameMessage`, `Player`, etc.
- `src/lib/words.ts` — French word list (~250 words) with categories and difficulty levels
- `src/lib/tldraw-config.ts` — tldraw tool restrictions (line + geo only)
- `src/components/Canvas.tsx` — tldraw wrapper: custom toolbar, forces ellipses to circles, captures drawing as PNG via `editor.toImage()`
- `src/app/game/[roomId]/page.tsx` — Main game page, routes to phase-specific components

### tldraw Integration

- Default tldraw UI is fully hidden via `components` prop (Toolbar, MainMenu, etc. all set to `null`)
- Custom toolbar with 4 tools: select, line, circle (geo locked to ellipse), eraser
- `isToolLocked: true` keeps the current tool active after drawing a shape
- Ellipses forced to perfect circles via `registerBeforeChangeHandler`
- Drawings exported as base64 PNG for the reveal phase

## Environment Variables

```bash
NEXT_PUBLIC_PARTYKIT_HOST=localhost:1999   # dev (default in useGame.ts)
NEXT_PUBLIC_PARTYKIT_HOST=your-app.partykit.dev  # prod
```

## Tech Stack

- Next.js 16 (App Router) + TypeScript
- tldraw SDK v4
- PartyKit + Yjs (y-partykit)
- Tailwind CSS v4
- @ducanh2912/next-pwa
- Path alias: `@/*` → `./src/*`
