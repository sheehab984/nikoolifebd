#!/bin/bash
# setup-firewall.sh
#
# Locks down the server so that ports 80 and 443 only accept traffic
# originating from Cloudflare's IP ranges. SSH (port 22) remains open
# from anywhere so you don't lock yourself out.
#
# Run once on the server: bash scripts/setup-firewall.sh

set -e

echo "==> Resetting rules to defaults..."
# Reset clears rules and disables UFW — set defaults before re-enabling
ufw --force reset
ufw default deny incoming
ufw default allow outgoing

# Always allow SSH so we can't lock ourselves out
ufw allow 22/tcp comment "SSH"

echo "==> Allowing Cloudflare IPv4 ranges on 80 + 443..."
# Source: https://www.cloudflare.com/ips-v4
CF_IPV4=(
  173.245.48.0/20
  103.21.244.0/22
  103.22.200.0/22
  103.31.4.0/22
  141.101.64.0/18
  108.162.192.0/18
  190.93.240.0/20
  188.114.96.0/20
  197.234.240.0/22
  198.41.128.0/17
  162.158.0.0/15
  104.16.0.0/13
  104.24.0.0/14
  172.64.0.0/13
  131.0.72.0/22
)

for ip in "${CF_IPV4[@]}"; do
  ufw allow from "$ip" to any port 80 proto tcp comment "Cloudflare"
  ufw allow from "$ip" to any port 443 proto tcp comment "Cloudflare"
done

echo "==> Allowing Cloudflare IPv6 ranges on 80 + 443..."
# Source: https://www.cloudflare.com/ips-v6
CF_IPV6=(
  2400:cb00::/32
  2606:4700::/32
  2803:f800::/32
  2405:b500::/32
  2405:8100::/32
  2a06:98c0::/29
  2c0f:f248::/32
)

for ip in "${CF_IPV6[@]}"; do
  ufw allow from "$ip" to any port 80 proto tcp comment "Cloudflare"
  ufw allow from "$ip" to any port 443 proto tcp comment "Cloudflare"
done

echo "==> Enabling UFW..."
echo "y" | ufw enable

echo "==> UFW status:"
ufw status verbose

echo ""
echo "Done. Ports 80 and 443 are now restricted to Cloudflare IPs only."
echo "Direct access to http://72.61.147.202 is blocked."
