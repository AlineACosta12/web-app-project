// MoodPlay — login page with form validation
// Byron Gift Ochieng Makasembo | 3062457

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './auth.css'

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [serverErr, setServerErr] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    // clear the error for this field as the user types
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  // client-side validation before hitting the backend
  const validate = () => {
    const errs = {}
    if (!form.email.trim()) {
      errs.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Please enter a valid email address'
    }
    if (!form.password) {
      errs.password = 'Password is required'
    }
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerErr('')

    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setSubmitting(true)
    try {
      await login(form.email, form.password)
      navigate('/')
    } catch (err) {
      // backend returns { message: "..." } on error
      setServerErr(err.response?.data?.message || 'Login failed, please try again')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <span className="auth-logo">MoodPlay</span>
        <p className="auth-sub">Log in to your account</p>

        {serverErr && <div className="server-error">{serverErr}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={errors.email ? 'has-error' : ''}
              autoComplete="email"
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={errors.password ? 'has-error' : ''}
              autoComplete="current-password"
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <button type="submit" className="btn-submit" disabled={submitting}>
            {submitting ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
