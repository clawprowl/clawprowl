#!/usr/bin/env bash

set -euo pipefail

PORT=5180
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "=== ClawProwl 测试启动脚本 ==="

kill_old() {
  local pids
  pids=$(lsof -ti:"$PORT" 2>/dev/null || true)
  if [[ -n "$pids" ]]; then
    echo "[cleanup] 终止占用端口 $PORT 的进程: $pids"
    echo "$pids" | xargs kill -9 2>/dev/null || true
    sleep 1
  fi
}

kill_old

echo "[start] 启动 Vite dev server (port=$PORT) ..."
cd "$PROJECT_DIR"
exec npx vite --port "$PORT" --strictPort
