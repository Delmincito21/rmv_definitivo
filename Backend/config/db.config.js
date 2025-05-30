const mysql = require('mysql2');

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Wyro2829",
    database: "rmvfinal2",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// Convertir el pool en promesas
const promisePool = pool.promise();

// Verificar la conexión inicial
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error al conectar a MySQL:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Se perdió la conexión con la base de datos');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('La base de datos tiene demasiadas conexiones');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('La conexión fue rechazada');
        }
    }
    if (connection) {
        console.log('Conectado a MySQL');
        connection.release();
    }
});

// Manejar errores del pool
pool.on('error', (err) => {
    console.error('Error en el pool de MySQL:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.error('Se perdió la conexión con la base de datos');
    }
});

module.exports = promisePool;