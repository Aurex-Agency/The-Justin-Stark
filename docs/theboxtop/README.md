# The Box Top Method: launch funnel, GHL, and website plans

Justin Stark's book *The Box Top Method* launches with a live Zoom on **Monday, November 9, 2026, 10AM PT / 11AM MT / 12PM CT / 1PM ET**. Paid ads will drive people to a registration page on thejustinstark.com; GoHighLevel handles reminders, pipeline and attribution; the full Box Top website follows once ads are running.

| Doc | Covers | Status |
|---|---|---|
| [01-funnel-plan.md](01-funnel-plan.md) | Ad landing page, thank-you page, registration function, tracking | **Approve first** |
| [02-ghl-plan.md](02-ghl-plan.md) | GHL fields, tags, pipeline, workflows, email/SMS calendar, attribution | Approve with 01 |
| [03-website-plan.md](03-website-plan.md) | `/theboxtop/` site roadmap | Approve in principle |

## The clock

| Date | Milestone |
|---|---|
| Sun Nov 1 | Plans approved; Zoom app, GHL webhook and env vars requested |
| Mon Nov 2 | Page, thank-you, function, legal pages built on a preview deploy; GHL fields/pipeline/workflows built |
| Tue Nov 3 | End-to-end QA; merge to production; bio links swapped; **ads live by evening** |
| Wed Nov 4 to Sun Nov 8 | Ads run; scheduled emails/texts; website 1b pieces built (bonus vault, replay shell, homepage band) |
| **Mon Nov 9** | Ads paused ~11:30 AM CT · live at 12 PM CT · attendance synced · nurture starts 2 PM CT |
| Nov 10 onward | Book home, quiz, Box Top Review page, then the rest of the site |

## Decisions needed from you

| # | Decision | Recommendation |
|---|---|---|
| D1 | URLs | Ads → `/theboxtop/launch/`; `/theboxtop/` reserved for the book home (temporary redirect until then); `/boxtop` vanity for talk shows |
| D2 | Registration architecture | **Plan A:** our form registers people in Zoom *and* GHL in one step via a small server function (needs a Zoom Server-to-Server app). Plan B only if Zoom credentials can't be had within 24 hours |
| D3 | Form fields | First, last, email required; mobile optional with an unchecked SMS consent box |
| D4 | Who gets the 5 bonuses | Every social post says **live attendees only**; the page will say the same unless Justin wants registrants or replay viewers included (the giveaway doc flags this as open) |
| D5 | Replay | Yes, sent to everyone who registered, up for 7 days (urgency for the Box Top Review); page captures replay signups after the event |
| D6 | Reminder delivery | Scheduled sends to the registered list (not workflow date-waits); max 3 texts per person per day, 8 AM to 8 PM their time |
| D7 | Conversion event for ads | `CompleteRegistration` (kept separate from Big Table's `Lead`) |

## What I need from you before the build can finish

1. **Zoom** (account admin): create a Server-to-Server OAuth app with webinar registrant scopes; add `ZOOM_ACCOUNT_ID`, `ZOOM_CLIENT_ID`, `ZOOM_CLIENT_SECRET`, `ZOOM_WEBINAR_ID` in Vercel; set the webinar to auto-approve; tell me the webinar capacity.
2. **GHL**: create the "BT · Inbound" workflow with an Inbound Webhook trigger and put its URL in Vercel as `GHL_BOXTOP_WEBHOOK_URL`; confirm A2P 10DLC is approved and an email sending domain is authenticated.
3. **Meta**: confirm `META_CAPI_TOKEN` is set in Vercel (README says it was a pending one-time step).
4. **Assets**: full-resolution cover and 3D mockup from Game Changer Publishing (fallback: crop from the countdown post in Assets/Images); which Justin photo to use.
5. **Justin**: approve page copy, D4 and D5, and whether his compliance contact needs to see ads/page first.

## Review log

*(filled in after the independent review pass)*
