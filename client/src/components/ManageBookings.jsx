import React, { useState } from 'react';

export default function ManageBookings() {
  const [pnrInput, setPnrInput] = useState('');
  const [searched, setSearched] = useState(false);

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <h2 className="text-2xl font-black text-navy-900 mb-2">Manage Booking & Retrieve Boarding Pass</h2>
        <p className="text-sm text-slate-400 mb-6">Enter your 6-character PNR reference code to view or print your itinerary.</p>

        <div className="flex gap-3">
          <input
            type="text"
            maxLength={6}
            placeholder="e.g. SQ89AC"
            value={pnrInput}
            onChange={(e) => setPnrInput(e.target.value.toUpperCase())}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono font-black text-lg uppercase focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
          <button
            onClick={() => setSearched(true)}
            className="px-6 py-3 bg-navy-900 text-white font-bold rounded-xl text-sm hover:bg-navy-800 transition"
          >
            Find Reservation
          </button>
        </div>

        {searched && pnrInput.length >= 5 && (
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase">Confirmed PNR</span>
              <div className="text-xl font-mono font-black text-navy-900 mt-1">{pnrInput}</div>
            </div>
            <a
              href={`http://localhost:5000/api/bookings/ticket/${pnrInput}/pdf`}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 bg-gold-500 hover:bg-gold-400 text-white font-bold text-xs rounded-xl shadow-lg transition"
            >
              Download PDF Itinerary
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
