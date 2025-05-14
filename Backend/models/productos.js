const db = require('../config/db.config.js');

class Producto {
    static async getAll() {
        try {
            const [rows] = await db.promise().query('SELECT * FROM productos');
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async create(productoData) {
        const {
            nombre_producto,
            descripcion_producto,
            marca_producto,
            precio_producto,
            stock_producto,
            modelo,
            color,
            garantia,
            id_categoria,
            id_suplidor,
            estado
        } = productoData;

        try {
            const [result] = await db.promise().query(
                `INSERT INTO productos (
                    nombre_producto, 
                    descripcion_producto,
                    marca_producto, 
                    precio_producto, 
                    stock_producto, 
                    modelo, 
                    color, 
                    garantia, 
                    id_categoria, 
                    id_suplidor, 
                    estado
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    nombre_producto,
                    descripcion_producto,
                    marca_producto,
                    precio_producto,
                    stock_producto,
                    modelo,
                    color,
                    garantia,
                    id_categoria,
                    id_suplidor,
                    estado || 'activo'
                ]
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async getById(id) {
        try {
            const [rows] = await db.promise().query('SELECT * FROM productos WHERE id_producto = ?', [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async update(id, productoData) {
        try {
            const [result] = await db.promise().query(
                'UPDATE productos SET ? WHERE id_producto = ?',
                [productoData, id]
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async delete(id) {
        try {
            const [result] = await db.promise().query('DELETE FROM productos WHERE id_producto = ?', [id]);
            return result;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Producto;
