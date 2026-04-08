import { useState, useEffect, useRef } from 'react'
import AlbumArt from './AlbumArt.jsx'

const CF_SIZE    = 220
const FLAT_ANGLE = 68

function MiniPlayer({ song, active }) {
  const audioRef               = useRef(null)
  const [playing,  setPlaying]  = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume,   setVolume]   = useState(1)
  const [status,   setStatus]   = useState('idle')

  // Charge le fichier audio seulement quand la cover est retournée (active=true)
  useEffect(() => {
    if (!active) return
    if (!song?.stream_url) { setStatus('no_stream'); return }

    const audio = audioRef.current
    setStatus('loading')
    setProgress(0)
    setDuration(0)
    setPlaying(false)
    audio.pause()
    audio.src    = song.stream_url
    audio.volume = volume
    audio.load()

    const onMeta  = () => { setDuration(audio.duration || 0); setStatus('ready') }
    const onError = () => setStatus('error')
    const onEnded = () => { setPlaying(false); setProgress(0) }
    const onTime  = () => { setProgress(audio.currentTime); setDuration(audio.duration || 0) }

    audio.addEventListener('loadedmetadata', onMeta)
    audio.addEventListener('error',          onError)
    audio.addEventListener('ended',          onEnded)
    audio.addEventListener('timeupdate',     onTime)

    return () => {
      audio.removeEventListener('loadedmetadata', onMeta)
      audio.removeEventListener('error',          onError)
      audio.removeEventListener('ended',          onEnded)
      audio.removeEventListener('timeupdate',     onTime)
      audio.pause()
      setPlaying(false)
    }
  }, [song?.stream_url, active])

  const togglePlay = (e) => {
    e.stopPropagation()
    const audio = audioRef.current
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => setStatus('error'))
    }
  }

  const handleSeek = (e) => {
    e.stopPropagation()
    const t = (parseFloat(e.target.value) / 100) * duration
    audioRef.current.currentTime = t
    setProgress(t)
  }

  const handleVolume = (e) => {
    e.stopPropagation()
    const v = parseFloat(e.target.value)
    audioRef.current.volume = v
    setVolume(v)
  }

  const fmt = (s) => {
    if (!s || isNaN(s)) return '0:00'
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
  }

  const pct = duration > 0 ? (progress / duration) * 100 : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }} onClick={e => e.stopPropagation()}>
      <audio ref={audioRef} />

      {/* Barre de progression */}
      {(status === 'ready' || status === 'loading') && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.35)', minWidth: 24, fontVariantNumeric: 'tabular-nums' }}>
            {fmt(progress)}
          </span>
          <div style={{ flex: 1, position: 'relative', height: 2, background: 'rgba(255,255,255,0.15)', borderRadius: 1 }}>
            <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${pct}%`, background: 'rgba(255,255,255,0.75)', borderRadius: 1 }} />
            <input type="range" min="0" max="100" step="0.1" value={pct}
              onChange={handleSeek}
              style={{ position: 'absolute', inset: 0, width: '100%', opacity: 0, cursor: 'pointer', height: '100%', margin: 0 }}
            />
          </div>
          <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.35)', minWidth: 24, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
            {fmt(duration)}
          </span>
        </div>
      )}

      {/* Contrôles */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {status === 'no_stream' && (
          <div style={{ flex: 1, fontSize: 9, color: 'rgba(255,255,255,0.25)', textAlign: 'center', fontStyle: 'italic' }}>
            Pas de fichier audio
          </div>
        )}
        {status === 'loading' && (
          <div style={{ flex: 1, fontSize: 9, color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
            Chargement…
          </div>
        )}
        {status === 'error' && (
          <div style={{ flex: 1, fontSize: 9, color: '#ff6b6b', textAlign: 'center' }}>
            Erreur audio
          </div>
        )}
        {status === 'ready' && (
          <>
            <button onClick={togglePlay} style={{
              width: 30, height: 30, borderRadius: '50%',
              background: 'rgba(255,255,255,0.88)', border: 'none',
              color: '#080808', fontSize: 11, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              {playing ? '⏸' : '▶'}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1 }}>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>
                {volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
              </span>
              <input type="range" min="0" max="1" step="0.05" value={volume}
                onChange={handleVolume}
                style={{ flex: 1, accentColor: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function CoverItem({ song, offset, isFlipped, onSideClick, onCenterClick }) {
  const abs  = Math.abs(offset)
  if (abs > 5) return null
  const side = Math.sign(offset)
  const xPos = abs === 0 ? 0 : side * (CF_SIZE * 0.54 + (abs - 1) * (CF_SIZE * 0.20 + 20) + CF_SIZE * 0.20)
  const rotY  = abs === 0 ? 0 : -side * FLAT_ANGLE
  const zVal  = abs === 0 ? 50 : -abs * 16
  const brVal = abs === 0 ? 1 : Math.max(0.38, 1 - abs * 0.15)

  return (
    <div
      onClick={() => abs === 0 ? onCenterClick() : onSideClick()}
      style={{
        position: 'absolute', left: '50%', top: '50%',
        width: CF_SIZE, height: CF_SIZE,
        transform: `translateX(calc(-50% + ${xPos}px)) translateY(-50%) translateZ(${zVal}px) rotateY(${rotY}deg)`,
        transition: 'transform 0.44s cubic-bezier(0.23, 1, 0.32, 1), filter 0.3s',
        opacity: abs > 4 ? 0 : 1,
        filter: `brightness(${brVal})`,
        zIndex: 10 - abs,
        cursor: 'pointer',
      }}
    >
      {abs === 0 ? (
        <div style={{
          width: CF_SIZE, height: CF_SIZE,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.62s cubic-bezier(0.23, 1, 0.32, 1)',
          transform: isFlipped ? 'rotateX(180deg)' : 'rotateX(0deg)',
        }}>
          {/* Recto */}
          <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
            <AlbumArt album={song.album} size={CF_SIZE} showYear />
          </div>

          {/* Verso */}
          <div style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateX(180deg)',
            background: `linear-gradient(150deg, hsl(${song.album.hue}) 0%, #080808 100%)`,
            display: 'flex', flexDirection: 'column',
            padding: '12px 12px 10px',
            gap: 4, boxSizing: 'border-box',
          }}>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: 1.8, textTransform: 'uppercase', color: 'rgba(255,255,255,0.36)', flexShrink: 0 }}>
              {song.album.artist} · {song.album.year}
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.88)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flexShrink: 0 }}>
              {song.album.title}
            </div>

            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 1 }}>
              {song.album.tracks.map(track => (
                <div key={track.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '2px 5px', borderRadius: 3, fontSize: 9.5, gap: 6, flexShrink: 0,
                  background: track.id === song.id ? 'rgba(255,255,255,0.18)' : 'transparent',
                  color: track.id === song.id ? '#fff' : 'rgba(255,255,255,0.42)',
                }}>
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: track.id === song.id ? 600 : 400 }}>
                    {track.track_number}. {track.title}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.26)', fontSize: 8.5, flexShrink: 0 }}>
                    {track.duration}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', flexShrink: 0, margin: '2px 0' }} />

            {/* Lecteur — s'active seulement quand la cover est retournée */}
            <MiniPlayer song={song} active={isFlipped} />
          </div>
        </div>
      ) : (
        <AlbumArt album={song.album} size={CF_SIZE} showYear />
      )}

      {!isFlipped && (
        <div style={{
          position: 'absolute', top: CF_SIZE, left: 0,
          width: CF_SIZE, height: CF_SIZE * 0.46,
          transform: 'scaleY(-1)', transformOrigin: 'top center',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.4), transparent 62%)',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.4), transparent 62%)',
          pointerEvents: 'none', overflow: 'hidden',
        }}>
          <AlbumArt album={song.album} size={CF_SIZE} />
        </div>
      )}
    </div>
  )
}
