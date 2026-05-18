import React, { useEffect, useState } from 'react'
import api from '../utils/api'
import { toast } from 'react-toastify'

export default function Toll() {
  const [plate, setPlate] = useState('')
  const [vehicleType, setVehicleType] = useState('car')
  const [openList, setOpenList] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedReceipt, setSelectedReceipt] = useState(null)

  useEffect(() => {
    fetchOpen()
  }, [])

  const fetchOpen = async () => {
    try {
      const res = await api.get('/transactions')
      setOpenList(res.data.filter(t => t.status === 'open'))
    } catch (e) {
      console.error(e)
    }
  }

  const recordEntry = async (e) => {
    e.preventDefault()
    if (!plate.trim()) {
      toast.warning('Please enter a valid license plate number.')
      return
    }
    setLoading(true)
    try {
      // Create or ensure vehicle exists with selected type
      // Wait, let's check backend entry logic:
      // it finds or creates vehicle: `let vehicle = await Vehicle.findOne({ plate }); if (!vehicle) vehicle = await Vehicle.create({ plate, type: 'car' });`
      // Wait, we can pass additional vehicle details or let backend handle it.
      // Let's check backend routes/vehicles.js - we can update the type later or register the vehicle first!
      // To make it super robust, let's register the vehicle or just call entry. Let's register it to be absolutely sure the type is preserved!
      
      try {
        await api.post('/vehicles', { plate: plate.toUpperCase(), type: vehicleType })
      } catch (err) {
        // Vehicle might already exist, which is fine
      }

      await api.post('/transactions/entry', { plate: plate.toUpperCase() })
      toast.success(`Entry logged for ${plate.toUpperCase()}`)
      setPlate('')
      fetchOpen()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to record entry')
    } finally {
      setLoading(false)
    }
  }

  const processExit = async (id) => {
    try {
      const res = await api.post(`/transactions/exit/${id}`)
      toast.success('Exit Processed Successfully!')
      
      // Load and display rich receipt details
      setSelectedReceipt(res.data)
      fetchOpen()
    } catch (err) {
      toast.error('Failed to process exit')
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Toll Operations</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage lane entries, calculate fees, and simulate exit payments.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Entry Panel */}
        <div className="card h-fit space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-700">
            <span className="text-lg">🛣️</span>
            <h3 className="font-bold text-slate-800 dark:text-slate-100">Lane Entry Gate</h3>
          </div>
          
          <form onSubmit={recordEntry} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">License Plate</label>
              <input
                value={plate}
                onChange={e => setPlate(e.target.value)}
                placeholder="e.g. MH12AB1234"
                className="input uppercase tracking-wider font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Vehicle Classification</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'car', label: '🚗 Car / SUV', fee: '₹50' },
                  { id: 'bike', label: '🏍️ Motorcycle', fee: '₹20' },
                  { id: 'truck', label: '🚛 Truck', fee: '₹120' },
                  { id: 'bus', label: '🚌 Bus', fee: '₹100' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setVehicleType(item.id)}
                    className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                      vehicleType === item.id
                        ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <div className="text-sm font-semibold">{item.label}</div>
                    <div className="text-xs text-slate-400 mt-1">Fee: {item.fee}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-success py-3 font-semibold rounded-xl flex items-center justify-center gap-2 text-sm shadow-md shadow-emerald-500/10"
            >
              {loading ? 'Processing...' : '🟢 Open Entry Barrier'}
            </button>
          </form>
        </div>

        {/* Open Lanes List */}
        <div className="card lg:col-span-2 flex flex-col min-h-[450px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">🚦</span>
              <h3 className="font-bold text-slate-800 dark:text-slate-100">Inside Toll Corridor</h3>
            </div>
            <span className="px-2.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold">
              {openList.length} Active Vehicles
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3">
            {openList.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
                <span className="text-4xl mb-2">🍃</span>
                <p className="text-sm">No vehicles currently inside the toll corridor.</p>
              </div>
            ) : (
              openList.map(t => (
                <div key={t._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 gap-4 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-extrabold uppercase tracking-widest bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-600 shadow-sm text-sm">
                        {t.plate}
                      </span>
                      <span className="text-xs capitalize px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300">
                        {t.vehicle?.type || 'Car'}
                      </span>
                      {t.vehicle?.fastagId && (
                        <span className="text-[10px] font-bold uppercase bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded flex items-center gap-1">
                          🎟️ FASTag
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 dark:text-slate-400 flex items-center gap-1.5 mt-1.5">
                      <span>⏱️ Entry:</span>
                      <span className="font-semibold text-slate-600 dark:text-slate-300">
                        {new Date(t.entryTime).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => processExit(t._id)}
                      className="btn bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 shadow-sm shadow-blue-500/10"
                    >
                      🚪 Process Exit & Pay
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-700 animate-slide-up relative">
            
            {/* Header banner */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 text-center">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-2xl mx-auto mb-2">🧾</div>
              <h2 className="text-xl font-extrabold tracking-tight">Toll Invoice</h2>
              <p className="text-xs text-blue-100 mt-1">Receipt ID: {selectedReceipt.receiptId}</p>
            </div>

            {/* Receipt body */}
            <div className="p-6 space-y-4">
              <div className="text-center pb-4 border-b border-dashed border-slate-200 dark:border-slate-700">
                <div className="text-sm text-slate-400 dark:text-slate-400">Total Toll Fee Debited</div>
                <div className="text-4xl font-black text-slate-800 dark:text-white mt-1">₹{selectedReceipt.amount}</div>
                <span className="inline-block mt-2 text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  Payment {selectedReceipt.paymentMethod === 'fastag' ? 'RFID Auto-Deducted' : 'Cash Successful'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <div className="text-slate-400">Vehicle Number</div>
                <div className="text-right font-bold text-slate-800 dark:text-white uppercase">{selectedReceipt.plate}</div>

                <div className="text-slate-400">Classification</div>
                <div className="text-right font-medium text-slate-700 dark:text-slate-300 capitalize">{selectedReceipt.vehicle?.type || 'Car'}</div>

                <div className="text-slate-400">Payment Gateway</div>
                <div className="text-right font-semibold text-slate-700 dark:text-slate-300 capitalize">
                  {selectedReceipt.paymentMethod === 'fastag' ? '🎫 FASTag / RFID' : '💵 Cashier Counter'}
                </div>

                <div className="text-slate-400 col-span-2 pt-2 border-t border-slate-100 dark:border-slate-700"></div>

                <div className="text-slate-400">Entry timestamp</div>
                <div className="text-right text-xs text-slate-500 dark:text-slate-400">{new Date(selectedReceipt.entryTime).toLocaleString()}</div>

                <div className="text-slate-400">Exit timestamp</div>
                <div className="text-right text-xs text-slate-500 dark:text-slate-400">{new Date(selectedReceipt.exitTime).toLocaleString()}</div>
              </div>

              {/* Simulated barcode */}
              <div className="flex flex-col items-center justify-center pt-4 border-t border-slate-100 dark:border-slate-700 space-y-1">
                <div className="h-8 bg-slate-900 dark:bg-white w-48 rounded flex items-center justify-between px-2 opacity-80 overflow-hidden">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-full bg-white dark:bg-slate-900"
                      style={{ width: `${Math.max(1, Math.floor(Math.random() * 4))}px` }}
                    ></div>
                  ))}
                </div>
                <span className="text-[10px] text-slate-400 tracking-widest font-mono">*{selectedReceipt.receiptId}*</span>
              </div>

              <button
                onClick={() => setSelectedReceipt(null)}
                className="w-full btn bg-slate-800 dark:bg-slate-700 text-white font-bold py-3 rounded-xl mt-4 text-xs tracking-wider uppercase hover:bg-slate-900 transition-colors"
              >
                Done & Close Barrier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
