#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

case "${1:-}" in
  --dry|--help)
    cat <<'HELP'
TEAO production release checks

  bash scripts/deploy.sh --check-config <full commit SHA>
      Verify the exact checkout and production settings before building.
  bash scripts/deploy.sh --check <full commit SHA>
      Also verify the production build and incremental migration records.

Follow PROJECT.md to prepare the release directory, apply the separately
approved migrations, switch PM2 processes, and roll back if needed.
HELP
    exit 0
    ;;
  --check-config|--check) ;;
  *)
    echo "Choose --check-config or --check with the approved commit SHA. See --help." >&2
    exit 2
    ;;
esac

if [[ $# -ne 2 || "$(git rev-parse HEAD)" != "$2" ]]; then
  echo "The release checkout must match the full approved commit SHA." >&2
  exit 1
fi
if [[ -n "$(git status --porcelain --untracked-files=no)" ]]; then
  echo "The release checkout has tracked changes." >&2
  exit 1
fi

node scripts/check-website-release.cjs
if [[ "$1" == "--check" ]]; then
  if [[ ! -s .next/BUILD_ID ]]; then
    echo "Production build missing. Run npm run build in this release directory." >&2
    exit 1
  fi
  node scripts/migrate-website-operations.cjs --db data/teao.db --require-current
fi
