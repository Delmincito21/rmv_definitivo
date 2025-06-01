// db.config.js
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool(process.env.DATABASE_URL);

// Función para probar la conexión
const testConnection = async () => {
    try {
        const [result] = await pool.query('SELECT 1');
        console.log('✅ Conexión exitosa a MySQL');
    } catch (error) {
        console.error('❌ Error al conectar a MySQL:', error);
        process.exit(1);
    }
};

// Exportar la conexión y la función de prueba
module.exports = {
    pool,
    testConnection
};
