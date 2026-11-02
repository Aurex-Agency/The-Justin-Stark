# Box Top launch: email and SMS copy (drafts for Justin's approval)

Voice rules (Brand Guide): Justin across a kitchen table. Short sentences, contractions, **no em dashes**, no AI phrasing, education only: no product named, recommended or priced. Times always run west to east.

**Every email**
- **From:** Justin Stark, on the verified sending domain. **Reply-to:** Justin.
- **Merge fields:** first name `{{contact.first_name}}`; join link `{{contact.bt_zoom_join_url}}` (for Plan B registrants it holds the Zoom registration link, so it always gets them to Zoom).
- **Footer:** GHL's unsubscribe link plus a **postal address** (required by CAN-SPAM; PIA's mailing address, which is still needed), then "Presented by Pontotoc Insurance Agency. The Box Top Method is educational, not financial, tax or legal advice."
- **Layout:** plain, one column. Buttons in indigo `#2D378F` with cream text, in caps.

---

## Emails

### M01 · "You're in" (BT · 02, on registration)
**Subject:** You're in, {{contact.first_name}}. Here's your link.
**Preview:** Monday, Nov 9 at noon Central. Save this email.

> {{contact.first_name}},
>
> You're registered for the live launch of The Box Top Method.
>
> **Monday, November 9**
> 10AM PT · 11AM MT · 12PM CT · 1PM ET
>
> [ JOIN THE LIVE LAUNCH ] → {{contact.bt_zoom_join_url}}
>
> That link is yours. Save this email, or put it on your calendar now.
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
> [ MY ZOOM LINK ] → {{contact.bt_zoom_join_url}}
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
> [ MY ZOOM LINK ] → {{contact.bt_zoom_join_url}}
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
> [ JOIN THE LIVE LAUNCH ] → {{contact.bt_zoom_join_url}}
>
> Bring your list of pieces, your questions, and your spouse. Remember, the five free tools are for the folks who come live.
>
> Justin

### M05 · Mon Nov 9, 8 AM · today
**Subject:** Today at noon Central
**Preview:** Your link is inside.

> {{contact.first_name}}, today's the day.
>
> The Box Top Method is out, and we go live at **10AM PT · 11AM MT · 12PM CT · 1PM ET**.
>
> [ JOIN THE LIVE LAUNCH ] → {{contact.bt_zoom_join_url}}
>
> See you at noon.
> Justin

### M06 · Mon Nov 9, 11 AM · one hour
**Subject:** One hour
**Preview:** We go live at noon Central.

> One hour till we go live, {{contact.first_name}}.
>
> [ JOIN THE LIVE LAUNCH ] → {{contact.bt_zoom_join_url}}
>
> Justin

### M07 · Mon Nov 9, 12:02 PM · live
**Subject:** We're live
**Preview:** Hop in now.

> We're live right now, {{contact.first_name}}. Come on in.
>
> [ JOIN NOW ] → {{contact.bt_zoom_join_url}}
>
> Justin

### M08 · Nov 9, 2 PM · attended: thank you + tools
**Subject:** Thank you for coming. Here are your tools.
**Preview:** All five, plus what's next.

> {{contact.first_name}},
>
> Thank you for spending your Monday with me. It meant a lot.
>
> As promised, here are your free tools:
> [ GET MY 5 TOOLS ] → {{custom_values.bt_bonus_vault_url}}
>
> Start with the Box Top Quiz. It takes a few minutes and tells you your retiree type and your biggest gap.
>
> If you want me to look at your picture with you, one on one, that's what a Box Top Review is. We put your pieces on the table, find your four corners, and you leave with a clear picture. Education first, no pressure.
> [ BOOK A BOX TOP REVIEW ] → {{custom_values.bt_review_url}}
>
> And if you'd like the book itself: {{custom_values.bt_book_url}}
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

