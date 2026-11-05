#!/bin/bash
# 用法: gen-image.sh <名称> <提示词> [输出目录]
set -euo pipefail

NAME="${1:?用法: gen-image.sh <名称> <提示词> [输出目录]}"
PROMPT="${2:?缺少提示词}"
OUTDIR="${3:-.}"
mkdir -p "$OUTDIR"
MODEL="${GEN_IMAGE_MODEL:-grok-imagine-image}"

PAYLOAD=$(python3 -c "import json,sys; print(json.dumps({'model': sys.argv[1], 'prompt': sys.argv[2]}))" "$MODEL" "$PROMPT")
RESP=$(curl -s -X POST http://127.0.0.1:3425/v1/images/generations \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD")

echo "$RESP" | python3 -c "
import base64, json, sys
d = json.load(sys.stdin)
if 'data' not in d:
    sys.stderr.write(str(d)[:500]); sys.exit(1)
open(sys.argv[1] + '.png', 'wb').write(base64.b64decode(d['data'][0]['b64_json']))
" "$OUTDIR/$NAME"

echo "saved: $OUTDIR/$NAME.png"
