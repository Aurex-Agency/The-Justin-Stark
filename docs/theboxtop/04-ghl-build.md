# GHL build sheet: Box Top launch (for approval before anything is created)

**Account:** the GoGuru/GHL sub-account for **Pontotoc Insurance Agency**, which is also used for **Justin Stark blasts**. Everything below is namespaced (`BT ·` workflows, `bt-` tags, a **Box Top** custom-field folder, its own pipeline) so it can't collide with PIA or blast automations. Nothing existing is deleted or renamed. The only edits to existing items are the exclusion filters in step 0.

**Source of truth for what the website sends:** `api/boxtop-register.js` (payload keys below match it exactly).
**Message copy:** [05-ghl-messages.md](05-ghl-messages.md).
**Where this differs from 02-ghl-plan.md, this sheet wins** (see "Changes from 02" at the end).

---

## 0. Pre-flight audit (read-only, about 15 minutes, before creating anything)

| Where in GHL | Look for | Action |
|---|---|---|
| Automation → Workflows | Published workflows whose trigger could fire on Box Top contacts: **Contact Created**, **Contact Tag** (any tag), **Inbound Webhook**, **Form Submitted** (any form), **Opportunity Created / Stage Changed** (any pipeline), **Contact Changed** | Add the filter **Contact Tags → does not include → `bt-registered`** to each, so registrants don't fall into insurance or blast sequences. List them in the build log |
| Marketing → Emails / Bulk Actions → Scheduled | Justin Stark blasts or PIA campaigns scheduled **Nov 2 to 16** to "all contacts" or a broad smart list | Add the exclusion `bt-registered` until Nov 16 (protects show rate and avoids over-messaging) |
| Settings → Tags | The existing tag(s) that define the **Justin Stark blast list** | Note the exact name for decision G3 |
| Settings → Custom Fields | No existing "Box Top" folder; no fields named `BT …` | Confirm clean |
| Settings → Business Profile | Time zone | Must be **(GMT-06:00) America/Chicago**. All waits below assume Central |
| Settings → Phone System → Trust Center | A2P 10DLC brand + campaign **approved**, and the campaign's use case | If not approved: launch is email only (decision G1) |
| Settings → Email Services | Dedicated sending domain verified | If not: set up now (DNS is at GoDaddy) |
| Calendars | The existing booking calendar used on the homepage | Leave it alone; we create "Box Top Review" |
| Settings → My Staff | Justin's and Kalob's users | For assignment and alerts |

## 1. Custom fields: folder "Box Top"

Settings → Custom Fields → **Add Folder: `Box Top`** (Contact object) → add each field **with this exact name**. GHL builds the merge key from the name, and the emails use these keys. The `BT` prefix keeps the keys unique in a shared account.

| # | Field name | Type | Merge key | Filled from webhook key |
|---|---|---|---|---|
| 1 | BT Zoom Join URL | Single Line | `{{contact.bt_zoom_join_url}}` | `zoom_join_url` |
| 2 | BT Zoom Registrant ID | Single Line | `contact.bt_zoom_registrant_id` | `zoom_registrant_id` |
| 3 | BT Zoom Status | Single Line | `contact.bt_zoom_status` | `zoom_status` (registered / already / failed) |
| 4 | BT Registered At | Single Line | `contact.bt_registered_at` | `registered_at` (ISO time) |
| 5 | BT SMS Event Consent | Single Line | `contact.bt_sms_event_consent` | `sms_consent` (yes / no) |
| 6 | BT SMS Event Consent At | Single Line | `contact.bt_sms_event_consent_at` | `sms_consent_at` |
| 7 | BT Event Consent Text | Multi Line | `contact.bt_event_consent_text` | `consent_text` |
| 8 | BT SMS Marketing Consent | Single Line | `contact.bt_sms_marketing_consent` | `sms_marketing_consent` (yes / no) |
| 9 | BT SMS Marketing Consent At | Single Line | `contact.bt_sms_marketing_consent_at` | `sms_marketing_consent_at` |
| 10 | BT Marketing Consent Text | Multi Line | `contact.bt_marketing_consent_text` | `marketing_consent_text` |
| 11 | BT Consent Version | Single Line | `contact.bt_consent_version` | `consent_version` |
| 12 | BT Segment | Single Line | `contact.bt_segment` | `segment` (retired / red-zone / planning / business-owner / pro) |
| 13 | BT Source Bucket | Single Line | `contact.bt_source_bucket` | `source_bucket` |
| 14–18 | BT FT Source · BT FT Medium · BT FT Campaign · BT FT Content · BT FT Term | Single Line ×5 | `contact.bt_ft_source` … | `ft_source` … `ft_term` |
| 19–23 | BT LT Source · BT LT Medium · BT LT Campaign · BT LT Content · BT LT Term | Single Line ×5 | `contact.bt_lt_source` … | `lt_source` … `lt_term` |
| 24 | BT Campaign ID | Single Line | `contact.bt_campaign_id` | `campaign_id` |
| 25 | BT FBCLID | Single Line | `contact.bt_fbclid` | `fbclid` |
| 26 | BT GCLID | Single Line | `contact.bt_gclid` | `gclid` |
| 27 | BT Landing Page | Single Line | `contact.bt_landing_page` | `landing_page` |
| 28 | BT Referrer | Single Line | `contact.bt_referrer` | `referrer` |
| 29 | BT Attended Live | Single Line | `contact.bt_attended_live` | Zoom CSV import (yes) |
| 30 | BT Minutes Attended | Number | `contact.bt_minutes_attended` | Zoom CSV import |

