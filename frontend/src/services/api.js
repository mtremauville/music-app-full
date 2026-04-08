const BASE = import.meta.env.VITE_API_URL ?? ''

async function request(path) {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`)
  return res.json()
}

export function fetchAllSongs() {
  return request('/api/v1/songs')
}

export function searchSongs(query) {
  if (!query.trim()) return fetchAllSongs()
  return request(`/api/v1/songs/search?q=${encodeURIComponent(query.trim())}`)
}
