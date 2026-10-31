import React from 'react';

export default function SeatMap({ seats, selectedSeats, onToggleSeat }) {
  const rows = ['1', '5', '10', '11'];
  const columns = ['A', 'B', 'C', 'D', 'E', 'F'];

  const getSeat = (label) => seats.find((s) => s.seat_number === label);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 max-w-lg mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-lg font-black text-navy-900">Select Cabin Seat</h3>
        <p className="text-xs text-slate-400 mt-1">Boeing 787-9 Dreamliner</p>
      </div>

      <div className="flex justify-center gap-4 text-xs font-semibold mb-6">
        <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 bg-sky-100 border border-sky-300 rounded"></div><span>Available</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 bg-gold-500 rounded"></div><span>Selected</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 bg-slate-200 rounded"></div><span>Occupied</span></div>
      </div>

      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
        {rows.map((row) => (
          <div key={row} className="flex justify-between items-center">
            <div className="flex gap-2">
              {['A', 'B', 'C'].map((col) => {
                const label = `${row}${col}`;
                const s = getSeat(label);
                if (!s) return <div key={label} className="w-8 h-8" />;
                const isSelected = selectedSeats.includes(s.id);
                return (
                  <button
                    key={label}
                    disabled={s.status !== 'available' && !isSelected}
                    onClick={() => onToggleSeat(s.id)}
                    className={`w-8 h-9 rounded text-xs font-bold transition ${
                      isSelected ? 'bg-gold-500 text-white' :
                      s.status === 'available' ? 'bg-sky-100 text-sky-800 hover:bg-sky-200 border border-sky-300' :
                      'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <span className="text-xs font-bold text-slate-400 w-6 text-center">{row}</span>

            <div className="flex gap-2">
              {['D', 'E', 'F'].map((col) => {
                const label = `${row}${col}`;
                const s = getSeat(label);
                if (!s) return <div key={label} className="w-8 h-8" />;
                const isSelected = selectedSeats.includes(s.id);
                return (
                  <button
                    key={label}
                    disabled={s.status !== 'available' && !isSelected}
                    onClick={() => onToggleSeat(s.id)}
                    className={`w-8 h-9 rounded text-xs font-bold transition ${
                      isSelected ? 'bg-gold-500 text-white' :
                      s.status === 'available' ? 'bg-sky-100 text-sky-800 hover:bg-sky-200 border border-sky-300' :
                      'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
