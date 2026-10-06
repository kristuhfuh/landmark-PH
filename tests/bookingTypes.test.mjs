import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { bookingTypes, resolveBooking, bookingTotal, productCapacity, followingDay } from '../src/lib/bookingTypes.js'

const content = JSON.parse(readFileSync(new URL('../src/content.json', import.meta.url), 'utf8'))
const product = id => content.tickets.items.find(item => item.id === id)

test('entry tickets use the selected catalogue price and family capacity', () => {
  for (const [id, quantity, expected] of [['entry-adult', 2, 10000], ['entry-child', 3, 9000], ['entry-family', 2, 30000]]) {
    const config = resolveBooking(bookingTypes.entry, product(id))
    assert.equal(bookingTotal(config, { guests: quantity }), expected)
  }
  assert.equal(productCapacity(product('entry-family')), 4)
})

test('packages cover the entire party and round up at capacity boundaries', () => {
  const family = resolveBooking(bookingTypes.packages, product('package-family-day'))
  for (const [guests, expected] of [[1, 35000], [4, 35000], [5, 70000], [8, 70000], [9, 105000]]) {
    assert.equal(bookingTotal(family, { guests }), expected)
  }
  const birthday = resolveBooking(bookingTypes.packages, product('package-birthday'))
  assert.equal(bookingTotal(birthday, { guests: 10 }), 120000)
  assert.equal(bookingTotal(birthday, { guests: 11 }), 240000)
})

test('corporate packages charge per guest and retain the minimum group size', () => {
  const corporate = resolveBooking(bookingTypes.packages, product('package-corporate'))
  assert.equal(corporate.minGuests, 20)
  assert.equal(corporate.packageFor, undefined)
  assert.equal(bookingTotal(corporate, { guests: 21 }), 178500)
})

test('group extras add a fixed price to the per-guest total', () => {
  assert.equal(bookingTotal(bookingTypes.group, { guests: 25, addOns: ['host'] }), 237500)
  assert.equal(bookingTotal(bookingTypes.daypass, { guests: 3, addOns: ['lunch'] }), 73500)
})

test('stays use the selected room rate and number of nights; cabanas charge per day', () => {
  const suite = resolveBooking(bookingTypes.rooms, null, content.rooms.items.find(room => room.name === 'Waterfront Suite'))
  assert.equal(bookingTotal(suite, { guests: 2, nights: 3 }), 630000)
  const cabana = resolveBooking(bookingTypes.rooms, null, content.rooms.items.find(room => room.name === 'Beach Cabana'))
  assert.equal(cabana.stay, false)
  assert.equal(bookingTotal(cabana, { guests: 4 }), 85000)
})

test('checkout minimum advances correctly across month and year boundaries', () => {
  assert.equal(followingDay('2026-12-31'), '2027-01-01')
  assert.equal(followingDay('2028-02-28'), '2028-02-29')
})
