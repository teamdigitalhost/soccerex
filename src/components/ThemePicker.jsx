import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Palette, X, RotateCcw, ChevronDown } from 'lucide-react'

/* HMR: this module touches `document.documentElement.style` and localStorage at
   module-load time. Hot-replacing it leaves stale CSS variables and confuses
   React's hook accounting ("dep array changed size" warning). Do a full reload
   instead of a hot patch. */
if (import.meta.hot) {
  import.meta.hot.accept(() => { import.meta.hot.invalidate() })
}

/* ─── Defaults ────────────────────────────────────────────────────────────── */
/* Ember palette: primary orange + secondary golden yellow */
const DEFAULTS = {
  soccerex: { primary: '#ff6b35', secondary: '#ffb703' },
  europe:   { primary: '#c8302c', secondary: '#e8504c' },
  miami:    { primary: '#e84393', secondary: '#fd79a8' },
  riyadh:   { primary: '#d4a853', secondary: '#e8c878' },
}

const SCOPES = [
  { id: 'soccerex', label: 'Soccerex', match: () => true },
  { id: 'europe',   label: 'Europe 2026', match: (p) => p.startsWith('/europe-2026') },
  { id: 'miami',    label: 'Miami',       match: (p) => p.startsWith('/miami') },
  { id: 'riyadh',   label: 'Middle East', match: (p) => p.startsWith('/middle-east') || p.startsWith('/riyadh') },
]

const PRESETS = {
  soccerex: [
    { name: 'Classic', primary: '#bfb170', secondary: '#c8302c' },
    { name: 'Electric', primary: '#d4ff00', secondary: '#00d4ff' },
    { name: 'Ember', primary: '#ff6b35', secondary: '#ffd166' },
    { name: 'Pitch', primary: '#00ff9d', secondary: '#09203e' },
    { name: 'Night Club', primary: '#a259ff', secondary: '#ff2e93' },
    { name: 'Citrus', primary: '#ffd60a', secondary: '#ff006e' },
  ],
  europe: [
    { name: 'Classic Red', primary: '#c8302c', secondary: '#e8504c' },
    { name: 'Tulip', primary: '#ff5e3a', secondary: '#ffbe0b' },
    { name: 'Ajax', primary: '#d2122e', secondary: '#ffffff' },
  ],
  miami: [
    { name: 'Hot Pink', primary: '#e84393', secondary: '#fd79a8' },
    { name: 'Vice', primary: '#ff2e93', secondary: '#00ffd1' },
    { name: 'Sunset', primary: '#ff6b6b', secondary: '#ffd166' },
  ],
  riyadh: [
    { name: 'Desert Gold', primary: '#d4a853', secondary: '#e8c878' },
    { name: 'Oasis', primary: '#00a86b', secondary: '#ffd700' },
    { name: 'Dusk', primary: '#ff9a3c', secondary: '#8b4513' },
  ],
}

const STORAGE_KEY = 'sx-theme-v1'

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
function hexToRgb(hex) {
  const m = hex.replace('#', '')
  const h = m.length === 3 ? m.split('').map(c => c + c).join('') : m
  const n = parseInt(h, 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}
function rgbaFromHex(hex, a) {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r},${g},${b},${a})`
}
function shade(hex, amount) {
  const { r, g, b } = hexToRgb(hex)
  const adj = (c) => Math.max(0, Math.min(255, Math.round(c + amount)))
  const to = (c) => c.toString(16).padStart(2, '0')
  return `#${to(adj(r))}${to(adj(g))}${to(adj(b))}`
}

/* Picker is gated by ?color=1 (or ?color=true). When the flag is OFF we never
   read localStorage — stale palettes from prior sessions would otherwise leak
   through. Defaults (Ember) are the source of truth for every public visitor. */
function isPickerEnabled() {
  if (typeof window === 'undefined') return false
  const p = new URLSearchParams(window.location.search).get('color')
  return p === '1' || p === 'true'
}

function loadState() {
  if (!isPickerEnabled()) return { ...DEFAULTS }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULTS }
    const parsed = JSON.parse(raw)
    return { ...DEFAULTS, ...parsed }
  } catch { return { ...DEFAULTS } }
}

