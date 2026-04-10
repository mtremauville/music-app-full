import { useState } from 'react'
import { login, signup } from '../services/auth.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function AuthPage() {
  const { setUser } = useAuth()
  const [mode,     setMode]     = useState('login')
  const [email,    setEmail]    = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState(null)
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = mode === 'login'
        ? await login({ email, password })
        : await signup({ email, username, password })
      setUser(res.user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 8, color: '#fff', fontSize: 14,
    outline: 'none', marginBottom: 12,
    fontFamily: '-apple-system, Helvetica Neue, sans-serif',
    transition: 'border-color 0.15s',
  }

  return (
    <div style={{
      height: '100vh', width: '100vw',
      background: '#090909',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: '-apple-system, Helvetica Neue, sans-serif',
      color: '#fff',
    }}>
      {/* Logo */}
      <div style={{ marginBottom: 40, textAlign: 'center' }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>🎵</div>
        <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: -0.5, marginBottom: 4 }}>
          Music CoverFlow
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
          Ta bibliothèque musicale personnelle
        </p>
      </div>

      {/* Card */}
      <div style={{
        background: '#1a1a1a',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 16, padding: '32px 28px',
        width: 360, maxWidth: '90vw',
      }}>
        {/* Tabs */}
        <div style={{
          display: 'flex', background: 'rgba(255,255,255,0.06)',
          borderRadius: 8, padding: 3, marginBottom: 24,
        }}>
          {['login', 'signup'].map(m => (
            <button key={m} onClick={() => { setMode(m); setError(null) }} style={{
              flex: 1, padding: '7px 0', border: 'none', borderRadius: 6,
              cursor: 'pointer', fontSize: 13, fontWeight: 500,
              transition: 'all 0.2s',
              background: mode === m ? 'rgba(255,255,255,0.12)' : 'transparent',
              color: mode === m ? '#fff' : 'rgba(255,255,255,0.4)',
            }}>
              {m === 'login' ? 'Connexion' : 'Inscription'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="email" placeholder="Email" value={email}
            onChange={e => setEmail(e.target.value)}
            required style={inputStyle}
          />
          {mode === 'signup' && (
            <input
              type="text" placeholder="Nom d'utilisateur" value={username}
              onChange={e => setUsername(e.target.value)}
              required style={inputStyle}
            />
          )}
          <input
            type="password" placeholder="Mot de passe" value={password}
            onChange={e => setPassword(e.target.value)}
            required style={{ ...inputStyle, marginBottom: 20 }}
          />

          {error && (
            <div style={{ color: '#ff6b6b', fontSize: 12, marginBottom: 14, textAlign: 'center' }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '12px 0',
            background: loading ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.9)',
            color: loading ? 'rgba(255,255,255,0.3)' : '#080808',
            border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.15s',
          }}>
            {loading
              ? '…'
              : mode === 'login' ? 'Se connecter' : 'Créer un compte'
            }
          </button>
        </form>
      </div>
    </div>
  )
}
