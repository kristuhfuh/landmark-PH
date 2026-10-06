// Only surface useful public statuses in the dining lineup.
export function vendorStatus(vendor) {
  const status = (vendor.status || '').trim()
  if (/^confirmed$/i.test(status)) return 'Confirmed'
  if (/^slot open$/i.test(status)) return 'Slot open'
  if (vendor.kind === 'Anchor' || /confirm(ed)?$/i.test(vendor.kind || '')) return 'Confirmed'
  if (/to confirm|reserved|open|tba|tbd/i.test(vendor.name || '') || !vendor.name) return 'Slot open'
  return null
}
