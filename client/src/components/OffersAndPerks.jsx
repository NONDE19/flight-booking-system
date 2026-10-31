import React from 'react';

export default function OffersAndPerks() {
  const perks = [
    {
      title: 'Free 23kg Luggage (Katundu)',
      desc: 'No extra hidden luggage fees. Carry your free 23kg check-in bag plus 7kg hand luggage on all local Zambian flights.',
      icon: '🧳'
    },
    {
      title: 'Pay with MTN or Airtel Money',
      desc: 'No credit card needed! Pay straight from your phone with MTN MoMo, Airtel Money, or Zamtel Kwacha in seconds.',
      icon: '📱'
    },
    {
      title: 'Easy NRC or Passport Check-in',
      desc: 'Travel with ease across Zambia using just your Green National Registration Card (NRC) or standard passport.',
      icon: '🪪'
    },
    {
      title: 'Ticket & Receipt Pa Phone',
      desc: 'Receive your official e-ticket and scannable ZRA fiscal receipt right on your phone screen immediately after payment.',
      icon: '🧾'
    }
  ];

  return (
    <section className="my-20">
      {/* Promo Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-navy-900 via-navy-800 to-sky-900 text-white p-8 md:p-12 shadow-xl mb-14 border border-navy-700">
        <div className="max-w-xl space-y-3">
          <span className="bg-gold-500/20 text-gold-400 border border-gold-400/30 text-xs font-black uppercase px-3.5 py-1 rounded-full">
            Special Weekend ku Livingstone Deal
          </span>
          <h2 className="text-2xl md:text-4xl font-black leading-tight">
            Fly to Victoria Falls for Only K 1,650
          </h2>
          <p className="text-slate-300 text-sm">
            Take a well-deserved break and visit Mosi-oa-Tunya. Book your seat in advance and get discounts on morning and weekend departures from Lusaka Kenneth Kaunda Airport.
          </p>
          <div className="pt-2">
            <span className="text-xs font-mono text-gold-400 font-bold block">
              Use promo code: <span className="bg-gold-500 text-navy-900 px-2 py-0.5 rounded font-black">ZAMBIA2026</span>
            </span>
          </div>
        </div>
      </div>

      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-black tracking-widest text-sky-600 uppercase">Why Travel With Us</span>
        <h2 className="text-3xl font-black text-navy-900 mt-1">Flying in Zambia Made Simple and Affordable</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {perks.map((p) => (
          <div key={p.title} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="text-3xl mb-3">{p.icon}</div>
            <h3 className="font-bold text-navy-900 text-base mb-2">{p.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}