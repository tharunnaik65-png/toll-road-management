import React, { useEffect, useState } from 'react'
import api from '../utils/api'

export default function Reports() {
  const [daily, setDaily] = useState({})
  const [transactions, setTransactions] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedReceipt, setSelectedReceipt] = useState(null)

  useEffect(() => {
    fetchReportData()
  }, [])

  const fetchReportData = async () => {
    setLoading(true)
    try {
      const [dailyRes, transactionsRes] = await Promise.all([
        api.get('/reports/daily'),
        api.get('/transactions')
      ])
      setDaily(dailyRes.data)
      // Only show closed (paid) transactions in historical ledger
      setTransactions(transactionsRes.data.filter(t => t.status === 'closed'))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const filteredTransactions = transactions.filter(t => 
    t.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.receiptId && t.receiptId.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ledger & Reports</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Audit complete historical records and generate duplicate customer invoices.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="card bg-gradient-to-br from-emerald-500 to-teal-600 text-white relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 text-8xl opacity-10">💵</div>
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-100">Today's Revenue</div>
          <div className="text-3xl font-extrabold mt-2">₹{daily.total?.toLocaleString() || 0}</div>
          <div className="text-[10px] text-emerald-100/80 mt-2">Aggregated on-site receipts</div>
        </div>

        <div className="card bg-gradient-to-br from-blue-500 to-indigo-600 text-white relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 text-8xl opacity-10">📑</div>
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-100">Audit Volume</div>
          <div className="text-3xl font-extrabold mt-2">{daily.count || 0}</div>
          <div className="text-[10px] text-blue-100/80 mt-2 font-medium">Daily transaction records</div>
        </div>

        <div className="card bg-gradient-to-br from-slate-700 to-slate-900 text-white relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 text-8xl opacity-10">🏛️</div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-300">Total Registered Fleet</div>
          <div className="text-3xl font-extrabold mt-2">{transactions.length}</div>
          <div className="text-[10px] text-slate-300/80 mt-2 font-medium">Archived closed records</div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-bold text-slate-800 dark:text-slate-100">Historical Toll Ledger</h3>
          
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Filter by plate or Receipt ID..."
            className="input max-w-xs"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            No closed records match the filters.
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Receipt ID</th>
                  <th>License Plate</th>
                  <th>Vehicle Type</th>
                  <th>Entry Time</th>
                  <th>Exit Time</th>
                  <th>Fee Paid</th>
                  <th>Method</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map(t => (
                  <tr key={t._id}>
                    <td className="font-mono text-xs text-slate-500 dark:text-slate-400">
                      {t.receiptId || t._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      {t.plate}
                    </td>
                    <td className="capitalize text-xs text-slate-500 dark:text-slate-400">
                      {t.vehicle?.type || 'Car'}
                    </td>
                    <td className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(t.entryTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="text-xs text-slate-500 dark:text-slate-400">
                      {t.exitTime ? new Date(t.exitTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : '—'}
                    </td>
                    <td className="font-bold text-slate-800 dark:text-slate-200">
                      ₹{t.amount}
                    </td>
                    <td>
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                        t.paymentMethod === 'fastag' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                      }`}>
                        {t.paymentMethod}
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => setSelectedReceipt(t)}
                        className="btn bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-650 text-slate-800 dark:text-slate-200 text-xs px-3 py-1.5 rounded-lg"
                      >
                        👁️ View Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-700 animate-slide-up relative">
            
            {/* Header banner */}
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white p-6 text-center">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-2xl mx-auto mb-2">🧾</div>
              <h2 className="text-xl font-extrabold tracking-tight">Toll Invoice (Copy)</h2>
              <p className="text-xs text-slate-300 mt-1">Receipt ID: {selectedReceipt.receiptId}</p>
            </div>

            {/* Receipt body */}
            <div className="p-6 space-y-4">
              <div className="text-center pb-4 border-b border-dashed border-slate-200 dark:border-slate-700">
                <div className="text-sm text-slate-400 dark:text-slate-400">Total Toll Fee Charged</div>
                <div className="text-4xl font-black text-slate-800 dark:text-white mt-1">₹{selectedReceipt.amount}</div>
                <span className="inline-block mt-2 text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  Transaction Cleared
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
                <div className="text-right text-xs text-slate-500 dark:text-slate-400">{selectedReceipt.exitTime ? new Date(selectedReceipt.exitTime).toLocaleString() : '—'}</div>
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
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
