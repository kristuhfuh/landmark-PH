# CTA Lexicon

One label per intent, used everywhere. Don't invent new variants.

| Intent / booking type | Button label |
|---|---|
| Flagship walkthrough | **Book Walkthrough** |
| Table at a restaurant | **Book Table** |
| Hotel room / stay | **Reserve Room** |
| Beach Club day pass | **Book Day Pass** |
| Court time (padel, football, etc.) | **Book Court** |
| Group of 20+ / corporate day out | **Plan Group Visit** |
| Birthday / private event / wedding | **Plan Event** |
| Anything custom / everything else | **Plan a Visit** |
| Buy a ticket in the shop | **Add to Cart** |
| Checkout | **Pay & Confirm** |
| Advance to next step in flow | **Continue** |
| Hold-only enquiry (no card today) | **Request Quote** |
| Submit contact form | **Send message** |

## Rules

- **Verb + noun**. Never bare verbs ("Submit", "OK"), never bare nouns ("Booking").
- **Title Case** for buttons and nav. **Sentence case** for inline links.
- Match the label to the **actual** action. If a Beach Club section's CTA
  says "Book Walkthrough", that's a bug — it books a walkthrough, not a
  day pass. Pick the right label for the intent being delivered.
- The sidesheet / top-nav primary CTA stays **"Plan a Visit"** — it's a
  general catch-all that opens the booking index page.
- Don't drift. If you need something a lexicon label doesn't cover, add
  it here first, then use it.
