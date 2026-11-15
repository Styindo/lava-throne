import { engine } from '@dcl/sdk/ecs'
import { buildArena, gameSystem } from './game'
import { setupUi } from './ui'

export function main() {
  buildArena()
  engine.addSystem(gameSystem)
  setupUi()
}
