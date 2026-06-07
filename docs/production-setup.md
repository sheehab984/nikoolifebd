# Production Setup Guide — NikooLife

This guide documents the exact steps taken to deploy NikooLife to a VPS running at `72.61.147.202` with the domain `nikoolife.co.uk`.

---

## Architecture

```
Internet → Cloudflare (CDN + SSL termination) → nginx (443) → Docker network
                                                               ├── storefront:8000  (Next.js)
                                                               ├── backend:9000     (Medusa)
                                                               ├── postgres:5432
                                                               └── redis:6379
```

All services run as Docker containers on a single VPS, sharing an internal `bridge` network. nginx is the only service with public ports.

---

## Prerequisites

- VPS with Ubuntu/Debian and SSH root access
- Domain pointing to the VPS (via Cloudflare)
- Docker and Docker Compose installed on the server
- Git installed on the server

### Install Docker on the server

```bash
curl -fsSL https://get.docker.com | sh
```

---

## Step 1 — Cloudflare DNS

In the Cloudflare dashboard for `nikoolife.co.uk`, create these A records (all proxied):

| Type | Name  | Content        | Proxy |
|------|-------|----------------|-------|
| A    | @     | 72.61.147.202  | ✓     |
| A    | www   | 72.61.147.202  | ✓     |
| A    | api   | 72.61.147.202  | ✓     |

Set SSL/TLS mode to **Full** (not Flexible, not Full Strict) in Cloudflare → SSL/TLS → Overview.

---

## Step 2 — SSL Certificate

We use a self-signed certificate. Cloudflare terminates public SSL and connects to the origin over HTTPS using Full mode (which accepts self-signed certs).

```bash
mkdir -p ~/nikoolifebd/nginx/certs
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ~/nikoolifebd/nginx/certs/origin.key \
  -out ~/nikoolifebd/nginx/certs/origin.crt \
  -subj "/CN=nikoolife.co.uk/O=Nikoo Life/C=GB"
```

> **Alternative:** Use a Cloudflare Origin Certificate (15-year validity) from Cloudflare → SSL/TLS → Origin Server → Create Certificate. Download the cert and key, save as `origin.crt` and `origin.key`. Then switch Cloudflare to **Full (strict)** mode.

---

## Step 3 — Clone the repo

```bash
cd ~
git clone https://github.com/sheehab/nikoolife.co.uk.git nikoolifebd
cd nikoolifebd
```

---

## Step 4 — Create the `.env` file

```bash
cat > ~/nikoolifebd/.env << 'EOF'
# Postgres
POSTGRES_USER=medusa
POSTGRES_PASSWORD=<generate: openssl rand -hex 32>
POSTGRES_DB=nikoolife

# Medusa secrets
JWT_SECRET=<generate: openssl rand -hex 32>
COOKIE_SECRET=<generate: openssl rand -hex 32>
REVALIDATE_SECRET=<generate: openssl rand -hex 32>

# Database (must match Postgres vars above, with ?sslmode=disable for Docker)
DATABASE_URL=postgres://medusa:<POSTGRES_PASSWORD>@postgres:5432/nikoolife?sslmode=disable

# Storefront public vars
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.nikoolife.co.uk
NEXT_PUBLIC_BASE_URL=https://nikoolife.co.uk
NEXT_PUBLIC_DEFAULT_REGION=gb

# Publishable API key — fill in after Step 6
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=

# Stripe — replace with real keys from stripe.com/dashboard
STRIPE_API_KEY=sk_live_REPLACE_ME
NEXT_PUBLIC_STRIPE_KEY=pk_live_REPLACE_ME

# Resend — optional, for transactional email
RESEND_API_KEY=re_REPLACE_ME
RESEND_FROM_EMAIL=hello@nikoolife.co.uk
EOF
```

Generate secrets:
```bash
openssl rand -hex 32  # run 4 times for the 4 secrets above
```

---

## Step 5 — Build and start the backend

Build and start only Postgres, Redis, and the backend first:

```bash
cd ~/nikoolifebd
docker compose build backend
docker compose up -d postgres redis backend
```

Wait for the backend to become healthy (check with `docker compose ps`). The `start_period` is 90 seconds — it runs migrations automatically on first start.

```bash
docker compose ps   # backend should show "(healthy)" within ~2 minutes
```

---

## Step 6 — Get the publishable API key

