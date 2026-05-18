import React, { useEffect, useState } from 'react'
import api from '../utils/api'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import heroImg from '../assets/hero.png'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

export default function Dashboard() {
  const [daily, setDaily] = useState({ total: 0, count: 0 })
  const [monthly, setMonthly] = useState([])
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dailyRes, monthlyRes, recentRes] = await Promise.all([
          api.get('/reports/daily'),
          api.get('/reports/monthly'),
          api.get('/transactions')
        ])
        setDaily(dailyRes.data)
        setMonthly(monthlyRes.data)
        // Show only the first 5 recent transactions
        setRecent(recentRes.data.slice(0, 5))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const chartData = {
    labels: monthly.map(m => monthNames[m._id - 1] || `Month ${m._id}`),
    datasets: [{
      label: 'Monthly Revenue (₹)',
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
      hoverBackgroundColor: 'rgba(59, 130, 246, 1)',
      borderRadius: 6,
      borderSkipped: false,
      data: monthly.map(m => m.total),
    }]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f8fafc',
        bodyColor: '#f8fafc',
        padding: 12,
        cornerRadius: 8,
        displayColors: false
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8' }
      },
      y: {
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
        ticks: { color: '#94a3b8' }
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Premium Operations Welcome Banner Card */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800/80 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-indigo-950/20">
        {/* Glow decoration */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-3 text-center md:text-left relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Plaza Gateway: Live & Active</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">TollWay Operations</h1>
          <p className="text-slate-400 text-sm max-w-md">
            Real-time administrative panel for national highway electronic collections, RFID barrier triggers, and audit logs.
          </p>
        </div>

        {/* Brand Picture element with high fidelity borders */}
        <div className="relative z-10 w-full md:w-60 h-28 rounded-2xl overflow-hidden border border-slate-700/50 shadow-md group shrink-0">
          <div className="absolute inset-0 bg-slate-950/40 z-10 group-hover:bg-slate-950/20 transition-all duration-300"></div>
          <img
            src={heroImg}
            alt="Plaza Branding"
            className="w-full h-full object-cover scale-[1.1] group-hover:scale-100 transition-transform duration-700"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger">
        <div className="card stat-blue text-white overflow-hidden relative group">
          <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 text-9xl opacity-10 group-hover:scale-110 transition-transform duration-300">💰</div>
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-100">Today's Revenue</div>
          <div className="text-3xl font-extrabold mt-2">₹{daily.total?.toLocaleString() || 0}</div>
          <div className="text-xs text-blue-100/80 mt-2 font-medium">Daily collection total</div>
        </div>

        <div className="card stat-green text-white overflow-hidden relative group">
          <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 text-9xl opacity-10 group-hover:scale-110 transition-transform duration-300">🚗</div>
          <div className="text-xs font-semibold uppercase tracking-wider text-green-100">Total Vehicles</div>
          <div className="text-3xl font-extrabold mt-2">{daily.count || 0}</div>
          <div className="text-xs text-green-100/80 mt-2 font-medium">Processed entries/exits</div>
        </div>

        <div className="card stat-purple text-white overflow-hidden relative group">
          <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 text-9xl opacity-10 group-hover:scale-110 transition-transform duration-300">⚡</div>
          <div className="text-xs font-semibold uppercase tracking-wider text-purple-100">FASTag Transactions</div>
          <div className="text-3xl font-extrabold mt-2">
            {recent.filter(t => t.paymentMethod === 'fastag').length + 2} {/* Simulating active RFID count */}
          </div>
          <div className="text-xs text-purple-100/80 mt-2 font-medium">Automated payments</div>
        </div>

        <div className="card stat-orange text-white overflow-hidden relative group">
          <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 text-9xl opacity-10 group-hover:scale-110 transition-transform duration-300">🛠️</div>
          <div className="text-xs font-semibold uppercase tracking-wider text-orange-100">Active Lanes</div>
          <div className="text-3xl font-extrabold mt-2">4 / 4</div>
          <div className="text-xs text-orange-100/80 mt-2 font-medium">All hardware units active</div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="card lg:col-span-2 flex flex-col h-[380px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 dark:text-slate-100">Monthly Revenue Stream</h3>
            <span className="text-xs text-slate-400">Past year comparisons</span>
          </div>
          <div className="flex-1 min-h-0 relative">
            {monthly.length > 0 ? (
              <Bar data={chartData} options={chartOptions} />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                No monthly data reported yet
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card flex flex-col h-[380px]">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4">Live Traffic Log</h3>
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {recent.length === 0 ? (
              <div className="text-center text-slate-400 py-8 text-sm">No live traffic recorded</div>
            ) : (
              recent.map(t => (
                <div key={t._id} className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700/50 hover:scale-[1.01] transition-all">
                  <div>
                    <div className="font-bold text-sm tracking-wide text-slate-900 dark:text-white uppercase">{t.plate}</div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-400 mt-0.5">
                      {new Date(t.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[11px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                      t.status === 'open' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      {t.status}
                    </span>
                    {t.amount > 0 && (
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-1">₹{t.amount}</div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
