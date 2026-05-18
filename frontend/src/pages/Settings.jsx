import React, { useState } from 'react'
import { toast } from 'react-toastify'

export default function Settings() {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [theme, setTheme] = useState(document.documentElement.classList.contains('dark') ? 'dark' : 'light')
  
  const [tariffs, setTariffs] = useState([
    { type: 'bike', label: '🏍️ Motorcycle / Bike', fee: 20 },
    { type: 'car', label: '🚗 Car / Jeep / SUV', fee: 50 },
    { type: 'bus', label: '🚌 Bus / Mini Bus', fee: 100 },
    { type: 'truck', label: '🚛 Heavy Truck / LCV', fee: 120 }
  ])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    toast.success('Logged out successfully.')
    window.location.href = '/login'
  }

  const toggleTheme = (selectedTheme) => {
    if (selectedTheme === 'dark') {
      document.documentElement.classList.add('dark')
      setTheme('dark')
    } else {
      document.documentElement.classList.remove('dark')
      setTheme('light')
    }
    toast.info(`Theme toggled to ${selectedTheme} mode.`)
  }

  const handleUpdateFee = (type, newFee) => {
    setTariffs(prev => prev.map(t => t.type === type ? { ...t, fee: Number(newFee) } : t))
    toast.success(`Tariff updated for ${type}!`)
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Configure toll plaza tariffs, preferences, and view administrative details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="space-y-6 md:col-span-2">
          {/* Tariff Config */}
          <div className="card space-y-4">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100">Fare & Tariff Configuration</h3>
              <p className="text-xs text-slate-400 mt-1">Manage rate limits (Calculated automatically at exit gates).</p>
            </div>
            
            <div className="space-y-3 pt-2">
              {tariffs.map(t => (
                <div key={t.type} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200/50 dark:border-slate-700/50 gap-4">
                  <div className="font-semibold text-sm text-slate-700 dark:text-slate-300">{t.label}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-bold">₹</span>
                    <input
                      type="number"
                      value={t.fee}
                      onChange={e => handleUpdateFee(t.type, e.target.value)}
                      className="input w-24 px-2 py-1 text-center font-bold"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preferences */}
          <div className="card space-y-4">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100">Interface Personalization</h3>
              <p className="text-xs text-slate-400 mt-1">Toggle between color modes for optimized dashboard viewing.</p>
            </div>
            
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => toggleTheme('light')}
                className={`flex-1 py-3 px-4 rounded-xl border text-center font-semibold text-sm transition-all ${
                  theme === 'light'
                    ? 'border-blue-500 bg-blue-50/50 text-blue-600 dark:text-blue-400 font-bold shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                ☀️ Light Mode
              </button>
              <button
                onClick={() => toggleTheme('dark')}
                className={`flex-1 py-3 px-4 rounded-xl border text-center font-semibold text-sm transition-all ${
                  theme === 'dark'
                    ? 'border-blue-500 bg-blue-900/20 text-blue-400 font-bold shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                🌙 Dark Mode
              </button>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Admin Profile Details */}
          <div className="card text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold mx-auto shadow-md">
              {(user.name || 'A')[0].toUpperCase()}
            </div>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100">{user.name || 'Admin'}</h4>
              <p className="text-xs text-slate-400 capitalize mt-0.5">{user.role || 'administrator'}</p>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-700/50 pt-4 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Primary Email:</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{user.email || 'admin@example.com'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Node Environment:</span>
                <span className="font-mono text-emerald-500">production</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Database Engine:</span>
                <span className="font-mono text-blue-500">MongoDB</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full btn btn-danger py-2.5 mt-4 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2"
            >
              🚪 Secure Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
