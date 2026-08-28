import { useMemo, useState, useEffect } from 'react'
import initialContent from '../content.json'
import {
  Home,
  BookOpen,
  Rocket,
  Circle,
  Leaf,
  Sun,
  UtensilsCrossed,
  Map,
  Users,
  Settings,
  Save,
  ExternalLink,
  Plus,
  Trash2,
  RotateCcw,
  Type,
  Compass,
  BedDouble,
  Waves,
} from 'lucide-react'

const SECTIONS = [
  { key: 'siteSettings', label: 'Site Settings', icon: Settings },
  { key: 'hero', label: 'Hero', icon: Home },
  { key: 'intro', label: 'Concept', icon: BookOpen },
  { key: 'flagship', label: 'Flagship', icon: Rocket },
  { key: 'ring', label: 'The Ring', icon: Circle },
  { key: 'green', label: 'The Green', icon: Leaf },
  { key: 'waterfront', label: 'The Waterfront', icon: Sun },
  { key: 'fnbMarketplace', label: 'F&B Marketplace', icon: UtensilsCrossed },
  { key: 'overlap', label: 'Editorial Heading', icon: Type },
  { key: 'panorama', label: 'Horizontal Panorama', icon: Compass },
  { key: 'rooms', label: 'Rooms & Stays', icon: BedDouble },
  { key: 'reveal', label: 'Semicircle Reveal', icon: Waves },
  { key: 'siteMap', label: 'Site Map', icon: Map },
  { key: 'visit', label: 'Plan a Visit', icon: Users },
]

// Field labels — shown next to inputs. Anything not here falls back to the raw key.
const LABELS = {
  brand: 'Brand name',
  brandSuffix: 'Brand suffix',
  ctaLabel: 'Nav CTA label',
  navLinks: 'Nav links',
  palette: 'Color palette',
  contact: 'Contact info',
  addressLines: 'Address',
  hoursLines: 'Hours',
  phone: 'Phone',
  email: 'Email',
  eyebrow: 'Eyebrow',
  headingLine1: 'Heading line 1',
  headingLine2: 'Heading line 2 (italic)',
  ctaHref: 'CTA link',
  backgroundImage: 'Background image (URL or /path.jpg)',
  headingText: 'Heading text',
  headingItalic: 'Italic tail',
  pillars: 'Pillars',
  heading: 'Heading',
  body: 'Body copy',
  note: 'Small note',
  overlayColor: 'Overlay color',
  zoneLabel: 'Zone label',
  title: 'Title',
  intro: 'Intro paragraph',
  items: 'Items',
  heroImageUrl: 'Hero image URL',
  features: 'Feature bullets',
  callout: 'Callout / quote',
  gallery: 'Gallery items',
  vendors: 'Vendors',
  caption: 'Caption',
  formSubmitLabel: 'Submit button label',
  formSuccessTitle: 'Success title',
  formSuccessBody: 'Success message',
  imageUrl: 'Image URL',
  area: 'Area label',
  icon: 'Icon (lucide name)',
  name: 'Name',
  kind: 'Kind',
  label: 'Label',
  href: 'Link',
  tag: 'Tag',
  marine: 'Marine',
  marineDark: 'Marine dark',
  marineLight: 'Marine light',
  orange: 'Orange',
  orangeLight: 'Orange light',
  orangeDark: 'Orange dark',
  sand: 'Sand',
  ink: 'Ink',
  imageAlt: 'Image alt text',
  topLine: 'Top line (upright)',
  bottomLine: 'Bottom line (italic)',
  align: 'Photo alignment (left/right)',
  chapters: 'Chapters',
  callouts: 'Callouts',
  italic: 'Italic tail',
  size: 'Room size',
  guests: 'Guest capacity',
  priceFrom: 'Price from',
  rooms: 'Rooms',
  subheading: 'Subheading',
  stats: 'Stats',
  indexNumber: 'Editorial index number',
  value: 'Value',
  heroImage: 'Hero image (URL)',
  asideImage: 'Aside image (URL)',
  dayPassLabel: 'Day-pass CTA label',
  watermark: 'Hero watermark word',
  badge: 'Live badge label',
  responseTime: 'Response-time note',
  nodes: 'Site-map nodes',
  walk: 'Walking time',
  signature: 'Headline attraction',
}

