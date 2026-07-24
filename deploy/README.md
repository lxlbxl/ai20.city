# Going live — the complete checklist

This turns `docs/DEPLOY-VPS.md` (narrative background, keep for context) into
a fixed sequence with no manual assembly. Everything except two values is
copy-paste; those two are called out explicitly below and cannot be filled in
from outside the server.

**Why this exists:** the codebase (this repo) cannot reach the VPS — no SSH
key, no CI/CD pipeline, and no deploy credential exists anywhere in this
environment. Everything up to this point (region routing, all EU/US content,
research data, bilingual pages, the SEO fixes) is finished and pushed to
`main`. This checklist is what turns that into a live, correctly-configured
site. Run it on the VPS itself, or hand it to whoever has access.

---

## First-time setup (once)

### 1. DNS
```
eu.ai20.city.   A   173.212.207.108
us.ai20.city.   A   173.212.207.108
```
(`ai20.city` already resolves — this just adds the two subdomains.)

### 2. Clone/locate the repo on the server, then build once
```bash
cd /var/www/ai20-src   # or wherever the checkout lives / will live
bash deploy/deploy.sh
```
This builds both regions and publishes them to `/var/www/ai20-eu`,
`/var/www/ai20-us`, and `/var/www/ai20-apex`. Safe to re-run any time.

### 3. Find the one value this repo cannot know: the PHP-FPM socket
```bash
bash deploy/find-php-fpm-socket.sh
```
Compare its output to the `fastcgi_pass` line already working in the
apex vhost. If they match the placeholder in `deploy/nginx/eu.conf` /
`us.conf` (`php8.3-fpm.sock`), do nothing. If not, edit both files to match.

### 4. Install the nginx configs
```bash
sudo cp deploy/nginx/http-redirect.conf /etc/nginx/sites-available/ai20-http-redirect.conf
sudo cp deploy/nginx/apex.conf          /etc/nginx/sites-available/ai20-apex.conf
sudo cp deploy/nginx/eu.conf            /etc/nginx/sites-available/ai20-eu.conf
sudo cp deploy/nginx/us.conf            /etc/nginx/sites-available/ai20-us.conf

sudo ln -sf /etc/nginx/sites-available/ai20-http-redirect.conf /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/ai20-apex.conf          /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/ai20-eu.conf             /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/ai20-us.conf             /etc/nginx/sites-enabled/
```

**Before enabling**, open `deploy/nginx/apex.conf` and confirm the two
`ssl_certificate` lines match whatever the *currently working* apex vhost
uses (they almost certainly do — one Let's Encrypt cert already covers all
four hostnames, confirmed live against `ai20.city:443`). Copy the exact lines
from the existing config if there's any doubt: `sudo certbot certificates`.

**If `ai20.city` currently has its own working vhost file already enabled**,
remove or fold in that old block first so there's exactly one `server{}` per
hostname — two blocks matching the same `server_name` will make nginx use
whichever loads last, which is a common source of "I edited the file but
nothing changed."

### 5. Test and reload
```bash
sudo nginx -t && sudo systemctl reload nginx
```

### 6. Confirm SSL already covers the new subdomains
It almost certainly already does (see above), but confirm rather than assume:
```bash
sudo certbot certificates
```
If `eu.ai20.city` or `us.ai20.city` are *not* listed among the SANs, extend
the existing certificate:
```bash
sudo certbot --nginx --expand -d ai20.city -d www.ai20.city -d eu.ai20.city -d us.ai20.city
```

---

## Every subsequent release

```bash
cd /var/www/ai20-src
bash deploy/deploy.sh
```
That's the whole release process. Nothing else to touch — nginx serves
whatever files are on disk, and the script replaces them atomically per
region.

---

## Verify it's actually live and correct

```bash
bash deploy/verify.sh
```
Checks HTTPS on all three hosts, the HTTP→HTTPS redirect, region isolation,
currency correctness, and that a retired Tier C URL 301s instead of 404ing.
Run this after every release, not just the first one.
