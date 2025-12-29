# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This repository contains **Croki**, a multiplayer drawing-guessing game inspired by Pikto.

The main project is in the `croki/` subdirectory. See `croki/CLAUDE.md` for detailed project documentation.

## Quick Start

```bash
cd croki

# Install dependencies
npm install

# Start development servers (Next.js + PartyKit)
npm run dev:all

# Or run them separately:
npm run dev          # Next.js on http://localhost:3000
npm run dev:partykit # PartyKit on http://localhost:1999
```

## Tech Stack

- Next.js 16 + TypeScript
- tldraw SDK (drawing canvas)
- PartyKit + Yjs (real-time multiplayer)
- Tailwind CSS
- PWA support
