/**
 * Vercel serverless entry.
 *
 * `vercel.json` rewrites every /api/* request into this single Function.
 * Express then does its own routing.
 *
 * We deliberately do NOT `import 'dotenv/config'` here — on Vercel, env vars
 * arrive via `process.env` directly, and dotenv looking for a non-existent
 * .env file can slow cold-starts or error under bundling.
 */
import serverless from 'serverless-http'
import { createApp } from '../server/src/app.js'

const app = createApp()
const handler = serverless(app)

export default async function (req, res) {
  return handler(req, res)
}

export const config = {
  runtime: 'nodejs',
}
