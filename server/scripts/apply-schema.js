import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import mysql from 'mysql2/promise'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql')

const sslEnabled = String(process.env.DB_SSL).toLowerCase() === 'true'

async function main() {
  const sql = fs.readFileSync(schemaPath, 'utf-8')
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true,
    ...(sslEnabled ? { ssl: { rejectUnauthorized: false } } : {}),
  })
  console.log('[schema] applying schema.sql...')
  await conn.query(sql)
  console.log('[schema] done.')
  await conn.end()
}

main().catch((err) => {
  console.error('[schema] failed:', err)
  process.exit(1)
})
