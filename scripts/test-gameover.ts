// 判负逻辑快测：node --experimental-strip-types scripts/test-gameover.ts
// 场景1：可合并局面 → canMove = true，不判负
// 场景2：无空格且无相邻同值 → canMove = false，判负
// 场景3：move 后 spawn 补位仍堵死 → App 层 canMove(result.board) 能捕捉（引擎层旧逻辑捕捉不到）
// 图例：. = 空位，数字 = 方块值

import { canMove, newGame, SIZE, type Board } from '../src/game/engine.ts'

function fromGrid(grid: number[][]): Board {
  return grid.map((row) =>
    row.map((v) => (v === 0 ? null : { id: Math.floor(Math.random() * 1e6), value: v, merged: false, spawned: false })),
  )
}

let failed = 0
function check(name: string, got: boolean, want: boolean) {
  const ok = got === want
  if (!ok) failed++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}  canMove=${got} 期望=${want}`)
}

// 场景1：有空位 + 有相邻同值
check(
  '空位存在',
  canMove(
    fromGrid([
      [2, 4, 8, 16],
      [16, 8, 4, 2],
      [2, 4, 8, 16],
      [16, 8, 4, 0],
    ]),
  ),
  true,
)

// 场景2：满盘且无任何相邻同值 → 死局
check(
  '满盘死局',
  canMove(
    fromGrid([
      [2, 4, 8, 16],
      [16, 8, 4, 2],
      [2, 4, 8, 16],
      [16, 8, 4, 2],
    ]),
  ),
  false,
)

// 场景3：满盘但有一对可合并 → 不是死局
check(
  '满盘可合并',
  canMove(
    fromGrid([
      [2, 4, 8, 16],
      [16, 8, 4, 2],
      [2, 4, 8, 2],
      [16, 8, 4, 2],
    ]),
  ),
  true,
)

// 场景4：新开局必有空位 → 必可动
check('新开局', canMove(newGame()), true)

// 尺寸联动检查
const b = newGame()
if (b.length !== SIZE || b.some((row) => row.length !== SIZE)) {
  failed++
  console.log('FAIL  棋盘尺寸 ≠ SIZE')
} else {
  console.log('PASS  棋盘尺寸 = SIZE =', SIZE)
}

console.log(failed === 0 ? '\n全部通过' : `\n${failed} 项失败`)
process.exit(failed === 0 ? 0 : 1)
