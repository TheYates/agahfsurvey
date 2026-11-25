# PWA Completion Spec — AGA Health Foundation Survey

Status: Draft (awaiting approval)
Date: 2026-11-25
Scope: Make the existing Next.js survey app a properly installable, offline-capable PWA on shared clinic tablets.

---

## 1. Context

`agahfsurvey` is a Next.js 15 (App Router, React 19) patient-satisfaction survey deployed on Vercel, with Supabase as the backend. The survey lives at `/` (`app/page.tsx` → `components/survey-form.tsx`). Reports live under `/reports/*` and are gated client-side by `useSupabaseAuth()`.

### 1.1 Current PWA state (audited)

| Piece | File | Reality |
|---|---|---|
| Manifest | `public/manifest.json` | `start_url` is `/survey` — **a route that does not exist** (survey is `/`). No `scope`, no `id`, no `display_override`. `orientation: portrait`. Single SVG icon (`agahflogo white.svg`) marked `any maskable`. `screenshots: []`. |
| Manifest link | `app/layout.tsx` | Manual `<link rel="manifest">`, `<link rel="icon">` pointing to an SVG, hard-coded `<meta name="theme-color" content="#0ea5e9">`. |
| Service worker | `public/sw.js` | Hand-rolled, `CACHE_NAME = 'agahf-survey-v3'`. Precaches only `/` and `/submit`. Network-first (no caching) for URLs containing `/api/`, `/reports`, `/submit`, `/survey`. Cache-first for everything else. Offline miss returns **plain text** `503 "Offline - Please check your connection"`. `skipWaiting()` + `clients.claim()`. Has a `sync` listener that broadcasts `SYNC_REQUESTED` — **nothing in the app listens for it**. |
| Registration | `lib/offline/register-sw.ts` → `components/service-worker-registration.tsx` | Registers `/sw.js` at scope `/`; hourly `registration.update()`; update UX is a blocking `window.confirm("A new version is available. Reload to update?")`. |
| Offline queue | `lib/offline/db.ts`, `lib/offline/offline-context.tsx` | IndexedDB `agahf-survey-offline` v1, store `pending-submissions` (`id`, `timestamp`, `surveyData`, `synced`, `syncAttempts`, `lastSyncAttempt`, `error`). Queues when offline or when the POST fails; auto-syncs on the `online` event and via the "Sync Now" button in `components/offline-banner.tsx`. Cleans synced records older than 7 days. `deleteSubmission` / `clearAllSubmissions` exist but are unused. |
| Offline banner | `components/offline-banner.tsx` | Fixed banner shown when offline or when pending > 0; shows pending count, sync state, manual sync button. |
| Survey integration | `components/survey-form.tsx:252` | Calls `saveSubmission(formData)` from the offline context. |
| Submit API | `app/api/survey/submit/route.ts` → `lib/supabase/survey-submission.ts` | `POST` inserts into `survey_submissions`. **The row `id` is generated server-side per request** (`uuidv4()`), so identical retries create duplicate rows. |
| Middleware | `middleware.ts` | Sends `Cache-Control: no-store, no-cache, must-revalidate` for `/reports/*` to force fresh data. |

### 1.2 So what's actually wrong?

The app is "PWA-ish" but not installable or trustworthy offline:

1. **It cannot be installed properly.** No PNG icons at 192/512, no maskable icon, no screenshots, and the manifest `start_url` 404s. Chrome's install criteria fail.
2. **There is no install affordance.** Nothing captures `beforeinstallprompt`; staff have no way to know the app can be installed.
3. **Offline behavior is accidental.** A cold start on an uncached route returns unstyled plain text. `/reports` is explicitly never cached, yet staff need read-only reports offline.
4. **Retry/reload can duplicate survey rows** because the submission ID is server-generated.
5. **Failed syncs retry forever** with no cap or escalation.
6. **Update prompt is a blocking `window.confirm`** that can interrupt an in-progress survey.
7. **Cached authenticated report pages aren't purged on sign-out.**

---

## 2. Goals

