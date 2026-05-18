import React, { useEffect, useState } from 'react'
import api from '../utils/api'
import { toast } from 'react-toastify'

export default function Vehicles() {
  const [list, setList] = useState([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  // Form State
  const [plate, setPlate] = useState('')
  const [type, setType] = useState('car')
  const [owner, setOwner] = useState('')
  const [fastagId, setFastagId] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    fetchList()
  }, [])

  const fetchList = async () => {
    setLoading(true)
    try {
      const res = await api.get('/vehicles')
      setList(res.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const search = async (e) => {
    e?.preventDefault()
    setLoading(true)
    try {
      const res = await api.get('/vehicles', { params: { q } })
      setList(res.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!plate) {
      toast.warning('Plate number is required')
      return
    }
    try {
      await api.post('/vehicles', {
        plate: plate.toUpperCase(),
        type,
        owner,
        fastagId: fastagId || null,
        notes
      })
      toast.success('Vehicle registered successfully')
      
      // Reset form
      setPlate('')
      setOwner('')
      setFastagId('')
      setNotes('')
      setShowAddForm(false)
      
      fetchList()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to register vehicle')
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vehicle Directory</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Search, filter, and register vehicle profiles with linked FASTag RFID accounts.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-primary self-start sm:self-auto py-2.5"
        >
          {showAddForm ? 'Close Registration' : '➕ Register Vehicle'}
        </button>
      </div>

      {/* Add Vehicle Form Modal/Dropdown */}
      {showAddForm && (
        <div className="card border-blue-500/30 dark:border-blue-500/20 bg-blue-50/10 dark:bg-slate-800/80 animate-fade-in">
          <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-slate-100">Register New Profile</h3>
          <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">License Plate *</label>
              <input
                value={plate}
                onChange={e => setPlate(e.target.value)}
                placeholder="MH12AB1234"
                className="input uppercase tracking-wider font-semibold"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Owner Name</label>
              <input
                value={owner}
                onChange={e => setOwner(e.target.value)}
                placeholder="John Doe"
                className="input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Vehicle Classification</label>
              <select
                value={type}
                onChange={e => setType(e.target.value)}
                className="input"
              >
                <option value="car">🚗 Car / SUV</option>
                <option value="bike">🏍️ Motorcycle</option>
                <option value="truck">🚛 Truck</option>
                <option value="bus">🚌 Bus</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">FASTag / RFID ID</label>
              <input
                value={fastagId}
                onChange={e => setFastagId(e.target.value)}
                placeholder="RFID-xxxxxxxx"
                className="input"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Administrative Notes</label>
              <input
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="e.g. VIP tag, local pass, etc."
                className="input"
              />
            </div>
            <div className="md:col-span-3 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="btn btn-secondary py-2 px-4"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-success py-2 px-6 font-semibold"
              >
                Save Record
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search and Filters */}
      <div className="card">
        <form onSubmit={search} className="flex gap-2">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            className="input max-w-md"
            placeholder="Search by license plate..."
          />
          <button type="submit" className="btn btn-primary px-6">
            🔍 Search
          </button>
        </form>
      </div>

      {/* Directory Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : list.length === 0 ? (
        <div className="card text-center py-12 text-slate-400">
          <span className="text-4xl">📭</span>
          <p className="mt-2 text-sm">No registered vehicles matching query found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map(v => (
            <div key={v._id} className="card hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-lg font-extrabold uppercase tracking-widest bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-600 shadow-sm">
                      {v.plate}
                    </span>
                  </div>
                  <span className="text-xs uppercase px-2.5 py-1 rounded-full font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                    {v.type === 'car' && '🚗 Car'}
                    {v.type === 'bike' && '🏍️ Bike'}
                    {v.type === 'truck' && '🚛 Truck'}
                    {v.type === 'bus' && '🚌 Bus'}
                  </span>
                </div>

                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Registered Owner:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{v.owner || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">FASTag / RFID ID:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-200">
                      {v.fastagId ? `🎫 ${v.fastagId}` : '❌ Not Linked'}
                    </span>
                  </div>
                  {v.notes && (
                    <div className="text-xs pt-1.5 border-t border-slate-100 dark:border-slate-700/50 text-slate-400 italic">
                      Note: {v.notes}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
