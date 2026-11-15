import {
  engine,
  Transform,
  MeshRenderer,
  MeshCollider,
  Material,
  TextShape,
  Billboard,
  BillboardMode,
  PointerEvents,
  pointerEventsSystem,
  InputAction,
  Entity
} from '@dcl/sdk/ecs'
import { Color3, Color4, Vector3 } from '@dcl/sdk/math'
import { S } from './state'

// ---------------------------------------------------------------------------
// LAVA THRONE — Boss Rush · test scene (single-session local version)
// Core loop: Smash crystals -> Dodge lava circles -> Strike the boss core.
// Multiplayer sync (authoritative server) and persistence are the V0 scope.
// ---------------------------------------------------------------------------

const CENTER = { x: 8, z: 8 }
const CRYSTAL_POOL = 8
const CIRCLE_POOL = 6
const WAVE_CRYSTALS = [5, 6, 7]
const WAVE_TIMES = [45, 40, 35]
const CIRCLE_RADIUS = 2.2
const CIRCLE_TELEGRAPH = 1.5

type Circle = {
  entity: Entity
  active: boolean
  x: number
  z: number
  timer: number
  erupted: boolean
}

let bossBody: Entity
let bossCore: Entity
let startStone: Entity
let practiceCrystal: Entity
let practiceTimer = -1
const crystals: Entity[] = []
const crystalActive: boolean[] = []
const circles: Circle[] = []
let circleSpawnTimer = 0
let elapsed = 0

// --- helpers ---------------------------------------------------------------

function mat(entity: Entity, albedo: Color4, emissive?: Color3, emissiveIntensity = 0) {
  Material.setPbrMaterial(entity, {
    albedoColor: albedo,
    emissiveColor: emissive,
    emissiveIntensity,
    roughness: 0.85
  })
}

function setHoverText(entity: Entity, hoverText: string) {
  const pe = PointerEvents.getMutableOrNull(entity)
  if (!pe) return
  for (const entry of pe.pointerEvents) {
    if (entry.eventInfo) entry.eventInfo.hoverText = hoverText
  }
}

function playerPos(): { x: number; z: number } | null {
  if (!Transform.has(engine.PlayerEntity)) return null
  const p = Transform.get(engine.PlayerEntity).position
  return { x: p.x, z: p.z }
}

function hideEntity(entity: Entity) {
  Transform.createOrReplace(entity, {
    position: Vector3.create(0, -10, 0),
    scale: Vector3.create(0.01, 0.01, 0.01)
  })
}

// --- scene building --------------------------------------------------------

