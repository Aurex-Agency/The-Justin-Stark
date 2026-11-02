# Box Top launch: email and SMS copy (drafts for Justin's approval)

Voice rules (Brand Guide): Justin across a kitchen table. Short sentences, contractions, **no em dashes**, no AI phrasing, education only: no product named, recommended or priced. Times always run west to east.

**What changed on Nov 2 (for Justin's review)**
- **Signing up is two steps now.** The site saves people in GHL, then Zoom's own page confirms their seat and Zoom emails them their personal join link. GHL can't tell who finished on Zoom, so every message before and during the live says both things: "your link is in Zoom's email" and "not confirmed yet? 20 seconds here." This only works if Zoom's **confirmation email stays on** in the webinar settings (04 §8).
- **The 1:1 Box Top Review offer is dropped.** Nothing links to a calendar. The follow-ups point to the tools, the quiz, the packets and the book. M16 is gone.
- **The book link isn't known yet.** M11, M14 and S06 only go out if BT Book URL is filled in. The book lines in M08, M15 and M17 get deleted if it's still empty.
- **Texts open with "The Justin Stark:"** (Kalob, Nov 2).

**Every email**
- **From:** Justin Stark, `justin@replies.pontotocinsuranceagency.com`. **Reply-to:** `justin@pontotocinsuranceagency.com`.
- **Merge fields:**
  - first name: `{{contact.first_name}}`
  - Zoom confirm link: `{{custom_values.bt_zoom_register_url}}`
  - tools: `{{custom_values.bt_bonus_vault_url}}`
  - book: `{{custom_values.bt_book_url}}`
  - replay: trigger link **BT Replay** (`{{trigger_link.Lbc8PBvv84TFzWcaLnJK}}`)
- **Footer:** GHL's unsubscribe link plus a **postal address** (required by CAN-SPAM; PIA's mailing address, which is still needed), then "Presented by Pontotoc Insurance Agency. The Box Top Method is educational, not financial, tax or legal advice."
- **Layout:** plain, one column. Buttons in indigo `#2D378F` with cream text, in caps.

**Zoom block** (M02 to M05 use exactly this, so every reminder says the same thing):

> **Your join link** is in the confirmation email Zoom sent you. Search your inbox for "Zoom" if you can't find it.
>
> Haven't confirmed your seat on Zoom yet? It takes about 20 seconds:
> [ CONFIRM MY SEAT ON ZOOM ] → {{custom_values.bt_zoom_register_url}}

---

## Emails

### M01Z · "One more step" (BT · 02, everyone who signs up on the site)
**Subject:** One more step to save your seat
**Preview:** Confirm on Zoom and it sends your personal link.

> {{contact.first_name}},
>
> Thanks for signing up for the live launch of The Box Top Method.
>
> **Monday, November 9**
> 10AM PT · 11AM MT · 12PM CT · 1PM ET
>
> One more step: confirm your seat on Zoom. It takes about 20 seconds, and Zoom emails you your personal join link right after.
>
> [ CONFIRM MY SEAT ON ZOOM ] → {{custom_values.bt_zoom_register_url}}
>
> Already did that on the page after you signed up? Then you're set. Keep Zoom's email handy.
>
> On a phone or tablet? Grab the free Zoom app before Monday so it's one tap when we go live.
>
> Here's what we'll do together. Most folks I sit down with have the pieces: the 401(k), the savings, a policy or two. What they don't have is the picture on the box. Monday I'll walk you through the four corners that frame the whole thing.
>
> Show up live and you'll leave with five free tools: The Box Top Training, the Legacy Trust Finder, the Box Top Quiz, and two fillable planning packets.
>
> Bring your questions. Bring your spouse.
>
> See you Monday,
> Justin

### M01ZT · same day (signed up Mon Nov 9 before 11:55 AM)
**Subject:** One more step before noon today
**Preview:** Confirm on Zoom and you're set.

> {{contact.first_name}}, thanks for signing up.
>
> We go live **today at 10AM PT · 11AM MT · 12PM CT · 1PM ET**.
>
> One more step: confirm your seat on Zoom. It takes about 20 seconds, and Zoom emails your personal join link right away.
>
> [ CONFIRM MY SEAT ON ZOOM ] → {{custom_values.bt_zoom_register_url}}
>
> On a phone? Grab the free Zoom app now so it's one tap at noon. Bring your questions, and bring your spouse. The five free tools are for everyone who comes live.
>
> Justin

### M01ZL · signed up while we're live
**Subject:** We're live right now. Here's how to get in.
**Preview:** About 20 seconds on Zoom.

