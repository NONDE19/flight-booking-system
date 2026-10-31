import React, { useState } from 'react';

export default function FlightSearch({ onSearch }) {
  const [params, setParams] = useState({
    dept_iata: 'LUN',
    arr_iata: 'LVI',
    date: '2026-11-15',
    cabin_class: 'economy',
    passengers: 1
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(params);
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-6 md:p-8 -mt-24 relative z-20 border border-slate-100">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <span className="font-black text-navy-900 text-sm md:text-base">Zambia Domestic & Regional Flight Booking</span>
        <span className="text-xs text-sky-600 font-bold bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
          ZMW Currency Guaranteed
        </span>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Departure Airport</label>
          <select
            value={params.dept_iata}
            onChange={(e) => setParams({ ...params, dept_iata: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3 text-navy-900 font-bold focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="LUN">Lusaka (Kenneth Kaunda - LUN)</option>
            <option value="LVI">Livingstone (Victoria Falls - LVI)</option>
            <option value="NLA">Ndola (Simon Mwansa Kapwepwe - NLA)</option>
            <option value="MFU">Mfuwe (South Luangwa - MFU)</option>
            <option value="JNB">Johannesburg (O.R. Tambo - JNB)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Arrival Destination</label>
          <select
            value={params.arr_iata}
            onChange={(e) => setParams({ ...params, arr_iata: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3 text-navy-900 font-bold focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="LVI">Livingstone (Victoria Falls - LVI)</option>
            <option value="LUN">Lusaka (Kenneth Kaunda - LUN)</option>
            <option value="NLA">Ndola (Simon Mwansa Kapwepwe - NLA)</option>
            <option value="MFU">Mfuwe (South Luangwa - MFU)</option>
            <option value="JNB">Johannesburg (O.R. Tambo - JNB)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Travel Date</label>
          <input
            type="date"
            value={params.date}
            onChange={(e) => setParams({ ...params, date: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Cabin Class</label>
          <select
            value={params.cabin_class}
            onChange={(e) => setParams({ ...params, cabin_class: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3 text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="economy">Economy Class</option>
            <option value="business">Business Class</option>
            <option value="first">First Class</option>
          </select>
        </div>

        <div className="md:col-span-4 mt-2 flex justify-end">
          <button
            type="submit"
            className="w-full md:w-auto px-8 py-4 bg-navy-900 hover:bg-navy-800 text-white font-bold rounded-xl shadow-lg transition duration-150 flex items-center justify-center gap-2 border-b-2 border-gold-400"
          >
            Search Zambian Flights &rarr;
          </button>
        </div>
      </form>
    </div>
  );
}