export function buildArena() {
  // Floor — dark basalt slab
  const floor = engine.addEntity()
  Transform.create(floor, { position: Vector3.create(8, -0.1, 8), scale: Vector3.create(16, 0.2, 16) })
  MeshRenderer.setBox(floor)
  MeshCollider.setBox(floor)
  mat(floor, Color4.create(0.09, 0.08, 0.1, 1))

  // Lava glow strips around the arena edge
  const edgePositions: Array<[number, number, number, number]> = [
    [8, 0.06, 0.4, 0],
    [8, 0.06, 15.6, 0],
    [0.4, 0.06, 8, 1],
    [15.6, 0.06, 8, 1]
  ]
  for (const [x, y, z, rot] of edgePositions) {
    const strip = engine.addEntity()
    Transform.create(strip, {
      position: Vector3.create(x, y, z),
      scale: rot === 0 ? Vector3.create(16, 0.12, 0.5) : Vector3.create(0.5, 0.12, 16)
    })
    MeshRenderer.setBox(strip)
    mat(strip, Color4.create(1, 0.35, 0.05, 1), Color3.create(1, 0.3, 0.02), 2.2)
  }

  // Boss body — a huge dark sphere that only breathes (no navigation, by design)
  bossBody = engine.addEntity()
  Transform.create(bossBody, { position: Vector3.create(CENTER.x, 3.1, CENTER.z), scale: Vector3.create(4.4, 5.2, 4.4) })
  MeshRenderer.setSphere(bossBody)
  MeshCollider.setSphere(bossBody)
  mat(bossBody, Color4.create(0.16, 0.05, 0.05, 1), Color3.create(0.5, 0.08, 0.02), 0.7)
  pointerEventsSystem.onPointerDown(
    { entity: bossBody, opts: { button: InputAction.IA_POINTER, hoverText: 'Chip the King (core hits harder)', maxDistance: 14 } },
    () => chipBoss()
  )

  // Boss core — the strike target, on the side facing spawn
  bossCore = engine.addEntity()
  Transform.create(bossCore, { position: Vector3.create(CENTER.x, 2.4, CENTER.z + 2.35), scale: Vector3.create(1.1, 1.1, 1.1) })
  MeshRenderer.setSphere(bossCore)
  MeshCollider.setSphere(bossCore)
  mat(bossCore, Color4.create(0.25, 0.22, 0.2, 1))
  pointerEventsSystem.onPointerDown(
    { entity: bossCore, opts: { button: InputAction.IA_POINTER, hoverText: 'Core is closed', maxDistance: 14 } },
    () => strikeCore()
  )

  // Title sign above the boss
  const title = engine.addEntity()
  Transform.create(title, { position: Vector3.create(CENTER.x, 7.6, CENTER.z) })
  TextShape.create(title, { text: 'LAVA THRONE', fontSize: 6, textColor: Color4.create(1, 0.6, 0.15, 1) })
  Billboard.create(title, { billboardMode: BillboardMode.BM_Y })

  // START stone near spawn
  startStone = engine.addEntity()
  Transform.create(startStone, { position: Vector3.create(11.5, 0.9, 12.5), scale: Vector3.create(1.4, 1.8, 0.7) })
  MeshRenderer.setBox(startStone)
  MeshCollider.setBox(startStone)
  mat(startStone, Color4.create(0.2, 0.5, 0.25, 1), Color3.create(0.1, 0.6, 0.15), 0.8)
  pointerEventsSystem.onPointerDown(
    { entity: startStone, opts: { button: InputAction.IA_POINTER, hoverText: 'START the fight', maxDistance: 10 } },
    () => startFight()
  )
  const startSign = engine.addEntity()
  Transform.create(startSign, { position: Vector3.create(11.5, 2.6, 12.5) })
  TextShape.create(startSign, { text: 'START', fontSize: 4, textColor: Color4.create(0.5, 1, 0.55, 1) })
  Billboard.create(startSign, { billboardMode: BillboardMode.BM_Y })

  // How-to-play sign at spawn (3 bullets, same words as the GDD)
  const howto = engine.addEntity()
  Transform.create(howto, { position: Vector3.create(4.2, 2.2, 13.8) })
  TextShape.create(howto, {
    text: 'HOW TO PLAY\nSmash crystals to charge the fight\nDodge red circles before they erupt\nStrike the core when it opens',
    fontSize: 2,
    textColor: Color4.create(0.9, 0.95, 1, 1)
  })
  Billboard.create(howto, { billboardMode: BillboardMode.BM_Y })

  // Practice crystal — teaches the main verb before the fight starts
  practiceCrystal = engine.addEntity()
  placePracticeCrystal()
  MeshRenderer.setBox(practiceCrystal)
  MeshCollider.setBox(practiceCrystal)
  mat(practiceCrystal, Color4.create(0.1, 0.85, 0.95, 1), Color3.create(0.05, 0.7, 0.8), 1.6)
  pointerEventsSystem.onPointerDown(
    { entity: practiceCrystal, opts: { button: InputAction.IA_POINTER, hoverText: 'Smash!', maxDistance: 10 } },
    () => smashPractice()
  )

  // Crystal pool for waves
  for (let i = 0; i < CRYSTAL_POOL; i++) {
    const c = engine.addEntity()
    hideEntity(c)
    MeshRenderer.setBox(c)
    MeshCollider.setBox(c)
    mat(c, Color4.create(0.1, 0.85, 0.95, 1), Color3.create(0.05, 0.7, 0.8), 1.6)
    const idx = i
    pointerEventsSystem.onPointerDown(
      { entity: c, opts: { button: InputAction.IA_POINTER, hoverText: 'Smash!', maxDistance: 12 } },
      () => smashCrystal(idx)
    )
    crystals.push(c)
    crystalActive.push(false)
  }

  // Lava circle pool
  for (let i = 0; i < CIRCLE_POOL; i++) {
    const e = engine.addEntity()
    hideEntity(e)
    MeshRenderer.setCylinder(e, 1, 1)
    mat(e, Color4.create(1, 0.15, 0.05, 1), Color3.create(1, 0.1, 0.02), 1.8)
    circles.push({ entity: e, active: false, x: 0, z: 0, timer: 0, erupted: false })
  }
}

function placePracticeCrystal() {
  Transform.createOrReplace(practiceCrystal, {
    position: Vector3.create(6.5, 0.8, 12.8),
    scale: Vector3.create(0.9, 1.4, 0.9),
    rotation: { x: 0, y: 0.6, z: 0, w: 0.8 }
  })
}

