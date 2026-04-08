const BASE     = import.meta.env.VITE_API_URL ?? ''
const BASE_API = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, options)
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`)
  return res.json()
}

export const fetchAllSongs  = () => request('/api/v1/songs')

export const searchSongs = (query) =>
  query.trim()
    ? request(`/api/v1/songs/search?q=${encodeURIComponent(query.trim())}`)
    : fetchAllSongs()

export const importSongs = (folderPath) =>
  request('/api/v1/songs/import', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ folder_path: folderPath }),
  })

export const fetchMetadata = (songId) =>
  request(`/api/v1/songs/${songId}/fetch_metadata`, { method: 'POST' })

export const updateSong = (songId, data) =>
  request(`/api/v1/songs/${songId}`, {
    method:  'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ song: data }),
  })
export const deleteSong = (songId) =>
  request(`/api/v1/songs/${songId}`, { method: 'DELETE' })
// Pointe directement sur Rails :3001 pour éviter les problèmes de proxy sur le streaming
export const streamUrl = (songId) => `${BASE_API}/api/v1/songs/${songId}/stream`
