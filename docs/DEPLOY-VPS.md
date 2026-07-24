# Deployment Fix — nginx VPS (three hosts)

> **Use `deploy/README.md` to actually do this.** It is the fixed, copy-paste
> sequence — this file is the narrative background for why each step exists.
> `deploy/` also has the ready-to-drop-in nginx configs (`deploy/nginx/*.conf`,
> Tier C 301 and HTTPS redirect already baked in), a one-command build+publish
> script (`deploy/deploy.sh`), and a post-deploy check (`deploy/verify.sh`)
> that proves the live site is actually correct rather than just "the files
> are on disk". This repo has no SSH key, CI/CD pipeline, or deploy credential
> for the VPS, so none of this can be executed from here — it has to be run
> by whoever has server access.

**Context for the deploy agent.** The site is served by nginx/1.24.0 (Ubuntu) on
the VPS at `173.212.207.108`. The current deployment is a *single* build with no
`REGION` env var, so it defaulted to `eu` and the EU site is being served at the
apex. `eu.ai20.city` and `us.ai20.city` have no DNS records, which is why the
in-site `US | EU` toggle lands on a non-existent host.

**Nothing is wrong with the application code.** `region-select.html` and
`audit.html` are already deployed and return 200. What is missing is the
three-host topology the architecture requires.

## Why three builds

`REGION` is baked in at **build time** (currency, copy, verticals, city pages,
canonical host, hreflang). One build cannot serve both regions. Target:

| Host | Content | Build |
|---|---|---|
| `ai20.city` (+ `www`) | Neutral region chooser only | `dist/region-select.html` (self-contained) |
| `eu.ai20.city` | Full EU site (EUR, GDPR/EU AI Act) | `REGION=eu npm run build` |
| `us.ai20.city` | Full US site (USD, HIPAA/SOC 2/TCPA) | `REGION=us npm run build` |

---

## Step 1 — DNS

Add two A records pointing at the same VPS:

```
eu.ai20.city.   A   173.212.207.108
us.ai20.city.   A   173.212.207.108
```

## Step 2 — Build all three targets

Requires Node and **Python 3** on the box (the generators are Python).
The generators clean the previous region's output automatically, so running the
two builds back-to-back in the same checkout is safe.

```bash
cd /var/www/ai20-src            # the git checkout
git pull origin main
npm ci

sudo mkdir -p /var/www/ai20-eu /var/www/ai20-us /var/www/ai20-apex

REGION=eu npm run build
sudo rsync -a --delete dist/ /var/www/ai20-eu/

REGION=us npm run build
sudo rsync -a --delete dist/ /var/www/ai20-us/

# Apex serves ONLY the chooser (no CSS/JS deps — inline styles + inline script)
sudo cp dist/region-select.html /var/www/ai20-apex/index.html
```

## Step 3 — nginx server blocks

Three blocks. **Keep the PHP-FPM `location /backend/` block identical to the one
already working on the current apex vhost** — both regional sites post leads to
`/backend/api/leads.php`, so the quiz/audit funnels break without it. Match the
existing `fastcgi_pass` socket exactly.

```nginx
# --- Apex: neutral chooser -------------------------------------------------
server {
    listen 443 ssl http2;
    server_name ai20.city www.ai20.city;

    root /var/www/ai20-apex;
    index index.html;

    location / {
        try_files /index.html =404;   # always the chooser
    }
}

# --- Europe ----------------------------------------------------------------
server {
    listen 443 ssl http2;
    server_name eu.ai20.city;

    root /var/www/ai20-eu;
    index index.html;

    # Directory-style local pages (/locations/berlin/plumbing/) need $uri/
    location / {
        try_files $uri $uri/ $uri.html =404;
    }

    location /backend/ {
        # COPY the existing working PHP-FPM config from the current vhost
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php8.x-fpm.sock;   # match existing
    }
}

# --- United States ---------------------------------------------------------
server {
    listen 443 ssl http2;
    server_name us.ai20.city;

    root /var/www/ai20-us;
    index index.html;

    location / {
        try_files $uri $uri/ $uri.html =404;
    }

    location /backend/ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php8.x-fpm.sock;   # match existing
    }
}
```

Then `sudo nginx -t && sudo systemctl reload nginx`.

### Required: 301 the retired city x niche x offer URLs

2,050 thin pages (`/locations/<city>/<niche>/<offer>.html`) were removed. They
are indexed, so redirect them to their parent niche page rather than letting
them 404. Add inside **both** regional server blocks, before `location /`:

```nginx
    # Retired Tier C pages -> their niche parent
    location ~ ^/locations/([^/]+)/([^/]+)/(?!index\.html$)[^/]+\.html$ {
        return 301 /locations/$1/$2/;
    }
```

### Also required: HTTPS redirect (from the SEO audit)

HTTP currently serves 200, duplicating the whole site:

```nginx
server {
    listen 80;
    server_name ai20.city www.ai20.city eu.ai20.city us.ai20.city;
    return 301 https://$host$request_uri;
}
```

## Step 4 — SSL (mandatory, not optional)

The apex already sends:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

`includeSubDomains` + `preload` means browsers will **refuse** to connect to
`eu.` / `us.ai20.city` over anything but valid HTTPS. Without certs the toggle
will still appear broken even once DNS resolves.

```bash
sudo certbot --nginx -d ai20.city -d www.ai20.city -d eu.ai20.city -d us.ai20.city
```

## Step 5 — Verify

```bash
curl -sI https://eu.ai20.city/ | head -1          # expect 200
curl -sI https://us.ai20.city/ | head -1          # expect 200

# Apex must be the chooser, not the EU site
curl -s https://ai20.city/ | grep -o "One firm"

# Region isolation
curl -s https://us.ai20.city/ | grep -o "Your AI Workforce, Institutionalized"
curl -s https://eu.ai20.city/ | grep -o "Intelligence, Institutionalized"

# Currency + a US-only page
curl -s https://us.ai20.city/offers.html | grep -oE '\$[0-9,]+' | head -3
curl -sI https://us.ai20.city/industries/home-services.html | head -1   # 200 on US
```

---

## Notes

- **`functions/_middleware.js` does nothing here.** It is a Cloudflare Pages
  Function for edge geo-suggestion. On nginx it is inert and harmless. The
  chooser still suggests a region client-side via timezone, and the
  `ai20_region` cookie (set on `.ai20.city`) persists the choice across
  subdomains. If you later want server-side geo, add nginx GeoIP2 and set the
  `ai20_geo` cookie to `us` or `eu`.
- **Redeploys:** re-run Step 2 for both regions on every release. Building only
  one region leaves the other stale.
- `dist/`, `locations/`, `services/`, and `sitemap.xml` are gitignored and
  regenerated by the build — never copy them from git.
