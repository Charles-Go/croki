# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Croki is a multiplayer drawing-guessing game inspired by Pikto. Players can only draw using lines and circles to represent words, and other players must guess what was drawn.

## Tech Stack

- **Frontend**: Next.js 16 (App Router) + TypeScript
- **Drawing Canvas**: tldraw SDK v4
- **Multiplayer Sync**: PartyKit + Yjs
- **Styling**: Tailwind CSS v4
- **PWA**: @ducanh2912/next-pwa

## Development Commands

```bash
# Start Next.js dev server (runs on port 3000)
npm run dev

# Start PartyKit dev server (runs on port 1999)
npm run dev:partykit

# Run both servers concurrently
npm run dev:all

# Build for production (uses webpack)
npm run build

# Deploy PartyKit server
npm run deploy:partykit

# Generate PWA icons from SVG
npm run generate-icons
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home page (create/join room)
│   ├── layout.tsx            # Root layout with metadata
│   └── game/[roomId]/page.tsx # Game room page
├── components/
│   ├── Canvas.tsx            # tldraw wrapper with restricted tools
│   ├── Lobby.tsx             # Pre-game lobby
│   ├── DrawerView.tsx        # Drawing interface for drawers
│   ├── GuesserView.tsx       # Guessing interface for the guesser
│   ├── ScoreBoard.tsx        # Player scores display
│   ├── RoundEnd.tsx          # Round results
│   └── GameOver.tsx          # Final game results
└── lib/
    ├── gameState.ts          # Game state types and interfaces
    ├── words.ts              # French word list for the game
    ├── tldraw-config.ts      # Tool restrictions for tldraw
    └── useGame.ts            # React hook for PartyKit connection

party/
└── index.ts                  # PartyKit game server
```

## Game Rules (from Pikto)

- 3-6 players per game
- Drawing constraint: Only straight lines and circles allowed
- One player is the guesser per round, others draw the same word
- Each drawer counts objects in their drawing and submits the count
- Drawings revealed in order: lowest object count first → highest
- Scoring: Guesser gets 2 points for correct guess, drawer gets 1 point
- Game ends when each player has been guesser once

## Key Architecture Decisions

1. **Canvas sync via Yjs**: tldraw canvas state is synced through Yjs CRDT via PartyKit's y-partykit integration
2. **Game state via WebSocket**: Game logic (phases, scores, words) is synced via PartyKit WebSocket messages separately from canvas data
3. **Tool restrictions**: Only line and geo (ellipse) tools are allowed, enforced via tldraw's `overrides` prop
4. **Word hiding**: The PartyKit server filters out the word from messages sent to the guesser

## Environment Variables

```bash
# PartyKit server host
NEXT_PUBLIC_PARTYKIT_HOST=localhost:1999  # dev
NEXT_PUBLIC_PARTYKIT_HOST=your-app.partykit.dev  # prod
```
