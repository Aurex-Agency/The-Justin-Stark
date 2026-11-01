# Phase 1: Box Top Launch Funnel (ad landing page)

**Status:** draft for approval · **Owner:** Kalob (Aurex) · **Client:** Justin Stark
**Event:** The Box Top Method live Zoom launch · **Monday, November 9, 2026 · 10AM PT / 11AM MT / 12PM CT / 1PM ET** (18:00 UTC; Central is on CST by then)
**Today:** Sunday, November 1, 2026. That leaves **8 days**. Every day the build slips is roughly one-sixth less ad time.

---

## 1. What this funnel has to do

Paid traffic lands on one page, registers for the Zoom in one step, and gets reminded until it shows up. Then attendance drives the Box Top Review (the canon name for Justin's one-on-one conversation).

| Rank | Conversion | Where it's measured |
|---|---|---|
| Primary | Registration (person is registered **in Zoom** and **in GHL**) | Meta `CompleteRegistration`, GHL pipeline stage "Registered" |
| Secondary | Shows up live | Zoom attendance, synced to GHL "Attended Live" |
| Tertiary | Books a Box Top Review | GHL calendar booking, stage "Review Booked" |

The ads optimize for the primary. The GHL build (Phase 2) turns registrations into attendance and attendance into reviews.

## 2. Facts the page uses, and where each comes from

Nothing goes on the page that isn't on this list or approved by Justin.

| Fact | Source (Drive) |
|---|---|
| Title: *The Box Top Method: How to See Your Whole Retirement Picture Before You Move a Single Dollar* | Brand Guide |
| Author line: BY JUSTIN L STARK · Publisher: Game Changer Publishing | Brand Guide, GCP countdown post (Assets/Images/unnamed.jpg) |
| Launch: Mon Nov 9, 2026, 10AM PT / 11AM MT / 12PM CT / 1PM ET, live on Zoom | START HERE toolkit, Countdown captions, Talk show reads |
| Existing Zoom webinar registration: `us02web.zoom.us/webinar/register/WN_bjdBGZXbSoOfl3x2_XPqHQ` | START HERE toolkit |
| Thesis: "Most people don't have a money problem. They have a clarity problem." · "Clarity precedes confidence." | Brand Guide, Synopsis |
| The Four Corners: where your money sits (liquidity ladder) · what you want it to do (time, cash flow, cash) · how it's taxed (three tax buckets) · how it works (safety, growth, access) | Synopsis, Countdown captions |
| Five live-attendee bonuses: The Box Top Training (4 modules), Legacy Trust Finder, The Box Top Quiz (14 questions: retiree type, Four Corners clarity score, biggest gap), Legacy Planning Packet (16 pp fillable), Legacy & Business Planning Packet (22 pp fillable), "and a few more things I'm saving for the live" | Book Launch: Giveaway Posts doc |
| Justin's road: blue-collar North Mississippi, Marine Corps infantry and scout sniper, police officer, church-planting pastor, a decade in Medicare and retirement planning; owner of Pontotoc Insurance Agency; MedicareCon stage | Synopsis, PRODUCT.md |
| Education only; no product named, recommended or priced; stories are fictional composites | Brand Guide, book disclaimer page |

**Not available, so not used:** testimonials, endorsements, registration counts, press quotes, sales figures. If Game Changer Publishing has early-reader blurbs, we add them once Justin approves the exact wording.

## 3. URL map

Everything lives under `thejustinstark.com`, same repo, same Vercel project, same deploy flow as `/big-table/`.

| URL | What it is | Phase |
|---|---|---|
| `/theboxtop/launch/` | **The ad landing page** (registration) | 1 |
| `/theboxtop/launch/thanks/` | Confirmation page (join link, calendar, 1-question survey) | 1 |
| `/theboxtop/` | Future Box Top hub (Phase 3). **Until then, a temporary (307) redirect to `/theboxtop/launch/`** | 1 (redirect) → 3 |
| `/boxtop` | Vanity redirect for talk shows and print, appends `utm_source=vanity&utm_medium=offline` | 1 |
| `/privacy/` `/terms/` | Site-wide privacy policy and terms with an SMS section (required for A2P SMS registration, and expected by Meta on a lead-collecting page) | 1 |
| `/theboxtop/bonuses/` | Attendee bonus vault (noindex) | 1b (live by Nov 9, 1PM CT) |
| `/theboxtop/replay/` | Launch replay (noindex) | 1b (live Nov 9 evening) |

Why `/theboxtop/launch/` and not `/theboxtop/` for the ads: the ad URL never has to change, and `/theboxtop/` is free to become the book's permanent home in Phase 3 without breaking a single ad, email, or bio link.

Redirects go in a new `vercel.json` (the repo has none today). Nothing else in Vercel's default behavior changes.

## 4. The registration flow (one form, registered everywhere)

The key decision. Today the posts send people straight to Zoom's own page, which means Zoom has the registrant and GHL never hears about it, and no ad attribution survives. The funnel fixes that:

```
Visitor (from ad, UTMs + fbclid on the URL)
  └─ /theboxtop/launch/  form: first name, last name, email, mobile (optional), SMS consent
       └─ POST /api/boxtop-register   (new Vercel function, same pattern as /api/meta)
            1. Validate + spam checks (honeypot, minimum fill time)
            2. Zoom API: add webinar registrant  → personal join_url + registrant_id
            3. GHL inbound webhook: contact + every attribution field + join_url
            4. Meta Conversions API: CompleteRegistration (hashed email/phone, fbc/fbp, shared event_id)
            5. Respond { ok, join_url, event_id }
       └─ /theboxtop/launch/thanks/  browser pixel fires CompleteRegistration with the same event_id (Meta dedupes)
```

Why server-side Zoom registration matters:
- **One step for the visitor.** No second form on Zoom's page (every extra step loses people).
- **Personal join link in GHL.** Zoom webinars that require registration only admit people through their own link. GHL gets that link, so every reminder email and text carries a one-tap join button.
- **Attribution survives.** UTMs, fbclid and the ad name ride along into GHL and into Meta.

### Failure handling (never lose a lead)
| What fails | What happens |
|---|---|
| Zoom API errors or times out (6s) | Contact still goes to GHL with `zoom_status=failed` + internal alert. Thank-you page shows "One last step: confirm your seat on Zoom" with the existing Zoom registration link. |
| GHL webhook fails | Person is still registered in Zoom (Zoom sends its own confirmation). Error logged in Vercel; we reconcile from the Zoom registrant list. |
| Both fail / function down | Browser falls back to opening the existing Zoom registration page. |
| Same person registers twice | Zoom returns their existing registration (to be confirmed in testing); GHL upserts the same contact by email. |

### Plan B if Zoom API credentials can't be had within 24 hours
Same page, same GHL capture and pixel, but the thank-you page becomes "Step 2 of 2: confirm your seat on Zoom" (button to the existing Zoom page). Works, but loses a share of people at step 2 and GHL won't hold personal join links. **Plan A is strongly preferred.** (If you already pay for Zapier, its Zoom "create webinar registrant" action is a Plan A-lite: same result without our function's Zoom code, but one more tool and one more failure point.)

