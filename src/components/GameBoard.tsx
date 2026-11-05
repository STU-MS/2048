import { Card } from 'animal-island-ui'
import type { Board as BoardType } from '../game/engine'

interface GameBoardProps {
  board: BoardType
}

/** 方块数值 → Card 13 色板 + 波点 pattern（全部取自组件库，无手搓色阶） */
const TILE_STYLE: Record<number, { name: string; color: Parameters<typeof Card>[0]['color']; pattern: Parameters<typeof Card>[0]['pattern'] }> = {
  2: { name: '麦粒', color: 'default', pattern: 'default' },
  4: { name: '萝卜', color: 'warm-peach-pink', pattern: 'warm-peach-pink' },
  8: { name: '白菜', color: 'app-yellow', pattern: 'app-yellow' },
  16: { name: '南瓜', color: 'lime-green', pattern: 'lime-green' },
  32: { name: '玉米', color: 'app-orange', pattern: 'app-orange' },
  64: { name: '茄子', color: 'brown', pattern: 'brown' },
  128: { name: '西瓜', color: 'app-teal', pattern: 'app-teal' },
  256: { name: '葡萄', color: 'purple', pattern: 'purple' },
  512: { name: '稻穗', color: 'yellow-green', pattern: 'yellow-green' },
  1024: { name: '果园', color: 'app-blue', pattern: 'app-blue' },
  2048: { name: '大丰收', color: 'app-red', pattern: 'app-red' },
}

function tileInfo(value: number) {
  return TILE_STYLE[value] ?? TILE_STYLE[2048]
}

/**
 * 土地按格子划分：每格 = 一整块隆起的土格子，格子之间的缝隙露出
 * 外框 brown Card（田埂）。作物卡片直接种在土块上。
 */
export function GameBoard({ board }: GameBoardProps) {
  return (
    <Card color="brown" className="board-frame">
      <div className="board-grid">
        {board.flatMap((row, r) =>
          row.map((tile, c) => {
            const key = `${r}-${c}`
            if (tile === null) return <div key={key} className="cell-soil" />
            const info = tileInfo(tile.value)
            return (
              <div key={key} className="cell-soil">
                <Card
                  color={info.color}
                  pattern={info.pattern}
                  className={['tile', tile.merged ? 'tile-merged' : '', tile.spawned ? 'tile-spawned' : '']
                    .filter(Boolean)
                    .join(' ')}
                >
                  <span className="tile-value">{tile.value}</span>
                  <span className="tile-name">{info.name}</span>
                </Card>
              </div>
            )
          }),
        )}
      </div>
    </Card>
  )
}
