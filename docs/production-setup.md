# Production Setup — NikooLife

A complete, step-by-step guide to deploying NikooLife on a fresh Debian VPS from scratch. Written from the actual deployment experience, including every failure encountered and how it was resolved.

---

## Architecture

```
Internet → Cloudflare (CDN + DDoS + SSL) → nginx (443/80)
                                                 │
                                    Docker bridge network (internal)
                                    ├── storefront:8000  (Next.js 15)
                                    ├── backend:9000     (Medusa v2)
                                    ├── postgres:5432
                                    └── redis:6379
```

- nginx is the only container with public ports. All other services communicate over an internal Docker bridge and are never exposed to the internet.
- Cloudflare acts as the CDN, WAF, and SSL terminator. The origin server uses a self-signed cert with Cloudflare in **Full** mode.
- nginx enforces that only Cloudflare edge IPs can connect — direct server IP access is silently dropped.

---

## Prerequisites

- Fresh Debian 12 VPS with SSH root access
- A domain managed in Cloudflare (free plan works)
- The server IP address

---

## Phase 1 — Server preparation

### 1.1 Update the system

```bash
apt update && apt upgrade -y
apt install -y git curl wget openssl ufw
```

### 1.2 Install Docker

The official convenience script works on Debian:

```bash
curl -fsSL https://get.docker.com | sh
```

Verify:

```bash
docker --version        # Docker 24.x or newer
docker compose version  # Docker Compose v2.x (the plugin, not docker-compose v1)
```

> **Important:** Use `docker compose` (space, the v2 plugin), not `docker-compose` (hyphen, the v1 standalone). The compose file in this repo uses v2 syntax.

### 1.3 Clone the repo

```bash
cd ~
git clone https://github.com/sheehab984/nikoolifebd.git nikoolifebd
cd nikoolifebd
```

---

## Phase 2 — Cloudflare DNS

In the Cloudflare dashboard → your domain → DNS:

| Type | Name | Content       | Proxied |
|------|------|---------------|---------|
| A    | @    | YOUR.SERVER.IP | ✓ (orange) |
| A    | www  | YOUR.SERVER.IP | ✓ (orange) |
| A    | api  | YOUR.SERVER.IP | ✓ (orange) |

All three must be **proxied** (orange cloud). If they are grey (DNS only), direct IP access is not hidden and the Cloudflare-only firewall in nginx won't work correctly.

Then go to **SSL/TLS → Overview** and set the mode to **Full** (not Flexible, not Full Strict).

- **Flexible** = Cloudflare connects to your origin over plain HTTP. nginx is configured for HTTPS only — this breaks.
- **Full** = Cloudflare connects over HTTPS and accepts self-signed certs. This is what we use.
- **Full (Strict)** = requires a CA-signed cert on the origin. Works if you use a Cloudflare Origin Certificate instead of self-signed.

---

## Phase 3 — SSL certificate

nginx needs a certificate even though Cloudflare terminates the public TLS. We use a self-signed cert — Cloudflare in Full mode accepts it.

```bash
mkdir -p ~/nikoolifebd/nginx/certs

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ~/nikoolifebd/nginx/certs/origin.key \
  -out  ~/nikoolifebd/nginx/certs/origin.crt \
  -subj "/CN=nikoolife.co.uk/O=Nikoo Life/C=GB"
```

Permissions (nginx reads these as root inside the container):

```bash
chmod 644 ~/nikoolifebd/nginx/certs/origin.crt
chmod 600 ~/nikoolifebd/nginx/certs/origin.key
```

> **Optional — Cloudflare Origin Certificate (recommended for production):**
> Cloudflare → SSL/TLS → Origin Server → Create Certificate → select wildcard `*.nikoolife.co.uk`. Download the cert and key, save them as `origin.crt` and `origin.key`. This cert is valid for 15 years and lets you use **Full (Strict)** SSL mode.

---

## Phase 4 — Environment file

Create `.env` in the repo root. Never commit this file.

```bash
cd ~/nikoolifebd
```

Generate the four secrets first:

```bash
openssl rand -hex 32  # POSTGRES_PASSWORD
openssl rand -hex 32  # JWT_SECRET
openssl rand -hex 32  # COOKIE_SECRET
openssl rand -hex 32  # REVALIDATE_SECRET
```

Then create the file (replace each `<...>` with a generated value):

