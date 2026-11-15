# LAVA THRONE — Boss Rush (GDD)

**Decentraland Creator Success Program**

| | |
|---|---|
| Public experience title | LAVA THRONE — Boss Rush — IP & Content Policy status: owner declaration: all materials are original, built from SDK primitives and Decentraland asset packs; no third-party characters, logos, or music; name screening: not searched; unresolved: title screening `TBD:` |
| Deployment target | `TBD:` World NAME not yet claimed — funding-first path: this application is made before any NAME purchase; the test scene in this repository runs locally and will be published to a World as soon as a deployment target is confirmed |
| Studio / team name | styindo — solo developer (AI-assisted development; all design decisions are the developer's own) |
| Date | 2026-11-15 |
| Contact (Discord + email) | email: tuyuldana1@gmail.com · Discord: `TBD:` |

---

## 0. TL;DR

| | |
|---|---|
| **Player promise** | You are a keeper trapped above a lava lake. Smash the crystal waves, strike the Lava King's core, and dodge the lava circles closing in. |
| **Primary player** | For players who already enjoy short co-op boss fights and raid-style games, arriving with friends or from an Event, looking for a complete fight in about ten minutes on a phone. |
| **Current status** | Playable core loop — the test scene in this repository runs the full fight solo in one session (crystal waves, telegraphed lava circles, timed core phase, win/lose and instant retry). Multiplayer sync and persistence are the proposed V0 scope, not yet built. Playable link: `TBD:` — published once a World deployment target is confirmed (see header). |
| **Requested round** | V0 |
| **Live at end of the round** | A player can enter the World, press START, and fight the Lava King solo or with up to 7 others: three crystal waves, telegraphed lava circles, a timed core phase, a persistent weekly board, and a daily boss modifier. |

---

## 1. Player Promise

**One-line promise.**

You are a keeper trapped above a lava lake. Smash the crystal waves, strike the Lava King's core, and dodge the lava circles closing in.

**One familiar comparison.**

It's like a Monster Hunter boss hunt, but one arena, one thumb, and a full fight in ten minutes.

**Why this game.**

I spend my time in free-to-enter online game events, and I keep leaving early: sessions drag, or nothing starts until a big group shows up. I want the boss-fight feeling — read the telegraph, rush the opening — in a fight that starts with one tap, works with whoever is there, and ends before it gets tired.

---

## 2. First Minutes & How to Play

| Time | Player experience |
|---|---|
| **0–5 seconds after control** | You spawn at the arena edge facing the centre: a huge dark Lava King over orange lava, a glowing START stone, and one pulsing cyan crystal three steps ahead of you. |
| **5–10 seconds** | You tap the pulsing crystal. It shatters with a shard burst and a "+1" — you now know the main verb and that crystals matter. |
| **10–60 seconds** | You press START. Wave 1 opens: five crystals around the arena. You smash them one by one; each shatter fills the shared progress bar at the top of your screen. |
| **1–3 minutes** | Waves 2 and 3 are faster and spread wider. Between waves, the first red lava circles bloom on the floor and erupt — you learn to move by almost getting caught once. |
| **3–10 minutes** | The boss phase: circles keep coming while you chip the King. Every 25% of his bar, his core opens gold for 10 seconds — everyone rushes in to strike it. Win, and the board stamps your time; lose the team bar, and a RETRY button appears where you stand. |
| **Natural stopping point** | The win/lose board shows your time, your weekly rank, today's boss modifier — and tomorrow's modifier, which is your reason to return. |

**Player-facing How to Play.**

- Smash crystals to charge the fight
- Dodge red circles before they erupt
- Strike the core when it opens

---

## 3. Core Loop

| # | Step (verb) | What the player does (Player input → what they see or hear → what changes) | Why do it again? |
|---|---|---|---|
| 1 | Smash | Tap a crystal → it cracks, then shatters into shards → wave progress bar fills; finishing a wave early banks bonus time for the boss phase | Each crystal is visible progress, and the next wave spreads crystals somewhere new |
| 2 | Dodge | See a red circle bloom under you → move out before 1.5 seconds → it erupts; standing inside costs the shared team bar | Circles land where the crystals are — safety and progress pull in opposite directions |
| 3 | Strike | The core opens gold for 10 seconds → run in and tap it repeatedly → the boss bar drops in big chunks | The core window is the whole fight's payoff; missing it means another long chip phase |
| 4 | Rescue | A teammate caught by an eruption is downed → stand next to them for 3 seconds → they are back up with the fight still running *(V0 scope — not in the application test scene)* | A rescue is the moment a stranger becomes a teammate |

| | |
|---|---|
| **One complete loop takes** | One smash–dodge–strike cycle takes about 40–60 seconds and ends with a wave cleared or a core phase resolved. A full fight takes 8–12 minutes; the earlier payoff is every single crystal shatter. |
| **Decision, challenge, or expression** | Which crystal first — the near one, or the far one before the wave timer ends; whether to finish a crystal while a circle blooms under it; when to call the core rush with a ping so everyone arrives inside the same 10-second window. |
| **Shortest satisfying visit / typical session** | 4 / 15 minutes. One wave set plus a boss attempt is a complete short visit; a typical session is one full fight plus one retry. |
| **Why repetition 10 remains appealing** | The daily modifier changes how the King fights (faster circles, bigger circles, more HP, double crystals), the weekly board resets, and the other players in the arena are different every fight — the same arena never plays the same twice. |

**Pillars.**

1. One arena, zero waiting — the fight starts with whoever is standing there.
2. Read the floor, not a manual — every danger is telegraphed on the ground, never explained in text.
3. Better together, fine alone — help always helps, and nobody is ever required.

---

## 4. Why Players Come Back

### 4.1 The next-day (D1) sentence

> "A player who enjoyed their first session returns the next day (D1) because Hook 1, the Daily Boss Modifier, changes how the Lava King fights at 00:00 UTC — which they know from the exit board, which previews tomorrow's modifier by name before they leave."

### 4.2 The progression chain

> **Repeatable action → persistent reward → new capability, status, or social role → new decision or challenge**

| Moment | What persists or has been built? | What becomes possible next? | How can another player tell? |
|---|---|---|---|
| **End of first session** | A first win time on the weekly board, the Ash Walker title, and a day-1 stamp | Tomorrow's modifier is already visible; you can join hosted fights as a known name, not a stranger | Title under your name on the board and in the arena |
| **End of first week** | Magma Guard title (3 wins in a week) and a fastest-kill entry that survived the week | Magma Guards can ping target crystals for the whole arena — the caller role | Gold name on the weekly board; your pings render for everyone |
| **Week 3+ — what takes more than two weeks?** | Throne Breaker title — 10 total wins across different weeks, so it cannot be rushed in one sitting | Throne Breakers pick the modifier for the hosted Friday fight | Your name stays on the permanent Throne board at spawn |

You arrive the day after your first win and your name is still on the board, one place below a player you have never met. Today's modifier is Double Circles, so during the core rush you call the left crystal first — yesterday you just followed. Your second win lands two places higher, and the board now shows the name directly above yours: tomorrow's target has a name.

Currency or tradable rewards: N/A — the game has none, by design (see Standing non-goal, Section 9).

### 4.3 Two return hooks

| Selected hook | Exact trigger or timing | What the player anticipates | Reminder channel + no-reminder fallback |
|---|---|---|---|
| **1.** Daily modifier + first-win stamp — the King fights differently every day | Modifier rotates at 00:00 UTC from a fixed published list (Faster Circles, Wide Circles, Heavy King, Double Crystals); the daily stamp is earned by the first win of the day | Tomorrow's named modifier, previewed at the exit, and keeping the stamp streak alive | Community post when a favourite modifier returns; fallback: the exit board and the spawn sign both show tomorrow's modifier without any reminder |
| **2.** Weekly leaderboard reset with a named rival | Board resets Monday 00:00 UTC; it ranks fastest kill and most wins, and always shows the player one place above you by name | Beating a specific named player before the Monday reset wipes the board | Friday hosted fight listed as a Decentraland Event; fallback: a countdown sign at spawn shows time left in the week |

---

## 5. Social by Design

| | |
|---|---|
| **The repeatable social loop** | Player A pings a crystal → Player B smashes it while A watches the circles and calls the danger → together they rush the core inside the same 10-second window → the shared win time lands on the weekly board under both names, which gives them a reason to regroup and beat it. |
| **The disappearance test** | The fight still runs solo with the boss scaled down — but the core window is built for two or more strikers, rescue never happens, and the board becomes a list of strangers' times instead of names you fought beside. Co-op does not break solo play; solo play loses the best moments. |
| **From strangers to a group** | Everyone spawns into the same small arena with the same shared boss bar and wave progress on their HUD. The nearest crystal pulses for everyone, so newcomers converge on the same target without voice or a shared language; one tap on a crystal pings it for the group. |
| **Recognition & continuity** | Names float above avatars and titles (Ash Walker, Magma Guard, Throne Breaker) persist beside them. The weekly board keeps names visible all week, and the Friday host is a regular face — returning players recognize the caller who pinged their first win. |
| **Quiet hours & player counts** | With nobody else online, a solo player enjoys the full fight scaled to one player, chasing a personal best on the weekly board; if no earlier-player traces exist yet, the board shows host-set target times, clearly labelled as targets. Social play becomes viable at 2 players (our social threshold); the ideal group is 4; the target player count is 8 per fight. Tested count: not tested yet — `TBD:` until the V0 multiplayer playtest. A solo arrival meets others by design because there is exactly one arena and one fight: anyone who enters is already in your game. |
| **Drop-in / drop-out** | A late arrival joins the current wave immediately and can smash the crystals already on the floor. If someone leaves mid-fight, boss scaling adjusts at the next wave boundary and the fight continues; a player who stands still or spoils positioning can only endanger themselves and a small share of the team bar — they cannot block anyone else's progress. |
| **Visible play (the bystander test)** | You see players scatter out of blooming red circles, then all rush the glowing gold core at the same moment. |
| **Shareable play (the memorable moment)** | The win frame: the whole team standing on the cracking Lava King as he sinks into the lake, with their kill time stamped over the scene. |
| **Bring-a-friend** | The moment the core opens and you are the only striker, you want one specific friend in the arena — two strikers inside the window is the difference between a phase cleared and a phase missed. |

---

## 6. Mobile-First

**Every core-loop verb on touch.**

| Core-loop verb | How it works with touch controls |
|---|---|
| Smash | Tap the crystal — crystals are large, with a generous tap area; no aiming precision needed |
| Dodge | Left-stick movement only; circles are big, high-contrast, and give 1.5 seconds — walking speed always escapes |
| Strike | Tap the open core repeatedly; the core is the biggest target in the scene |
| Rescue | Walk next to a downed teammate and stand still — a progress ring fills automatically, no button *(V0 scope)* |

**UI plan.**

One shared boss bar pinned to the top of the screen, wave progress and timer directly under it, and a single large context button (START / RETRY) in the right-thumb zone. Everything else is communicated by colour and motion in the world, not by text panels.

**Performance.**

Target: 60fps on recommended desktop hardware and 30fps on a mid-range Android phone (POCO X7 class — the developer's own test device) in the mobile client, at 8 players. The test scene uses only primitive meshes and flat materials — no imported models — so the current build is far below scene limits; it has not been profiled on device yet. `TBD:` device profiling during the V0 playtest.

**Desktop-only dependencies.**

None. The whole loop is tap + move. Voice chat exists in Decentraland but is never required — coordination is by pings and shared HUD state.

---

## 7. World, Look & Story

**Story / world.**

The Lava King woke under the arena, and his crystals are cracking the floor open. The keepers — the players — are the only ones who can put him back to sleep, one fight at a time.

**Visual direction.**

A dark basalt arena over an orange lava lake. Danger is always red-orange and blooming; objectives are cyan crystals that read instantly against the dark floor; the boss core turns white-gold when it opens — the single brightest thing in the scene. Avatars stay the players' own; nothing competes with those three colours. Our signature shot: a ring of cyan crystals around a huge dark boss silhouette, red circles blooming across the floor, every player scattering at once.

---

## 8. Audience & Comparables

**Primary player + arrival context.**

For players who already enjoy short co-op boss fights and raid-style games, arriving with friends or from an Event, looking for a complete fight in about ten minutes on a phone.

**How the first group arrives.**

The first real groups come from hosted fight times listed as Decentraland Events and announced in the Decentraland Discord and on X with a direct World link — a fixed time concentrates the 2+ players a good fight needs, and one tap on the link lands a player inside the arena. Between hosted times, solo players chasing the weekly board keep the arena occupied, so arrivals overlap in the same single fight instead of scattering.

**Deliberately not for.**

Players looking for long solo story progression, building, or collecting items — fights are short, and the game is about the next ten minutes with other people.

### Comparables

| | Comparable A — outside Decentraland: Monster Hunter Now | Comparable B — outside Decentraland: Vampire Survivors |
|---|---|---|
| What we observed works | Very short co-op hunts (about 75 seconds) against one big monster; breaking a specific part rewards the whole group for focusing fire together | Wave escalation that stays readable; a run is complete in 10–30 minutes and the "one more run" pull is strong; danger zones are always visible on the ground |
| What does not fit our audience or context—and why | Hunting requires GPS walking and an app-side matchmaking queue; the monster is not standing in a persistent world you can simply walk into from a link | Solo only — its repetition is personal mastery, with no social reason to return together and no shared moment to screenshot |
| What we will do differently | Our boss stands in a public World: no queue, no matchmaking — you arrive by link and you are already in the fight; the core window replaces part-breaking as the focus-fire moment | We keep the readable ground telegraphs and short runs, but the boss bar, the core rush, and the weekly named-rival board are shared — repetition is a team record, not a private one |

---

## 9. 4 Week Plan (V0 scope)

The proposed V0 scope is the vertical slice below — deliberately smaller than the full game in Sections 1–8. The small test scene needed to apply already exists in this repository (solo core loop); V0 turns it into the synced, persistent, playtestable slice.

| Week | What is playable / done |
|---|---|
| 1 — Prototype definition | Test scene hardened: greybox arena, full solo loop (waves, circles, core, win/lose) cleaned up and playtested solo; the four daily modifiers defined and switchable by hand |
| 2 — Core interaction + first-group test | Multiplayer via the Decentraland authoritative server: shared boss bar, wave state and core windows validated server-side; first 2–4 player group test inside a World |
| 3 — Core systems refinement | Persistence on the server: weekly board, titles, daily modifier rotation at 00:00 UTC; rescue mechanic added; ping a crystal for the group |
| 4 — Playable release, including testing and deployment | Real-player playtest in the World, mobile check on a POCO-class Android device, top issues fixed; V0 slice playtestable end to end by strangers arriving from a link |

**What keeps the experience changing after launch.**

- Without building a new level, variation comes from the daily boss modifier rotation and the weekly board reset.
- If an update is skipped, the modifier rotation and the board reset still create variation on their own schedule.
- Progression creates no power gap: titles are status and social roles only, damage is flat, and a new or returning player can contribute meaningfully within 1 minute through the current wave's crystals.
- One player behaviour that would change what we build next: if solo players clear waves but quit during the boss phase, the core window will scale longer for small groups before anything else is added.

**Not building in V0.**

1. A second arena or a second boss — the first cut to come back in V1 if V0 hits its numbers.
2. Inventory, items, a shop, or custom character models.
3. Standing non-goal: never tradable rewards or gambling mechanics, because abuse and moderation would cost more than the retention they could buy.

**Top risk + fallback.**

Top risk: authoritative-server sync of the shared boss state slipping past Week 2 — it is the only genuinely new technology in the scope, and the boss was deliberately designed stationary (rotation and scale only, no navigation or AI movement) to keep that surface small. Fallback: the V0 slice launches its group tests with the scene's built-in CRDT sync for trusted playtest groups while server validation is hardened, and the design's anti-cheat requirement (server-validated core strikes) is completed before any public board is treated as official.

---

**One last question.**

Section 5 — writing the disappearance test honestly is what forced the solo-scaling decision (boss HP and core windows sized by player count). It changed the design more than any other section.
