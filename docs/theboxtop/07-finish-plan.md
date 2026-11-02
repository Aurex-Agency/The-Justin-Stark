# Finish plan: Box Top launch, GHL + website (Mon Nov 2)

**Decision (Nov 2): Option 1.** The Zoom webinar owner can't create API credentials, so the two-step flow ("Plan B") is now the only flow: the site saves the person to GHL, then sends them to Zoom's registration page to confirm their seat. Every registration arrives with `zoom_status = skipped` and BT Zoom Join URL = the Zoom registration page.

Build log: [06-ghl-build-log.md](06-ghl-build-log.md). Build sheet: [04-ghl-build.md](04-ghl-build.md). Copy: [05-ghl-messages.md](05-ghl-messages.md).

---

## Done

| Item | State |
|---|---|
| §0 audit | Done, read-only. 4 risky workflows found outside The Justin Stark folder |
| §1 custom fields | 31 in folder "Box Top"; all merge keys match |
| §2 custom values | 5 created; BT Book URL and BT Review URL empty |
| §3 tags | 28 created |
| §4 pipeline | "Box Top Launch", 7 stages |
| §6 trigger link | BT Replay → `{{custom_values.bt_replay_url}}` |
| §7 folder | The Justin Stark › Box Top Launch |
| BT · 01 Inbound | **Built, Draft.** Register, replay and profile branches (Plan B version), M17 on the replay-closed path; structure in the build log. Not tested yet |
| §10 tests (Nov 2) | Intake, confirmation, duplicate, survey, replay request, fence, BT · 04/05/06 hand-offs: **pass**. Shared phone merges two signups into one record. Emails and texts after the first wait not yet tested. Details in the build log |
| **Production** | **PR #8 was merged and deployed at 2:51 PM Nov 2** with the webhook URL. No registration calls in Production's logs through 4:35 PM |
| **BT · 01 published** (5:01 PM Nov 2, Kalob's call) | Real signups now land in GHL with fields, tags and a Registered opportunity, but get **no email or text from GHL** because BT · 02 and 03 are still Draft. Their `bt-registered` tag is added before BT · 02/03 exist, so it won't start them later: **when BT · 02 and 03 are published, re-tag everyone who has `bt-registered` and not `bt-test`** (bulk remove the tag, then bulk add it back) so they get their confirmation and reminders |
| BT · 02, 03, 04, 05, 06, 09 | **Built, Draft** (Nov 2), no one active. Every email and text from 05 is in place (M01 to M17, S01 to S06) with the copy still awaiting Justin's approval. Structure and differences from the sheet in the build log. Not tested yet |
| Vercel | `GHL_BOXTOP_WEBHOOK_URL` in Production and Preview; PR #8 preview redeployed |

## What Plan B changes in the build

| Area | Change |
|---|---|
| BT · 01 | Drop the `zoom_direct` branch (needs the Zoom API) and the Zoom-failure alert (status is never `failed` without credentials). Zoom Join URL is always set from `zoom_fallback_url` when empty |
| BT · 02 | M01Z ("one more step: finish on Zoom") becomes the default confirmation. M01Z needs "today" and "live now" variants for Nov 9 sign-ups |
| Reminders and texts | M02 to M07 and S01 to S04 point to Zoom's registration page, so the wording changes from "your personal link" to "your seat on Zoom (20 seconds if you haven't confirmed yet)". GHL can't tell who finished on Zoom |
| People who registered only on Zoom | Not in GHL unless the owner sends a registrant CSV. If they do: import with `bt-contact`, `bt-registered`, `bt-src-zoom-direct` and BT Zoom Status = registered, so they get a "you're in" email rather than "finish on Zoom" |
| Attendance | Needs the Zoom attendee report CSV from the owner around 1:45 PM Nov 9. Without it, BT · 04 and BT · 05 merge into one "thanks + replay" follow-up |
| Zoom's own emails | Can't be changed. If the owner left Zoom reminders on, people who finished on Zoom get both |
| Thank-you page | Generic panel says the personal link is in Justin's email; reword for Plan B |

## Needed from Kalob or Justin

| # | Item | Blocks | Recommendation |
|---|---|---|---|
| 1 | ~~Keep or drop the 1:1 Review offer~~ | | **Dropped** (Nov 2). M08/M10/M11/M14/M15/M16 and S06 point to the book and the quiz |
| 2 | ~~PIA client tag~~ | | **None exists.** Fences have no client exemption |
| 3 | ~~Fence A (FB ACA Ads)~~ | | **B is live. A left as is** (Kalob, Nov 2): GHL won't save FB ACA Ads until 7 old broken steps are fixed. Risk accepted until Nov 17 |
| 4 | ~~SMS brand prefix~~ | | **"The Justin Stark"** |
| 5 | ~~From address~~ | | **Approved:** "Justin Stark" `justin@replies.pontotocinsuranceagency.com`. **GHL's email action has no reply-to field**, so replies go to the `replies.` address; where they land depends on the sending domain's reply forwarding in Settings › Email (not checked) |
| 6 | Zoom owner: registrant CSV (now and Sun Nov 8); attendee report CSV right after the live | Zoom-only registrants; BT · 04/05 split | Kalob gets these later |
| 6b | Opportunity owner | BT · 01 step 10 | Set Justin only when the contact has no owner yet, so existing PIA contacts keep their agent |
| 7 | DMARC `_dmarc.pontotocinsuranceagency.com` TXT `v=DMARC1; p=none` at GoDaddy | Deliverability | Add before ads |
| 8 | Book purchase URL | M08/M15/M17 book lines, M11, M14, S06 | Without it, the book lines are deleted and M11, M14 and S06 don't send |
| 8b | Zoom webinar settings (owner) | M01ZL, M06, M07, S04 wording | Confirmation email **on**, reminders **off**, registrants **approved automatically** |
| 8c | PIA's postal address | Every email footer (CAN-SPAM) | Footers use the address in GHL's business profile: 158 D, Ms Hwy 15, Pontotoc, MS 38863. Confirm it before BT · 02 is published |
| 9 | Merge PR #8 | Production sending the new fields | Merge after the copy edits and website items below, at publish time |
| 10 | Blast list for G3 | Nov 17 only | Any time this week |

