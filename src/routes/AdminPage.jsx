import { useEffect, useMemo, useState } from 'react'
import { LogOut, Plus, Save, Trash2, Loader2, KeyRound, Check, X } from 'lucide-react'
import { api, getToken, setToken } from '../lib/adminApi'

const CARD = 'bg-marine-dark/40 border border-sand/10 p-5'
const INPUT = 'w-full bg-transparent border-b border-sand/30 focus:border-orange-light outline-none py-2 text-sm text-sand placeholder:text-sand/40 transition-colors'
const TEXTAREA = INPUT + ' resize-y min-h-[80px]'
const BTN = 'inline-flex items-center gap-2 px-4 py-2 text-[11px] tracking-widest2 uppercase border border-sand/25 text-sand hover:border-orange-light hover:text-orange-light transition-colors'
const PRIMARY = 'inline-flex items-center gap-2 px-4 py-2 text-[11px] tracking-widest2 uppercase bg-orange text-ink hover:bg-orange-light transition-colors'

export default function AdminPage() {
  const [me, setMe] = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const t = getToken()
    if (!t) { setChecking(false); return }
    api.me()
      .then((r) => setMe(r.user))
      .catch(() => setToken(null))
      .finally(() => setChecking(false))
  }, [])

  if (checking) {
    return <FullscreenLoader />
  }
  if (!me) return <Login onSuccess={(u) => setMe(u)} />
  return <Dashboard me={me} onLogout={() => { setToken(null); setMe(null) }} />
}

function FullscreenLoader() {
  return (
    <div className="min-h-screen bg-ink text-sand flex items-center justify-center">
      <Loader2 className="animate-spin" size={22} />
    </div>
  )
}

/* ---------------- Login ------------------------------------------------ */

function Login({ onSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setError(''); setBusy(true)
    try {
      const { token, user } = await api.login(email, password)
      setToken(token)
      onSuccess(user)
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink text-sand flex items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-sm">
        <p className="text-orange-light text-[11px] tracking-widest2 uppercase mb-3">
          Landmark · Admin
        </p>
        <h1 className="font-display text-4xl mb-8">
          Sign in <span className="italic text-orange-light">.</span>
        </h1>
        <label className="block mb-6">
          <span className="block text-[10px] tracking-widest2 uppercase text-sand/60 mb-2">Email</span>
          <input type="email" required value={email}
            onChange={(e) => setEmail(e.target.value)} className={INPUT} />
        </label>
        <label className="block mb-8">
          <span className="block text-[10px] tracking-widest2 uppercase text-sand/60 mb-2">Password</span>
          <input type="password" required value={password}
            onChange={(e) => setPassword(e.target.value)} className={INPUT} />
        </label>
        {error && (
          <p className="text-orange-light text-sm mb-6">{error}</p>
        )}
        <button type="submit" disabled={busy}
          className="w-full inline-flex items-center justify-center gap-3 bg-orange text-ink py-3 text-xs tracking-widest2 uppercase hover:bg-orange-light disabled:opacity-40 transition-colors">
          {busy ? <Loader2 size={14} className="animate-spin" /> : 'Sign in →'}
        </button>
        <p className="mt-6 text-[10px] tracking-widest2 uppercase text-sand/40 text-center">
          Protected area
        </p>
      </form>
    </div>
  )
}

/* ---------------- Dashboard ------------------------------------------- */

function Dashboard({ me, onLogout }) {
  const [meta, setMeta] = useState(null)
  const [settingsMeta, setSettingsMeta] = useState(null)
  const [active, setActive] = useState({ kind: 'settings', key: null })
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    Promise.all([api.listCollections(), api.listSettings()]).then(([c, s]) => {
      setMeta(c.collections)
      setSettingsMeta(s)
      setActive({ kind: 'settings', key: s.sections[0] })
    })
  }, [])

  if (!meta || !settingsMeta) return <FullscreenLoader />

  return (
    <div className="min-h-screen bg-ink text-sand">
      <header className="border-b border-sand/10 sticky top-0 bg-ink/95 backdrop-blur-md z-40">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 md:px-8 py-4">
          <div>
            <p className="text-orange-light text-[10px] tracking-widest2 uppercase">
              Landmark · Admin
            </p>
            <p className="font-display italic text-sand/70 text-sm mt-0.5">
              {me.name} · {me.email}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowPassword(true)} className={BTN}>
              <KeyRound size={14} /> Password
            </button>
            <button onClick={onLogout} className={BTN}>
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto grid md:grid-cols-[240px_1fr] gap-8 px-6 md:px-8 py-10">
        <Sidebar
          meta={meta}
          sections={settingsMeta.sections}
          active={active}
          onSelect={setActive}
        />
        <main>
          {active.kind === 'settings' && (
            <SettingsEditor
              key={active.key}
              section={active.key}
              initial={settingsMeta.values[active.key] || {}}
            />
          )}
          {active.kind === 'collection' && (
            <CollectionEditor
              key={active.key}
              meta={meta.find((m) => m.key === active.key)}
            />
          )}
          {active.kind === 'bookings' && <BookingsPanel />}
        </main>
      </div>

      {showPassword && (
        <PasswordModal onClose={() => setShowPassword(false)} />
      )}
    </div>
  )
}

