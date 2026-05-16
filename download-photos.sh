#!/usr/bin/env bash
# Télécharge 6 photos karaté depuis Unsplash et les place dans assets/images/
# Usage: bash download-photos.sh
# Requiert: curl, jq  (brew install jq / apt install jq)

set -euo pipefail

KEY="${UNSPLASH_ACCESS_KEY:-$(grep UNSPLASH_ACCESS_KEY .env | cut -d= -f2)}"
DEST="assets/images"
mkdir -p "$DEST"

declare -A QUERIES=(
  ["karate-entrainement-dojo"]="karate training dojo"
  ["karate-kata-competition"]="karate kata competition"
  ["karate-kumite-combat"]="karate kumite fight"
  ["karate-enfants-cours"]="children karate class"
  ["karate-ceinture-noire"]="karate black belt"
  ["karate-dojo-tatami"]="martial arts dojo tatami"
)

for NAME in "${!QUERIES[@]}"; do
  QUERY="${QUERIES[$NAME]}"
  echo "→ Recherche : $QUERY"
  URL=$(curl -sf "https://api.unsplash.com/search/photos?query=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))" "$QUERY")&orientation=landscape&per_page=1&client_id=$KEY" \
    | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['results'][0]['urls']['raw']+'&w=1600&fit=crop&auto=format&q=80')")
  echo "  ↓ Téléchargement → $DEST/$NAME.jpg"
  curl -sL "$URL" -o "$DEST/$NAME.jpg"
  echo "  ✓ $NAME.jpg"
done

echo ""
echo "✅ 6 photos téléchargées dans $DEST/"
