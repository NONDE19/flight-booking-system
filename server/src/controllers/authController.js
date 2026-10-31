const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

exports.register = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { email, password, first_name, last_name, phone, role = 'customer' } = req.body;

    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({ error: 'Email, password, first name, and last name are required.' });
    }

    const [[existing]] = await connection.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email address already exists.' });
    }

    await connection.beginTransaction();

    const uuid = crypto.randomUUID();
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const [userResult] = await connection.execute(
      'INSERT INTO users (uuid, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [uuid, email, passwordHash, role]
    );
    const userId = userResult.insertId;

    if (role === 'customer') {
      await connection.execute(
        'INSERT INTO customers (user_id, first_name, last_name, phone) VALUES (?, ?, ?, ?)',
        [userId, first_name, last_name, phone || null]
      );
    } else if (role === 'staff') {
      const empCode = 'EMP-' + crypto.randomInt(1000, 9999);
      await connection.execute(
        'INSERT INTO staff (user_id, employee_code, department, first_name, last_name, station_code) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, empCode, 'Operations', first_name, last_name, 'JFK']
      );
    }

    await connection.commit();

    const token = jwt.sign(
      { id: userId, uuid, email, role, name: `${first_name} ${last_name}` },
      process.env.JWT_SECRET || 'super_secret_jwt_flight_reservation_key_2026',
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: { id: userId, email, role, name: `${first_name} ${last_name}` }
    });
  } catch (err) {
    await connection.rollback();
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Registration failed due to an internal server error.' });
  } finally {
    connection.release();
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const [[user]] = await db.execute(
      `SELECT u.id, u.uuid, u.email, u.password_hash, u.role, u.is_active,
              COALESCE(c.first_name, s.first_name, 'User') AS first_name,
              COALESCE(c.last_name, s.last_name, '') AS last_name
       FROM users u
       LEFT JOIN customers c ON c.user_id = u.id
       LEFT JOIN staff s ON s.user_id = u.id
       WHERE u.email = ?`,
      [email]
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (!user.is_active) {
      return res.status(403).json({ error: 'This account has been deactivated. Please contact support.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const fullName = `${user.first_name} ${user.last_name}`.trim();
    const token = jwt.sign(
      { id: user.id, uuid: user.uuid, email: user.email, role: user.role, name: fullName },
      process.env.JWT_SECRET || 'super_secret_jwt_flight_reservation_key_2026',
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      token,
      user: { id: user.id, email: user.email, role: user.role, name: fullName }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Authentication failed.' });
  }
};
