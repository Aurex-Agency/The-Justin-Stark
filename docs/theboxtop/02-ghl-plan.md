# Phase 2: GoHighLevel tracking, pipeline and communications

**Status:** approved, revised after independent review (see README review log).
**Who builds:** Kalob in GHL (there is no GHL connection from this repo). Claude supplies this spec, test payloads, and all email/SMS copy.
**Sub-account:** the existing webhook location (`MCFdomwXH4RRN6HkJgry`, also used by `/big-table/`) is Pontotoc Insurance Agency's live account. See check 1.

---

## 1. Day-1 checks (Mon Nov 2, morning)

| # | Check | Why it matters | If it fails |
|---|---|---|---|
| 1 | **Existing PIA workflows** triggered by "Contact created", "Tag added", or form/webhook events | Box Top registrants land in PIA's live account and could fall into insurance sequences | Add a filter `does not have tag bt-registered` to those workflows, or exclude the `boxtop` source |
| 2 | **A2P 10DLC brand + campaign approved** for this sub-account, use case covering event reminders | Unregistered texts get filtered. A new approval needs the live opt-in page + privacy policy and won't clear by Nov 9 | **Decide by Monday noon:** if not already approved, this launch is **email only**. Hide the SMS checkbox (one-line change on the page) |
| 3 | **Email sending domain** authenticated (dedicated subdomain, SPF, DKIM, DMARC `p=none`) | Reminders in spam kill show rate. DNS for thejustinstark.com is at **GoDaddy** (nameservers `ns77/ns78.domaincontrol.com`), so records go there | Set up today |
| 4 | **Zoom webinar settings** (§8) and **which Zoom account owns the webinar** | The Zoom app must be created by that account's owner/admin | Plan B (README) |
| 5 | Business name for A2P, privacy and terms. Reviewer found **"Stark Broker Services d/b/a Pontotoc Insurance Agency"** in PIA onboarding docs | A2P rejects mismatched names | Justin confirms the exact legal name |

## 2. Custom fields (Contact, folder "Box Top Launch")

| Field | Type | Written by | Rule |
|---|---|---|---|
| BT Zoom Join URL | Single line | Inbound webhook | **Only write when the incoming value isn't empty** (a duplicate submit sends blank) |
| BT Zoom Registrant ID | Single line | Inbound webhook | Only when not empty |
| BT Zoom Status | Single line: `registered` / `already` / `failed` | Inbound webhook | |
| BT Registered At | Date/time | Inbound webhook | Only when empty (keep the first) |
| BT SMS Consent | Single line: `yes` / `no` | Inbound webhook | Never downgrade `yes` to `no` on a re-submit; STOP handles opt-out |
| BT SMS Consent At, BT Consent Version, BT Consent Text | Date/time, Single line, Multi line | Inbound webhook | Proof of consent: exact wording shown at signup |
| BT Segment | Single line, values `retired` / `red-zone` / `planning` / `business-owner` / `pro` | Thank-you survey | Slugs match the page exactly |
| BT Source Bucket | Single line | Inbound webhook | `paid-meta` `paid-other` `organic-social` `vanity` `referral` `email` `direct` `other` `zoom-direct` |
| BT Attended Live, BT Minutes Attended | Single line `yes`/`no`, Number | Zoom CSV import | |
| BT FT Source / Medium / Campaign / Content / Term | Single line ×5 | Inbound webhook | **Only write when empty** (true first touch, even across devices) |
| BT LT Source / Medium / Campaign / Content / Term | Single line ×5 | Inbound webhook | Overwrite every time (last touch) |
| BT Campaign ID, BT fbclid, BT gclid, BT Landing Page, BT Referrer | Single line ×5 | Inbound webhook | |

Why custom fields: GHL's native attribution only fills when GHL's own forms or funnels capture the lead. Ours posts through a webhook, so we carry attribution explicitly. GHL's external tracking script exists, but it could create contacts a second way and its handling of JavaScript-submitted forms is undocumented: **don't install it for this launch.**

