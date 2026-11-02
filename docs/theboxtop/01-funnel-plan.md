# Phase 1: Box Top Launch Funnel (ad landing page)

**Status:** approved Nov 1, 2026 · built in this PR · revised after independent review (README review log)
**Event:** The Box Top Method live Zoom launch · **Monday, November 9, 2026 · 10AM PT / 11AM MT / 12PM CT / 1PM ET** (18:00 UTC; Central is on CST). Planned end, used everywhere: **1:30 PM CT** (19:30 UTC).

---

## 1. What this funnel has to do

| Rank | Conversion | Measured by |
|---|---|---|
| Primary | Registration (in **Zoom** and in **GHL**) | Meta `CompleteRegistration`; GHL stage "Registered" |
| Secondary | Shows up live | Zoom attendee report → GHL "Attended Live" |
| Tertiary | Books a Box Top Review | GHL calendar → "Box Top Review Booked" |

## 2. Facts the page uses (all checked against the Drive by the reviewer)

Title and subtitle · BY JUSTIN L STARK · Game Changer Publishing · Mon Nov 9, 10AM PT / 11AM MT / 12PM CT / 1PM ET · the Zoom registration link · "Most people don't have a money problem. They have a clarity problem." · "Clarity precedes confidence." · the Four Corners (liquidity ladder; time, cash flow and cash; three tax buckets; safety, growth and access) · the five live-attendee bonuses (4-module training, Legacy Trust Finder, 14-question Box Top Quiz, 16-page and 22-page fillable packets, plus "a few more things") · Justin's road (North Mississippi, Marine infantry and scout sniper, police officer, church-planting pastor, a decade in Medicare and retirement planning).

**Not used, because none exist yet:** testimonials, endorsements, registration counts, press. **Open:** Game Changer Publishing's launch date should be confirmed as Nov 9 (flagged in the countdown doc).

## 3. What's built

