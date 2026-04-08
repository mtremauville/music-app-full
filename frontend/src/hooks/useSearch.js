import { useState, useEffect, useRef, useMemo } from 'react'
import { fetchAllSongs, searchSongs } from '../services/api.js'

export function useSearch() {
  const [query,    setQuery]    = useState('')
  const [allSongs, setAllSongs] = useState([])
  const [cfSongs,  setCfSongs]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    fetchAllSongs()
      .then(data => { setAllSongs(data); setCfSongs(data) })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const q = query.trim()
      if (!q) { setCfSongs(allSongs); return }
      setLoading(true)
      searchSongs(q)
        .then(setCfSongs)
        .catch(e => setError(e.message))
        .finally(() => setLoading(false))
    }, 300)
    return () => clearTimeout(debounceRef.current)
  }, [query, allSongs])

  const matchedIds = useMemo(() => {
    if (!query.trim()) return null
    return new Set(cfSongs.map(s => s.id))
  }, [query, cfSongs])

  return { query, setQuery, cfSongs, allSongs, matchedIds, loading, error }
}
