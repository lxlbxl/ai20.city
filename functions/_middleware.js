/*
 * Cloudflare Pages Function — apex region routing (runs on every request of the
 * deployment it ships with). It is a no-op on the us./eu. subdomains; it only
 * acts on the neutral apex (ai20.city / www.ai20.city).
 *
 * Behaviour on the apex:
 *   1. If the visitor already chose a region (ai20_region cookie) -> 302 to
 *      that subdomain immediately (fast, no client flash). `?stay` opts out so
 *      the chooser / header switcher can force the picker to show.
 *   2. Otherwise set a soft `ai20_geo` hint cookie from Cloudflare's IP country
 *      and let region-select.html render with the suggested card highlighted.
 *
 * Deploy note: put the same repo behind three Pages projects (apex, us, eu).
 * Only the apex needs this file to do anything; the guard below makes it safe
 * to ship in all three.
 */

const SUBS = { us: 'https://us.ai20.city', eu: 'https://eu.ai20.city' };

function readCookie(header, name) {
    if (!header) return null;
    const m = header.match(new RegExp('(?:^|; )' + name + '=([^;]+)'));
    return m ? m[1] : null;
}

export async function onRequest(context) {
    const { request, next } = context;
    const url = new URL(request.url);
    const host = url.hostname;

    // Only the neutral apex participates. Subdomains + previews pass through.
    const isApex = host === 'ai20.city' || host === 'www.ai20.city';
    if (!isApex) return next();

    const cookies = request.headers.get('Cookie') || '';
    const chosen = readCookie(cookies, 'ai20_region');
    const stay = url.searchParams.has('stay');

    // 1. Honor a prior choice.
    if (chosen && SUBS[chosen] && !stay) {
        return Response.redirect(SUBS[chosen] + url.pathname + url.search, 302);
    }

    // 2. Soft geo suggestion via a hint cookie the chooser reads.
    const country = (request.cf && request.cf.country) || request.headers.get('CF-IPCountry') || '';
    const suggested = country === 'US' ? 'us' : country ? 'eu' : '';

    const response = await next();
    if (suggested) {
        const res = new Response(response.body, response);
        res.headers.append(
            'Set-Cookie',
            `ai20_geo=${suggested}; Path=/; Domain=.ai20.city; Max-Age=86400; SameSite=Lax`
        );
        return res;
    }
    return response;
}
