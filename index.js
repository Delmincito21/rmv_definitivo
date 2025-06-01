// index.js
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './db.config.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Test de conexión a MySQL
(async () => {
  try {
    const [rows] = await pool.query('SELECT 1');
    console.log('Conectado a MySQL 🚀');
  } catch (error) {
    console.error('Error al conectar a MySQL:', error);
    process.exit(1);
  }
})();

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

// Rutas API
app.get('/api', (req, res) => {
  res.send('API funcionando 🎉');
});

// Ruta catch-all para SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});