## 5. Page architecture: `/theboxtop/launch/`

Mobile first: almost all Meta traffic opens in the Facebook/Instagram in-app browser on a phone. Built in the **Box Top brand**, not the dark/gold homepage look (the Brand Guide assigns the book, the launch, and thejustinstark.com Box Top work to this kit).

Copy below is direction in Justin's voice, following the Brand Guide: short sentences, contractions, **no em dashes**, canon words only, times west to east. Justin approves final copy.

1. **Billing strip** (indigo, small tracked caps): `FREE LIVE ZOOM · MONDAY, NOVEMBER 9 · 12PM CT`
2. **Hero, the countdown-post pattern from the Brand Guide**
   - Headline (indigo caps): `SEE YOUR WHOLE RETIREMENT PICTURE BEFORE YOU MOVE A SINGLE DOLLAR.`
   - Title band: full-width sky field with indigo hairlines, wordmark inside (THE + METHOD indigo, BOX TOP cream)
   - Byline row: `BY JUSTIN L STARK` ─── `NOVEMBER 9, 2026`
   - Details line (sky caps, 24px+ only): `10AM PT · 11AM MT · 12PM CT · 1PM ET`
   - Line: "Most people don't have a money problem. They have a clarity problem. Join me live on Zoom for the launch of my new book, and I'll walk you through the four corners of your retirement picture."
   - **Form** (desktop: right column; mobile: directly under the line above, no scrolling past art to reach it)
   - Book mockup tilted ~15°, bleeding off the bottom right, the one soft shadow allowed
   - Countdown to 12PM CT Nov 9 (days / hours / minutes; respects reduced motion)