| Path | What |
|---|---|
| `theboxtop/launch/index.html` | The ad landing page |
| `theboxtop/launch/thanks/index.html` | Confirmation: personal join link, Zoom app links, calendar, one-tap survey, share |
| `theboxtop/launch/box-top-launch.ics` | Apple/iPhone calendar file (served as `text/calendar`) |
| `theboxtop/assets/` | Book cutout and flat cover (cut from Game Changer's launch post until hi-res arrives), share image, favicon, Justin photo |
| `api/boxtop-register.js` | Registration function: Zoom + GHL + Meta CAPI |
| `api/meta.js` | Fixed: accepts `ViewContent`, Graph API v25.0 (v21.0 expired Sep 2025), malformed bodies no longer crash it |
| `privacy/`, `terms/` | Site-wide privacy policy (Meta Pixel notice and opt-out, A2P mobile-data language) and terms with SMS terms |
| `vercel.json` | 307 redirects: `/theboxtop` → launch page; `/boxtop` (+ case variants) → launch page with `utm_source=vanity` |
| `.vercelignore` | `docs/`, `tests/`, `tools/` never deploy |
| `tests/boxtop-register.test.js` | 13 tests (`node --test tests/*.test.js`) |
| `tools/zoom-registrants-to-ghl.js` | Backfill: people who registered via the raw Zoom link → GHL |
| `assets/fonts/Montserrat-var.woff2` | Self-hosted Montserrat (latin, variable 100 to 900) |

## 4. Registration flow

```
Ad → /theboxtop/launch/?utm_…&fbclid=…
  form → POST /api/boxtop-register
    1. validate, honeypot, minimum fill time
    2. Zoom: add webinar registrant → personal join_url
    3. GHL inbound webhook (contact, attribution, join_url)   ┐ parallel
    4. Meta CAPI CompleteRegistration (hashed em/ph/fn/ln)     ┘
  → /theboxtop/launch/thanks/   browser pixel CompleteRegistration with the SAME event_id (Meta dedupes)
```

| Situation | What happens |
|---|---|
| All good | Thank-you page shows the personal join link |
| Zoom fails or isn't configured yet | GHL still gets the contact (`zoom_status=failed`, internal alert); thank-you shows "One last step: confirm your seat on Zoom" |
| Zoom says 429 (same person, 3rd+ try today) | Treated as already registered; "check your email" |
| Zoom **and** GHL fail | The form offers Zoom's own registration page |
| After 1:30 PM CT Nov 9 | Server turns `register` into `replay` (GHL + Meta `Lead`, no Zoom) |

**Plan B is built in.** Until the Zoom env vars exist, every registration takes the "one last step" path automatically. If Zoom credentials aren't in hand by **Mon Nov 2 at noon**, ship anyway on Plan B; adding the env vars later switches to one-step registration with no code change. The backfill script then picks up the Zoom side.

## 5. The page

Mobile first (Facebook/Instagram in-app browsers). Box Top brand kit. Copy in Justin's voice, no em dashes, canon words only, times west to east. **Justin approves the final copy.**

Order: billing strip → headline (book subtitle) → sky title band with wordmark and the real cover → byline + time line → **form**, opening with three checkmarks (free and live with Justin · the Four Corners · 5 free tools when you come live) (phones: right under the time line; desktop: right column) → lede → **"What you get for showing up"** (four payoffs + "Why now?" on old settings and the Retirement Red Zone, plus a sign-up button on phones) → countdown → the box top problem → the Four Corners → "Show up live. Leave with 5 free tools." → who it's for → meet Justin → FAQ → closer → footer.

Review-driven changes, now in the page:
- The time line stays **indigo at every size** (sky on ground is 2.84:1 and fails AA even at 24px).
- FAQ: "On a phone or tablet, install the free Zoom app before Monday"; "If you share one email, register once and watch together."
- The replay FAQ stays (D5) but leads with "come live" because the tools are live-only.
- Footer: "Justin Stark is a licensed insurance agent with Pontotoc Insurance Agency. Nothing is sold on the call." plus a Meta Pixel notice with an opt-out link on every page that fires the pixel (Meta Business Tools Terms §3.c).

Time states run off the clock (America/Chicago), with a `?now=` override on preview/local only:

| When (CT) | Page |
|---|---|
| Until 11:55 AM Nov 9 | Normal + countdown |
| 11:55 AM to 1:30 PM | "We're live now" banner; form says "Register and join"; thank-you leads with "Join the live launch" |
| After 1:30 PM | "Missed the live launch? Get the replay"; the bonus section and time line hide; form becomes a replay request |
| After the replay window (Nov 16) | Phase 3: `/theboxtop/` becomes the book's home and this page points to it |

## 6. Form

First name, last name, email and **mobile phone are required** (changed Nov 2 at Kalob's request; replay requests after the event still ask only for name and email). Below the phone field, **two separate, optional, unchecked SMS consents**, always visible. A2P expects non-marketing and marketing consent to be separate. The server stores each label in GHL as proof of consent, and a test enforces that they match word for word:

> ☐ Yes, text me my confirmation and reminders for The Box Top Method launch from Justin Stark / Pontotoc Insurance Agency. Up to 5 messages. Msg & data rates may apply. Reply STOP to opt out, HELP for help. Consent is not a condition of registration.
>
> ☐ Yes, text me occasional updates, invitations and offers from Justin Stark / Pontotoc Insurance Agency, like new Box Top classes and events. Msg frequency varies. Msg & data rates may apply. Reply STOP to opt out, HELP for help. Consent is not a condition of registration.
>
> See our Privacy Policy and SMS Terms.

The second box also covers what the first can't: texting about Box Top Reviews and future classes after the launch. If A2P isn't approved by Monday noon (02 §1), hide both boxes for this launch. The phone stays required for calls and records.

## 7. Function settings (Vercel → Environment Variables)

| Variable | Status |
|---|---|
| `META_CAPI_TOKEN` | **Set** (production only; add it to Preview too so QA on preview reaches Meta Test Events) |
| `ZOOM_ACCOUNT_ID`, `ZOOM_CLIENT_ID`, `ZOOM_CLIENT_SECRET`, `ZOOM_WEBINAR_ID` | Needed. App created by the **Zoom account owner**, scopes in 02 §8. Webinar ID is the numeric one, not `WN_…` |
| `GHL_BOXTOP_WEBHOOK_URL` | Needed (BT · Inbound workflow) |
| `META_TEST_EVENT_CODE` | Optional while testing |

**Vercel plan:** the team is "kalob-eng's projects". Hobby is non-commercial; paid-ad traffic to a business needs **Pro**. Confirm the plan.

## 8. Tracking

- `PageView` on every page; `ViewContent` on first form focus (both through `/api/meta`, which now accepts `ViewContent`).
- `CompleteRegistration`: server half from the function (hashed email, phone with country code, first and last name, external_id, fbc built from `fbclid` when the cookie is missing, fbp, IP, user agent); browser half on the thank-you page with the same `event_id`, fired once.
- Replay sign-ups: `Lead`, the same way.
- Never sent to Meta: survey answers, retirement status, anything financial.
- Events Manager: custom conversion "Box Top Launch Registration" = `CompleteRegistration` where URL contains `/theboxtop/`. Check the data source's category: Meta can restrict some events for financial-services sites.
- UTMs for ads: `?utm_source={{site_source_name}}&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{adset.name}}&utm_id={{campaign.id}}`
- Bio links and pinned comments: switch from the raw Zoom URL to `thejustinstark.com/theboxtop/launch/?utm_source=instagram&utm_medium=social&utm_campaign=boxtop_launch_bio` (one per platform).

## 9. Compliance

- **Meta special ad category: declare "Financial products and services."** Required for US ads since January 2025 (insurance and investment services). It locks age to 18–65+ and radius to 15 miles minimum, and removes demographic and behavior targeting, exclusions and lookalikes; interests come from an approved list. The page and ads are written so the audience self-selects ("within about five years of retirement").
- **IMO/carrier compliance sign-off** on the ads and page before spend. If any part of the webinar or the Box Top Review touches **Medicare Advantage or Part D**, CMS rules for educational events and scope-of-appointment forms apply.
- Education-only framing; no product named, recommended or priced; disclaimer and licensed-agent line in the footer.
- Privacy and terms are a solid plain-English draft, not legal advice: have counsel glance at them, and confirm the legal entity name.

## 10. QA (before ads)

- [x] Function: 13 automated tests (success, Zoom down, Zoom + GHL down, no Zoom creds, token refresh, 429, validation, SMS consent rules, bots, survey, source buckets, phone format, consent text matches the page)
- [x] Browser: validation errors, SMS box appears with a full number, live/over states, thank-you states, pixel fires once, calendar links carry the personal join link, no JS errors, no sideways scroll at 390px
- [ ] Preview deploy: real registration lands in Zoom (join link works) and GHL (fields, tags, stage, emails, SMS); Meta Test Events shows browser + server `CompleteRegistration`, deduplicated
- [ ] Against the real webinar: duplicate registration behavior; Zoom error 3000 (some accounts cap registrants added by API)
- [ ] Facebook + Instagram in-app browsers on iPhone and Android; iOS Safari; Android Chrome
- [ ] Redirects `/boxtop`, `/theboxtop` on the preview URL
- [ ] Delete test registrants in Zoom and test contacts in GHL

## 11. Order of work

| # | Task | Owner | When |
|---|---|---|---|
| 1 | Review the PR's Vercel preview deploy; Justin approves copy | Kalob, Justin | Mon AM |
| 2 | Zoom app + env vars (or Plan B at noon) | Zoom account owner | Mon noon |
| 3 | GHL build per 02, map fields from a preview submission | Kalob | Mon |
| 4 | Ad creative + copy (none exists for paid; the Drive posts are organic "link in bio"), SAC declared, compliance OK | Kalob, Justin | Mon to Tue |
| 5 | Full QA on preview → merge to production → swap bio links | Kalob, Claude | Tue |
| 6 | Ads submitted Tue; realistically delivering **Wed Nov 4** after Meta review | Kalob | Tue to Wed |
