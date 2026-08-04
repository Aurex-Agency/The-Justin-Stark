# thejustinstark.com

Single-page brand landing site for **Justin Stark** — retirement & income planning, agency building, and speaking. Built per the client build plan: Dark · Professional · Bold · Lux, champagne gold on near-black, Playfair Display + Inter (self-hosted).

Everything lives in one file plus assets — no build step, no framework:

```
index.html          the whole site (styles + markup + scripts inline)
assets/fonts/       self-hosted woff2 (Playfair Display, Inter — latin subset)
assets/img/         photography (client-supplied), favicon.svg, og.jpg
PRODUCT.md          durable product/brand truth for future design work
DESIGN.md           the site's visual system, recorded from the build
```

## Deployment

**Live at [thejustinstark.com](https://thejustinstark.com)** on Vercel; `www` 308-redirects to the apex domain, which is the canonical URL in the page head, sitemap, and structured data. Pushing to the deployed branch redeploys the site.

## Before launch — the replacement list

Each spot is marked with a `REPLACE` or `DEMO ONLY` comment in `index.html`:

- [x] **Form.** Wired — posts through [FormSubmit](https://formsubmit.co) to justin@pontotocinsuranceagency.com (spam honeypot on, redirect back to a thank-you state). **One-time step:** submit the form once on the live site; FormSubmit emails Justin a confirmation link — after he clicks it, every submission is delivered. Send a test message after activating.
- [x] **Scheduler.** Done — the GoHighLevel booking calendar is embedded in the `#book` section and every "Book a Call" button anchors to it.
- [x] **Phone number.** Done — (662) 509-1213 tap-to-call in the contact section.
- [ ] **Conference name.** Add it to the hero meta line (marked with a comment) — and confirm the "On the conference stage · August 4–5, 2026" claim itself before launch.
- [ ] Review copy — it's a strong first draft in Justin's voice; he should read it through.
- [ ] Verify on a phone: nav, smooth scroll, form, calendar embed, tap targets.

## Notes

- Fonts are self-hosted for speed and privacy; no Google Fonts request at runtime.
- Photos were resized/compressed from the client's Drive folder; originals remain there.
- `og.jpg` (1200×630) and `favicon.svg` are generated placeholders — swap anytime.
- `.impeccable/` holds design-system context used by the Impeccable design tooling.
