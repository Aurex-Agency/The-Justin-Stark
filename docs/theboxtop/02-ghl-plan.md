# Phase 2: GoHighLevel tracking, pipeline and communications

**Status:** draft for approval · Builds right after the landing page (and overlaps it: GHL needs one sample submission from the preview deploy to map fields).
**Who builds:** Kalob in the GHL sub-account (there's no GHL connection from this repo). Claude supplies the exact spec below, the test payloads, and all email/SMS copy during the build.

---

## 1. Day-1 checks (do these first; two of them can quietly sink the launch)

| Check | Why it matters | If it fails |
|---|---|---|
| **A2P 10DLC brand + campaign approved** in LC Phone for this sub-account, and the campaign's use case covers event reminders/marketing | Unregistered SMS to US numbers gets filtered or blocked. New approvals can take days to weeks. | Launch runs email-only + Zoom's own reminder emails. Hide the SMS checkbox. |
| **Email sending domain** set up in GHL (dedicated subdomain like `mail.thejustinstark.com`) with SPF, DKIM, and a DMARC record | Without it, reminders land in spam or Promotions, which kills show rate | Set it up today; DNS for the domain is on Vercel or the registrar |
| **Zoom webinar settings** (Phase 1 §7): registration auto-approve, capacity, cloud recording on | Auto-approve is what makes the instant join link work; capacity caps live attendance | See §8 |
| **Inbound Webhook trigger available** (already used by `/big-table/`, so it should be) | It's how the site talks to GHL | n/a |

## 2. Custom fields (Contact, folder "Box Top Launch")

| Field | Type | Filled by |
|---|---|---|
| BT Zoom Join URL | Single line | Registration webhook |
| BT Zoom Registrant ID | Single line | Registration webhook |
| BT Zoom Status | Dropdown: registered / failed | Registration webhook |
| BT Registered At | Date/time | Registration webhook |
| BT SMS Consent | Dropdown: yes / no | Registration webhook |
| BT SMS Consent At + BT Consent Text Version | Date/time + Single line | Registration webhook (proof of consent) |
| BT Segment | Dropdown: Retired / Retiring within 5 years / 5+ years out / Business owner / Financial professional | Thank-you survey |
| BT Attended Live | Dropdown: yes / no | Attendance sync or CSV import |
| BT Minutes Attended | Number | Attendance sync or CSV import |
| BT FT Source / Medium / Campaign / Content / Term | Single line ×5 | First touch |
| BT LT Source / Medium / Campaign / Content / Term | Single line ×5 | Last touch |
| BT Campaign ID, BT fbclid, BT gclid | Single line ×3 | Click IDs |
| BT Landing Page, BT Referrer | Single line ×2 | Page context |

Why custom fields instead of GHL's built-in attribution: GHL fills its native attribution when its own forms or funnels capture the lead. Our form posts through a webhook, so we carry attribution ourselves, explicitly, and it shows up on the contact, in smart-list filters and in reports. *(Optional extra: if GHL's external tracking script is available on this account, adding it to the page also populates native attribution. Reviewer to verify availability.)*

## 3. Webhook payload (what `/api/boxtop-register` sends)

One inbound webhook URL. The `action` field routes inside the workflow.

```json
{
  "action": "register",                       // register | profile | replay | attended
  "event": "boxtop-launch-2026-11-09",
  "first_name": "Jane", "last_name": "Doe",
  "email": "jane@example.com", "phone": "+16625550123",
  "sms_consent": "yes", "sms_consent_at": "2026-11-03T15:04:05Z", "consent_version": "bt-sms-v1",
  "zoom_status": "registered", "zoom_join_url": "https://us02web.zoom.us/w/…", "zoom_registrant_id": "…",
  "registered_at": "2026-11-03T15:04:05Z",
  "ft_source": "facebook", "ft_medium": "paid_social", "ft_campaign": "BT Launch Reg", "ft_content": "Puzzle 15s", "ft_term": "Broad US",
  "lt_source": "facebook", "lt_medium": "paid_social", "lt_campaign": "BT Launch Reg", "lt_content": "Puzzle 15s", "lt_term": "Broad US",
  "campaign_id": "1202…", "fbclid": "…", "gclid": "",
  "landing_page": "https://thejustinstark.com/theboxtop/launch/?utm_…", "referrer": "",
  "segment": ""                                // filled on action=profile
}
```

## 4. Tags

