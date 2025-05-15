const db = require('../config/db.config.js');

class Pago {
    static async getAll() {
        try {
<<<<<<< HEAD
            const [rows] = await db.query('SELECT * FROM pago');
=======
            const [rows] = await db.promise().query('SELECT * FROM pago WHERE estado = "activo"');
>>>>>>> 7bad6dd (add conexion venta)
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async create(pagoData) {
        const {
<<<<<<< HEAD
            monto_pago,
=======
            monto: monto_pago,
>>>>>>> 7bad6dd (add conexion venta)
            fecha_pago,
            metodo_pago,
            referencia,
            banco_emisor,
            estado_pago,
            estado = 'activo',
            id_venta
        } = pagoData;

        try {
<<<<<<< HEAD
            let fechaMysql = fecha_pago;
            if (fechaMysql && typeof fechaMysql === 'string') {
                // Si viene en formato ISO, conviértelo a formato MySQL
                fechaMysql = fechaMysql.replace('T', ' ').replace('Z', '').split('.')[0];
            }

            const [result] = await db.query(
=======
            const [result] = await db.promise().query(
>>>>>>> 7bad6dd (add conexion venta)
                `INSERT INTO pago (
                    monto_pago,
                    fecha_pago,
                    metodo_pago,
                    referencia,
                    banco_emisor,
                    estado_pago,
                    estado,
                    id_venta
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    monto_pago,
<<<<<<< HEAD
                    fechaMysql,
=======
                    fecha_pago,
>>>>>>> 7bad6dd (add conexion venta)
                    metodo_pago.toUpperCase(),
                    referencia,
                    banco_emisor,
                    estado_pago.toUpperCase(),
                    estado,
                    id_venta
                ]
            );
            return result;
        } catch (error) {
            console.error('Error en create pago:', error);
            throw error;
        }
    }

    static async getById(id) {
        try {
<<<<<<< HEAD
            const [rows] = await db.query('SELECT * FROM pago WHERE id_pago = ?', [id]);
=======
            const [rows] = await db.promise().query('SELECT * FROM pago WHERE id_pago = ?', [id]);
>>>>>>> 7bad6dd (add conexion venta)
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async getByVentaId(id_venta) {
        try {
<<<<<<< HEAD
            const [rows] = await db.query('SELECT * FROM pago WHERE id_venta = ?', [id_venta]);
=======
            const [rows] = await db.promise().query('SELECT * FROM pago WHERE id_venta = ?', [id_venta]);
>>>>>>> 7bad6dd (add conexion venta)
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async update(id, pagoData) {
        try {
<<<<<<< HEAD
            const [result] = await db.query(
=======
            const [result] = await db.promise().query(
>>>>>>> 7bad6dd (add conexion venta)
                'UPDATE pago SET ? WHERE id_pago = ?',
                [pagoData, id]
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async delete(id) {
        try {
<<<<<<< HEAD
            const [result] = await db.query(
=======
            const [result] = await db.promise().query(
>>>>>>> 7bad6dd (add conexion venta)
                'UPDATE pago SET estado = "inactivo" WHERE id_pago = ?',
                [id]
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Pago;