function Sidebar({ meta, sections, active, onSelect }) {
  const groups = [
    { title: 'Singletons', items: sections.map((s) => ({ kind: 'settings', key: s, label: s })) },
    { title: 'Collections', items: meta.map((m) => ({ kind: 'collection', key: m.key, label: m.label })) },
    { title: 'Ops', items: [{ kind: 'bookings', key: 'bookings', label: 'Bookings' }] },
  ]
  return (
    <nav className="text-sm">
      {groups.map((g) => (
        <div key={g.title} className="mb-8">
          <p className="text-[10px] tracking-widest2 uppercase text-sand/40 mb-3">
            {g.title}
          </p>
          <ul className="space-y-1">
            {g.items.map((it) => {
              const on = active.kind === it.kind && active.key === it.key
              return (
                <li key={`${it.kind}:${it.key}`}>
                  <button
                    onClick={() => onSelect(it)}
                    className={`w-full text-left px-3 py-2 border-l-2 transition-colors ${
                      on
                        ? 'border-orange text-orange-light bg-marine-dark/40'
                        : 'border-transparent text-sand/70 hover:text-sand hover:border-sand/40'
                    }`}
                  >
                    {it.label}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}

/* ---------------- Settings editor (JSON-tree form) -------------------- */

function SettingsEditor({ section, initial }) {
  const [value, setValue] = useState(initial)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  useEffect(() => { setValue(initial) }, [initial])

  async function save() {
    setStatus('saving'); setError('')
    try {
      await api.saveSetting(section, value)
      setStatus('saved')
      setTimeout(() => setStatus('idle'), 1500)
    } catch (e) {
      setError(e.message); setStatus('idle')
    }
  }

  return (
    <div>
      <SectionHeader
        title={section}
        subtitle="Singleton content · saved as a JSON blob"
        actions={
          <button onClick={save} className={PRIMARY} disabled={status === 'saving'}>
            {status === 'saving' ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {status === 'saved' ? 'Saved' : 'Save changes'}
          </button>
        }
      />
      {error && <p className="text-orange-light text-sm mb-4">{error}</p>}
      <div className={CARD}>
        <JsonForm value={value} onChange={setValue} />
      </div>
    </div>
  )
}

function JsonForm({ value, onChange, path = [] }) {
  if (value === null || value === undefined) {
    return (
      <input className={INPUT} value=""
        onChange={(e) => onChange(e.target.value)} />
    )
  }
  if (Array.isArray(value)) {
    return (
      <ArrayField value={value} onChange={onChange} />
    )
  }
  if (typeof value === 'object') {
    return (
      <div className="space-y-5">
        {Object.entries(value).map(([k, v]) => (
          <FieldRow key={k} label={k}>
            <JsonForm value={v} path={[...path, k]}
              onChange={(next) => onChange({ ...value, [k]: next })} />
          </FieldRow>
        ))}
      </div>
    )
  }
  if (typeof value === 'boolean') {
    return (
      <label className="inline-flex items-center gap-2 text-sm">
        <input type="checkbox" checked={value}
          onChange={(e) => onChange(e.target.checked)}
          className="accent-orange" />
        {value ? 'true' : 'false'}
      </label>
    )
  }
  if (typeof value === 'number') {
    return (
      <input type="number" value={value} className={INPUT}
        onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))} />
    )
  }
  const long = String(value).length > 80 || String(value).includes('\n')
  return long ? (
    <textarea value={value} className={TEXTAREA}
      onChange={(e) => onChange(e.target.value)} />
  ) : (
    <input value={value} className={INPUT}
      onChange={(e) => onChange(e.target.value)} />
  )
}

function ArrayField({ value, onChange }) {
  function add() {
    const template = value[0] !== undefined
      ? (typeof value[0] === 'object' && value[0] !== null
        ? Object.fromEntries(Object.keys(value[0]).map((k) => [k, '']))
        : '')
      : ''
    onChange([...value, template])
  }
  return (
    <div className="space-y-4">
      {value.map((item, i) => (
        <div key={i} className="border border-sand/10 p-4 relative">
          <button onClick={() => onChange(value.filter((_, j) => j !== i))}
            className="absolute top-2 right-2 text-sand/40 hover:text-orange-light">
            <Trash2 size={14} />
          </button>
          <p className="text-[10px] tracking-widest2 uppercase text-sand/40 mb-3">
            Item {String(i + 1).padStart(2, '0')}
          </p>
          <JsonForm value={item}
            onChange={(next) => onChange(value.map((v, j) => (j === i ? next : v)))} />
        </div>
      ))}
      <button onClick={add} className={BTN}>
        <Plus size={14} /> Add item
      </button>
    </div>
  )
}

function FieldRow({ label, children }) {
  return (
    <div>
      <p className="text-[10px] tracking-widest2 uppercase text-sand/50 mb-2">{label}</p>
      {children}
    </div>
  )
}

/* ---------------- Collection editor ----------------------------------- */

function CollectionEditor({ meta }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true); setError('')
    api.listCollection(meta.key)
      .then((r) => setRows(r.rows))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [meta.key])

  const empty = useMemo(() => {
    const o = { sortOrder: rows.length }
    for (const f of meta.fields) {
      o[f.api] = f.type === 'json' ? [] : f.type === 'bool' ? false : f.type === 'int' ? 0 : ''
    }
    return o
  }, [meta, rows.length])

  async function save(row) {
    try {
      if (row.id) {
        const { row: updated } = await api.updateRow(meta.key, row.id, row)
        setRows((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
      } else {
        const { row: created } = await api.createRow(meta.key, row)
        setRows((prev) => [...prev, created])
      }
      setEditing(null)
    } catch (e) {
      alert(e.message)
    }
  }

  async function remove(id) {
    if (!confirm('Delete this row?')) return
    await api.deleteRow(meta.key, id)
    setRows((prev) => prev.filter((r) => r.id !== id))
  }

  async function move(id, delta) {
    const idx = rows.findIndex((r) => r.id === id)
    const to = idx + delta
    if (idx < 0 || to < 0 || to >= rows.length) return
    const next = [...rows]
    const [row] = next.splice(idx, 1)
    next.splice(to, 0, row)
    setRows(next)
    await api.reorder(meta.key, next.map((r) => r.id))
  }

  return (
    <div>
      <SectionHeader
        title={meta.label}
        subtitle={`${rows.length} rows · ${meta.fields.length} fields`}
        actions={
          <button onClick={() => setEditing(empty)} className={PRIMARY}>
            <Plus size={14} /> New row
          </button>
        }
      />
      {error && <p className="text-orange-light text-sm mb-4">{error}</p>}
      {loading ? (
        <Loader2 className="animate-spin" size={20} />
      ) : (
        <div className={CARD}>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] tracking-widest2 uppercase text-sand/50 border-b border-sand/15">
                <th className="py-3 pr-3">#</th>
                {meta.fields.slice(0, 3).map((f) => (
                  <th key={f.api} className="py-3 pr-3">{f.api}</th>
                ))}
                <th className="py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.id} className="border-b border-sand/5 hover:bg-sand/5">
                  <td className="py-3 pr-3 text-sand/50 tabular-nums">{i + 1}</td>
                  {meta.fields.slice(0, 3).map((f) => (
                    <td key={f.api} className="py-3 pr-3 text-sand/85 truncate max-w-[240px]">
                      {formatCell(row[f.api], f.type)}
                    </td>
                  ))}
                  <td className="py-3 text-right">
                    <div className="inline-flex gap-2">
                      {meta.orderable && (
                        <>
                          <button onClick={() => move(row.id, -1)}
                            className="text-sand/50 hover:text-orange-light text-xs">↑</button>
                          <button onClick={() => move(row.id, +1)}
                            className="text-sand/50 hover:text-orange-light text-xs">↓</button>
                        </>
                      )}
                      <button onClick={() => setEditing(row)}
                        className="text-[10px] tracking-widest2 uppercase text-orange-light hover:text-orange">
                        Edit
                      </button>
                      <button onClick={() => remove(row.id)}
                        className="text-sand/50 hover:text-orange-light">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td colSpan={meta.fields.length + 2} className="py-8 text-center text-sand/50">
                    No rows yet — start with <em>New row</em>.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <RowEditor meta={meta} row={editing}
          onCancel={() => setEditing(null)}
          onSave={save} />
      )}
    </div>
  )
}

function formatCell(v, type) {
  if (v === null || v === undefined) return '—'
  if (type === 'bool') return v ? '✓' : '·'
  if (type === 'json') return Array.isArray(v) ? `${v.length} items` : 'object'
  return String(v)
}

function RowEditor({ meta, row, onCancel, onSave }) {
  const [draft, setDraft] = useState(row)
  useEffect(() => setDraft(row), [row])

  return (
    <div className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-start justify-center p-6 overflow-y-auto">
      <div className="w-full max-w-2xl bg-marine-dark border border-sand/15 p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-orange-light text-[10px] tracking-widest2 uppercase mb-1">
              {row.id ? `Edit #${row.id}` : 'New'}
            </p>
            <h2 className="font-display text-2xl">{meta.label}</h2>
          </div>
          <button onClick={onCancel} className="text-sand/60 hover:text-sand">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5">
          {meta.fields.map((f) => (
            <FieldRow key={f.api} label={`${f.api}${f.required ? ' *' : ''}`}>
              <FieldInput field={f}
                value={draft[f.api]}
                onChange={(v) => setDraft({ ...draft, [f.api]: v })} />
            </FieldRow>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-end gap-3">
          <button onClick={onCancel} className={BTN}>Cancel</button>
          <button onClick={() => onSave(draft)} className={PRIMARY}>
            <Save size={14} /> Save
          </button>
        </div>
      </div>
    </div>
  )
}

function FieldInput({ field, value, onChange }) {
  if (field.type === 'bool') {
    return (
      <label className="inline-flex items-center gap-2 text-sm">
        <input type="checkbox" checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          className="accent-orange" />
        <span className="text-sand/70">{value ? 'true' : 'false'}</span>
      </label>
    )
  }
  if (field.type === 'int') {
    return <input type="number" value={value ?? ''}
      onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
      className={INPUT} />
  }
  if (field.type === 'json') {
    const [text, setText] = useJsonText(value)
    return (
      <textarea value={text}
        onChange={(e) => {
          setText(e.target.value)
          try { onChange(JSON.parse(e.target.value)) } catch { /* wait until valid */ }
        }}
        className={TEXTAREA + ' font-mono text-xs'} />
    )
  }
  if (field.type === 'text') {
    return <textarea value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      className={TEXTAREA} />
  }
  return <input value={value ?? ''}
    onChange={(e) => onChange(e.target.value)}
    className={INPUT} />
}

function useJsonText(initial) {
  const [text, setText] = useState(() => JSON.stringify(initial ?? [], null, 2))
  useEffect(() => {
    setText(JSON.stringify(initial ?? [], null, 2))
  }, [initial])
  return [text, setText]
}

/* ---------------- Bookings -------------------------------------------- */

function BookingsPanel() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  const load = () => {
    setLoading(true)
    api.listBookings(filter).then((r) => setRows(r.bookings)).finally(() => setLoading(false))
  }
  useEffect(load, [filter])

  async function setStatus(b, status) {
    await api.updateBooking(b.id, { status })
    setRows((prev) => prev.map((r) => (r.id === b.id ? { ...r, status } : r)))
  }
  async function remove(b) {
    if (!confirm(`Delete booking ${b.reference}?`)) return
    await api.deleteBooking(b.id)
    setRows((prev) => prev.filter((r) => r.id !== b.id))
  }

  return (
    <div>
      <SectionHeader
        title="Bookings"
        subtitle={`${rows.length} bookings · from /bookings/:type`}
        actions={
          <select value={filter} onChange={(e) => setFilter(e.target.value)}
            className="bg-marine-dark border border-sand/20 text-sand text-[11px] tracking-widest2 uppercase px-3 py-2">
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="hold">Hold</option>
            <option value="cancelled">Cancelled</option>
          </select>
        }
      />
      {loading ? <Loader2 className="animate-spin" size={20} /> : (
        <div className={CARD}>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] tracking-widest2 uppercase text-sand/50 border-b border-sand/15">
                <th className="py-3 pr-3">Ref</th>
                <th className="py-3 pr-3">Type</th>
                <th className="py-3 pr-3">Guest</th>
                <th className="py-3 pr-3">Date</th>
                <th className="py-3 pr-3">Guests</th>
                <th className="py-3 pr-3">Total</th>
                <th className="py-3 pr-3">Status</th>
                <th className="py-3 text-right">—</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => (
                <tr key={b.id} className="border-b border-sand/5">
                  <td className="py-3 pr-3 font-mono text-xs">{b.reference}</td>
                  <td className="py-3 pr-3 text-orange-light">{b.bookingType}</td>
                  <td className="py-3 pr-3">
                    <div>{b.firstName} {b.lastName}</div>
                    <div className="text-sand/50 text-xs">{b.email}</div>
                  </td>
                  <td className="py-3 pr-3">{b.dateFrom || '—'}{b.dateTo ? ` → ${b.dateTo}` : ''}</td>
                  <td className="py-3 pr-3 tabular-nums">{b.guests}</td>
                  <td className="py-3 pr-3 tabular-nums">₦{Number(b.totalNGN || 0).toLocaleString()}</td>
                  <td className="py-3 pr-3">
                    <select value={b.status}
                      onChange={(e) => setStatus(b, e.target.value)}
                      className="bg-transparent border border-sand/20 text-[11px] tracking-widest2 uppercase px-2 py-1">
                      <option value="pending">pending</option>
                      <option value="confirmed">confirmed</option>
                      <option value="hold">hold</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  </td>
                  <td className="py-3 text-right">
                    <button onClick={() => remove(b)}
                      className="text-sand/50 hover:text-orange-light">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-sand/50">
                    No bookings yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

/* ---------------- Password modal -------------------------------------- */

function PasswordModal({ onClose }) {
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [state, setState] = useState('idle')
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault(); setError('')
    if (pw !== pw2) { setError('Passwords do not match'); return }
    if (pw.length < 8) { setError('Minimum 8 characters'); return }
    setState('saving')
    try {
      await api.changePassword(pw)
      setState('saved')
      setTimeout(onClose, 900)
    } catch (e) { setError(e.message); setState('idle') }
  }

  return (
    <div className="fixed inset-0 z-50 bg-ink/80 flex items-center justify-center p-6">
      <form onSubmit={submit} className="w-full max-w-md bg-marine-dark border border-sand/15 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl">Change password</h2>
          <button type="button" onClick={onClose} className="text-sand/60 hover:text-sand">
            <X size={20} />
          </button>
        </div>
        <label className="block mb-5">
          <span className="block text-[10px] tracking-widest2 uppercase text-sand/60 mb-2">New password</span>
          <input type="password" value={pw} required onChange={(e) => setPw(e.target.value)} className={INPUT} />
        </label>
        <label className="block mb-6">
          <span className="block text-[10px] tracking-widest2 uppercase text-sand/60 mb-2">Confirm</span>
          <input type="password" value={pw2} required onChange={(e) => setPw2(e.target.value)} className={INPUT} />
        </label>
        {error && <p className="text-orange-light text-sm mb-4">{error}</p>}
        <button type="submit" disabled={state === 'saving'}
          className="w-full inline-flex items-center justify-center gap-2 bg-orange text-ink py-3 text-xs tracking-widest2 uppercase hover:bg-orange-light disabled:opacity-40 transition-colors">
          {state === 'saved' ? <><Check size={14} /> Saved</> : 'Save'}
        </button>
      </form>
    </div>
  )
}

function SectionHeader({ title, subtitle, actions }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div>
        <p className="text-orange-light text-[10px] tracking-widest2 uppercase mb-2">
          {title}
        </p>
        <h1 className="font-display text-3xl md:text-4xl leading-tight">
          {title}
        </h1>
        {subtitle && <p className="text-sand/60 text-sm mt-2">{subtitle}</p>}
      </div>
      {actions}
    </div>
  )
}
