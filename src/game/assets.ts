/**
 * 作物美术资源表：方块数值 → 图片地址。
 *
 * 占位阶段：CROP_ASSETS 为空表，GameBoard 走文字 + 色卡占位。
 * 素材就位后：图片放进 src/assets/crops/，在下方 import 并登记到
 * CROP_ASSETS，渲染处按此表切换为贴图。其余文件零改动。
 */

export const CROP_ASSETS: Record<number, string> = {
  // 2: cropWheat, 4: cropCarrot, 8: cropCabbage, ... 2048: cropHarvest
}