## 3. Webhook payload (sent by `/api/boxtop-register`)

One inbound webhook URL (Vercel env `GHL_BOXTOP_WEBHOOK_URL`). The `action` field routes inside the workflow.

```json
{
  "action": "register",            // register | replay | profile | zoom_direct (backfill script)
  "event": "boxtop-launch-2026-11-09",
  "first_name": "Jane", "last_name": "Doe", "email": "jane@example.com", "phone": "+16625550123",
  "segment": "",                   // profile only
  "sms_consent": "yes", "sms_consent_at": "2026-11-03T15:04:05.000Z",
  "consent_version": "bt-sms-v1", "consent_text": "Yes, text me reminders about … Consent is not a condition of registration.",
  "zoom_status": "registered",     // registered | already | failed
  "zoom_join_url": "https://us02web.zoom.us/w/…", "zoom_registrant_id": "…",
  "zoom_fallback_url": "",         // filled only when zoom_status = failed
  "registered_at": "2026-11-03T15:04:05.000Z",
  "source_bucket": "paid-meta",
  "ft_source": "fb", "ft_medium": "paid_social", "ft_campaign": "BT Launch Reg", "ft_content": "Puzzle 15s", "ft_term": "Broad US",
  "lt_source": "fb", "lt_medium": "paid_social", "lt_campaign": "BT Launch Reg", "lt_content": "Puzzle 15s", "lt_term": "Broad US",
  "campaign_id": "1202…", "fbclid": "…", "gclid": "",
  "landing_page": "https://thejustinstark.com/theboxtop/launch/?utm_…", "referrer": ""
}
```

Note: Meta's `{{site_source_name}}` returns `fb`, `ig`, `msg` or `an`, not "facebook". The function's `source_bucket` already accounts for that.

## 4. Tags

| Tag | Applied when |
|---|---|
| `bt-registered` | `action` = register or zoom_direct |
| `bt-src-{bucket}` (one of the BT Source Bucket values) | From `source_bucket` |
| `bt-sms-optin` | `sms_consent` = yes |
| `bt-zoom-failed` | `zoom_status` = failed (+ internal alert) |
| `bt-seg-retired` / `bt-seg-red-zone` / `bt-seg-planning` / `bt-seg-business-owner` / `bt-seg-pro` | Survey |
| `bt-attended-live` | Zoom attendee CSV import |
| `bt-no-show` | Registered and not attended, applied after the CSV import |
| `bt-replay-request` | `action` = replay |
| `bt-replay-ready` | **Manual**, once the replay plays end to end. Releases every replay message |
| `bt-replay-clicked` | Replay trigger link clicked |
| `bt-review-booked` | Box Top Review booked |

## 5. Pipeline: "Box Top Launch"

| # | Stage | Moves here when |
|---|---|---|
| 1 | Registered | `bt-registered` |
| 2 | Attended Live | `bt-attended-live` |
| 3 | No-Show | `bt-no-show` |
| 4 | Replay Engaged | `bt-replay-clicked` and not attended |
| 5 | Box Top Review Booked | Booking on the Box Top Review calendar |
| 6 | Box Top Review Held | Appointment marked showed |
| 7 | Client | Status **Won** (Justin) |

Opportunity: `{{contact.name}} · Box Top Launch`, source = BT Source Bucket + BT LT Campaign, assigned to Justin. Lost reasons: Not a fit · No response · Already has an advisor · Other. `bt-seg-pro` also goes to Justin's agent-recruiting pipeline if one exists.

## 6. Workflows

