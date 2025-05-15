const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: "bonsvukyvr16pz1h7azm-mysql.services.clever-cloud.com",
    user: "unnjmt2frwqemf3m",
    password: "6L3brJ1wrJkRgTMLM42E",
    database: "bonsvukyvr16pz1h7azm"
});

connection.connect(err => {
    if (err) {
        console.error('Error al conectar a MySQL:', err);
        return;
    }
    console.log('Conectado a MySQL');
});

module.exports = connection;