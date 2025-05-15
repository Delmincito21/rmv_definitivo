const db = require('../config/db.config.js');

class DetalleVenta {
    static async getAll() {
        try {
            const [rows] = await db.promise().query('SELECT * FROM detalle_venta');
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async create(detalleVentaData) {
        const {
            id_venta,
            id_producto,
            cantidad_detalle_venta,
            precio_unitario_detalle_venta,
            subtotal_detalle_venta,
            estado
        } = detalleVentaData;

        try {
            // Verificar que los datos necesarios existen
            if (!id_venta || !id_producto || !cantidad_detalle_venta || !precio_unitario_detalle_venta) {
                throw new Error('Faltan datos requeridos para crear el detalle de venta');
            }

            const [result] = await db.promise().query(
                `INSERT INTO detalle_venta (
                    id_venta,
                    id_producto,
                    cantidad_detalle_venta,
                    precio_unitario_detalle_venta,
                    subtotal_detalle_venta,
                    estado
                ) VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    id_venta,
                    id_producto,
                    cantidad_detalle_venta,
                    precio_unitario_detalle_venta,
                    subtotal_detalle_venta,
                    estado || 'activo'
                ]
            );
            return result;
        } catch (error) {
            console.error('Error en DetalleVenta.create:', error);
            throw error;
        }
    }

    static async getByVentaId(id_venta) {
        try {
            const [rows] = await db.promise().query('SELECT * FROM detalle_venta WHERE id_venta = ?', [id_venta]);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async update(id_venta, id_producto, detalleVentaData) {
        const { id_detalle_venta, ...dataToUpdate } = detalleVentaData;
        try {
            const [result] = await db.promise().query(
                'UPDATE detalle_venta SET ? WHERE id_venta = ? AND id_producto = ?',
                [dataToUpdate, id_venta, id_producto]
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async delete(id_venta, id_producto) {
        try {
            const [result] = await db.promise().query(
                'DELETE FROM detalle_venta WHERE id_venta = ? AND id_producto = ?',
                [id_venta, id_producto]
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
}

// Asegurarse de que la exportación sea correcta
const detalleVentaModel = new DetalleVenta();
module.exports = DetalleVenta;
