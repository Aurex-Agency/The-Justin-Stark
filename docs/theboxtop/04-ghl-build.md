# GHL build sheet: Box Top launch (for approval before anything is created)

**Account:** the GoGuru/GHL sub-account for **Pontotoc Insurance Agency (PIA)**, which also sends **Justin Stark blasts**. Everything here is namespaced (`BT ·` workflows, `bt-` tags, a **Box Top** custom-field folder, its own pipeline and calendar). Nothing existing is deleted or renamed. The only edits to existing items are the fences in step 0, and each one gets your OK and a removal date.

**Source of truth for the webhook payload:** `api/boxtop-register.js` (in PR #8). Every key mapped below exists there, including `event_phase`, `sms_confirm_ok` and `phone_area_flag`. **PR #8 must be merged before capturing the webhook sample**, or those keys won't be in it to map.
**Message copy:** [05-ghl-messages.md](05-ghl-messages.md).
**Status:** revised after an independent review (log at the end). Where this differs from 02-ghl-plan.md, this sheet wins.

---

## 0. Pre-flight audit (read-only first, then fences with your OK)

### 0a. Look (change nothing)

| Where | Look for |
|---|---|
| Automation → Workflows (published) | Triggers that could fire on Box Top contacts: **Contact Created** · **Contact Tag** (any tag, or `bt-`) · **Contact Changed** · **Inbound Webhook** · **Form/Survey Submitted** (any) · **Opportunity Created / Status / Stage Changed** (any pipeline) · **Appointment / Customer Booked** (any calendar) · **Customer Replied** · **Trigger Link Clicked** · **Email events** (opened, clicked) · **Conversation AI / auto-replies** on SMS or email |
| Marketing → Emails and Bulk Actions (scheduled) | Justin Stark blasts or PIA sends scheduled Nov 2 to 16 to "all contacts" or broad lists |
| Settings → Tags | The exact tag(s) for the **Justin Stark blast list**, and the tag(s) that mark **existing PIA clients** |
| Settings → Business Profile | Time zone. **Don't change it**, since that retimes PIA's workflows. If it isn't Central, set each BT workflow's time zone to Central in its settings, or convert every wait below |
| Settings → Email Services | Which sending domain is assigned to **Workflows** and to **Bulk**. Use what's there; don't add or reassign domains without checking PIA's mail |
| Settings → Phone System → Trust Center | A2P 10DLC brand name and campaign use case. Texts must name the registered brand |
| Settings → Custom Fields | No existing "Box Top" folder or `BT …` fields |

### 0b. Fence (each one approved by you, logged, removal date **Nov 17**)

- **`bt-contact`** is the fence tag. BT · 01 sets it **in the Create/Update Contact action itself**, if that action has a tags field; otherwise it's the very first action. Every Box Top path sets it, including replay requests and zoom_direct.
- **Workflows triggered by Contact Created:** a filter can't see a tag that doesn't exist yet. Add **Wait 2 minutes → If has `bt-contact` and not [PIA client tag] → End** at the top.
- **Workflows triggered by any tag / any form / any pipeline / any calendar / replies:** prefer **narrowing the trigger** to PIA's own tags, forms, pipelines or calendars. Otherwise add the filter "does not include `bt-contact`", **unless the contact has the PIA client tag**. That way existing PIA clients who register keep their PIA flows during Medicare open enrollment (AEP).
- **Scheduled blasts Nov 2 to 16:** exclude `bt-contact`.
- **Tell Justin:** a STOP reply to any Box Top text sets text-DND on the whole contact. That includes PIA's texts to that person if they're also a client. GHL can't scope opt-outs per brand.

## 1. Custom fields: folder "Box Top" (31 fields)

Settings → Custom Fields → **Add Folder `Box Top`** → add with these exact names (all **Single Line** unless noted). After creating them, **copy the real merge key** of each into the build log; emails must use what GHL actually generated.

| Field | Webhook key | Field | Webhook key |
|---|---|---|---|
| BT Zoom Join URL | `zoom_join_url` (or `zoom_fallback_url`, see BT · 01) | BT FT Source / Medium / Campaign / Content / Term | `ft_*` |
| BT Zoom Registrant ID | `zoom_registrant_id` | BT LT Source / Medium / Campaign / Content / Term | `lt_*` |
| BT Zoom Status | `zoom_status` (registered / already / skipped / failed) | BT Campaign ID | `campaign_id` |
| BT Registered At | `registered_at` | BT FBCLID | `fbclid` |
| BT Event Phase | `event_phase` (pre / today / live / post / closed) | BT GCLID | `gclid` |
| BT SMS Event Consent | `sms_consent` | BT Landing Page | `landing_page` |
| BT SMS Event Consent At | `sms_consent_at` | BT Referrer | `referrer` |
| BT Event Consent Text (Multi Line) | `consent_text` | BT Segment | `segment` |
| BT SMS Marketing Consent | `sms_marketing_consent` | BT Source Bucket | `source_bucket` |
| BT SMS Marketing Consent At | `sms_marketing_consent_at` | BT Attended Live | CSV import (yes) |
| BT Marketing Consent Text (Multi Line) | `marketing_consent_text` | BT Minutes Attended (**Number**) | CSV import |
| BT Consent Version | `consent_version` | | |

Single Line keeps webhook values exact; a dropdown silently drops any value that doesn't match an option.

## 2. Custom Values (links used in emails)

| Name | Value |
|---|---|
| BT Replay URL | `https://thejustinstark.com/theboxtop/replay/` |
| BT Bonus Vault URL | `https://thejustinstark.com/theboxtop/bonuses/` |
| BT Review URL | Box Top Review calendar booking link (§5) |
| BT Book URL | **Where to buy the book (still needed).** M08 has a book line; delete it if this is empty on Nov 9 |
| BT Zoom Register URL | `https://us02web.zoom.us/webinar/register/WN_bjdBGZXbSoOfl3x2_XPqHQ` |

## 3. Tags

| Tag | Meaning |
|---|---|
| `bt-contact` | **Fence:** any Box Top contact. Set first, every path |
| `bt-registered` | Registered for the launch |
| `bt-src-paid-meta` `-paid-other` `-organic-social` `-vanity` `-referral` `-email` `-direct` `-other` `-zoom-direct` | Source (one each) |
| `bt-sms-optin` / `bt-sms-marketing-optin` | Checkbox 1 (event texts) / checkbox 2 (updates and offers) |
| `bt-sms-confirm` | Registered before Sun Nov 8, 12 PM CT, so a confirmation text fits under the 3-per-24h cap |
| `bt-sms-hawaii` | 808 number; time-shifted texts |
| `bt-zoom-failed` | Zoom error (not Plan B); needs a manual fix |
| `bt-seg-retired` `-red-zone` `-planning` `-business-owner` `-pro` | Thank-you page answer |
| `bt-attended-live` / `bt-no-show` | From the Zoom attendee report |
| `bt-replay-request` / `bt-replay-ready` / `bt-replay-clicked` | Replay sign-up / **replay released (gate)** / clicked |
| `bt-review-booked` | Booked a Box Top Review |
| `bt-test` | Test contacts |

## 4. Pipeline: "Box Top Launch"

| # | Stage | Moves here when |
|---|---|---|
| 1 | Registered | BT · 01 |
| 2 | Attended Live | BT · 04 (the **only** step allowed to move an opportunity backward) |
| 3 | Missed Live (Replay) | BT · 05 |
| 4 | Replay Engaged | BT · 06, only from stage 3 |
| 5 | Box Top Review Booked | BT · 07 |
| 6 | Box Top Review Held | BT · 08 |
| 7 | Client | Justin sets **Won** |

Defaults: name `{{contact.name}} · Box Top Launch`; source = BT Source Bucket; owner Justin; **no duplicates**; backward moves off except in BT · 04.

## 5. Calendar: "Box Top Review"

Event calendar, owner Justin, slug `box-top-review`. **About 45 minutes, free, Zoom or phone** (decision G4). Form: name, email, phone, "What's the biggest question on your mind about retirement?" **Minimum notice: 48 hours.** If Medicare Advantage or Part D could come up, CMS requires a Scope of Appointment form 48 hours ahead; Justin confirms whether these reviews can touch MA or Part D. Notifications: **email only** (calendar texts can't check consent). Link → Custom Value **BT Review URL**.

## 6. Trigger link

Marketing → Trigger Links → **`BT Replay`** → `{{custom_values.bt_replay_url}}`. Used in every replay email and S05.

## 7. Workflows (folder "Box Top Launch")

Defaults: **Draft** until tests pass; time zone **Central**; sender **Justin Stark** on the assigned sending domain, reply-to Justin. "If past → skip" means the Wait setting **"Skip all outbound communication actions till next wait."**

### BT · 01 Inbound (website + Zoom backfill) · re-entry ON

**Trigger:** Inbound Webhook. Copy its URL into Vercel as `GHL_BOXTOP_WEBHOOK_URL`. After PR #8 is live on a preview, submit one registration with **both SMS boxes checked**, then run **Test Trigger** and pick that sample.

**If/Else on `action`:**

**`register`**
1. **Create/Update Contact:** first, last, email, phone; tag `bt-contact`.
2. Always: BT LT ×5, BT Campaign ID, BT FBCLID, BT GCLID, BT Source Bucket.
3. **If** BT Registered At is empty (first registration) → set BT FT ×5, BT Landing Page, BT Referrer, BT Registered At, BT Event Phase.
4. **If** `zoom_status` not empty → set BT Zoom Status.
5. **If** `zoom_join_url` not empty → set BT Zoom Join URL + Registrant ID. **Else if** BT Zoom Join URL is empty → set it ← `zoom_fallback_url` (Zoom's registration page, so links never render blank).
6. **If** `sms_consent` = yes → set Event Consent, At, Text, BT Consent Version; add `bt-sms-optin`. **If** `sms_marketing_consent` = yes → set Marketing Consent, At, Text, BT Consent Version; add `bt-sms-marketing-optin`. *(No "no" branch, so a later submit never erases a yes.)*
7. **If** `sms_confirm_ok` = yes → add `bt-sms-confirm`. **If** `phone_area_flag` = hawaii → add `bt-sms-hawaii`.
8. **If/Else on `source_bucket`** → matching `bt-src-…`.
9. **Create/Update Opportunity** → Registered.
10. **If** `zoom_status` = failed → add `bt-zoom-failed` + Internal Notification (Kalob, Justin): "Zoom registration failed for {{contact.name}} ({{contact.email}}). Register them in Zoom by hand and paste the join link into BT Zoom Join URL." *(`skipped` = Plan B, no alert.)*
11. **Add tag `bt-registered` last**, so every field is set before BT · 02 and BT · 03 start.

**`replay`**
1. Create/Update Contact (first, last, email; tag `bt-contact`).
2. Set LT fields; first-touch fields only if BT Registered At is empty.
3. **If** `event_phase` = closed → Email **M17** "The replay window has closed" (links to the book and the Review) → End.
4. Else → add `bt-replay-request`. *(After the replay is released, add one more action here: add tag `bt-replay-ready`. See §8.)*

**`profile`**
1. Create/Update Contact with **email only**. *(The survey sends no name or phone, so none can be blanked.)*
2. Set BT Segment; add the matching `bt-seg-…`.

**`zoom_direct`** (backfill script)
1. Create/Update Contact (first, last, email; **no phone**; tag `bt-contact`).
2. **If** has `bt-registered` → **If** BT Zoom Status ≠ registered → set Join URL, Registrant ID, Zoom Status = registered; **remove `bt-zoom-failed`**. End. *(Upgrades Plan B or failed contacts to their personal link; never touches attribution.)*
3. Else → set Join URL, Registrant ID, Zoom Status = registered, Source Bucket = zoom-direct, BT Event Phase = pre; add `bt-src-zoom-direct`; Opportunity → Registered; add `bt-registered` last.

### BT · 02 Confirmation · re-entry OFF

**Trigger:** tag added `bt-registered`.

1. **If/Else** (first match wins):
   - BT Zoom Status is skipped / failed → Email **M01Z** "One more step: finish on Zoom".
   - BT Event Phase = live → Email **M01L** "We're live right now".
   - BT Event Phase = today → Email **M01T** "You're in. We go live at noon Central today."
   - Else → Email **M01** "You're in".
2. **If** has `bt-sms-optin` **and** `bt-sms-confirm`, not `bt-sms-hawaii`, not DND → **Wait: Advance Window 11:00 AM to 6:55 PM** → SMS **S01**.

### BT · 03 Reminders · re-entry OFF · Goal: tag added `bt-attended-live`

**Trigger:** tag added `bt-registered`. Every wait is "if past → skip".

| Wait until (CT) | Then |
|---|---|
| Wed Nov 4, 10:00 AM | **M02** |
| Fri Nov 6, 10:00 AM | **M03** |
| Sun Nov 8, 12:00 PM | **M04** → if `bt-sms-optin` & not DND: if `bt-sms-hawaii` wait 5 min → **S02** |
| Mon Nov 9, 8:00 AM | **M05** |
| Mon Nov 9, 11:00 AM | **M06** → if `bt-sms-optin` & not `bt-sms-hawaii` & not DND → **S03** |
| Mon Nov 9, 12:02 PM | **M07** → if `bt-sms-optin` & not DND → **S04** |

### BT · 04 Attended · re-entry OFF · Goal: `bt-review-booked`

**Trigger:** tag added `bt-attended-live`.

1. **Remove from workflow: BT · 05.** Remove tag `bt-no-show`.
2. Update Opportunity → Attended Live (**allow backward move** on this step only).
3. Wait until Mon Nov 9, 2:00 PM (if past → **continue**) → **M08**.
4. Wait until Wed Nov 11, 10 AM (skip) → **M09**.
5. Wait until Fri Nov 13, 10 AM (skip) → **M10** → if `bt-sms-marketing-optin` & not DND → Advance Window **1:00 to 6:55 PM** → **S06**.
6. Wait until Mon Nov 16, 10 AM (skip) → **M11**.

### BT · 05 Missed live · re-entry OFF · Goal: tag added `bt-attended-live` or `bt-review-booked`

**Trigger:** tag added `bt-no-show` **or** `bt-replay-request`. **Filter:** does not have `bt-attended-live` and does not have `bt-review-booked`.

1. Create/Update Opportunity → Missed Live (Replay).
2. Wait until Mon Nov 9, 6:00 PM (if past → continue) → **Wait for condition: has tag `bt-replay-ready`** (the gate; released in §8) → **M12** → if `bt-sms-optin` & not DND → Advance Window **12:00 to 6:55 PM** → **S05**.
3. Wait until Wed Nov 11, 10 AM (skip) → **M13**.
4. Wait until Fri Nov 13, 10 AM (skip) → **M14** → if `bt-sms-marketing-optin` & not DND → Advance Window 1:00 to 6:55 PM → **S06**.
5. Wait until Mon Nov 16, 10 AM (skip) → **M15**.

### BT · 06 Replay clicked · re-entry ON

**Trigger:** Trigger Link Clicked `BT Replay`. Add `bt-replay-clicked` → **If** opportunity stage = Missed Live (Replay) → move → Replay Engaged (no backward moves).

### BT · 07 Review booked · re-entry ON

**Trigger:** Appointment Status = booked/confirmed, calendar Box Top Review. Check in the UI whether "Customer Booked Appointment" is still offered; if so, either works. Add `bt-review-booked` → Opportunity → Box Top Review Booked → Internal Notification to Justin: "Box Top Review booked: {{contact.name}}, {{appointment.start_time}}. Segment {{contact.bt_segment}}. From {{contact.bt_source_bucket}} / {{contact.bt_lt_content}}."

### BT · 08 Review outcome · re-entry ON

**Trigger:** Appointment Status changed, calendar Box Top Review. Showed → Opportunity → Box Top Review Held. No-show → **M16** (rebook link).

### BT · 09 Financial professional alert (optional) · re-entry OFF

Tag added `bt-seg-pro` → Internal Notification to Justin. If an agent-recruiting pipeline exists, also create an opportunity there.

## 8. Launch day (Mon Nov 9, CT)

| Time | Step |
|---|---|
| ~11:30 AM | Pause Meta ads |
| At the close | Post `{{custom_values.bt_bonus_vault_url}}` in Zoom chat |
| ~1:45 PM | Zoom attendee report CSV. **Filter to Attended = Yes, dedupe by email**, keep email + time in session. Import into GHL in **update existing only** mode: add tag `bt-attended-live`, set BT Attended Live = yes, BT Minutes Attended. *(Test this with a 2-row CSV before Nov 9: tag-added triggers from imports must fire.)* |
| ~2:00 PM | Smart list: has `bt-registered`, not `bt-attended-live` → bulk add `bt-no-show` |
| When the replay plays end to end on `/theboxtop/replay/` | (1) Bulk add `bt-replay-ready` to the smart list "has `bt-no-show` or `bt-replay-request`". (2) Edit BT · 01's replay branch to add `bt-replay-ready`, so later requesters go straight through. Editing a Wait doesn't affect contacts already waiting, which is why this is a tag gate rather than a wait time |

**Zoom's own emails:** keep Zoom's **confirmation** email on; turn Zoom's **reminder** emails **off**, otherwise Nov 9 brings 5 or more emails.

## 9. Smart lists

BT Registered · BT Paid Meta · BT Zoom-direct · BT Zoom Failed (check daily) · BT SMS Event Opt-in · BT SMS Marketing Opt-in · BT Attended · BT Missed Live · BT Review Booked · BT Pros · BT Business Owners.

## 10. Tests (before ads go live)

1. Four registrations (`+bt-test1..4`, tagged `bt-test`): boxes yes/yes, yes/no, no/no, and an 808 number. Check every field, tag, the stage, the M01 variant, and S01 only where allowed.
2. **Same email twice:** first touch, consent and Zoom Status stay intact; no second opportunity; no second M01.
3. **Shared phone, two emails** (spouses), and **an existing PIA contact with a different phone:** see which record GHL updates and which number gets texted. It must be the number that consented.
4. **Plan B** (no Zoom vars on preview): M01Z, no alert. **Forced Zoom failure:** alert + `bt-zoom-failed`. Backfill upgrade clears it.
5. Survey answer: segment set, and name and phone unchanged.
6. Fence: a test contact doesn't enter any PIA workflow.
7. Copy BT · 03, 04 and 05 to a TEST folder with waits a few minutes out; walk a contact through. Check skip-if-past, the replay gate and merge fields (join link, custom values). Delete the copies.
8. 2-row CSV import → BT · 04 fires; BT · 05 exits.
9. Delete all `bt-test` contacts, their opportunities, and the test registrants in Zoom.

## 11. Decisions

| # | Decision | Recommendation |
|---|---|---|
| G1 | A2P approved? | If not by Mon noon: email only; hide both SMS boxes |
| G2 | Fences in §0b, removed Nov 17 | Yes, each approved one by one |
| G3 | After Nov 16, add registrants to the Justin Stark blast list | Email yes (the FAQ now says so); texts only for `bt-sms-marketing-optin` |
| G4 | Box Top Review: length, price, medium, Medicare scope | About 45 minutes, free, Zoom or phone, 48-hour notice; Justin confirms MA/Part D |
| G5 | Replay window | Through Mon Nov 16 |
| G6 | BT · 09 pro alert | Yes |
| G7 | PIA client tag(s) to exempt from the fence | From the audit |

## Review log (Nov 2)

An independent reviewer checked this sheet against GHL's help docs, the website's payload and the SMS rules, and traced 12 people through every workflow. Everything below is now applied.

| Finding | Fix |
|---|---|
| `bt-registered` fence misses Contact Created, earlier tags, replay requesters and more trigger types; blanket filters would cut PIA clients out during AEP; STOP is account-wide | `bt-contact` set first on every path; 2-minute guard on Contact Created; wider audit; PIA-client exemption; Nov 17 removal; DND note |
| Raw attendee CSV would tag no-shows; late imports run both tracks; backward stage move blocked | Filter Attended = Yes, update-only import; BT · 05 goal and filter; BT · 04 removes from BT · 05 and may move back |
| Editing a Wait doesn't affect people already waiting | `bt-replay-ready` gate restored |
| S05 could land at 7 AM Pacific or 5 AM Hawaii; S02 at exactly 8 AM in Hawaii; PR/USVI/Guam/Canada out of window; S02 to S04 had no STOP line | S05 window 12 to 6:55 PM; Hawaii +5 min; no-SMS area codes (website); STOP and brand on every text |
| Create/Update ran for every action (survey could blank name and phone); "update always" blanked consent and Zoom Status; first-touch gate failed for direct traffic | Contact action per branch (survey = email only); conditional writes; gate on BT Registered At |
| Spouses sharing a phone overwrite each other or get double texts | FAQ: shared email or phone, register once; test cases added |
| Plan B alerted on every registrant; "your link" was Zoom's sign-up page | `skipped` vs `failed`; M01Z variant; backfill clears `bt-zoom-failed` |
| Live-day registrants got "see you Monday" | `event_phase` → M01T / M01L |
| Rebookings untracked; replay click could move a booked contact back | Re-entry on for BT · 07 and 08; BT · 06 only from Missed Live |
| Website fields were a hidden dependency | Built and tested in PR #8 (17 tests); merge before capturing the sample |
| Copy risks: "a few spots left", "is out", empty book link, blast use vs FAQ, Medicare 48-hour scope, replay promised after it's down, too many Zoom emails | Rewritten (05); FAQ updated; 48-hour notice; M17 for closed replay; Zoom reminders off |
| Shared settings (time zone, sending domain, deprecated trigger) | Don't change account settings; check in UI |
