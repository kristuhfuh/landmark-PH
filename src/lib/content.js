import { useSyncExternalStore } from 'react'
import staticContent from '../content.json'

/**
 * Client-side content store.
 *
 * On first mount we ask the API (`VITE_API_URL` — defaults to `http://localhost:4000`)
 * for the assembled content shape. Until the response lands (or if the API
 * is unreachable) we serve the imported `content.json` so the site stays
 * usable without a running backend.
 *
 * Once the API responds we broadcast to every subscribed `useContent`
 * caller and re-render.
 */

const API_BASE = (import.meta.env?.VITE_API_URL || 'http://localhost:4000').replace(/\/+$/, '')

let current = staticContent
const listeners = new Set()

function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}
function getSnapshot() {
  return current
}

async function hydrate() {
  try {
    const res = await fetch(`${API_BASE}/api/content`, { credentials: 'omit' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const remote = await res.json()
    // Shallow merge with the static baseline so sections the API doesn't
    // return yet (e.g. brand-new keys during dev) still resolve.
    current = { ...staticContent, ...remote }
    listeners.forEach((fn) => fn())
  } catch (err) {
    if (import.meta.env?.DEV) {
      console.warn('[content] using local content.json —', err.message)
    }
  }
}

// Kick off exactly once per page load.
if (typeof window !== 'undefined' && !window.__landmarkContentHydrated) {
  window.__landmarkContentHydrated = true
  hydrate()
}

/** Read a top-level section from the live content store. */
export function useContent(key) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  return snapshot[key] || {}
}

export function useAllContent() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

export default current