const label = (key) => LABELS[key] || key
const isColor = (key, value) => /^#[0-9a-f]{3,8}$/i.test(String(value ?? '').trim())
const isLong = (key) => ['body', 'intro', 'headingText', 'callout', 'formSuccessBody', 'subheading', 'caption'].includes(key)

function setDeep(obj, path, value) {
  const next = Array.isArray(obj) ? [...obj] : { ...obj }
  let cur = next
  for (let i = 0; i < path.length - 1; i++) {
    const k = path[i]
    cur[k] = Array.isArray(cur[k]) ? [...cur[k]] : { ...cur[k] }
    cur = cur[k]
  }
  cur[path[path.length - 1]] = value
  return next
}

function removeDeep(obj, path) {
  const next = Array.isArray(obj) ? [...obj] : { ...obj }
  let cur = next
  for (let i = 0; i < path.length - 1; i++) {
    const k = path[i]
    cur[k] = Array.isArray(cur[k]) ? [...cur[k]] : { ...cur[k] }
    cur = cur[k]
  }
  const lastKey = path[path.length - 1]
  if (Array.isArray(cur)) cur.splice(lastKey, 1)
  else delete cur[lastKey]
  return next
}

function TextField({ path, value, onChange, longText }) {
  const [local, setLocal] = useState(value ?? '')
  useEffect(() => setLocal(value ?? ''), [value])

  const commit = () => onChange(path, local)

  const key = path[path.length - 1]
  if (isColor(key, value)) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value || '#000000'}
          onChange={(e) => onChange(path, e.target.value)}
          className="h-9 w-9 rounded bg-transparent border border-white/20 cursor-pointer"
        />
        <input
          type="text"
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          onBlur={commit}
          className="flex-1 bg-black/30 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-[#FFA24D] outline-none"
        />
      </div>
    )
  }

  if (longText) {
    return (
      <textarea
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        onBlur={commit}
        rows={4}
        className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-[#FFA24D] outline-none resize-y"
      />
    )
  }

  return (
    <input
      type="text"
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      onBlur={commit}
      className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-[#FFA24D] outline-none"
    />
  )
}

function StringArrayField({ path, values, onChange }) {
  const arr = values || []
  return (
    <div className="space-y-2">
      {arr.map((v, i) => (
        <div key={i} className="flex items-center gap-2">
          <TextField path={[...path, i]} value={v} onChange={onChange} />
          <button
            type="button"
            onClick={() => onChange(path, arr.filter((_, j) => j !== i))}
            className="text-white/40 hover:text-red-400 p-1"
            aria-label="Remove"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange(path, [...arr, ''])}
        className="flex items-center gap-2 text-xs text-[#FFA24D] hover:text-white"
      >
        <Plus size={14} /> Add
      </button>
    </div>
  )
}

function ObjectArrayField({ path, items, onChange, template }) {
  const arr = items || []
  return (
    <div className="space-y-4">
      {arr.map((item, i) => (
        <div key={i} className="border border-white/10 rounded p-4 bg-black/20 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-white/40 tracking-widest uppercase">
              Item {i + 1}
            </span>
            <button
              type="button"
              onClick={() => onChange(path, arr.filter((_, j) => j !== i))}
              className="text-white/40 hover:text-red-400"
              aria-label="Remove item"
            >
              <Trash2 size={14} />
            </button>
          </div>
          {Object.keys(item).map((key) => (
            <FieldRow
              key={key}
              path={[...path, i, key]}
              fieldKey={key}
              value={item[key]}
              onChange={onChange}
            />
          ))}
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          onChange(path, [...arr, JSON.parse(JSON.stringify(template))])
        }
        className="flex items-center gap-2 text-xs text-[#FFA24D] hover:text-white"
      >
        <Plus size={14} /> Add item
      </button>
    </div>
  )
}

function FieldRow({ path, fieldKey, value, onChange }) {
  const isObj =
    value && typeof value === 'object' && !Array.isArray(value)
  const isArr = Array.isArray(value)
  const arrType =
    isArr && value.length > 0
      ? typeof value[0] === 'string'
        ? 'string'
        : 'object'
      : isArr
      ? 'string'
      : null

  return (
    <div>
      <label className="block text-[11px] text-[#FFA24D] tracking-widest uppercase mb-1.5">
        {label(fieldKey)}
      </label>

      {isObj && (
        <div className="pl-4 border-l border-white/10 space-y-3">
          {Object.keys(value).map((k) => (
            <FieldRow
              key={k}
              path={[...path, k]}
              fieldKey={k}
              value={value[k]}
              onChange={onChange}
            />
          ))}
        </div>
      )}

      {isArr && arrType === 'string' && (
        <StringArrayField path={path} values={value} onChange={onChange} />
      )}

      {isArr && arrType === 'object' && (
        <ObjectArrayField
          path={path}
          items={value}
          onChange={onChange}
          template={value[0] ? Object.fromEntries(Object.keys(value[0]).map((k) => [k, ''])) : {}}
        />
      )}

      {!isObj && !isArr && (
        <TextField
          path={path}
          value={value}
          onChange={onChange}
          longText={isLong(fieldKey)}
        />
      )}
    </div>
  )
}

export default function AdminPage() {
  const [content, setContent] = useState(initialContent)
  const [activeKey, setActiveKey] = useState('siteSettings')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState(null)
  const [dirty, setDirty] = useState(false)

  const active = SECTIONS.find((s) => s.key === activeKey)
  const sectionData = content[activeKey] || {}

  const setField = (path, value) => {
    setContent((c) => setDeep(c, [activeKey, ...path], value))
    setDirty(true)
    setSaveMsg(null)
  }

  const save = async () => {
    setSaving(true)
    setSaveMsg(null)
    try {
      const res = await fetch('/api/save-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content, null, 2),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || `HTTP ${res.status}`)
      setSaveMsg({ kind: 'ok', text: 'Saved to src/content.json. Site will hot-reload.' })
      setDirty(false)
    } catch (err) {
      setSaveMsg({ kind: 'err', text: `Save failed: ${err.message}` })
    } finally {
      setSaving(false)
    }
  }

  const revert = () => {
    setContent(initialContent)
    setDirty(false)
    setSaveMsg(null)
  }

  const fields = useMemo(() => Object.keys(sectionData), [activeKey, sectionData])

  return (
    <div className="min-h-screen bg-[#0b0e08] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-black/40 border-r border-white/10 flex flex-col">
        <div className="px-5 py-6 border-b border-white/10">
          <p className="text-[10px] text-white/40 tracking-widest uppercase mb-1">
            Landmark
          </p>
          <p className="font-display text-lg">Content Studio</p>
        </div>
        <nav className="flex-1 py-3 overflow-y-auto">
          {SECTIONS.map((s) => {
            const Icon = s.icon
            const isActive = s.key === activeKey
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setActiveKey(s.key)}
                className={`w-full flex items-center gap-3 px-5 py-3 text-sm text-left transition-colors ${
                  isActive
                    ? 'bg-[#F47C0B]/10 text-[#FFA24D] border-l-2 border-[#F47C0B]'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={16} strokeWidth={1.5} />
                {s.label}
              </button>
            )
          })}
        </nav>
        <div className="p-5 border-t border-white/10">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-xs text-white/60 hover:text-[#FFA24D]"
          >
            <ExternalLink size={13} /> View live site
          </a>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="border-b border-white/10 px-8 py-5 flex items-center justify-between bg-black/20 sticky top-0 z-10">
          <div>
            <p className="text-[11px] text-white/40 tracking-widest uppercase">
              Editing
            </p>
            <h1 className="font-display text-2xl">{active?.label}</h1>
          </div>
          <div className="flex items-center gap-3">
            {saveMsg && (
              <span
                className={`text-xs ${
                  saveMsg.kind === 'ok' ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {saveMsg.text}
              </span>
            )}
            {dirty && (
              <button
                type="button"
                onClick={revert}
                className="flex items-center gap-2 px-3 py-2 text-xs text-white/70 hover:text-white border border-white/10 rounded"
              >
                <RotateCcw size={13} /> Discard
              </button>
            )}
            <button
              type="button"
              onClick={save}
              disabled={!dirty || saving}
              className="flex items-center gap-2 px-5 py-2 bg-[#F47C0B] text-black font-medium text-sm rounded hover:bg-[#FFA24D] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Save size={14} />
              {saving ? 'Saving…' : dirty ? 'Save changes' : 'Saved'}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-3xl space-y-6">
            {fields.map((key) => (
              <FieldRow
                key={key}
                path={[key]}
                fieldKey={key}
                value={sectionData[key]}
                onChange={setField}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
