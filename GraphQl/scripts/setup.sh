#!/usr/bin/env bash
set -euo pipefail

# Scaffold full-stack demo: Laravel (REST + GraphQL) and React + Tailwind

ROOT_DIR=$(pwd)
SERVER_DIR="$ROOT_DIR/server"
CLIENT_DIR="$ROOT_DIR/client"

color() { printf "\033[%sm%s\033[0m\n" "$1" "$2"; }
info() { color 36 "[info] $1"; }
ok() { color 32 "[ok] $1"; }
warn() { color 33 "[warn] $1"; }
err() { color 31 "[err] $1"; }

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    err "Missing required command: $1"
    exit 1
  fi
}

main() {
  info "Checking prerequisites"
  require_cmd php
  require_cmd composer
  require_cmd node
  require_cmd npm

  bash "$(dirname "$0")/setup_server.sh" "$SERVER_DIR"
  bash "$(dirname "$0")/setup_client.sh" "$CLIENT_DIR"

  ok "All set!"
  cat <<EOT

Next steps:
1) Start backend:
   cd server && php artisan serve

2) In a new terminal, start frontend:
   cd client && npm run dev

Open http://localhost:5173
EOT
}

main "$@"

