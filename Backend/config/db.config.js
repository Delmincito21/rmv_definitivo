// db.config.js
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool(process.env.DATABASE_URL);

try {
  const connection = await pool.getConnection();
  console.log('✅ Conexión exitosa a MySQL');
  connection.release();
} catch (error) {
  console.error('❌ Error al conectar a MySQL:', error);
  process.exit(1);
}

module.exports = pool;
