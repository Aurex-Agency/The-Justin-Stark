# Phase 3: The Box Top website (`thejustinstark.com/theboxtop/`)

**Status:** roadmap for approval in principle. Detailed specs per page come when each one is up next.
**Starts:** once ads are running (Nov 4). A few pieces have hard dates because the launch itself depends on them; those are **1b** below.

---

## 1. What the site is for

The book's permanent home, and the front door to everything built around it. Four audiences, four jobs:

| Audience | Job | Primary action |
|---|---|---|
| Readers and would-be readers | Get the book, understand the Four Corners | Buy the book · take the quiz |
| Pre-retirees and retirees | See their own picture | Box Top Quiz → workbook → **Box Top Review** |
| Financial professionals | Learn to run the Four Corners conversation | Box Top certification (60-Day Sprint) inquiry |
| Media, podcast and event hosts | Book Justin | Media kit · speaking inquiry |

It inherits the Box Top brand kit and everything Phase 1 builds (tokens, Montserrat, `/api` pattern, pixel + CAPI, GHL webhook with an `action` per form).

## 2. Sitemap

| URL | Page | Content source in Drive | Priority |
|---|---|---|---|
| `/theboxtop/bonuses/` | Attendee bonus vault (noindex) | The five giveaways | **1b: live Nov 9, 1 PM CT** |
| `/theboxtop/replay/` | Launch replay (noindex) | Zoom cloud recording | **1b: Nov 9 evening** |
| Homepage band | "The Box Top Method, out now" band + nav link on `thejustinstark.com` | Cover, thesis | **1b: Nov 9.** The talk show reads switch to "out now at thejustinstark.com" after launch day, so the homepage must point at the book |
| `/theboxtop/` | **Book home**: cover, thesis, Four Corners at a glance, Justin, where to buy, quiz CTA, Box Top Review CTA, agent and media doors | Synopsis, Brand Guide | **P2: by Nov 13** |
| `/theboxtop/quiz/` | **The Box Top Quiz** (14 questions → retiree type, Four Corners clarity score, biggest gap), results captured to GHL | Quiz artifact | **P2.** Likely the book's QR code destination; see §4 |
| `/theboxtop/review/` | Book a Box Top Review (GHL calendar) | Brand Guide canon | **P2** |
| `/theboxtop/four-corners/` | The framework, one section per corner (liquidity ladder; time, cash flow and cash; three tax buckets; safety, growth and access) + the Retirement Red Zone | Synopsis, Education Series sessions 4 to 9, Four Corners workbook | P3 |
| `/theboxtop/workbook/` | Four Corners Workbook download (email-gated, fillable + print PDFs) | Four Corners Workbook PDFs | P3 |
| `/theboxtop/trust-finder/` | Legacy Trust Finder, results to GHL | Trust Finder artifact | P3 |
| `/theboxtop/packets/` | Legacy Planning Packet + Legacy & Business Planning Packet (gated) | Packet artifacts | P3 |
| `/theboxtop/classes/` | Box Top classes: the 12-session education series, upcoming dates, registration | Education Series decks 01 to 12, presenter guide | P3 |
| `/theboxtop/for-advisors/` | For financial professionals: the Box Top 60-Day Sprint certification, inquiry form to the agent pipeline | 60-Day Sprint curriculum, Bridge class, agent training deck | P3 |
| `/theboxtop/media/` | Media kit: synopsis, bio (short/long), headshots, cover + 3D mockups, interview questions, talk show reads, contact | Synopsis, Talk Show Ad Reads | P3 |
| `/theboxtop/launch/` | After launch: becomes "Missed the launch? Watch the replay" (Phase 1 handles this automatically) | | done in Phase 1 |

`/boxtop` vanity redirect flips from the launch page to `/theboxtop/` when the book home goes live.

## 3. Book home (`/theboxtop/`) outline

