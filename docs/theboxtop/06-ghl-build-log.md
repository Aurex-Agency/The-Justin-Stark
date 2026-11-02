# GHL build log: Box Top launch

**Account:** Pontotoc Insurance Agency (GoGuru white label, `app.goguru.pro`), location `MCFdomwXH4RRN6HkJgry`.
**Build sheet:** [04-ghl-build.md](04-ghl-build.md). **Copy:** [05-ghl-messages.md](05-ghl-messages.md).
**Rule from Kalob (Nov 2):** change nothing outside the workflow folder **The Justin Stark**.

---

## §0 Pre-flight audit (Mon Nov 2, read-only)

Nothing was created, edited or saved. Workflows and trigger panels were opened to read them and closed with Cancel.

### Workflows that can fire on Box Top contacts

All published workflows were filtered by trigger type, and every published workflow whose trigger could match a Box Top contact was opened.

| Workflow | Folder | Trigger that matches anyone | What happens to a Box Top contact |
|---|---|---|---|
| **FB ACA Ads** (2,451 enrolled) | outside The Justin Stark | Customer Replied, body contains "no thank" · Customer Replied, body contains "not interested" · Number Validation, number is "SMS incapable" or "Not valid" | Replies "no thanks" to any text or email, or registers with a landline: gets tagged, assigned to a user, and an opportunity in the Health Insurance pipeline |
| **REVIEW Text Follow Up** (5 enrolled) | Kalob Automations › IUL Youtube Video Funnel 6/17/26 | Customer Replied, SMS, body contains "REVIEW" / "Review" (+1 more) | Replies to S06 with something like "I'd like a review": gets the review-request message |
| **Appointment Confirmation + Reminder** (625 enrolled) | outside The Justin Stark | Appointment Status, event type Normal, status confirmed, **no calendar filter** | Every confirmed Box Top Review gets a confirmation email, 24h email, 1h email and **1h SMS** (no consent check) |
| **Appointment Confirmation + Reminder** (805 enrolled) | outside The Justin Stark | Same as above | Same again: a second copy of every message |

### Workflows checked and safe

| Trigger type | Published workflows | Why they can't fire on Box Top contacts |
|---|---|---|
| Contact Created / New Contact Created / Contact DND / Opportunity Created / Opportunity Changed / Email Events | none (drafts only) | |
| Contact Tag | 12 | Each needs a specific tag (`tbt-*`, `wealth webinar…`, `aca lead`, `t65.app`, `murray t65`, `sep - lead follo…`, `lead concepts…`, `client - active`, `murray final expense`, `bad number`, `webinar - appt…`, `stale`) |
| Contact Changed | 3 | Policy Status, Client Status, Policy Type, Referrals Signed Up only |
| Inbound Webhook | ~8 | Each webhook has its own URL; only BT · 01's URL receives Box Top posts |
| Form Submitted | ~8 | The site posts to a webhook, never a GHL form |
| Pipeline Stage Changed / Stale Opportunities | 8 | Each limited to its own pipeline (Health Insurance, Seminar, Retirement Workshop, Webinar Leads, Heartland CHAS, Murray T65, FEX) |
| Customer Booked Appointment / Appointment Status | 15 | Each limited to a calendar (Pontotoc Insurance Agency, Retirement Benefits Hub, Retirement Review, Medicare Checkup, RevenX calendars) or the `glp-1-lead` tag, except the two above |
| Trigger Link Clicked | 5 | Each limited to its own link (webinar live/replay, Wealth Webinar Zoom, IUL video, PIA Webinar) |
| External Tracking Event | 1 (Medicare Webinar \| Engagement) | thejustinstark.com only loads `form_embed.js`, not GHL's external tracking script |
| No trigger (bulk-enrolled blasts) | e.g. Facebook Live Blast | Only fire when someone bulk-adds contacts |
| Legacy Triggers | none | Legacy Campaigns exist but nothing auto-enrolls into them |

### Blasts

- **Scheduled:** none. Email campaigns: 3 (2 drafts, 1 sent Nov 2024). Bulk emails: 2, completed 2025. Contact bulk actions: all Complete or Cancelled.
- **How blasts run here:** a bulk "Add tags" on a smart list fires a tag workflow, e.g. "Last Minute Text Blast" (Oct 15) → `tbt-last-minute` → Last Minute Blast; "AEP Blast 10/22/26" (Oct 22).
- **Justin Stark blast list tag:** no tag contains "justin", "stark" or "blast". The Justin Stark tags are the 12 `tbt-*` tags for The Big Table event (`tbt-confirmed`, `tbt-confirm-request`, `tbt-last-minute`, `tbt - vip`, `tbt - in person`, `tbt - general admission`, `tbt - virtual ticket`, …). Saved smart lists include "AEP Blast", "The Big Table GA…", "The Big Table Att…", "Has The Big Tabl…", "RSVP'd But NO R…", "Active Clients".

