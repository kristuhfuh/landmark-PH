import { Router } from 'express'
import { query } from '../db.js'
import { requireAdmin } from '../auth.js'
import {
  COLLECTIONS,
  toApiRow,
  toDbInsert,
  toDbUpdate,
} from '../collections.js'

const router = Router()

router.use(requireAdmin)

/** Metadata endpoint — powers the admin sidebar + form rendering. */
router.get('/', (req, res) => {
  const meta = Object.entries(COLLECTIONS).map(([key, c]) => ({
    key,
    label: c.label,
    fields: c.fields.map(({ api, type, required, unique }) => ({
      api,
      type,
      required: Boolean(required),
      unique: Boolean(unique),
    })),
    orderable: Boolean(c.orderable),
  }))
  res.json({ collections: meta })
})

router.get('/:key', async (req, res) => {
  const c = COLLECTIONS[req.params.key]
  if (!c) return res.status(404).json({ error: 'Unknown collection' })
  const rows = await query(
    `SELECT * FROM \`${c.table}\` ORDER BY sort_order ASC, id ASC`
  )
  res.json({ rows: rows.map((r) => toApiRow(c, r)) })
})

router.post('/:key', async (req, res) => {
  const c = COLLECTIONS[req.params.key]
  if (!c) return res.status(404).json({ error: 'Unknown collection' })
  const { cols, values } = toDbInsert(c, req.body || {})
  if (cols.length === 1) {
    return res.status(400).json({ error: 'No fields supplied' })
  }
  const placeholders = cols.map(() => '?').join(', ')
  const sql = `INSERT INTO \`${c.table}\` (${cols.map((c) => `\`${c}\``).join(', ')}) VALUES (${placeholders})`
  try {
    const result = await query(sql, values)
    const row = (
      await query(`SELECT * FROM \`${c.table}\` WHERE id = ?`, [result.insertId])
    )[0]
    res.status(201).json({ row: toApiRow(c, row) })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.put('/:key/:id', async (req, res) => {
  const c = COLLECTIONS[req.params.key]
  if (!c) return res.status(404).json({ error: 'Unknown collection' })
  const { sets, values } = toDbUpdate(c, req.body || {})
  if (!sets.length) return res.status(400).json({ error: 'No fields supplied' })
  values.push(req.params.id)
  try {
    await query(
      `UPDATE \`${c.table}\` SET ${sets.join(', ')} WHERE id = ?`,
      values
    )
    const row = (
      await query(`SELECT * FROM \`${c.table}\` WHERE id = ?`, [req.params.id])
    )[0]
    if (!row) return res.status(404).json({ error: 'Not found' })
    res.json({ row: toApiRow(c, row) })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.delete('/:key/:id', async (req, res) => {
  const c = COLLECTIONS[req.params.key]
  if (!c) return res.status(404).json({ error: 'Unknown collection' })
  await query(`DELETE FROM \`${c.table}\` WHERE id = ?`, [req.params.id])
  res.json({ ok: true })
})

/** Bulk reorder — accepts `{ order: [id, id, id...] }`. */
router.post('/:key/reorder', async (req, res) => {
  const c = COLLECTIONS[req.params.key]
  if (!c) return res.status(404).json({ error: 'Unknown collection' })
  const order = Array.isArray(req.body?.order) ? req.body.order : []
  await Promise.all(
    order.map((id, i) =>
      query(`UPDATE \`${c.table}\` SET sort_order = ? WHERE id = ?`, [i, id])
    )
  )
  res.json({ ok: true })
})

export default router