1. Hero: real cover + 3D mockup, the subtitle as headline, BY JUSTIN L STARK, **Buy the book** (retailer links) + **Take the Box Top Quiz**
2. "Most people don't have a money problem. They have a clarity problem." The puzzle with no picture on the box
3. The Four Corners at a glance (links into `/four-corners/`)
4. Inside the book: three parts (why retirement feels unclear · the Four Corners · building your box top), the closing checklist "Questions to Ask Before You Move a Dollar"
5. Free tools: quiz, workbook, trust finder, packets (each its own lead capture)
6. Meet Justin (Marines → police → pastor → a decade in Medicare and retirement planning)
7. Box Top Review CTA ("See your whole picture, one page, with Justin")
8. For advisors · For media and events (two quiet doors)
9. Footer: disclaimer, Presented by Pontotoc Insurance Agency, Game Changer Publishing credit

SEO: `Book` structured data (title, author, publisher, ISBN once known), Open Graph cover image, sitemap entries, canonical URLs.

## 4. Things that need answers before Phase 3 specs

| # | Question | Why it matters |
|---|---|---|
| W1 | **What URL does the QR code printed in the book encode?** (`QR Codes For Book` folder, created Sep 1) | Printed books can't be updated. Whatever URL is in there has to resolve forever. If it's a thejustinstark.com path, we build to that path; if it's a claude.ai link, we leave it alone and point the quiz page at the same tool |
| W2 | Where is the book sold, and from what date? (Amazon, the publisher's store, signed copies from Justin via a GHL payment link, bulk orders for agencies) | Every page's main CTA |
| W3 | Hosting for the quiz, trust finder and packets: port them into this repo (recommended, so results flow to GHL through the same `/api` pattern and the toolkit's "hook the quiz into GHL" item is closed) or link to the shared artifacts | Ownership, tracking, uptime |
| W4 | Is "The Box Top Training" bonus a recorded video course or the 43-slide consumer deck? Nothing recorded is in the Drive yet | The bonus vault (1b) has to deliver it on Nov 9 |
| W5 | Full-resolution cover, 3D mockups, publisher logo from Game Changer Publishing | Already an open item in the Brand Guide; the site can't redraw the cover |
| W6 | Real endorsements or reviews, with permission | We won't fabricate social proof |
| W7 | Does Justin want the homepage to stay dark/gold (personal brand) with a Box Top band, or move the whole homepage into the Box Top kit? The Brand Guide lists thejustinstark.com under the Box Top kit | Scope of the homepage change |
| W8 | Is "Stark Advisory Group" the public name for the agent program? | `/for-advisors/` naming |

## 5. Build approach

- Same stack as the rest of the site: static HTML per page, inline CSS/JS, self-hosted fonts, Vercel functions only where a form needs a server. No framework, no build step (keeps it consistent with `index.html` and `/big-table/`, and deployable by anyone).
- Shared Box Top header/footer markup is copied per page (small site; a build step isn't worth it yet). Revisit if the page count passes ~15.
- Every form posts through `/api/boxtop-register` with its own `action` (`quiz`, `workbook`, `trust-finder`, `packet`, `review-interest`, `advisor-inquiry`, `media-inquiry`), so GHL gets one consistent payload shape and attribution on every lead.
- Pixel events: `Lead` for gated downloads and quiz completions, `Schedule` for Box Top Review bookings, `ViewContent` on the book home, `InitiateCheckout` on outbound buy clicks.
- Each page gets a surface brief in `.impeccable/surfaces/` like the existing pages.

## 6. Order of work after ads start

| Window | Work |
|---|---|
| Nov 4 to Nov 8 | 1b: bonus vault, replay page shell, homepage band (ready to flip on Nov 9) · answers to W1 to W5 |
| Nov 9 | Flip homepage band live · bonus vault live at the end of the webinar · replay page live once Zoom's recording processes |
| Nov 10 to Nov 13 | P2: book home, quiz (ported, GHL-connected), Box Top Review page; `/boxtop` flips to `/theboxtop/` |
| Nov 16 to Nov 30 | P3: Four Corners, workbook, trust finder, packets, classes, for-advisors, media kit |
| After | Monthly: new class dates, endorsements as they come in, Meta optimization on quiz leads and reviews |
