# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NikooLife is a premium modest fashion e-commerce platform (abayas, kimonos) using MedusaJS v2 (backend) and Next.js 15 (storefront). Backend runs on port 9000, storefront on port 8000.

## Development Commands

### First-time setup
```bash
make setup          # Start Docker deps, run migrations, create admin user
```

For production deployment on a new server, follow `docs/production-setup.md`.

### Daily development
```bash
make dev            # Start Postgres + Redis (Docker) + backend + storefront together
make deps           # Start Postgres + Redis only
make backend        # Start backend only (requires deps running)
make storefront     # Start storefront only (requires backend running)
make stop           # Stop Docker deps
make clean          # Destroy Docker volumes (deletes all data)
```

### Database
```bash
make migrate        # Run pending Medusa migrations
make seed           # Seed UK/GBP region, 20% VAT, and Abayas/Kimonos/New In collections
make admin          # Create an admin user (prompts for email and password)
```

### Backend scripts (run individually)
```bash
cd backend
yarn medusa exec src/scripts/seed-region.ts        # Seed UK/GBP region + collections
yarn medusa exec src/scripts/fix-api-key.ts        # Rotate publishable API key
yarn medusa exec src/scripts/fix-store-currency.ts # Fix store currency
```

### Backend tests
```bash
cd backend
yarn test:unit
yarn test:integration:http
yarn test:integration:modules
```

### Storefront lint
```bash
cd storefront && yarn lint
```

### AI image generator
```bash
cd ai-image-generator
python generate_images.py <product_image_path> [view_number]
# view_number 1-4 to re-generate a specific view (1=folded, 2=lifestyle, 3=macro, 4=sofa)
```

## Architecture

### Storefront routing (Next.js App Router)
All customer-facing routes live under `src/app/[countryCode]/` — every URL is prefixed with a country code (e.g., `/gb/products/gold-shimmer-abaya`). The middleware (`src/middleware.ts`) auto-detects region from:
1. Vercel's `x-vercel-ip-country` header
2. URL country code segment
3. `NEXT_PUBLIC_DEFAULT_REGION` env var (defaults to `gb`)

Regions are fetched from the Medusa backend at startup and cached for 1 hour via `_medusa_cache_id` cookie.

### Storefront data layer (`src/lib/data/`)
All backend communication is through server-only async functions using `@medusajs/js-sdk`. The SDK client is initialized in `src/lib/config.ts` and injects the locale header on every request. These functions are called directly from Server Components and Server Actions — there is no client-side API fetching.

### Storefront component structure (`src/modules/`)
Each domain (cart, checkout, products, account, etc.) has:
- `components/` — low-level UI components
- `templates/` — page-level compositions that wire components together

Pages in `src/app/` import templates, not components directly.

### Backend (Medusa v2)
Uses the Medusa v2 module/workflow architecture:
- Custom API endpoints: `src/api/admin/custom/` and `src/api/store/custom/`
- Custom workflows: `src/workflows/`
- Business logic modules: `src/modules/`
- Seed scripts: `src/scripts/` — run via `yarn medusa exec <path>`

Stripe is configured as the payment provider in `medusa-config.ts`. PayPal is enabled via Stripe dashboard (no extra backend config).

### Product images
Images are uploaded through the Medusa Admin UI and stored by the local file provider in `uploads/` relative to the backend working directory. In production this directory is mounted as a Docker named volume (`uploads_data`) so files persist across container rebuilds. Uploaded files are served at `https://api.nikoolife.co.uk/uploads/<filename>`. The storefront's `next.config.js` already includes `api.nikoolife.co.uk` in `remotePatterns` so Next.js image optimisation works automatically.

Banner images (`storefront/public/banners/`) remain as static files — they are part of the storefront UI, not product records.

### Environment variables
- Backend: `backend/.env` (copy from `backend/.env.template`)
- Storefront: `storefront/.env.local`
- Key vars: `DATABASE_URL`, `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`, `STRIPE_API_KEY`, `NEXT_PUBLIC_STRIPE_KEY`
- The publishable API key is generated in the Medusa Admin after first setup; `fix-api-key.ts` can rotate it.

### AI image generator (`/ai-image-generator`)
Standalone Python tool using Google Gemini. Takes a studio product photo and generates 4 lifestyle variants (folded, full-body lifestyle with blurred face, macro, sofa spread). The `inspiration.jpeg` sets the lighting/aesthetic reference for all generations.

## Key Instruction

Do not make any change until you have 95% confidence on what you need to build. Ask follow-up questions if needed.
