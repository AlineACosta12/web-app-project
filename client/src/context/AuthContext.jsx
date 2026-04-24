// MoodPlay — auth context, keeps login state available across the whole app
// Byron Gift Ochieng Makasembo | 3062457

import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // on first load, restore session from localStorage (mock)
  // when integrating with backend: call GET /api/auth/me instead
  // the backend sets an httpOnly cookie on login, so /me will validate it automatically
  useEffect(() => {
    const saved = localStorage.getItem('moodplay_user')
    if (saved) {
      setUser(JSON.parse(saved))
    }
    setLoading(false)
  }, [])

  // maps to POST /api/auth/login on the backend
  // backend sets an httpOnly cookie with the JWT - response body has { message, user }
  // real call: const res = await axiosInstance.post('/api/auth/login', { email, password })
  //            then: setUser(res.data.user)
  const login = async (email, password) => {
    if (!email || !password) throw new Error('Missing credentials')
    const mockUser = { id: '1', username: email.split('@')[0], email }
    localStorage.setItem('moodplay_user', JSON.stringify(mockUser))
    setUser(mockUser)
    return mockUser
  }

  // maps to POST /api/auth/register
  // same pattern - backend sets the cookie and returns { message, user }
  // real call: const res = await axiosInstance.post('/api/auth/register', { username, email, password })
  //            then: setUser(res.data.user)
  const register = async (username, email, password) => {
    if (!username || !email || !password) throw new Error('Missing fields')
    const mockUser = { id: '2', username, email }
    localStorage.setItem('moodplay_user', JSON.stringify(mockUser))
    setUser(mockUser)
    return mockUser
  }

  const logout = () => {
    // real call: await axiosInstance.post('/api/auth/logout') to clear server session + cookie
    localStorage.removeItem('moodplay_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

// custom hook so components don't import AuthContext directly
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