// --- gameplay --------------------------------------------------------------

export function startFight() {
  if (S.phase === 'waves' || S.phase === 'boss') return
  S.phase = 'waves'
  S.wave = 0
  S.bossHp = 100
  S.teamHp = 100
  S.fightTime = 0
  S.coreOpen = false
  S.nextCoreAt = 75
  S.result = ''
  setCoreVisual(false)
  setHoverText(startStone, 'Fight running...')
  spawnWave(0)
}

function spawnWave(waveIdx: number) {
  S.wave = waveIdx + 1
  S.waveTimeLeft = WAVE_TIMES[waveIdx]
  const count = WAVE_CRYSTALS[waveIdx]
  S.crystalsLeft = count
  // ring positions, shuffled
  const spots: Array<[number, number]> = []
  for (let i = 0; i < CRYSTAL_POOL; i++) {
    const angle = (i / CRYSTAL_POOL) * Math.PI * 2 + Math.random() * 0.5
    const r = 3.4 + Math.random() * 3.2
    spots.push([CENTER.x + Math.cos(angle) * r, CENTER.z + Math.sin(angle) * r])
  }
  for (let i = 0; i < CRYSTAL_POOL; i++) {
    if (i < count) {
      crystalActive[i] = true
      Transform.createOrReplace(crystals[i], {
        position: Vector3.create(spots[i][0], 0.8, spots[i][1]),
        scale: Vector3.create(0.9, 1.4, 0.9),
        rotation: { x: 0, y: Math.random(), z: 0, w: 0.8 }
      })
    } else {
      crystalActive[i] = false
      hideEntity(crystals[i])
    }
  }
  S.message = `Wave ${S.wave}: smash ${count} crystals!`
}

function smashPractice() {
  if (S.phase !== 'idle' && S.phase !== 'won' && S.phase !== 'lost') return
  S.practiceSmashed++
  S.message = 'Yes — like that! Now press START'
  hideEntity(practiceCrystal)
  practiceTimer = 2.5
}

function smashCrystal(idx: number) {
  if (S.phase !== 'waves' || !crystalActive[idx]) return
  crystalActive[idx] = false
  hideEntity(crystals[idx])
  S.crystalsLeft--
  if (S.crystalsLeft <= 0) {
    if (S.wave >= S.waveTotal) {
      S.phase = 'boss'
      S.message = 'The Lava King wakes! Chip him — strike the core when it opens!'
      circleSpawnTimer = 2
    } else {
      S.message = `Wave ${S.wave} cleared!`
      spawnWave(S.wave) // S.wave is 1-based; next index = current value
    }
  } else {
    S.message = `Wave ${S.wave}: ${S.crystalsLeft} crystals left`
  }
}

function chipBoss() {
  if (S.phase !== 'boss' || S.coreOpen) return
  damageBoss(0.6)
}

function strikeCore() {
  if (S.phase !== 'boss') return
  if (!S.coreOpen) {
    S.message = 'The core is closed — chip the King until it opens'
    return
  }
  damageBoss(4)
}

function damageBoss(amount: number) {
  S.bossHp = Math.max(0, S.bossHp - amount)
  if (S.bossHp <= 0) {
    endFight(true)
    return
  }
  if (!S.coreOpen && S.bossHp <= S.nextCoreAt) {
    S.coreOpen = true
    S.coreTimeLeft = 10
    S.message = 'CORE OPEN — strike it now!'
    setCoreVisual(true)
    setHoverText(bossCore, 'STRIKE THE CORE!')
  }
}

function setCoreVisual(open: boolean) {
  if (open) {
    mat(bossCore, Color4.create(1, 0.85, 0.25, 1), Color3.create(1, 0.7, 0.1), 2.5)
  } else {
    mat(bossCore, Color4.create(0.25, 0.22, 0.2, 1))
    setHoverText(bossCore, 'Core is closed')
  }
}

function damageTeam(amount: number, reason: string) {
  if (S.phase !== 'waves' && S.phase !== 'boss') return
  S.teamHp = Math.max(0, S.teamHp - amount)
  S.message = reason
  if (S.teamHp <= 0) endFight(false)
}

function endFight(won: boolean) {
  S.phase = won ? 'won' : 'lost'
  S.coreOpen = false
  setCoreVisual(false)
  for (let i = 0; i < CRYSTAL_POOL; i++) {
    crystalActive[i] = false
    hideEntity(crystals[i])
  }
  for (const c of circles) {
    c.active = false
    hideEntity(c.entity)
  }
  const t = Math.floor(S.fightTime)
  S.result = won ? `KING DOWN in ${Math.floor(t / 60)}:${(t % 60).toString().padStart(2, '0')}!` : 'The team bar is empty...'
  S.message = won ? 'You win! Press START to fight again' : 'Press START to try again'
  setHoverText(startStone, won ? 'Fight again' : 'TRY AGAIN')
}

