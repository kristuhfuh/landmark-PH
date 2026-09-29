import mysql from 'mysql2/promise'
// Env vars are loaded by the entry file — `server/src/index.js` calls
// `import 'dotenv/config'`, and Vercel injects them into process.env
// automatically. Keeping dotenv out of this file avoids a slow/failing
// import in the serverless bundle.

/**
 * Shared MySQL connection pool.
 *
 * `DB_SSL=true` turns on TLS with certificate validation disabled — matches
 * AWS RDS' default self-signed CA behaviour without needing to ship the RDS
 * root cert. For hardened deployments, download `rds-combined-ca-bundle.pem`
 * and pass it via `ssl: { ca: fs.readFileSync(...) }` instead.
 */
const sslEnabled = String(process.env.DB_SSL).toLowerCase() === 'true'

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
  ...(sslEnabled ? { ssl: { rejectUnauthorized: false } } : {}),
})

export async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params)
  return rows
}