### Account settings

| Check | Found |
|---|---|
| A2P 10DLC | **Brand approved** (Standard, Verified, since Feb 28 2024). **Campaign CO8YFVU verified**, use case **LOW_VOLUME** (Low Volume Mixed). All 6 numbers A2P verified; default number +1 662-509-4055 "Justin Stark" (first recorded as 4065, a misread; workflow settings show 4055 as Default Number). Sample messages and opt-in text not visible in the UI |
| Email sending domain | **replies.pontotocinsuranceagency.com**, verified in GHL (SSL issued, shared IP, since Feb 2024), default for every email type. DNS: SPF (Mailgun) and DKIM (`k1`) present, **no DMARC** on `pontotocinsuranceagency.com`. DNS host GoDaddy (`ns49/ns50.domaincontrol.com`) |
| Time zone | **GMT-06:00 America/Chicago** |
| Legal business name | **Stark Advisory Group** (Friendly name: Pontotoc Insurance Agency) |
| Postal address (email footer) | 158 D, Ms Hwy 15, Pontotoc, MS 38863 |
| Custom fields | 271 fields, 21 folders. No "Box Top" folder. Only `BT` matches: `TBT_Referred By Code`, `TBT_Referral Code` (keys `tbt_…`, folder "The Big Table Event"). No collision |
| Custom values | ~33, none starting `BT` |
| Pipelines | 32. No "Box Top Launch". No agent-recruiting pipeline |
| Calendars | 12. Homepage embeds **The Justin Stark** (`gHRH13Wn3Bo11BnGP8rO`, personal, 30 min): leave alone. No "Box Top Review" |
| Users | Justin Stark (justin@pontotocinsuranceagency.com), Kalob Adair |
| Workflow folder | **The Justin Stark** (10 workflows: Big Table payments, TBT Event Confirmation, Last Minute Blast, referral trio, Coach Burt 1 on 1 Payment) |

### Not yet in the website code

§12 of the build sheet depends on `sms_confirm_ok` and `phone_area_flag` in the webhook payload. Neither is in `api/boxtop-register.js` on the PR #8 branch yet.

---

## Decisions (Nov 2)

Kalob approved the audit recommendations: G1 SMS on · G3 email yes, texts only `bt-sms-marketing-optin` (list name still needed) · G4 as recommended · G5 through Nov 16 · G6 notification only · DMARC `p=none` (pending GoDaddy access) · Inbound Webhook premium trigger OK. G2 fences: each workflow still gets its own approval before it is touched.

