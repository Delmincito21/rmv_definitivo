const db = require('../config/db.config.js');

class Orden {
    static async getAll() {
        try {
            const [rows] = await db.promise().query('SELECT * FROM orden');
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async create(ordenData) {
        console.log('Datos recibidos en create orden:', ordenData);
        const {
            id_usuario,
            id_venta,
            total_orden,
            estado_orden,
            fecha_orden,
            estado
        } = ordenData;

        try {
            const query = `INSERT INTO orden (
                id_usuario,
                id_venta,
                total_orden,
                estado_orden,
                fecha_orden,
                estado
            ) VALUES (?, ?, ?, ?, ?, ?)`;
            
            const values = [
                id_usuario,
                id_venta,
                total_orden,
                estado_orden || 'pendiente',
                fecha_orden || new Date(),
                estado || 'activo'
            ];

            console.log('Query a ejecutar:', query);
            console.log('Valores a insertar:', values);

            const [result] = await db.promise().query(query, values);
            console.log('Resultado de la inserción:', result);
            return result;
        } catch (error) {
            console.error('Error detallado en create orden:', error);
            throw error;
        }
    }

    static async getById(id) {
        try {
            const [rows] = await db.promise().query('SELECT * FROM orden WHERE id_orden = ?', [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async getByUsuarioId(id_usuario) {
        try {
            const [rows] = await db.promise().query('SELECT * FROM orden WHERE id_usuario = ?', [id_usuario]);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async getByVentaId(id_venta) {
        try {
            const [rows] = await db.promise().query('SELECT * FROM orden WHERE id_venta = ?', [id_venta]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async update(id, ordenData) {
        const { id_orden, ...dataToUpdate } = ordenData;
        try {
            const [result] = await db.promise().query(
                'UPDATE orden SET ? WHERE id_orden = ?',
                [dataToUpdate, id]
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async delete(id) {
        try {
            const [result] = await db.promise().query('DELETE FROM orden WHERE id_orden = ?', [id]);
            return result;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Orden;
