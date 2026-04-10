import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import ImportModal from './ImportModal.jsx'

export default function Sidebar({ onImported }) {
  const { user, logout } = useAuth()
  const [open,        setOpen]       = useState(false)
  const [showImport,  setShowImport] = useState(false)
  const [showAccount, setShowAccount] = useState(false)

  return (
    <>
      {/* Bouton ☰ — toujours visible */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', top: 16, left: 16, zIndex: 200,
          width: 36, height: 36, borderRadius: 8,
          background: open ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16,
        }}
      >
        {open ? '✕' : '☰'}
      </button>

      {/* Overlay sombre */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 150,
            background: 'rgba(0,0,0,0.5)',
          }}
        />
      )}

      {/* Panel latéral */}
      <div style={{
        position: 'fixed', top: 0, left: 0, bottom: 0,
        width: 260, zIndex: 160,
        background: '#141414',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
        display: 'flex', flexDirection: 'column',
        fontFamily: '-apple-system, Helvetica Neue, sans-serif',
        color: '#fff',
      }}>

        {/* Header */}
        <div style={{
          padding: '64px 20px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}>
          <div style={{ fontSize: 20, marginBottom: 6 }}>🎵</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>
            Music CoverFlow
          </div>
        </div>

        {/* Navigation */}
        <nav style={{
          flex: 1, padding: '16px 12px',
          display: 'flex', flexDirection: 'column', gap: 4,
          overflowY: 'auto',
        }}>
          <MenuItem
            icon="📁"
            label="Importer des MP3"
            onClick={() => { setShowImport(true); setOpen(false) }}
          />

          <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '8px 4px' }} />

          <MenuItem
            icon="👤"
            label={user?.username || 'Mon compte'}
            sublabel={user?.email}
            onClick={() => setShowAccount(a => !a)}
          />

          {showAccount && (
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              borderRadius: 8, padding: '12px 14px', margin: '4px 0',
            }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>Email</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 10 }}>{user?.email}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>Utilisateur</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>{user?.username}</div>
            </div>
          )}
        </nav>

        {/* Logout */}
        <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <button
            onClick={logout}
            style={{
              width: '100%', padding: '10px 0',
              background: 'transparent',
              border: '1px solid rgba(255,100,100,0.3)',
              color: 'rgba(255,100,100,0.7)',
              borderRadius: 8, fontSize: 13, cursor: 'pointer',
              fontFamily: 'inherit', transition: 'all 0.15s',
            }}
          >
            Déconnexion
          </button>
        </div>
      </div>

      {showImport && (
        <ImportModal
          onClose={() => setShowImport(false)}
          onImported={() => { setShowImport(false); onImported?.() }}
        />
      )}
    </>
  )
}

function MenuItem({ icon, label, sublabel, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '9px 10px', borderRadius: 8,
        background: 'none', border: 'none',
        color: 'rgba(255,255,255,0.75)',
        cursor: 'pointer', textAlign: 'left', width: '100%',
        fontFamily: 'inherit', transition: 'background 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
      onMouseLeave={e => e.currentTarget.style.background = 'none'}
    >
      <span style={{ fontSize: 15, flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {label}
        </div>
        {sublabel && (
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 1 }}>
            {sublabel}
          </div>
        )}
      </div>
    </button>
  )
}