**Later on Nov 2:**
- **Plan B is permanent** (Option 1). The Zoom webinar owner can't create API credentials, so every registration arrives with `zoom_status = skipped` and the site sends people to Zoom's own registration page as step 2.
- **The 1:1 Box Top Review offer is dropped.** No §5 calendar, no BT · 07/08, no fences C/D. Emails that pointed to the Review point to the book and the quiz instead.
- **No PIA client tag exists**, so fences use "does not have `bt-contact`" with no client exemption.
- **Test contacts:** only phone `6625078886` (Kalob's), emails `kalob+bt-testN@aurexagency.com`, tagged `bt-test`. GHL dedupes by phone, so tests run one after another on one contact, with Box Top fields and tags cleared between cases. No other contact in the account is used.
- **From:** "Justin Stark" `justin@replies.pontotocinsuranceagency.com`, reply-to `justin@pontotocinsuranceagency.com`.
- **SMS brand prefix:** "The Justin Stark".
- **Zoom registrant / attendee CSVs:** Kalob gets them from the owner later.

**Sheet revised mid-build.** Another session pushed `efcce2a` to PR #8 at 16:21 UTC ("Apply the GHL plan review…"): 04 rewritten (fence tag is now `bt-contact` with a PIA-client exemption, 31 fields incl. BT Event Phase, BT Zoom Register URL, `bt-replay-ready` gate, 48-hour notice), 05 adds M01T/M01L/M01Z/M17 and rewrites SMS, and the website already sends `event_phase`, `sms_confirm_ok`, `phone_area_flag` (`hawaii` / `no-sms`) and `zoom_status = skipped`. The build below follows the revised sheet. No new code commit was needed.

## Build

### §1 Custom fields · folder "Box Top" (Contact) · 31 fields

All keys GHL generated match the sheet. All Single line except where noted.

| Field | Merge key |
|---|---|
| BT Zoom Join URL | `{{contact.bt_zoom_join_url}}` |
| BT Zoom Registrant ID | `{{contact.bt_zoom_registrant_id}}` |
| BT Zoom Status | `{{contact.bt_zoom_status}}` |
| BT Registered At | `{{contact.bt_registered_at}}` |
| BT Event Phase | `{{contact.bt_event_phase}}` |
| BT SMS Event Consent | `{{contact.bt_sms_event_consent}}` |
| BT SMS Event Consent At | `{{contact.bt_sms_event_consent_at}}` |
| BT Event Consent Text (Multi line) | `{{contact.bt_event_consent_text}}` |
| BT SMS Marketing Consent | `{{contact.bt_sms_marketing_consent}}` |
| BT SMS Marketing Consent At | `{{contact.bt_sms_marketing_consent_at}}` |
| BT Marketing Consent Text (Multi line) | `{{contact.bt_marketing_consent_text}}` |
| BT Consent Version | `{{contact.bt_consent_version}}` |
| BT Segment | `{{contact.bt_segment}}` |
| BT Source Bucket | `{{contact.bt_source_bucket}}` |
| BT FT Source / Medium / Campaign / Content / Term | `{{contact.bt_ft_source}}` `…bt_ft_medium` `…bt_ft_campaign` `…bt_ft_content` `…bt_ft_term` |
| BT LT Source / Medium / Campaign / Content / Term | `{{contact.bt_lt_source}}` `…bt_lt_medium` `…bt_lt_campaign` `…bt_lt_content` `…bt_lt_term` |
| BT Campaign ID | `{{contact.bt_campaign_id}}` |
| BT FBCLID | `{{contact.bt_fbclid}}` |
| BT GCLID | `{{contact.bt_gclid}}` |
| BT Landing Page | `{{contact.bt_landing_page}}` |
| BT Referrer | `{{contact.bt_referrer}}` |
| BT Attended Live | `{{contact.bt_attended_live}}` |
| BT Minutes Attended (Number) | `{{contact.bt_minutes_attended}}` |

### §2 Custom values (no folder)

| Name | Key | Value |
|---|---|---|
| BT Replay URL | `{{custom_values.bt_replay_url}}` | `https://thejustinstark.com/theboxtop/replay/` |
| BT Bonus Vault URL | `{{custom_values.bt_bonus_vault_url}}` | `https://thejustinstark.com/theboxtop/bonuses/` |
| BT Zoom Register URL | `{{custom_values.bt_zoom_register_url}}` | `https://us02web.zoom.us/webinar/register/WN_bjdBGZXbSoOfl3x2_XPqHQ` |
| BT Review URL | `{{custom_values.bt_review_url}}` | **empty** until the §5 calendar exists |
| BT Book URL | `{{custom_values.bt_book_url}}` | **empty** until the book link is known |

### §3 Tags (28, created ahead, no category)

`bt-contact` `bt-registered` · `bt-src-paid-meta` `bt-src-paid-other` `bt-src-organic-social` `bt-src-vanity` `bt-src-referral` `bt-src-email` `bt-src-direct` `bt-src-other` `bt-src-zoom-direct` · `bt-sms-optin` `bt-sms-marketing-optin` `bt-sms-confirm` `bt-sms-hawaii` · `bt-zoom-failed` · `bt-seg-retired` `bt-seg-red-zone` `bt-seg-planning` `bt-seg-business-owner` `bt-seg-pro` · `bt-attended-live` `bt-no-show` · `bt-replay-request` `bt-replay-ready` `bt-replay-clicked` · `bt-review-booked` · `bt-test`

### §4 Pipeline "Box Top Launch" (7 stages)

Registered (10%) · Attended Live (30%) · Missed Live (Replay) (20%) · Replay Engaged (30%) · Box Top Review Booked (60%) · Box Top Review Held (80%) · Client (100%). The sheet doesn't set probabilities; these are placeholders. "Show in reports" left at GHL defaults. Owner, source and no-duplicates are set in the workflow actions, not on the pipeline.

### §5 Calendar "Box Top Review"

**Dropped (Nov 2).** The 1:1 Review offer is off, so no calendar. BT Review URL stays empty and unused; the pipeline's two Review stages stay but nothing moves contacts there.

### §6 Trigger link

**BT Replay** → `{{custom_values.bt_replay_url}}` · key `{{trigger_link.Lbc8PBvv84TFzWcaLnJK}}` (use this in M12/M13/M15 and S05 in place of `{{trigger_link.bt_replay}}`).

### §7 Workflows · folder "The Justin Stark › Box Top Launch"

| Workflow | Status | Notes |
|---|---|---|
| BT · 01 Inbound | **Published 5:01 PM Nov 2** (Kalob's call, so Production signups aren't dropped; PR #8 went live at 2:51 PM). All three branches built, re-entry ON, tested (§10). BT · 02/03 still Draft, so no messages go out yet | Inbound Webhook URL ends `…217d7707f411` (not written here because anyone with it can post contacts). Mapping reference: request `nuuZrb47KEN4nNfKWUlb` (Nov 2, 12:26:16 PM CT) |
| BT · 02 Confirmation | **Draft** (Nov 2). Re-entry OFF | M01, M01ZL, M01ZT, M01Z, S01 |
| BT · 03 Reminders | **Draft** (Nov 2). Re-entry OFF. Goal: tag added `bt-attended-live` | M02 to M07, S02 to S04 |
| BT · 04 Attended | **Draft** (Nov 2). Re-entry OFF | M08 to M11, S06 |
| BT · 05 Missed live | **Draft** (Nov 2). Re-entry OFF. Goal: tag added `bt-attended-live` | M12 to M15, S05, S06 |
| BT · 06 Replay clicked | **Draft** (Nov 2). Re-entry ON | No messages |
| BT · 09 Pro alert | **Draft** (Nov 2). Re-entry OFF | Internal email to Justin |

All seven: 0 enrolled as of 4:28 PM CT Nov 2. Every email has From "Justin Stark" `justin@replies.pontotocinsuranceagency.com` set on the action and in workflow settings; texts go from the default number +1 662-509-4055. Times are the account time zone (Central). Nothing has been tested or sent.

#### BT · 01 as built (Plan B)

GHL's If/Else branches don't rejoin, so each "skip" path uses a **Go to** step that jumps to the next check. Every value below is an `{{inboundWebhookRequest.…}}` chip.

**If/Else "Which action?"** on `action`: register / replay / profile / None (ends).

**register**
1. **Create/update contact (register):** first, last, email, phone, BT LT ×5, BT Campaign ID, BT FBCLID, BT GCLID, BT Source Bucket.
2. **Add tag `bt-contact`** (the create/update action has no tags field).
3. **First registration?** BT Registered At is empty → **Set first-touch fields:** BT FT ×5, Landing Page, Referrer, Registered At, Event Phase. Otherwise → Go to step 4.
4. **Zoom link empty?** BT Zoom Join URL is empty → **Set Zoom link + status:** Join URL ← `zoom_fallback_url`, Zoom Status ← `zoom_status`. Otherwise → Go to step 5.
5. **Event texts consent?** `sms_consent` is yes → set Event Consent, At, Text, Consent Version → add `bt-sms-optin`. Otherwise → Go to step 6.
6. **Marketing texts consent?** `sms_marketing_consent` is yes → set Marketing Consent, At, Text, Consent Version → add `bt-sms-marketing-optin`. Otherwise → Go to step 7.
7. **Confirm text OK?** `sms_confirm_ok` is yes → add `bt-sms-confirm`. Otherwise → Go to step 8.
8. **Hawaii number?** `phone_area_flag` is hawaii → add `bt-sms-hawaii`. Otherwise → Go to step 9.
9. **Source bucket** on `source_bucket`: paid-meta / paid-other / organic-social / vanity / referral / email / direct, each → add its `bt-src-…` tag → Go to step 10. None ("other") → add `bt-src-other` → step 10.
10. **Opportunity: Registered** (new "Create opportunity" action): pipeline Box Top Launch, stage Registered, name `{{contact.name}} · Box Top Launch`, source `{{contact.bt_source_bucket}}`, **duplicates disabled for this action only** (a contact with an open opportunity in this pipeline is skipped, later steps still run). Owner not set; see open items.
11. **Add tag `bt-registered`** (last).

**replay**
1. **Create/update contact (replay):** first, last, email, BT LT ×5, Campaign ID, FBCLID, GCLID, Source Bucket. No phone (the replay form doesn't ask).
2. **Add tag `bt-contact`.**
3. **Replay: first touch?** BT Registered At is empty **and** BT Landing Page is empty → set BT FT ×5, Landing Page, Referrer. Otherwise → Go to step 4.
4. **Replay window closed?** `event_phase` is closed → Email **M17 Replay closed** → End. Otherwise → add `bt-replay-request`. (`bt-replay-ready` gets added here on launch day, §8.)

**profile**
1. **Create/update contact (profile):** email and BT Segment only.
2. **Segment** on `segment`: retired / red-zone / planning / business-owner / pro, each → add its `bt-seg-…` tag. None ends.

#### How the date waits behave

Every "Wait until" below is a fixed Central date and time. GHL asks what to do if that time has already passed:
- **skip** (GHL's default): skip every email and text until the next wait. This is the sheet's "if past → skip".
- **continue**: go straight to the next step.

Text windows are a 0-minute wait with **Advance window** on (all days, start and end time). GHL only offers 15-minute steps, so the sheet's 6:55 PM end is **6:45 PM**. DND isn't checked in If/Else: GHL's SMS action doesn't send to contacts with DND on.

#### BT · 02 Confirmation as built

**Trigger:** tag added `bt-registered`.
1. **Which confirmation?** (first match wins)
   - **on Zoom list:** BT Zoom Status is registered → **M01 You're in (Zoom list)** → End.
   - **live now:** BT Event Phase is live → **M01ZL Live now** → End.
   - **today:** BT Event Phase is today → **M01ZT Same day** → End.
   - **default** → **M01Z One more step** → step 2.
2. **Send S01?** has `bt-sms-optin` and `bt-sms-confirm`, not `bt-sms-hawaii` → **Text window 11–6:45 CT** → **S01 Confirm on Zoom**. Otherwise → End.

#### BT · 03 Reminders as built

**Trigger:** tag added `bt-registered`. All waits skip if past.
1. Wait Wed Nov 4 10 AM → **M02 Bonus stack**.
2. Wait Fri Nov 6 10 AM → **M03 Homework**.
3. Wait Sun Nov 8 12 PM → **M04 24 hours** → **Send S02?**
   - **hawaii text** (`bt-sms-optin` + `bt-sms-hawaii`): Wait Sun Nov 8 12:05 PM → **S02 Tomorrow (Hawaii)** → Go to step 4.
   - **text** (`bt-sms-optin`): **S02 Tomorrow** → Go to step 4.
   - **no text** → step 4.
4. Wait Mon Nov 9 8 AM → **M05 Today**.
5. Wait Mon Nov 9 11 AM → **M06 One hour** → **Send S03?** (`bt-sms-optin`, not `bt-sms-hawaii`) → **S03 One hour** → Go to step 6. Otherwise → step 6.
6. Wait Mon Nov 9 12:02 PM → **M07 Live** → **Send S04?** (`bt-sms-optin`) → **S04 Live now**. Otherwise → **Goal:** tag added `bt-attended-live`.

#### BT · 04 Attended as built

**Trigger:** tag added `bt-attended-live`.
1. **Remove from workflow BT · 05** → **Remove tag `bt-no-show`** (Remove all tags off).
2. **Find opportunity** (pipeline Box Top Launch, most recently created):
   - Found → **Update opportunity: Attended Live**, backward moves allowed → step 3.
   - Not found → Go to step 3.
3. Wait Mon Nov 9 2 PM (**continue** if past) → **M08 Thank you + tools**.
4. Wait Wed Nov 11 10 AM → **M09 Quiz**.
5. Wait Fri Nov 13 10 AM → **M10 The packet** → **Send S06?**
   - **book + text** (BT Book URL is not empty and `bt-sms-marketing-optin`): Wait Fri Nov 13 1 PM → **S06 The book** → Go to step 6.
   - **no text** → step 6.
6. Wait Mon Nov 16 10 AM → **Book URL set?** BT Book URL is not empty → **M11 The book**. Otherwise → End.

#### BT · 05 Missed live as built

**Triggers:** tag added `bt-no-show`; tag added `bt-replay-request`.
1. **Already attended?** has `bt-attended-live` → End. Otherwise (**missed**) → step 2.
2. **Find opportunity** (Box Top Launch, most recently created):
   - Found → **Update opportunity: Missed Live (Replay)**, no backward moves → step 3.
   - Not found → Go to step 3.
3. Wait Mon Nov 9 6 PM (**continue** if past) → **Replay gate:** wait until has `bt-replay-ready` (no timeout) → **M12 Replay** → **Send S05?** (`bt-sms-optin`)
   - text → **Text window 12–6:45 CT** → **S05 Replay** → Go to step 4.
   - no text → step 4.
4. Wait Wed Nov 11 10 AM → **M13 Replay check-in**.
5. Wait Fri Nov 13 10 AM → **Book URL set?**
   - **book + text** (BT Book URL not empty and `bt-sms-marketing-optin`): **M14 The book (replay)** → Wait Fri Nov 13 1 PM → **S06 The book** → Go to step 6.
   - **book** (BT Book URL not empty): **M14** → Go to step 6.
   - **no book** → step 6.
6. Wait Mon Nov 16 10 AM → **M15 Replay comes down** → **Goal:** tag added `bt-attended-live`.

#### BT · 06 Replay clicked as built

**Trigger:** Trigger link clicked, link **BT Replay**.
1. **Add tag `bt-replay-clicked`.**
2. **Find opportunity:** pipeline Box Top Launch **and** stage Missed Live (Replay), most recently created.
   - Found → **Update opportunity: Replay Engaged** (backward moves off).
   - Not found → End. This covers "only from Missed Live": attendees and anyone further along are never moved.

#### BT · 09 Pro alert as built

**Trigger:** tag added `bt-seg-pro`.
1. **Internal notification** (email) to user **Justin Stark**. Subject "Box Top: a financial professional signed up". Body: name, email, phone, BT Source Bucket, and a note that the contact has `bt-seg-pro`. Sender left at the account default. No agent-recruiting pipeline exists (§0), so no opportunity.

#### Incident: BT · 01 published by mistake (Nov 2)

At **2:53 PM CT** a keyboard shortcut sent while no text field had focus toggled BT · 01 to **Published**. It was switched back to **Draft at 2:56 PM**. The workflow list shows **0 enrolled**, so nothing ran during those three minutes. Since then every keystroke is sent only after confirming a field has focus.

### §10 Tests (Nov 2, 4:40 to 4:57 PM CT)

**Setup.** One contact only: Kalob's "Tester Bob", (662) 507-8886, tagged `bt-test`. Before the tests it had no email, one tag (`tbt - referral code`), no opportunities and no active workflows. Registrations were posted to the PR #8 preview's `/api/boxtop-register` (`the-justin-stark-cf7gsagjj…`, Preview environment: webhook URL set, no Meta server token) from the browser with the form's exact payload. That skips the thank-you page, so no browser CompleteRegistration hit the real pixel.

**Live window (Kalob's choice: publish BT · 01 to 03 briefly).** BT · 01, 02 and 03 were published 4:41 to 4:49 PM. BT · 02 re-entry was turned on for the window so one contact could go through it twice, then turned back off. BT · 01's enrollment history shows only the six test posts; no real signup came in. Afterwards all three went back to Draft and the contact was removed from BT · 03 (it was waiting for Nov 4).

| Case | Sent | Result |
|---|---|---|
| 1. No text boxes | `register`, FB UTMs | Same record (matched by phone), email set to `kalob+bt-test1`. Tags `bt-contact`, `bt-src-paid-meta`, `bt-registered`. Opportunity Box Top Launch › Registered, "Tester Bob · Box Top Launch". Fields: Zoom Status skipped, Join URL = Zoom registration page, Registered At, Event Phase pre, FT and LT UTMs, Source Bucket paid-meta. BT · 02: default → **M01Z** sent, "no text". BT · 03 entered, waiting for Wed Nov 4. **Pass** |
| 2. Event texts only | `bt-registered` removed first | `bt-sms-optin`, `bt-sms-confirm` added; consent fields set. BT · 02: **M01Z** again, "text ok" → window → **S01** delivered to 662-507-8886 with the Zoom link filled in. BT · 03 not re-entered (still enrolled). **Pass** |
| 3. Both boxes, same person again | `bt-registered` kept | `bt-sms-marketing-optin` and marketing consent added. First touch kept (FT content case1, Registered At unchanged), last touch updated. Opportunity step: "Skipped: contact already has an open opportunity". No second M01Z or S01. **Pass** |
| 4. Same phone, new email (`kalob+bt-test2`) | | GHL updated the **same record** and replaced its email. **Finding:** spouses sharing one phone end up as one contact; the second signup's email and name overwrite the first's. Texts still go to the phone that consented |
| 5. Survey | `profile`, planning | BT Segment planning, `bt-seg-planning`. Name and phone unchanged. **Pass** |
| Replay request | `replay` | Replay branch "open" → `bt-replay-request`; last touch updated, first touch kept. BT · 05 was Draft, so nothing fired. **Pass** |
| 6. Fence | | Only Box Top workflows ran on the contact; no PIA workflow enrolled it. **Pass** |

**Draft workflows with GHL's "Run a test"** (runs the real actions for a chosen contact as if the trigger fired; nothing is published). GHL's test runs **honor date waits**, so each run stopped at its first future wait and no email or text after a wait was sent.

| Run | Result |
|---|---|
| BT · 06, opportunity at Registered | Tag `bt-replay-clicked`; Find opportunity (Missed Live) → Not found → End. Stage unchanged. **Pass** |
| BT · 04 | Remove from BT · 05, remove `bt-no-show`, Find → Attended Live, then waiting at Mon Nov 9 2 PM. Contact removed by hand. **Pass** |
| BT · 05 | "missed" → Find → Missed Live (Replay) (forward move), then waiting at Mon Nov 9 6 PM. **Pass** |
| BT · 06, opportunity at Missed Live | Found → Replay Engaged. Re-entry worked. **Pass** |
| BT · 04 again (re-entry off) | **Skipped**, as designed |
| 8. BT · 04 again (re-entry on for the run, then off) | "Removed From Workflows: BT · 05 Missed live"; opportunity moved back Replay Engaged → Attended Live (backward allowed). Contact removed from BT · 04 by hand. **Pass** |

**Not covered**
- Everything after the first future wait: M02 to M15, S02 to S06, skip-if-past, the replay gate, the goals and merge fields in those emails (sheet test 7). Needs copies of BT · 03, 04 and 05 with waits a few minutes out.
- M01 (Zoom list), M01ZT and M01ZL. They depend on BT Zoom Status = registered or a same-day Event Phase, which the site only sends on Nov 9.
- The 808 case, the existing-PIA-contact case and a 2-row CSV import (one-phone rule). Forced Zoom failure doesn't apply under Plan B. BT · 09 was not run: it emails Justin.
- Test 9 cleanup: the contact still has its Box Top tags, fields, email `kalob+bt-test2@aurexagency.com` and an open Box Top Launch opportunity (Attended Live). Left for Kalob.

**Sent to Kalob during the tests:** M01Z × 2 (to `kalob+bt-test1`), S01 × 1 (to 662-507-8886).

### §0b Fences (approved by Kalob, Nov 2) · remove on Nov 17

| Workflow | Change | Result |
|---|---|---|
| **B · REVIEW Text Follow Up** | Trigger "Customer Replied" (SMS, body contains REVIEW / Review / +1): added filter **Doesn't have tag `bt-contact`**. Nothing else touched | **Live.** Saved Nov 2; still Published |
| **A · FB ACA Ads** | Tried: same filter on "Customer Replied no thank" and "Customer Replied" (not interested) | **Not applied.** GHL refuses to save the workflow: "Workflow can't be published yet, 7 issues" that predate this build (ACA Survey Submitted trigger: survey deleted · Medicare Eligible trigger: stage not in pipeline · 2× Assign to user: user deleted · 2× Create Opportunity: pipeline/stage deleted · Remove Opportunity: no opportunity set). Fixing them means editing other parts of PIA's workflow, which wasn't approved. Unsaved changes discarded; workflow unchanged (last updated Feb 16, 2024, still Published) |
| A · FB ACA Ads, "Number validation" trigger | Not possible | That trigger's filters only offer custom fields; there is no tag filter |

**Decision (Kalob, Nov 2): leave FB ACA Ads as is.** Accepted risk: a Box Top contact who replies "no thanks" / "not interested", or whose number fails validation, can enter it until Nov 17.

### Vercel and the mapping sample (Nov 2)

- `GHL_BOXTOP_WEBHOOK_URL` added to project `the-justin-stark` (scope kalob-engs-projects) as **Sensitive**, for **Production** and **Preview** (all branches), via the Vercel CLI. The Vercel MCP connector still returned 403 after team access was approved.
- PR #8 preview (built from `efcce2a`) redeployed so the variable applies: `the-justin-stark-glcwucddl-kalob-engs-projects.vercel.app`.
- Test registration on that preview: Kalob BTTest, `kalob+bt-test1@aurexagency.com`, `+16625550100` (fictional 555 number), both SMS boxes checked. The survey was not answered. The sample in GHL contains every payload key, including `event_phase` (pre), `sms_confirm_ok` (yes), `phone_area_flag` (empty), `zoom_status` (skipped) and `zoom_fallback_url`.
- **Found:** the project has no Zoom variables in any environment, so every registration is currently Plan B (`zoom_status = skipped`, no personal join link). `META_CAPI_TOKEN` exists only in Production, so preview tests send nothing to Meta.

## Differences from the sheet

| Sheet | What happened | Why |
|---|---|---|
| Order §1 → §7 | §5 calendar deferred; §6 and BT · 01 done first | §5 has open questions; the webhook URL unblocks the Vercel step |
| §7 BT · 01: copy URL, then fetch sample | URL exists, trigger can't be saved until a sample arrives | GHL requires a mapping reference to save the trigger |
| §2 BT Review URL / BT Book URL | Created empty | Values don't exist yet; GHL allows empty |
| §4 probabilities | Placeholder values | Not specified |
| 05 SMS brand prefix "Pontotoc Insurance Agency" | "The Justin Stark" (Kalob, Nov 2) | Trust Center shows the brand SID, not its name; Business Profile legal name is "Stark Advisory Group" |
| §5 calendar, BT · 07/08 | Not built | Review offer dropped (Nov 2) |
| BT · 01 `zoom_direct` branch, Zoom-failure alert | Not built | Plan B is permanent: no Zoom API, so no backfill posts and `zoom_status` is never `failed` |
| BT · 01 step 1 "tag `bt-contact`" in Create/Update Contact | Separate Add tag step right after it | GHL's Create/update contact action has no tags field |
| BT · 01 steps 4–5 (set Zoom Status whenever `zoom_status` is sent; Join URL from fallback when empty) | Both set together, only when BT Zoom Join URL is empty | Plan B always sends `skipped`; this keeps a later re-submit from overwriting a status set by the Zoom CSV import. **The CSV import must also set BT Zoom Join URL** (the Zoom registration page) |
| BT · 01 step 9 "Create/Update Opportunity, no duplicates, owner Justin" | New "Create opportunity" action with duplicates disabled for that action; owner left unset | GHL marks Create/Update as being deprecated. Its replacement has no owner field, and the separate "Add owner" step also reassigns the contact owner when owner sync is on, which would move existing PIA contacts from other agents (Benjamin, Brandon, Chris, Jake) to Justin. Needs Kalob's call |
| BT · 01 replay: first-touch "only if BT Registered At is empty" | Also requires BT Landing Page empty | Replay-only contacts never get Registered At, so without this a second replay request would overwrite first touch |
| BT · 01 replay: closed → M17 | M17 added (Nov 2) | Built with the other emails |
| BT · 01 profile: Set BT Segment as its own step | Set inside the Create/update contact (profile) action | Same result, one step fewer |
| From with reply-to `justin@pontotocinsuranceagency.com` | From name and address set; **no reply-to** | GHL's email action has no reply-to field. Replies go to `justin@replies.pontotocinsuranceagency.com`. The sending domain's reply forwarding (Settings › Email) decides where they land; not checked |
| Text windows end 6:55 PM | 6:45 PM | GHL's window picker only has 15-minute steps |
| BT · 02 step 2: S01 check after any confirmation | S01 only after M01Z | S01 says "confirm your seat on Zoom", which only fits M01Z. Same-day signups don't get `bt-sms-confirm` from the site, and Zoom-list imports are already confirmed |
| BT · 03 Hawaii S02 "wait 5 min" | Wait until Sun Nov 8 12:05 PM | A 5-minute wait after a skipped Sunday wait would send "tomorrow" on Monday to a late registrant. A dated wait with skip-if-past can't |
| BT · 04 and 05: S06 "Advance window 1:00 to 6:55 PM" | Wait until Fri Nov 13 1 PM (skip if past) | Someone entering after Friday would otherwise get S06 out of order. 1 PM CT is 9 AM in Hawaii and 2 PM Eastern, inside 8 AM to 8 PM everywhere |
| BT · 04 step 2 / BT · 05 step 1 "Update/Create opportunity" | Find opportunity, then Update opportunity on Found | The trigger is a tag, not an opportunity, so Update needs Find first. Not found skips the stage step and continues |
| BT · 05 trigger: one trigger, `bt-no-show` **or** `bt-replay-request`, filter "does not have `bt-attended-live`" | Two tag triggers, then If/Else "Already attended?" | The Tag added filter takes one tag, and trigger filters have no "has tag" option |
| BT · 03 and 05 goal | Goal step at the end of the main line | A goal reached mid-workflow jumps the contact to the goal; anything after it would still send |
| BT · 06 "If opportunity stage = Missed Live" | Stage filter inside Find opportunity | Same result without an extra If/Else |
| M11, M14, S06 "only if BT Book URL is filled in" | If/Else on the BT Book URL custom value (Is not empty) | Custom values are in the If/Else field list. Today the value is empty, so these don't send |
| BT · 09 notification wording | Written in the build (not in 05) | The sheet only says "Internal Notification to Justin" |
