// MoodPlay — axios instance, attaches JWT to every request automatically
// Byron Gift Ochieng Makasembo | 3062457

import axios from 'axios'

// base URL comes from .env, falls back to local dev server
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001',
  timeout: 10000,
  // needed so the browser sends the httpOnly auth cookie on cross-origin requests
  withCredentials: true,
})

// attach the stored token to every outgoing request
// the backend also accepts it via the httpOnly cookie but this covers both methods
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('moodplay_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// if the server says 401, session is expired - clear storage and send to login
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('moodplay_token')
      localStorage.removeItem('moodplay_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default axiosInstance
