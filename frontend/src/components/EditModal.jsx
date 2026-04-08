import { useState } from 'react'
import { updateSong, fetchMetadata, deleteSong } from '../services/api.js'

export default function EditModal({ song, onClose, onSaved, onDeleted }) {
  const [form, setForm] = useState({
    title:       song.title,
    artist:      song.album.artist,
    album_title: song.album.title,
    year:        song.album.year,
  })
  const [loading,   setLoading]   = useState(false)
  const [fetching,  setFetching]  = useState(false)
  const [deleting,  setDeleting]  = useState(false)
  const [confirm,   setConfirm]   = useState(false)
  const [error,     setError]     = useState(null)

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleFetchMetadata = async () => {
    setFetching(true)
    setError(null)
    try {
      const updated = await fetchMetadata(song.id)
      setForm({
        title:       updated.title,
        artist:      updated.album.artist,
        album_title: updated.album.title,
        year:        updated.album.year,
      })
    } catch {
      setError('Aucune métadonnée trouvée sur MusicBrainz')
    } finally {
      setFetching(false)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    setError(null)
    try {
      await updateSong(song.id, form)
      onSaved()
      onClose()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm) {
      setConfirm(true)
      return
    }
    setDeleting(true)
    try {
      await deleteSong(song.id)
      onDeleted()
      onClose()
    } catch (e) {
      setError(e.message)
      setDeleting(false)
    }
  }

  const Field = ({ label, value, onChange, type = 'text' }) => (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', letterSpacing: 1.2, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', padding: '9px 12px',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 7, color: '#fff', fontSize: 14, outline: 'none',
        }}
      />
    </div>
  )

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(8px)',
    }}>
      <div style={{
        background: '#1a1a1a', borderRadius: 14,
        border: '1px solid rgba(255,255,255,0.1)',
        padding: 28, width: 420, maxWidth: '90vw',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,0.88)' }}>Modifier</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 20 }}>×</button>
        </div>

        <Field label="Titre"   value={form.title}       onChange={v => set('title', v)} />
        <Field label="Artiste" value={form.artist}      onChange={v => set('artist', v)} />
        <Field label="Album"   value={form.album_title} onChange={v => set('album_title', v)} />
        <Field label="Année"   value={form.year}        onChange={v => set('year', v)} type="number" />

        {error && (
          <div style={{ color: '#ff6b6b', fontSize: 12, marginBottom: 12 }}>{error}</div>
        )}

        {/* Récupérer métadonnées */}
        <button
          onClick={handleFetchMetadata}
          disabled={fetching}
          style={{
            width: '100%', padding: '9px 0', marginBottom: 10,
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.18)',
            color: 'rgba(255,255,255,0.65)',
            borderRadius: 8, fontSize: 13, cursor: 'pointer',
          }}
        >
          {fetching ? 'Recherche MusicBrainz…' : '🔍 Récupérer les métadonnées'}
        </button>

        {/* Enregistrer */}
        <button
          onClick={handleSave}
          disabled={loading}
          style={{
            width: '100%', padding: '11px 0', marginBottom: 10,
            background: 'rgba(255,255,255,0.88)', color: '#080808',
            border: 'none', borderRadius: 8, fontSize: 14,
            fontWeight: 700, cursor: 'pointer',
          }}
        >
          {loading ? 'Enregistrement…' : 'Enregistrer'}
        </button>

        {/* Supprimer */}
        <button
          onClick={handleDelete}
          disabled={deleting}
          style={{
            width: '100%', padding: '9px 0',
            background: confirm ? 'rgba(220,50,50,0.85)' : 'transparent',
            border: `1px solid ${confirm ? 'rgba(220,50,50,0.8)' : 'rgba(255,80,80,0.3)'}`,
            color: confirm ? '#fff' : 'rgba(255,100,100,0.7)',
            borderRadius: 8, fontSize: 13, cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {deleting ? 'Suppression…' : confirm ? '⚠️ Confirmer la suppression' : '🗑 Supprimer cette chanson'}
        </button>

        {confirm && (
          <div style={{ marginTop: 8, textAlign: 'center' }}>
            <button
              onClick={() => setConfirm(false)}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', fontSize: 12 }}
            >
              Annuler
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
