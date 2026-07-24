#!/usr/bin/env bash
# deploy/verify.sh — proves the live site is actually ready for ranking,
# rather than just "the files are on disk". Run after every deploy.
#
# Exits non-zero if anything fails, so it can be used as a release gate.

set -uo pipefail
pass=0
fail=0

check() {
    local desc="$1" got="$2" want="$3"
    if [ "$got" = "$want" ]; then
        printf '  \033[1;32mOK\033[0m   %s\n' "$desc"
        pass=$((pass+1))
    else
        printf '  \033[1;31mFAIL\033[0m %s (got: %s, want: %s)\n' "$desc" "$got" "$want"
        fail=$((fail+1))
    fi
}

check_contains() {
    local desc="$1" haystack="$2" needle="$3"
    if echo "$haystack" | grep -qF -- "$needle"; then
        printf '  \033[1;32mOK\033[0m   %s\n' "$desc"
        pass=$((pass+1))
    else
        printf '  \033[1;31mFAIL\033[0m %s (did not find: %s)\n' "$desc" "$needle"
        fail=$((fail+1))
    fi
}

echo "== HTTPS reachability =="
check "eu.ai20.city returns 200"  "$(curl -s -o /dev/null -w '%{http_code}' https://eu.ai20.city/ --max-time 10)" "200"
check "us.ai20.city returns 200"  "$(curl -s -o /dev/null -w '%{http_code}' https://us.ai20.city/ --max-time 10)" "200"
check "ai20.city returns 200"     "$(curl -s -o /dev/null -w '%{http_code}' https://ai20.city/ --max-time 10)" "200"

echo ""
echo "== HTTP -> HTTPS redirect (SEO-AUDIT.md P0 #2) =="
check "http://ai20.city redirects (301)"    "$(curl -s -o /dev/null -w '%{http_code}' http://ai20.city/ --max-time 10)" "301"
check "http://eu.ai20.city redirects (301)" "$(curl -s -o /dev/null -w '%{http_code}' http://eu.ai20.city/ --max-time 10)" "301"
check "http://us.ai20.city redirects (301)" "$(curl -s -o /dev/null -w '%{http_code}' http://us.ai20.city/ --max-time 10)" "301"

echo ""
echo "== Apex is the neutral chooser, not a regional site =="
check_contains "apex serves the chooser" "$(curl -s https://ai20.city/ --max-time 10)" "One firm"

echo ""
echo "== Region isolation =="
check_contains "EU hero copy present"  "$(curl -s https://eu.ai20.city/ --max-time 10)" "Intelligence, Institutionalized"
check_contains "US hero copy present"  "$(curl -s https://us.ai20.city/ --max-time 10)" "Your AI Workforce, Institutionalized"
check_contains "EU pricing in EUR"     "$(curl -s https://eu.ai20.city/offers.html --max-time 10)" "€"
check_contains "US pricing in USD"     "$(curl -s https://us.ai20.city/offers.html --max-time 10)" '$'

echo ""
echo "== Retired Tier C URLs 301 instead of 404 (docs/DEPLOY-VPS.md) =="
tierc_eu="$(curl -s -o /dev/null -w '%{http_code}' https://eu.ai20.city/locations/berlin/hvac/ai-receptionist.html --max-time 10)"
check "EU retired Tier C URL redirects" "$tierc_eu" "301"

echo ""
echo "== robots.txt / sitemap =="
check "eu robots.txt reachable" "$(curl -s -o /dev/null -w '%{http_code}' https://eu.ai20.city/robots.txt --max-time 10)" "200"
check "us robots.txt reachable" "$(curl -s -o /dev/null -w '%{http_code}' https://us.ai20.city/robots.txt --max-time 10)" "200"
check_contains "eu robots.txt points at its own sitemap" "$(curl -s https://eu.ai20.city/robots.txt --max-time 10)" "eu.ai20.city/sitemap.xml"
check_contains "us robots.txt points at its own sitemap" "$(curl -s https://us.ai20.city/robots.txt --max-time 10)" "us.ai20.city/sitemap.xml"

echo ""
echo "== Backend funnel endpoint reachable (quiz/audit forms) =="
check "EU /backend/api/leads.php responds (not 502/504)" "$(curl -s -o /dev/null -w '%{http_code}' -X POST https://eu.ai20.city/backend/api/leads.php --max-time 10)" "400"

echo ""
echo "=================================================="
echo " $pass passed, $fail failed"
echo "=================================================="
[ "$fail" -eq 0 ]
