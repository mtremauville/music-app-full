import { useState, useRef } from 'react'

export default function ImportModal({ onClose, onImported }) {
  const [files,   setFiles]   = useState([])
  const [loading, setLoading] = useState(false)
  const [result,  setResult]  = useState(null)
  const [error,   setError]   = useState(null)
  const inputRef = useRef(null)

  const handleFolderSelect = (e) => {
    const mp3s = Array.from(e.target.files).filter(f => f.name.endsWith('.mp3'))
    setFiles(mp3s)
    setResult(null)
    setError(null)
  }

  const handleImport = async () => {
    if (files.length === 0) return
    setLoading(true)
    setError(null)

    const formData = new FormData()
    files.forEach(f => formData.append('files[]', f))

    try {
      const res = await fetch('/api/v1/songs/import', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) throw new Error(`Erreur serveur ${res.status}`)
      const data = await res.json()
      setResult(data)
      onImported()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

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
        padding: 28, width: 440, maxWidth: '90vw',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,0.88)' }}>
            Importer des MP3
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 20 }}>×</button>
        </div>

        {/* Zone de sélection */}
        <input
          ref={inputRef}
          type="file"
          webkitdirectory="true"
          multiple
          accept=".mp3"
          onChange={handleFolderSelect}
          style={{ display: 'none' }}
        />

        <div
          onClick={() => inputRef.current?.click()}
          style={{
            border: '2px dashed rgba(255,255,255,0.15)',
            borderRadius: 10,
            padding: '28px 20px',
            textAlign: 'center',
            cursor: 'pointer',
            marginBottom: 18,
            transition: 'border-color 0.15s, background 0.15s',
            background: files.length > 0 ? 'rgba(255,255,255,0.04)' : 'transparent',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
        >
          {files.length === 0 ? (
            <>
              <div style={{ fontSize: 28, marginBottom: 10 }}>📁</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>
                Cliquer pour choisir un dossier
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
                Tous les MP3 du dossier seront importés
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 28, marginBottom: 10 }}>🎵</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', marginBottom: 4 }}>
                {files.length} fichier{files.length > 1 ? 's' : ''} MP3 sélectionné{files.length > 1 ? 's' : ''}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
                Cliquer pour changer de dossier
              </div>
            </>
          )}
        </div>

        {/* Liste aperçu (max 5) */}
        {files.length > 0 && (
          <div style={{ marginBottom: 16, maxHeight: 110, overflowY: 'auto' }}>
            {files.slice(0, 5).map((f, i) => (
              <div key={i} style={{
                fontSize: 11, color: 'rgba(255,255,255,0.45)',
                padding: '3px 0',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                🎵 {f.name}
              </div>
            ))}
            {files.length > 5 && (
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', padding: '3px 0' }}>
                + {files.length - 5} autre{files.length - 5 > 1 ? 's' : ''}…
              </div>
            )}
          </div>
        )}

        {/* Résultat */}
        {result && (
          <div style={{
            background: 'rgba(255,255,255,0.05)', borderRadius: 8,
            padding: '10px 14px', marginBottom: 16, fontSize: 13,
          }}>
            <div style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>
              ✓ {result.imported} importées · {result.updated} mises à jour
            </div>
            {result.errors?.length > 0 && (
              <div style={{ color: '#ff9f43', fontSize: 11 }}>
                {result.errors.length} erreur(s) : {result.errors[0]}
              </div>
            )}
          </div>
        )}

        {error && (
          <div style={{ color: '#ff6b6b', fontSize: 12, marginBottom: 12 }}>{error}</div>
        )}

        {/* Bouton importer */}
        <button
          onClick={handleImport}
          disabled={loading || files.length === 0}
          style={{
            width: '100%', padding: '11px 0',
            background: files.length === 0 ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.88)',
            color: files.length === 0 ? 'rgba(255,255,255,0.25)' : '#080808',
            border: 'none', borderRadius: 8,
            fontSize: 14, fontWeight: 700,
            cursor: files.length === 0 ? 'not-allowed' : 'pointer',
            transition: 'background 0.15s',
          }}
        >
          {loading ? `Import en cours… (${files.length} fichiers)` : `Importer ${files.length > 0 ? files.length + ' fichiers' : ''}`}
        </button>
      </div>
    </div>
  )
}
