/**
 * 2048 游戏引擎（4×4）
 *
 * 纯函数、零依赖、与 UI 无关：输入棋盘与方向，输出新棋盘与结果，
 * 方便后续从实现反推 UML（Board / Tile / Game 等类直接对应这里的类型）。
 */

export const SIZE = 4
export const WIN_VALUE = 2048

export type Direction = 'up' | 'down' | 'left' | 'right'

/** 单个方块 */
export interface Tile {
  id: number
  value: number
  /** 本次移动中由两块合并而成（用于合并动画） */
  merged: boolean
  /** 本次移动中新生成（用于出生动画） */
  spawned: boolean
}

export type Board = (Tile | null)[][]

/** 一次移动的完整结果 */
export interface MoveResult {
  board: Board
  /** 本次合并获得的分数 */
  gained: number
  moved: boolean
  /** 棋盘上出现 2048 */
  won: boolean
}

let nextId = 1

function createTile(value: number, spawned = false): Tile {
  return { id: nextId++, value, merged: false, spawned }
}

export function emptyBoard(): Board {
  return Array.from({ length: SIZE }, () => Array<Tile | null>(SIZE).fill(null))
}

function emptyCells(board: Board): [number, number][] {
  const cells: [number, number][] = []
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === null) cells.push([r, c])
    }
  }
  return cells
}

/** 在随机空位生成一个方块：90% 为 2，10% 为 4 */
export function spawnRandomTile(board: Board): void {
  const cells = emptyCells(board)
  if (cells.length === 0) return
  const [r, c] = cells[Math.floor(Math.random() * cells.length)]
  const value = Math.random() < 0.9 ? 2 : 4
  board[r][c] = createTile(value, true)
}

/** 开局：空棋盘 + 两个初始方块 */
export function newGame(): Board {
  const board = emptyBoard()
  spawnRandomTile(board)
  spawnRandomTile(board)
  return board
}

/**
 * 把一条线（已统一转换为从左往右）滑动并合并：
 * 相邻同值合并为双倍，每个方块每步只参与一次合并。
 */
function slideLine(cells: (Tile | null)[]): { line: (Tile | null)[]; gained: number; moved: boolean } {
  const tiles = cells.filter((t): t is Tile => t !== null)
  const result: Tile[] = []
  let gained = 0
  let i = 0
  while (i < tiles.length) {
    if (i + 1 < tiles.length && tiles[i].value === tiles[i + 1].value) {
      const mergedTile: Tile = { id: tiles[i].id, value: tiles[i].value * 2, merged: true, spawned: false }
      result.push(mergedTile)
      gained += mergedTile.value
      i += 2
    } else {
      result.push({ ...tiles[i], merged: false, spawned: false })
      i += 1
    }
  }
  const line: (Tile | null)[] = [...result, ...Array<Tile | null>(SIZE - result.length).fill(null)]
  let moved = false
  for (let k = 0; k < SIZE; k++) {
    if (cells[k]?.id !== line[k]?.id) moved = true
  }
  return { line, gained, moved }
}

/** 执行一次移动；moved 为 false 时返回原棋盘（不产生新方块） */
export function move(board: Board, dir: Direction): MoveResult {
  const next: Board = Array.from({ length: SIZE }, () => Array<Tile | null>(SIZE).fill(null))
  let gained = 0
  let moved = false

  for (let k = 0; k < SIZE; k++) {
    let line: (Tile | null)[]
    if (dir === 'left') line = board[k].slice()
    else if (dir === 'right') line = board[k].slice().reverse()
    else if (dir === 'up') line = board.map((row) => row[k])
    else line = board.map((row) => row[k]).reverse()

    const res = slideLine(line)
    gained += res.gained
    if (res.moved) moved = true

    for (let j = 0; j < SIZE; j++) {
      if (dir === 'left') next[k][j] = res.line[j]
      else if (dir === 'right') next[k][j] = res.line[SIZE - 1 - j]
      else if (dir === 'up') next[j][k] = res.line[j]
      else next[SIZE - 1 - j][k] = res.line[j]
    }
  }

  if (!moved) return { board, gained: 0, moved: false, won: false }

  let won = false
  for (const row of next) {
    for (const t of row) {
      if (t !== null && t.value >= WIN_VALUE) won = true
    }
  }
  return { board: next, gained, moved: true, won }
}

/** 是否还有任意可行移动 */
export function canMove(board: Board): boolean {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const t = board[r][c]
      if (t === null) return true
      if (c + 1 < SIZE && board[r][c + 1]?.value === t.value) return true
      if (r + 1 < SIZE && board[r + 1][c]?.value === t.value) return true
    }
  }
  return false
}
