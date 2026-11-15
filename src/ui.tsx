import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { S, fmtTime } from './state'
import { startFight } from './game'

export function setupUi() {
  ReactEcsRenderer.setUiRenderer(uiComponent)
}

const BAR_WIDTH = 360

function barColor(hp: number): Color4 {
  if (hp > 50) return Color4.create(0.25, 0.85, 0.3, 1)
  if (hp > 25) return Color4.create(0.95, 0.75, 0.2, 1)
  return Color4.create(0.9, 0.25, 0.15, 1)
}

const uiComponent = () => {
  const inFight = S.phase === 'waves' || S.phase === 'boss'
  const showBars = S.phase !== 'idle'
  return (
    <UiEntity
      uiTransform={{
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: { top: 12 }
      }}
    >
      {/* Title + status message */}
      <Label
        value="LAVA THRONE — Boss Rush"
        fontSize={22}
        color={Color4.create(1, 0.75, 0.3, 1)}
        uiTransform={{ width: 500, height: 30, margin: { bottom: 2 } }}
        textAlign="top-center"
      />
      <Label
        value={S.message}
        fontSize={17}
        color={Color4.White()}
        uiTransform={{ width: 560, height: 26 }}
        textAlign="top-center"
      />

      {/* Bars */}
      {showBars && (
        <UiEntity
          uiTransform={{ width: BAR_WIDTH + 20, height: 64, flexDirection: 'column', margin: { top: 4 } }}
          uiBackground={{ color: Color4.create(0, 0, 0, 0.45) }}
        >
          <Label
            value={S.phase === 'boss' || S.phase === 'won' ? `Lava King ${Math.ceil(S.bossHp)}%` : `Team ${Math.ceil(S.teamHp)}%`}
            fontSize={13}
            color={Color4.White()}
            uiTransform={{ width: BAR_WIDTH, height: 16, margin: { left: 10, top: 4 } }}
          />
          <UiEntity
            uiTransform={{
              width: Math.max(2, (S.phase === 'boss' || S.phase === 'won' ? S.bossHp : S.teamHp) * (BAR_WIDTH / 100)),
              height: 14,
              margin: { left: 10, top: 2 }
            }}
            uiBackground={{ color: barColor(S.phase === 'boss' || S.phase === 'won' ? S.bossHp : S.teamHp) }}
          />
          <Label
            value={
              S.phase === 'waves'
                ? `Wave ${S.wave}/${S.waveTotal} · Crystals left: ${S.crystalsLeft} · Wave timer: ${Math.ceil(S.waveTimeLeft)}s · Team ${Math.ceil(S.teamHp)}%`
                : S.phase === 'boss'
                  ? `${S.coreOpen ? `CORE OPEN: ${Math.ceil(S.coreTimeLeft)}s — STRIKE IT!` : 'Core closed — chip the King'} · Team ${Math.ceil(S.teamHp)}%`
                  : S.result
            }
            fontSize={13}
            color={Color4.create(0.85, 0.95, 1, 1)}
            uiTransform={{ width: BAR_WIDTH, height: 16, margin: { left: 10, top: 3 } }}
          />
        </UiEntity>
      )}

      {/* Fight timer */}
      {inFight && (
        <Label
          value={`Fight time ${fmtTime(S.fightTime)}`}
          fontSize={14}
          color={Color4.create(0.8, 0.8, 0.8, 1)}
          uiTransform={{ width: 200, height: 20, margin: { top: 4 } }}
          textAlign="top-center"
        />
      )}

      {/* Result banner */}
      {(S.phase === 'won' || S.phase === 'lost') && (
        <Label
          value={S.result}
          fontSize={26}
          color={S.phase === 'won' ? Color4.create(0.4, 1, 0.45, 1) : Color4.create(1, 0.4, 0.3, 1)}
          uiTransform={{ width: 560, height: 36, margin: { top: 10 } }}
          textAlign="top-center"
        />
      )}

      {/* Start / retry button */}
      {!inFight && (
        <Button
          uiTransform={{ width: 170, height: 48, margin: { top: 12 } }}
          value={S.phase === 'idle' ? 'START FIGHT' : 'FIGHT AGAIN'}
          variant="primary"
          fontSize={17}
          onMouseDown={() => startFight()}
        />
      )}
    </UiEntity>
  )
}
