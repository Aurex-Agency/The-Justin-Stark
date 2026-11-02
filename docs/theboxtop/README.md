# The Box Top Method: launch funnel, GHL, and website plans

Justin Stark's book *The Box Top Method* launches with a live Zoom on **Monday, November 9, 2026, 10AM PT / 11AM MT / 12PM CT / 1PM ET** (planned end 1:30 PM CT). Paid Meta ads drive people to a registration page on thejustinstark.com; GoHighLevel handles reminders, pipeline and attribution; the full Box Top website follows once ads are running.

| Doc | Covers | Status |
|---|---|---|
| [01-funnel-plan.md](01-funnel-plan.md) | Ad landing page, thank-you page, registration function, tracking | Approved Nov 1 · **built** |
| [02-ghl-plan.md](02-ghl-plan.md) | GHL fields, tags, pipeline, workflows, email/SMS calendar, attribution | Approved · Kalob builds in GHL |
| [03-website-plan.md](03-website-plan.md) | `/theboxtop/` site roadmap, Nov 9 bonus delivery | Approved in principle |
| [04-ghl-build.md](04-ghl-build.md) | GHL build sheet for the shared PIA / Justin Stark account: fences, "Box Top" fields, pipeline, calendar, 9 workflows, launch-day steps, tests | **Awaiting Kalob's approval** · reviewed Nov 2 |
| [05-ghl-messages.md](05-ghl-messages.md) | Every email (M01 to M17) and text (S01 to S06) | Awaiting Justin's approval |

## The clock (realistic)

| Date | Milestone |
|---|---|
| Sun Nov 1 | Plans approved and independently reviewed; funnel built (this PR) |
| **Mon Nov 2** | Zoom app + env vars by **noon** (else ship Plan B, already built in) · A2P decision by noon (else email-only) · GHL build · ad creative · Justin approves copy · backfill Zoom-direct registrants |
| Tue Nov 3 | QA on the preview → production → bio links swapped → ads submitted |
| **Wed Nov 4** | Ads delivering after Meta review (about 5½ days of spend) |
| Fri Nov 6 | All five bonuses ready to deliver (03 §2a) |
| Sun Nov 8 | Re-run the Zoom backfill; homepage band + replay page shell ready |
| **Mon Nov 9** | Ads off ~11:30 AM CT · live 12 PM · bonus vault link in Zoom chat at the close · attendee CSV → GHL · replay released once it plays |
| Nov 10 to 16 | Book home, quiz, Box Top Review page; replay window closes Nov 16 |

## Decisions (approved Nov 1; D6 changed by review)