Everything the website sends is text. Single Line keeps webhook values exact; dropdowns would silently drop any value that doesn't match an option. After creating them, open each field and **copy the real merge key** into the build log. If GHL generated a different key, the emails must use that one.

## 2. Custom Values (account-level links used in emails)

Settings → Custom Values → add. Each link can then be changed in one place without editing emails.

| Name | Key | Value |
|---|---|---|
| BT Replay URL | `{{custom_values.bt_replay_url}}` | `https://thejustinstark.com/theboxtop/replay/` |
| BT Bonus Vault URL | `{{custom_values.bt_bonus_vault_url}}` | `https://thejustinstark.com/theboxtop/bonuses/` |
| BT Review URL | `{{custom_values.bt_review_url}}` | the Box Top Review calendar's booking link (step 5) |
| BT Book URL | `{{custom_values.bt_book_url}}` | **where to buy the book (still needed, W2)** |
| BT Launch Page URL | `{{custom_values.bt_launch_url}}` | `https://thejustinstark.com/theboxtop/launch/` |

The replay and bonus-vault pages are ours. They show "posting soon" until the content is ready, so the emails can safely carry those links ahead of time.

## 3. Tags

Created on first use, or ahead of time in Settings → Tags.

| Tag | Meaning |
|---|---|
| `bt-registered` | Registered for the launch (website or raw Zoom link) |
| `bt-src-paid-meta` `bt-src-paid-other` `bt-src-organic-social` `bt-src-vanity` `bt-src-referral` `bt-src-email` `bt-src-direct` `bt-src-other` `bt-src-zoom-direct` | Where they came from (one each) |
| `bt-sms-optin` | Checked box 1: event confirmation + reminders |
| `bt-sms-marketing-optin` | Checked box 2: updates, invitations, offers |
| `bt-sms-hawaii` | 808 number: skip texts that would land before 8 AM there |
| `bt-sms-confirm` | Registered early enough for a confirmation text without breaking the 3-per-24h cap |
| `bt-zoom-failed` | Zoom registration failed; needs manual fix |
| `bt-seg-retired` `bt-seg-red-zone` `bt-seg-planning` `bt-seg-business-owner` `bt-seg-pro` | Thank-you page answer |
| `bt-attended-live` | Joined the live (from Zoom's attendee report) |
| `bt-no-show` | Registered, didn't join live |
| `bt-replay-request` | Signed up after the live ended |
| `bt-replay-clicked` | Clicked the replay link |
| `bt-review-booked` | Booked a Box Top Review |
| `bt-test` | Test contacts (delete before launch) |

## 4. Pipeline: "Box Top Launch"

Opportunities → Pipelines → **Create new pipeline: `Box Top Launch`**; show in funnel and pie charts.

| # | Stage | Moves here when |
|---|---|---|
| 1 | Registered | `bt-registered` (BT · 01) |
| 2 | Attended Live | `bt-attended-live` (BT · 03) |
| 3 | Missed Live (Replay) | `bt-no-show` or `bt-replay-request` (BT · 04) |
| 4 | Replay Engaged | Clicked the replay and didn't attend (BT · 05) |
| 5 | Box Top Review Booked | Booked on the Box Top Review calendar (BT · 06) |
| 6 | Box Top Review Held | Appointment marked Showed (BT · 07) |
| 7 | Client | Justin sets status **Won** by hand |

Opportunity defaults: name `{{contact.name}} · Box Top Launch`, source `{{contact.bt_source_bucket}}`, assigned to **Justin**, status Open. Lost reasons: Not a fit · No response · Already has an advisor · Other.

## 5. Calendar: "Box Top Review"

Calendars → Create → **Event calendar**, owner Justin.

| Setting | Proposed | Decide |
|---|---|---|
| Name / slug | Box Top Review / `box-top-review` | |
| Length / price | **About 45 minutes, free** | G4 |
| Where | Zoom or phone (Justin's choice) | G4 |
| Availability | Justin's hours; 24-hour minimum notice | Justin |
| Form | Name, email, phone, "What's the biggest question on your mind about retirement?" | |
| Confirmation and reminders | Calendar's built-in notifications, **email only** (they can't check text consent); reminders 24h and 1h before | |
| Description | "One-on-one with Justin. We put your pieces on the table, find your four corners, and you leave with a clear picture. Education first. No pressure." | Justin approves |

Its booking link goes into Custom Value **BT Review URL**.

## 6. Trigger link

Marketing → Trigger Links → **`BT Replay`** → `{{custom_values.bt_replay_url}}`. Every replay email uses this link, so clicks are tracked.

## 7. Workflows (folder "Box Top Launch")

All workflows: **Allow re-entry OFF** unless noted. **Stop on response OFF.** Time zone: account (Central). Sender: **Justin Stark**, from the verified sending domain, reply-to Justin.

### BT · 01 Inbound (website + Zoom backfill)

**Trigger:** Inbound Webhook. Copy its URL into Vercel as `GHL_BOXTOP_WEBHOOK_URL`, then send one real test registration from the preview site and click **Fetch sample request** so the fields below can be mapped. **Re-entry ON**, since the same person can submit more than once.

1. **Create Contact** (duplicates off; updates the existing contact on email or phone match): First name ← `first_name`, Last name ← `last_name`, Email ← `email`, Phone ← `phone`.
2. **If/Else on `action`:**

**Branch `register` or `replay`:**
  - **Update fields** (always): BT LT Source/Medium/Campaign/Content/Term, BT Campaign ID, BT FBCLID, BT GCLID, BT Source Bucket, BT Zoom Status, BT Consent Version.
  - **If** BT FT Source is empty **and** BT FT Medium is empty → set BT FT Source/Medium/Campaign/Content/Term, BT Landing Page, BT Referrer, BT Registered At. *(First touch is written once and never overwritten.)*
  - **If** webhook `zoom_join_url` is not empty → set BT Zoom Join URL, BT Zoom Registrant ID. *(A duplicate submit never blanks the link.)*
    **Else if** `zoom_fallback_url` is not empty **and** BT Zoom Join URL is empty → set BT Zoom Join URL ← `zoom_fallback_url`. *(Plan B or a Zoom failure: every "your link" button still lands on Zoom's registration page instead of rendering blank.)*
  - **If** `sms_consent` = yes → set BT SMS Event Consent = yes, Consent At, Event Consent Text; add `bt-sms-optin`.
  - **If** `sms_marketing_consent` = yes → set BT SMS Marketing Consent = yes, Consent At, Marketing Consent Text; add `bt-sms-marketing-optin`.
  - **If** `phone_area_flag` = hawaii → add `bt-sms-hawaii`.
  - **If** `sms_confirm_ok` = yes → add `bt-sms-confirm`.
  - **If/Else on `source_bucket`** (9 branches) → add the matching `bt-src-…` tag.
  - **Sub-branch `register`:**
    - Add `bt-registered`.
    - **Create/Update Opportunity:** pipeline Box Top Launch, stage Registered, defaults from §4 (no duplicates).
    - **If** `zoom_status` = failed → add `bt-zoom-failed` + **Internal Notification** (email + in-app) to Kalob and Justin: "Zoom registration failed for {{contact.name}} ({{contact.email}}). Register them in Zoom by hand, then paste their join link into BT Zoom Join URL."
  - **Sub-branch `replay`:** add `bt-replay-request`.

**Branch `profile`:** set BT Segment ← `segment` → **If/Else on `segment`** (5 branches) → add `bt-seg-…`.

**Branch `zoom_direct`** (from `tools/zoom-registrants-to-ghl.js`):
  - **If** the contact already has `bt-registered` → **If** BT Zoom Join URL is empty **or** BT Zoom Status is not `registered` → set Join URL, Registrant ID, Zoom Status = registered. Then end. *(Upgrades Plan B contacts to their real personal link once they finish on Zoom's page; never touches attribution.)*
  - **Else** → set BT Zoom Join URL, Registrant ID, Zoom Status = registered, Source Bucket = zoom-direct; add `bt-src-zoom-direct`, `bt-registered`; Create Opportunity (Registered).

### BT · 02 Launch confirmation

**Trigger:** Contact Tag added `bt-registered`.

1. **Email M01** "You're in" (immediately). *Skip for `bt-test`? No: test contacts should receive everything.*
2. **If** has `bt-sms-optin` **and** `bt-sms-confirm` **and** not `bt-sms-hawaii` **and** SMS not DND → **Wait: time window 11:00 AM to 6:55 PM, any day** → **SMS S01** confirmation.

*(The window is Central. It lands 9 AM to 4:55 PM Pacific, 12 PM to 7:55 PM Eastern, and 8 AM or later Alaska time. Hawaii numbers skip it; they get the email.)*

### BT · 03 Launch reminders

**Trigger:** Contact Tag added `bt-registered`. Every Wait uses **"If the time is already in the past: Skip all outbound communication actions until the next wait"**, so late registrants never get stale messages.

| Step | Wait until (CT) | Then |
|---|---|---|
| 1 | Wed Nov 4, 10:00 AM | Email **M02** "What you get for showing up live" |
| 2 | Fri Nov 6, 10:00 AM | Email **M03** "One thing to bring Monday" |
| 3 | Sun Nov 8, 12:00 PM | Email **M04** "This time tomorrow" → **If** `bt-sms-optin` & not DND → SMS **S02** |
| 4 | Mon Nov 9, 8:00 AM | Email **M05** "Today at noon Central" |
| 5 | Mon Nov 9, 11:00 AM | Email **M06** "One hour" → **If** `bt-sms-optin` & not `bt-sms-hawaii` & not DND → SMS **S03** |
| 6 | Mon Nov 9, 12:02 PM | Email **M07** "We're live" → **If** `bt-sms-optin` & not DND → SMS **S04** |

**Goal (exit):** tag `bt-attended-live` added *(once attendance is imported, nobody gets a stray message)*.

### BT · 04 Attended live

**Trigger:** Contact Tag added `bt-attended-live` (from the CSV import).

1. Update Opportunity → **Attended Live**. Remove tag `bt-no-show` if present.
2. **Wait until Mon Nov 9, 2:00 PM** (if past: **continue**) → Email **M08** "Thank you for coming + your 5 tools".
3. **Wait until Wed Nov 11, 10:00 AM** (if past: skip outbound to next wait) → Email **M09** "Take the Box Top Quiz".
4. **Wait until Fri Nov 13, 10:00 AM** (if past: skip) → Email **M10** "Want me to look at your picture with you?" → **If** `bt-sms-marketing-optin` & not DND → **Wait: time window 1:00 PM to 6:55 PM** → SMS **S06** review invite.
5. **Wait until Mon Nov 16, 10:00 AM** (if past: skip) → Email **M11** "Last call for November Box Top Reviews".

**Goal:** `bt-review-booked`.

### BT · 05 Missed live (no-shows + replay requests)

**Trigger:** Contact Tag added `bt-no-show` **or** `bt-replay-request`.

1. **Create/Update Opportunity** → **Missed Live (Replay)** (creates one for replay requesters, who never had one).
2. **Wait until Mon Nov 9, 6:00 PM** (if past: **continue**) → Email **M12** "Here's the replay" → **If** `bt-sms-optin` & not DND → **Wait: time window 9:00 AM to 6:55 PM** → SMS **S05** replay.
3. **Wait until Wed Nov 11, 10:00 AM** (if past: skip) → Email **M13** "Did you get to watch?"
4. **Wait until Fri Nov 13, 10:00 AM** (if past: skip) → Email **M14** review invite (replay version) → **If** `bt-sms-marketing-optin` & not DND → **Wait: time window 1:00 PM to 6:55 PM** → SMS **S06**.
5. **Wait until Mon Nov 16, 10:00 AM** (if past: skip) → Email **M15** "Replay comes down tonight".

**Goal:** `bt-review-booked`. *(A replay requester who signs up on Nov 14 gets M12 immediately and only the messages still ahead of them.)*

### BT · 06 Replay clicked

**Trigger:** Trigger Link Clicked → `BT Replay`.

Add `bt-replay-clicked` → **If** not `bt-attended-live` → Update Opportunity → **Replay Engaged**.

### BT · 07 Review booked

**Trigger:** Customer Booked Appointment → calendar **Box Top Review**.

Add `bt-review-booked` → Update Opportunity → **Box Top Review Booked** → Internal Notification to Justin: "Box Top Review booked: {{contact.name}}, {{appointment.start_time}}. Segment: {{contact.bt_segment}}. Came from: {{contact.bt_source_bucket}} / {{contact.bt_lt_content}}."

### BT · 08 Review outcome

**Trigger:** Appointment Status changed → calendar **Box Top Review**.

- **If** Showed → Update Opportunity → **Box Top Review Held**.
- **If** No-show → Email **M16** "Sorry we missed you, here's a new time" (with `{{custom_values.bt_review_url}}`).

### BT · 09 Financial professional alert *(optional)*

**Trigger:** Contact Tag added `bt-seg-pro`.

Internal Notification to Justin: "A financial professional registered for the launch: {{contact.name}}, {{contact.email}}." If an agent-recruiting pipeline exists, also create an opportunity there.

## 8. Launch-day operations (manual, Mon Nov 9)

| Time (CT) | Step |
|---|---|
| ~11:30 AM | Pause the Meta ads |
| At the close | Post `{{custom_values.bt_bonus_vault_url}}` in Zoom chat (attendees get their tools even if the import is late) |
| ~1:45 PM | Zoom → Reports → Webinars → **Attendee report** CSV (can lag; refresh) → GHL Contacts → Import → match on email → **add tag `bt-attended-live`**, map Time in Session → BT Minutes Attended, BT Attended Live = yes. BT · 04 runs |
| ~2:00 PM | Smart list **BT Registered** minus `bt-attended-live` → Bulk Action → **add tag `bt-no-show`**. BT · 05 runs |
| By 5:30 PM | Replay uploaded and plays on `/theboxtop/replay/`. If it won't be ready by 6 PM, edit BT · 05 step 2's wait to the new time |

## 9. Smart lists

BT Registered (`bt-registered`) · BT Paid Meta (`bt-src-paid-meta`) · BT Zoom-direct · BT SMS Event Opt-in · BT SMS Marketing Opt-in · BT Attended · BT Missed Live · BT Review Booked · BT Pros (`bt-seg-pro`) · BT Business Owners · BT Zoom Failed (check daily).

## 10. Test plan (before ads go live)

1. Four website registrations from the preview with `+bt1…4` emails: SMS boxes yes/yes, yes/no, no/no, and Hawaii number + yes. Check fields, tags, opportunity, M01, S01 only where allowed.
2. Same email twice: first touch kept, join link not blanked, no second opportunity, M01 not re-sent (BT · 02 re-entry off).
3. Force a Zoom failure on the preview (wrong webinar ID): `bt-zoom-failed` + alert.
4. Thank-you survey: BT Segment + `bt-seg-…` tag.
5. Backfill script `--dry-run`, then live against a test registrant.
6. Copy BT · 03/04/05 into a **TEST** folder with waits set to the next few minutes; run a test contact through, check skip-if-past behavior and that every merge field renders (especially the join link). Delete the copies.
7. Delete all `bt-test` contacts and their opportunities; delete test registrants in Zoom.

## 11. Decisions for you

| # | Decision | Recommendation |
|---|---|---|
| G1 | A2P approved? | If not by Mon noon: email only; hide both SMS boxes on the page (one-line change) |
| G2 | Fence off existing workflows and blasts from `bt-registered` until Nov 16 | Yes |
| G3 | After Nov 16, add registrants to the **Justin Stark blast list** | Yes for email (they opted in to hear from Justin; they can unsubscribe). Texts only for `bt-sms-marketing-optin` |
| G4 | Box Top Review: length, price, medium | About 45 minutes, free, Zoom or phone (the emails say "free" and "about 45 minutes") |
| G5 | Replay window | Through Mon Nov 16 (M15 says it comes down that night) |
| G6 | BT · 09 pro alert | Yes, if Justin wants agent leads flagged |

## 12. Small website change this sheet relies on

Two extra webhook fields, so GHL doesn't have to do date or area-code math:

- `sms_confirm_ok` = yes when the registration happens before Sun Nov 8, 12:00 PM CT. This keeps any person at 3 or fewer texts in 24 hours.
- `phone_area_flag` = `hawaii` for 808 numbers.

This is about 10 lines in `api/boxtop-register.js` plus tests. I'll add it to the open PR once you approve this sheet.

## Changes from 02-ghl-plan.md

- Pipeline stage 3 is now **"Missed Live (Replay)"** and covers no-shows and after-event replay requests.
- The **`bt-replay-ready`** gate is dropped: the replay link points to our own page, which shows "posting soon" until the recording is up.
- Field "BT SMS Consent" → **"BT SMS Event Consent"**, now alongside the marketing-consent fields.
- Confirmation-text timing and Hawaii handling move server-side (§12).
- Links live in **Custom Values**.
