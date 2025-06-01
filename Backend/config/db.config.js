// db.config.js
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Configuración de conexión detallada
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'mysql.railway.internal',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'JEWZIacsisWhxsrEdTrHKjGwEMjvPxKO',
    database: process.env.MYSQL_DATABASE || 'railway',
    port: process.env.MYSQL_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 60 * 60 * 1000,
    acquireTimeout: 60 * 60 * 1000,
    timeout: 60 * 60 * 1000,
    debug: false
});

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