/* ─── Apply colors to :root (and event theme classes) ─────────────────────── */
function applyTheme(state) {
  const root = document.documentElement
  // Soccerex global vars
  root.style.setProperty('--color-gold', state.soccerex.primary)
  root.style.setProperty('--color-gold-light', shade(state.soccerex.primary, 20))
  root.style.setProperty('--color-red', state.soccerex.secondary)
  root.style.setProperty('--color-red-light', shade(state.soccerex.secondary, 20))

  // Event-scoped overrides via a single injected style tag
  const scopes = [
    { key: 'europe', cls: '.theme-europe' },
    { key: 'miami',  cls: '.theme-miami'  },
    { key: 'riyadh', cls: '.theme-riyadh' },
  ]
  const rules = scopes.map(({ key, cls }) => {
    const { primary } = state[key]
    return `${cls} {
      --event-primary: ${primary};
      --event-primary-light: ${shade(primary, 24)};
      --event-primary-dark: ${shade(primary, -40)};
      --event-primary-bg: ${rgbaFromHex(primary, 0.12)};
      --event-primary-border: ${rgbaFromHex(primary, 0.3)};
      --event-primary-glow: ${rgbaFromHex(primary, 0.4)};
    }`
  }).join('\n')

  let tag = document.getElementById('sx-theme-override')
  if (!tag) {
    tag = document.createElement('style')
    tag.id = 'sx-theme-override'
    document.head.appendChild(tag)
  }
  tag.textContent = rules
}

/* ─── Component ───────────────────────────────────────────────────────────── */
export default function ThemePicker() {
  const location = useLocation()
  const [state, setState] = useState(loadState)
  const [open, setOpen] = useState(false)
  const [scopeId, setScopeId] = useState('soccerex')
  const didAutoScope = useRef(false)

  // Only render picker UI when ?color=1 or ?color=true. Theme still applies.
  const params = new URLSearchParams(location.search)
  const colorFlag = params.get('color')
  const enabled = colorFlag === '1' || colorFlag === 'true'

  // Auto-select scope based on route (only when panel first opens)
  useEffect(() => {
    const detected = [...SCOPES].reverse().find(s => s.match(location.pathname))?.id || 'soccerex'
    setScopeId(detected)
    didAutoScope.current = true
  }, [location.pathname])

  // Apply on every change. Persist to localStorage ONLY when the picker is
  // enabled — we don't want visitors who never opened the picker to pollute
  // their storage with state that would "stick" on a future visit.
  useEffect(() => {
    applyTheme(state)
    if (enabled) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch {}
    }
  }, [state, enabled])

  const scope = state[scopeId]
  const setPrimary = (hex) => setState(s => ({ ...s, [scopeId]: { ...s[scopeId], primary: hex } }))
  const setSecondary = (hex) => setState(s => ({ ...s, [scopeId]: { ...s[scopeId], secondary: hex } }))
  const applyPreset = (p) => setState(s => ({ ...s, [scopeId]: { primary: p.primary, secondary: p.secondary } }))
  const resetScope = () => setState(s => ({ ...s, [scopeId]: DEFAULTS[scopeId] }))
  const resetAll = () => setState({ ...DEFAULTS })

  const hasSecondary = scopeId === 'soccerex'
  const presets = PRESETS[scopeId]

  if (!enabled) return null

  return (
    <>
      {/* Floating trigger */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Theme picker"
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          width: 56, height: 56, borderRadius: '50%',
          background: `linear-gradient(135deg, ${scope.primary}, ${hasSecondary ? scope.secondary : shade(scope.primary, -30)})`,
          border: '2px solid rgba(255,255,255,0.9)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.2)',
          cursor: 'pointer',
          display: 'grid', placeItems: 'center',
          color: '#fff', transition: 'transform 0.2s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)' }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
      >
        {open ? <X size={22} /> : <Palette size={22} />}
      </button>

      {/* Panel */}
      {open && (
        <div
          style={{
            position: 'fixed', bottom: 96, right: 24, zIndex: 9999,
            width: 340, maxHeight: 'calc(100vh - 140px)', overflowY: 'auto',
            background: 'rgba(9, 15, 25, 0.96)', backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 16, padding: 20,
            color: '#fff', fontFamily: 'Inter, sans-serif',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>
              Theme Studio
            </div>
            <button onClick={resetAll} title="Reset all" style={iconBtn}><RotateCcw size={14} /></button>
          </div>

          {/* Scope selector */}
          <label style={labelCss}>Scope</label>
          <div style={{ position: 'relative', marginBottom: 18 }}>
            <select
              value={scopeId}
              onChange={(e) => setScopeId(e.target.value)}
              style={selectCss}
            >
              {SCOPES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: 12, pointerEvents: 'none', color: 'rgba(255,255,255,0.5)' }} />
          </div>

          {/* Primary color */}
          <label style={labelCss}>{hasSecondary ? 'Primary' : 'Accent'}</label>
          <ColorRow hex={scope.primary} onChange={setPrimary} />

          {/* Secondary color (soccerex only) */}
          {hasSecondary && (
            <>
              <label style={labelCss}>Secondary</label>
              <ColorRow hex={scope.secondary} onChange={setSecondary} />
            </>
          )}

          {/* Presets */}
          <label style={labelCss}>Presets</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
            {presets.map(p => (
              <button key={p.name} onClick={() => applyPreset(p)} style={presetBtn(p)}>
                <div style={{ display: 'flex', gap: 4 }}>
                  <div style={{ width: 14, height: 14, borderRadius: 3, background: p.primary, border: '1px solid rgba(255,255,255,0.2)' }} />
                  <div style={{ width: 14, height: 14, borderRadius: 3, background: p.secondary, border: '1px solid rgba(255,255,255,0.2)' }} />
                </div>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)' }}>{p.name}</span>
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={resetScope} style={secondaryBtn}>Reset {SCOPES.find(s => s.id === scopeId)?.label}</button>
          </div>

          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 10, lineHeight: 1.4 }}>
            Changes apply live and persist in this browser. Other users see the original colors.
          </p>
        </div>
      )}
    </>
  )
}

