import React, { useState } from 'react'
import api from '../utils/api'
import { toast } from 'react-toastify'
import heroImg from '../assets/hero.png'

export default function Login() {
  const [email, setEmail] = useState('tarun@gmail.com')
  const [password, setPassword] = useState('tarun7204')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      toast.success('Access Granted. Welcome back, Tarun!')
      window.location.href = '/'
    } catch (err) {
      console.error(err)
      toast.error(err?.response?.data?.message || 'Authentication failed. Please check credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-950 font-sans text-slate-100">
      
      {/* Left side illustration - Only visible on desktop */}
      <div className="hidden lg:flex lg:col-span-7 bg-slate-900 relative overflow-hidden flex-col justify-between p-12 border-r border-slate-800/50">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-soft"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '2s' }}></div>

        {/* Branding header */}
        <div className="relative z-10 flex items-center gap-3">
          <span className="text-2xl">🛣️</span>
          <span className="font-extrabold text-xl tracking-tight text-white">TollWay Systems</span>
        </div>

        {/* Dynamic Image Graphic */}
        <div className="relative z-10 my-auto flex justify-center items-center">
          <div className="relative group max-w-lg">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <img
              src={heroImg}
              alt="Highway Toll Portal Banner"
              className="relative rounded-2xl shadow-2xl border border-slate-800 object-cover w-full h-[360px] animate-fade-in hover:scale-[1.01] transition-transform duration-500"
            />
          </div>
        </div>

        {/* Content Footer */}
        <div className="relative z-10 space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">National Highway Operations Corridor</h2>
          <p className="text-sm text-slate-400 max-w-md">
            Manage electronic toll collections, link fastags, audits lane transactions, and monitor real-time plaza sensors.
          </p>
        </div>
      </div>

      {/* Right side form */}
      <div className="col-span-1 lg:col-span-5 flex items-center justify-center p-8 relative overflow-hidden">
        {/* Glow Effects on Mobile */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl lg:hidden"></div>

        <div className="w-full max-w-md animate-fade-in relative z-10 space-y-8">
          
          {/* Logo / Header for mobile */}
          <div className="text-center lg:text-left space-y-2">
            <div className="inline-flex lg:hidden w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 items-center justify-center text-white text-2xl shadow-lg shadow-blue-500/20 mb-3 animate-bounce-short">
              🛣️
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">System Login</h1>
            <p className="text-slate-400 text-sm">Please authenticate to gain admin controls.</p>
          </div>

          {/* Form Card */}
          <div className="glass-card bg-slate-900/50 border border-slate-800/80 shadow-2xl rounded-2xl p-8 backdrop-blur-xl">
            <form onSubmit={submit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Administrator Email
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3.5 text-slate-400">📧</span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950/80 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                    placeholder="admin@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Secure Password
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3.5 text-slate-400">🔒</span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950/80 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6 text-sm"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <span>Access Administrative Portal</span>
                )}
              </button>
            </form>
          </div>

          <p className="text-center lg:text-left text-[11px] text-slate-500">
            Authorized admin gateway. System audits active.
          </p>
        </div>
      </div>
    </div>
  )
}
