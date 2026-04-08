import { useState, useEffect } from 'react'
import CoverItem from './CoverItem.jsx'

const CF_HEIGHT = 272

export default function CoverFlow({ songs }) {
  const [idx,     setIdx]     = useState(0)
  const [flipped, setFlipped] = useState(false)

  useEffect(() => { setIdx(0); setFlipped(false) }, [songs])
  useEffect(() => { setFlipped(false) }, [idx])

  useEffect(() => {
    const handler = e => {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); setIdx(i => Math.max(0, i - 1)) }
      if (e.key === 'ArrowRight') { e.preventDefault(); setIdx(i => Math.min(songs.length - 1, i + 1)) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [songs.length])

  const cur      = songs[idx]
  const dotStart = Math.max(0, idx - 5)
  const dotEnd   = Math.min(songs.length, idx + 6)

  return (
    <div style={{ position: 'relative', height: CF_HEIGHT }}>
      <div style={{ position: 'absolute', inset: 0, perspective: 920, perspectiveOrigin: '50% 48%', overflow: 'visible' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 1, zIndex: 50, pointerEvents: 'none', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.13) 50%, rgba(255,255,255,0.06) 80%, transparent)' }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 40, pointerEvents: 'none', background: 'linear-gradient(90deg, #090909 0%, transparent 13%, transparent 87%, #090909 100%)' }} />

        {songs.length === 0
          ? <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 13, fontStyle: 'italic' }}>Aucun résultat</div>
          : songs.map((song, i) => <CoverItem key={song.id} song={song} offset={i - idx} isFlipped={flipped && i === idx} onSideClick={() => setIdx(i)} onCenterClick={() => setFlipped(f => !f)} />)
        }

        {idx > 0 && <button className="cf-nav" style={{ left: 14 }} onClick={() => setIdx(i => i - 1)}>‹</button>}
        {songs.length > 0 && idx < songs.length - 1 && <button className="cf-nav" style={{ right: 14 }} onClick={() => setIdx(i => i + 1)}>›</button>}

        <div style={{ position: 'absolute', bottom: 7, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 4, zIndex: 45 }}>
          {songs.slice(dotStart, dotEnd).map((_, vi) => {
            const ri = dotStart + vi
            return <div key={ri} onClick={() => setIdx(ri)} style={{ width: ri === idx ? 14 : 5, height: 5, borderRadius: 3, cursor: 'pointer', background: ri === idx ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0.18)', transition: 'all 0.25s ease' }} />
          })}
        </div>
      </div>

      {cur && (
        <div style={{ position: 'absolute', bottom: -46, left: 0, right: 0, textAlign: 'center', padding: '0 24px', pointerEvents: 'none' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.82)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>{cur.title}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: 0.2 }}>
            {cur.album.artist} · {cur.album.title} · {cur.album.year}
            <span style={{ margin: '0 6px', opacity: 0.35 }}>·</span>
            <span style={{ fontVariantNumeric: 'tabular-nums', color: 'rgba(255,255,255,0.2)' }}>{cur.duration}</span>
          </div>
          {!flipped && <div style={{ marginTop: 3, fontSize: 9, color: 'rgba(255,255,255,0.12)', letterSpacing: 1.5, textTransform: 'uppercase' }}>cliquer à nouveau pour voir l'album</div>}
        </div>
      )}
    </div>
  )
}
