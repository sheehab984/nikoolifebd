#!/usr/bin/env bash
# One-time SSL certificate bootstrap using Let's Encrypt + Certbot.
# Run this ONCE on the server before starting the production stack.
#
# Usage:
#   chmod +x scripts/setup-ssl.sh
#   ./scripts/setup-ssl.sh your@email.com
#
# After this script completes, certs will be in nginx/certs/.
# Then start the full stack: docker compose up -d

set -euo pipefail

EMAIL="${1:?Usage: $0 <your-email>}"
DOMAIN="nikoolife.co.uk"
API_DOMAIN="api.nikoolife.co.uk"
CERTS_DIR="$(pwd)/nginx/certs"
WEBROOT_DIR="$(pwd)/nginx/certbot-www"

mkdir -p "$CERTS_DIR" "$WEBROOT_DIR"

echo "▶ Step 1: Starting nginx in HTTP-only mode (for ACME challenge)..."
docker compose -f docker-compose.yml up -d postgres redis backend storefront
# Temporarily use the init config for nginx
docker run -d --rm \
  --name nginx-init \
  --network nikoolifecouk_internal \
  -p 80:80 \
  -v "$(pwd)/nginx/nginx-init.conf:/etc/nginx/nginx.conf:ro" \
  -v "$WEBROOT_DIR:/var/www/certbot:ro" \
  nginx:alpine

echo "▶ Step 2: Requesting certificates from Let's Encrypt..."
docker run --rm \
  -v "$CERTS_DIR:/etc/letsencrypt" \
  -v "$WEBROOT_DIR:/var/www/certbot" \
  certbot/certbot certonly \
    --webroot \
    --webroot-path /var/www/certbot \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    -d "$DOMAIN" \
    -d "www.$DOMAIN" \
    -d "$API_DOMAIN"

echo "▶ Step 3: Copying certs into nginx/certs/ structure..."
mkdir -p "$CERTS_DIR/$DOMAIN" "$CERTS_DIR/$API_DOMAIN"
cp "$CERTS_DIR/live/$DOMAIN/fullchain.pem" "$CERTS_DIR/$DOMAIN/fullchain.pem"
cp "$CERTS_DIR/live/$DOMAIN/privkey.pem"   "$CERTS_DIR/$DOMAIN/privkey.pem"
cp "$CERTS_DIR/live/$API_DOMAIN/fullchain.pem" "$CERTS_DIR/$API_DOMAIN/fullchain.pem"
cp "$CERTS_DIR/live/$API_DOMAIN/privkey.pem"   "$CERTS_DIR/$API_DOMAIN/privkey.pem"

echo "▶ Step 4: Stopping bootstrap nginx..."
docker stop nginx-init || true

echo ""
echo "✅ SSL certificates issued successfully."
echo ""
echo "Next steps:"
echo "  1. Start the full production stack:"
echo "     docker compose up -d"
echo ""
echo "  2. Set up auto-renewal (add to crontab on the server):"
echo "     0 3 * * * certbot renew --quiet && docker compose exec nginx nginx -s reload"
echo ""
