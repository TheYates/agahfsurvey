/* AGAHF Survey service worker.
 *
 * Strategy:
 * - Precache the survey shell (/, /thank-you and key icons) on install.
 * - Same-origin navigations (including /reports/*): network-first,
 *   cache successful HTML in the pages cache. Served from cache when offline
 *   with X-Served-From-Cache headers. Uncached navigations fall back to the
 *   cached survey shell, then to an inline branded offline page.
 * - Hashed/static assets (/_next/static, /icons, /service-points-emojis):
 *   cache-first with runtime caching.
 * - /api/* and non-GET requests: network-only, never cached.
 *
 * NOTE: middleware.ts sets `no-store` on /reports/* to keep data fresh.
 * The SW deliberately caches report *page HTML* so staff can read reports
 * offline; freshness is protected by network-first ordering, the stale banner
 * (OfflineBanner), and a cache purge on explicit sign-out
 * (message type CLEAR_PRIVATE_CACHES).
 *
 * If you add a new top-level route that must work on a cold offline start,
 * add it to PRECACHE_URLS below. Every other previously visited page is
 * cached on first successful navigation automatically.
 */

const VERSION = "v4";
const SHELL_CACHE = `agahf-shell-${VERSION}`;
const PAGES_CACHE = `agahf-pages-${VERSION}`;
const STATIC_CACHE = `agahf-static-${VERSION}`;
const MANAGED_CACHES = [SHELL_CACHE, PAGES_CACHE, STATIC_CACHE];

const PRECACHE_URLS = ["/", "/thank-you", "/icons/icon-192.png"];

// URL path prefixes that must only be served to signed-in staff.
const PRIVATE_PATHS = ["/reports", "/settings", "/admin", "/feedback"];

// Install: precache the shell. Tolerate individual failures so one bad URL
// cannot break the whole install.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) =>
      Promise.allSettled(
        PRECACHE_URLS.map((url) =>
          fetch(url, { credentials: "same-origin" }).then((response) => {
            if (!response || response.status !== 200) {
              throw new Error(`Precache failed for ${url}: ${response && response.status}`);
            }
            return cache.put(url, response);
          })
        )
      ).then((results) => {
        const failed = PRECACHE_URLS.filter((_, i) => results[i].status === "rejected");
        if (failed.length > 0) {
          console.warn("SW precache skipped:", failed.join(", "));
        }
      })
    )
  );
  self.skipWaiting();
});

// Activate: delete caches from older versions, then take control.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter(
              (name) =>
                (name.startsWith("agahf-shell-") ||
                  name.startsWith("agahf-pages-") ||
                  name.startsWith("agahf-static-") ||
                  name.startsWith("agahf-survey-")) &&
                !MANAGED_CACHES.includes(name)
            )
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

const isSameOrigin = (url) => url.origin === self.location.origin;

const isStaticAsset = (pathname) =>
  pathname.startsWith("/_next/static/") ||
  pathname.startsWith("/icons/") ||
  pathname.startsWith("/service-points-emojis/") ||
  pathname.startsWith("/_next/image") ||
  /\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|eot|css|js|json|txt|webmanifest)$/.test(
    pathname
  );

const isPrivatePath = (pathname) =>
  PRIVATE_PATHS.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

const addCacheMeta = (response, cachedAt) => {
  const headers = new Headers(response.headers);
  headers.set("X-Served-From-Cache", "true");
  headers.set("X-Cached-At", cachedAt);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

const stampAndStore = (cache, request, response) =>
  cache
    .put(
      request,
      addCacheMeta(response.clone(), new Date().toISOString())
    )
    .catch(() => {});

// Branded last-resort offline page (inline, no framework).
const offlineFallbackHtml = () => `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Offline — AGA Health Foundation Survey</title>
<style>body{font-family:system-ui,-apple-system,sans-serif;background:#f8fafc;color:#0f172a;display:flex;min-height:100vh;margin:0;align-items:center;justify-content:center;padding:24px}main{text-align:center;max-width:22rem}h1{font-size:1.25rem;margin:0 0 .5rem}p{color:#64748b;margin:0 0 1.5rem}button{background:#0ea5e9;color:#fff;border:0;border-radius:.5rem;padding:.75rem 1.5rem;font-size:1rem;cursor:pointer}</style>
</head><body><main>
<h1>You&rsquo;re offline</h1>
<p>The AGA Health Foundation Survey needs a connection for this page. Please reconnect and try again.</p>
<button onclick="location.reload()">Reload</button>
</main></body></html>`;

const offlineFallback = () =>
  new Response(offlineFallbackHtml(), {
    status: 503,
    statusText: "Service Unavailable",
    headers: new Headers({ "Content-Type": "text/html; charset=utf-8" }),
  });

// Navigation: network-first -> cached page (stamped) -> cached survey shell -> inline fallback.
const handleNavigation = async (event) => {
  const { request } = event;
  const pathname = new URL(request.url).pathname;

  try {
    const response = await fetch(request);
    if (response && response.status === 200 && !response.redirected) {
      const cache = await caches.open(PAGES_CACHE);
      await stampAndStore(cache, request, response);
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;

    // Open the survey shell so staff/patients can keep working offline.
    // Fall back to the cached survey shell so staff/patients can keep
    // working offline; last resort is the branded inline offline page.
    // (No leak risk: this is the public shell, not private content. Cached
    // private pages are purged on explicit sign-out via CLEAR_PRIVATE_CACHES.)
    const shell = await caches.match("/");
    return shell || offlineFallback();
  }
};

const handleStaticAsset = async (event) => {
  const cached = await caches.match(event.request);
  if (cached) return cached;

  try {
    const response = await fetch(event.request);
    if (
      response &&
      response.status === 200 &&
      response.type === "basic" &&
      isSameOrigin(new URL(event.request.url))
    ) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(event.request, response.clone()).catch(() => {});
    }
    return response;
  } catch (error) {
    return offlineFallback();
  }
};

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and extension requests.
  if (request.method !== "GET") return;
  if (!isSameOrigin(url)) return;
  if (url.protocol.startsWith("chrome-extension")) return;

  // API: network-only, never cached or served from cache.
  if (url.pathname.startsWith("/api/")) return;

  // Navigations: network-first with offline fallbacks.
  if (request.mode === "navigate") {
    event.respondWith(handleNavigation(event));
    return;
  }

  // Static/hashed assets: cache-first.
  if (isStaticAsset(url.pathname)) {
    event.respondWith(handleStaticAsset(event));
    return;
  }

  // Everything else same-origin GET (data JSON etc.): network-first,
  // fall back to cache, never serve the plain-text error.
  event.respondWith(
    fetch(request)
      .then((response) => response)
      .catch(() =>
        caches.match(request).then((cached) => cached || offlineFallback())
      )
  );
});

// Message channel from the app.
self.addEventListener("message", (event) => {
  const data = event.data || {};

  // Purge cached private (authenticated) pages on explicit sign-out.
  if (data.type === "CLEAR_PRIVATE_CACHES") {
    event.waitUntil(
      caches
        .open(PAGES_CACHE)
        .then((cache) =>
          cache.keys().then((requests) =>
            Promise.all(
              requests
                .filter((req) => isPrivatePath(new URL(req.url).pathname))
                .map((req) => cache.delete(req))
            )
          )
        )
        .then(() => {
          const client = event.source;
          if (client && client.postMessage) {
            client.postMessage({ type: "PRIVATE_CACHES_CLEARED" });
          }
        })
    );
    return;
  }

  // Let the update toast activate a waiting worker deterministically.
  if (data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
