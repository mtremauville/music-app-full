import { useState, useEffect, useRef } from 'react'

export default function Player({ song, onClose }) {
  const audioRef            = useRef(null)
  const [playing,  setPlaying]  = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume,   setVolume]   = useState(1)
  const [error,    setError]    = useState(null)

  useEffect(() => {
    if (!song?.stream_url) return
    const audio = audioRef.current
    setError(null)
    setProgress(0)

    audio.src = song.stream_url
    audio.load()

    const onCanPlay = () => {
      audio.play()
        .then(() => setPlaying(true))
        .catch(e => setError("Lecture impossible : " + e.message))
    }
    const onError = (e) => {
      console.error('Audio error:', audio.error)
      setError("Fichier audio introuvable ou format non supporté")
      setPlaying(false)
    }

    audio.addEventListener('canplay', onCanPlay)
    audio.addEventListener('error', onError)
    return () => {
      audio.removeEventListener('canplay', onCanPlay)
      audio.removeEventListener('error', onError)
      audio.pause()
      setPlaying(false)
    }
  }, [song?.stream_url])

  const togglePlay = () => {
    const audio = audioRef.current
    if (playing) { audio.pause(); setPlaying(false) }
    else { audio.play().then(() => setPlaying(true)).catch(e => setError(e.message)) }
  }

  const fmt = (s) => {
    if (!s || isNaN(s)) return '0:00'
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
  }

  const pct = duration > 0 ? (progress / duration) * 100 : 0

  if (!song) return null

  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(10,10,10,0.97)', borderTop: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(24px)', padding: '10px 20px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <audio
        ref={audioRef}
        onTimeUpdate={() => { setProgress(audioRef.current.currentTime); setDuration(audioRef.current.duration || 0) }}
        onEnded={() => setPlaying(false)}
        onLoadedMetadata={() => setDuration(audioRef.current.duration)}
      />

      {error && <div style={{ fontSize: 11, color: '#ff6b6b', textAlign: 'center' }}>{error}</div>}

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', minWidth: 32 }}>{fmt(progress)}</span>
        <div style={{ flex: 1, position: 'relative', height: 3, background: 'rgba(255,255,255,0.12)', borderRadius: 2 }}>
          <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${pct}%`, background: 'rgba(255,255,255,0.7)', borderRadius: 2 }} />
          <input type="range" min="0" max="100" step="0.1" value={pct}
            onChange={e => { const t = (e.target.value / 100) * duration; audioRef.current.currentTime = t; setProgress(t) }}
            style={{ position: 'absolute', inset: 0, width: '100%', opacity: 0, cursor: 'pointer', height: '100%' }}
          />
        </div>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', minWidth: 32, textAlign: 'right' }}>{fmt(duration)}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{song.title}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{song.album.artist} · {song.album.title}</div>
        </div>
        <button onClick={togglePlay} style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none', color: '#080808', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {playing ? '⏸' : '▶'}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>🔈</span>
          <input type="range" min="0" max="1" step="0.05" value={volume}
            onChange={e => { const v = parseFloat(e.target.value); audioRef.current.volume = v; setVolume(v) }}
            style={{ width: 70, accentColor: 'rgba(255,255,255,0.7)' }}
          />
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 20, flexShrink: 0 }}>×</button>
      </div>
    </div>
  )
}
