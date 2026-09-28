import { Router } from 'express'
import { query } from '../db.js'
import { requireAdmin } from '../auth.js'
import { SETTING_SECTIONS } from '../collections.js'

const router = Router()
router.use(requireAdmin)

router.get('/', async (_req, res) => {
  const rows = await query(
    'SELECT section, value, updated_at FROM settings ORDER BY section ASC'
  )
  res.json({
    sections: SETTING_SECTIONS,
    values: Object.fromEntries(
      rows.map((r) => [
        r.section,
        typeof r.value === 'string' ? JSON.parse(r.value) : r.value,
      ])
    ),
  })
})

router.get('/:section', async (req, res) => {
  const [row] = await query(
    'SELECT value FROM settings WHERE section = ? LIMIT 1',
    [req.params.section]
  )
  if (!row) return res.json({ value: {} })
  res.json({
    value: typeof row.value === 'string' ? JSON.parse(row.value) : row.value,
  })
})

router.put('/:section', async (req, res) => {
  if (!SETTING_SECTIONS.includes(req.params.section)) {
    return res.status(400).json({ error: 'Unknown section' })
  }
  const value = req.body?.value
  if (value === undefined) {
    return res.status(400).json({ error: 'Missing value' })
  }
  await query(
    `INSERT INTO settings (section, value) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE value = VALUES(value)`,
    [req.params.section, JSON.stringify(value)]
  )
  res.json({ ok: true })
})

export default router
