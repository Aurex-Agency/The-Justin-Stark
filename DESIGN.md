---
name: The Justin Stark
description: An engraved Southern invitation suite — champagne foil die-stamped on near-black card stock — for thejustinstark.com.
colors:
  table: "#08090c"
  card-stock: "#0d0f15"
  second-sheet: "#12151d"
  navy-tissue: "#0b1a33"
  engraved-ink: "#f4f1ea"
  letterpress-grey: "#a7a9b4"
  champagne-foil: "#c9a24b"
  foil-light: "#e6c877"
  foil-rule: "rgba(201, 162, 75, 0.32)"
  foil-rule-dim: "rgba(201, 162, 75, 0.14)"
  ink-hairline: "rgba(244, 241, 234, 0.07)"
  ink-underline: "rgba(244, 241, 234, 0.22)"
  stamped-ink: "#14100a"
typography:
  display:
    fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif"
    fontSize: "clamp(2.7rem, 6.4vw, 5rem)"
    fontWeight: 900
    lineHeight: 1.12
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif"
    fontSize: "clamp(2.1rem, 4.4vw, 3.3rem)"
    fontWeight: 900
    lineHeight: 1.12
    letterSpacing: "-0.01em"
  title:
    fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif"
    fontSize: "1.42rem"
    fontWeight: 700
    lineHeight: 1.12
  flourish:
    fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif"
    fontSize: "1.08rem"
    fontWeight: 600
  body:
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "0.78rem"
    fontWeight: 600
    letterSpacing: "0.22em"
rounded:
  none: "0"
  stamp: "2px"
spacing:
  gutter: "1.5rem"
  cta-gap: "1rem"
  field-gap: "1.7rem"
  door-gutter: "2.4rem"
  head-gap: "3.5rem"
  suite-pad: "clamp(3rem, 6vw, 5.5rem)"
  suite-rhythm: "7rem"
components:
  button-foil:
    backgroundColor: "linear-gradient(180deg, #e6c877, #c9a24b)"
    textColor: "{colors.stamped-ink}"
    rounded: "{rounded.stamp}"
    padding: "1.05rem 2.1rem"
  button-hairline:
    backgroundColor: "transparent"
    textColor: "{colors.foil-light}"
    rounded: "{rounded.stamp}"
    padding: "1.05rem 2.1rem"
  button-hairline-hover:
    backgroundColor: "rgba(201, 162, 75, 0.07)"
    textColor: "{colors.engraved-ink}"
    rounded: "{rounded.stamp}"
  link-engraved:
    backgroundColor: "transparent"
    textColor: "{colors.foil-light}"
    padding: "0 0 0.45rem 0"
  suite-card:
    backgroundColor: "{colors.card-stock}"
    padding: "{spacing.suite-pad}"
  matted-frame:
    backgroundColor: "{colors.second-sheet}"
    padding: "0.8rem"
  reply-field:
    backgroundColor: "transparent"
    textColor: "{colors.engraved-ink}"
    rounded: "{rounded.none}"
    padding: "0.65rem 0.1rem"
---

# Design System: The Justin Stark

## Overview

**Creative North Star: "The Engraved Southern Invitation"**

Every surface in this world is a piece of a formal engraved invitation suite: card-stock panels laid on a near-black table, navy tissue showing through underneath, and champagne foil die-stamped into the stock as hairlines, double rules, a monogram seal, and one gold button per view. The page refuses the dark-SaaS template — no glowing hero, no icon-card grid, no gradient text. Its luxury is stationer's luxury: restraint, symmetry, hairline precision, and real photographs matted like keepsakes. A faint fixed film grain (an inline SVG turbulence tile at 2.8% opacity) gives the black its card-stock tooth.