## Build order

**Rule (original):** don't redeploy Production until BT · 01, 02 and 03 are published together. A registration that reaches a Draft workflow is not processed, and a `bt-registered` tag added before BT · 02/03 exist won't start them later. **Overtaken Nov 2:** Production went live at 2:51 PM and BT · 01 was published alone at 5:01 PM, so signups are saved but need the re-tag step when BT · 02/03 go live.

### Phase 1 · today (Mon Nov 2) · Claude
1. ~~BT · 01 actions (register, replay, profile branches; Plan B version).~~ Done, Draft.
2. ~~Copy edits for Plan B in 05.~~ Drafted Nov 2, **waiting on Justin's approval**: M01Z is the default confirmation with today (M01ZT) and live (M01ZL) versions; M01 only for Zoom-list imports; M02 to M07 and S01 to S04 say "your link is in Zoom's email, not confirmed yet? 20 seconds here"; Review CTAs replaced with the tools, packets and book (M10 is now the packet email; M11, M14, S06 only send if BT Book URL exists); M16 removed; texts open "The Justin Stark:"; S05 uses the real trigger-link key. Routing updated in 04 (BT · 02, 04, 05; BT · 07/08 marked dropped).
3. ~~BT · 02 Confirmation and BT · 03 Reminders with those emails and texts.~~ Done, Draft. BT · 04, 05, 06, 09 and M17 in BT · 01 also built (Nov 2), pulling items 9 and 10 forward.
4. ~~Fences A and B.~~ B live; A blocked (see item 3).

### Phase 2 · Tue Nov 3 · Claude (website in PR #8)
5. ~~Thank-you page: Justin's Wistia video below the "confirm your seat on Zoom" step, width-capped for the vertical format; Plan B wording in the generic panel; privacy page note for Wistia.~~ Done Nov 2 (video hidden on the replay-request view). Not live until it's merged to main.
6. `/theboxtop/replay/` and `/theboxtop/bonuses/` "posting soon" pages (custom values and emails already link to them; both 404 today).
7. Tests on the preview (§10, Plan B version): registrations with both boxes / event only / none, same email twice, survey, replay request, fence check, copies of BT · 03 with short waits. **Every test uses phone 6625078886** (Kalob's; no other contact in the account is touched) with `kalob+bt-testN@aurexagency.com`, tagged `bt-test`. GHL matches contacts by phone, so the cases run one after another on that one contact, clearing Box Top fields and tags between them. The 808 case can't use a real 808 number under this rule, so it's checked by reading the API's `phone_area_flag` logic and the Hawaii branch, not by a live text.
8. **Kalob's go:** publish BT · 02 and 03 (BT · 01 is already live, PR #8 already merged) → re-tag the signups that arrived in between (see Production row above) → one live registration to confirm → clean up the test contact. Ads can start after this.

### Phase 3 · Wed Nov 4 to Fri Nov 6 · Claude
9. ~~BT · 04 Attended, BT · 05 Missed live (replay gate), BT · 06 Replay clicked, BT · 09 pro alert.~~ Built Nov 2, Draft.
10. ~~Remaining emails M08 to M17 and S05, S06.~~ Built Nov 2. If Justin changes copy, edit the email or text action in place.
11. Smart lists (§9). Registrant CSV import if the owner sends it.
12. Tests: 2-row attendance CSV import (BT · 04 fires, BT · 05 exits), replay gate, merge fields. Publish on Kalob's go.

### Launch day (Mon Nov 9, CT)
~11:30 pause ads · close: bonus vault link in Zoom chat · ~1:45 attendee CSV from owner → import (`bt-attended-live`) · ~2:00 bulk `bt-no-show` · replay plays → bulk `bt-replay-ready` and add it to BT · 01's replay branch.

### After
Nov 16 replay window closes · Nov 17 remove fences · G3 blast-list hand-off.

## Timing that matters

| When | Why |
|---|---|
| Before ads (target Wed Nov 4) | BT · 01 to 03 published and Production redeployed, or registrants never reach GHL |
| Wed Nov 4, 10 AM | M02 is the first scheduled reminder; anyone registered before BT · 03 is published misses earlier steps only (skip-if-past) |
| Sun Nov 8 | Second registrant CSV from the owner |
| Mon Nov 9, 2 PM | BT · 04/05 published; bonus page live |
