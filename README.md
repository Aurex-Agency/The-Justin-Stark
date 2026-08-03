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

## Deploy (fastest path)

The site is fully static. Drag-and-drop the repo (or just `index.html` + `assets/`) onto **Netlify** or **Vercel**, then point the domain:

1. Deploy → confirm the preview URL renders.
2. Add `thejustinstark.com` + `www.thejustinstark.com` in the host's domain settings.
3. Create the DNS records the host prompts for (A/ALIAS for apex, CNAME for www) and a redirect so both resolve. HTTPS auto-provisions.

GitHub Pages / Cloudflare Pages work the same way.

## Before launch — the replacement list

Each spot is marked with a `REPLACE` or `DEMO ONLY` comment in `index.html`:

- [ ] **Wire the form.** Create a [Formspree](https://formspree.io) form, set `action="https://formspree.io/f/XXXXXXX"` + `method="POST"` on `<form id="leadForm">`, and delete the `DEMO ONLY` script block at the bottom of the file. (On Netlify, adding the `netlify` attribute to the form works instead.) Route notifications to justin@pontotocinsuranceagency.com. Send a test submission.
- [ ] **Scheduler link.** Point every `.js-book` "Book a Call" button and the "Book a time that works" contact slot at the Calendly/TidyCal URL (`target="_blank" rel="noopener"`).
- [ ] **Phone number.** Swap the "Call or text" slot for a real `tel:` link.
- [ ] **Conference name.** Add it to the hero meta line (marked with a comment) — and confirm the "On the conference stage · August 4–5, 2026" claim itself before launch.
- [ ] Review copy — it's a strong first draft in Justin's voice; he should read it through.
- [ ] Verify on a phone: nav, smooth scroll, form, tap targets.

## Notes

- Fonts are self-hosted for speed and privacy; no Google Fonts request at runtime.
- Photos were resized/compressed from the client's Drive folder; originals remain there.
- `og.jpg` (1200×630) and `favicon.svg` are generated placeholders — swap anytime.
- `.impeccable/` holds design-system context used by the Impeccable design tooling.
