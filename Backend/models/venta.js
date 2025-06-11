const db = require('../config/db.config.js');

class Venta {
    static async getAll() {
        try {
            const [rows] = await db.query(`
                SELECT 
                    v.id_venta, 
                    v.fecha_venta, 
                    c.nombre_clientes AS cliente, 
                    v.estado_venta,
                    (
                        SELECT SUM(dv.subtotal_detalle_venta)
                        FROM detalle_venta dv
                        WHERE dv.id_venta = v.id_venta
                    ) as total
                FROM venta v
                JOIN usuarios u ON v.id_usuario = u.id_usuario
                JOIN clientes c ON u.id_usuario = c.id_clientes
                WHERE v.estado = 'activo'
            `);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async create(ventaData) {
        // Validar que los campos requeridos existan
        if (!ventaData.id_usuario) {
            throw new Error('El id_usuario es requerido');
        }

        const {
            id_usuario,
            fecha_venta,
            estado_venta,
            estado
        } = ventaData;

        try {
            // Verificar que el usuario existe
            const [usuarios] = await db.query(
                'SELECT id_usuario FROM usuarios WHERE id_usuario = ?',
                [id_usuario]
            );

            if (usuarios.length === 0) {
                throw new Error(`El usuario con ID ${id_usuario} no existe`);
            }

            const [result] = await db.query(
                `INSERT INTO venta (
                    id_usuario,
                    fecha_venta,
                    estado_venta,
                    estado
                ) VALUES (?, ?, ?, ?)`,
                [
                    id_usuario,
                    fecha_venta || new Date(),
                    estado_venta || 'pendiente',
                    estado || 'activo'
                ]
            );
            return result;
        } catch (error) {
            console.error('Error en create venta:', error);
            throw error;
        }
    }

    static async getById(id) {
        try {
            const [rows] = await db.query('SELECT * FROM venta WHERE id_venta = ?', [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async update(id, ventaData) {
        const { id_venta, ...dataToUpdate } = ventaData;
        try {
            const [result] = await db.query(
                'UPDATE venta SET ? WHERE id_venta = ?',
                [dataToUpdate, id]
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async delete(id) {
        try {
            const [result] = await db.query('UPDATE venta SET estado = "inactivo" WHERE id_venta = ?', [id]);
            return result;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Venta;
