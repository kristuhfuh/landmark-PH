/**
 * Vercel serverless entry.
 *
 * `vercel.json` rewrites every /api/* request into this single Function.
 * Express then does its own routing.
 */
import serverless from 'serverless-http'
import { createApp } from '../server/src/app.js'

const app = createApp()
const handler = serverless(app)

export default function (req, res) {
  return handler(req, res)
}
