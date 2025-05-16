const db = require('../config/db.config.js');

class Pago {
    static async getAll() {
        try {
            const [rows] = await db.query('SELECT * FROM pago WHERE estado = "activo"');
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async create(pagoData) {
        const {
            monto: monto_pago,
            fecha_pago,
            metodo_pago,
            referencia,
            banco_emisor,
            estado_pago,
            estado = 'activo',
            id_venta
        } = pagoData;

        try {
            const [result] = await db.query(
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
                    fecha_pago,
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
            const [rows] = await db.query('SELECT * FROM pago WHERE id_pago = ?', [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async getByVentaId(id_venta) {
        try {
            const [rows] = await db.query('SELECT * FROM pago WHERE id_venta = ?', [id_venta]);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async update(id, pagoData) {
        try {
            const [result] = await db.query(
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
            const [result] = await db.query(
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
