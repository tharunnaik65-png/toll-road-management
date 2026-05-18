import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Vehicles from './pages/Vehicles'
import Toll from './pages/Toll'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Layout from './components/Layout'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const token = localStorage.getItem('token')
  
  // Helper to wrap protected pages with Layout
  const Protected = ({ children }) => {
    return token ? <Layout>{children}</Layout> : <Navigate to="/login" />
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <Routes>
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
        <Route path="/" element={<Protected><Dashboard /></Protected>} />
        <Route path="/vehicles" element={<Protected><Vehicles /></Protected>} />
        <Route path="/toll" element={<Protected><Toll /></Protected>} />
        <Route path="/reports" element={<Protected><Reports /></Protected>} />
        <Route path="/settings" element={<Protected><Settings /></Protected>} />
      </Routes>
      <ToastContainer position="top-right" />
    </div>
  )
}

export default App
