import content from '../content.json'

/**
 * Read a top-level section from src/content.json.
 * Kept as a hook-shaped function so component call-sites don't have to change
 * when the underlying storage does.
 */
export function useContent(key) {
  return content[key] || {}
}

export default content
