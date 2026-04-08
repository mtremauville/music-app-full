import { useRef, useEffect } from 'react'

export default function SearchBar({ query, onChange, total, matched, loading }) {
  const ref = useRef(null)
  useEffect(() => { ref.current?.focus() }, [])

  return (
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20, display: 'flex', alignItems: 'center', gap: 10, padding: '0 20px', height: 52, background: 'rgba(4,4,4,0.88)', borderTop: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>
      <span style={{ fontSize: 17, color: 'rgba(255,255,255,0.26)', flexShrink: 0 }}>{loading ? '…' : '⌕'}</span>
      <input ref={ref} type="text" className="search-input" value={query} onChange={e => onChange(e.target.value)} onKeyDown={e => { if (e.key === 'Escape') { onChange(''); ref.current?.focus() } }} placeholder="Titre, artiste, album, année…" />
      {query ? (
        <>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.22)', whiteSpace: 'nowrap' }}>{matched}/{total}</span>
          <button className="clear-btn" onClick={() => { onChange(''); ref.current?.focus() }}>×</button>
        </>
      ) : (
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.12)', letterSpacing: 1.5, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{total} titres · ← →</span>
      )}
    </div>
  )
}
