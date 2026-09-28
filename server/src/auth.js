import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { query } from './db.js'

const SECRET = process.env.JWT_SECRET
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '12h'

if (!SECRET) {
  console.warn('[auth] JWT_SECRET is not set — tokens will not verify.')
}

export function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, name: user.name },
    SECRET,
    { expiresIn: EXPIRES_IN }
  )
}

/** Express middleware — 401s any request without a valid Bearer token. */
export function requireAdmin(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Missing token' })
  try {
    req.admin = jwt.verify(token, SECRET)
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export async function verifyCredentials(email, password) {
  const rows = await query(
    'SELECT id, email, name, password_hash FROM admin_users WHERE email = ? LIMIT 1',
    [email]
  )
  const user = rows[0]
  if (!user) return null
  const ok = await bcrypt.compare(password, user.password_hash)
  if (!ok) return null
  return { id: user.id, email: user.email, name: user.name }
}

export async function updatePassword(userId, newPassword) {
  const hash = await bcrypt.hash(newPassword, 12)
  await query('UPDATE admin_users SET password_hash = ? WHERE id = ?', [
    hash,
    userId,
  ])
}
