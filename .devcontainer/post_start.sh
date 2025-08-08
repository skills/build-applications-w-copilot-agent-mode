#!/bin/bash
# This script is run after the container startup.

set -euo pipefail

die() {
  echo "ERROR: $*" >&2
  exit 1
}

# Ensure CODESPACE_NAME is set
: "${CODESPACE_NAME:?CODESPACE_NAME not set}"

echo "Setting port visibility..."
gh cs ports visibility 8000:public -c "$CODESPACE_NAME" || die "Failed to set 8000 public"
gh cs ports visibility 3000:public -c "$CODESPACE_NAME" || die "Failed to set 3000 public"

echo "Preparing MongoDB data dir..."
sudo mkdir -p /data/db || die "mkdir failed"
sudo chmod 777 /data/db || die "chmod failed"

echo "Starting mongod..."
if mongod --dbpath /data/db --fork --logpath /tmp/mongod.log; then
  sleep 5
  ps aux | grep '[m]ongod' || die "mongod not running"
  tail -20 /tmp/mongod.log || die "Cannot read mongod log"
else
  die "mongod failed to start"
fi

echo "post_start.sh completed successfully."