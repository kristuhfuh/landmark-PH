import { Ticket, Package, BedDouble, UtensilsCrossed, Users, Cake, Waves } from 'lucide-react'

export const bookingTypes = {
  entry: {
    icon: Ticket,
    tag: 'Explore the grounds',
    title: 'Entry tickets',
    cta: 'Book entry tickets',
    lead: 'Choose adult, child or family entry and explore the Ring, the Green and the waterfront at your own pace.',
    image: '/hero.jpg',
    basePrice: 5000,
    unit: 'ticket',
    guestNoun: 'tickets',
    minGuests: 1,
    maxGuests: 20,
    catalogCategory: 'entry',
    options: [],
  },
  packages: {
    icon: Package,
    tag: 'A day, brought together',
    title: 'Packages',
    cta: 'Choose a package',
    lead: 'Bring together entry, activities and dining with a family day, birthday or corporate package.',
    image: '/Splash-Park-image-1.webp',
    basePrice: 35000,
    unit: 'package',
    guestNoun: 'guests',
    minGuests: 1,
    maxGuests: 40,
    packageFor: 4,
    catalogCategory: 'package',
    options: [],
  },
  walkthrough: {
    icon: Ticket,
    tag: 'The Flagship',
    title: 'Upside-Down Walkthrough',
    cta: 'Book walkthrough',
    lead: 'A 45-minute walkthrough of the inverted flagship, with every room, corridor and fixture turned on its head.',
    image: '/flagship-upside-down.png',
    basePrice: 8000,
    unit: 'person',
    guestNoun: 'guests',
    minGuests: 1,
    maxGuests: 12,
    timeSlots: ['10:30', '12:00', '14:30', '16:00', '17:30'],
    options: [
      { key: 'photo', label: 'Photo point pass', price: 1500 },
      { key: 'priority', label: 'Priority entry', price: 2500 },
      { key: 'guide', label: 'Private guide', price: 6000 },
    ],
  },
  table: {
    icon: UtensilsCrossed,
    tag: 'At the Table',
    title: 'Table booking',
    cta: 'Book a table',
    lead: 'Reserve a table at The Jetty in the Ring or on the waterfront deck. Kitchens run through the day.',
    image: '/d32f5702063e63708d194795bd491e05.jpg',
    basePrice: 0,
    unit: '',
    guestNoun: 'diners',
    minGuests: 1,
    maxGuests: 20,
    timeSlots: ['12:30', '13:30', '18:30', '19:30', '20:30', '21:30'],
    holdOnly: true,
    options: [
      { key: 'window', label: 'Window seating request', price: 0 },
      { key: 'birthday', label: 'Birthday setup and candle', price: 3500 },
      { key: 'wine', label: 'Sommelier pairing (per head)', price: 8000 },
    ],
  },
  rooms: {
    icon: BedDouble,
    tag: 'Where you stay',
    title: 'Rooms & stays',
    cta: 'Reserve a room',
    lead: 'Choose a suite, loft, studio or day-use cabana, each a short walk from the Ring, the Green or the shore.',
    image: '/pexels-petra-nesti-1766376-12161888.jpg',
    basePrice: 120000,
    unit: 'night',
    guestNoun: 'guests',
    minGuests: 1,
    maxGuests: 4,
    stay: true,
    options: [
      { key: 'breakfast', label: 'Breakfast at The Jetty', price: 12000 },
      { key: 'beach', label: 'Beach club access', price: 15000 },
      { key: 'transfer', label: 'Airport transfer', price: 25000 },
    ],
  },
  daypass: {
    icon: Waves,
    tag: 'The Waterfront',
    title: 'Beach Club day pass',
    cta: 'Book a day pass',
    lead: 'Full-day access to the beach club, both lounges and the adult pool, with sun-lounger and towel service included.',
    image: '/photo-1500815845799-7748ca339f27.avif',
    basePrice: 15000,
    unit: 'person',
    guestNoun: 'guests',
    minGuests: 1,
    maxGuests: 8,
    timeSlots: ['10:00', '12:00', '14:00'],
    options: [
      { key: 'cabana', label: 'Reserved cabana · half-day', price: 40000 },
      { key: 'welcome', label: 'Welcome drink round', price: 6000 },
      { key: 'lunch', label: 'Set lunch on the deck (per head)', price: 9500 },
    ],
  },
  group: {
    icon: Users,
    tag: 'Visit together',
    title: 'Group booking',
    cta: 'Book a group visit',
    lead: 'Plan a team or corporate day with grounds entry, two activities per guest and set lunch at The Jetty. For groups of 20 or more.',
    image: '/concert live 2.jpg',
    basePrice: 8500,
    unit: 'guest',
    guestNoun: 'guests',
    minGuests: 20,
    maxGuests: 200,
    step: 5,
    timeSlots: ['09:30', '11:00', '14:00'],
    options: [
      { key: 'host', label: 'Dedicated host on the day', price: 25000 },
      { key: 'branding', label: 'On-site branding', price: 45000 },
      { key: 'transport', label: 'Coach transfer round-trip', price: 90000 },
    ],
  },
  birthday: {
    icon: Cake,
    tag: 'Celebrate together',
    title: 'Birthday & private events',
    cta: 'Plan an event',
    lead: 'A full day out with entry, three attractions per guest, the kids club party room for three hours, and cake.',
    image: '/Splash-Park-image-1.webp',
    basePrice: 120000,
    unit: 'package',
    guestNoun: 'guests',
    minGuests: 8,
    maxGuests: 40,
    packageFor: 10,
    timeSlots: ['11:00', '13:30', '16:00'],
    options: [
      { key: 'photographer', label: 'On-site photographer · 2 hours', price: 60000 },
      { key: 'decor', label: 'Themed room decor', price: 35000 },
      { key: 'catering', label: 'Extended catering (per head above 10)', price: 4500 },
    ],
  },
  other: {
    icon: Users,
    tag: 'Make it your own',
    title: 'Custom enquiry',
    cta: 'Plan a visit',
    lead: 'Tell us about your wedding, private takeover, film shoot or brand activation. A host will help you plan the details.',
    image: '/hero.jpg',
    basePrice: 0,
    unit: '',
    guestNoun: 'guests',
    minGuests: 2,
    maxGuests: 500,
    holdOnly: true,
    options: [
      { key: 'takeover', label: 'Full-grounds takeover', price: 0 },
      { key: 'catering', label: 'Custom catering', price: 0 },
      { key: 'production', label: 'Production and AV support', price: 0 },
    ],
  },
}

