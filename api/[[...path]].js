/**
 * Vercel serverless entry.
 *
 * `api/[[...path]].js` is a catch-all Function — every request to
 * `/api/*` hits this file, and Express does its own routing from there.
 *
 * `dotenv` isn't imported here on purpose: Vercel injects env vars
 * (DB_HOST, JWT_SECRET, etc.) directly into `process.env` at runtime.
 */
import serverless from 'serverless-http'
import { createApp } from '../server/src/app.js'

const app = createApp()

// Cache the wrapped handler across warm invocations so we don't rebuild
// the Express app on every request.
let handler
export default function (req, res) {
  if (!handler) handler = serverless(app)
  return handler(req, res)
}
