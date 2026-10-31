const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication token missing or malformed.' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_flight_reservation_key_2026', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid, forged, or expired session token.' });
    req.user = user;
    next();
  });
};

exports.authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied: Insufficient role permissions.' });
    }
    next();
  };
};
