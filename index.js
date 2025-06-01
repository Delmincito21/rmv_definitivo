import express from 'express';
import mysql from 'mysql2';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const port = 3000;

const db = mysql.createConnection({
  host: 'mysql.railway.internal',
  user: 'root',
  password: 'JEWZIacsisWhxsrEdTrHKjGwEMjvPxKO',
  database: 'railway',
  port: 3306,
  connectTimeout: 30000,
  timeout: 30000,
  acquireTimeout: 30000
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
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

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
