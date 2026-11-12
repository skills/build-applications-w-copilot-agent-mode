#!/bin/bash
# Este script é executado depois que o contêiner é iniciado.

set -euo pipefail

die() {
  echo "ERRO: $@" >&2
  exit 1
}

if [ -n "${CODESPACE_NAME:-}" ]; then
  # Exponha somente as portas configuradas para a aplicação; mantenha o MongoDB privado.
  echo "Configurando a visibilidade das portas da aplicação..."
  gh cs ports visibility 8000:public -c "$CODESPACE_NAME" || die "Falha ao tornar a porta 8000 pública"
  gh cs ports visibility 3000:public -c "$CODESPACE_NAME" || die "Falha ao tornar a porta 3000 pública"
  gh cs ports visibility 27017:private -c "$CODESPACE_NAME" || die "Falha ao manter a porta 27017 privada"
else
  echo "CODESPACE_NAME não está definido; ignorando a configuração de visibilidade das portas do Codespaces."
fi

echo "Preparando o diretório de dados do MongoDB..."
sudo mkdir -p /data/db || die "Falha ao criar o diretório de dados"
sudo chmod 777 /data/db || die "Falha ao ajustar as permissões do diretório de dados"

LOGFILE=/tmp/mongod.log
MAX_START_TRIES=3
READY_CHECK_RETRIES=15
READY_CHECK_INTERVAL=1

is_running() {
  ps aux | grep '[m]ongod' >/dev/null 2>&1
}

mongod_pid() {
  pgrep -x mongod || true
}

start_mongod() {
  if is_running; then
    echo "mongod já está em execução"
    return 0
  fi
  > "$LOGFILE"
  echo "Iniciando mongod (dbpath=/data/db, log=$LOGFILE)..."
  mongod --dbpath /data/db --fork --logpath "$LOGFILE"
}

ready_check() {
  if grep -q "Waiting for connections" "$LOGFILE" 2>/dev/null; then
    return 0
  fi
  if command -v nc >/dev/null 2>&1; then
    nc -z 127.0.0.1 27017 2>/dev/null && return 0
  fi
  if command -v mongosh >/dev/null 2>&1; then
    mongosh --quiet --eval 'db.runCommand({ping:1})' >/dev/null 2>&1 && return 0 || true
  fi
  return 1
}

wait_for_ready() {
  for ((i=1; i<=READY_CHECK_RETRIES; i++)); do
    if ready_check; then
      echo "mongod está pronto (após $i verificações)."
      return 0
    fi
    sleep "$READY_CHECK_INTERVAL"
  done
  return 1
}

echo "Iniciando o MongoDB com novas tentativas..."
for ((attempt=1; attempt<=MAX_START_TRIES; attempt++)); do
  echo "Tentativa de inicialização $attempt/$MAX_START_TRIES"
  if start_mongod && wait_for_ready; then
    tail -20 "$LOGFILE" || true
    echo "MongoDB iniciado com sucesso."
    break
  fi

  if (( attempt == MAX_START_TRIES )); then
    tail -40 "$LOGFILE" || true
    die "O MongoDB não iniciou após $MAX_START_TRIES tentativas"
  fi

  echo "Limpando antes da próxima tentativa..."
  cleaned_up=false
  while IFS= read -r pid; do
    if [ -n "$pid" ]; then
      kill "$pid" || true
      cleaned_up=true
    fi
  done < <(mongod_pid)
  if [ "$cleaned_up" = true ]; then
    sleep 2
  fi
done

echo "post_start.sh concluído com sucesso."
exit 0