Density is generous and ceremonial. Sections arrive as discrete cards ("suites") separated by 7rem of bare table, each carrying its own hairline border and a second inset rule 10px inside — the double-plate signature. Structure inside a card is drawn, never boxed: columns are divided by vertical hairlines, list rows by ledger rules, and the form is a reply card whose fields are single underlines. Motion is engraver's motion: rules draw themselves, content rises gently on one shared ease, and everything degrades to fully-visible stillness under reduced motion or without JS.

**Key Characteristics:**
- Two-foil champagne accent (#c9a24b standing, #e6c877 catching light) spent almost entirely on 1px rules, small caps, italic flourishes, and a single stamped button
- Playfair Display 700–900 ceremonial voice with italic-600 flourishes; Inter 400–700 as the functional hand
- Hairline-drawn structure (dividers, ledgers, double rules) instead of filled boxes or cards-with-icons
- Authored SVG ornaments only: JS monogram seal, diamond fleuron divider, hairline hamburger
- Real photographs matted on second-sheet stock; full-bleed imagery always scrimmed back to near-black and navy
- One easing for everything: `cubic-bezier(.16, 1, .3, 1)`; reveals opt in via JS and honor `prefers-reduced-motion`

## Colors

A near-black paper stack warmed by exactly one metal: champagne foil, spent sparingly, over a navy tissue undertone.

### Primary
- **Champagne Foil** (`#c9a24b`): the standing foil — small-caps labels, field labels, the head-rule under section headings, seal and fleuron strokes, focus outlines, and text selection background. This is the workhorse gold.
- **Foil Catching Light** (`#e6c877`): the brighter foil for moments of shine — italic `<em>` inside headings, engraved links, the monogram letters, default link color, and hover states on nav and quiet links. The two golds also meet in the primary button's vertical sheen (`linear-gradient(180deg, #e6c877, #c9a24b)`) — the only gradient in the system, and it lives on a surface, never on text.
- **Foil Rule** (`rgba(201,162,75,.32)`) and **Foil Rule Dim** (`rgba(201,162,75,.14)`): the same foil diluted into hairlines. Rule (.32) draws emphatic strokes — the outer hero plate, photo inner borders, hairline-button borders, dashed placeholder underlines. Rule Dim (.14) draws quiet structure — suite-card borders, column dividers, section top/bottom rules, header border when scrolled.

### Neutral
- **Table** (`#08090c`): the page background — the near-black table the suite is laid on. Also the scrim color over full-bleed photography (at .9–.98 alpha) and the scrolled header (`rgba(8,9,12,.9)` + blur).
- **Card Stock** (`#0d0f15`): the suite-card surface and `<select>` dropdown background.
- **Second Sheet** (`#12151d`): the photo-mat surface behind every framed photograph.
- **Navy Tissue** (`#0b1a33`): never a fill on its own — it tints. It appears only inside gradients: the hero's lower glow, the credential band's wash, the footer's fade, and the speaking band's scrim (a nod to Pontotoc Insurance Agency's navy).
- **Engraved Ink** (`#f4f1ea`): headings, primary text, `<strong>` emphasis inside grey copy, hover state of gold links, wordmark.
- **Letterpress Grey** (`#a7a9b4`): supporting copy, ledes, ledger-list rows, captions, nav links at rest, placeholder slots, form placeholders (at .75 alpha).
- **Ink Hairline** (`rgba(244,241,234,.07)`): ledger rules between list rows (door lists, reach list) and the footer's legal rule (.06). **Ink Underline** (`rgba(244,241,234,.22)`): the resting underline of reply-card fields.
- **Stamped Ink** (`#14100a`): dark text pressed into gold surfaces — foil buttons, the skip link, text selection.

### Named Rules
**The Foil Budget Rule.** Champagne foil is spent on hairlines, small caps, italic flourishes, ornament strokes, and at most one gold-filled button per view. It is never a background wash, never text-fill gradient, never a glow.

**The Two Foils Rule.** `#c9a24b` is standing foil (labels, rules, strokes); `#e6c877` is foil catching light (emphasis, links, monogram letters, hovers). Hover resolves gold toward ink (`#f4f1ea`), not toward brighter gold.

**The Tissue Rule.** Navy `#0b1a33` appears only inside gradients and scrims as an undertone — never as a flat panel color, border, or text color.

## Typography

**Display Font:** Playfair Display, variable 700–900 upright + a separate italic-600 face (with Georgia, 'Times New Roman' fallback) — self-hosted woff2 in `assets/fonts/`, `font-display: swap`, preloaded.
**Body Font:** Inter, variable 400–700 (with system-UI fallback) — self-hosted, preloaded.

**Character:** The engraver's pairing. Playfair at 900 is the copperplate voice — every h1–h3, always with balanced wrapping (`text-wrap: balance`) and tight -0.01em tracking. Inter does everything functional: body copy, labels, buttons, navigation. The two never blur: if it's ceremonial it's Playfair, if it's operational it's Inter.

### Hierarchy
- **Display** (900, `clamp(2.7rem, 6.4vw, 5rem)`, 1.12): the hero headline only; max-width 17ch, centered.
- **Headline** (900, `clamp(2.1rem, 4.4vw, 3.3rem)`, 1.12): section h2s (about h2 runs slightly smaller at `clamp(2rem, 4vw, 3rem)`). Headlines end with an italic flourish: the final phrase sits in `<em>` — Playfair italic 600, Foil Catching Light.
- **Title** (700, 1.18–1.42rem): door headings (1.42rem), aside heading (1.35rem), credential titles (1.18rem), mobile-menu links (1.7rem).
- **Flourish** (italic 600, 1.08–1.9rem, Foil Catching Light): the italic serif voice for door promises (1.08rem), the signature (1.55rem), and the form's thank-you line (1.9rem). Also used at body size, in Letterpress Grey, for quiet asides (door notes, form reassurance, reach note).
- **Body** (Inter 400, 1.0625rem, 1.7): paragraphs capped at 68ch (hero sub 60ch, section ledes 64ch). `<strong>` inside grey copy is weight 600 in Engraved Ink — that contrast shift is the emphasis system.
- **Label** (Inter 600, 0.72–0.8rem, 0.16–0.22em tracking, uppercase): the small-caps voice, plus buttons (0.8rem/0.18em), nav links (0.8rem/0.16em, weight 500), field labels (0.72rem/0.2em), and photo captions (0.76–0.78rem/0.2em in Letterpress Grey).

### Named Rules
**The No-Kicker Rule.** The small-caps voice (`.smallcaps`: Inter 600, 0.78rem, 0.22em, uppercase, Champagne Foil) is a voice for lines of content — the hero's engraved conference line, the speaking meta line, captions, field labels — separated by middot separators in Foil Rule when listed. It never sits above a heading as a kicker or eyebrow. Headings introduce themselves.

**The Italic Flourish Rule.** Emphasis inside any Playfair heading is italic 600 in Foil Catching Light — never bolder weight, never underline, never a second color family.

## Layout

The spatial model is a suite of cards on a table. Content lives in a `min(100% - 3rem, 1180px)` centered container (3rem total gutter, 2rem under 520px). Major sections are either:

1. **Suite cards** — the container itself becomes a bordered card (`#0d0f15`, 1px Foil Rule Dim border, inset double rule at 10px, `clamp(3rem, 6vw, 5.5rem)` padding), separated by a 7rem vertical rhythm of bare table. How I Help, About, and Contact are suite cards.
2. **Full-bleed bands** — edge-to-edge strips bounded by top/bottom hairlines in Foil Rule Dim: the credential band (4-up ruled row) and the speaking band (scrimmed stage photo). The candid photo strip sits at container width without a card.

Grids observed: credentials 4×1fr; doors and photo strip 3×1fr; about 5fr/7fr (portrait/letter); reply card 7fr/5fr (form/direct-contact aside); form field rows 2×1fr with 1.8rem gap. Section heads cap at 64ch with a 74px × 1px Champagne Foil head-rule beneath (at .75 opacity, 1.8rem above content). The hero fills `100svh`, centering a `min(100%, 980px)` invitation plate.

The fixed header is transparent over the hero and gains its material on scroll (>24px): near-black at .9 alpha, 14px backdrop blur, hairline bottom border, soft black shadow. Smooth scrolling with `scroll-padding-top: 5.5rem` keeps anchors clear of it.

**Responsive:** at ≤900px the nav collapses to a hairline hamburger opening a full-screen near-black menu (Playfair 700 links, 1.7rem); credentials go 2×2 (hairlines rewired so interior rules stay coherent); doors stack vertically, their dividers rotating from left-borders to top-borders; about, strip, and reply grids collapse to one column; the matted portrait caps at 440px centered. At ≤520px credentials stack 1-up, field rows stack, hero CTAs go full-width, and cards widen to a 2rem gutter. At ≤360px the wordmark tightens. Hairline dividers always rotate with the stack — a divided grid never becomes gapped boxes.

**The Rotating Hairline Rule.** When a hairline-divided grid stacks, its vertical dividers become horizontal ones (`border-left` → `border-top`). Divisions are never dropped and never replaced with boxes or gaps.

## Elevation & Depth

Essentially flat: depth is stacked paper, not floating panels. The three stocks (`#08090c` table → `#0d0f15` card → `#12151d` mat) do the layering, and hairline borders — not shadows — declare edges. Shadows exist only in three places, always plain soft black, biased downward: matted photographs resting on the table (`0 24px 50px -30px rgba(0,0,0,.85)` for the portrait, `0 20px 44px -30px rgba(0,0,0,.85)` for the strip frames), buttons on hover-lift (`0 14px 28px -14px rgba(0,0,0,.75)`), and the scrolled header (`0 10px 30px -18px rgba(0,0,0,.8)`). Atmosphere comes from tints, not glows: two faint radial washes in the hero (foil at .075 above, navy at .55 below), navy gradient washes on the credential band and footer, and the fixed grain overlay (opacity .028, z-index 60, pointer-events none) that textures everything.

### Shadow Vocabulary
- **Resting mat** (`box-shadow: 0 24px 50px -30px rgba(0,0,0,.85)`; strip variant `0 20px 44px -30px`): under photo mats only — the weight of framed paper on the table.
- **Hover lift** (`box-shadow: 0 14px 28px -14px rgba(0,0,0,.75)` with `translateY(-2px)`): foil button hover.
- **Header float** (`box-shadow: 0 10px 30px -18px rgba(0,0,0,.8)`): scrolled fixed header only.

### Named Rules
**The Black Shadow Rule.** Every shadow is neutral black at low spread, cast downward. No colored glows, no gold halos, no ambient accent shadows — foil shines by contrast, not by bloom.

## Shapes

Square. Corners are 0 everywhere content lives — cards, mats, photos, fields, the hero plate. The only radius in the system is a 2px easing on stamped interactive elements (buttons, hamburger, skip link, focus outline) — the softness of a die-cut edge, nothing more. Form language is the engraver's line: 1px hairlines, doubled rules (hero plate outer 1.2px + inner 1px at 8px inset; suite border + inset rule at 10px), and ledger rows. Ornament is authored inline SVG in the foil palette only: the JS monogram seal (concentric ellipses, the inner at reduced opacity, around Playfair letters), the fleuron divider (two hairlines meeting a 45°-rotated diamond — the divider under the hero h1 and above the reply card, echoed in the seal's base and the hero note's middots), and the three-line hamburger. Placeholder slots are marked by a 1px dashed underline in Foil Rule. Photographs are always rectangular, never rounded, never masked.

## Components

### Buttons
Stamped, uppercase, deliberate — a foil stamp and a blind emboss.
- **Shape:** near-square (2px radius); Inter 600, 0.8rem, 0.18em tracking, uppercase; `padding: 1.05rem 2.1rem` (header variant compresses to `.7rem 1.4rem`; full-width under 520px in the hero).
- **Foil (primary):** the two-gold vertical gradient with a Foil Catching Light border, Stamped Ink text. One per view region: "Book a Call" / "Check Availability" / "Send It".
- **Hairline (secondary):** transparent with a Foil Rule border, Foil Catching Light text; hover fills faintly (`rgba(201,162,75,.07)`), brightens the border, and resolves text to ink.
- **Hover:** both lift `-2px` over .35s on the house ease; foil adds the black hover-lift shadow.
- **Focus:** global `:focus-visible` — 2px Champagne Foil outline, 3px offset.

### Engraved Link
The tertiary action: small-caps text (Inter 600, 0.78rem, 0.2em, uppercase, Foil Catching Light) sitting on a resting hairline in Foil Rule; on hover a Foil Catching Light line draws over it left-to-right (.5s, house ease, `scaleX` from the left) while the text resolves to ink. Used at the foot of each door and nowhere else.

### Suite Card
The section container: Card Stock surface, 1px Foil Rule Dim border, and an inset `::before` rule 10px inside at `rgba(201,162,75,.08)` — the double plate. Padding `clamp(3rem, 6vw, 5.5rem)`; no radius; no shadow (it lies flat on the table). Sections open with a section-head (headline + grey lede + 74px foil head-rule), then `3.5rem` to content.

### Door Column
One of three hairline-divided columns inside a suite card (no boxes, no icons): Playfair title (1.42rem), italic gold promise line, a ledger list, then an engraved link pinned to the base (`flex: 1` on the list). Columns are separated by 1px Foil Rule Dim dividers with `2.4rem` gutters; dividers rotate to horizontal when stacked.

### Ledger List
List rows ruled like a ledger: no bullets; each row `.78rem` vertical padding, Letterpress Grey at 0.95rem/1.55, bounded by Ink Hairline rules top and bottom (first row carries the top rule). Lead phrases sit in `<strong>` — Engraved Ink, weight 600. The reach list is the same grammar at larger padding (1.35rem) with small-caps labels above each entry.

### Matted Photograph
Every photo is matted: a Second Sheet mat (1px Foil Rule Dim outer border, `.8rem`–1.3rem padding, resting-mat shadow) around the image, which carries its own 1px Foil Rule inner border — the frame's fillet. Below, a centered small-caps caption in Letterpress Grey. Strip photos crop to a fixed 340px height (300px stacked), `object-position: center 22%`. Full-bleed photography (the speaking band) is instead scrimmed: layered gradients of Table-black (.55–.97) and Navy Tissue over the image, bounded by hairlines, with content limited to 56ch on the left where the scrim is deepest.

### Reply-Card Field
Form fields as lines on a reply card: transparent, borderless except a 1px Ink Underline bottom rule, no radius, Engraved Ink text at 1rem, placeholders in Letterpress Grey at .75 alpha. Labels above in the small-caps label voice (Champagne Foil, 0.72rem/0.2em), required marker as a gold asterisk. Focus turns the underline Champagne Foil (.3s) and adds the global gold outline at 4px offset. Selects are unstyled-native-free: appearance none with an inline gold-chevron SVG, options on Card Stock. Textareas resize vertically from 6.2rem. The submit row pairs the foil button with an italic grey reassurance line; success replaces the form with a centered italic-gold serif line and grey copy (`role="status"`, `aria-live="polite"`, focus moved). A visually-hidden honeypot field guards the form.

### Placeholder Slot
Unresolved facts (phone number, scheduler link) are honest, labeled slots: italic Letterpress Grey text (0.95rem) on a 1px dashed Foil Rule underline, each accompanied by an HTML `REPLACE:` comment showing the exact swap-in markup. Never fake content, never a dead link.

### Navigation
Fixed header: monogram seal (40×46 SVG) + Playfair 700 uppercase wordmark (0.18em tracking) left; small-caps nav links (Letterpress Grey → Foil Catching Light on hover, .3s) + compressed foil button right. Transparent at top, gains blurred near-black material after 24px of scroll. Mobile: hairline-bordered hamburger whose bars morph to an X (aria-expanded driven); full-screen near-black overlay menu (.98 alpha) with Playfair 700 links at 1.7rem, closing on link tap or Escape, body scroll locked while open. A gold skip-link surfaces on focus. Footer repeats the seal, small-caps nav, and a hairline-ruled legal line.

### Seal & Fleuron (signature ornaments)
The JS monogram seal — concentric foil ellipses (inner ring at ~.4 opacity) around Playfair "JS" in Foil Catching Light, with a base flourish of two hairlines meeting a rotated diamond — appears at 96px in the hero, 40px in the header, 34px in the footer, and as the favicon. The fleuron divider (170px wide: hairline · diamond · hairline, foil at .55) marks ceremonial pauses: under the hero headline and above the reply card. Both are authored inline SVG; no icon fonts, no icon libraries exist in this world.

### Motion Grammar
One ease everywhere: `cubic-bezier(.16, 1, .3, 1)`. The hero performs the engraving: the plate's double border draws itself via `stroke-dashoffset` (`pathLength: 100`, 1.7s, outer at .15s / inner at .55s), while seal → headline → fleuron+sub → CTAs → conference line rise 18px and fade in staggered from .35s to 1.05s (.9s each) — all inside `@media (prefers-reduced-motion: no-preference)`. Below the fold, elements carry `.reveal` (visible by default; JS adds the hidden state): IntersectionObserver (`rootMargin: 0 0 -8%`, threshold .1, unobserve after firing) fades them up 16px over .8s, with sibling stagger via `data-d="1|2|3"` (.08s steps). Micro-motion: -2px button lifts (.35s), drawn link underlines (.5s), .3–.4s color/border transitions, hamburger-to-X morph. Reduced motion collapses every animation and transition to ~0ms and disables both smooth scroll and the observer path; no-JS shows everything.

## Do's and Don'ts

### Do:
- **Do** draw structure with hairlines — Foil Rule Dim for quiet structure, Foil Rule for emphasis, Ink Hairline for ledger rows — and rotate dividers (left-border → top-border) when grids stack.
- **Do** end section headlines with an italic Playfair flourish in Foil Catching Light, and reserve `<strong>`-in-grey (ink, 600) as the only in-paragraph emphasis.
- **Do** spend gold on at most one foil button per view region, pairing it with a hairline button or engraved link for the quieter path.
- **Do** mat every photograph (Second Sheet mat + Foil Rule inner border + black resting shadow + small-caps caption) or scrim it to near-black/navy when full-bleed.
- **Do** keep motion on the single house ease, opt-in via JS (`html.js`), gated by `prefers-reduced-motion`, and fully visible without either.
- **Do** mark unresolved facts as labeled placeholder slots (italic grey on dashed foil underline) with `REPLACE:` comments — honest slots, never invented content.

### Don't:
- **Don't** use gradient text. The system's only gradient is the foil button surface; type is always a solid ink or foil.
- **Don't** build icon-card grids. There are no icons beyond the authored seal, fleuron, hamburger, and select-chevron SVGs; capability lists are ledger-ruled text.
- **Don't** put a kicker or small-caps eyebrow above any heading. The small-caps voice is content (meta lines, captions, labels), never a heading's warm-up.
- **Don't** cast colored or glowing shadows. Shadows are soft black and downward; foil never blooms.
- **Don't** round corners past the 2px stamp radius, and never on cards, mats, photos, or fields.
- **Don't** introduce new hues. The world is three dark stocks, two inks, two foils, and a navy that lives only inside gradients.
