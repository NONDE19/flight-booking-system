import React, { useState } from 'react';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialNotice }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    nrc_number: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isRegister ? 'http://localhost:5000/api/auth/register' : 'http://localhost:5000/api/auth/login';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed. Please verify your email and password.');
      }
      
      localStorage.setItem('skyquest_token', data.token);
      localStorage.setItem('skyquest_user', JSON.stringify(data.user));

      onAuthSuccess(data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const quickFillAdmin = () => {
    setFormData(prev => ({
      ...prev,
      email: 'nondeezekiel4@gmail.com',
      password: 'Admin@2026!'
    }));
    setIsRegister(false);
  };

  const quickFillCustomer = () => {
    setFormData(prev => ({
      ...prev,
      email: 'customer@skyquest.co.zm',
      password: 'customer123'
    }));
    setIsRegister(false);
  };

  return (
    <div className="fixed inset-0 bg-navy-900/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-8 border border-slate-100 relative">
        
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-[10px] font-black uppercase text-gold-500 tracking-widest block">
              SkyQuest Zambia Account Access
            </span>
            <h3 className="text-xl font-black text-navy-900 mt-0.5">
              {isRegister ? 'Register Passenger Account' : 'Sign In to Continue'}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl font-bold">&times;</button>
        </div>

        {initialNotice && (
          <div className="mb-4 p-3 bg-sky-50 border border-sky-200 text-sky-800 text-xs rounded-xl font-bold flex items-center gap-2">
            <span>🔒</span>
            <span>{initialNotice}</span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {isRegister && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="First Name (e.g. Nonde)"
                  required
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <input
                  type="text"
                  placeholder="Last Name (e.g. Ezekiel)"
                  required
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <input
                type="tel"
                placeholder="Phone Number (+260 973777945)"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <input
                type="text"
                placeholder="National ID / NRC (e.g. 327352/13/1)"
                value={formData.nrc_number}
                onChange={(e) => setFormData({ ...formData, nrc_number: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </>
          )}

          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1">Email Address</label>
            <input
              type="email"
              placeholder="e.g. nondeezekiel4@gmail.com"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-xl shadow-lg transition duration-150 border-b-2 border-gold-400"
          >
            {loading ? 'Authenticating...' : (isRegister ? 'Register Account' : 'Sign In')}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            className="text-xs text-sky-600 hover:underline font-bold"
          >
            {isRegister ? 'Already registered? Click here to Sign In' : 'New traveler? Create an Account here'}
          </button>
        </div>

        {/* Quick Fill Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-100 bg-slate-50 p-3 rounded-2xl">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2 text-center">
            One-Click Login Assistant
          </span>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              type="button"
              onClick={quickFillAdmin}
              className="p-2 bg-navy-900 text-white rounded-xl font-bold shadow hover:bg-navy-800 flex items-center justify-center gap-1.5"
            >
              <span>👑</span>
              <span>Nonde Ezekiel (Admin)</span>
            </button>
            <button
              type="button"
              onClick={quickFillCustomer}
              className="p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-100"
            >
              Passenger Demo
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}