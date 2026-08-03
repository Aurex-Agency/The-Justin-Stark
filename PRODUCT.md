# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated: single-file static HTML/CSS/JS (`index.html` + `assets/`), per the client build plan ("complete, single-file, responsive prototype… deploy as-is"). Static hosting target (Netlify/Vercel/GitHub Pages). No framework, no build step — the deliverable must be drag-and-drop deployable before the Aug 4–5, 2026 conference. *(Inferred from the client build plan; user instructed autonomous build.)*

## Users

General/mixed visitors who self-select into three paths:

1. **Families & pre-retirees** — evaluating retirement/income planning and insurance (RMD strategy, Roth conversions, life/annuities/LTC). Often referred; deciding whether to book a call.
2. **Agents & advisors** — considering joining/contracting under Justin; want mentorship, growth systems, path to ownership.
3. **Event hosts & teams** — booking Justin to speak (keynotes, team trainings), 2026–27 calendar.

## Product Purpose

thejustinstark.com — the personal-brand landing page for Justin Stark. One page that (a) makes a grand first impression and (b) captures visitor info: primary "Book a Call" CTA, lead form, and direct contact. Success = booked calls and form submissions arriving at justin@pontotocinsuranceagency.com.

## Positioning

Owner of Pontotoc Insurance Agency (Pontotoc, MS) who both serves families directly and builds agents into agency owners — and speaks nationally (MedicareCon stage). Voice: "Straight answers, no jargon, and a plan you'll actually understand." / "Do right by people. The rest follows."

## Operating Context

- Deadline: live before Aug 4–5, 2026 conference; visitors will arrive from the conference on phones.
- Form must be wired to a real endpoint before launch (Formspree/Netlify Forms); prototype ships with clearly-commented plug-in points.
- "Book a Call" should eventually point at a scheduler (Calendly/TidyCal); ships anchored to #contact until the link exists.

## Capabilities and Constraints

- Single page; sections: sticky header, hero, credential strip, How I Help (3 cards), About, speaking band, contact/lead capture, footer. Smooth-scroll nav (#work, #about, #speaking, #contact).
- Lead form fields: Name*, Email*, Phone, "I'm interested in" (Retirement/insurance · Joining as an agent · Booking to speak · Something else), message.
- Undecided (ship as clearly-marked placeholders): Justin's phone number, {{Conference Name}}, scheduler URL, exact credential-tile claims, favicon/og-image.

## Brand Commitments

- Style direction (binding, from client plan): Dark · Professional · Bold · Lux. Near-black bg #08090c, panels #0d0f15/#12151d, navy undertone #0b1a33 (nod to Pontotoc Insurance Agency), text #f4f1ea, muted #a7a9b4, champagne-gold accent #c9a24b → #e6c877.
- Type (binding): Playfair Display (700–900) headlines, Inter (300–700) body.
- Must NOT read as AI-generated; user asked for "creative style and a smooth non-AI look," "grand and ready to go."

## Evidence on Hand

Real photography in `assets/img/` (sourced from client's Drive folder):

- `headshot.jpg` — pro studio headshot, plaid blazer on deep teal-blue seamless (harmonizes with navy undertone).
- `stage-wide.jpg` (img0063) — wide MedicareCon 2023 stage shot, audience silhouettes.
- `stage-talk.jpg` (dsc02109) — on stage, blazer + mic, MEDICARECON backdrop.
- `stage-pair.jpg` (dsc01395) — on-stage conversation.
- `office-phone.jpg` (a7402978) — taking a call at desk, framed credentials behind.
- `office-notes.jpg` (a7402347) — writing in a client meeting.
- `studio-polo.jpg` (a7401945) — studio portrait, black polo.

No testimonials, stats, press quotes, or client counts supplied — do not fabricate; credential strip uses role descriptors only.

## Product Principles

1. Capture the visitor — every scroll depth offers a route to contact; never bury the CTA.
2. Let visitors self-select — three audiences, three doors, one form.
3. Real over stock — Justin's actual photos and voice; placeholders are honest, labeled slots, never fake content.
4. Deployable today — zero backend assumptions; endpoint/scheduler swap points are commented in the markup.
5. Trust is the product — an insurance/retirement audience punishes anything flashy-but-hollow; lux must read as credibility.