- The app passes Chrome/Edge installability criteria and installs cleanly to an Android/ChromeOS home screen.
- Staff on shared clinic tablets see a clear, non-annoying install prompt (with manual "Add to Home Screen" guidance for iOS, where no programmatic prompt exists).
- Every read-only page (survey, thank-you, reports) opens while offline, with an honest indicator that data may be stale.
- Survey responses queue reliably offline and sync without creating duplicates, with a bounded retry policy.
- Deploys never leave a tablet running a stale service worker or stale JS bundles.
- Signing out removes cached authenticated content.

## 3. Non-goals

- No app-store packaging (no Capacitor/Cordova/TWA, no Play Store listing).
- No iOS splash screens, `apple-touch-icon` variants, or iOS-specific meta tags (accepted limitation — iOS users get written instructions only).
- No push notifications, background fetch of new survey data, or offline *submission* for reports/admin writes.
- No redesign of the survey or reports UI.
- No migration to Serwist/next-pwa — the hand-rolled `sw.js` stays (see D4).
- No change to Supabase auth mechanics.

---

## 4. Decisions from the interview

| # | Decision | Choice |
|---|---|---|
| D1 | Primary outcome | Both: full installable PWA polish **and** a visible install CTA. |
| D2 | Primary audience | Staff on shared clinic tablets (Android-first). Survey must still work for patients. |
| D3 | Install UX | In-app prompt via `beforeinstallprompt`, plus a one-time iOS "Add to Home Screen" guide. |
| D4 | Service worker approach | Keep the custom `public/sw.js`; no new PWA framework dependency. |
| D5 | Offline scope | All read-only pages: `/`, `/thank-you`, `/reports/*`. Writes and live queries still require network. |
| D6 | Offline cold start | Fall back to the cached survey (`/`) rather than a plain-text error. No separate `/offline` page. |
| D7 | Sync trigger | Keep auto-sync on reconnect + manual "Sync Now". |
| D8 | Duplicate protection | Yes — client-generated idempotency key per submission, enforced in API + DB. |
| D9 | Failed submissions | Cap auto-retry attempts, then flag for manual attention. |
| D10 | Icons | Generate PNG icons (192/512/maskable) from the existing SVG. |
| D11 | Theming | Emit light and dark `theme-color` metas via `prefers-color-scheme`. |
| D12 | Update UX | Replace `window.confirm` with a non-blocking toast/banner reload action. |
| D13 | Orientation | Remove the portrait lock; allow any orientation. |
| D14 | Manifest cleanup | Fix essentials **and** add real form-factor screenshots. |
| D15 | Stale data indicator | Extend the existing `OfflineBanner` with "showing cached content" + last-updated time. |
| D16 | Install prompt placement | Dismissible banner + a permanent "Install app" entry in `/settings`. |
| D17 | Verification | Lighthouse installability audit + manual device checks. |
| D18 | Hard constraint | Never serve a cached authenticated page after sign-out; purge caches on explicit sign-out. |
| D19 | iOS assets | No iOS-specific assets; instructions only. |
| D20 | Cache purge trigger | Explicit sign-out only (not session timeout, not sign-in). |
| D21 | Install banner dismissal | Re-prompt after 30 days; `/settings` entry always available. |
| D22 | Kiosk / managed browsers | Detect and hide install UI when it cannot work. |

---

## 5. Requirements

### R1 — Manifest correctness (`public/manifest.json`)

- `start_url: "/"` (fix the broken `/survey`).
- Add `"id": "/"` and `"scope": "/"`.
- Keep `name`, `short_name`, `description`, `display: "standalone"`, `background_color: "#ffffff"`.
- Remove `"orientation": "portrait"` (D13).
- Add `display_override: ["standalone", "minimal-ui"]`.
- `icons`: 192 and 512 PNG (`purpose: "any"`), 192 and 512 PNG (`purpose: "maskable"`), keep the SVG as an additional `image/svg+xml` `any` entry.
- `screenshots`: at least one `form_factor: "narrow"` (survey) and one `form_factor: "wide"` (reports), with `sizes` and `type: "image/png"`.
- Keep `categories`.
- Optional (only if trivial): `shortcuts` for "New survey" (`/`) and "Reports" (`/reports`).

### R2 — Icons generated from the existing mark