| Workflow | Trigger | Steps |
|---|---|---|
| **BT · Inbound** | Inbound Webhook | Branch on `action`. **register / replay:** Create/Update Contact (field rules in §2) → tags → opportunity (Registered) → if `zoom_status=failed`, internal alert to Kalob + Justin with the contact link. **profile:** set BT Segment + segment tag. **zoom_direct:** if the contact already has `bt-registered`, only fill an empty join URL and stop; otherwise create, tag `bt-registered` + `bt-src-zoom-direct`, opportunity, no attribution fields |
| **BT · Launch comms** | Tag added `bt-registered` | The whole pre-event sequence in §7, one workflow. Every Wait uses **"If the time is already in the past: skip all outbound communication actions until the next wait"**, so a late registrant never gets a stale message |
| **BT · Post-event** | Tag added `bt-attended-live` or `bt-no-show` | Attended → Day 0 thank-you + bonus vault + Box Top Review link + where to buy the book; Day 2 quiz; Day 4 Review invite; Day 7 last call. No-show → Day 0 "replay coming tonight", then waits for `bt-replay-ready` → replay link; Day 2 replay reminder; Day 4 Review invite; Day 7 "replay comes down". **Email only** (the SMS consent covers launch reminders, not follow-up). Goal: `bt-review-booked` exits |
| **BT · Replay request** | Tag added `bt-replay-request` | Wait for `bt-replay-ready` → replay email → joins the no-show track from Day 2 |
| **BT · Replay clicked** | Trigger link "BT Replay" | Tag `bt-replay-clicked`; if not attended → Replay Engaged |
| **BT · Review booked** | Appointment booked, calendar "Box Top Review" | Tag, stage → Box Top Review Booked, internal notification |
| **BT · Review showed** | Appointment showed | Stage → Box Top Review Held |

**Calendar:** "Box Top Review" (separate from the homepage calendar for clean reporting). Its link goes in the live webinar and the Day 0 emails; it doesn't wait for a `/theboxtop/review/` page.

## 7. Communications calendar (BT · Launch comms)

All times Central. Every message carries `{{contact.bt_zoom_join_url}}` (copy the exact merge key from Settings → Custom Fields). Keep **Zoom's own reminder emails on** as a backstop for anyone GHL misses.

| When (CT) | Email | SMS (only `bt-sms-optin`, never DND) | Purpose |
|---|---|---|---|
| On registration | "You're in" (join link, calendar, Zoom app tip, bonus stack) | Confirmation, **only if registered before Sun Nov 8, 12 PM CT** and inside 8 AM to 8 PM their time | Confirm |
| Wed Nov 4, 10 AM | "What you get for showing up live" | | Bonus stack |
| Fri Nov 6, 10 AM | "One thing to bring Monday" (list your pieces) | | Homework lifts show rate |
| Sun Nov 8, 12 PM | "This time tomorrow" | 24-hour reminder | |
| Mon Nov 9, 8 AM | "Today at noon Central" | | Email only (6 AM Pacific) |
| Mon Nov 9, 11 AM | "One hour" | 1-hour reminder, **skipped for 808 (Hawaii) numbers** (7 AM there) | |
| Mon Nov 9, 12:02 PM | "We're live" | "We're live", same | Pull late joiners in |
| Mon Nov 9, ~6 PM | | Replay link to no-shows, **after `bt-replay-ready`** | 4 PM PT / 7 PM ET |

**SMS rules (verified):** Florida (§501.616(6)), Oklahoma (15 O.S. §775C.4) and Maryland (Stop the Spam Calls Act) each cap marketing texts at **3 per 24 hours on the same subject** and **8 AM to 8 PM recipient time**. The plan above never exceeds 3 in any 24-hour window, because the confirmation text is skipped for anyone registering inside the final 24 hours. Total per person ≤ 5, matching the consent text ("Up to 5 messages"). The first text names the sender and includes STOP/HELP. Opt-outs by any reasonable means are honored (FCC; the one-to-one consent rule was vacated in Jan 2025).

**Before go-live, test in the account:** that the workflow's Wait steps resolve in the contact's time zone (or set the workflow to Central and keep the windows above), and the "skip outbound if past" option.

