# Grafana Cloud setup (GoSupportMe metrics)

This guide gets **production** metrics from  
`https://api-production-4b9f4.up.railway.app/metrics` **into Grafana Cloud** so you can use **Explore** and import [grafana-dashboard.json](./grafana-dashboard.json).

Official references:

- [Send Prometheus metrics to Grafana Cloud](https://grafana.com/docs/grafana-cloud/send-data/metrics/metrics-prometheus/) (`remote_write`)
- [Metrics Endpoint integration](https://grafana.com/docs/grafana-cloud/monitor-infrastructure/integrations/integration-reference/integration-metrics-endpoint/) (hosted scrape — see caveat below)

---

## 1. Create a Grafana Cloud stack

1. Sign up at [grafana.com](https://grafana.com/) and create a **Grafana Cloud** stack (free tier is fine to start).
2. Open the **[Grafana Cloud Portal](https://grafana.com/docs/grafana-cloud/security-and-account-management/cloud-portal/)** for your stack.

---

## 2. Get `remote_write` URL, user id, and token

Grafana Cloud **ingests** metrics via Prometheus **`remote_write`** (push from a Prometheus you run), not by you opening Prometheus in the browser on their side.

1. In the portal, open your stack → find the **Prometheus** (or **Mimir / Grafana Cloud Metrics**) card → **Details**.
2. Copy:
   - **Remote write endpoint** — URL ending in `/api/prom/push`
   - **Username** — numeric **instance / user id** (not your email)
3. Create a **Cloud Access Policy** token whose policy includes the **`metrics:write`** scope (that is what Prometheus `remote_write` uses as the password). If a scope isn’t listed by default, use **Add scope** and pick metrics write / ingest.  
   Store the token somewhere safe; you won’t see it again. (Use a dedicated policy with only `metrics:write` for least privilege.)

---

## 3. Run Prometheus with scrape + `remote_write`

Use [prometheus-grafana-cloud.example.yml](./prometheus-grafana-cloud.example.yml):

1. Copy it to a file you can edit (e.g. `prometheus.local.yml` — **do not commit secrets**).
2. Replace:
   - `REMOTE_WRITE_URL`
   - `METRICS_INSTANCE_ID`
3. Put the token in a file readable only by you, e.g. `./grafana-cloud-token.txt`, and set `password_file` in the YAML to that path (see example file).

Example (from repo root):

```bash
cp docs/observability/prometheus-grafana-cloud.example.yml ./prometheus.local.yml
# Edit prometheus.local.yml: URL, username, password_file path
echo 'YOUR_TOKEN' > ./grafana-cloud-token.txt
chmod 600 ./grafana-cloud-token.txt ./prometheus.local.yml

docker run -d --name prometheus-gc \
  -p 9090:9090 \
  -v "$PWD/prometheus.local.yml:/etc/prometheus/prometheus.yml:ro" \
  -v "$PWD/grafana-cloud-token.txt:/run/secrets/grafana-cloud-token:ro" \
  prom/prometheus:latest \
  --config.file=/etc/prometheus/prometheus.yml
```

Wait **1–2 minutes**, then in **Grafana Cloud → Explore**, choose your **Prometheus** datasource and run:

```promql
http_requests_total
```

You should see series with labels from your Railway scrape job.

**Note:** `localhost:9090` is still **your** Prometheus (optional debugging). **Grafana Cloud** is where hosted Grafana reads data after `remote_write`.

---

## 4. Import the MVP dashboard

1. Grafana Cloud → **Dashboards → New → Import**.
2. Upload [grafana-dashboard.json](./grafana-dashboard.json).
3. On import, **choose your Grafana Cloud Prometheus** datasource for every panel (replace the placeholder UID `prometheus` if Grafana asks).

If panels are empty:

- Confirm Explore returns data for `http_requests_total`.
- Check time range (try **Last 6 hours**).
- Free tier **retention** is limited; old data disappears per [Grafana Cloud pricing](https://grafana.com/products/cloud/pricing/).

---

## 5. (Optional) Hosted scrape — Metrics Endpoint integration

Grafana’s **[Metrics Endpoint](https://grafana.com/docs/grafana-cloud/monitor-infrastructure/integrations/integration-reference/integration-metrics-endpoint/)** integration scrapes a **public** URL **from Grafana Cloud’s network**.

As of Grafana’s docs, scrape jobs **require** URL authentication (Basic or Bearer). A fully **public** `/metrics` with no auth may **not** be accepted. If you later protect `/metrics` (reverse proxy or app-level basic auth), you can try:

**Connections → Metrics Endpoint** → add scrape job → URL  
`https://api-production-4b9f4.up.railway.app/metrics` + auth.

Until then, **`remote_write` + self-hosted Prometheus** (section 3) is the reliable path.

---

## 6. Security checklist

- **Never commit** `grafana-cloud-token.txt` or a YAML file containing the raw token (`.gitignore` them if you keep them in the repo directory).
- **Railway `/metrics`**: public scrape surfaces operational detail; consider restricting by network or auth when you harden prod.

## 7. Troubleshooting

**`remote_write`: `is a directory` for `password_file` / mount path**  
Docker Desktop often creates an **empty directory** if you `docker run -v .../grafana-cloud-token.txt:...` when that host path **does not exist** yet (same for `prometheus.local.yml`). Prometheus then sees a directory instead of a token file.

Fix: `rm -rf grafana-cloud-token.txt` (only if it’s a directory), then create a **real file** with your token (no extra spaces/newlines if possible):

```bash
printf '%s\n' 'YOUR_ACCESS_POLICY_TOKEN' > grafana-cloud-token.txt
chmod 600 grafana-cloud-token.txt
```

Recreate the container after both `prometheus.local.yml` and `grafana-cloud-token.txt` are normal files.
