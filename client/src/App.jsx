import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import FlightSearch from './components/FlightSearch';
import SeatMap from './components/SeatMap';
import PassengerForm from './components/PassengerForm';
import PaymentModal from './components/PaymentModal';
import ReceiptModal from './components/ReceiptModal';
import ManageBookings from './components/ManageBookings';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/AuthModal';
import PopularDestinations from './components/PopularDestinations';
import OffersAndPerks from './components/OffersAndPerks';
import Footer from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState('search');
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authNotice, setAuthNotice] = useState('');

  // 1. Restore persistent user login session from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('skyquest_user');
    const savedToken = localStorage.getItem('skyquest_token');
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('skyquest_user');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('skyquest_token');
    localStorage.removeItem('skyquest_user');
    setUser(null);
    setActiveTab('search');
  };

  // Real scheduled flights
  const [flights, setFlights] = useState([
    {
      flight_id: 2,
      flight_number: 'ZN-202',
      airline_name: 'Zambia Airways',
      departure_airport: 'LUN',
      departure_city: 'Lusaka',
      arrival_airport: 'LVI',
      arrival_city: 'Livingstone (Victoria Falls)',
      departure_time: '2026-11-15T08:30:00.000Z',
      arrival_time: '2026-11-15T09:40:00.000Z',
      ticket_price: '1850.00',
      available_seats: 18,
      status: 'scheduled'
    },
    {
      flight_id: 3,
      flight_number: 'ZN-104',
      airline_name: 'Zambia Airways',
      departure_airport: 'LUN',
      departure_city: 'Lusaka',
      arrival_airport: 'NLA',
      arrival_city: 'Ndola (Copperbelt)',
      departure_time: '2026-11-15T14:00:00.000Z',
      arrival_time: '2026-11-15T14:50:00.000Z',
      ticket_price: '1650.00',
      available_seats: 24,
      status: 'scheduled'
    },
    {
      flight_id: 4,
      flight_number: 'ZN-501',
      airline_name: 'SkyQuest Zambia',
      departure_airport: 'LUN',
      departure_city: 'Lusaka',
      arrival_airport: 'JNB',
      arrival_city: 'Johannesburg (O.R. Tambo)',
      departure_time: '2026-11-15T16:30:00.000Z',
      arrival_time: '2026-11-15T18:35:00.000Z',
      ticket_price: '3450.00',
      available_seats: 12,
      status: 'scheduled'
    }
  ]);

  const [seats, setSeats] = useState([
    { id: 1, seat_number: '1A', cabin_class: 'first', status: 'available' },
    { id: 2, seat_number: '1B', cabin_class: 'first', status: 'available' },
    { id: 3, seat_number: '5A', cabin_class: 'business', status: 'available' },
    { id: 4, seat_number: '5B', cabin_class: 'business', status: 'available' },
    { id: 5, seat_number: '10A', cabin_class: 'economy', status: 'available' },
    { id: 6, seat_number: '10B', cabin_class: 'economy', status: 'available' },
    { id: 7, seat_number: '10C', cabin_class: 'economy', status: 'available' },
    { id: 8, seat_number: '10D', cabin_class: 'economy', status: 'available' },
    { id: 9, seat_number: '11A', cabin_class: 'economy', status: 'available' },
    { id: 10, seat_number: '11B', cabin_class: 'economy', status: 'booked' }
  ]);

  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [step, setStep] = useState('select-flight');
  const [passengers, setPassengers] = useState([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [receiptBooking, setReceiptBooking] = useState(null);

  const handleSearch = async (params) => {
    try {
      const res = await fetch(`http://localhost:5000/api/flights/search?dept_iata=${params.dept_iata}&arr_iata=${params.arr_iata}&date=${params.date}&cabin_class=${params.cabin_class}&passengers=${params.passengers}`);
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        setFlights(data.data);
      }
    } catch (e) {
      console.log('Using active scheduled domestic flights.');
    }
  };

  // 2. Gate: User MUST be logged in before selecting seats & booking
  const handleSelectFlight = (flight) => {
    if (!user) {
      setAuthNotice('Please sign in or create an account to select seats and book your flight.');
      setIsAuthOpen(true);
      return;
    }
    setSelectedFlight(flight);
    setSelectedSeats([]);
    setStep('seat-map');
  };

  const handleToggleSeat = (seatId) => {
    setSelectedSeats(prev => {
      const exists = prev.includes(seatId);
      const updated = exists ? prev.filter(id => id !== seatId) : [...prev, seatId];
      
      const newPax = updated.map(id => {
        const s = seats.find(item => item.id === id);
        const existing = passengers.find(p => p.seat_id === id);
        return existing || {
          seat_id: id,
          seat_number: s ? s.seat_number : 'TBD',
          first_name: user?.name?.split(' ')[0] || 'Passenger',
          last_name: user?.name?.split(' ')[1] || 'Traveler',
          passport_number: 'NRC-VALID',
          nationality: 'Zambia'
        };
      });
      setPassengers(newPax);
      return updated;
    });
  };

  const handleChangePassenger = (index, field, value) => {
    setPassengers(prev => {
      const copy = [...prev];
      copy[index][field] = value;
      return copy;
    });
  };

  // 3. Process payment through real backend API
  const handleExecutePayment = async (gateway) => {
    setIsProcessingPayment(true);
    const token = localStorage.getItem('skyquest_token');

    try {
      const resReserve = await fetch('http://localhost:5000/api/bookings/reserve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          customer_id: user?.id || 1,
          flight_id: selectedFlight.flight_id,
          seat_ids: selectedSeats,
          passengers
        })
      });
      const dataReserve = await resReserve.json();

      if (!resReserve.ok) {
        throw new Error(dataReserve.error || 'Reservation could not be completed.');
      }

      const resPay = await fetch('http://localhost:5000/api/payments/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          booking_id: dataReserve.data.booking_id,
          gateway
        })
      });
      const dataPay = await resPay.json();

      setReceiptBooking({
        pnr: dataReserve.data.pnr,
        total: dataReserve.data.total_payable,
        passengerName: `${passengers[0].first_name} ${passengers[0].last_name}`,
        seat: seats.find(s => s.id === selectedSeats[0])?.seat_number || '10A',
        route: `${selectedFlight.departure_city} (${selectedFlight.departure_airport}) -> ${selectedFlight.arrival_city} (${selectedFlight.arrival_airport})`
      });
    } catch (err) {
      alert(err.message || 'Payment processing failed. Please verify your connection.');
    } finally {
      setIsProcessingPayment(false);
      setIsPaymentModalOpen(false);
      setStep('select-flight');
      setSelectedFlight(null);
      setSelectedSeats([]);
    }
  };

  const calculatedTotal = selectedFlight ? (Number(selectedFlight.ticket_price) * (selectedSeats.length || 1)).toFixed(2) : '0.00';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'admin' && (!user || (user.role !== 'admin' && user.role !== 'staff'))) {
            setAuthNotice('Staff & Admin Command Portal requires an authorized Staff/Admin login.');
            setIsAuthOpen(true);
            return;
          }
          setActiveTab(tab);
        }}
        user={user}
        onOpenAuth={() => { setAuthNotice(''); setIsAuthOpen(true); }}
        onLogout={handleLogout}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialNotice={authNotice}
        onAuthSuccess={(authData) => {
          setUser(authData.user);
          if (authData.user.role === 'admin' || authData.user.role === 'staff') {
            setActiveTab('admin');
          }
        }}
      />

      {/* Scannable Optical Receipt Modal */}
      {receiptBooking && (
        <ReceiptModal booking={receiptBooking} onClose={() => setReceiptBooking(null)} />
      )}

      {/* Print / Manage Itinerary */}
      {activeTab === 'manage' && <ManageBookings />}

      {/* Admin / Operations Panel - Restricted to Staff & Admin */}
      {activeTab === 'admin' && (
        user && (user.role === 'admin' || user.role === 'staff') ? (
          <AdminDashboard flights={flights} onUpdateStatus={(id, status) => {
            setFlights(prev => prev.map(f => (f.flight_id === id || f.id === id) ? { ...f, status } : f));
          }} />
        ) : (
          <div className="max-w-md mx-auto my-20 p-8 bg-white border border-slate-200 rounded-3xl text-center shadow-xl">
            <span className="text-4xl block mb-2">🔒</span>
            <h3 className="text-xl font-black text-navy-900">Restricted Access</h3>
            <p className="text-xs text-slate-500 mt-2 mb-6">You must be logged in as an Airport Staff or System Administrator.</p>
            <button
              onClick={() => { setAuthNotice('Please login with an Admin or Staff account.'); setIsAuthOpen(true); }}
              className="px-6 py-3 bg-navy-900 text-white font-bold text-xs rounded-xl shadow"
            >
              Log in with Authorized Account
            </button>
          </div>
        )
      )}

      {/* Public / Customer Booking Flow */}
      {activeTab === 'search' && (
        <div>
          {/* Zambian Aviation Banner */}
          <section className="relative bg-navy-900 pt-28 pb-44 px-6 text-center text-white overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=2000&q=80')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-navy-900/60 via-navy-900/90 to-navy-900" />

            <div className="max-w-4xl mx-auto space-y-4 relative z-10">
              <span className="text-xs font-black tracking-widest text-gold-400 uppercase bg-navy-800/80 px-4 py-1.5 rounded-full border border-gold-400/30">
                Republic of Zambia Aviation Network &bull; ZCAA Certified
              </span>
              <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-tight">
                Fly Zambia Beyond Horizons.
              </h1>
              <p className="text-slate-300 text-sm md:text-lg max-w-2xl mx-auto font-medium">
                Instant flight reservations across Kenneth Kaunda, Victoria Falls, the Copperbelt, and regional hubs. Complete with instant mobile money settlement and scannable ZRA e-receipts.
              </p>

              {!user && (
                <div className="pt-2">
                  <button
                    onClick={() => { setAuthNotice(''); setIsAuthOpen(true); }}
                    className="px-6 py-3 bg-gold-500 hover:bg-gold-400 text-navy-900 font-black text-xs rounded-xl shadow-lg transition"
                  >
                    Sign In / Create Account to Book
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Search Box */}
          <div className="px-6 mb-12">
            <FlightSearch onSearch={handleSearch} />
          </div>

          {/* Step 2: Seat Map */}
          {step === 'seat-map' && (
            <div className="max-w-2xl mx-auto px-6 mb-20">
              <SeatMap seats={seats} selectedSeats={selectedSeats} onToggleSeat={handleToggleSeat} />
              <div className="mt-6 flex justify-between items-center">
                <button
                  onClick={() => setStep('select-flight')}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600"
                >
                  &larr; Back to Flight Results
                </button>
                <button
                  disabled={selectedSeats.length === 0}
                  onClick={() => setStep('passenger-form')}
                  className="px-8 py-3 bg-navy-900 hover:bg-navy-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg transition border-b-2 border-gold-400"
                >
                  Enter Passenger Details ({selectedSeats.length} Selected)
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Passenger Details */}
          {step === 'passenger-form' && (
            <PassengerForm
              passengers={passengers}
              onChangePassenger={handleChangePassenger}
              onProceedToPayment={() => setIsPaymentModalOpen(true)}
              onCancel={() => setStep('seat-map')}
              totalFare={calculatedTotal}
            />
          )}

          {/* Step 4: Payment */}
          {isPaymentModalOpen && (
            <PaymentModal
              amount={calculatedTotal}
              onConfirmPayment={handleExecutePayment}
              onCancel={() => setIsPaymentModalOpen(false)}
              isProcessing={isProcessingPayment}
            />
          )}

          {/* Available Flights List */}
          <div className="max-w-5xl mx-auto px-6 mb-16 space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-black text-navy-900">Scheduled Zambian Sectors</h3>
              <span className="text-xs font-bold text-slate-400">{flights.length} flights scheduled</span>
            </div>

            {flights.map((f) => (
              <div key={f.flight_id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 hover:border-sky-300 transition">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-xl font-black text-navy-900">
                    🇿🇲
                  </div>
                  <div>
                    <span className="text-xs font-bold text-sky-600">{f.airline_name} &bull; {f.flight_number}</span>
                    <div className="text-2xl font-black text-navy-900 mt-1">
                      {f.departure_airport} &rarr; {f.arrival_airport}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {f.departure_city} to {f.arrival_city} &bull; Departure: {new Date(f.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>

                <div className="text-center md:text-right">
                  <span className="text-xs text-slate-400 block uppercase">Fare per passenger</span>
                  <span className="text-2xl font-black text-navy-900 font-mono">K {Number(f.ticket_price).toLocaleString()}</span>
                  <button
                    onClick={() => handleSelectFlight(f)}
                    className="mt-2 block px-6 py-2.5 bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-xl shadow transition"
                  >
                    {user ? 'Select Seats &rarr;' : 'Sign In to Book &rarr;'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Popular Zambian Destinations & Special Offers */}
          <div className="max-w-7xl mx-auto px-6">
            <PopularDestinations onSelectRoute={(code) => handleSearch({ dept_iata: 'LUN', arr_iata: code, date: '2026-11-15', cabin_class: 'economy', passengers: 1 })} />
            <OffersAndPerks />
          </div>

          <Footer />
        </div>
      )}
    </div>
  );
}