- Add `scripts/generate-pwa-icons.mjs` (one-off, committed) plus `sharp` as a **devDependency**.
- Input: `public/agahflogo.svg` (the colored/normal mark, not the white variant, so it stays visible on a light splash).
- Outputs in `public/icons/`:
  - `icon-192.png`, `icon-512.png`
  - `icon-maskable-192.png`, `icon-maskable-512.png` — logo padded to the ~80% safe zone on a solid brand-colored background (`#0ea5e9`).
- Rendering must preserve the logo's aspect ratio (contain, transparent for `any`, solid for `maskable`).
- Add an npm script: `"generate:icons": "node scripts/generate-pwa-icons.mjs"`.
- Assumption (confirm during implementation): `#0ea5e9` is the correct brand background for the maskable icon.

### R3 — Install prompt

New client component, e.g. `components/pwa/install-prompt.tsx`, rendered once in `app/layout.tsx` (inside `ThemeProvider`).

Behavior:
- Listen for `beforeinstallprompt`, `preventDefault()`, store the event.
- Detect standalone with `window.matchMedia("(display-mode: standalone)").matches || (navigator as any).standalone === true`.
- Detect iOS Safari: `/iPad|iPhone|iPod/.test(navigator.userAgent)` and not standalone.
- **Banner visibility:** only when not installed and either (a) a deferred prompt was captured, or (b) iOS Safari. Otherwise render nothing (covers kiosk/managed browsers, Firefox desktop, etc.).
- Banner CTA: Android/Chrome → call `prompt()` on the stored event, then hide permanently on `userChoice.outcome === "accepted"`; on `"dismissed"`, treat as a dismissal.
- iOS: show "Tap Share → Add to Home Screen" instructions (inline, no modal dependency required).
- Dismissal: store `{ dismissedAt }` in `localStorage` under a `agahf:pwa-install-dismissed` key; hide for **30 days**, then show again.
- Listen for `appinstalled` and hide immediately + clear the dismissal key.
- Visual style: reuse existing shadcn `Alert`/`Button` patterns and the `OfflineBanner` positioning language (fixed, top-center, `z-50`) — but must not overlap the offline banner. If both would show, stack or prioritize the offline banner (offline state is more important).
- Accessible: dismiss button has `aria-label="Dismiss install prompt"`, CTA is a real `<button>`.

New `/settings` section (`app/settings/page.tsx`):
- "Install app" row that always appears except when already installed.
- Installed → show a muted "Installed" state instead of a button.
- Clicking on Android/Chrome with no captured event re-checks/replays instructions; on iOS shows the Share instructions; on unsupported desktop shows a short "your browser doesn't support installing" note. Never render a dead button.

### R4 — Service worker caching strategy (`public/sw.js`)

Keep one file, but restructure it:

