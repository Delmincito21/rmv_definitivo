const mysql = require('mysql2');
require('dotenv').config();

// Mostrar todas las variables de entorno disponibles
console.log('Variables de entorno disponibles:', process.env);

const pool = mysql.createPool({
    host: 'mysql.railway.internal',
    user: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQLPASSWORD || 'JEWZIacsisWhxsrEdTrHKjGwEMjvPxKO',
    database: process.env.MYSQLDATABASE || 'railway',
    port: process.env.MYSQLPORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 60000,
    timeout: 60000,
    connectTimeout: 60000,
    acquireTimeout: 60000,
    timeout: 60000,
    debug: true
});

const promisePool = pool.promise();

// Intentar conexión a la base de datos
async function testConnection() {
    try {
        // Esperar 5 segundos para que MySQL esté listo
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        const [result] = await promisePool.query('SELECT 1');
        console.log('Conexión exitosa a MySQL');
    } catch (error) {
        console.error('Error al conectar a MySQL:', error);
        console.error('Variables de entorno:', {
            MYSQLHOST: process.env.MYSQLHOST,
            RAILWAY_PRIVATE_DOMAIN: process.env.RAILWAY_PRIVATE_DOMAIN,
            MYSQLUSER: process.env.MYSQLUSER,
            MYSQLPASSWORD: process.env.MYSQLPASSWORD,
            MYSQLDATABASE: process.env.MYSQLDATABASE,
            MYSQLPORT: process.env.MYSQLPORT
        });
        process.exit(1);
    }
}

testConnection();

module.exports = promisePool;