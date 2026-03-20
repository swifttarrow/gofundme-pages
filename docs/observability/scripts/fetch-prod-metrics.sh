#!/usr/bin/env bash
# Fetch Prometheus exposition format from a running API (/metrics).
#
# Usage:
#   ./docs/observability/scripts/fetch-prod-metrics.sh
#   ./docs/observability/scripts/fetch-prod-metrics.sh http_requests_total
#   METRICS_URL=https://other.example.com ./docs/observability/scripts/fetch-prod-metrics.sh donation
#
# Env:
#   METRICS_URL  Base URL only (no path). Default: https://api-production-4b9f4.up.railway.app

set -euo pipefail

BASE_URL="${METRICS_URL:-https://api-production-4b9f4.up.railway.app}"
FILTER="${1:-}"

# Trim trailing slash from BASE_URL
BASE_URL="${BASE_URL%/}"
URL="${BASE_URL}/metrics"

if [[ -n "$FILTER" ]]; then
  curl -sS "$URL" | grep -E "^${FILTER}" || true
else
  curl -sS "$URL"
fi
