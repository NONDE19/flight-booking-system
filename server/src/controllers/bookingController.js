const db = require('../config/database');
const { generatePNR } = require('../utils/pnr');
const { buildTicketPDF } = require('../utils/ticketGenerator');

exports.reserveSeatsAndCreateBooking = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { customer_id, flight_id, seat_ids, passengers } = req.body;

    if (!passengers || !passengers.length || passengers.length !== seat_ids.length) {
      return res.status(400).json({ error: 'Each passenger must correspond to a selected seat.' });
    }

    await connection.beginTransaction();

    const placeholders = seat_ids.map(() => '?').join(',');
    const [seats] = await connection.execute(
      `SELECT id, seat_number, cabin_class, price_multiplier, status 
       FROM seats 
       WHERE id IN (${placeholders}) AND flight_id = ? 
       FOR UPDATE`,
      [...seat_ids, flight_id]
    );

    if (seats.length !== seat_ids.length) {
      await connection.rollback();
      return res.status(400).json({ error: 'One or more selected seats do not exist on this flight.' });
    }

    for (const seat of seats) {
      if (seat.status !== 'available') {
        await connection.rollback();
        return res.status(409).json({ error: `Seat ${seat.seat_number} is no longer available.` });
      }
    }

    const [[flight]] = await connection.execute(
      `SELECT base_price_economy, base_price_business, base_price_first 
       FROM flights WHERE id = ? FOR UPDATE`,
      [flight_id]
    );

    let fareSubtotal = 0;
    seats.forEach(seat => {
      let base = flight.base_price_economy;
      if (seat.cabin_class === 'business') base = flight.base_price_business;
      if (seat.cabin_class === 'first') base = flight.base_price_first;
      fareSubtotal += Number(base) * Number(seat.price_multiplier);
    });

    const tax = fareSubtotal * 0.075;
    const grandTotal = fareSubtotal + tax;
    const pnr = generatePNR();

    const holdUntil = new Date(Date.now() + 15 * 60 * 1000);
    await connection.execute(
      `UPDATE seats SET status = 'held', held_until = ? WHERE id IN (${placeholders})`,
      [holdUntil, ...seat_ids]
    );

    const [bookingResult] = await connection.execute(
      `INSERT INTO bookings (pnr, customer_id, outbound_flight_id, total_amount, tax_amount, status)
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [pnr, customer_id || 1, flight_id, grandTotal, tax]
    );
    const bookingId = bookingResult.insertId;

    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      await connection.execute(
        `INSERT INTO passengers 
         (booking_id, first_name, last_name, date_of_birth, gender, passport_number, nationality, seat_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [bookingId, p.first_name, p.last_name, p.date_of_birth || '1990-01-01', p.gender || 'male', p.passport_number || null, p.nationality || 'Global', seat_ids[i]]
      );
    }

    await connection.commit();

    return res.status(201).json({
      success: true,
      data: {
        booking_id: bookingId,
        pnr: pnr,
        total_payable: grandTotal.toFixed(2),
        currency: 'USD',
        expires_at: holdUntil
      }
    });
  } catch (err) {
    await connection.rollback();
    console.error('Reservation error:', err);
    return res.status(500).json({ error: 'Transactional reservation failed.' });
  } finally {
    connection.release();
  }
};

exports.downloadTicketPDF = async (req, res) => {
  try {
    const { pnr } = req.params;
    const [[booking]] = await db.execute('SELECT * FROM bookings WHERE pnr = ?', [pnr]);
    if (!booking) return res.status(404).json({ error: 'PNR reservation not found.' });

    const [[passenger]] = await db.execute(
      `SELECT p.*, s.seat_number, s.cabin_class 
       FROM passengers p
       LEFT JOIN seats s ON p.seat_id = s.id
       WHERE p.booking_id = ? LIMIT 1`,
      [booking.id]
    );

    const [[flight]] = await db.execute(
      `SELECT f.*, d.city AS departure_city, d.iata_code AS departure_iata, 
              a.city AS arrival_city, a.iata_code AS arrival_iata
       FROM flights f
       JOIN airports d ON f.departure_airport_id = d.id
       JOIN airports a ON f.arrival_airport_id = a.id
       WHERE f.id = ?`,
      [booking.outbound_flight_id]
    );

    const pdfBuffer = await buildTicketPDF(booking, passenger, flight);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="BoardingPass-${pnr}.pdf"`);
    return res.send(pdfBuffer);
  } catch (err) {
    console.error('PDF error:', err);
    return res.status(500).json({ error: 'Failed to generate e-ticket boarding pass.' });
  }
};
