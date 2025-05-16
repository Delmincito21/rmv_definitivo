const fs = require('fs');
const path = require('path');
const db = require('../config/db.config');

async function createViews() {
    try {
        // Leer el archivo SQL
        const sqlPath = path.join(__dirname, '..', 'sql', 'views.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Dividir el archivo en declaraciones individuales
        const statements = sql.split(';').filter(stmt => stmt.trim());

        // Ejecutar cada declaración
        for (const statement of statements) {
            if (statement.trim()) {
                console.log('Ejecutando:', statement);
                await db.query(statement);
                console.log('Vista creada exitosamente');
            }
        }

        console.log('Todas las vistas han sido creadas');
        process.exit(0);
    } catch (error) {
        console.error('Error al crear las vistas:', error);
        process.exit(1);
    }
}

createViews(); 