```bash
cat > .env << 'EOF'
# ── Postgres ──────────────────────────────────────────────────────────────
POSTGRES_USER=medusa
POSTGRES_PASSWORD=<generated>
POSTGRES_DB=nikoolife

# ── Medusa secrets ─────────────────────────────────────────────────────────
JWT_SECRET=<generated>
COOKIE_SECRET=<generated>
REVALIDATE_SECRET=<generated>

# ── Database URL ───────────────────────────────────────────────────────────
# Must include ?sslmode=disable — Docker Postgres has no SSL configured.
# The pg client tries SSL by default and crashes without this flag.
DATABASE_URL=postgres://medusa:<POSTGRES_PASSWORD>@postgres:5432/nikoolife?sslmode=disable

# ── Storefront public vars ─────────────────────────────────────────────────
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.nikoolife.co.uk
NEXT_PUBLIC_BASE_URL=https://nikoolife.co.uk
NEXT_PUBLIC_DEFAULT_REGION=gb

# ── Publishable API key ────────────────────────────────────────────────────
# Leave blank for now — fill in after Phase 5 once the backend is healthy.
# This key is intentionally public (like Stripe's pk_live_). It scopes store
# requests to the correct sales channel; it cannot do any admin operations.
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=

# ── Stripe ─────────────────────────────────────────────────────────────────
STRIPE_API_KEY=sk_live_REPLACE_ME
NEXT_PUBLIC_STRIPE_KEY=pk_live_REPLACE_ME

# ── Resend (transactional email — optional) ────────────────────────────────
RESEND_API_KEY=re_REPLACE_ME
RESEND_FROM_EMAIL=hello@nikoolife.co.uk
EOF
```

---

## Phase 5 — Start backend, run migrations, get API key

### Why this order matters

The storefront Docker build bakes `NEXT_PUBLIC_*` variables in at compile time. The publishable API key only exists in the database after migrations run. So the order is:

1. Build + start backend (runs migrations automatically)
2. Query the key from Postgres
3. Write it to `.env`
4. Build + start storefront

### 5.1 Build and start the backend

```bash
cd ~/nikoolifebd
docker compose build backend
docker compose up -d postgres redis backend
```

Watch for the backend to become healthy. First run takes 60–90 seconds because it runs all migrations:

```bash
watch docker compose ps
# Wait until backend shows: Up X minutes (healthy)
```

Or tail logs directly:

```bash
docker compose logs -f backend
# You should see: "Listening on http://0.0.0.0:9000"
```

### 5.2 Get the publishable API key

```bash
docker compose exec postgres psql -U medusa -d nikoolife \
  -c "SELECT token FROM api_key WHERE type='publishable' LIMIT 1;"
```

Expected output:

```
                            token
--------------------------------------------------------------
 pk_0f8d8687b7fe0adcaf9f5dae03f94974723c7f015b6b37eb936e3a948...
(1 row)
```

Copy the `pk_...` value and write it into `.env`:

```bash
# Replace pk_XXXXX with the actual value from above
sed -i "s|NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=|NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_XXXXX|" .env
```

Verify it was written:

```bash
grep PUBLISHABLE .env
```

---

## Phase 6 — Build and start the storefront

```bash
docker compose build storefront
docker compose up -d storefront
```

