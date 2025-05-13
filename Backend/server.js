const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conexión a MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'caterin170730',
    database: 'rmv'
});

db.connect(err => {
    if (err) {
        console.error('Error al conectar a MySQL:', err);
        process.exit(1); // Detiene el servidor si no puede conectarse
    }
    console.log('Conectado a MySQL');
});

// Ruta para la raíz
app.get('/', (req, res) => {
    res.send('Bienvenido al servidor de RMV');
});
app.get('/clientes', (req, res) => {
    db.query('SELECT * FROM clientes', (err, results) => {
        if (err) {
            console.error('Error al obtener clientes:', err);
            return res.status(500).json({ error: 'Error al obtener clientes' });
        }
        console.log('Clientes obtenidos:', results); // Verifica los datos aquí
        res.json(results);
    });
});

// Ruta de ejemplo
app.get('/venta', (req, res) => {
    db.query('SELECT * FROM venta', (err, results) => {
        if (err) throw err;
        res.json(results);
    });

});


// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});