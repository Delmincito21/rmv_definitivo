const db = require('../config/db.config.js');

class Cliente {
    static async getAll() {
        try {
            const [rows] = await db.promise().query('SELECT * FROM clientes');
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async getById(id) {
        try {
            const [rows] = await db.promise().query('SELECT * FROM clientes WHERE id_clientes = ?', [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async create(clienteData) {
        const {
            nombre_clientes,
            telefono_clientes,
            direccion_clientes,
            correo_clientes,
            estado
        } = clienteData;

        try {
            const [result] = await db.promise().query(
                `INSERT INTO clientes (
          nombre_clientes,
          telefono_clientes,
          direccion_clientes,
          correo_clientes,
          estado
        ) VALUES (?, ?, ?, ?, ?)`,
                [
                    nombre_clientes,
                    telefono_clientes,
                    direccion_clientes,
                    correo_clientes,
                    estado || 'activo'
                ]
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async update(id, clienteData) {
        try {
            const [result] = await db.promise().query(
                'UPDATE clientes SET ? WHERE id_clientes = ?',
                [clienteData, id]
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async delete(id) {
        try {
            const [result] = await db.promise().query('DELETE FROM clientes WHERE id_clientes = ?', [id]);
            return result;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Cliente;
