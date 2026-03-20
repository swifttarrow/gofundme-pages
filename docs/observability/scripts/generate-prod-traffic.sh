#!/usr/bin/env bash
# Repeatedly request your production *web* app so SSR / API rewrites generate traffic.
# Default base: https://gosupportme.up.railway.app
#
# Next.js rewrites /api/* to your API origin, so hits like /api/health increment API metrics
# (http_requests_total, etc.) while page routes drive web + page_view telemetry where applicable.
#
# Usage:
#   ./docs/observability/scripts/generate-prod-traffic.sh
#   INTERVAL=1 COUNT=60 ./docs/observability/scripts/generate-prod-traffic.sh
#   PROD_WEB_URL=https://gosupportme.up.railway.app PATHS="/,/api/health" ./docs/observability/scripts/generate-prod-traffic.sh
#
# Env:
#   PROD_WEB_URL  Base URL, no trailing path (default: https://gosupportme.up.railway.app)
#   INTERVAL      Seconds between requests (default: 2)
#   COUNT         Stop after this many requests; 0 = until Ctrl+C (default: 0)
#   PATHS         Comma-separated paths to rotate (default: home, fundraisers, sample fundraiser, community, API health)

set -euo pipefail

PROD_WEB_URL="${PROD_WEB_URL:-https://gosupportme.up.railway.app}"
INTERVAL="${INTERVAL:-2}"
COUNT="${COUNT:-0}"

DEFAULT_PATHS="/,/fundraisers,/fundraiser/b1b2c3d4-0001-0001-0001-000000000001,/community/bay-area-community-support,/api/health"
PATHS="${PATHS:-$DEFAULT_PATHS}"

PROD_WEB_URL="${PROD_WEB_URL%/}"

IFS=',' read -r -a PATH_ARRAY <<< "$PATHS"
n=${#PATH_ARRAY[@]}
if [[ "$n" -eq 0 ]]; then
  echo "PATHS is empty" >&2
  exit 1
fi

i=0
req=0
while true; do
  path="${PATH_ARRAY[$((i % n))]}"
  # normalize path: ensure leading slash
  [[ "$path" == /* ]] || path="/$path"
  url="${PROD_WEB_URL}${path}"
  code=$(curl -sS -o /dev/null -w "%{http_code}" "$url" || echo "err")
  req=$((req + 1))
  printf '%s  %s  #%s\n' "$code" "$url" "$req"
  i=$((i + 1))

  if [[ "$COUNT" -gt 0 && "$req" -ge "$COUNT" ]]; then
    break
  fi
  sleep "$INTERVAL"
done