> {{contact.first_name}}, we're live right now.
>
> Confirm your seat on Zoom and it takes you right in:
>
> [ JOIN ON ZOOM ] → {{custom_values.bt_zoom_register_url}}
>
> Justin

*(Build note: "takes you right in" assumes the webinar approves registrants automatically, which is the Zoom owner's setting. If approval is manual, change it to "and Zoom emails you your link.")*

### M01 · already confirmed on Zoom (contacts imported from Zoom's registrant list)
**Subject:** You're in, {{contact.first_name}}
**Preview:** Monday, Nov 9 at noon Central.

> {{contact.first_name}},
>
> You're registered for the live launch of The Box Top Method.
>
> **Monday, November 9**
> 10AM PT · 11AM MT · 12PM CT · 1PM ET
>
> Your personal join link is in the confirmation email Zoom sent you. Search your inbox for "Zoom" if you can't find it, or just reply here and we'll help.
>
> On a phone or tablet? Grab the free Zoom app before Monday so it's one tap when we go live.
>
> Here's what we'll do together. Most folks I sit down with have the pieces: the 401(k), the savings, a policy or two. What they don't have is the picture on the box. Monday I'll walk you through the four corners that frame the whole thing.
>
> Show up live and you'll leave with five free tools: The Box Top Training, the Legacy Trust Finder, the Box Top Quiz, and two fillable planning packets.
>
> Bring your questions. Bring your spouse.
>
> See you Monday,
> Justin

### M02 · Wed Nov 4, 10 AM · bonus stack
**Subject:** What you get for showing up Monday
**Preview:** Five free tools, only for the folks who come live.

> {{contact.first_name}},
>
> I'm not showing up empty-handed Monday. Everyone who joins me live gets all five of these, free:
>
> 1. **The Box Top Training.** Four modules: the pieces and the picture, corners one and two, corners three and four, and building your box top.
> 2. **The Legacy Trust Finder.** A short guided tool that shows where a trust may fit, so you know what to ask your attorney.
> 3. **The Box Top Quiz.** 14 questions. Are you an Income Seeker, a Legacy Builder, or a Freedom Seeker? You'll get your Four Corners clarity score and your biggest gap.
> 4. **The Legacy Planning Packet.** 16 fillable pages that put your family's picture and your wishes in one place.
> 5. **The Legacy & Business Planning Packet.** 22 fillable pages for business owners, including the succession questions most owners keep putting off.
>
> And a few more things I'm saving for the live.
>
> Why give this much away? Because clarity precedes confidence. I'd rather you see your whole picture before you move a single dollar, whether you ever work with me or not.
>
> Monday, Nov 9 · 10AM PT · 11AM MT · 12PM CT · 1PM ET
>
> *(Zoom block)*
>
> Justin

### M03 · Fri Nov 6, 10 AM · homework
**Subject:** One thing to bring Monday
**Preview:** Takes ten minutes. Makes the hour worth a lot more.

> {{contact.first_name}},
>
> Before Monday, do one thing for me. Grab a piece of paper and write down your pieces.
>
> Every account. The 401(k) or IRA, savings, CDs. Any policies. Social Security, a pension, a business, the house. Don't worry about the numbers being exact. Just get them on the table.
>
> Monday we'll start putting those pieces in their corners. You'll get a lot more out of it with your own list in front of you.
>
> Monday, Nov 9 · 10AM PT · 11AM MT · 12PM CT · 1PM ET
>
> *(Zoom block)*
>
> Justin

### M04 · Sun Nov 8, 12 PM · 24 hours
**Subject:** This time tomorrow
**Preview:** Live on Zoom, Monday at noon Central.

> {{contact.first_name}},
>
> This time tomorrow we go live.
>
> **Monday, November 9 · 10AM PT · 11AM MT · 12PM CT · 1PM ET**
>
> *(Zoom block)*
>
> Bring your list of pieces, your questions, and your spouse. Remember, the five free tools are for the folks who come live.
>
> Justin

### M05 · Mon Nov 9, 8 AM · today
**Subject:** Today at noon Central
**Preview:** How to join is inside.

> {{contact.first_name}}, today's the day.
>
> The Box Top Method launches today, and we go live at **10AM PT · 11AM MT · 12PM CT · 1PM ET**.
>
> *(Zoom block)*
>
> See you at noon.
> Justin

### M06 · Mon Nov 9, 11 AM · one hour
**Subject:** One hour
**Preview:** We go live at noon Central.

> One hour till we go live, {{contact.first_name}}.
>
> Join from the link in Zoom's confirmation email. Haven't confirmed your seat yet? Do it now and Zoom gets you in:
>
> [ JOIN ON ZOOM ] → {{custom_values.bt_zoom_register_url}}
>
> Justin

### M07 · Mon Nov 9, 12:02 PM · live
**Subject:** We're live
**Preview:** Hop in now.

> We're live right now, {{contact.first_name}}. Come on in.
>
> Use the link in Zoom's email, or confirm your seat here and Zoom takes you in:
>
> [ JOIN ON ZOOM ] → {{custom_values.bt_zoom_register_url}}
>
> Justin

### M08 · Nov 9, 2 PM · attended: thank you + tools
**Subject:** Thank you for coming. Here are your tools.
**Preview:** All five, plus where to start.

> {{contact.first_name}},
>
> Thank you for spending your Monday with me. It meant a lot.
>
> As promised, here are your free tools:
> [ GET MY 5 TOOLS ] → {{custom_values.bt_bonus_vault_url}}
>
> Start with the Box Top Quiz. It takes a few minutes and tells you your retiree type and your biggest gap. Then open the planning packet that fits you and fill in the first few pages.
>
> And if you'd like the book itself: {{custom_values.bt_book_url}}
>
> *(Build note: delete the book line if BT Book URL is still empty on Nov 9.)*
>
> Justin

### M09 · Wed Nov 11, 10 AM · attended: quiz
**Subject:** Income Seeker, Legacy Builder or Freedom Seeker?
**Preview:** Your answer changes how the picture fits.

> {{contact.first_name}},
>
> In the book I talk about three kinds of retirees. Each one wants something different from their money, and that changes how the whole picture fits together.
>
> The Box Top Quiz is in your tools. 14 questions and you'll know your type, your Four Corners clarity score, and your biggest gap. Most people learn something about themselves. Some learn something about their spouse.
>
> [ TAKE THE QUIZ ] → {{custom_values.bt_bonus_vault_url}}
>
> Justin

### M10 · Fri Nov 13, 10 AM · attended: the packet
**Subject:** Ten minutes with your packet this weekend
**Preview:** Not the whole thing. Just the first few pages.

> {{contact.first_name}},
>
> If you haven't opened your planning packet yet, this weekend is a good time. Not the whole thing. Just the first few pages.
>
> Put your family's picture and your wishes down on paper. That alone puts you ahead of most folks I meet.
>
> Own a business? Use the Legacy & Business Planning Packet instead. The succession pages are the ones most owners keep putting off.
>
> [ OPEN MY TOOLS ] → {{custom_values.bt_bonus_vault_url}}
>
> Clarity precedes confidence.
> Justin

### M11 · Mon Nov 16, 10 AM · attended: the book (only if BT Book URL is filled in)
**Subject:** The whole picture, in one place
**Preview:** The Box Top Method, the book.

> {{contact.first_name}},
>
> Everything we covered on the live, and a lot we didn't have time for, is in the book.
>
> [ GET THE BOOK ] → {{custom_values.bt_book_url}}
>
> Either way, keep that list of pieces. Clarity precedes confidence.
>
> Justin

*(Build note: if BT Book URL is still empty on Nov 15, remove this email from BT · 04 before it sends.)*

### M12 · Nov 9, 6 PM (or on request) · replay
**Subject:** Here's the replay
**Preview:** Watch it this week.

> {{contact.first_name}},
>
> Sorry we missed you at the live launch. Life happens. Here's the full replay:
>
> [ WATCH THE REPLAY ] → trigger link **BT Replay**
>
> Grab a pen before you hit play. I'll ask you to write down your pieces: every account, policy and income source. Then we put them in their corners.
>
> The replay is up through Monday, November 16.
>
> Justin

### M13 · Wed Nov 11, 10 AM · replay check-in
**Subject:** Did you get to watch?
**Preview:** The part most folks skip is Corner Three.

> {{contact.first_name}},
>
> Did you get a chance to watch the replay? If not, here it is again:
>
> [ WATCH THE REPLAY ] → trigger link **BT Replay**
>
> If you only have twenty minutes, watch the part on Corner Three, what your money costs in tax. It's the corner most planning skips.
>
> Justin

### M14 · Fri Nov 13, 10 AM · replay: the book (only if BT Book URL is filled in)
Same as M11, with the first line swapped: "Whether or not you've finished the replay, everything we covered is in the book, and a lot more." *(Build note: if BT Book URL is still empty on Nov 12, remove this email from BT · 05 before it sends.)*

### M15 · Mon Nov 16, 10 AM · replay comes down
**Subject:** The replay comes down tonight
**Preview:** Last chance to watch.

> {{contact.first_name}},
>
> Heads up: the launch replay comes down tonight.
>
> [ WATCH THE REPLAY ] → trigger link **BT Replay**
>
> And if you'd like the book: {{custom_values.bt_book_url}}
>
> *(Build note: delete the book line if BT Book URL is still empty.)*
>
> Justin

### M16 · removed
The Box Top Review offer is dropped, so there's no no-show rebook email.

### M17 · replay requested after the window closed (Nov 17 on)
**Subject:** The launch replay has closed
**Preview:** Here's where to go from here.

> {{contact.first_name}},
>
> Thanks for reaching out. The launch replay window has closed, but the ideas aren't going anywhere.
>
> The book is here: {{custom_values.bt_book_url}}
>
> *(Build note: delete the book line if BT Book URL is still empty.)*
>
> If you have a question, just reply to this email.
>
> Justin

---

## SMS

**Rules:**
- **Who gets them:** event texts (S01 to S05) go only to `bt-sms-optin`; S06 goes only to `bt-sms-marketing-optin`.
- **How many:** at most 3 per person in any rolling 24 hours, and 5 event texts in total, which matches "Up to 5 messages" in the consent.
- **When:** only between 8 AM and 8 PM the recipient's time. The waits in the build sheet enforce this, and Puerto Rico, Virgin Islands, Guam and Canadian numbers are never texted.
- **What every text includes:**
  - It opens with **"The Justin Stark:"**, the brand name for this campaign (Kalob, Nov 2). If the A2P registration in Trust Center shows a different brand name, carriers may filter texts that don't match; check it before S01 goes out.
  - It carries STOP, because for some people (late registrants, Hawaii numbers) any one of these can be the first text they get.

| # | When (CT) | Text |
|---|---|---|
| S01 | Confirmation. Window 11 AM to 6:55 PM, only if registered before Sun Nov 8 at noon, not Hawaii | `The Justin Stark: you're signed up for The Box Top Method live launch, Mon Nov 9 at 12PM CT. Last step, about 20 seconds: confirm your seat on Zoom at {{custom_values.bt_zoom_register_url}} Reply STOP to opt out, HELP for help.` |
| S02 | Sun Nov 8, 12 PM (Hawaii 12:05 PM) | `The Justin Stark: tomorrow at noon Central we go live. Bring your questions and your spouse. Your join link is in Zoom's email. Not confirmed yet? {{custom_values.bt_zoom_register_url}} Reply STOP to opt out.` |
| S03 | Mon Nov 9, 11 AM, not Hawaii | `The Justin Stark: one hour till we go live. Join from Zoom's email, or confirm your seat here: {{custom_values.bt_zoom_register_url}} Reply STOP to opt out.` |
| S04 | Mon Nov 9, 12:02 PM | `The Justin Stark: we're live right now. Join from Zoom's email, or confirm here and hop in: {{custom_values.bt_zoom_register_url}} Reply STOP to opt out.` |
| S05 | When the replay is released; window 12 to 6:55 PM | `The Justin Stark: sorry we missed you at the live launch. Here's the replay: {{trigger_link.Lbc8PBvv84TFzWcaLnJK}} Reply STOP to opt out.` |
| S06 | Fri Nov 13, window 1 to 6:55 PM, marketing opt-in only, **only if BT Book URL is filled in** | `The Justin Stark: the whole Box Top Method, in one book. Get your copy: {{custom_values.bt_book_url}} Reply STOP to opt out.` |

**Notes:**
- **Replay link in S05:** `{{trigger_link.Lbc8PBvv84TFzWcaLnJK}}` is the key GHL generated for "BT Replay". If it doesn't render in SMS, use `{{custom_values.bt_replay_url}}`.
- **S06 without a book link:** remove S06 from BT · 04 and BT · 05 before Nov 13 if BT Book URL is still empty.
- **Length and cost:** the brand prefix and the full Zoom link push most of these to 2 or 3 SMS segments. That's fine; it costs a little more per text.

**Text count for one person who registered early (Nov 4):**
- **Event texts:** S01 (Nov 4), S02 (Nov 8, 12 PM), S03 (Nov 9, 11 AM), S04 (Nov 9, 12:02 PM), and S05 (Nov 9 evening, only if they missed the live).
- **Busiest 24 hours:** S03, S04 and S05, which is 3.
- **Marketing text:** S06 (Nov 13), only if they checked box 2 and the book link exists.
