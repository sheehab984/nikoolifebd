.PHONY: help setup dev stop backend storefront migrate seed admin logs ps clean

BACKEND_DIR  := backend
STOREFRONT_DIR := storefront

# ─── Help ─────────────────────────────────────────────────────────────────────
help:
	@echo ""
	@echo "  nikoolife.co.uk — dev commands"
	@echo ""
	@echo "  First time:"
	@echo "    make setup        Start deps, run migrations, create admin user"
	@echo ""
	@echo "  Daily use:"
	@echo "    make dev          Start everything (deps + backend + storefront)"
	@echo "    make deps         Start Postgres + Redis only"
	@echo "    make backend      Start backend only (deps must be running)"
	@echo "    make storefront   Start storefront only (backend must be running)"
	@echo "    make stop         Stop Docker deps"
	@echo ""
	@echo "  Database:"
	@echo "    make migrate      Run pending migrations"
	@echo "    make seed         Seed demo data"
	@echo "    make admin        Create an admin user"
	@echo ""
	@echo "  Utils:"
	@echo "    make logs         Tail Docker logs (postgres + redis)"
	@echo "    make ps           Show running Docker services"
	@echo "    make clean        Stop deps and remove volumes (WARNING: deletes data)"
	@echo ""

# ─── First-time setup ─────────────────────────────────────────────────────────
setup: deps
	@echo "⏳  Waiting for Postgres to be ready..."
	@sleep 3
	@$(MAKE) migrate
	@$(MAKE) admin
	@echo ""
	@echo "✅  Setup complete. Run 'make dev' to start."

# ─── Start everything ─────────────────────────────────────────────────────────
dev: deps
	@echo "🚀  Starting backend + storefront (Ctrl+C to stop both)..."
	@trap 'kill %1 %2 2>/dev/null; exit 0' INT; \
	  (cd $(BACKEND_DIR) && yarn dev 2>&1 | sed 's/^/[backend]  /') & \
	  (sleep 5 && cd $(STOREFRONT_DIR) && yarn dev 2>&1 | sed 's/^/[storefront]  /') & \
	  wait

# ─── Docker deps ──────────────────────────────────────────────────────────────
deps:
	@echo "🐳  Starting Postgres + Redis..."
	@docker compose -f docker-compose.dev.yml up -d
	@echo "✅  Postgres on localhost:5432  |  Redis on localhost:6379"

stop:
	@docker compose -f docker-compose.dev.yml stop
	@echo "🛑  Deps stopped."

ps:
	@docker compose -f docker-compose.dev.yml ps

logs:
	@docker compose -f docker-compose.dev.yml logs -f

clean:
	@echo "⚠️   This will delete all local database data. Press Ctrl+C to cancel..."
	@sleep 3
	@docker compose -f docker-compose.dev.yml down -v
	@echo "🧹  Cleaned."

# ─── Backend only ─────────────────────────────────────────────────────────────
backend:
	@cd $(BACKEND_DIR) && yarn dev

# ─── Storefront only ──────────────────────────────────────────────────────────
storefront:
	@cd $(STOREFRONT_DIR) && yarn dev

# ─── Database ─────────────────────────────────────────────────────────────────
migrate:
	@echo "🗄️   Running migrations..."
	@cd $(BACKEND_DIR) && yarn medusa db:migrate
	@echo "✅  Migrations done."

seed:
	@echo "🌱  Seeding demo data..."
	@cd $(BACKEND_DIR) && yarn medusa exec src/scripts/seed.ts
	@echo "✅  Seed done."

admin:
	@echo "👤  Creating admin user..."
	@cd $(BACKEND_DIR) && yarn medusa user -e admin@nikoolife.co.uk -p adminpassword
	@echo "✅  Admin created: admin@nikoolife.co.uk / adminpassword"
	@echo "⚠️   Change your password after first login."
