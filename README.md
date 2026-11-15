# LAVA THRONE — Boss Rush

A co-op boss-rush game for Decentraland, built with SDK7.

> You are a keeper trapped above a lava lake. Smash the crystal waves, strike the Lava King's core, and dodge the lava circles closing in.

**Game Design Document:** [`design/gdd.md`](design/gdd.md) — written for the
[Decentraland Creator Success](https://docs.decentraland.org/creator/studio-onboarding)
program (V0 application, first round open until 30 November 2026).

**Deployed test scene:** `TBD:` — the scene currently runs locally (see below).
It will be published to a Decentraland World as soon as a deployment target is
confirmed, and this README will be updated with the live link.

## Current status

Playable core loop, single-session local version:

- One arena above a lava lake, one stationary boss (the Lava King)
- A practice crystal at spawn that teaches the main verb in the first 10 seconds
- 3 crystal waves (5 / 6 / 7 crystals) with wave timers
- Telegraphed lava circles (1.5 s warning, then eruption) from wave 2 onward
- Boss phase: chip damage, and a 10-second open-core window at 75% / 50% / 25% boss HP
- Shared team HP bar, fight timer, win/lose states, instant retry
- HUD built with React-ECS; all geometry is SDK primitives (no imported models)

Not yet built — this is the proposed V0 scope in the GDD: multiplayer sync via
the Decentraland authoritative server, persistent weekly leaderboard and
titles, the daily boss modifier rotation, and the rescue mechanic.

## Run it locally

**With the Creator Hub (recommended)**

1. Install the [Creator Hub](https://decentraland.org/download/creator-hub).
2. In the **Scenes** tab, import this project's root folder.
3. Press **Preview**.

**With the command line**

```
npm install
npm run start   # preview
npm run build   # type-check + bundle (bin/index.js)
```

## Project layout

| Path | What it is |
|---|---|
| `design/gdd.md` | Game Design Document (Creator Success application) |
| `src/index.ts` | Scene entry point |
| `src/game.ts` | Arena building + the full game loop and systems |
| `src/state.ts` | Shared game state |
| `src/ui.tsx` | HUD (boss/team bars, wave status, start/retry) |
| `scene.json` | Scene metadata, spawn point, display info |

## Design pillars

1. **One arena, zero waiting** — the fight starts with whoever is standing there.
2. **Read the floor, not a manual** — every danger is telegraphed on the ground.
3. **Better together, fine alone** — help always helps, and nobody is ever required.
