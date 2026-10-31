import React from 'react';

export default function AdminDashboard({ flights, onUpdateStatus }) {
  return (
    <div className="max-w-7xl mx-auto py-10 px-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-navy-900">Administrator Command Center</h1>
          <p className="text-sm text-slate-400">Live operational flight schedules and payment verification.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Gross Ticket Sales</span>
          <div className="text-2xl font-black text-navy-900 mt-2">$1,280,450.00</div>
          <span className="text-xs text-emerald-600 font-bold">&uarr; 14.8% this month</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Reservations</span>
          <div className="text-2xl font-black text-navy-900 mt-2">4,129</div>
          <span className="text-xs text-sky-500 font-bold">Confirmed seats</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Average Load Factor</span>
          <div className="text-2xl font-black text-navy-900 mt-2">87.4%</div>
          <span className="text-xs text-emerald-600 font-bold">Optimal capacity</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Active Airframes</span>
          <div className="text-2xl font-black text-gold-500 mt-2">18 In Service</div>
          <span className="text-xs text-slate-400">0 Grounded</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-navy-900">Active Flight Operations</h3>
          <span className="text-xs font-bold bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full">Systems Nominal</span>
        </div>
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-400">
            <tr>
              <th className="px-6 py-3">Flight No</th>
              <th className="px-6 py-3">Departure Date & Time</th>
              <th className="px-6 py-3">Current Status</th>
              <th className="px-6 py-3 text-right">Operational Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {flights.map((f) => (
              <tr key={f.id || f.flight_id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-black text-navy-900">{f.flight_number}</td>
                <td className="px-6 py-4">{new Date(f.departure_time).toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${
                    f.status === 'scheduled' ? 'bg-emerald-50 text-emerald-600' :
                    f.status === 'delayed' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                  }`}>
                    {f.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button 
                    onClick={() => onUpdateStatus(f.id || f.flight_id, 'delayed')}
                    className="text-xs font-bold text-amber-600 hover:underline"
                  >
                    Flag Delay
                  </button>
                  <button 
                    onClick={() => onUpdateStatus(f.id || f.flight_id, 'cancelled')}
                    className="text-xs font-bold text-rose-600 hover:underline"
                  >
                    Cancel Sector
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
