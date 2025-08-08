#!/bin/bash
# This script is run after the container starts up.

set -euo pipefail

die() {
  echo "ERROR: $@" >&2
  exit 1
}

# Ensure CODESPACE_NAME is set
: "${CODESPACE_NAME:?CODESPACE_NAME environment variable not set. This script should be run in a GitHub Codespace environment.}"

# Port visibility setup
echo "Setting port visibility..."
gh cs ports visibility 8000:public -c "$CODESPACE_NAME" || die "Failed to set 8000 public"
gh cs ports visibility 3000:public -c "$CODESPACE_NAME" || die "Failed to set 3000 public"

echo "Preparing MongoDB data dir..."
sudo mkdir -p /data/db || die "mkdir failed"
sudo chmod 777 /data/db || die "chmod failed"

LOGFILE=/tmp/mongod.log
MAX_START_TRIES=3          # How many times to attempt (re)starting mongod
READY_CHECK_RETRIES=15     # How many readiness checks per start attempt
READY_CHECK_INTERVAL=1     # Seconds between readiness checks
is_running() {
  pgrep -x mongod >/dev/null 2>&1
}

start_mongod() {
  if is_running; then
    echo "mongod already running"
    return 0
  fi
  # Clean old log (keep last one for inspection)
  > "$LOGFILE"
  echo "Launching mongod (dbpath=/data/db, log=$LOGFILE)..."
  mongod --dbpath /data/db --fork --logpath "$LOGFILE"
}

ready_check() {
  # Success if log shows ready OR port is open
  if grep -q "Waiting for connections" "$LOGFILE" 2>/dev/null; then
    return 0
  fi
  if command -v nc >/dev/null 2>&1; then
    if nc -z 127.0.0.1 27017 2>/dev/null; then
      return 0
    fi
  fi
  # If mongo/mongosh client exists, try a ping (quietly)
  if command -v mongosh >/dev/null 2>&1; then
    mongosh --quiet --eval 'db.runCommand({ping:1})' >/dev/null 2>&1 && return 0 || true
  elif command -v mongo >/dev/null 2>&1; then
    mongo --quiet --eval 'db.runCommand({ping:1})' >/dev/null 2>&1 && return 0 || true
  fi
  return 1
}

wait_for_ready() {
  for ((i=1; i<=READY_CHECK_RETRIES; i++)); do
    if ready_check; then
      echo "mongod is ready (after $i checks)."
      return 0
    fi
    sleep "$READY_CHECK_INTERVAL"
  done
  return 1
}

echo "Starting MongoDB with retries..."
for ((attempt=1; attempt<=MAX_START_TRIES; attempt++)); do
  echo "Start attempt $attempt/$MAX_START_TRIES"
  if start_mongod; then
    if wait_for_ready; then
      tail -20 "$LOGFILE" || true
      echo "MongoDB started successfully."
      break
    else
      echo "Readiness check failed for attempt $attempt."
    fi
  else
    echo "mongod launch command failed on attempt $attempt."
  fi

  if (( attempt == MAX_START_TRIES )); then
    tail -40 "$LOGFILE" || true
    die "MongoDB failed to start after $MAX_START_TRIES attempts"
  fi

  echo "Cleaning up before next attempt..."
  if is_running; then
    pkill -x mongod || true
    sleep 2
  fi
done

echo "post_start.sh completed successfully."
exit 0