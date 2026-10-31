import React, { useState, useEffect } from 'react';

export default function FlightTrackerDemo() {
  const [progress, setProgress] = useState(42);
  const [selectedRoute, setSelectedRoute] = useState('LUN-LVI');

  const routes = {
    'LUN-LVI': {
      flight: 'ZN-202',
      origin: 'Lusaka (KKIA - LUN)',
      dest: 'Livingstone (Victoria Falls - LVI)',
      aircraft: 'De Havilland Dash 8-Q400',
      speed: '340 kts (630 km/h)',
      altitude: '24,000 feet (FL240)',
      eta: '22 mins remaining',
      distance: '180 km left'
    },
    'LUN-NLA': {
      flight: 'ZN-104',
      origin: 'Lusaka (KKIA - LUN)',
      dest: 'Ndola (Simon Mwansa Kapwepwe - NLA)',
      aircraft: 'Embraer ERJ-145',
      speed: '410 kts (760 km/h)',
      altitude: '28,000 feet (FL280)',
      eta: '14 mins remaining',
      distance: '95 km left'
    },
    'LUN-MFU': {
      flight: 'ZN-312',
      origin: 'Lusaka (KKIA - LUN)',
      dest: 'Mfuwe Safari Airport (MFU)',
      aircraft: 'ATR 72-600',
      speed: '310 kts (575 km/h)',
      altitude: '20,000 feet (FL200)',
      eta: '31 mins remaining',
      distance: '240 km left'
    }
  };

  const active = routes[selectedRoute];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 94 ? 10 : prev + 0.35));
    }, 100);
    return () => clearInterval(timer);
  }, []);

  const t = progress / 100;
  const p0 = { x: 50, y: 160 };
  const p1 = { x: 300, y: 40 };
  const p2 = { x: 550, y: 160 };
  const planeX = Math.round((1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x);
  const planeY = Math.round((1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y);
  const tangentX = 2 * (1 - t) * (p1.x - p0.x) + 2 * t * (p2.x - p1.x);
  const tangentY = 2 * (1 - t) * (p1.y - p0.y) + 2 * t * (p2.y - p1.y);
  const angleDeg = Math.round(Math.atan2(tangentY, tangentX) * (180 / Math.PI));

  return (
    <div className="bg-navy-900 border border-navy-800 rounded-3xl p-6 md:p-10 shadow-2xl relative text-white my-16">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-navy-800 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Live Zambian Skies Radar</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black mt-1">Track Domestic Flights in Real Time</h2>
        </div>

        {/* Route Selectors */}
        <div className="flex gap-2 bg-navy-800 p-1.5 rounded-2xl border border-navy-700">
          {Object.keys(routes).map((key) => (
            <button
              key={key}
              onClick={() => { setSelectedRoute(key); setProgress(25); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedRoute === key ? 'bg-gold-500 text-navy-900 font-black shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Arc Plane Animation */}
      <div className="relative w-full max-w-3xl mx-auto my-6">
        <svg viewBox="0 0 600 220" className="w-full h-auto overflow-visible">
          <path
            d="M 50,160 Q 300,40 550,160"
            fill="none"
            stroke="#38BDF8"
            strokeWidth="3.5"
            strokeDasharray="6 4"
          />

          <circle cx="50" cy="160" r="7" fill="#0284C7" />
          <circle cx="50" cy="160" r="14" fill="#0284C7" opacity="0.3" className="animate-pulse" />
          <text x="50" y="195" textAnchor="middle" fill="#94A3B8" fontSize="11" fontWeight="700">
            {active.origin}
          </text>

          <circle cx="550" cy="160" r="7" fill="#F59E0B" />
          <circle cx="550" cy="160" r="14" fill="#F59E0B" opacity="0.3" className="animate-pulse" />
          <text x="550" y="195" textAnchor="middle" fill="#94A3B8" fontSize="11" fontWeight="700">
            {active.dest}
          </text>

          {/* Flying Aircraft */}
          <g transform={`translate(${planeX}, ${planeY}) rotate(${angleDeg})`}>
            <circle cx="0" cy="0" r="16" fill="#F59E0B" opacity="0.25" />
            <path
              d="M-10,0 L-4,-4 L4,-12 L7,-12 L4,-3 L14,-1 L18,-4 L20,-4 L19,0 L20,4 L18,4 L14,1 L4,3 L7,12 L4,12 L-4,4 Z"
              fill="#F59E0B"
              transform="scale(0.9)"
            />
          </g>
        </svg>

        <div className="w-full bg-navy-800 h-2 rounded-full overflow-hidden mt-2 border border-navy-700">
          <div
            className="h-full bg-gradient-to-r from-sky-400 to-gold-400"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-xs font-mono text-slate-400 mt-2">
          <span>ALREADY DEPARTED</span>
          <span className="text-gold-400 font-bold">{Math.round(progress)}% OF THE TRIP COVERED</span>
          <span>NEARING ARRIVAL</span>
        </div>
      </div>

      {/* Easy to understand Zambian flight details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-navy-800 text-xs">
        <div className="bg-navy-800/60 p-4 rounded-xl border border-navy-700">
          <span className="text-slate-400 font-bold uppercase block">Flight & Plane</span>
          <span className="text-sm font-black text-white mt-1 block">{active.flight} &bull; {active.aircraft}</span>
        </div>
        <div className="bg-navy-800/60 p-4 rounded-xl border border-navy-700">
          <span className="text-slate-400 font-bold uppercase block">Current Speed</span>
          <span className="text-sm font-black text-sky-400 mt-1 block font-mono">{active.speed}</span>
        </div>
        <div className="bg-navy-800/60 p-4 rounded-xl border border-navy-700">
          <span className="text-slate-400 font-bold uppercase block">Flight Height</span>
          <span className="text-sm font-black text-emerald-400 mt-1 block font-mono">{active.altitude}</span>
        </div>
        <div className="bg-navy-800/60 p-4 rounded-xl border border-navy-700">
          <span className="text-slate-400 font-bold uppercase block">Remaining Time</span>
          <span className="text-sm font-black text-gold-400 mt-1 block font-mono">{active.eta} ({active.distance})</span>
        </div>
      </div>
    </div>
  );
}