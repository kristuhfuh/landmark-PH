import { Router } from 'express'
import { z } from 'zod'
import { query } from '../db.js'
import { requireAdmin } from '../auth.js'

const router = Router()

const CreateBooking = z.object({
  bookingType: z.string().min(1),
  firstName: z.string().max(120).optional(),
  lastName: z.string().max(120).optional(),
  email: z.string().email(),
  phone: z.string().max(60).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  timeSlot: z.string().max(20).optional(),
  guests: z.number().int().positive().max(1000).default(1),
  addOns: z.array(z.string()).optional().default([]),
  totalNGN: z.number().int().min(0).default(0),
  notes: z.string().optional(),
  status: z.enum(['pending', 'confirmed', 'hold', 'cancelled']).default('pending'),
})

/** Public — the /bookings/:type flow posts here. */
router.post('/', async (req, res) => {
  const parsed = CreateBooking.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() })
  }
  const b = parsed.data
  const reference = `LMK-${Math.random().toString(36).slice(2, 7).toUpperCase()}${Date.now().toString().slice(-4)}`
  await query(
    `INSERT INTO bookings
      (reference, booking_type, first_name, last_name, email, phone,
       date_from, date_to, time_slot, guests, add_ons, total_ngn, status, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      reference,
      b.bookingType,
      b.firstName || null,
      b.lastName || null,
      b.email,
      b.phone || null,
      b.dateFrom || null,
      b.dateTo || null,
      b.timeSlot || null,
      b.guests,
      JSON.stringify(b.addOns || []),
      b.totalNGN,
      b.status,
      b.notes || null,
    ]
  )
  res.status(201).json({ reference })
})

/** Admin — list all bookings, most recent first. */
router.get('/', requireAdmin, async (req, res) => {
  const status = req.query.status
  const params = []
  let where = ''
  if (status) {
    where = 'WHERE status = ?'
    params.push(status)
  }
  const rows = await query(
    `SELECT * FROM bookings ${where} ORDER BY created_at DESC LIMIT 500`,
    params
  )
  res.json({
    bookings: rows.map((r) => ({
      id: r.id,
      reference: r.reference,
      bookingType: r.booking_type,
      firstName: r.first_name,
      lastName: r.last_name,
      email: r.email,
      phone: r.phone,
      dateFrom: r.date_from,
      dateTo: r.date_to,
      timeSlot: r.time_slot,
      guests: r.guests,
      addOns: typeof r.add_ons === 'string' ? JSON.parse(r.add_ons) : r.add_ons,
      totalNGN: r.total_ngn,
      status: r.status,
      notes: r.notes,
      createdAt: r.created_at,
    })),
  })
})

router.patch('/:id', requireAdmin, async (req, res) => {
  const status = req.body?.status
  if (!['pending', 'confirmed', 'hold', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' })
  }
  await query('UPDATE bookings SET status = ? WHERE id = ?', [
    status,
    req.params.id,
  ])
  res.json({ ok: true })
})

router.delete('/:id', requireAdmin, async (req, res) => {
  await query('DELETE FROM bookings WHERE id = ?', [req.params.id])
  res.json({ ok: true })
})

export default router
