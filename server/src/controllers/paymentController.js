const db = require('../config/database');
const { generateTicketNumber } = require('../utils/pnr');

exports.processPayment = async (req, res) => {
  const { booking_id, gateway = 'card', payment_token } = req.body;

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [[booking]] = await connection.execute(
      'SELECT id, pnr, customer_id, outbound_flight_id, total_amount, status FROM bookings WHERE id = ? FOR UPDATE',
      [booking_id]
    );

    if (!booking || booking.status !== 'pending') {
      await connection.rollback();
      return res.status(400).json({ error: 'Booking is either invalid or already settled.' });
    }

    const transactionRef = 'TXN-' + Date.now();

    await connection.execute(
      `INSERT INTO payments (booking_id, payment_reference, gateway, gateway_transaction_id, amount, status)
       VALUES (?, ?, ?, ?, ?, 'successful')`,
      [booking_id, transactionRef, gateway, payment_token || 'SIMULATED_TOKEN', booking.total_amount]
    );

    await connection.execute(
      `UPDATE bookings SET status = 'confirmed' WHERE id = ?`,
      [booking_id]
    );

    await connection.execute(
      `UPDATE seats s 
       JOIN passengers p ON p.seat_id = s.id 
       SET s.status = 'booked', s.held_until = NULL 
       WHERE p.booking_id = ?`,
      [booking_id]
    );

    const [passengers] = await connection.execute(
      'SELECT id, seat_id FROM passengers WHERE booking_id = ?',
      [booking_id]
    );

    for (const pax of passengers) {
      await connection.execute(
        `INSERT INTO tickets (ticket_number, booking_id, passenger_id, flight_id, seat_id)
         VALUES (?, ?, ?, ?, ?)`,
        [generateTicketNumber(), booking_id, pax.id, booking.outbound_flight_id, pax.seat_id]
      );
    }

    await connection.commit();

    return res.status(200).json({
      success: true,
      message: 'Payment verified and electronic tickets issued.',
      reference: transactionRef,
      pnr: booking.pnr
    });
  } catch (err) {
    await connection.rollback();
    console.error('Payment processing failed:', err);
    return res.status(500).json({ error: 'Transaction failed.' });
  } finally {
    connection.release();
  }
};
