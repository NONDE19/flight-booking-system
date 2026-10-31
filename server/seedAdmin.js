const bcrypt = require('bcryptjs');
const db = require('./src/config/database');

async function seedMasterAdmin() {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const email = 'nondeezekiel4@gmail.com';
    const passwordHash = await bcrypt.hash('Admin@2026!', 10);

    // 1. Insert or update users table
    await connection.execute(`
      INSERT INTO users (uuid, email, password_hash, role, is_active)
      VALUES (UUID(), ?, ?, 'admin', 1)
      ON DUPLICATE KEY UPDATE 
        password_hash = VALUES(password_hash),
        role = 'admin',
        is_active = 1;
    `, [email, passwordHash]);

    // 2. Retrieve user ID
    const [[user]] = await connection.execute('SELECT id FROM users WHERE email = ?', [email]);
    const userId = user.id;

    // 3. Register Executive Staff profile
    await connection.execute(`
      INSERT INTO staff (user_id, employee_code, department, first_name, last_name, station_code)
      VALUES (?, 'ZCAA-ADM-001', 'Executive Administration', 'Nonde', 'Ezekiel', 'LUN')
      ON DUPLICATE KEY UPDATE 
        first_name = 'Nonde',
        last_name = 'Ezekiel',
        department = 'Executive Administration';
    `, [userId]);

    // 4. Also register Customer Profile with phone and NRC
    await connection.execute(`
      INSERT INTO customers (user_id, first_name, last_name, phone, passport_number, nationality)
      VALUES (?, 'Nonde', 'Ezekiel', '0973777945', '327352/13/1', 'Zambia')
      ON DUPLICATE KEY UPDATE 
        phone = '0973777945',
        passport_number = '327352/13/1',
        nationality = 'Zambia';
    `, [userId]);

    await connection.commit();

    console.log('---------------------------------------------------------');
    console.log(' MASTER ADMINISTRATOR REGISTERED SUCCESSFULLY:');
    console.log(' Name:     Nonde Ezekiel');
    console.log(' Email:    nondeezekiel4@gmail.com');
    console.log(' Phone:    0973777945');
    console.log(' NRC:      327352/13/1');
    console.log(' Role:     admin (Master Authority)');
    console.log(' Password: Admin@2026!');
    console.log('---------------------------------------------------------');
    process.exit(0);
  } catch (err) {
    await connection.rollback();
    console.error('Error seeding admin:', err);
    process.exit(1);
  } finally {
    connection.release();
  }
}

seedMasterAdmin();