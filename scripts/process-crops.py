# /// script
# requires-python = ">=3.10"
# dependencies = ["pillow>=10", "numpy>=1.26", "scipy>=1.11"]
# ///
"""作物素材抠图：蓝/绿幕 → 透明底 PNG。

输入：docs/materials/生成的素材/*.png（实际为 JPEG，1024x1024，蓝幕或绿幕）
输出：src/assets/crops/<英文名>.png（RGBA，保留下方色块，仅抠除幕色背景）

原理：从图像边缘泛洪填充所有"接近幕色"的像素（保护主体内部同色区域），
边缘 1px 羽化 + 去溢色（despill），保留下方纯色块不受影响。
"""

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

SRC = Path(__file__).resolve().parent.parent / "docs/materials/生成的素材"
DST = Path(__file__).resolve().parent.parent / "src/assets/crops"

# 中文名 → 输出英文名（与 assets.ts 登记一致）
CROPS = {
    "麦粒": "wheat",
    "萝卜": "carrot",
    "白菜": "cabbage",
    "南瓜": "pumpkin",
    "玉米": "corn",
    "茄子": "eggplant",
    "西瓜": "watermelon",
    "葡萄": "grape",
    "稻穗": "rice",
    "果园": "orchard",
    "大丰收": "harvest",
}

BLUE = np.array([0, 0, 255], dtype=np.float32)
GREEN = np.array([0, 255, 0], dtype=np.float32)

TOLERANCE = 105.0  # 欧氏距离阈值：判定为幕色的最大颜色距离
FEATHER = 1.0  # 边缘羽化半径（像素）


def detect_key(rgb: np.ndarray) -> tuple[np.ndarray, str]:
    """采样四角实际背景色作为键色（生成图的幕色会偏色，不能假设纯蓝/纯绿）。"""
    corners = np.stack(
        [rgb[2:8, 2:8].reshape(-1, 3), rgb[2:8, -8:-2].reshape(-1, 3),
         rgb[-8:-2, 2:8].reshape(-1, 3), rgb[-8:-2, -8:-2].reshape(-1, 3)]
    ).reshape(-1, 3)
    key = np.median(corners, axis=0)
    kind = "blue" if np.linalg.norm(key - BLUE) < np.linalg.norm(key - GREEN) else "green"
    return key, kind


def despill(rgb: np.ndarray, alpha: np.ndarray, kind: str) -> np.ndarray:
    """边缘去溢色：幕色通道渗到主体边缘时压回邻近通道。"""
    out = rgb.astype(np.float32).copy()
    edge = (alpha > 0) & (alpha < 1)  # 半透明边缘像素
    r, g, b = out[..., 0], out[..., 1], out[..., 2]
    if kind == "green":
        spill = edge & (g > r + 25) & (g > b + 25)
        m = np.maximum(r, b)
        out[..., 1] = np.where(spill, (g + m) / 2, g)
    else:  # blue
        spill = edge & (b > r + 25) & (b > g + 25)
        m = np.maximum(r, g)
        out[..., 2] = np.where(spill, (b + m) / 2, b)
    return np.clip(out, 0, 255)


def process(path: Path, out: Path) -> None:
    img = Image.open(path).convert("RGB")
    rgb = np.asarray(img, dtype=np.float32)
    key, kind = detect_key(rgb)

    dist = np.linalg.norm(rgb - key, axis=-1)
    bg_like = dist < TOLERANCE

    # 从边缘泛洪：只清除与边框连通的幕色区域（保护主体内部的相似色）
    mask = np.zeros(bg_like.shape, dtype=bool)
    mask[0, :] = bg_like[0, :]
    mask[-1, :] = bg_like[-1, :]
    mask[:, 0] = bg_like[:, 0]
    mask[:, -1] = bg_like[:, -1]
    filled = ndimage.binary_propagation(mask, mask=bg_like)

    # 幕色袋：被主体/色块轮廓围住、与外部不连通的幕色区（如茄子两果之间），
    # 泛洪保护不到；dist<40 的像素必为纯幕色（主体描边距幕色均 >110），直接清除
    deep = dist < 40
    clear = filled | deep

    alpha = np.where(clear, 0.0, 255.0)
    # 羽化：幕色距离越近越透明，边缘平滑过渡
    soft = np.clip((dist - TOLERANCE * 0.55) / (TOLERANCE * 0.45), 0, 1)
    alpha = np.minimum(alpha, np.where(clear, soft * 255.0, 255.0))
    if FEATHER > 0:
        alpha = ndimage.gaussian_filter(alpha, sigma=FEATHER / 2)

    rgb2 = despill(rgb, alpha / 255.0, kind)
    rgba = np.dstack([rgb2, alpha]).astype(np.uint8)

    out_img = Image.fromarray(rgba, "RGBA")
    # 方块实际显示尺寸只有一百多像素，降到 512 足够清晰，体积减省约 75%
    out_img = out_img.resize((512, 512), Image.LANCZOS)
    out_img.save(out)
    removed = float((alpha < 128).mean())
    print(f"{path.name} -> {out.name}  [{kind}幕]  背景占比 {removed:.0%}")


def main() -> None:
    DST.mkdir(parents=True, exist_ok=True)
    for zh, en in CROPS.items():
        src = SRC / f"{zh}.png"
        if not src.exists():
            print(f"!! 缺失：{src}")
            continue
        process(src, DST / f"{en}.png")


if __name__ == "__main__":
    main()
