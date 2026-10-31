import React from 'react';

export default function PassengerForm({ passengers, onChangePassenger, onProceedToPayment, onCancel, totalFare }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 md:p-8 max-w-3xl mx-auto my-8">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-black text-navy-900">Passenger Travel Documents</h2>
          <p className="text-xs text-slate-400">Required by international civil aviation border control.</p>
        </div>
        <span className="text-sm font-black text-navy-900 bg-gold-100 text-gold-700 px-3 py-1.5 rounded-lg">
          Total: ${totalFare}
        </span>
      </div>

      <div className="space-y-6">
        {passengers.map((pax, index) => (
          <div key={index} className="bg-slate-50 p-5 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider block mb-3">
              Passenger #{index + 1} (Seat: {pax.seat_number})
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">First / Given Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John"
                  value={pax.first_name}
                  onChange={(e) => onChangePassenger(index, 'first_name', e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Last / Surname</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Doe"
                  value={pax.last_name}
                  onChange={(e) => onChangePassenger(index, 'last_name', e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Passport / National ID</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. A12345678"
                  value={pax.passport_number}
                  onChange={(e) => onChangePassenger(index, 'passport_number', e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Nationality</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. United States"
                  value={pax.nationality}
                  onChange={(e) => onChangePassenger(index, 'nationality', e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          className="text-xs font-bold text-slate-400 hover:text-slate-600 transition"
        >
          &larr; Back to Seat Selection
        </button>
        <button
          type="button"
          onClick={onProceedToPayment}
          className="px-6 py-3 bg-navy-900 hover:bg-navy-800 text-white font-bold text-sm rounded-xl shadow-lg transition"
        >
          Proceed to Secure Payment &rarr;
        </button>
      </div>
    </div>
  );
}