/* ─── Sub: color input row with swatch + hex text ─────────────────────────── */
function ColorRow({ hex, onChange }) {
  const [text, setText] = useState(hex)
  useEffect(() => { setText(hex) }, [hex])
  const commit = (v) => {
    if (/^#([0-9a-fA-F]{3}){1,2}$/.test(v)) onChange(v)
  }
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 14 }}>
      <div style={{ position: 'relative', width: 44, height: 36, borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)' }}>
        <input
          type="color"
          value={hex}
          onChange={(e) => onChange(e.target.value)}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
        />
      </div>
      <input
        type="text"
        value={text}
        onChange={(e) => { setText(e.target.value); commit(e.target.value) }}
        onBlur={(e) => commit(e.target.value) || setText(hex)}
        style={{
          flex: 1, background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
          padding: '8px 12px', color: '#fff', fontFamily: 'IBM Plex Mono, monospace',
          fontSize: 12, outline: 'none',
        }}
        spellCheck={false}
      />
    </div>
  )
}

/* ─── Styles ──────────────────────────────────────────────────────────────── */
const labelCss = { display: 'block', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 6 }
const selectCss = {
  width: '100%', appearance: 'none', background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
  padding: '10px 32px 10px 12px', color: '#fff', fontSize: 13, cursor: 'pointer', outline: 'none',
}
const iconBtn = {
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
  color: 'rgba(255,255,255,0.7)', borderRadius: 6, width: 28, height: 28,
  display: 'grid', placeItems: 'center', cursor: 'pointer',
}
const secondaryBtn = {
  flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
  color: 'rgba(255,255,255,0.85)', borderRadius: 8, padding: '8px 12px',
  fontSize: 11, cursor: 'pointer',
}
const presetBtn = (p) => ({
  display: 'flex', alignItems: 'center', gap: 8,
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 8, padding: '8px 10px', cursor: 'pointer', textAlign: 'left',
})

/* ─── Init on module load (for first paint before provider mounts) ────────── */
if (typeof window !== 'undefined') {
  try { applyTheme(loadState()) } catch {}
}