export const NAIRA = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 })
export const bookingAliases = { package: 'packages', 'entry-ticket': 'entry', 'group-booking': 'group' }
export const slugify = name => String(name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export function productCapacity(product) {
  const known = { 'entry-family': 4, 'package-family-day': 4, 'package-birthday': 10 }
  const entries = product?.includes?.find(line => /^\d+ grounds entr/i.test(line))
  return Math.max(1, Number(product?.guestsIncluded) || known[product?.id] || parseInt(entries, 10) || 1)
}

export function resolveBooking(base, product, room) {
  if (product) {
    const perGuest = product.priceUnit === 'guest'
    return {
      ...base,
      basePrice: Number(product.priceNGN),
      unit: product.priceUnit || base.unit,
      packageFor: product.category === 'package' && !perGuest ? productCapacity(product) : undefined,
      minGuests: perGuest ? 20 : 1,
      maxGuests: perGuest ? 200 : base.maxGuests,
    }
  }
  if (room) {
    const price = String(room.priceFrom || '').match(/([\d,.]+)\s*(k|m)?/i)
    const amount = price ? Number(price[1].replaceAll(',', '')) * (price[2]?.toLowerCase() === 'k' ? 1000 : price[2]?.toLowerCase() === 'm' ? 1000000 : 1) : base.basePrice
    const dayUse = /day-use/i.test(room.tag || '') || /\/\s*day/i.test(room.priceFrom || '')
    return { ...base, basePrice: amount, stay: !dayUse, priceMode: 'booking', unit: dayUse ? 'day' : 'night', maxGuests: parseInt(room.guests, 10) || base.maxGuests }
  }
  return base
}

export function bookingTotal(config, { guests, nights = 1, addOns = [] }) {
  if (config.holdOnly) return 0
  const units = config.stay ? nights : config.priceMode === 'booking' ? 1 : config.packageFor ? Math.ceil(guests / config.packageFor) : guests
  return config.basePrice * units + addOns.reduce((sum, key) => {
    const option = config.options.find(item => item.key === key)
    if (!option) return sum
    const above = option.label.match(/per head above (\d+)/i)
    const count = above ? Math.max(0, guests - Number(above[1])) : /per head/i.test(option.label) ? guests : 1
    return sum + option.price * count
  }, 0)
}

export function todayInLagos() {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Lagos', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date())
  return ['year', 'month', 'day'].map(type => parts.find(part => part.type === type).value).join('-')
}

export function followingDay(date) {
  const value = new Date(`${date}T00:00:00Z`)
  value.setUTCDate(value.getUTCDate() + 1)
  return value.toISOString().slice(0, 10)
}
