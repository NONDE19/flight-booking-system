const bcrypt = require('bcryptjs');
const db = require('./src/config/database');

async function seed() {
  try {
    const passwordHash = await bcrypt.hash('admin123', 10);
    const staffHash = await bcrypt.hash('staff123', 10);
    const custHash = await bcrypt.hash('customer123', 10);

    // 1. Admin
    await db.execute(`
      INSERT INTO users (uuid, email, password_hash, role, is_active)
      VALUES (UUID(), 'admin@skyquest.co.zm', ?, 'admin', 1)
      ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash);
    `, [passwordHash]);

    // 2. Staff
    const [staffResult] = await db.execute(`
      INSERT INTO users (uuid, email, password_hash, role, is_active)
      VALUES (UUID(), 'staff@skyquest.co.zm', ?, 'staff', 1)
      ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash);
    `, [staffHash]);

    // 3. Customer
    const [custResult] = await db.execute(`
      INSERT INTO users (uuid, email, password_hash, role, is_active)
      VALUES (UUID(), 'customer@skyquest.co.zm', ?, 'customer', 1)
      ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash);
    `, [custHash]);

    // Link customer profile
    const [[custUser]] = await db.execute("SELECT id FROM users WHERE email = 'customer@skyquest.co.zm'");
    if (custUser) {
      await db.execute(`
        INSERT INTO customers (user_id, first_name, last_name, phone, nationality)
        VALUES (?, 'Chileshe', 'Mwamba', '+260971234567', 'Zambia')
        ON DUPLICATE KEY UPDATE first_name = VALUES(first_name);
      `, [custUser.id]);
    }

    console.log('>>> [SUCCESS] Default accounts created:');
    console.log('    Admin:    admin@skyquest.co.zm    / admin123');
    console.log('    Staff:    staff@skyquest.co.zm    / staff123');
    console.log('    Customer: customer@skyquest.co.zm / customer123');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();