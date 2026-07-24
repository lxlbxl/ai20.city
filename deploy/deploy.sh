#!/usr/bin/env bash
# deploy/deploy.sh — the entire "Step 2" of docs/DEPLOY-VPS.md as one command.
#
# Run this ON THE VPS, in the git checkout. It builds both regions and syncs
# them to the paths the nginx configs in deploy/nginx/ expect. Re-run this on
# every release; it is safe to run repeatedly (idempotent, --delete keeps each
# target directory an exact mirror of that region's build).
#
# Usage:
#   cd /var/www/ai20-src && bash deploy/deploy.sh
#
# First-time setup (run once): see deploy/README.md.

set -euo pipefail

# --- configuration -----------------------------------------------------------
# Override any of these by exporting the variable before calling the script,
# e.g. `AI20_APEX_DIR=/srv/apex bash deploy/deploy.sh`.
AI20_EU_DIR="${AI20_EU_DIR:-/var/www/ai20-eu}"
AI20_US_DIR="${AI20_US_DIR:-/var/www/ai20-us}"
AI20_APEX_DIR="${AI20_APEX_DIR:-/var/www/ai20-apex}"
SKIP_GIT_PULL="${SKIP_GIT_PULL:-0}"

log() { printf '\n\033[1;36m==>\033[0m %s\n' "$1"; }
fail() { printf '\n\033[1;31merror:\033[0m %s\n' "$1" >&2; exit 1; }

# --- sanity checks -----------------------------------------------------------
[ -f package.json ] || fail "run this from the repo root (package.json not found here)."
command -v node >/dev/null || fail "node not found. Install Node.js before running this."
command -v python3 >/dev/null || fail "python3 not found. The build's location/offer generators need it."

# --- 1. pull latest ----------------------------------------------------------
if [ "$SKIP_GIT_PULL" != "1" ]; then
    log "Pulling latest from origin/main"
    git pull origin main
else
    log "Skipping git pull (SKIP_GIT_PULL=1)"
fi

log "Installing dependencies"
npm ci

for dir in "$AI20_EU_DIR" "$AI20_US_DIR" "$AI20_APEX_DIR"; do
    sudo mkdir -p "$dir"
done

# --- 2. build + sync EU -------------------------------------------------------
log "Building EU (REGION=eu)"
REGION=eu npm run build
log "Syncing EU build -> $AI20_EU_DIR"
sudo rsync -a --delete dist/ "$AI20_EU_DIR"/

# --- 3. build + sync US -------------------------------------------------------
log "Building US (REGION=us)"
REGION=us npm run build
log "Syncing US build -> $AI20_US_DIR"
sudo rsync -a --delete dist/ "$AI20_US_DIR"/

# --- 4. apex chooser -----------------------------------------------------------
# The apex serves ONLY the neutral chooser (self-contained: inline CSS/JS, no
# asset dependencies), so it doesn't need a full regional build.
log "Publishing apex chooser -> $AI20_APEX_DIR"
sudo cp dist/region-select.html "$AI20_APEX_DIR"/index.html

log "Done. dist/ still reflects the US build (built last) - re-run before"
log "inspecting local files if you need the EU output on disk again."
log ""
log "Next: if this is the first deploy, follow deploy/README.md for the"
log "one-time nginx + SSL setup. Otherwise this release is live once nginx"
log "picks up the new files (no reload needed - only the files changed)."
