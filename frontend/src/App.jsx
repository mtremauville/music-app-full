import { useState, useCallback } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import AuthPage   from './pages/AuthPage.jsx'
import Wall       from './components/Wall.jsx'
import CoverFlow  from './components/CoverFlow.jsx'
import SearchBar  from './components/SearchBar.jsx'
import Sidebar    from './components/Sidebar.jsx'
import EditModal  from './components/EditModal.jsx'
import { useSearch } from './hooks/useSearch.js'

const CF_H   = 290
const INFO_H = 62
const SRCH_H = 52
const CF_BOT = SRCH_H + INFO_H

function MainApp() {
  const {
    query, setQuery,
    cfSongs, allAlbums,
    highlightedAlbumIds, selectedAlbumId, selectAlbum,
    loading, reload,
  } = useSearch()

  const [editSong,      setEditSong]      = useState(null)
  const [focusedSongId, setFocusedSongId] = useState(null)

  // Clic sur album → filtre le CoverFlow
  const handleAlbumClick = useCallback((album) => {
    selectAlbum(album)
    // Met en avant la première chanson de l'album dans le CoverFlow
    setFocusedSongId(null)
  }, [selectAlbum])

  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden', background: '#090909' }}>

      {/* Wall — albums */}
      <Wall
        albums={allAlbums}
        highlightedAlbumIds={highlightedAlbumIds}
        selectedAlbumId={selectedAlbumId}
        onAlbumClick={handleAlbumClick}
      />

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'linear-gradient(to bottom, transparent 0%, transparent 18%, rgba(9,9,9,0.82) 52%, #090909 70%)',
      }} />

      {/* Sidebar */}
      <Sidebar onImported={reload} />

      {/* CoverFlow — chansons */}
      <div style={{ position: 'absolute', bottom: CF_BOT, left: 0, right: 0, height: CF_H, zIndex: 10 }}>
        <CoverFlow
          songs={cfSongs}
          onEdit={setEditSong}
          focusedSongId={focusedSongId}
          onFocusHandled={() => setFocusedSongId(null)}
        />
      </div>

      {/* Label album sélectionné */}
      {selectedAlbumId && (
        <div style={{
          position: 'absolute', bottom: CF_BOT + CF_H + 8,
          left: 0, right: 0, zIndex: 11,
          textAlign: 'center', pointerEvents: 'none',
        }}>
          <span style={{
            fontSize: 10, color: 'rgba(255,255,255,0.3)',
            letterSpacing: 1.5, textTransform: 'uppercase',
          }}>
            {cfSongs[0]?.album.artist} — {cfSongs[0]?.album.title}
            <span style={{ marginLeft: 8, opacity: 0.5 }}>· cliquer à nouveau pour tout afficher</span>
          </span>
        </div>
      )}

      {/* SearchBar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20 }}>
        <SearchBar
          query={query}
          onChange={setQuery}
          total={allAlbums.length}
          matched={new Set(cfSongs.map(s => s.album.id)).size}
          loading={loading}
          placeholder="Titre, artiste, album, année…"
        />
      </div>

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

function AppRouter() {
  const { user, loading } = useAuth()
  if (loading) return (
    <div style={{ height: '100vh', background: '#090909', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>
      Chargement…
    </div>
  )
  return user ? <MainApp /> : <AuthPage />
}

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  )
}