The build takes 3–5 minutes. If it fails, see the [Failures section](#failures-encountered) — most storefront build failures have known causes.

---

## Phase 7 — Start nginx

```bash
docker compose up -d nginx
```

Verify all five containers are running:

```bash
docker compose ps
```

Expected:

```
NAME                      STATUS
nikoolifebd-backend-1     Up X minutes (healthy)
nikoolifebd-nginx-1       Up X minutes
nikoolifebd-postgres-1    Up X minutes (healthy)
nikoolifebd-redis-1       Up X minutes (healthy)
nikoolifebd-storefront-1  Up X minutes
```

Quick smoke test from the server itself:

```bash
# Should return HTTP 308 (redirect to /gb/)
curl -sk https://localhost/ -o /dev/null -w '%{http_code}\n'

# Backend health
docker exec nikoolifebd-backend-1 wget -qO- http://localhost:9000/health
# Expected: OK
```

---

## Phase 8 — Create admin user

```bash
docker exec nikoolifebd-backend-1 ./node_modules/.bin/medusa user \
  -e your@email.com -p 'your-strong-password'
```

Access the Admin UI at `https://api.nikoolife.co.uk/app`.

> If the page loads but JS modules fail to load ("Failed to fetch dynamically imported module"), see [Failure 8](#8-admin-ui-assets-blocked-by-rate-limiter) in the failures section.

---

## Phase 9 — Seed region and collections

The seed script creates the UK/GBP region, 20% VAT, GBP as default store currency, and the three product collections (Abayas, Kimonos, New In).

```bash
docker exec nikoolifebd-backend-1 ./node_modules/.bin/medusa exec \
  src/scripts/seed-region.ts
```

Expected output:

```
Creating United Kingdom / GBP region...
  ✓ Created region: United Kingdom (reg_01...)
  ✓ GB tax region created (20% VAT)
  ✓ GBP set as default store currency
Setting up product collections...
  ✓ Created collection: Abayas
  ✓ Created collection: Kimonos
  ✓ Created collection: New In
✅ Seed complete! Log in to the Admin UI to add products.
```

---

## Phase 10 — Add products

Log in to `https://api.nikoolife.co.uk/app` → **Products → New Product**.

Product images are static files in `storefront/public/products/<handle>/` and served by the Next.js standalone server. Reference them in the Admin UI as:

```
https://nikoolife.co.uk/products/<handle>/<filename>
```

For example: `https://nikoolife.co.uk/products/gold-shimmer-abaya/01-front.jpg`

---

## Phase 11 — Firewall

> **Context:** Docker bypasses UFW by writing iptables rules directly. UFW rules on ports 80/443 have no effect when Docker maps those ports. The real enforcement is done inside nginx (see `nginx/nginx.conf` — the `geo $realip_remote_addr` block). The UFW setup below adds OS-level defence-in-depth for SSH and other ports.

```bash
bash ~/nikoolifebd/scripts/setup-firewall.sh
```

This script:
- Blocks all inbound by default
- Allows SSH (port 22) from anywhere so you can't lock yourself out
- Allows ports 80 and 443 only from Cloudflare's IP ranges (though Docker bypasses this — nginx handles it at the application layer)

After running, verify UFW is active:

```bash
ufw status verbose
```

---

## Ongoing operations

### View logs

```bash
docker compose logs -f backend
docker compose logs -f storefront
docker compose logs -f nginx
```

### Restart a single service

```bash
docker compose restart backend
```

### Redeploy after a code change

```bash
git pull
docker compose build backend storefront
docker compose up -d
```

### Database shell

```bash
docker compose exec postgres psql -U medusa -d nikoolife
```

### Rotate the publishable API key

```bash
docker exec nikoolifebd-backend-1 ./node_modules/.bin/medusa exec \
  src/scripts/fix-api-key.ts
# Then query the new key and update .env, then rebuild the storefront
```

---

## Failures encountered

Every failure below was hit during the original deployment. Each entry includes the exact symptom and the fix applied.

---

### 1. Yarn 4 (Berry) flags rejected

**Symptom:**

```
error: unknown option '--frozen-lockfile'
```

or

```
error: unknown option '--production=false'
```

**Cause:** The project uses Yarn 4 (Berry), configured via `.yarnrc.yml` with `yarnPath: .yarn/releases/yarn-4.x.cjs`. Yarn 4 dropped the `--frozen-lockfile` and `--production` flags that exist in Yarn 1.

**Fix:** Remove those flags from `yarn install` in the Dockerfiles. Yarn 4 installs with lockfile enforcement by default (`--immutable` is the Yarn 4 equivalent, but plain `yarn install` also respects the lockfile). Copy `.yarnrc.yml` and `.yarn/releases/` into each Dockerfile stage so every stage uses Yarn 4:

```dockerfile
FROM base AS deps
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/releases ./.yarn/releases
RUN yarn install          # no flags needed — Yarn 4 handles this correctly
```

---

### 2. TypeScript compilation errors in seed scripts

**Symptom:** `docker compose build backend` fails with TypeScript errors like:

```
error TS2307: Cannot find module '@medusajs/framework/types'
error TS18046: 'e' is of type 'unknown'
```

**Cause:** `src/scripts/` was included in the `tsconfig.json` compilation. The seed scripts use exec-only patterns and are not compiled as part of the main backend build.

**Fix:** Add `"src/scripts"` to the `exclude` array in `backend/tsconfig.json`:

```json
"exclude": [
  "node_modules",
  ".medusa/server",
  ".medusa/admin",
  ".cache",
  "src/scripts"
]
```

---

### 3. Wrong CMD — `main.js` does not exist

**Symptom:** Backend container starts and immediately exits with:

```
Error: Cannot find module '/app/.medusa/server/src/main.js'
```

**Cause:** The original Dockerfile used `CMD ["node", ".medusa/server/src/main.js"]`. Medusa v2 does not compile to that path. The build output in `.medusa/server/` is not a standalone Node entrypoint.

**Fix:** Use the Medusa CLI as the entrypoint:

```dockerfile
CMD ["./node_modules/.bin/medusa", "start"]
```

---

### 4. `medusa start` tries to recompile `medusa-config.ts` with ts-node

**Symptom:** Backend container fails at startup with:

```
error TS2307: Cannot find module '@medusajs/framework/types'
```

or ts-node complains it cannot compile `.ts` files.

**Cause:** `medusa start` looks for `medusa-config` in the current working directory. If the WORKDIR is the project root (where `medusa-config.ts` lives), it finds the TypeScript source and tries to compile it with ts-node at runtime. ts-node is not available in the production image.

**Fix:** Set the runner stage `WORKDIR` to `.medusa/server/`, which contains the compiled `medusa-config.js`. Medusa finds and uses the `.js` file instead:

```dockerfile
FROM node:20-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app                              # this becomes .medusa/server/

COPY --from=builder /app/.medusa/server ./    # compiled output
COPY --from=builder /app/node_modules ./node_modules

CMD ["./node_modules/.bin/medusa", "start"]
```

---

### 5. PostgreSQL connection fails with SSL error

**Symptom:** Backend starts but immediately crashes with:

```
Error: The server does not support SSL connections
```

or the backend healthcheck fails repeatedly.

**Cause:** The `pg` (PostgreSQL) client defaults to attempting an SSL connection. The Docker-managed Postgres container has no SSL configured.

**Fix:** Append `?sslmode=disable` to `DATABASE_URL` in `docker-compose.yml`:

```yaml
environment:
  DATABASE_URL: postgres://medusa:${POSTGRES_PASSWORD}@postgres:5432/nikoolife?sslmode=disable
```

> **Important:** Set this in `docker-compose.yml`'s `environment:` block, not only in `.env`. The compose environment block takes precedence and ensures the flag is always present.

---

### 6. Storefront build requires the publishable API key (chicken-and-egg)

**Symptom:** `docker compose build storefront` fails with:

```
Error: NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY is required
```

**Cause:** Next.js bakes `NEXT_PUBLIC_*` variables into the JS bundle at build time (not at runtime). The publishable API key only exists in the database after the backend runs migrations — but you need the key before you can build the storefront.

**Fix:** Start the backend first, let it run migrations, query the key from Postgres, then build the storefront:

```bash
# 1. Start backend and wait for it to be healthy
docker compose up -d postgres redis backend
watch docker compose ps   # wait for (healthy)

# 2. Get the key
docker compose exec postgres psql -U medusa -d nikoolife \
  -c "SELECT token FROM api_key WHERE type='publishable' LIMIT 1;"

# 3. Write it to .env
sed -i "s|NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=|NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...|" .env

# 4. Now build the storefront
docker compose build storefront
```

The `storefront/Dockerfile` declares `ARG NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` and `docker-compose.yml` passes it through `build.args`, so the key is available during the Next.js build:

```dockerfile
ARG NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=$NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
```

---

### 7. Storefront build crashes with ECONNREFUSED during static generation

**Symptom:** `docker compose build storefront` fails with:

```
Error: connect ECONNREFUSED 127.0.0.1:9000
```

or

```
FetchError: request to http://backend:9000/store/... failed, reason: connect ECONNREFUSED
```

**Cause:** Next.js calls `generateStaticParams()` during the build to pre-render dynamic routes. The categories and collections pages call the Medusa backend API inside `generateStaticParams`. During a Docker build, the build container is an isolated environment — it cannot reach `backend:9000` because the Docker network only exists at runtime, not during build.

**Fix:** Wrap `generateStaticParams` in a try/catch in both affected pages. On failure it returns `[]`, which tells Next.js to skip static pre-rendering and fall back to dynamic rendering at request time:

`storefront/src/app/[countryCode]/(main)/categories/[...category]/page.tsx`:
```typescript
export async function generateStaticParams() {
  try {
    const product_categories = await listCategories()
    // ... build params
    return staticParams
  } catch {
    return []   // build container can't reach backend — that's fine
  }
}
```

Same change in `collections/[handle]/page.tsx`.

---

### 8. Admin UI assets blocked by rate limiter

**Symptom:** Navigating to `https://api.nikoolife.co.uk/app` loads a blank page or shows:

```
TypeError: Failed to fetch dynamically imported module:
https://api.nikoolife.co.uk/app/assets/login-TQZ42HKB-DYnte-aT.js
```

**Cause:** The Medusa Admin is a React SPA. On first load it fires 20–40 concurrent requests for JavaScript chunks. The nginx API rate limit (`30r/m burst=10 nodelay`) treats these as a burst violation and returns 503 for most of them. The browser receives a 503 HTML page instead of a JS file, which the module loader cannot parse.

**Fix:** Add a separate `/app` location block in the API server that has no rate limiting. nginx evaluates location blocks by longest prefix match, so `/app` takes precedence over `/`:

```nginx
server {
  server_name api.nikoolife.co.uk;

  # Admin UI — no rate limit (SPA loads many chunks at once)
  location /app {
    proxy_pass http://backend;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  # API endpoints — rate limited
  location / {
    limit_req zone=api burst=10 nodelay;
    proxy_pass http://backend;
    ...
  }
}
```

---

### 9. CORS misconfigured — admin calls rejected

**Symptom:** Admin UI loads but API calls fail with:

```
Access to fetch at 'https://api.nikoolife.co.uk/admin/...' from origin
'https://api.nikoolife.co.uk' has been blocked by CORS policy
```

**Cause:** `ADMIN_CORS` was set to `https://nikoolife.co.uk` (the storefront domain). The Admin UI is served at `https://api.nikoolife.co.uk/app`, so browser requests from the admin come from origin `https://api.nikoolife.co.uk`. The Medusa backend rejected these because `api.nikoolife.co.uk` was not in the allowed origins.

**Fix:** Set CORS values correctly in `docker-compose.yml`:

```yaml
STORE_CORS: https://nikoolife.co.uk,https://www.nikoolife.co.uk
ADMIN_CORS: https://api.nikoolife.co.uk
AUTH_CORS:  https://nikoolife.co.uk,https://www.nikoolife.co.uk,https://api.nikoolife.co.uk
```

After changing, restart the backend:

```bash
docker compose restart backend
```

---

### 10. Direct IP access bypasses Cloudflare (Docker overrides UFW)

**Symptom:** `curl https://72.61.147.202/` returns a response. Anyone who knows the server IP can reach the origin server, bypassing Cloudflare's WAF and rate limiting.

**Cause:** Docker maps ports (`0.0.0.0:80->80/tcp`) by inserting iptables rules directly. These rules are processed before UFW rules, so UFW has no effect on Docker-mapped ports — UFW is simply bypassed.

**Attempted fix that did NOT work:** Setting UFW rules to deny ports 80/443 — Docker's iptables rules take precedence and traffic still gets through.

**Fix that works:** Enforce the Cloudflare-only restriction inside nginx using the `geo` module. The `geo` block maps the connecting IP to a flag; if it's not a Cloudflare edge IP, nginx drops the connection with status 444 (close without response):

```nginx
geo $realip_remote_addr $is_cloudflare {
  default 0;
  # Cloudflare IPv4 ranges
  173.245.48.0/20 1;
  103.21.244.0/22 1;
  # ... all CF ranges ...
}

server {
  if ($is_cloudflare = 0) { return 444; }
  # ... rest of config
}
```

> **Critical variable:** Use `$realip_remote_addr`, not `$remote_addr`. The `set_real_ip_from` + `real_ip_header CF-Connecting-IP` directives rewrite `$remote_addr` to the visitor's actual IP. After that rewrite, `$remote_addr` is the end user's IP (not a Cloudflare IP), which would cause all traffic to be dropped. `$realip_remote_addr` holds the original TCP connection IP — the Cloudflare edge — and is what you need to check.

After applying the fix, verify:

```bash
# Must work (goes through Cloudflare)
curl -sk https://nikoolife.co.uk/ -o /dev/null -w '%{http_code}\n'
# → 308

# Must be blocked (direct IP, not from Cloudflare)
curl -sk --connect-timeout 5 https://72.61.147.202/ -o /dev/null -w '%{http_code}\n'
# → 000 (connection closed)
```
