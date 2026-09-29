import express from 'express'
import cors from 'cors'
import { signToken, verifyCredentials, requireAdmin, updatePassword } from './auth.js'
import contentRoutes from './routes/content.js'
import collectionsRoutes from './routes/collections.js'
import settingsRoutes from './routes/settings.js'
import bookingsRoutes from './routes/bookings.js'

/**
 * Build the Express app.
 *
 * Kept separate from `index.js` so the same app can be served by:
 *   - `server/src/index.js` (long-lived Node process, local dev, container)
 *   - Vercel serverless function (`api/[[...path]].js` via `serverless-http`)
 */
export function createApp() {
  const app = express()

  app.use(
    cors({
      origin: parseOrigins(process.env.CORS_ORIGIN),
      credentials: false,
    })
  )
  app.use(express.json({ limit: '1mb' }))

  app.get('/api/health', (_req, res) => res.json({ ok: true, ts: Date.now() }))

  // --- Auth ---
  // Express 4 doesn't forward async rejections to error middleware, so
  // every async route wraps its body in try/catch → next(err).
  app.post('/api/auth/login', async (req, res, next) => {
    try {
      const { email, password } = req.body || {}
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' })
      }
      const user = await verifyCredentials(email, password)
      if (!user) return res.status(401).json({ error: 'Invalid credentials' })
      const token = signToken(user)
      res.json({ token, user })
    } catch (err) { next(err) }
  })

  app.get('/api/auth/me', requireAdmin, (req, res) => {
    res.json({
      user: {
        id: req.admin.sub,
        email: req.admin.email,
        name: req.admin.name,
      },
    })
  })

  app.post('/api/auth/password', requireAdmin, async (req, res, next) => {
    try {
      const { newPassword } = req.body || {}
      if (!newPassword || newPassword.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 chars' })
      }
      await updatePassword(req.admin.sub, newPassword)
      res.json({ ok: true })
    } catch (err) { next(err) }
  })

  app.use('/api', contentRoutes)
  app.use('/api/bookings', bookingsRoutes)
  app.use('/api/admin/collections', collectionsRoutes)
  app.use('/api/admin/settings', settingsRoutes)

  app.use((err, _req, res, _next) => {
    console.error(err)
    res.status(500).json({ error: err.message || 'Server error' })
  })

  return app
}

/**
 * `*` (or unset) → allow any origin. Comma-separated list → allow those exact
 * origins. Vercel's rewrite means the API is same-origin in production, so
 * CORS is mostly a dev-mode concern.
 */
function parseOrigins(raw) {
  if (!raw || raw.trim() === '*') return true
  return raw.split(',').map((s) => s.trim()).filter(Boolean)
}
