// Shared mutable game state for LAVA THRONE — Boss Rush (test scene).
// Single-session local version: multiplayer sync + persistence are the V0 scope (see design/gdd.md).

export type Phase = 'idle' | 'waves' | 'boss' | 'won' | 'lost'

export const S = {
  phase: 'idle' as Phase,
  wave: 0,
  waveTotal: 3,
  crystalsLeft: 0,
  waveTimeLeft: 0,
  bossHp: 100,
  teamHp: 100,
  fightTime: 0,
  coreOpen: false,
  coreTimeLeft: 0,
  nextCoreAt: 75,
  practiceSmashed: 0,
  message: 'Tap the pulsing crystal, then press START',
  result: ''
}

export function fmtTime(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}
