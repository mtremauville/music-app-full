import Wall      from './components/Wall.jsx'
import CoverFlow from './components/CoverFlow.jsx'
import SearchBar from './components/SearchBar.jsx'
import { useSearch } from './hooks/useSearch.js'

const SEARCHBAR_H = 52
const CF_H        = 272
const INFO_H      = 56
const CF_BOTTOM   = SEARCHBAR_H + INFO_H

export default function App() {
  const { query, setQuery, cfSongs, allSongs, matchedIds, loading, error } = useSearch()

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
      <Wall songs={allSongs} matchedIds={matchedIds} />
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', background: 'linear-gradient(to bottom, transparent 0%, transparent 18%, rgba(9,9,9,0.82) 52%, #090909 70%)' }} />
      <div style={{ position: 'absolute', bottom: CF_BOTTOM, left: 0, right: 0, height: CF_H, zIndex: 10 }}>
        <CoverFlow songs={cfSongs} />
      </div>
      <SearchBar query={query} onChange={setQuery} total={allSongs.length} matched={cfSongs.length} loading={loading} />
    </div>
  )
}
