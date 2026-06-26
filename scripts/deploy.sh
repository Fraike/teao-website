#!/usr/bin/env bash
#
# TEAO Website Deployment Script
# Usage:
#   ./scripts/deploy.sh          # Code-only deploy (no database sync)
#   ./scripts/deploy.sh --db     # Full deploy with database sync
#   ./scripts/deploy.sh --help   # Show help
#
set -euo pipefail

# ── Config ──────────────────────────────────────────────
SERVER="ubuntu@107.150.106.22"
PROJECT_DIR="/home/ubuntu/teao-website"
LOCAL_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DB_PATH="data/teao.db"
PM2_APP="teao-website"

# ── Parse Args ──────────────────────────────────────────
SYNC_DB=false
DRY_RUN=false

for arg in "$@"; do
  case "$arg" in
    --db)   SYNC_DB=true ;;
    --dry)  DRY_RUN=true ;;
    --help)
      echo "TEAO Website Deployment Script"
      echo ""
      echo "Usage:"
      echo "  ./scripts/deploy.sh           Code-only deploy"
      echo "  ./scripts/deploy.sh --db      Deploy code + database"
      echo "  ./scripts/deploy.sh --dry     Dry run (no actual deploy)"
      exit 0
      ;;
  esac
done

# ── Helpers ─────────────────────────────────────────────
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

step()  { echo -e "${GREEN}[$(date +%H:%M:%S)]${NC} $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# ── Dry Run Check ───────────────────────────────────────
if $DRY_RUN; then
  echo "=== DRY RUN MODE ==="
  echo ""
  echo "Would execute:"
  echo "  1. Type check locally"
  echo "  2. Git push to origin/master"
  if $SYNC_DB; then
    echo "  3. WAL checkpoint locally"
    echo "  4. Stop PM2 on server"
    echo "  5. Delete server DB + WAL/SHM"
    echo "  6. SCP database to server"
    echo "  7. Git pull + build + restart on server"
  else
    echo "  3. Git pull + build + restart on server"
  fi
  exit 0
fi

# ── Step 1: Verify Local Build ──────────────────────────
step "Type checking..."
cd "$LOCAL_DIR"
npx tsc --noEmit || error "Type check failed. Fix errors before deploying."

# ── Step 2: Git Commit & Push ───────────────────────────
step "Checking git status..."
if ! git diff --quiet || ! git diff --cached --quiet; then
  warn "Uncommitted changes detected!"
  echo "  Modified files:"
  git status --short
  echo ""
  read -rp "  Enter commit message (empty to skip): " COMMIT_MSG
  if [ -n "$COMMIT_MSG" ]; then
    git add -A
    git commit -m "$COMMIT_MSG"
  else
    warn "Skipping commit — deploying uncommitted changes."
  fi
fi

step "Pushing to GitHub..."
git push origin master || error "Git push failed."

# ── Step 3: Database Sync (if --db) ─────────────────────
if $SYNC_DB; then
  step "Running WAL checkpoint locally..."
  cd "$LOCAL_DIR"
  node -e "
    const { createClient } = require('@libsql/client');
    const db = createClient({ url: 'file:$LOCAL_DIR/$DB_PATH' });
    db.execute('PRAGMA wal_checkpoint(TRUNCATE)').then(r => {
      console.log('WAL checkpoint done. WAL truncated.');
      process.exit(0);
    }).catch(e => {
      console.error('Checkpoint failed:', e.message);
      process.exit(1);
    });
  " || error "Local WAL checkpoint failed."

  step "Stopping PM2 on server..."
  ssh "$SERVER" "cd $PROJECT_DIR && pm2 stop $PM2_APP" || error "PM2 stop failed."

  step "Cleaning server database files..."
  ssh "$SERVER" "cd $PROJECT_DIR && rm -f $DB_PATH ${DB_PATH}-wal ${DB_PATH}-shm" || error "Server DB cleanup failed."

  step "Transferring database to server..."
  scp "$LOCAL_DIR/$DB_PATH" "$SERVER:$PROJECT_DIR/$DB_PATH" || error "SCP database failed."

  echo -e "  ${GREEN}Database synced successfully.${NC}"
else
  step "Skipping database sync (use --db to include)."
fi

# ── Step 4: Deploy Code on Server ────────────────────────
step "Deploying code on server..."
ssh "$SERVER" "cd $PROJECT_DIR && git pull origin master && npm run build && pm2 restart $PM2_APP" || error "Server deployment failed."

# ── Step 5: Verify ───────────────────────────────────────
step "Verifying deployment..."
sleep 2
ssh "$SERVER" "pm2 status" || warn "Could not verify PM2 status."

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Deployment complete!${NC}"
if $SYNC_DB; then
  echo -e "  Mode: Code + Database"
else
  echo -e "  Mode: Code only"
fi
echo -e "  Server: https://teao-damper.com"
echo -e "${GREEN}========================================${NC}"