### M10 · Fri Nov 13, 10 AM · attended: review invite
**Subject:** Want me to look at your picture with you?
**Preview:** One on one. Education first.

> {{contact.first_name}},
>
> Once you can see the whole picture, the gap usually points to the next step. Sometimes it helps to have someone sit down and look at it with you.
>
> That's a Box Top Review. It's free and takes about 45 minutes, just you (and your spouse) and me. We put your pieces in their corners, and you leave knowing where you stand and what questions to ask next. No pressure.
>
> [ BOOK A BOX TOP REVIEW ] → {{custom_values.bt_review_url}}
>
> Justin

### M11 · Mon Nov 16, 10 AM · attended: last call
**Subject:** Last call for November Box Top Reviews
**Preview:** A few spots left this month.

> {{contact.first_name}},
>
> Quick note. I'm holding a few Box Top Reviews for folks from the launch this month, and they're filling up. If you've been meaning to book one, this is the week.
>
> [ BOOK A BOX TOP REVIEW ] → {{custom_values.bt_review_url}}
>
> Either way, keep that list of pieces. Clarity precedes confidence.
>
> Justin

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

### M14 · Fri Nov 13, 10 AM · replay: review invite
Same as M10, with one opening line swapped: "Whether or not you've finished the replay, …"

### M15 · Mon Nov 16, 10 AM · replay comes down
**Subject:** The replay comes down tonight
**Preview:** Last chance to watch.

> {{contact.first_name}},
>
> Heads up: the launch replay comes down tonight.
>
> [ WATCH THE REPLAY ] → trigger link **BT Replay**
>
> And if you'd rather talk it through one on one: [ BOOK A BOX TOP REVIEW ] → {{custom_values.bt_review_url}}
>
> Justin

### M16 · Box Top Review no-show · rebook
**Subject:** Sorry we missed you
**Preview:** Pick a new time that works.

> {{contact.first_name}}, sorry we missed each other today. No problem at all. Pick a time that works better:
>
> [ PICK A NEW TIME ] → {{custom_values.bt_review_url}}
>
> Justin

---

## SMS

Event texts (S01 to S05) go only to `bt-sms-optin`; marketing (S06) goes only to `bt-sms-marketing-optin`. Max 3 per person in any 24 hours, 8 AM to 8 PM their time (the workflow sheet's waits enforce this). Each is about 160 characters or less, except where the link is long.

| # | When | Text |
|---|---|---|
| S01 | Confirmation (window 11 AM to 6:55 PM CT, only if registered before Nov 8 noon) | `Justin Stark: you're in for The Box Top Method live launch, Mon Nov 9 at 12PM CT. Your link: {{contact.bt_zoom_join_url}} Reply STOP to opt out, HELP for help.` |
| S02 | Sun Nov 8, 12 PM | `Justin Stark: tomorrow at noon Central we go live. Bring your questions and your spouse. Your link: {{contact.bt_zoom_join_url}}` |
| S03 | Mon Nov 9, 11 AM (not Hawaii) | `Justin Stark: one hour till we go live. Your link: {{contact.bt_zoom_join_url}}` |
| S04 | Mon Nov 9, 12:02 PM | `Justin Stark: we're live right now. Hop in: {{contact.bt_zoom_join_url}}` |
| S05 | Nov 9, 6 PM (no-shows and replay requests) | `Justin Stark: sorry we missed you at the live launch. Here's the replay: {{trigger_link.bt_replay}} Reply STOP to opt out.` |
| S06 | Nov 13 (marketing opt-in, window 1 PM to 6:55 PM CT so Hawaii is after 9 AM) | `Justin Stark: want me to look at your retirement picture with you? Book a free Box Top Review: {{custom_values.bt_review_url}} Reply STOP to opt out.` |

The replay text's link: use GHL's trigger-link merge tag from the trigger link's settings (the exact tag GHL shows), or the plain `{{custom_values.bt_replay_url}}` if trigger links aren't available in SMS.
