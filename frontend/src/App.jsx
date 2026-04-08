import { useState, useCallback } from 'react'
import Wall        from './components/Wall.jsx'
import CoverFlow   from './components/CoverFlow.jsx'
import SearchBar   from './components/SearchBar.jsx'
import Player      from './components/Player.jsx'
import ImportModal from './components/ImportModal.jsx'
import EditModal   from './components/EditModal.jsx'
import { useSearch } from './hooks/useSearch.js'

const SEARCHBAR_H = 52
const PLAYER_H    = 88
const CF_H        = 290
const INFO_H      = 62

export default function App() {
  const { query, setQuery, cfSongs, allSongs, matchedIds, loading, error, reload } = useSearch()

  const [currentSong,   setCurrentSong]   = useState(null)
  const [editSong,      setEditSong]      = useState(null)
  const [showImport,    setShowImport]    = useState(false)
  const [focusedSongId, setFocusedSongId] = useState(null)

  // CF_BOTTOM s'adapte selon que le player est ouvert ou non
  const playerOpen = !!currentSong
  const cfBottom   = SEARCHBAR_H + INFO_H + (playerOpen ? PLAYER_H : 0)

  const handlePlay = useCallback((song) => {
    if (!song.stream_url) {
      alert("Ce titre n'a pas de fichier audio.")
      return
    }
    setCurrentSong(song)
  }, [])

  const handleImported = useCallback(() => {
    setShowImport(false)
    reload()
  }, [reload])

  const handleWallSongClick = useCallback((song) => {
    const isInCf = cfSongs.some(s => s.id === song.id)
    if (!isInCf) setQuery('')
    setFocusedSongId(song.id)
  }, [cfSongs, setQuery])

  if (error) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, color: 'rgba(255,255,255,0.5)', fontFamily: '-apple-system, Helvetica Neue, sans-serif' }}>
        <span style={{ fontSize: 28 }}>⚠️</span>
        <p style={{ fontSize: 14 }}>Impossible de joindre l'API Rails.</p>
        <code style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.06)', padding: '4px 10px', borderRadius: 6 }}>{error}</code>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>Vérifie que le serveur Rails tourne sur :3001</p>
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden', background: '#090909' }}>

      {/* Wall */}
      <Wall songs={allSongs} matchedIds={matchedIds} onSongClick={handleWallSongClick} />

      {/* Gradient overlay */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', background: 'linear-gradient(to bottom, transparent 0%, transparent 18%, rgba(9,9,9,0.82) 52%, #090909 70%)' }} />

      {/* Bouton import */}
      <button
        onClick={() => setShowImport(true)}
        style={{
          position: 'absolute', top: 16, right: 16, zIndex: 15,
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.14)',
          color: 'rgba(255,255,255,0.6)',
          borderRadius: 8, padding: '7px 14px',
          fontSize: 12, cursor: 'pointer',
        }}
      >
        ＋ Importer MP3
      </button>

      {/* CoverFlow — position dynamique selon player */}
      <div style={{
        position: 'absolute',
        bottom: cfBottom,
        left: 0, right: 0,
        height: CF_H,
        zIndex: 10,
        transition: 'bottom 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
      }}>
        <CoverFlow
          songs={cfSongs}
          
          onEdit={setEditSong}
          focusedSongId={focusedSongId}
          onFocusHandled={() => setFocusedSongId(null)}
        />
      </div>

      {/* SearchBar — remonte quand le player est ouvert */}
      <div style={{
        position: 'absolute',
        bottom: playerOpen ? PLAYER_H : 0,
        left: 0, right: 0,
        zIndex: 20,
        transition: 'bottom 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
      }}>
        <SearchBar
          query={query}
          onChange={setQuery}
          total={allSongs.length}
          matched={cfSongs.length}
          loading={loading}
        />
      </div>

      {/* Player */}
      {currentSong && (
        <Player song={currentSong} onClose={() => setCurrentSong(null)} />
      )}

      {/* Modals */}
      {showImport && (
        <ImportModal onClose={() => setShowImport(false)} onImported={handleImported} />
      )}
      {editSong && (
        <EditModal
          song={editSong}
          onClose={() => setEditSong(null)}
          onSaved={reload}
          onDeleted={reload}
        />
      )}

    </div>
  )
}
