import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-slate-400 pt-16 pb-12 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Real Zambian Testimonials */}
        <div className="border-b border-navy-800 pb-16 mb-12">
          <div className="text-center mb-8">
            <span className="text-xs font-black tracking-widest text-gold-400 uppercase">What Fellow Zambians Say</span>
            <h3 className="text-2xl font-black text-white mt-1">Real Reviews from Happy Travelers</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-navy-800/50 p-6 rounded-2xl border border-navy-700">
              <div className="text-gold-400 text-sm mb-2">★★★★★</div>
              <p className="text-xs text-slate-300 italic mb-4 leading-relaxed">
                "I used MTN Mobile Money and within 1 minute I had my seat and boarding pass on my phone. The security at Kenneth Kaunda Airport scanned the QR code with no issues!"
              </p>
              <span className="text-xs font-bold text-white block">Chileshe Mwamba</span>
              <span className="text-[11px] text-slate-400">Business Traveler &bull; Lusaka to Kitwe</span>
            </div>
            <div className="bg-navy-800/50 p-6 rounded-2xl border border-navy-700">
              <div className="text-gold-400 text-sm mb-2">★★★★★</div>
              <p className="text-xs text-slate-300 italic mb-4 leading-relaxed">
                "Booked a family trip to Livingstone for Victoria Falls holiday. The price in Kwacha was fair, no dollar conversion surprises, and free 23kg luggage for everyone."
              </p>
              <span className="text-xs font-bold text-white block">Mutale Bwalya</span>
              <span className="text-[11px] text-slate-400">Holiday Traveler &bull; Lusaka to Livingstone</span>
            </div>
            <div className="bg-navy-800/50 p-6 rounded-2xl border border-navy-700">
              <div className="text-gold-400 text-sm mb-2">★★★★★</div>
              <p className="text-xs text-slate-300 italic mb-4 leading-relaxed">
                "Saved me from the exhausting 12-hour bus to Solwezi. A clean 50-minute flight and I was already at the mine site. Very reliable!"
              </p>
              <span className="text-xs font-bold text-white block">Kondwani Phiri</span>
              <span className="text-[11px] text-slate-400">Mining Engineer &bull; Lusaka to Solwezi</span>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-navy-800">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-gradient-to-tr from-sky-500 to-gold-400 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-navy-900 font-black text-lg leading-none">S</span>
              </div>
              <span className="text-xl font-black tracking-wider text-white">SKYQUEST ZAMBIA</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Proudly connecting Zambian towns and tourist destinations with safe, affordable scheduled commercial flights and instant mobile money booking.
            </p>
            <div className="mt-4 text-xs text-slate-500 font-mono">
              Certified by Zambia Civil Aviation Authority (ZCAA) &bull; ZRA Compliant
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Top Zambian Routes</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-gold-400 transition">Lusaka to Livingstone</a></li>
              <li><a href="#" className="hover:text-gold-400 transition">Lusaka to Ndola / Kitwe</a></li>
              <li><a href="#" className="hover:text-gold-400 transition">Lusaka to Mfuwe Safari</a></li>
              <li><a href="#" className="hover:text-gold-400 transition">Lusaka to Solwezi</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Travel Help</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-gold-400 transition">Check Luggage Allowance</a></li>
              <li><a href="#" className="hover:text-gold-400 transition">NRC & ID Requirements</a></li>
              <li><a href="#" className="hover:text-gold-400 transition">Reprint Boarding Pass</a></li>
              <li><a href="#" className="hover:text-gold-400 transition">Change Travel Date</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Customer Care</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="text-white font-bold">Call Center (Lusaka):</span></li>
              <li className="font-mono text-gold-400">+260 974 546 564 </li>
              <li className="font-mono text-emerald-400">+260 966 756 234 (WhatsApp)</li>
              <li><a href="#" className="hover:text-gold-400 transition mt-2 block">Airport Desk at KKIA Terminal 2</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div>&copy; 2026 SkyQuest Zambia. Mwende Bwino &bull; Safe Travels.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-400">Passenger Rights (ZCAA)</a>
            <a href="#" className="hover:text-slate-400">Privacy & NRC Security</a>
          </div>
        </div>

      </div>
    </footer>
  );
}