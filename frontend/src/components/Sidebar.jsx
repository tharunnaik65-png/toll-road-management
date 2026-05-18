import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

const NAV = [
  { to: '/',           icon: '🏠', label: 'Dashboard' },
  { to: '/toll',       icon: '🛣️', label: 'Toll Collection' },
  { to: '/vehicles',   icon: '🚗', label: 'Vehicles' },
  { to: '/reports',    icon: '📊', label: 'Reports' },
  { to: '/settings',   icon: '⚙️', label: 'Settings' },
]

export default function Sidebar({ open, setOpen }) {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const logout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full z-30 w-64
        bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700
        flex flex-col transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:z-auto
      `}>
        {/* Logo */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-lg shadow-sm">
              🛣️
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white leading-tight">TollWay</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Management System</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'}`
              }
            >
              <span className="text-base">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="px-3 py-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
              {(user.name || 'A')[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.name || 'Admin'}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user.role || 'admin'}</div>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors text-lg"
            >
              🚪
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
