import React from 'react';

export default function Navbar({ activeTab, setActiveTab, user, onOpenAuth, onLogout }) {
  return (
    <nav className="bg-navy-900 border-b border-navy-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('search')}>
          <div className="w-10 h-10 bg-gradient-to-tr from-sky-500 to-gold-400 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-navy-900 font-black text-xl leading-none">S</span>
          </div>
          <div>
            <span className="text-xl font-black tracking-wider text-white">SKYQUEST</span>
            <span className="text-xs block tracking-widest text-gold-400 font-bold uppercase">Z A M B I A</span>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => setActiveTab('search')}
            className={`px-3 py-2 rounded-xl text-xs md:text-sm font-bold transition ${
              activeTab === 'search' ? 'bg-white/10 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            Find Flights
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-3 py-2 rounded-xl text-xs md:text-sm font-bold transition ${
              activeTab === 'manage' ? 'bg-white/10 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            Print Ticket / Receipt
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-3 py-2 rounded-xl text-xs md:text-sm font-bold transition ${
              activeTab === 'admin' ? 'bg-gold-500 text-navy-900 font-black shadow-md' : 'text-slate-300 hover:text-white'
            }`}
          >
            Staff & Admin
          </button>

          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-navy-700">
              <span className="text-xs text-slate-300 font-bold hidden md:inline">Mwaiseni, {user.name}</span>
              <button
                onClick={onLogout}
                className="px-2.5 py-1.5 bg-white/10 hover:bg-rose-900/40 text-rose-300 rounded-lg text-xs font-bold transition"
              >
                Log Out
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs md:text-sm font-bold shadow transition"
            >
              Sign In / Register
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}