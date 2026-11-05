import { Background, Cursor, Footer, notificationOpen } from 'animal-island-ui'
import { useCallback, useEffect, useState } from 'react'
import { canMove, newGame, move, spawnRandomTile, type Board, type Direction } from './game/engine'
import { GameBoard } from './components/GameBoard'
import { EndModal } from './components/EndModal'
import './styles/global.css'

const BEST_KEY = '2048.best-score'

export default function App() {
  const [board, setBoard] = useState<Board>(() => newGame())
  const [score, setScore] = useState(0)
  const [best, setBest] = useState<number>(() => {
    const stored = localStorage.getItem(BEST_KEY)
    return stored ? Number(stored) || 0 : 0
  })
  const [won, setWon] = useState(false)
  const [gameEnded, setGameEnded] = useState(false)
  const [recordSeen, setRecordSeen] = useState(false)
  const [showEnd, setShowEnd] = useState(false)

  const restart = useCallback(() => {
    setBoard(newGame())
    setScore(0)
    setWon(false)
    setGameEnded(false)
    setRecordSeen(false)
    setShowEnd(false)
  }, [])

  const handleMove = useCallback(
    (dir: Direction) => {
      if (gameEnded) return
      const result = move(board, dir)
      if (!result.moved) return

      spawnRandomTile(result.board)
      setBoard(result.board)

      const nextScore = score + result.gained
      setScore(nextScore)
      if (nextScore > best) {
        localStorage.setItem(BEST_KEY, String(nextScore))
        if (!recordSeen && best > 0) {
          notificationOpen({ type: 'success', message: '打破纪录了！', description: `当前收成 ${nextScore}` })
          setRecordSeen(true)
        }
        setBest(nextScore)
      }

      if (result.won && !won) {
        setWon(true)
        notificationOpen({ type: 'success', message: '🌾 大丰收！', description: '田里长出了 2048' })
      }

      // 判负在落子后：堵死棋局的新方块是这里才生成的，引擎看不见它
      if (!canMove(result.board)) {
        setGameEnded(true)
        window.setTimeout(() => setShowEnd(true), 450)
      }
    },
    [board, score, best, gameEnded, won, recordSeen],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Direction> = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
        w: 'up',
        s: 'down',
        a: 'left',
        d: 'right',
      }
      const dir = map[e.key]
      if (dir !== undefined) {
        e.preventDefault()
        handleMove(dir)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleMove])

  return (
    <Cursor>
      <Background type="dots-dark-green" className="page">
        <main className="page-content">
        <GameBoard board={board} />
        </main>
        <EndModal
        open={showEnd}
        won={won}
        score={score}
        best={best}
        isRecord={recordSeen && score > 0 && score >= best}
        onRestart={restart}
        onClose={() => setShowEnd(false)}
      />
      <Footer text="2048 开心农场" className="page-footer" />
      </Background>
    </Cursor>
  )
}
