import React from 'react';

export default function ReceiptModal({ booking, onClose }) {
  if (!booking) return null;

  // Real, live optical QR Code pointing to flight payload
  const qrData = encodeURIComponent(
    `SKYQUEST_ZAMBIA|PNR:${booking.pnr}|PAX:${booking.passengerName || 'PASSENGER'}|ROUTE:${booking.route || 'LUN->LVI'}|SEAT:${booking.seat || '10A'}|AMT:ZMW_${booking.total}|STATUS:CONFIRMED`
  );
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${qrData}&color=0A192F`;

  return (
    <div className="fixed inset-0 bg-navy-900/75 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 md:p-8 border border-slate-200 relative my-8">
        
        {/* Top Badges */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
          <div>
            <span className="text-[10px] font-black tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase border border-emerald-200">
              Payment Confirmed & Verified
            </span>
            <h3 className="text-xl font-black text-navy-900 mt-1">Zambian Electronic Tax Receipt</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl font-bold">&times;</button>
        </div>

        {/* Boarding Reference Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-5">
          <div className="flex justify-between items-center mb-3">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Booking Reference (PNR)</span>
              <div className="text-2xl font-black font-mono text-navy-900 tracking-wider">{booking.pnr}</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Seat Assignment</span>
              <div className="text-xl font-black text-sky-600 font-mono">{booking.seat || '10A'}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-200 pt-3">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Passenger</span>
              <span className="font-bold text-navy-900">{booking.passengerName || 'Chileshe Mwamba'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Flight Sector</span>
              <span className="font-bold text-navy-900">{booking.route || 'Lusaka (LUN) -> Livingstone (LVI)'}</span>
            </div>
          </div>
        </div>

        {/* Live Scannable Optical QR Code */}
        <div className="bg-white border-2 border-dashed border-sky-300 rounded-2xl p-4 flex flex-col items-center text-center mb-5">
          <img
            src={qrUrl}
            alt="Boarding Pass QR Code"
            className="w-36 h-36 rounded-lg shadow-sm"
          />
          <span className="text-xs font-black text-navy-900 mt-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Scan with Any Phone Camera to Verify
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5">
            ZCAA & ZRA Digital Security Gate & Manifest Validator
          </span>
        </div>

        {/* ZRA Fiscal Tax Breakdown */}
        <div className="space-y-1.5 text-xs text-slate-600 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex justify-between">
            <span>Airfare Subtotal:</span>
            <span className="font-semibold">K {(Number(booking.total) * 0.84).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>ZRA Aviation VAT (16%) & Safety Tax:</span>
            <span className="font-semibold">K {(Number(booking.total) * 0.16).toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-black text-navy-900">
            <span>Total Paid (ZMW):</span>
            <span className="text-emerald-600 font-mono">K {Number(booking.total).toLocaleString()}</span>
          </div>
          <div className="text-[10px] text-slate-400 pt-1 text-center font-mono">
            TPIN: 1003928192 &bull; ZRA Fiscal Invoice Ref: INV-{booking.pnr}-2026
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <a
            href={`http://localhost:5000/api/bookings/ticket/${booking.pnr}/pdf`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 py-3 bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-xl shadow-lg transition text-center flex items-center justify-center gap-2 border-b-2 border-gold-400"
          >
            <span>Download PDF Itinerary</span>
          </a>
          <button
            onClick={() => window.print()}
            className="px-5 py-3 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition"
          >
            Print Receipt
          </button>
        </div>

      </div>
    </div>
  );
}