| # | Decision |
|---|---|
| D1 | Ads → `/theboxtop/launch/`; `/theboxtop/` reserved for the book home (307 until then); `/boxtop` vanity for talk shows |
| D2 | Plan A: one form registers people in Zoom **and** GHL. Plan B (Zoom's own page as step 2) is automatic until Zoom credentials exist |
| D3 | First, last, email required; mobile optional; SMS consent unchecked and separate |
| D4 | The 5 bonuses are for **live attendees** (matches every social post). Justin can change this |
| D5 | Replay to everyone registered, sent only after it plays end to end, up through Nov 16 |
| D6 | **Changed:** reminders run in one GHL workflow with "skip outbound if the time is past" waits, not scheduled bulk sends (a bulk SMS likely snapshots the list and would miss late registrants). Max 3 texts per person per 24 hours, 8 AM to 8 PM their time, 5 total |
| D7 | Ads optimize on `CompleteRegistration` (separate from Big Table's `Lead`) |
| D8 | **New:** ads run under Meta's *Financial products and services* special ad category |

## What I need from you

**Blocking for ads (Mon Nov 2):**
1. **Zoom:** who owns the account the webinar lives on. That person creates the Server-to-Server OAuth app (scopes in 02 §8) and adds `ZOOM_ACCOUNT_ID`, `ZOOM_CLIENT_ID`, `ZOOM_CLIENT_SECRET`, `ZOOM_WEBINAR_ID` in Vercel. Set the webinar to auto-approve. Tell me the capacity.
2. **GHL:** create **BT · Inbound** (Inbound Webhook trigger), put its URL in Vercel as `GHL_BOXTOP_WEBHOOK_URL`. Check PIA's existing workflows (02 §1).
3. **A2P:** already approved for this sub-account, yes or no. If no, this launch is email only.
4. **Ads:** creative and copy for paid placements (none exists yet), ad account and page access, budget, and Justin's plus his IMO/compliance contact's OK.
5. **Vercel plan:** Hobby is non-commercial; paid traffic needs Pro.
6. **Justin:** approve page copy; confirm the legal business name (reviewer found "Stark Broker Services d/b/a Pontotoc Insurance Agency").

**Before Nov 9:**
7. Where the book is sold, and from when (homepage band, Day 0 email, talk-show "out now" line).
8. Bonus assets by Fri Nov 6 (03 §2a): record or schedule the training, export the two packet PDFs, share the quiz and Trust Finder publicly.
9. Check the book's QR code (`link.pontotocinsuranceagency.com/qr/noAoiZobmy4W`) opens a public page.
10. Confirm Game Changer Publishing has Nov 9 as launch day; full-res cover + 3D mockup (the page uses a cutout from their launch post until then).

**Heads up, today:** the giveaway post doc's weekday labels are off by one. **Nov 2, 2026 is a Monday** (the doc says "Sun, Nov 2", "Mon Nov 3", and so on). The countdown doc is correct.

## Review log

Two independent reviewers checked the drafts on Nov 1: one verified every platform and compliance claim against current Zoom, GHL, Meta, Vercel and state-law sources; one fact-checked against the Drive and stress-tested the logic and timeline. Everything below is applied in the plans and the code.

**Confirmed:** dates, times and UTC math; title, author line, publisher, Zoom link; Four Corners and bonus details; Justin's bio; brand tokens; Zoom add-registrant returns a personal `join_url` (auto-approve required); S2S token flow; registration open during the live; Meta browser + server dedup on `event_name` + `event_id`; GHL Inbound Webhook (premium trigger, mapped from a sample); FCC one-to-one consent rule vacated; Gmail/Yahoo sender rules; Vercel 307 for `permanent:false`.

**Corrected:**

| Finding | Fix |
|---|---|
| SMS: 4 texts in 24h for late registrants; 7 AM in Hawaii; Maryland missing; consent didn't cover nurture | Confirmation skipped in the final 24h, 1-hour text skipped for 808 numbers, opt-in-only lists, nurture email only, 5 texts max (02 §7) |
| Scheduled bulk sends are the riskier option | One workflow with skip-if-past waits (D6) |
| `webinar.registration_created` would re-post our own registrants and overwrite attribution | Live sync deferred; backfill script posts `action=zoom_direct`, which never touches attribution (02 §6, §8) |
| Every organic registrant so far went through the raw Zoom link and isn't in GHL | `tools/zoom-registrants-to-ghl.js`, run Mon and Sun |
| Zoom: 3 add-registrant calls per person per day; scopes need the account owner | 429 → "already registered"; exact scopes listed |
| `api/meta.js` rejected `ViewContent` and used expired Graph v21.0 | Fixed (v25.0), malformed bodies handled |
| Sky time line fails contrast (2.84:1) | Indigo everywhere, OG image too |
| Meta terms require a pixel notice on each page | Footer notice + `/privacy/#cookies` |
| Meta special ad category is required, not "maybe" | D8 |
| Replay link would go out before the replay exists | `bt-replay-ready` gate; Day 0 says "coming tonight" |
| Bonuses can't be delivered as of today | 03 §2a with a Fri Nov 6 deadline; vault link in Zoom chat |
| No ad creative, ad access, budget or Vercel plan in the plan | Added to the needs list; ads realistically Wed Nov 4 |
| Contacts land in PIA's live GHL account | 02 §1 check 1 |
| First touch overwritten across devices; join link blanked on re-submit | GHL field rules (02 §2) |
| QR code question (W1) | Answered: GHL QR link in PIA's location, retargetable |
| Survey values, stage names, cross-references inconsistent; "doors" used | Unified slugs and names; wording fixed |
| Medicare/CMS rules if MA or Part D come up | Flagged in 01 §9 |

**Judgment calls that differ from a reviewer's suggestion:** the replay FAQ stays on the page (a noon-Monday time slot loses registrations if people think it's live-only), and it now leads with "come live." The thank-you survey stays because it's already built and tested, it costs no conversions, and it routes financial professionals.
