# The Cove at Landmark — Port Harcourt

Real React codebase (Vite + React 18 + Tailwind + GSAP/ScrollTrigger + Lenis),
not an in-chat preview. Built to reproduce the reference site's actual scroll
mechanics (scroll-linked parallax via GSAP ScrollTrigger scrub tweens, Lenis
smooth scroll) rather than an approximation.

## Run it

```bash
npm install
npm run dev       # local dev server
npm run build      # production build (verified passing)
npm run preview    # serve the production build locally
```

No deployment target was available in the build environment (no Vercel token
present), so this has **not** been visually verified in a live browser —
only build-verified (clean `vite build`, Tailwind utilities confirmed present
in output CSS). Recommend a visual pass on first run.

## Structure

- `src/components/Hero.jsx` — full-bleed parallax hero
- `src/components/Intro.jsx` — concept statement, three pillars
- `src/components/FlagshipAttraction.jsx` — the upside-down attraction.
  **Deliberately no stock photo** — there's no real asset for this yet, and
  faking one for a "first of its kind worldwide" attraction would misrepresent
  it. Uses an abstract line-art treatment with a visible "concept renders in
  development" badge instead.
- `src/components/ZoneRing.jsx` — Hologram Zoo, Arcade & Bumper Cars, Kids
  Club, Skating, Seafood Restaurant, ATV Area
- `src/components/ZoneGreen.jsx` — Concert Area, Wall Climbing & Rope Course,
  Padel, 5-a-side Football, Archery & Shooting Range
- `src/components/ZoneWaterfront.jsx` — full Beach Club complex, lounges,
  jet skis, floatable obstacle course, jetty restaurant, cabanas
- `src/components/FnBMarketplace.jsx` — vendor slots, mostly marked
  "to confirm" — no vendors were named
- `src/components/SiteMap.jsx` — abstract three-zone diagram (signature
  visual element, drawn from the actual site plan's structure, not to scale)
- `src/components/LaunchCTA.jsx` — request-access form, live days-to-launch
  counter (Oct 1, 2026)

## Open items carried over from the brief

- **Brand name**: "The Cove at Landmark" is a placeholder — no official name
  was given. Update in `index.html` (title/meta) and `Navbar.jsx`.
- **Archery & Shooting Range**: included per your instruction, but has no
  location on the site plan provided. Currently grouped under The Green with
  a "to confirm" tag.
- **ATV Area and Skating**: on the site plan, inside the red boundary, but
  not on your original activity list — included in The Ring with a note
  flagging that they weren't part of the original brief.
- **F&B vendors**: only the seafood restaurant is named. Three vendor slots
  are placeholders.
- **Imagery**: all photography is stock (Unsplash), chosen for tonal fit,
  not licensed for production use as-is — swap for real photography/renders
  before launch, particularly for the flagship attraction.
- **Bungee jump**: mentioned in the brief text but not on the site plan or
  in the final activity list you confirmed — not included. Add to
  `ZoneGreen.jsx` if it should be there.
