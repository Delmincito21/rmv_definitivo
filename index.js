import express from 'express';
import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

const db = mysql.createConnection({
  host: process.env.MYSQLHOST || 'mysql.railway.internal',
  user: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || 'JEWZIacsisWhxsrEdTrHKjGwEMjvPxKO',
  database: process.env.MYSQLDATABASE || 'railway',
  port: process.env.MYSQLPORT || 3306
});

db.connect(err => {
  if (err) {
    console.error('Error al conectar a MySQL:', err);
    console.error('Variables de entorno:', {
      MYSQLHOST: process.env.MYSQLHOST,
      MYSQLUSER: process.env.MYSQLUSER,
      MYSQLPASSWORD: process.env.MYSQLPASSWORD,
      MYSQLDATABASE: process.env.MYSQLDATABASE,
      MYSQLPORT: process.env.MYSQLPORT
    });
  } else {
    console.log('Conectado a MySQL');
  }
});

// Servir archivos estáticos del frontend
app.use(express.static('frontend/dist'));

// Rutas API
app.get('/api', (req, res) => {
  res.send('API funcionando 🎉');
});

// Ruta catch-all para el frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});
