import express from 'express';
import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

db.connect(err => {
  if (err) {
    console.error('Error al conectar a MySQL:', err);
  } else {
    console.log('Conectado a MySQL');
  }
});

app.get('/', (req, res) => {
  res.send('API funcionando 🎉');
});

app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});
