#!/usr/bin/env bash
# deploy/find-php-fpm-socket.sh
#
# The ONE value in deploy/nginx/{eu,us}.conf this repo cannot know from
# outside the server: the exact PHP-FPM socket path (it depends on which PHP
# version is installed). Run this ON THE VPS to find it, then paste the
# result into both eu.conf and us.conf (replacing the fastcgi_pass line), or
# just confirm it already matches what's in the existing working apex config.

set -uo pipefail

echo "== PHP-FPM sockets currently listening =="
found=0
for sock in /run/php/php*-fpm.sock /var/run/php/php*-fpm.sock; do
    if [ -S "$sock" ]; then
        echo "  $sock"
        found=1
    fi
done
if [ "$found" = "0" ]; then
    echo "  none found in the usual locations - checking active php-fpm services instead:"
    systemctl list-units --type=service --all 2>/dev/null | grep -i php-fpm || echo "  (systemctl not available or no php-fpm service found)"
fi

echo ""
echo "== What the CURRENT working nginx config already uses =="
echo "   (this is the value already proven to work - prefer it over the above)"
grep -rn "fastcgi_pass" /etc/nginx/sites-enabled/ /etc/nginx/conf.d/ 2>/dev/null || echo "  (no existing fastcgi_pass found - check /etc/nginx/sites-enabled/ manually)"
