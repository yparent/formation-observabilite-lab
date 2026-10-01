#!/bin/sh
# Démarre Grafana en ajoutant fix-headers.js à sa page (explication dans ce fichier).
#
# Les fichiers web de l'image ne sont pas modifiables par l'utilisateur grafana : on construit
# dans /tmp une copie légère (liens symboliques vers l'original, seul le dossier views/ est
# copié), on y glisse le script, et Grafana sert ce dossier (GF_SERVER_STATIC_ROOT_PATH).
set -e

SRC=/usr/share/grafana/public
DST=/tmp/grafana-public

rm -rf "$DST"
mkdir -p "$DST"
for f in "$SRC"/*; do ln -s "$f" "$DST/"; done
rm "$DST/views"
cp -r "$SRC/views" "$DST/views"
cp "$(dirname "$0")/fix-headers.js" "$DST/codespaces-fix-headers.js"

sed -i 's#<head>#<head><script nonce="[[.Nonce]]" src="[[.AppSubUrl]]/public/codespaces-fix-headers.js"></script>#' "$DST/views/index.html"
if grep -q codespaces-fix-headers "$DST/views/index.html"; then
  export GF_SERVER_STATIC_ROOT_PATH="$DST"
else
  echo "entrypoint.sh : <head> introuvable dans index.html, Grafana démarre sans le correctif Codespaces" >&2
fi

exec /run.sh "$@"
