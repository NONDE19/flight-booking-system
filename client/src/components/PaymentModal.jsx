import React, { useState } from 'react';

export default function PaymentModal({ amount, onConfirmPayment, onCancel, isProcessing }) {
  const [method, setMethod] = useState('mtn_momo');
  const [phoneNumber, setPhoneNumber] = useState('096');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');

  const handlePay = (e) => {
    e.preventDefault();
    onConfirmPayment(method);
  };

  return (
    <div className="fixed inset-0 bg-navy-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-8 border border-slate-100">
        
        <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-5">
          <div>
            <h3 className="text-lg font-black text-navy-900">Checkout Terminal</h3>
            <span className="text-xs text-slate-400">Bank of Zambia / ZRA Authorized</span>
          </div>
          <span className="text-xs font-mono bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-bold">ZMW Currency</span>
        </div>

        {/* Zambian Payment Options */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <button
            type="button"
            onClick={() => { setMethod('mtn_momo'); setPhoneNumber('096'); }}
            className={`py-3 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 border ${
              method === 'mtn_momo' ? 'bg-amber-400 text-navy-900 border-amber-500 shadow-md font-black' : 'bg-slate-50 text-slate-600 border-slate-200'
            }`}
          >
            <span>🟡 MTN MoMo</span>
          </button>
          <button
            type="button"
            onClick={() => { setMethod('airtel_money'); setPhoneNumber('097'); }}
            className={`py-3 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 border ${
              method === 'airtel_money' ? 'bg-rose-500 text-white border-rose-600 shadow-md font-black' : 'bg-slate-50 text-slate-600 border-slate-200'
            }`}
          >
            <span>🔴 Airtel Money</span>
          </button>
          <button
            type="button"
            onClick={() => setMethod('card')}
            className={`py-3 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 border ${
              method === 'card' ? 'bg-navy-900 text-white border-navy-900 shadow-md font-black' : 'bg-slate-50 text-slate-600 border-slate-200'
            }`}
          >
            <span>💳 Card</span>
          </button>
        </div>

        <form onSubmit={handlePay} className="space-y-4">
          {method !== 'card' ? (
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                {method === 'mtn_momo' ? 'MTN Mobile Money Number (+260)' : 'Airtel Money Number (+260)'}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-sm font-bold text-slate-400">+260</span>
                <input
                  type="tel"
                  required
                  placeholder="96 0000000"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-16 pr-4 text-sm font-mono font-bold text-navy-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1.5 block">
                An authorization prompt will be pushed to your phone. Enter your Mobile Money PIN to approve.
              </span>
            </div>
          ) : (
            <>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Debit / Credit Card</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-mono text-navy-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  defaultValue="12/28"
                  placeholder="MM/YY"
                  className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-mono text-center text-navy-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
                <input
                  type="password"
                  maxLength={3}
                  defaultValue="888"
                  placeholder="CVV"
                  className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-mono text-center text-navy-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>
            </>
          )}

          <div className="bg-slate-50 p-4 rounded-2xl flex justify-between items-center my-4 border border-slate-100">
            <div>
              <span className="text-xs text-slate-400 block">Total Due (ZMW)</span>
              <span className="text-2xl font-black text-navy-900 font-mono">K {Number(amount).toLocaleString()}</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
              Includes ZRA VAT
            </span>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isProcessing}
              className="w-1/3 py-3 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="w-2/3 py-3 bg-gold-500 hover:bg-gold-400 text-navy-900 font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
            >
              {isProcessing ? 'Processing Transaction...' : `Authorize K ${Number(amount).toLocaleString()}`}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}