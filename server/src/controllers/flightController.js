const db = require('../config/database');

exports.searchFlights = async (req, res) => {
  try {
    const { 
      dept_iata, 
      arr_iata, 
      date, 
      cabin_class = 'economy', 
      passengers = 1,
      max_price
    } = req.query;

    if (!dept_iata || !arr_iata || !date) {
      return res.status(400).json({ error: 'Please supply departure airport, arrival airport, and date.' });
    }

    let query = `
      SELECT 
        f.id AS flight_id,
        f.flight_number,
        al.name AS airline_name,
        al.logo_url AS airline_logo,
        dep.iata_code AS departure_airport,
        dep.city AS departure_city,
        arr.iata_code AS arrival_airport,
        arr.city AS arrival_city,
        f.departure_time,
        f.arrival_time,
        f.flight_duration_minutes,
        f.status,
        CASE 
          WHEN ? = 'business' THEN f.base_price_business
          WHEN ? = 'first' THEN f.base_price_first
          ELSE f.base_price_economy
        END AS ticket_price,
        (
          SELECT COUNT(*) 
          FROM seats s 
          WHERE s.flight_id = f.id 
            AND s.cabin_class = ? 
            AND s.status = 'available'
        ) AS available_seats
      FROM flights f
      JOIN airlines al ON f.airline_id = al.id
      JOIN airports dep ON f.departure_airport_id = dep.id
      JOIN airports arr ON f.arrival_airport_id = arr.id
      WHERE dep.iata_code = ?
        AND arr.iata_code = ?
        AND DATE(f.departure_time) = ?
        AND f.status = 'scheduled'
    `;

    const queryParams = [cabin_class, cabin_class, cabin_class, dept_iata, arr_iata, date];

    if (max_price) {
      query += ` HAVING ticket_price <= ?`;
      queryParams.push(parseFloat(max_price));
    }

    query += ` ORDER BY ticket_price ASC`;

    const [rows] = await db.execute(query, queryParams);
    const results = rows.filter(r => r.available_seats >= parseInt(passengers, 10));

    return res.status(200).json({ success: true, count: results.length, data: results });
  } catch (error) {
    console.error('Flight query failed:', error);
    return res.status(500).json({ error: 'Database flight lookup execution failed.' });
  }
};

exports.getFlightSeats = async (req, res) => {
  try {
    const { flightId } = req.params;
    const [seats] = await db.execute(
      `SELECT id, flight_id, seat_number, cabin_class, status, price_multiplier 
       FROM seats 
       WHERE flight_id = ? 
       ORDER BY seat_number ASC`,
      [flightId]
    );

    return res.status(200).json({ success: true, data: seats });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve seating arrangement.' });
  }
};

exports.updateFlightStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['scheduled', 'boarding', 'departed', 'delayed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid flight status code.' });
    }

    await db.execute('UPDATE flights SET status = ? WHERE id = ?', [status, id]);
    return res.status(200).json({ success: true, message: `Flight status updated to ${status}.` });
  } catch (err) {
    return res.status(500).json({ error: 'Error updating flight status.' });
  }
};
