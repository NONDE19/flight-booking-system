const crypto = require('crypto');

exports.generatePNR = () => {
  const charset = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let pnr = '';
  const bytes = crypto.randomBytes(6);
  for (let i = 0; i < 6; i++) {
    pnr += charset[bytes[i] % charset.length];
  }
  return pnr;
};

exports.generateTicketNumber = () => {
  return 'SQ-' + crypto.randomInt(10000000, 99999999).toString();
};
