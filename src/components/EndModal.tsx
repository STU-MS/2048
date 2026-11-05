import { Modal, Button } from 'animal-island-ui'

interface EndModalProps {
  open: boolean
  won: boolean
  score: number
  best: number
  isRecord: boolean
  onRestart: () => void
  onClose: () => void
}

/** 结算弹窗：胜利 / 结束共用 */
export function EndModal({ open, won, score, best, isRecord, onRestart, onClose }: EndModalProps) {
  return (
    <Modal
      open={open}
      title={won ? '大丰收！' : '这季到头了'}
      footer={
        <>
          <Button onClick={onClose}>再看看田</Button>
          <Button type="primary" onClick={onRestart}>
            重新开垦
          </Button>
        </>
      }
      onClose={onClose}
    >
      <div className="end-modal-body">
        <p>{won ? '田里长出了 2048！' : '没有可以合并的方块了，下个节气再来。'}</p>
        <p className="end-modal-score">
          本局收成 <strong>{score}</strong> · 历史最高 <strong>{best}</strong>
        </p>
        {isRecord && <p className="end-modal-record">✨ 新纪录！</p>}
      </div>
    </Modal>
  )
}
