#!/usr/bin/env bash
# 把 models/drafts/*.mmd 渲染成 models/exports/*.png
# 依赖：node + @mermaid-js/mermaid-cli（脚本会自动安装到 tools/ 下）
set -euo pipefail

cd "$(dirname "$0")/.."
ROOT="$(pwd)"
DRAFTS="$ROOT/models/drafts"
EXPORTS="$ROOT/models/exports"
MMDC="$ROOT/tools/node_modules/.bin/mmdc"

if [ ! -x "$MMDC" ]; then
  echo "==> 安装 mermaid-cli（首次运行，需要网络）"
  (cd "$ROOT/tools" && npm init -y >/dev/null 2>&1 && npm i --silent @mermaid-js/mermaid-cli)
fi

# 优先复用系统已安装的 Chrome/Chromium，避免重复下载 Chromium
if [ -z "${PUPPETEER_EXECUTABLE_PATH:-}" ]; then
  for c in /opt/google/chrome/chrome "$(command -v google-chrome 2>/dev/null || true)" "$(command -v chromium 2>/dev/null || true)"; do
    if [ -n "$c" ] && [ -x "$c" ]; then export PUPPETEER_EXECUTABLE_PATH="$c"; break; fi
  done
fi

mkdir -p "$EXPORTS"
shopt -s nullglob
for f in "$DRAFTS"/*.mmd; do
  name="$(basename "$f" .mmd)"
  echo "==> $name"
  "$MMDC" -i "$f" -o "$EXPORTS/$name.png" -s 2 -b white
done

echo "==> 完成，输出目录：models/exports"
ls -1 "$EXPORTS"