3. **The problem**: the thousand-piece puzzle with no picture on the box. The 401(k), the savings, the old policy, advice from everybody and their uncle.
4. **What you'll see live: the Four Corners** (4 square cards, puzzle-piece numerals 1 to 4, one line each)
5. **Show up live, leave with 5 free tools** (bonus stack, the five plus "and a few more things I'm saving for the live"). *Depends on Decision D4.*
6. **Who it's for**: folks within about five years of retirement on either side (the Retirement Red Zone), retirees who want to see the whole picture, business owners. "Bring your spouse."
7. **Meet Justin**: photo on ground (never under text), the road from the Marines to the kitchen table, "Do right by people." Presented by Pontotoc Insurance Agency, small.
8. **FAQ**: Is it free? (yes) · Is this a sales pitch? (no, education only; that's the whole point of the book) · Will there be a replay? *(Decision D5)* · Do I need a Zoom account? (no, the link opens in a browser or the app) · What time is it where I live? (west to east line) · Can my spouse come? (yes, register once and watch together, or both register for your own reminders)
9. **Closer**: wordmark band + repeated CTA (scrolls to the form; one form per page keeps tracking clean)
10. **Footer**: education disclaimer (from the book: "educational... not financial, tax, or legal advice, and it does not recommend any specific product, investment, or strategy"), Presented by Pontotoc Insurance Agency, Published by Game Changer Publishing, Privacy · Terms · SMS terms.

**Optional but high-value:** a 30 to 45 second vertical selfie video of Justin inviting people (also usable as ad creative). The Drive's Videos folder is empty today; the page ships without it and takes it as a drop-in.

## 6. Form spec

| Field | Required | Notes |
|---|---|---|
| First name | yes | Zoom requires it |
| Last name | yes | Zoom shows it to the host; helps GHL dedupe. *Could be optional; Decision D3* |
| Email | yes | Zoom identity; the join link goes here |
| Mobile phone | **optional** (recommended) | "Get a text reminder so you don't miss it." US format, normalized to E.164 server-side |
| SMS consent checkbox | optional, **unchecked by default** | Shown only once a phone number is typed. Separate from registration (consent isn't a condition of signing up) |
| Hidden | | `honeypot`, form start time, `event_id`, first-touch + last-touch UTMs, `fbclid`, `gclid`, landing URL, referrer |

SMS consent text (draft, final wording to be checked against the A2P campaign that GHL approves):
> Text me reminders about The Box Top Method launch from Justin Stark / Pontotoc Insurance Agency. Up to 6 messages. Msg & data rates may apply. Reply STOP to opt out, HELP for help. See our Privacy Policy and Terms.

Button: `SAVE MY FREE SEAT`. Inline validation, clear errors, 44px tap targets, autocomplete attributes so phones autofill.

## 7. `/api/boxtop-register` (new Vercel function)

- Node, CommonJS, built-in `fetch`, matching `api/meta.js`. No new dependencies.
- **Zoom:** Server-to-Server OAuth token (`account_credentials` grant, cached in memory until expiry) → `POST /v2/webinars/{webinarId}/registrants` with `email`, `first_name`, `last_name`, `phone`. Returns `join_url` + `registrant_id`.
- **GHL:** POST JSON to the Box Top inbound webhook (Phase 2 creates it). Payload in `02-ghl-plan.md` §3.
- **Meta CAPI:** `CompleteRegistration` to pixel `4533371650216162` with SHA-256 hashed `em`, `ph`, `fn`, `ln`, `external_id`, plus `fbc`/`fbp` cookies, IP, user agent, `event_source_url`, and the same `event_id` the browser uses. Richer than the existing `/api/meta` relay (which sends no hashed identifiers), so match quality is higher on the event the ads optimize for.
- **Time windows enforced server-side** (America/Chicago): registration open until the webinar ends; after that, `action=replay` only (GHL capture, no Zoom call).
- **Actions:** `register` · `profile` (thank-you survey) · `replay` (post-event signups).
- **Spam:** honeypot, minimum fill time, email/phone format checks, payload size cap. No CAPTCHA unless spam shows up.
- **Logging:** errors only, no full emails or phones in logs.

**Vercel environment variables** (you add these in the Vercel dashboard; secrets never go in chat or the repo):
`ZOOM_ACCOUNT_ID`, `ZOOM_CLIENT_ID`, `ZOOM_CLIENT_SECRET`, `ZOOM_WEBINAR_ID` (the numeric ID, not the `WN_...` link code), `GHL_BOXTOP_WEBHOOK_URL`, `META_CAPI_TOKEN` (already used by `/api/meta`; confirm it's set), optional `META_TEST_EVENT_CODE` during testing.

## 8. Thank-you page: `/theboxtop/launch/thanks/`

1. `YOU'RE IN.` + the date/time line
2. **Your personal join link** button (also emailed by GHL and by Zoom)
3. **Add to calendar**: Google, Apple/Outlook (.ics generated in the browser with the personal link inside)
4. **One question, one tap**: "Which sounds most like you?" Retired · Retiring in the next 5 years · 5+ years out · Business owner · Financial professional. Feeds GHL segmentation and routes financial professionals toward Justin's agent track later. Costs nothing in conversion because they're already registered.
5. **Bring someone**: "Send this to your spouse or a friend" (native share sheet; link carries `utm_source=referral&utm_medium=share`)
6. Browser pixel `CompleteRegistration` fires **once**, only when arriving from a successful submit (guards against reloads and direct visits).

## 9. Tracking spec

- **Pixel:** existing Meta pixel `4533371650216162`, the existing `mtrack` browser+server pattern for `PageView` and `ViewContent`. **`CompleteRegistration`** is the Box Top conversion; it stays separate from Big Table's `Lead` so the two campaigns never train on each other's signals. In Events Manager, add a custom conversion "Box Top Launch Registration" = `CompleteRegistration` where URL contains `/theboxtop/`.
- **First/last touch:** on landing, read `utm_source/medium/campaign/content/term/id`, `fbclid`, `gclid`. First touch saved once in `localStorage` (`bt.ft`, 30-day expiry), last touch overwritten every visit (`bt.lt`). Both submit with the form. Storage wrapped in try/catch so private mode never breaks the form.
- **UTM convention for the ads** (Meta dynamic parameters):
  `?utm_source={{site_source_name}}&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{adset.name}}&utm_id={{campaign.id}}`
- **Organic:** switch Justin's bio links from the raw Zoom URL to `thejustinstark.com/theboxtop/launch/?utm_source=instagram&utm_medium=social&utm_campaign=boxtop_launch_bio` (one per platform), and the pinned comments too. Everyone flows through the same capture and reminders. The raw Zoom link keeps working for anyone who already has it.

## 10. Time-based page states (no manual switch on launch day)

| When (Central) | Page shows | Form does |
|---|---|---|
| Now → Nov 9 11:55 AM | Normal page + countdown | Registers (Zoom + GHL) |
| Nov 9 11:55 AM → end of webinar | `WE'RE LIVE NOW` banner | Registers, thank-you page leads with **Join now** |
| After the webinar | `MISSED IT? GET THE REPLAY` version (*D5*) | `action=replay`, GHL only |

Ads should be paused by about 11:30 AM CT Nov 9; the page handles anything that still trickles in.

## 11. Design system (Box Top kit)

Recorded as a new "Box Top sub-brand" section in `DESIGN.md` plus a `.impeccable/surfaces/` brief, matching how `/big-table/` was documented.

- **Tokens:** indigo `#2D378F`, sky `#3598D0`, cream `#FDFADD`, steel `#5EA0BE`, ground `#F1F1F1`, surface `#FFFFFF`, ink `#1E2347`, muted `#565C7E`.
- **Contrast rules (from the guide):** indigo on ground anywhere; cream on sky and indigo on sky only at 24px+; sky and steel never for small text people must read.
- **Type:** Montserrat, **self-hosted** woff2 latin subset (repo rule: no Google Fonts request at runtime). Headlines 800/900 caps with a little tracking; labels 700 widely tracked; body 400 at 18/28.
- **Shapes:** square blocks, no gradients, no shadows except the soft one under the book, no emoji.
- **Imagery:** the real cover only, never redrawn. Justin's photo on ground or in a sky field.

## 12. Performance, accessibility, compliance

- **Speed:** static HTML, inline CSS/JS like the rest of the site, only third party is the Meta pixel. Budget: LCP under 2.5s on a mid-range phone on 4G; hero images sized for mobile; video (if added) loads on tap.
- **In-app browsers:** test in Facebook and Instagram in-app browsers on iOS and Android (where the ad traffic actually lands).
- **Accessibility:** real labels, error text tied to fields, visible focus, 44px targets, AA contrast per the rules above, reduced-motion countdown.
- **Compliance:** education-only framing everywhere; no products, returns, or guarantees named; disclaimer in footer; privacy + terms + SMS terms live before ads start; consent language matches the A2P campaign. Justin should confirm whether his IMO/carrier compliance wants to see the page and ads first (common for agents marketing retirement topics, even educational ones).
- **Meta ad category:** retirement-planning ads from an insurance agency may need Meta's *Financial products and services* special ad category, which removes age, gender and ZIP targeting. The page is written so the audience self-selects ("within five years of retirement") rather than relying on age targeting. *(Reviewer to verify the current rule.)*

## 13. QA checklist (all must pass before ads start)

- [ ] Test registration (`kalob+bt1@...`) lands in Zoom registrants with a working personal join link
- [ ] Same test lands in GHL: contact, every attribution field, join link, tags, opportunity in "Registered"
- [ ] GHL confirmation email + SMS arrive, join link opens Zoom
- [ ] Meta Test Events shows `CompleteRegistration` from **browser and server**, deduplicated, with good match quality
- [ ] Duplicate registration behaves (no double opportunity, same join link)
- [ ] Zoom failure path (bad webinar ID on a preview deploy) shows the fallback step and alerts GHL
- [ ] UTMs from a real ad preview link arrive intact in GHL
- [ ] iOS Safari, Android Chrome, Facebook + Instagram in-app browsers: layout, form, autofill, thank-you
- [ ] Time states: force each state on a preview with a query override (e.g. `?now=2026-11-09T12:10-06:00`, preview only)
- [ ] Lighthouse mobile ≥ 90 performance, 100 accessibility; no console errors
- [ ] Test registrants deleted from Zoom and GHL afterwards

## 14. Build order and who does what

| # | Task | Owner | Needs |
|---|---|---|---|
| 1 | Approve this plan + decisions D1 to D7 (README) | Kalob / Justin | |
| 2 | Create Zoom Server-to-Server OAuth app; add env vars in Vercel; set webinar to auto-approve | Kalob (Zoom admin) | Zoom account admin |
| 3 | Create GHL inbound webhook workflow, send me nothing secret; add the URL as a Vercel env var | Kalob | Phase 2 §3 |
| 4 | Build page, thank-you, legal pages, redirects, function, tracking (new PR) | Claude | Cover image, approved copy |
| 5 | Preview deploy → send sample payload → map fields in GHL | Claude + Kalob | |
| 6 | Full QA (§13) | Claude + Kalob | |
| 7 | Merge → production; swap bio links | Kalob | |
| 8 | Ads live | Kalob | |

Target: **steps 2 to 7 done by end of day Tuesday, Nov 3**, ads live Nov 3 evening or Nov 4 morning.
