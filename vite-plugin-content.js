import fs from 'node:fs/promises'
import path from 'node:path'

/**
 * Dev-only Vite plugin that lets the /admin dashboard POST to /api/save-content
 * and have the payload written to src/content.json on disk. Vite's HMR then
 * reloads the JSON module and the live site re-renders with the new content.
 *
 * The endpoint only mounts during `vite dev` — production builds ignore it.
 */
export default function contentSavePlugin({ filePath }) {
  return {
    name: 'landmark-content-save',
    apply: 'serve',
    configureServer(server) {
      const abs = path.resolve(filePath)

      server.middlewares.use('/api/save-content', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end('Method Not Allowed')
          return
        }

        try {
          const chunks = []
          for await (const chunk of req) chunks.push(chunk)
          const body = Buffer.concat(chunks).toString('utf8')

          // Validate JSON before writing so we don't corrupt the file.
          const parsed = JSON.parse(body)

          await fs.writeFile(abs, JSON.stringify(parsed, null, 2) + '\n', 'utf8')

          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ ok: true }))
        } catch (err) {
          res.statusCode = 400
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ ok: false, error: err.message }))
        }
      })
    },
  }
}
