/**
 * 作物美术资源表：方块数值 → 贴图。
 *
 * 生成图（docs/materials/生成的素材/，蓝/绿幕 JPEG）经 scripts/process-crops.py
 * 抠图后输出到 src/assets/crops/（透明底 PNG，保留下方色块），在此 import 并登记。
 */
import wheat from '../assets/crops/wheat.png'
import carrot from '../assets/crops/carrot.png'
import cabbage from '../assets/crops/cabbage.png'
import pumpkin from '../assets/crops/pumpkin.png'
import corn from '../assets/crops/corn.png'
import eggplant from '../assets/crops/eggplant.png'
import watermelon from '../assets/crops/watermelon.png'
import grape from '../assets/crops/grape.png'
import rice from '../assets/crops/rice.png'
import orchard from '../assets/crops/orchard.png'
import harvest from '../assets/crops/harvest.png'

export const CROP_ASSETS: Record<number, string> = {
  2: wheat,
  4: carrot,
  8: cabbage,
  16: pumpkin,
  32: corn,
  64: eggplant,
  128: watermelon,
  256: grape,
  512: rice,
  1024: orchard,
  2048: harvest,
}