// --- lava circles ------------------------------------------------------------

function spawnCircle() {
  const c = circles.find((k) => !k.active)
  if (!c) return
  const p = playerPos()
  // bias circles toward the player's area so dodging matters
  const cx = p ? p.x + (Math.random() * 6 - 3) : CENTER.x + (Math.random() * 8 - 4)
  const cz = p ? p.z + (Math.random() * 6 - 3) : CENTER.z + (Math.random() * 8 - 4)
  c.x = Math.min(14.5, Math.max(1.5, cx))
  c.z = Math.min(14.5, Math.max(1.5, cz))
  c.active = true
  c.erupted = false
  c.timer = CIRCLE_TELEGRAPH
  Transform.createOrReplace(c.entity, {
    position: Vector3.create(c.x, 0.08, c.z),
    scale: Vector3.create(0.4, 0.08, 0.4)
  })
}

function updateCircles(dt: number) {
  for (const c of circles) {
    if (!c.active) continue
    c.timer -= dt
    if (!c.erupted) {
      const grow = 0.4 + (1 - Math.max(0, c.timer) / CIRCLE_TELEGRAPH) * (CIRCLE_RADIUS - 0.4)
      Transform.createOrReplace(c.entity, {
        position: Vector3.create(c.x, 0.08, c.z),
        scale: Vector3.create(grow, 0.08, grow)
      })
      if (c.timer <= 0) {
        c.erupted = true
        c.timer = 0.45
        const p = playerPos()
        if (p) {
          const d = Math.hypot(p.x - c.x, p.z - c.z)
          if (d < CIRCLE_RADIUS) damageTeam(12, 'Caught by an eruption! Team bar -12')
        }
        Transform.createOrReplace(c.entity, {
          position: Vector3.create(c.x, 0.3, c.z),
          scale: Vector3.create(CIRCLE_RADIUS, 0.6, CIRCLE_RADIUS)
        })
      }
    } else if (c.timer <= 0) {
      c.active = false
      hideEntity(c.entity)
    }
  }
}

// --- main system -------------------------------------------------------------

export function gameSystem(dt: number) {
  elapsed += dt

  // boss breathing
  if (bossBody) {
    const b = 1 + Math.sin(elapsed * 1.4) * 0.03
    Transform.createOrReplace(bossBody, {
      position: Vector3.create(CENTER.x, 3.1, CENTER.z),
      scale: Vector3.create(4.4 * b, 5.2 * b, 4.4 * b)
    })
  }

  // practice crystal respawn
  if (practiceTimer > 0) {
    practiceTimer -= dt
    if (practiceTimer <= 0) placePracticeCrystal()
  }

  if (S.phase !== 'waves' && S.phase !== 'boss') return
  S.fightTime += dt

  if (S.phase === 'waves') {
    S.waveTimeLeft -= dt
    if (S.waveTimeLeft <= 0) {
      damageTeam(10, 'Wave too slow! Team bar -10')
      if (S.phase === 'waves') spawnWave(S.wave - 1)
    }
    // occasional circles from wave 2 on, to teach dodging
    if (S.wave >= 2) {
      circleSpawnTimer -= dt
      if (circleSpawnTimer <= 0) {
        spawnCircle()
        circleSpawnTimer = 6
      }
    }
  }

  if (S.phase === 'boss') {
    circleSpawnTimer -= dt
    if (circleSpawnTimer <= 0) {
      spawnCircle()
      circleSpawnTimer = 3.5
    }
    if (S.coreOpen) {
      S.coreTimeLeft -= dt
      // core pulse
      const s = 1.1 + Math.sin(elapsed * 10) * 0.12
      Transform.createOrReplace(bossCore, {
        position: Vector3.create(CENTER.x, 2.4, CENTER.z + 2.35),
        scale: Vector3.create(s, s, s)
      })
      if (S.coreTimeLeft <= 0) {
        S.coreOpen = false
        S.nextCoreAt -= 25
        S.message = 'Core closed. Chip the King until it opens again'
        setCoreVisual(false)
        Transform.createOrReplace(bossCore, {
          position: Vector3.create(CENTER.x, 2.4, CENTER.z + 2.35),
          scale: Vector3.create(1.1, 1.1, 1.1)
        })
      }
    }
  }

  updateCircles(dt)
}
