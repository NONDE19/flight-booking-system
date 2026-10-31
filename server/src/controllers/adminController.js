const db = require('../config/database');

exports.getMetrics = async (req, res) => {
  try {
    const [[revenue]] = await db.execute("SELECT COALESCE(SUM(amount), 0) AS total_revenue FROM payments WHERE status = 'successful'");
    const [[bookings]] = await db.execute("SELECT COUNT(*) AS total_bookings FROM bookings");
    const [[flights]] = await db.execute("SELECT COUNT(*) AS active_flights FROM flights WHERE status IN ('scheduled', 'boarding')");
    const [[pending]] = await db.execute("SELECT COUNT(*) AS pending_payments FROM bookings WHERE status = 'pending'");
    const [[customers]] = await db.execute("SELECT COUNT(*) AS total_customers FROM customers");

    return res.status(200).json({
      success: true,
      data: {
        total_revenue: parseFloat(revenue.total_revenue),
        total_bookings: bookings.total_bookings,
        active_flights: flights.active_flights,
        pending_payments: pending.pending_payments,
        total_customers: customers.total_customers
      }
    });
  } catch (err) {
    console.error('Metrics error:', err);
    return res.status(500).json({ error: 'Failed to retrieve telemetry metrics.' });
  }
};

exports.getAllFlights = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT f.*, 
             al.name AS airline_name, 
             ac.model AS aircraft_model, ac.tail_number,
             dep.iata_code AS dep_iata, dep.city AS dep_city,
             arr.iata_code AS arr_iata, arr.city AS arr_city
      FROM flights f
      JOIN airlines al ON f.airline_id = al.id
      JOIN aircraft ac ON f.aircraft_id = ac.id
      JOIN airports dep ON f.departure_airport_id = dep.id
      JOIN airports arr ON f.arrival_airport_id = arr.id
      ORDER BY f.departure_time DESC
    `);
    return res.status(200).json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch flight list.' });
  }
};

exports.createFlight = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const {
      flight_number, airline_id = 1, aircraft_id = 1,
      departure_airport_id, arrival_airport_id,
      departure_time, arrival_time, flight_duration_minutes,
      base_price_economy, base_price_business, base_price_first
    } = req.body;

    if (!flight_number || !departure_airport_id || !arrival_airport_id || !departure_time || !arrival_time) {
      return res.status(400).json({ error: 'Missing mandatory flight parameters.' });
    }

    await connection.beginTransaction();

    const [result] = await connection.execute(`
      INSERT INTO flights 
      (flight_number, airline_id, aircraft_id, departure_airport_id, arrival_airport_id,
       departure_time, arrival_time, flight_duration_minutes,
       base_price_economy, base_price_business, base_price_first, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'scheduled')
    `, [
      flight_number, airline_id, aircraft_id, departure_airport_id, arrival_airport_id,
      departure_time, arrival_time, flight_duration_minutes || 360,
      base_price_economy || 350.00, base_price_business || 950.00, base_price_first || 2200.00
    ]);
    const flightId = result.insertId;

    const seatInserts = [];
    ['1A','1B','1C','1D','1E','1F'].forEach(s => seatInserts.push([flightId, s, 'first', 'available', 1.0]));
    ['5A','5B','5C','5D','5E','5F'].forEach(s => seatInserts.push([flightId, s, 'business', 'available', 1.0]));
    ['10A','10B','10C','10D','10E','10F','11A','11B','11C','11D','11E','11F'].forEach(s => seatInserts.push([flightId, s, 'economy', 'available', 1.0]));

    for (const seat of seatInserts) {
      await connection.execute(
        'INSERT INTO seats (flight_id, seat_number, cabin_class, status, price_multiplier) VALUES (?, ?, ?, ?, ?)',
        seat
      );
    }

    await connection.commit();
    return res.status(201).json({ success: true, message: 'Flight scheduled and seats created.', flightId });
  } catch (err) {
    await connection.rollback();
    console.error('Create flight error:', err);
    return res.status(500).json({ error: 'Failed to create flight.' });
  } finally {
    connection.release();
  }
};
