import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './firebase/AuthContext'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'

function ProtectedRoute({ children }) {
  const { user, initializing } = useAuth()
  if (initializing) return null
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  )
}


