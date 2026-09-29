/**
 * Vercel serverless entry.
 *
 * Vercel's Node runtime natively handles an exported Express app —
 * no serverless-http wrapper needed. `vercel.json` rewrites every
 * /api/* request into this file; Express does its own routing.
 */
import { createApp } from '../server/src/app.js'

const app = createApp()
export default app
