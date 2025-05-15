const db = require('../config/db.config.js');

class Orden {
    static async getAll() {
        try {
<<<<<<< HEAD
            const [rows] = await db.query('SELECT * FROM orden');
=======
            const [rows] = await db.promise().query('SELECT * FROM orden');
>>>>>>> 7bad6dd (add conexion venta)
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

<<<<<<< HEAD
            const [result] = await db.query(query, values);
=======
            const [result] = await db.promise().query(query, values);
>>>>>>> 7bad6dd (add conexion venta)
            console.log('Resultado de la inserción:', result);
            return result;
        } catch (error) {
            console.error('Error detallado en create orden:', error);
            throw error;
        }
    }

    static async getById(id) {
        try {
<<<<<<< HEAD
            const [rows] = await db.query('SELECT * FROM orden WHERE id_orden = ?', [id]);
=======
            const [rows] = await db.promise().query('SELECT * FROM orden WHERE id_orden = ?', [id]);
>>>>>>> 7bad6dd (add conexion venta)
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async getByUsuarioId(id_usuario) {
        try {
<<<<<<< HEAD
            const [rows] = await db.query('SELECT * FROM orden WHERE id_usuario = ?', [id_usuario]);
=======
            const [rows] = await db.promise().query('SELECT * FROM orden WHERE id_usuario = ?', [id_usuario]);
>>>>>>> 7bad6dd (add conexion venta)
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async getByVentaId(id_venta) {
        try {
<<<<<<< HEAD
            const [rows] = await db.query('SELECT * FROM orden WHERE id_venta = ?', [id_venta]);
=======
            const [rows] = await db.promise().query('SELECT * FROM orden WHERE id_venta = ?', [id_venta]);
>>>>>>> 7bad6dd (add conexion venta)
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async update(id, ordenData) {
        const { id_orden, ...dataToUpdate } = ordenData;
        try {
<<<<<<< HEAD
            const [result] = await db.query(
=======
            const [result] = await db.promise().query(
>>>>>>> 7bad6dd (add conexion venta)
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
<<<<<<< HEAD
            const [result] = await db.query('DELETE FROM orden WHERE id_orden = ?', [id]);
=======
            const [result] = await db.promise().query('DELETE FROM orden WHERE id_orden = ?', [id]);
>>>>>>> 7bad6dd (add conexion venta)
            return result;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Orden;
