import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { fetchAllSongs, searchSongs } from '../services/api.js'

export function useSearch() {
  const [query,       setQuery]       = useState('')
  const [allSongs,    setAllSongs]    = useState([])
  const [cfSongs,     setCfSongs]     = useState([])
  const [selectedAlbumId, setSelectedAlbumId] = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState(null)
  const debounceRef = useRef(null)

  const loadAll = useCallback(() => {
    setLoading(true)
    fetchAllSongs()
      .then(data => { setAllSongs(data); setCfSongs(data) })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { loadAll() }, [loadAll])

  // Filtre par recherche texte (debounce 300ms)
  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const q = query.trim()
      let base = selectedAlbumId
        ? allSongs.filter(s => s.album.id === selectedAlbumId)
        : allSongs

      if (!q) { setCfSongs(base); return }

      setLoading(true)
      searchSongs(q)
        .then(results => {
          // Si un album est sélectionné, on croise avec la recherche
          if (selectedAlbumId) {
            setCfSongs(results.filter(s => s.album.id === selectedAlbumId))
          } else {
            setCfSongs(results)
          }
        })
        .catch(e => setError(e.message))
        .finally(() => setLoading(false))
    }, 300)
    return () => clearTimeout(debounceRef.current)
  }, [query, allSongs, selectedAlbumId])

  // Clic sur un album dans le wall
  const selectAlbum = useCallback((album) => {
    if (selectedAlbumId === album.id) {
      // Deuxième clic → désélectionne, revient à tout
      setSelectedAlbumId(null)
      setCfSongs(allSongs)
    } else {
      setSelectedAlbumId(album.id)
      setCfSongs(allSongs.filter(s => s.album.id === album.id))
      setQuery('')
    }
  }, [selectedAlbumId, allSongs])

  // Tous les albums dédoublonnés
  const allAlbums = useMemo(() => {
    const seen = new Map()
    allSongs.forEach(s => {
      if (!seen.has(s.album.id)) seen.set(s.album.id, s.album)
    })
    return Array.from(seen.values())
  }, [allSongs])

  // Albums mis en avant (ceux qui ont des chansons dans cfSongs)
  const highlightedAlbumIds = useMemo(() => {
    if (!query.trim() && !selectedAlbumId) return null
    return new Set(cfSongs.map(s => s.album.id))
  }, [query, cfSongs, selectedAlbumId])

  return {
    query, setQuery,
    cfSongs, allSongs, allAlbums,
    highlightedAlbumIds, selectedAlbumId, selectAlbum,
    loading, error, reload: loadAll,
  }
}
