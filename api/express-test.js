/**
 * Isolation test: Express + serverless-http, zero other dependencies.
 * If /api/express-test returns 200 but /api/health hangs, the problem
 * is inside my server/ imports (mysql2 or another module blocking on
 * cold-start). If this also hangs, serverless-http itself is broken
 * in this deploy.
 */
import express from 'express'
import serverless from 'serverless-http'

const app = express()
app.get('/api/express-test', (_req, res) => {
  res.json({ ok: true, from: 'express-test', node: process.version, env: {
    hasDbHost: Boolean(process.env.DB_HOST),
    hasJwt: Boolean(process.env.JWT_SECRET),
  }})
})
app.use((req, res) => res.status(404).json({ error: 'not found', url: req.url }))

const handler = serverless(app)
export default function (req, res) {
  return handler(req, res)
}