Draft SMS (final copy with Justin):
- Confirm: `Justin Stark / Box Top Method: you're in for the live launch Mon Nov 9, 12PM CT. Your link: {{join}} Msg & data rates may apply. Reply STOP to opt out, HELP for help.`
- 24h: `Tomorrow at noon Central I'm going live to launch The Box Top Method. Bring your questions and your spouse. Your link: {{join}} -Justin`
- 1h: `One hour till we go live. Your link: {{join}} -Justin`
- Live: `We're live right now. Hop in: {{join}} -Justin`
- Replay: `Missed the live launch? Here's the replay: {{replay}} -Justin`

## 8. Zoom side

**Webinar settings:** registration required, **auto-approve** (no join link otherwise) · Zoom's confirmation and reminder emails **on** · Q&A on · cloud recording on · practice session on · **confirm capacity** (live attendance is capped by the license; registration isn't unless "Restrict number of registrants" is on; past roughly 2.5× capacity, add a YouTube/Facebook livestream as overflow).

**Zoom app (Server-to-Server OAuth), created by the account owner** (in an Aug 2026 Zoom forum thread, non-owners couldn't see the registrant scopes). Scopes: `webinar:write:registrant:admin`, `webinar:read:registrant:admin`, `webinar:read:list_registrants:admin`, `report:read:list_webinar_participants:admin`. Zoom allows **3 add-registrant calls per person per webinar per day**; the function treats a 429 as "already registered."

**People who registered through the raw Zoom link** (every organic post so far): run `tools/zoom-registrants-to-ghl.js` on day 1 and again Sunday Nov 8 to pull them into GHL as `action=zoom_direct` with their own join links. They then get GHL's reminders too.

**Attendance:** after the webinar, export Zoom's attendee report (it can lag), import to GHL with `bt-attended-live`, then bulk-tag registered-and-not-attended as `bt-no-show`. The bonus vault link also goes in the Zoom chat at the close, so a sync miss never costs an attendee their bonuses.

**Live attendance sync (`/api/zoom-events`): deferred.** It's what would let the 12:02 text skip people already in the room, but it adds a signed-webhook endpoint (3-second reply, HMAC over the raw body, `registrant_id` matching because Zoom blanks some emails) the week of launch. CSV + backfill covers the need. Revisit for the next event.

## 9. Attribution and reporting

- **During the ad run (Nov 4 to 9), judge ads on:** cost per registration, plus quality signals per ad: share who give a phone, share who opt into texts, survey mix (Red Zone + retired + business owners vs. pros). Attendance and reviews don't exist until after the ads stop.
- **After:** cost per attendee and cost per Box Top Review booked, by `BT LT Content` (ad name). That's the input for the next campaign.
- **GHL dashboard "Box Top Launch":** registrations by source bucket and ad, pipeline by stage, show rate, reviews by campaign.
- **Smart lists:** BT Registered · BT Paid Meta · BT Zoom-direct · BT SMS opt-in · BT Attended · BT No-show · BT Pros · BT Business owners.
- **Never send survey answers or retirement status to Meta** (Meta Business Tools Terms bar financial information). Feeding "attended" or "review booked" back to Meta later is fine as a bare event; GHL's native Meta CAPI action is unverified, so check the workflow builder before planning on it.

## 10. Testing (with Phase 1 QA)

1. Send one real submission from the preview deploy → map every field in the Inbound Webhook trigger (premium trigger: 100 free runs, then $0.01 each).
2. Four test contacts: SMS yes/no × paid/organic. Check the field rules (first touch kept on a second submit, join URL not blanked), tags, stage, both confirmations, the failure alert.
3. Run a test contact through **BT · Launch comms** with test dates to see skip-if-past and the SMS windows behave.
4. Run the backfill script with `--dry-run`, then for real.
5. Delete test contacts and opportunities; delete test registrants in Zoom.
