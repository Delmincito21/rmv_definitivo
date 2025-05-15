const db = require('../config/db.config.js');

class Envio {
    static async getAll() {
        try {
<<<<<<< HEAD
            const [rows] = await db.query('SELECT * FROM envios WHERE estado = "activo"');
=======
            const [rows] = await db.promise().query('SELECT * FROM envios WHERE estado = "activo"');
>>>>>>> 7bad6dd (add conexion venta)
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async create(envioData) {
        const {
            fecha_estimada_envio,
            direccion_entrega_envio,
            estado_envio = 'pendiente',
            estado = 'activo',
            id_orden
        } = envioData;

        try {
            const [result] = await db.promise().query(
                `INSERT INTO envios (
                    fecha_estimada_envio,
                    direccion_entrega_envio,
                    estado_envio,
                    estado,
                    id_orden
                ) VALUES (?, ?, ?, ?, ?)`,
                [
                    fecha_estimada_envio,
                    direccion_entrega_envio,
                    estado_envio,
                    estado,
                    id_orden
                ]
            );
            return result;
        } catch (error) {
            console.error('Error en create envio:', error);
            throw error;
        }
    }

    static async getById(id) {
        try {
            const [rows] = await db.query('SELECT * FROM envios WHERE id_envio = ?', [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async getByOrdenId(id_orden) {
        try {
            const [rows] = await db.query('SELECT * FROM envios WHERE id_orden = ?', [id_orden]);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async update(id, envioData) {
        try {
<<<<<<< HEAD
            const [result] = await db.query(
=======
            const [result] = await db.promise().query(
>>>>>>> 7bad6dd (add conexion venta)
                'UPDATE envios SET ? WHERE id_envio = ?',
                [envioData, id]
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async delete(id) {
        try {
            const [result] = await db.query(
                'UPDATE envios SET estado = "inactivo" WHERE id_envio = ?',
                [id]
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Envio;
