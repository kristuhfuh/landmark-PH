import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { signToken, verifyCredentials, requireAdmin, updatePassword } from './auth.js'
import contentRoutes from './routes/content.js'
import collectionsRoutes from './routes/collections.js'
import settingsRoutes from './routes/settings.js'
import bookingsRoutes from './routes/bookings.js'

const app = express()

app.use(
  cors({
    origin: (process.env.CORS_ORIGIN || '').split(',').map((s) => s.trim()),
    credentials: false,
  })
)
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_req, res) => res.json({ ok: true, ts: Date.now() }))

// --- Auth ---
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' })
  }
  const user = await verifyCredentials(email, password)
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })
  const token = signToken(user)
  res.json({ token, user })
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

app.post('/api/auth/password', requireAdmin, async (req, res) => {
  const { newPassword } = req.body || {}
  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 chars' })
  }
  await updatePassword(req.admin.sub, newPassword)
  res.json({ ok: true })
})

// --- Public site content ---
app.use('/api', contentRoutes)

// --- Bookings (public POST, admin GET/PATCH/DELETE) ---
app.use('/api/bookings', bookingsRoutes)

// --- Admin CRUD ---
app.use('/api/admin/collections', collectionsRoutes)
app.use('/api/admin/settings', settingsRoutes)

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: err.message || 'Server error' })
})

const port = Number(process.env.PORT) || 4000
app.listen(port, () => {
  console.log(`[landmark-api] listening on :${port}`)
})