| Tag | Applied when |
|---|---|
| `bt-registered` | Any successful registration |
| `bt-src-paid-meta` / `bt-src-organic-social` / `bt-src-vanity` / `bt-src-referral` / `bt-src-email` / `bt-src-direct` | Derived from last-touch medium/source in the workflow |
| `bt-sms-optin` | `sms_consent = yes` |
| `bt-zoom-failed` | `zoom_status = failed` (also fires an internal alert) |
| `bt-seg-retired` / `bt-seg-red-zone` / `bt-seg-planning` / `bt-seg-business-owner` / `bt-seg-pro` | Thank-you survey |
| `bt-attended-live` | Joined the live webinar |
| `bt-no-show` | Registered, not attended (applied after the event) |
| `bt-replay-request` | Signed up after the event |
| `bt-replay-clicked` | Clicked the replay trigger link |
| `bt-review-booked` | Booked a Box Top Review |

## 5. Pipeline: "Box Top Launch"

| # | Stage | Moves here when |
|---|---|---|
| 1 | Registered | Registration webhook |
| 2 | Attended Live | `bt-attended-live` added |
| 3 | No-Show | `bt-no-show` added |
| 4 | Replay Engaged | Replay link clicked (and didn't attend live) |
| 5 | Box Top Review Booked | Booking on the Box Top Review calendar |
| 6 | Box Top Review Held | Appointment marked showed |
| 7 | Client | Status **Won** (set by Justin) |

Opportunity name `{{contact.name}} · Box Top Launch`, source = `BT LT Source / BT LT Campaign`, assigned to Justin. Lost reasons: Not a fit · No response · Already has an advisor · Other.

Financial professionals (`bt-seg-pro`) also get routed to Justin's agent-recruiting pipeline if one exists (confirm), since Box Top certification is a separate offer.

## 6. Workflows

| Workflow | Trigger | Steps |
|---|---|---|
| **BT · Inbound** | Inbound Webhook | Create/Update Contact (map all fields) → branch on `action`: **register**: tags, source tag, opportunity → stage Registered, send "You're in" email now, if `bt-sms-optin` send confirmation SMS inside an 8 AM–8 PM window (contact's time zone, Central as fallback), if `zoom_status=failed` internal alert to Kalob + Justin · **profile**: set BT Segment + segment tag · **replay**: tag `bt-replay-request`, send replay email · **attended**: set BT Attended Live = yes, minutes, tag `bt-attended-live` |
| **BT · Attended** | Tag added `bt-attended-live` | Move opportunity → Attended Live. Remove from no-show list. (Post-event emails are scheduled sends, §7, so nobody gets a "thanks for coming" while the webinar is still running.) |
| **BT · Attended nurture** | Tag added `bt-attended-live` **and** wait until Nov 9, 2:00 PM CT | Day 0 bonuses → Day 1 quiz → Day 3 Box Top Review invite → Day 6 last call. Goal step: `bt-review-booked` exits the workflow. |
| **BT · No-show nurture** | Tag added `bt-no-show` | Day 0 replay → Day 1 replay reminder → Day 3 Box Top Review invite → Day 6 replay coming down (*if D5 sets a window*). Goal: `bt-review-booked` or `bt-replay-clicked` (switches to the engaged branch). |
| **BT · Replay clicked** | Trigger link "BT Replay" clicked | Tag `bt-replay-clicked`; if not attended, move → Replay Engaged |
| **BT · Review booked** | Appointment booked, calendar "Box Top Review" | Tag `bt-review-booked`, move → Review Booked, internal notification, confirmation + reminders (standard calendar reminders) |
| **BT · Review showed** | Appointment status showed | Move → Review Held |

**Calendar:** a "Box Top Review" calendar (or reuse the existing GHL booking calendar from the homepage if Justin prefers one calendar; a separate one keeps reporting clean).

## 7. Communications calendar

Fixed-time messages go out as **scheduled sends to the smart list "BT Registered"** (Email Campaigns + scheduled bulk SMS), not as workflow date-waits. Reason: someone who registers at 11:40 AM on launch day would otherwise get the stale "24 hours to go" message the instant a workflow's wait date is already past. Scheduled sends only hit whoever is registered at send time, and copy stays editable until it fires.

Every message carries the personal join link `{{contact.bt_zoom_join_url}}`. All times Central.

| When (CT) | Email | SMS | Purpose |
|---|---|---|---|
| On registration | ✔ "You're in" (join link, calendar links, bonus stack, "bring your spouse") | ✔ (if opted in, 8 AM–8 PM window) | Confirm, set expectations |
| Wed Nov 4, 10 AM | ✔ "Here's what you get for showing up" | | Bonus stack (mirrors the social reveals) |
| Fri Nov 6, 10 AM | ✔ "One thing to bring Monday" (write down your pieces: accounts, policies, Social Security) | | Homework raises show rate |
| Sun Nov 8, 12 PM | ✔ "This time tomorrow" | ✔ | 24-hour reminder |
| Mon Nov 9, 8 AM | ✔ "Today at noon Central" | | Morning-of (email only; 8 AM CT is 6 AM Pacific, too early to text) |
| Mon Nov 9, 11 AM | ✔ "One hour" | ✔ | 1-hour reminder (9 AM Pacific) |
| Mon Nov 9, 12:02 PM | ✔ "We're live" | ✔ | Pull late joiners in |
| Mon Nov 9, ~1:45 PM | Apply `bt-no-show` to Registered NOT `bt-attended-live` (bulk action) | | Starts the right nurture |
| Mon Nov 9, 2 PM onward | Nurture workflows (§6) | 1 SMS max that day (replay link to no-shows) | Bonuses, replay, Box Top Review |

**SMS cap: no more than 3 texts to one person in any 24 hours, and only 8 AM to 8 PM their time.** Launch day is exactly three (11 AM, 12:02 PM, replay). Florida's and Oklahoma's mini-TCPA laws set that ceiling for marketing texts, and it's good manners everywhere. *(Reviewer to verify.)* Every SMS identifies the sender and ends with "Reply STOP to opt out" on the first message.

Draft SMS (final copy during build, Justin approves):
- Confirm: `Justin Stark here. You're in for The Box Top Method live launch, Mon Nov 9 at 12PM CT. Your link: {{join}} Reply STOP to opt out.`
- 24h: `Tomorrow at noon Central, I'm going live to launch The Box Top Method. Bring your questions and your spouse. Your link: {{join}}`
- 1h: `One hour till we go live. Your link: {{join}}`
- Live: `We're live right now. Hop in: {{join}}`

Email sender: **Justin Stark**, from a monitored address on the authenticated sending domain, reply-to Justin's inbox. Short, plain, in his voice (Brand Guide rules: no em dashes, no AI phrasing).

## 8. Zoom side (settings + attendance)

**Webinar settings:** registration required + **auto-approve** · ask only first/last/email on Zoom's own form (for anyone using the old link) · Zoom's confirmation email **on** (a reliable backup for the join link) · Zoom's own reminders off if GHL SMS is live, on if it isn't · Q&A on · cloud recording on (replay) · practice session on · **confirm capacity** (webinar licenses cap live attendees at 500/1,000/etc.; if registrations pass roughly 2.5× capacity, turn on a YouTube or Facebook livestream as overflow).

**Attendance into GHL, two layers:**
1. **Live sync (should-have):** the same Zoom app subscribes to `webinar.participant_joined` (and `webinar.registration_created`, to catch anyone who registers through the old Zoom link). A second small function `/api/zoom-events` checks Zoom's signature, then posts `action=attended` (or `action=register` with `lt_source=zoom-direct`) to the GHL webhook. This is what lets the 12:02 PM "We're live" text go only to people not yet in the room.
2. **CSV fallback (must-have):** right after the webinar, export Zoom's attendee report, import to GHL with tag `bt-attended-live`. Takes ten minutes and catches anything the live sync missed. (Zoom's report can lag after the webinar ends; the no-show tagging waits for it.)

## 9. Attribution and reporting

**The questions the dashboard answers:** which ad made registrations, which made attendees, and which made Box Top Reviews.

- **GHL dashboard "Box Top Launch":** registrations by `BT LT Source` and `BT LT Content` (ad name), pipeline funnel by stage, show rate (Attended ÷ Registered), reviews booked by campaign.
- **Smart lists:** BT Registered · BT Paid Meta · BT Organic · BT SMS opt-in · BT Attended · BT No-show · BT Pros · BT Business owners.
- **Unit economics to watch daily** (from Meta spend + GHL counts): cost per registration, cost per attendee, cost per Box Top Review booked. Kill or scale ads on the last two, not just the first.
- **Feeding results back to Meta (nice-to-have, after launch):** send `attended` and `review booked` back through the Conversions API as events (e.g. `Schedule` for a booked review), so future campaigns can optimize for people who actually show up and book.

## 10. Testing (with Phase 1 QA)

1. Send one sample payload from the preview deploy → map every field in the Inbound Webhook trigger.
2. Run 4 test contacts: SMS yes/no × source paid/organic. Check fields, tags, opportunity stage, both confirmation messages, internal alert on a forced Zoom failure.
3. Fire one scheduled send early to a test smart list to see merge fields render (join link especially).
4. Delete test contacts and their opportunities.
