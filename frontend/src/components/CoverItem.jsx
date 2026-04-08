import AlbumArt from './AlbumArt.jsx'

const CF_SIZE    = 158
const FLAT_ANGLE = 68

export default function CoverItem({ song, offset, isFlipped, onSideClick, onCenterClick }) {
  const abs  = Math.abs(offset)
  if (abs > 5) return null
  const side = Math.sign(offset)
  const xPos = abs === 0 ? 0 : side * (CF_SIZE * 0.54 + (abs - 1) * (CF_SIZE * 0.20 + 20) + CF_SIZE * 0.20)
  const rotY  = abs === 0 ? 0 : -side * FLAT_ANGLE
  const zVal  = abs === 0 ? 50 : -abs * 16
  const brVal = abs === 0 ? 1 : Math.max(0.38, 1 - abs * 0.15)

  return (
    <div onClick={() => abs === 0 ? onCenterClick() : onSideClick()} style={{ position: 'absolute', left: '50%', top: '50%', width: CF_SIZE, height: CF_SIZE, transform: `translateX(calc(-50% + ${xPos}px)) translateY(-50%) translateZ(${zVal}px) rotateY(${rotY}deg)`, transition: 'transform 0.44s cubic-bezier(0.23, 1, 0.32, 1), filter 0.3s', opacity: abs > 4 ? 0 : 1, filter: `brightness(${brVal})`, zIndex: 10 - abs, cursor: 'pointer' }}>
      {abs === 0 ? (
        <div style={{ width: CF_SIZE, height: CF_SIZE, transformStyle: 'preserve-3d', transition: 'transform 0.62s cubic-bezier(0.23, 1, 0.32, 1)', transform: isFlipped ? 'rotateX(180deg)' : 'rotateX(0deg)' }}>
          <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
            <AlbumArt album={song.album} size={CF_SIZE} showYear />
          </div>
          <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateX(180deg)', background: `linear-gradient(150deg, hsl(${song.album.hue}) 0%, #080808 100%)`, display: 'flex', flexDirection: 'column', padding: '10px 10px 8px', gap: 3, overflow: 'hidden' }}>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: 1.8, textTransform: 'uppercase', color: 'rgba(255,255,255,0.36)', marginBottom: 1 }}>{song.album.artist} · {song.album.year}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.88)', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{song.album.title}</div>
            {song.album.tracks.map(track => (
              <div key={track.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '3px 6px', borderRadius: 4, fontSize: 10, gap: 6, background: track.id === song.id ? 'rgba(255,255,255,0.18)' : 'transparent', color: track.id === song.id ? '#fff' : 'rgba(255,255,255,0.42)' }}>
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: track.id === song.id ? 600 : 400 }}>{track.track_number}. {track.title}</span>
                <span style={{ color: 'rgba(255,255,255,0.26)', fontSize: 9, flexShrink: 0 }}>{track.duration}</span>
              </div>
            ))}
            <button className="play-btn" onClick={e => e.stopPropagation()}><span style={{ fontSize: 8 }}>▶</span> Lecture</button>
          </div>
        </div>
      ) : (
        <AlbumArt album={song.album} size={CF_SIZE} showYear />
      )}
      {!isFlipped && (
        <div style={{ position: 'absolute', top: CF_SIZE, left: 0, width: CF_SIZE, height: CF_SIZE * 0.46, transform: 'scaleY(-1)', transformOrigin: 'top center', WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.4), transparent 62%)', maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.4), transparent 62%)', pointerEvents: 'none', overflow: 'hidden' }}>
          <AlbumArt album={song.album} size={CF_SIZE} />
        </div>
      )}
    </div>
  )
}
