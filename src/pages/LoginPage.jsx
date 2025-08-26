import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmail, signUpWithEmail } from '../firebase/firebase'

export default function LoginPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('signin') // signin | signup
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'signup') {
        await signUpWithEmail({ email, password, displayName: name })
      } else {
        await signInWithEmail({ email, password })
      }
      navigate('/')
    } catch (err) {
      setError(err?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#F3F2EF' }}>
      <div style={{ maxWidth: 420, width: '100%', padding: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <div style={{ fontWeight: 900, color: '#0A66C2', fontSize: 28 }}>in</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>LinkedIn Demo</div>
        </div>
        <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: 12, padding: 24, boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>{mode === 'signup' ? 'Join now' : 'Sign in'}</h1>
          <p style={{ color: '#666', marginBottom: 16 }}>{mode === 'signup' ? 'Make the most of your professional life' : 'Stay updated on your world'}</p>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
            {mode === 'signup' && (
              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#666', marginBottom: 6 }}>Full name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required style={{ width: '100%', border: '1px solid #ddd', borderRadius: 8, padding: '10px 12px' }} />
              </div>
            )}
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#666', marginBottom: 6 }}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required style={{ width: '100%', border: '1px solid #ddd', borderRadius: 8, padding: '10px 12px' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#666', marginBottom: 6 }}>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required style={{ width: '100%', border: '1px solid #ddd', borderRadius: 8, padding: '10px 12px' }} />
            </div>
            {error && <div style={{ color: '#B3261E', fontSize: 12 }}>{error}</div>}
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px 16px', background: '#0A66C2', color: 'white', border: 0, borderRadius: 999, fontWeight: 700, marginTop: 4, opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Please wait…' : (mode === 'signup' ? 'Agree & Join' : 'Sign in')}
            </button>
          </form>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12 }}>
            <span style={{ color: '#666' }}>{mode === 'signup' ? 'Already on LinkedIn?' : 'New to LinkedIn?'}</span>
            <button onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')} style={{ color: '#0A66C2', background: 'transparent', border: 0, fontWeight: 700 }}>
              {mode === 'signup' ? 'Sign in' : 'Join now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