Once the backend is healthy, query the key from the database:

```bash
docker compose exec postgres psql -U medusa -d nikoolife \
  -c "SELECT token FROM api_key WHERE type='publishable' LIMIT 1;"
```

Copy the `pk_...` value and add it to `.env`:

```bash
sed -i "s/NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=/NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_.../" .env
```

---

## Step 7 — Build and start the storefront

The storefront needs the publishable key baked in at build time:

```bash
docker compose build storefront
docker compose up -d storefront
```

---

## Step 8 — Start nginx

```bash
docker compose up -d nginx
```

nginx serves:
- `nikoolife.co.uk` → Next.js storefront on port 8000
- `api.nikoolife.co.uk` → Medusa backend on port 9000
- `/app` on `api.nikoolife.co.uk` → Medusa Admin UI (no rate limiting)

---

## Step 9 — Create the admin user

```bash
docker exec nikoolifebd-backend-1 ./node_modules/.bin/medusa user \
  -e admin@nikoolife.co.uk -p yourpassword
```

Access the admin at `https://api.nikoolife.co.uk/app`.

---

## Step 10 — Seed initial data (via Admin UI)

Log in to `https://api.nikoolife.co.uk/app` and:

1. **Settings → Regions** → Create "United Kingdom" region, currency GBP, country GB
2. **Settings → Store** → Set default currency to GBP
3. **Products → Collections** → Create "Abayas", "Kimonos", "New In"
4. **Products** → Add products with images, prices in GBP

> The admin UI is the recommended way to manage products in production.

---

## Useful commands

### View logs
```bash
docker compose logs -f backend
docker compose logs -f storefront
docker compose logs -f nginx
```

### Restart a service
```bash
docker compose restart backend
```

### Rebuild and redeploy after a code change
```bash
git pull
docker compose build backend storefront
docker compose up -d
```

### Full restart
```bash
docker compose down
docker compose up -d
```

### Database shell
```bash
docker compose exec postgres psql -U medusa -d nikoolife
```

---

## Problems encountered and fixes

### 1. Yarn 4 (Berry) incompatible flags
Yarn 4 does not support `--frozen-lockfile` or `--production` flags from Yarn 1. Removed all such flags from the Dockerfiles. The `.yarnrc.yml` and `.yarn/releases/` are copied into every Docker stage so the correct Yarn version is used.

### 2. TypeScript errors in seed scripts
`src/scripts/` is excluded from `backend/tsconfig.json` compilation because those files are exec-only and not part of the compiled backend output.

### 3. Wrong CMD path
`medusa build` outputs to `.medusa/server/`. The correct startup command is `./node_modules/.bin/medusa start`, not `node .medusa/server/src/main.js` (that path doesn't exist).

### 4. ts-node trying to compile `medusa-config.ts`
When `medusa start` is run from the project root, it finds `medusa-config.ts` and tries to recompile it with ts-node at runtime (which fails in production with no ts-node). Fixed by setting the runner stage `WORKDIR` to `.medusa/server/` — the compiled output contains `medusa-config.js`, which `medusa start` uses instead.

### 5. PostgreSQL SSL error
The `pg` client defaults to requiring SSL. Docker-managed Postgres has no SSL configured. Fixed by appending `?sslmode=disable` to `DATABASE_URL`.

### 6. Storefront build needs publishable key at build time
Next.js bakes `NEXT_PUBLIC_*` variables in at build time. The publishable key only exists after migrations run (chicken-and-egg). Fixed by: starting the backend first → querying the key from Postgres → writing it to `.env` → then building the storefront. The `ARG`/`ENV` declarations in the storefront Dockerfile pass the key through `docker compose build`.

### 7. `generateStaticParams` crashes Docker build (ECONNREFUSED)
During `docker compose build storefront`, the build container is not on the Docker network and cannot reach the Medusa backend. `generateStaticParams` in the categories and collections pages called the backend API unconditionally, aborting the build. Fixed by wrapping both in `try { ... } catch { return [] }`.

### 8. Admin UI assets blocked by rate limiter
The Medusa Admin SPA loads many JS chunks simultaneously on first load. The nginx API rate limit (`30r/m burst=10`) blocked these, causing "Failed to fetch dynamically imported module" errors. Fixed by adding a separate `/app` location block in nginx that bypasses rate limiting.