- **Cache names:** one versioned shell cache (`agahf-shell-v4`) plus separate runtime caches (`agahf-static-v4`, `agahf-pages-v4`). Bump the version on any change to `sw.js` or precache list.
- **Install:** precache `/` and `/thank-you` (replace the stale `/submit` entry only if `/submit` is still a real navigation target — it is a page, keep it if precached HTML is useful). Do **not** fail install if one precache URL 404s (`Promise.allSettled` or per-URL `catch`), because a single bad URL currently kills the whole install.
- **Activate:** delete every cache whose name isn't in the current version set, then `clients.claim()`.
- **Fetch routing:**
  - Non-GET → do not intercept (let the app's IndexedDB queue handle it).
  - `/_next/static/*`, `/_next/image*`, fonts, `/icons/*`, `/service-points-emojis/*` → **cache-first**, then network, then cache the response. These are content-hashed/static and safe.
  - `/api/*` → **network-only**. Never cache API responses (surveys and reports must be fresh; failure surfaces to the app).
  - Same-origin **navigations** (`request.mode === "navigate"`) → **network-first**, cache successful `text/html` responses in `agahf-pages-v4` keyed by URL, and on failure serve cached page → fallback to cached `/` → final fallback a minimal branded HTML string ("You're offline") with a reload button. **This must explicitly cache `/reports/*` responses even though `middleware.ts` sends `no-store`** (D5/D18). `Cache.put` is unaffected by response `Cache-Control`, but the middleware header must not be used as a reason to skip caching; conversely the SW must never re-serve a cached `/reports/*` page while the user is signed out (see R8).
  - Everything else same-origin (assets, JSON without `/api/`) → cache-first with runtime caching, as today.
- **Never cache:** any request with a non-200 status, redirects (`response.redirected`), `Cache-Control: no-store` **API** responses, or cross-origin requests.
- **Message channel:** handle `postMessage` commands from the app:
  - `{ type: "CLEAR_PRIVATE_CACHES" }` → delete all `/reports/*` entries from `agahf-pages-v4` and reply `{ type: "PRIVATE_CACHES_CLEARED" }`.
  - `{ type: "SKIP_WAITING" }` → `self.skipWaiting()` so the toast "Reload" path can activate the new worker deterministically.
- Remove or implement the dead `sync` / `SYNC_REQUESTED` listener. Given the app already syncs on the `online` event and via a button, **remove** it rather than adding a message listener nobody uses.

### R5 — Offline cold start

- Follow the fetch chain in R4: cached page → cached `/` → branded inline offline HTML.
- The inline fallback must be a small standalone HTML document (inline CSS, no framework) with the app name, "You're offline", and a Reload button that calls `location.reload()`.
- No new `/offline` route (D6).

### R6 — Idempotent sync (duplicate protection)

**Client:**
- When a survey is completed (online or offline), generate a stable key once: `crypto.randomUUID()`; store it on the IndexedDB record as `clientSubmissionId`.
- Include it in every POST body as `clientSubmissionId` — both the direct-online path and the queued-sync path in `lib/offline/offline-context.tsx`.
- Reuse the same key on every retry of that record; never regenerate.
- If `crypto.randomUUID` is unavailable, fall back to `offline-${Date.now()}-${random}`.

**API (`app/api/survey/submit/route.ts` + `lib/supabase/survey-submission.ts`):**
- Accept optional `clientSubmissionId` and use it as the `survey_submissions.id` **instead of** the server `uuidv4()`. `survey_submissions.id` is already `UUID PRIMARY KEY DEFAULT uuid_generate_v4()`, so no migration is required and the DB enforces uniqueness.
- On insert conflict (`23505` unique violation), return `{ success: true, id: clientSubmissionId, deduplicated: true }` with HTTP 200. A retry of an already-stored survey must not look like a failure to the app.
- Keep server-generated UUID when the field is absent (backward compatibility with any other callers).
- Do **not** log the key or survey answers.

**Schema:** no migration expected. Verify the live table's `id` is `UUID PRIMARY KEY` before relying on this; if it is not, add a `client_submission_id UUID UNIQUE` column with a migration in `supabase/migrations/`.

### R7 — Bounded retry policy

- Add `MAX_SYNC_ATTEMPTS = 5` in the offline layer.
- `syncPendingSubmissions` skips records with `syncAttempts >= MAX_SYNC_ATTEMPTS` unless the user explicitly taps a per-record "Retry" (or "Retry all").
- Records at the cap move to a `status: "needs-attention"` state in the banner: "N responses couldn't be uploaded. Check connection or contact support." Include the last error and attempt count behind a details expander.
- Do not delete or auto-discard failed records. `cleanupOldSubmissions` already only removes **synced** records older than 7 days — keep that.
- Add `getFailedSubmissions()`/`retrySubmission(id)` helpers in `lib/offline/db.ts` and expose them via `OfflineProvider` as needed.

### R8 — Auth-aware cache purge

- On **explicit sign-out only** (D20), in `contexts/supabase-auth-context.tsx`'s `signOut` flow (not on `SIGNED_OUT` events caused by timeout/refresh):
  - `postMessage({ type: "CLEAR_PRIVATE_CACHES" })` to the active service worker.
  - Also clear the in-memory/report client caches if any (see `lib/cache`).
- **Do not** clear the IndexedDB survey queue on sign-out — pending survey responses belong to patients, not the signed-out staff account. This is an explicit requirement to avoid data loss.
- After sign-out, a navigation to `/reports/*` must not render a cached report before the client-side auth guard redirects; the purge above is the guarantee, and the fetch handler must not serve cached `/reports` HTML to an unauthenticated document if the purge has run.
- Session timeout (`components/ui/session-timeout-alert.tsx`) is **not** a purge trigger (D20), but it should still redirect to login as today.

### R9 — Update UX (no `window.confirm`)

- In `lib/offline/register-sw.ts`, remove the `window.confirm` block.
- On `updatefound` → `installing.statechange === "installed"` with an existing controller, notify the app (custom event or callback) instead of blocking.
- Add a small client component `components/pwa/update-toast.tsx` that renders a persistent toast/banner: "A new version is available" with **Reload**.
- Reload action: `postMessage({ type: "SKIP_WAITING" })` → wait for `controllerchange` → `window.location.reload()`.
- The toast must be dismissible and must not steal focus or block form input. If the user is mid-survey, dismissing it keeps the old version until the next reload.
- Keep the hourly `registration.update()`; also call `registration.update()` when the tab becomes visible (`visibilitychange`), since tablets are often left open for days.

### R10 — Offline reports + stale indicator

- `OfflineBanner` gains a third state (or a variant): when offline **and** the current document was served from cache, show "Showing cached content — last updated {time}".
- The service worker sets `X-Served-From-Cache: true` and `X-Cached-At: <ISO>` on responses it serves from cache; the app reads `performance`/`fetch` headers where feasible. Simpler acceptable implementation: the SW writes the page cache timestamp into a `agahf:last-cache-time` value in Cache Storage metadata, and a client hook shows the *approximate* last-online timestamp from `localStorage` updated on each successful navigation. Pick the simpler `localStorage` approach if header propagation through `next/navigation` is unreliable; document the choice.
- Reports render offline in a read-only sense; any action that requires Supabase (filters that refetch, exports that query) must fail gracefully with an inline "You're offline" message rather than hanging. Wrap fetches in the existing error path and surface the offline state.
- Never show stale data without the banner.

### R11 — Theming & meta

- Replace the hard-coded `<meta name="theme-color">` in `app/layout.tsx` with Next's `viewport` export:
  - light: `#0ea5e9`
  - dark: a dark surface color consistent with the app's dark theme (match `tailwind.config.ts`/`globals.css` background; do not invent a new palette).
- Keep `metadata.icons` but point it at the generated PNGs (`/icons/icon-192.png`) plus the SVG.
- Keep `theme_color`/`background_color` static in the manifest (manifests cannot respond to `prefers-color-scheme`); use the light values there.
- Leave `apple-mobile-web-app-*` meta out (D19).

### R12 — Screenshots

- Run the app locally, capture:
  - `public/screenshots/survey-narrow.png` — 1080×1920-ish (or 390×844 at 2x), survey top.
  - `public/screenshots/reports-wide.png` — 1920×1080-ish, reports dashboard.
- Reference them in the manifest with `form_factor` and correct `sizes`.
- Screenshots must reflect the real UI (no mockups) and must not contain patient data, emails, or auth tokens.

---

## 6. File-level plan

| File | Change |
|---|---|
| `public/manifest.json` | Rewrite per R1. |
| `public/sw.js` | Restructure per R4/R5/R10; remove dead sync listener. |
| `public/icons/*` | New generated PNGs (R2). |
| `public/screenshots/*` | New real screenshots (R12). |
| `scripts/generate-pwa-icons.mjs` | New icon generation script (R2). |
| `package.json` | Add `sharp` devDependency + `generate:icons` script. |
| `app/layout.tsx` | Add `viewport` export (R11), render `InstallPrompt` and `UpdateToast`. |
| `components/pwa/install-prompt.tsx` | New (R3). |
| `components/pwa/update-toast.tsx` | New (R9). |
| `components/offline-banner.tsx` | Add cached-content/stale state + needs-attention state (R7/R10). |
| `lib/offline/register-sw.ts` | Remove `window.confirm`; emit update event; visibility-triggered update check; expose `clearPrivateCaches()` and `applyUpdate()` helpers (R8/R9). |
| `lib/offline/db.ts` | Add `clientSubmissionId`, `status`, `getFailedSubmissions`, `retrySubmission`; keep 7-day cleanup of synced records. |
| `lib/offline/offline-context.tsx` | Pass idempotency key, retry cap, failure state, expose manual retry (R6/R7). |
| `app/api/survey/submit/route.ts` | Accept `clientSubmissionId`; treat `23505` as success (R6). |
| `lib/supabase/survey-submission.ts` | Use the client key as row id (R6). |
| `contexts/supabase-auth-context.tsx` | Purge private caches on explicit sign-out (R8). |
| `app/settings/page.tsx` | Install-app row/state (R3). |
| `middleware.ts` | No change required; document that `/reports` `no-store` is intentionally overridden by the SW page cache, and that sign-out purge is what protects auth freshness. |

---

## 7. Edge cases to handle

| Scenario | Expected behavior |
|---|---|
| Tablet has never visited the app, then goes offline | Inline branded offline page with Reload. No crash, no plain-text 503. |
| Installed, launched offline from home screen | Shell/`/` from precache renders; offline banner visible. |
| User navigates to `/reports` offline while signed in | Cached report renders + stale banner. |
| User signs out, then presses Back to a report | Cache purged; auth guard redirects to `/auth/login`; no cached report body flashes. |
| Sync succeeds but the response is lost (network dies after insert) | Retry hits `23505` → treated as success → no duplicate. |
| Same queued record retried 6 times | Auto-sync stops at 5; banner shows needs-attention with manual retry. |
| User submits online twice quickly | Same `clientSubmissionId` per survey attempt; UI also disables Submit while pending (existing `isSubmitting`). Two distinct submissions still get distinct keys. |
| New deploy while tablet is on an old version | Hourly/visibility update check finds new SW → non-blocking toast → Reload applies it; old caches deleted on activate. |
| `beforeinstallprompt` never fires (Firefox, kiosk) | Banner hidden; `/settings` shows a plain "not supported in this browser" note. |
| Already installed | Banner hidden, `/settings` shows "Installed". |
| Install banner dismissed | Hidden 30 days, then returns; `/settings` entry still works. |
| App opened in a desktop browser | No install banner; settings shows unsupported/installed state. |
| No `crypto.randomUUID` (old WebView) | Fallback key format from R6. |
| Precache URL returns 404 during install | Install still succeeds (per-URL error tolerance). |
| `localStorage`/IndexedDB disabled | App must not crash: install prompt hides, queue errors surface as toast, survey still posts online. |

---

## 8. Acceptance criteria

Installability / Lighthouse:
- [ ] Chrome DevTools → Application → Manifest: no errors; `start_url` resolves; 192 & 512 icons present; maskable icon present; screenshots parse.
- [ ] Lighthouse PWA/installability audit passes (or all remaining failures are documented and justified).
- [ ] "Install" affordance appears in Chrome on Android/desktop and, when accepted, the app opens standalone at `/`.
- [ ] Installed app shows the correct icon and splash background.

Offline:
- [ ] Airplane mode + cold start → survey renders and is usable.
- [ ] Airplane mode + `/reports` (previously visited, signed in) → report renders with stale banner.
- [ ] Airplane mode + `/thank-you` → renders.
- [ ] Unvisited route offline → branded offline fallback, never plain text.
- [ ] Completing a survey offline shows "Saved offline", increments pending count, survives a full app kill, and appears in Supabase after reconnect.

Data integrity:
- [ ] Simulated duplicate POST with the same `clientSubmissionId` returns success and creates exactly one row.
- [ ] Queued record with a forced failure increments `syncAttempts` and stops auto-retrying at 5.
- [ ] No survey responses are lost on sign-out or cache purge.

Freshness / security:
- [ ] Sign-out purges cached report pages; Back does not reveal them.
- [ ] After a deploy, a tablet on the old version receives the update toast and reloads into the new build; no stale `_next/static` chunk errors.
- [ ] No API response is served from cache.

UX:
- [ ] Update prompt is non-blocking and appears mid-survey without stealing focus.
- [ ] Install banner and offline banner do not overlap.
- [ ] Dark-mode users get the dark `theme-color`.

---

## 9. Verification plan

Manual (required, on a real or emulated Android tablet):
1. `npm run build && npm start`; load `/` in Chrome.
2. Application panel: manifest fields, SW activated, caches created (`agahf-shell-v4`, `agahf-pages-v4`, `agahf-static-v4`).
3. DevTools → Network → Offline; reload `/`, `/reports`, `/thank-you`, and an unvisited path.
4. Submit a survey offline; kill the tab; reopen; verify pending count; go online; verify sync and a single Supabase row.
5. Install via the banner; launch from home screen; verify standalone.
6. Trigger a new deploy/build; verify the update toast and reload.
7. Sign out; verify `/reports` cache is empty via the Application → Cache Storage panel.

Lighthouse:
- Run the Lighthouse PWA/installability category (or Chrome's installability check, since Lighthouse's PWA category changes across versions) at mobile emulation against the production build; record the report and the remaining warnings in the PR description.

Automated: none required by this spec (manual + Lighthouse was chosen, D17). Any existing `npm run lint` / `tsc --noEmit` must stay clean for touched files.

Note: `next.config.mjs` currently sets `typescript.ignoreBuildErrors` and `eslint.ignoreDuringBuilds`, so a green `npm run build` does **not** prove the code typechecks — run `npx tsc --noEmit` explicitly.

---

## 10. Risks / trade-offs

- **Caching `/reports` overrides a deliberate `no-store` decision.** This is the main behavioral change. Mitigations: stale banner, sign-out purge, network-first so fresh data wins whenever online.
- **Custom SW means manual precache lists.** Adding a new top-level route won't be available offline until listed or visited once. Acceptable per D4; document it in the SW header comment.
- **Client-supplied row IDs.** A malicious client could theoretically choose a colliding UUID; collisions only cause that submission to be dropped, matching the idempotency contract, and require a valid UUID. Low risk for this app.
- **No iOS splash/icon work.** iPhone users get a generic splash and instructions only (D19).
- **`skipWaiting` + `clients.claim`** means updates activate immediately once the new worker installs; the toast gives the user control over the reload, but an old page may briefly talk to a new SW. Standard trade-off, previously accepted by the existing code.
- **Retry cap could strand responses** on a permanently broken connection. Mitigation: manual retry + visible error text; records are never deleted.

## 11. Implementation notes (2026-11-25)

Implemented as specified except for these deviations:

- **Wide screenshot is the survey home screen, not reports** (`public/screenshots/home-wide.png`). Reports require sign-in so no real reports shot could be captured headlessly. Swap in a genuine reports screenshot (no patient data) later and update the manifest label.
- **`/submit` was dropped from the precache list** in favour of `/thank-you` (`precache: /`, `/thank-you`, `/icons/icon-192.png`). `/submit` still caches on first visit via the runtime navigation cache.
- **Uncached private URL offline serves the survey shell**, per the R4 fallback chain (cached page -> cached `/` -> inline fallback). The original draft briefly served the inline fallback for private paths instead; this was reverted to match the spec.
- Install banner uses `bottom-4` positioning; the offline banner stays at `top-4`, so they never overlap.
- `sharp@^0.34.5` was added to `devDependencies` for the icon script (already present in `node_modules`; run `npm install` to reconcile the lockfile).
- `clientSubmissionId` intentionally flows through legacy `submitSurvey()`/server-action path? No — the legacy `/submit` server action was left untouched (out of scope); only the `/api/survey/submit` path used by the real survey form carries the key.

Verified: `tsc --noEmit` clean on all touched files (remaining repo errors are pre-existing `database.types` drift in `location-actions`/etc.); `npm run build` green; manifest/icons/screenshots/SW all serve 200 on a production build; light+dark `theme-color` metas render; a headless-Chrome CDP harness confirmed SW activation, versioned caches, precached `/`, runtime page caching, survey-shell fallback for uncached offline navigations, offline banner copy, and that `/api/*` is never served from cache. Real-device install + Lighthouse audit still to be done on a tablet.

## 12. Open questions (non-blocking)

1. Confirm `#0ea5e9` is the approved maskable background color.
2. Confirm `/submit` should remain precached (it's a simplified duplicate form; if it's dead UI, drop it from the cache list).
3. Should "Install app" also appear in the existing `components/context-menu.tsx` or a header, or is `/settings` enough?
4. For the needs-attention state, is there an existing support contact/email to display, or should the copy stay generic?
