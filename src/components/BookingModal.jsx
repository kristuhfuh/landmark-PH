/**
 * Legacy compatibility shim.
 *
 * The site used to open a right-side booking drawer via
 * `openBookingModal(intent)`. Bookings now live on real pages under
 * `/bookings/:type`, so this helper navigates there instead of dispatching a
 * modal-open event.
 *
 * Kept as a re-export so existing call sites (Navbar, LaunchCTA, zone
 * sections, About/Things To Do/Bookings) don't all need to change to import
 * `useNavigate` and pass through router context — a single full-page nav is a
 * fine cost for what was previously a modal open.
 *
 * The default export is a no-op component; existing `<BookingModal />` mounts
 * can be removed at leisure without breaking imports.
 */

const KNOWN_TYPES = new Set([
  'entry',
  'packages',
  'walkthrough',
  'table',
  'rooms',
  'daypass',
  'group',
  'birthday',
  'membership',
  'other',
])

const ALIASES = {
  package: 'packages',
  'entry-ticket': 'entry',
  'group-booking': 'group',
  membership: 'other',
  stay: 'rooms',
  dining: 'table',
  restaurant: 'table',
  beach: 'daypass',
}

export default function BookingModal() {
  return null
}

export function openBookingModal(intent) {
  const key = ALIASES[intent] || intent
  const target = key && KNOWN_TYPES.has(key) ? `/bookings/${key}` : '/bookings'
  if (typeof window !== 'undefined') {
    window.location.assign(target)
  }
}
