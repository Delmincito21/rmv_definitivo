const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./config/db.config'); // Cambiado a db.config.js
const Producto = require('./models/productos');
const Venta = require('./models/venta');
const DetalleVenta = require('./models/DetalleVenta.js');
const Orden = require('./models/Orden.js');
const Envio = require('./models/Envio');
const Pago = require('./models/Pago.js');
const bcrypt = require('bcrypt');
const clientes = require('./models/clientes');
const nodemailer = require('nodemailer');
const multer = require('multer');
const crypto = require('crypto');
// Abre la consola de Node.js con: node


const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

console.log('Iniciando servidor...');

// Ruta de prueba
app.get('/test', (req, res) => {
    res.json({ message: 'Servidor funcionando correctamente' });
});

// Rutas del Dashboard
console.log('Registrando rutas del dashboard...');

app.get('/dashboard/stats', async (req, res) => {
    console.log('Recibida petición a /dashboard/stats');
    try {
        // Verificar que las vistas existen
        const [vistas] = await db.query(`
            SELECT TABLE_NAME 
            FROM information_schema.views 
            WHERE TABLE_SCHEMA = DATABASE()
            AND TABLE_NAME IN ('vw_clientes_activos', 'vw_pedidos_mes_actual', 'vw_ingresos_mensuales')
        `);

        console.log('Vistas encontradas:', vistas);

        if (vistas.length < 3) {
            throw new Error('No se encontraron todas las vistas necesarias');
        }

        // Obtener datos de las vistas
        console.log('Consultando vista de clientes activos...');
        const [clientesActivos] = await db.query('SELECT * FROM vw_clientes_activos');
        console.log('Resultado clientes activos:', clientesActivos);

        console.log('Consultando vista de pedidos del mes...');
        const [pedidosMes] = await db.query('SELECT * FROM vw_pedidos_mes_actual');
        console.log('Resultado pedidos del mes:', pedidosMes);

        console.log('Consultando vista de ingresos mensuales...');
        const [ingresosMes] = await db.query('SELECT * FROM vw_ingresos_mensuales');
        console.log('Resultado ingresos mensuales:', ingresosMes);

        // Preparar respuesta
        const response = {
            clientesActivos: clientesActivos[0]?.clientes_activos || 0,
            pedidosMes: pedidosMes[0]?.pedidos_mes || 0,
            ingresosMes: ingresosMes[0]?.ingresos_mensuales || 0
        };

        console.log('Enviando respuesta:', response);
        res.json(response);
    } catch (error) {
        console.error('Error detallado al obtener estadísticas:', error);
        res.status(500).json({
            error: 'Error al obtener estadísticas',
            details: error.message
        });
    }
});

app.get('/dashboard/pedidos-por-mes', async (req, res) => {
    console.log('Recibida petición a /dashboard/pedidos-por-mes');
    try {
        const [pedidos] = await db.query('SELECT * FROM vw_pedidos_por_mes_completo_espanol');
        console.log('Pedidos por mes obtenidos:', pedidos);
        res.json(pedidos);
    } catch (error) {
        console.error('Error detallado en /dashboard/pedidos-por-mes:', error);
        res.status(500).json({
            error: 'Error al obtener pedidos por mes',
            details: error.message
        });
    }
});

// Ruta para la raíz
app.get('/', (req, res) => {
    res.send('Bienvenido al servidor de RMV');
});

// Ruta para obtener clientes
app.get('/clientes', async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM clientes');
        console.log('Clientes obtenidos:', results);
        res.json(results);
    } catch (err) {
        console.error('Error al obtener clientes:', err);
        res.status(500).json({ error: 'Error al obtener clientes' });
    }
});

app.put('/clientes/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre_clientes, telefono_clientes, direccion_clientes, correo_clientes, estado } = req.body;

    try {
        const [result] = await db.query(
            `UPDATE clientes SET 
                nombre_clientes = ?, 
                telefono_clientes = ?, 
                direccion_clientes = ?, 
                correo_clientes = ?, 
                estado = ? 
            WHERE id_clientes = ?`,
            [nombre_clientes, telefono_clientes, direccion_clientes, correo_clientes, estado, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }

        res.json({ message: 'Cliente actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar el cliente:', error);
        res.status(500).json({ error: 'Error al actualizar el cliente', details: error.message });
    }
});

app.put('/clientes/:id/inactivar', async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query(
            'UPDATE clientes SET estado = "inactivo" WHERE id_clientes = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }

        res.json({ message: 'Cliente inactivado exitosamente' });
    } catch (error) {
        console.error('Error al inactivar el cliente:', error);
        res.status(500).json({ error: 'Error al inactivar el cliente', details: error.message });
    }
});

// Ruta para obtener todas las ventas
app.get('/ventas', async (req, res) => {
    try {
        const query = `
            SELECT 
                v.id_venta, 
                v.fecha_venta, 
                c.nombre_clientes AS cliente, 
                v.estado_venta,
                (
                    SELECT COALESCE(SUM(dv.subtotal_detalle_venta), 0)
                    FROM detalle_venta dv
                    WHERE dv.id_venta = v.id_venta AND dv.estado = 'activo'
                ) as total
            FROM venta v
            JOIN usuarios u ON v.id_usuario = u.id_usuario
            JOIN clientes c ON u.id_usuario = c.id_usuario
            WHERE v.estado = 'activo'
            ORDER BY 
                CASE v.estado_venta 
                    WHEN 'pendiente' THEN 1
                    WHEN 'completa' THEN 2
                    WHEN 'cancelada' THEN 3
                    ELSE 4
                END,
                v.fecha_venta DESC
        `;

        const [results] = await db.query(query);
        console.log('Ventas obtenidas:', results);
        res.json(results);
    } catch (err) {
        console.error('Error al obtener las ventas:', err);
        res.status(500).json({ error: 'Error al obtener las ventas' });
    }
});

// GET todos los productos
app.get('/productos', async (req, res) => {
    try {
        const productos = await Producto.getAll();
        res.json(productos);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

// POST nuevo producto
app.post('/productos', async (req, res) => {
    try {
        const result = await Producto.create(req.body);
        res.status(201).json({
            message: 'Producto creado exitosamente',
            id: result.insertId
        });
    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(500).json({
            error: 'Error al crear el producto',
            details: error.message
        });
    }
});

// GET producto por ID
app.get('/productos/:id', async (req, res) => {
    try {
        const producto = await Producto.getById(req.params.id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

// PUT actualizar producto
app.put('/productos/:id', async (req, res) => {
    const { id } = req.params;
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
        estado,
    } = req.body;

    try {
        // Si stock_producto es una cadena que contiene una operación matemática
        if (typeof stock_producto === 'string' && (stock_producto.includes('+') || stock_producto.includes('-'))) {
            const [result] = await db.query(
                `UPDATE productos SET 
                    stock_producto = ${stock_producto}
                WHERE id_producto = ?`,
                [id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            res.json({ message: 'Stock del producto actualizado exitosamente' });
            return;
        }

        // Actualización normal del producto
        const [result] = await db.query(
            `UPDATE productos SET 
                nombre_producto = ?, 
                descripcion_producto = ?, 
                marca_producto = ?, 
                precio_producto = ?, 
                stock_producto = ?, 
                modelo = ?, 
                color = ?, 
                garantia = ?, 
                id_categoria = ?, 
                estado = ? 
            WHERE id_producto = ?`,
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
                estado,
                id,
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json({ message: 'Producto actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ error: 'Error al actualizar el producto', details: error.message });
    }
});

// Cambiar el estado del producto a "inactivo"
app.put('/productos/:id/inactivar', async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query(
            'UPDATE productos SET estado = "inactivo" WHERE id_producto = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json({ message: 'Producto inactivado exitosamente' });
    } catch (error) {
        console.error('Error al inactivar el producto:', error);
        res.status(500).json({ error: 'Error al inactivar el producto', details: error.message });
    }
});

// GET categorías productos
app.get('/categorias_productos', async (req, res) => {
    try {
        const query = `
            SELECT *
            FROM categorias_productos
            WHERE estado = 'activo'
        `;

        const [results] = await db.query(query);
        res.json(results);
    } catch (err) {
        console.error('Error al obtener categorías:', err);
        res.status(500).json({ error: 'Error al obtener categorías' });
    }
});

// POST para registrar un nuevo cliente
app.post('/clientes', async (req, res) => {
    const { pin_usuario, nombre_usuario, rol, ...clienteData } = req.body;
    if (!pin_usuario || !nombre_usuario) {
        return res.status(400).json({ error: 'El nombre de usuario y el pin (contraseña) son obligatorios' });
    }
    try {
        // 1. Hashear el pin_usuario
        const hashedPin = await bcrypt.hash(pin_usuario, 10);
        // 2. Insertar en la tabla usuarios primero
        const [usuarioResult] = await db.query(
            `INSERT INTO usuarios (
                nombre_usuario,
                pin_usuario,
                rol,
                estado
            ) VALUES (?, ?, ?, ?)`,
            [
                nombre_usuario,
                hashedPin,
                rol || 'cliente',
                'activo'
            ]
        );
        const id_usuario = usuarioResult.insertId;
        // 3. Insertar el cliente usando el id_usuario
        const [clienteResult] = await db.query(
            `INSERT INTO clientes (
                id_usuario,
                nombre_clientes,
                telefono_clientes,
                direccion_clientes,
                correo_clientes,
                estado
            ) VALUES (?, ?, ?, ?, ?, ?)`,
            [
                id_usuario,
                clienteData.nombre_clientes,
                clienteData.telefono_clientes,
                clienteData.direccion_clientes,
                clienteData.correo_clientes,
                clienteData.estado || 'activo'
            ]
        );
        res.status(201).json({ message: 'Cliente y usuario registrados exitosamente', id_usuario, id_clientes: clienteResult.insertId });
    } catch (error) {
        console.error('Error al registrar cliente y usuario:', error);
        res.status(500).json({ error: 'Error al registrar cliente y usuario', details: error.message });
    }
});

app.post('/login', async (req, res) => {
    const { nombre_usuario, pin_usuario } = req.body;
    try {
        // Busca el usuario activo
        const [rows] = await db.query(
            'SELECT * FROM usuarios WHERE nombre_usuario = ? AND estado = "activo"',
            [nombre_usuario]
        );

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }

        const usuario = rows[0];

        // Log para diagnóstico (puedes eliminar esto después)
        console.log("ID del usuario encontrado:", usuario.id_usuario);
        console.log("Datos completos del usuario:", usuario);

        const match = await bcrypt.compare(pin_usuario, usuario.pin_usuario);

        if (!match) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }

        // Devuelve los datos reales - SIN FORZAR NADA
        res.json({
            message: 'Login exitoso',
            rol: usuario.rol,
            id_usuario: usuario.id_usuario  // USANDO EL ID REAL
        });
    } catch (error) {
        console.error("Error completo:", error);
        res.status(500).json({ error: 'Error en el servidor', details: error.message });
    }
});

// Rutas de Ventas
app.get('/ventas', async (req, res) => {
    try {
        const ventas = await Venta.getAll();
        res.json(ventas);
    } catch (error) {
        console.error('Error al obtener ventas:', error);
        res.status(500).json({ error: 'Error al obtener ventas' });
    }
});

app.post('/ventas', async (req, res) => {
    const connection = await db.getConnection();
    try {
        console.log('Datos recibidos en /ventas:', req.body);

        await connection.beginTransaction();

        // Verificar stock antes de crear la venta
        const detalles = req.body.detalles || [];
        for (const detalle of detalles) {
            const [producto] = await connection.query(
                'SELECT stock_producto FROM productos WHERE id_producto = ? AND estado = "activo"',
                [detalle.id_producto]
            );

            if (producto.length === 0) {
                await connection.rollback();
                return res.status(400).json({
                    error: 'Error al crear la venta',
                    details: `El producto con ID ${detalle.id_producto} no existe o no está activo`
                });
            }

            if (producto[0].stock_producto < detalle.cantidad_detalle_venta) {
                await connection.rollback();
                return res.status(400).json({
                    error: 'Error al crear la venta',
                    details: `Stock insuficiente para el producto con ID ${detalle.id_producto}. Stock disponible: ${producto[0].stock_producto}`
                });
            }
        }

        // Crear la venta
        const ventaData = {
            id_usuario: req.body.id_usuario,
            fecha_venta: req.body.fecha_venta,
            estado_venta: req.body.estado_venta,
            estado: req.body.estado
        };

        const [ventaResult] = await connection.query(
            'INSERT INTO venta SET ?',
            [ventaData]
        );

        const id_venta = ventaResult.insertId;

        // Crear los detalles de venta
        for (const detalle of detalles) {
            await connection.query(
                'INSERT INTO detalle_venta SET ?',
                [{
                    id_venta: id_venta,
                    id_producto: detalle.id_producto,
                    cantidad_detalle_venta: detalle.cantidad_detalle_venta,
                    precio_unitario_detalle_venta: detalle.precio_unitario_detalle_venta,
                    subtotal_detalle_venta: detalle.subtotal_detalle_venta,
                    estado: detalle.estado
                }]
            );

            // Actualizar el stock del producto
            await connection.query(
                'UPDATE productos SET stock_producto = stock_producto - ? WHERE id_producto = ?',
                [detalle.cantidad_detalle_venta, detalle.id_producto]
            );
        }

        await connection.commit();

        res.json({
            success: true,
            id: id_venta,
            message: 'Venta creada exitosamente'
        });
    } catch (error) {
        await connection.rollback();
        console.error('Error detallado al crear la venta:', error);
        res.status(500).json({
            error: 'Error al crear la venta',
            details: error.message,
            sqlMessage: error.sqlMessage
        });
    } finally {
        connection.release();
    }
});

app.get('/ventas/:id_venta', async (req, res) => {
    const { id_venta } = req.params;
    const [ventas] = await db.query(`
        SELECT 
            v.*, 
            c.nombre_clientes, 
            c.direccion_clientes, 
            c.telefono_clientes, 
            c.correo_clientes
        FROM venta v
        JOIN clientes c ON v.id_usuario = c.id_usuario
        WHERE v.id_venta = ?
    `, [id_venta]);
    if (!ventas.length) return res.status(404).json({ error: 'Venta no encontrada' });
    res.json(ventas[0]);
});

app.put('/ventas/:id', async (req, res) => {
    const connection = await db.getConnection();
    try {
        const ventaData = { ...req.body };
        const id_venta = req.params.id;

        console.log('Iniciando actualización de venta:', {
            id_venta,
            datosRecibidos: ventaData
        });

        await connection.beginTransaction();

        // Obtener el estado actual de la venta
        const [ventaActual] = await connection.query(
            'SELECT estado_venta FROM venta WHERE id_venta = ?',
            [id_venta]
        );

        console.log('Estado actual de la venta:', ventaActual[0]);

        if (ventaActual.length === 0) {
            await connection.rollback();
            return res.status(404).json({ error: 'Venta no encontrada' });
        }

        const estadoAnterior = ventaActual[0].estado_venta;
        const nuevoEstado = ventaData.estado_venta;

        console.log('Cambio de estado:', {
            de: estadoAnterior,
            a: nuevoEstado
        });

        // Solo verificar stock si el estado cambia a 'completa'
        if (nuevoEstado === 'completa' && estadoAnterior !== 'completa') {
            console.log('Verificando stock para venta completa');
            const [detalles] = await connection.query(
                'SELECT detalle_venta.*, productos.stock_producto FROM detalle_venta JOIN productos ON detalle_venta.id_producto = productos.id_producto WHERE detalle_venta.id_venta = ? AND detalle_venta.estado = "activo"',
                [id_venta]
            );

            console.log('Detalles de la venta:', detalles);

            // Solo verificamos que haya stock suficiente
            for (const detalle of detalles) {
                if (detalle.stock_producto < detalle.cantidad_detalle_venta) {
                    await connection.rollback();
                    return res.status(400).json({
                        error: 'Error al actualizar la venta',
                        details: `Stock insuficiente para el producto con ID ${detalle.id_producto}. Stock disponible: ${detalle.stock_producto}`
                    });
                }
            }
        }
        // Si se está cancelando una venta que estaba completa, devolver el stock
        else if (nuevoEstado === 'cancelada' && estadoAnterior === 'completa') {
            console.log('Verificando detalles para venta cancelada');
            try {
                const [detalles] = await connection.query(
                    'SELECT detalle_venta.*, productos.stock_producto FROM detalle_venta JOIN productos ON detalle_venta.id_producto = productos.id_producto WHERE detalle_venta.id_venta = ? AND detalle_venta.estado = "activo"',
                    [id_venta]
                );

                console.log('Detalles encontrados para venta cancelada:', detalles);
            } catch (error) {
                console.error('Error al verificar detalles:', error);
                throw error;
            }
        }

        // Formatear la fecha correctamente para MySQL
        if (ventaData.fecha_venta) {
            const fecha = new Date(ventaData.fecha_venta);
            ventaData.fecha_venta = fecha.toISOString().slice(0, 19).replace('T', ' ');
        }

        console.log('Actualizando datos de la venta:', ventaData);

        // Actualizar la venta
        const [result] = await connection.query(
            'UPDATE venta SET ? WHERE id_venta = ?',
            [ventaData, id_venta]
        );

        console.log('Resultado de actualización de venta:', result);

        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ error: 'Venta no encontrada' });
        }

        await connection.commit();
        console.log('Transacción completada exitosamente');

        // Preparar mensaje de respuesta
        let mensajeStock = '';
        if (nuevoEstado === 'completa' && estadoAnterior !== 'completa') {
            mensajeStock = 'Stock actualizado';
        } else if (nuevoEstado === 'cancelada' && estadoAnterior === 'completa') {
            mensajeStock = 'Stock devuelto';
        }

        res.json({
            message: 'Venta actualizada exitosamente',
            stockActualizado: mensajeStock,
            estadoAnterior,
            nuevoEstado
        });

    } catch (error) {
        await connection.rollback();
        console.error('Error detallado al actualizar la venta:', {
            error: error.message,
            stack: error.stack,
            sqlMessage: error.sqlMessage
        });
        res.status(500).json({
            error: 'Error al actualizar la venta',
            details: error.message,
            sqlMessage: error.sqlMessage,
            stack: error.stack
        });
    } finally {
        connection.release();
    }
});

app.delete('/ventas/:id', async (req, res) => {
    try {
        const result = await Venta.delete(req.params.id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }
        res.json({ message: 'Venta eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar la venta:', error);
        res.status(500).json({ error: 'Error al eliminar la venta' });
    }
});

// Ruta para cambiar el estado de una venta y sus registros relacionados
app.put('/ventas/:id/estado', async (req, res) => {
    try {
        const { estado } = req.body;
        const id_venta = req.params.id;

        // Actualizar estado de la venta
        await db.query(
            'UPDATE venta SET estado = ? WHERE id_venta = ?',
            [estado, id_venta]
        );

        // Actualizar estado de los detalles de venta
        await db.query(
            'UPDATE detalle_venta SET estado = ? WHERE id_venta = ?',
            [estado, id_venta]
        );

        // Actualizar estado de los pagos relacionados
        await db.query(
            'UPDATE pago SET estado = ? WHERE id_venta = ?',
            [estado, id_venta]
        );

        // Obtener las órdenes relacionadas con la venta
        const [ordenes] = await db.query(
            'SELECT id_orden FROM orden WHERE id_venta = ?',
            [id_venta]
        );

        // Actualizar estado de las órdenes
        await db.query(
            'UPDATE orden SET estado = ? WHERE id_venta = ?',
            [estado, id_venta]
        );

        // Actualizar estado de los envíos relacionados con las órdenes
        for (const orden of ordenes) {
            await db.query(
                'UPDATE envios SET estado = ? WHERE id_orden = ?',
                [estado, orden.id_orden]
            );
        }

        res.json({ message: 'Estados actualizados exitosamente' });
    } catch (error) {
        console.error('Error al actualizar estados:', error);
        res.status(500).json({
            error: 'Error al actualizar los estados',
            details: error.message
        });
    }
});

// Rutas de Detalle Venta
app.get('/detalle-ventas', async (req, res) => {
    try {
        const detalles = await DetalleVenta.getAll();
        res.json(detalles);
    } catch (error) {
        console.error('Error al obtener detalles de venta:', error);
        res.status(500).json({ error: 'Error al obtener detalles de venta' });
    }
});

app.post('/detalle-ventas', async (req, res) => {
    try {
        console.log('Datos recibidos en /detalle-ventas:', req.body);

        // Validar que todos los campos requeridos estén presentes
        const { id_venta, id_producto, cantidad_detalle_venta, precio_unitario_detalle_venta, subtotal_detalle_venta } = req.body;

        if (!id_venta || !id_producto || !cantidad_detalle_venta || !precio_unitario_detalle_venta) {
            return res.status(400).json({
                error: 'Faltan datos requeridos',
                details: 'Todos los campos son obligatorios'
            });
        }

        // Intentar crear el detalle de venta
        const result = await DetalleVenta.create(req.body);
        console.log('Resultado de crear detalle venta:', result);

        res.status(201).json({
            message: 'Detalle de venta creado exitosamente',
            id: result.insertId
        });
    } catch (error) {
        console.error('Error detallado al crear el detalle de venta:', error);
        res.status(500).json({
            error: 'Error al crear el detalle de venta',
            details: error.message,
            sqlMessage: error.sqlMessage
        });
    }
});

app.get('/detalle-ventas/venta/:id', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM detalle_venta WHERE id_venta = ? AND estado = "activo"',
            [req.params.id]
        );
        res.json(rows); // Devolvemos todos los detalles encontrados
    } catch (error) {
        console.error('Error al obtener los detalles de venta:', error);
        res.status(500).json({ error: 'Error al obtener los detalles de venta' });
    }
});

// Rutas de Órdenes
app.get('/orden', async (req, res) => {
    try {
        const ordenes = await Orden.getAll();
        res.json(ordenes);
    } catch (error) {
        console.error('Error al obtener órdenes:', error);
        res.status(500).json({ error: 'Error al obtener órdenes' });
    }
});

app.post('/orden', async (req, res) => {
    try {
        const result = await Orden.create(req.body);
        res.status(201).json({
            message: 'Orden creada exitosamente',
            id: result.insertId
        });
    } catch (error) {
        console.error('Error al crear la orden:', error);
        res.status(500).json({ error: 'Error al crear la orden' });
    }
});

app.get('/orden/:id', async (req, res) => {
    try {
        const orden = await Orden.getById(req.params.id);
        if (!orden) {
            return res.status(404).json({ error: 'Orden no encontrada' });
        }
        res.json(orden);
    } catch (error) {
        console.error('Error al obtener la orden:', error);
        res.status(500).json({ error: 'Error al obtener la orden' });
    }
});

app.get('/orden/usuario/:id', async (req, res) => {
    try {
        const ordenes = await Orden.getByUsuarioId(req.params.id);
        res.json(ordenes);
    } catch (error) {
        console.error('Error al obtener las órdenes del usuario:', error);
        res.status(500).json({ error: 'Error al obtener las órdenes del usuario' });
    }
});

app.put('/orden/:id', async (req, res) => {
    try {
        const [result] = await db.query(
            'UPDATE orden SET ? WHERE id_orden = ?',
            [req.body, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Orden no encontrada' });
        }

        res.json({ message: 'Orden actualizada exitosamente' });
    } catch (error) {
        console.error('Error al actualizar la orden:', error);
        res.status(500).json({ error: 'Error al actualizar la orden' });
    }
});

app.delete('/orden/:id', async (req, res) => {
    try {
        const result = await Orden.delete(req.params.id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Orden no encontrada' });
        }
        res.json({ message: 'Orden eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar la orden:', error);
        res.status(500).json({ error: 'Error al eliminar la orden' });
    }
});

// Rutas de Envíos
app.get('/envios', async (req, res) => {
    try {
        const envios = await Envio.getAll();
        res.json(envios);
    } catch (error) {
        console.error('Error al obtener envíos:', error);
        res.status(500).json({ error: 'Error al obtener envíos' });
    }
});

app.post('/envios', async (req, res) => {
    try {
        // Asegurar provincia_envio siempre tiene valor
        if (!req.body.provincia_envio) req.body.provincia_envio = 'Santiago';
        const result = await Envio.create(req.body);
        res.status(201).json({
            message: 'Envío creado exitosamente',
            id: result.insertId
        });
    } catch (error) {
        console.error('Error al crear el envío:', error);
        res.status(500).json({ error: 'Error al crear el envío' });
    }
});

app.get('/envios/:id', async (req, res) => {
    try {
        const envio = await Envio.getById(req.params.id);
        if (!envio) {
            return res.status(404).json({ error: 'Envío no encontrado' });
        }
        res.json(envio);
    } catch (error) {
        console.error('Error al obtener el envío:', error);
        res.status(500).json({ error: 'Error al obtener el envío' });
    }
});

// Ruta para obtener envío por ID de orden
app.get('/envios/orden/:id', async (req, res) => {
    try {
        console.log('Buscando envío para orden:', req.params.id);
        const [rows] = await db.query(
            'SELECT * FROM envios WHERE id_orden = ? AND estado = "activo"',
            [req.params.id]
        );

        console.log('Resultado de búsqueda de envío:', rows);

        if (rows.length === 0) {
            return res.status(404).json({
                error: 'No se encontró envío para esta orden',
                ordenId: req.params.id
            });
        }

        // Devolver el primer envío encontrado
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener el envío por orden:', error);
        res.status(500).json({
            error: 'Error al obtener el envío',
            details: error.message,
            ordenId: req.params.id
        });
    }
});

app.put('/envios/:id', async (req, res) => {
    try {
        console.log('Datos recibidos para actualizar envío:', {
            id: req.params.id,
            body: req.body
        });

        // Verificar si el envío existe antes de actualizar
        const [existingEnvio] = await db.query(
            'SELECT id_envio FROM envios WHERE id_envio = ?',
            [req.params.id]
        );

        if (existingEnvio.length === 0) {
            console.error('Envío no encontrado:', req.params.id);
            return res.status(404).json({
                error: 'Envío no encontrado',
                message: 'No se encontró el envío con el ID especificado',
                id: req.params.id
            });
        }

        // Asegurar provincia_envio siempre tiene valor
        const provincia = req.body.provincia_envio || 'Santiago';

        const dataToUpdate = {
            fecha_estimada_envio: req.body.fecha_estimada_envio ?
                new Date(req.body.fecha_estimada_envio).toISOString().slice(0, 19).replace('T', ' ') :
                null,
            direccion_entrega_envio: req.body.direccion_entrega_envio,
            estado_envio: req.body.estado_envio,
            provincia_envio: provincia,
            estado: req.body.estado || 'activo'
        };

        console.log('Datos formateados para actualizar:', dataToUpdate);

        const [result] = await db.query(
            'UPDATE envios SET ? WHERE id_envio = ?',
            [dataToUpdate, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: 'No se pudo actualizar el envío',
                message: 'La actualización no afectó ningún registro',
                id: req.params.id
            });
        }

        res.json({
            message: 'Envío actualizado exitosamente',
            updatedData: dataToUpdate,
            id: req.params.id
        });
    } catch (error) {
        console.error('Error detallado al actualizar el envío:', {
            error: error.message,
            stack: error.stack,
            id: req.params.id
        });
        res.status(500).json({
            error: 'Error al actualizar el envío',
            details: error.message,
            sqlMessage: error.sqlMessage,
            id: req.params.id
        });
    }
});

app.put('/envios/:id/estado', async (req, res) => {
    const { id } = req.params;
    const { estado_envio } = req.body;

    try {
        console.log(`Actualizando estado del envío ${id} a ${estado_envio}`);

        const [result] = await db.query(
            'UPDATE envios SET estado_envio = ? WHERE id_envio = ? AND estado = "activo"',
            [estado_envio, id]
        );

        if (result.affectedRows === 0) {
            console.log('No se encontró el envío o no se pudo actualizar');
            return res.status(404).json({ error: 'Envío no encontrado o no se pudo actualizar' });
        }

        console.log('Envío actualizado exitosamente');
        res.json({ message: 'Estado del envío actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar el estado del envío:', error);
        res.status(500).json({
            error: 'Error al actualizar el estado del envío',
            details: error.message
        });
    }
});

app.delete('/envios/:id', async (req, res) => {
    try {
        const result = await Envio.delete(req.params.id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Envío no encontrado' });
        }
        res.json({ message: 'Envío eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar el envío:', error);
        res.status(500).json({ error: 'Error al eliminar el envío' });
    }
});

// Rutas de Pagos
app.get('/pago', async (req, res) => {
    try {
        const pago = await Pago.getAll();
        res.json(pago);
    } catch (error) {
        console.error('Error al obtener pagos:', error);
        res.status(500).json({ error: 'Error al obtener pagos' });
    }
});

app.post('/pago', async (req, res) => {
    try {
        console.log('Datos recibidos en /pago:', req.body);
        const result = await Pago.create(req.body);
        console.log('Resultado de crear pago:', result);
        res.status(201).json({
            message: 'Pago creado exitosamente',
            id: result.insertId
        });
    } catch (error) {
        console.error('Error detallado al crear el pago:', error);
        res.status(500).json({
            error: 'Error al crear el pago',
            details: error.message,
            sqlMessage: error.sqlMessage
        });
    }
});

app.get('/pago/:id', async (req, res) => {
    try {
        const pago = await Pago.getById(req.params.id);
        if (!pago) {
            return res.status(404).json({ error: 'Pago no encontrado' });
        }
        res.json(pago);
    } catch (error) {
        console.error('Error al obtener el pago:', error);
        res.status(500).json({ error: 'Error al obtener el pago' });
    }
});

app.put('/pago/:id', async (req, res) => {
    try {
        const [result] = await db.query(
            'UPDATE pago SET ? WHERE id_pago = ?',
            [req.body, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Pago no encontrado' });
        }

        res.json({ message: 'Pago actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar el pago:', error);
        res.status(500).json({ error: 'Error al actualizar el pago' });
    }
});

app.delete('/pago/:id', async (req, res) => {
    try {
        const result = await Pago.delete(req.params.id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Pago no encontrado' });
        }
        res.json({ message: 'Pago eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar el pago:', error);
        res.status(500).json({ error: 'Error al eliminar el pago' });
    }
});

// Ruta para obtener pago por ID de venta
app.get('/pago/venta/:id_venta', async (req, res) => {
    const { id_venta } = req.params;
    const [pago] = await db.query('SELECT * FROM pago WHERE id_venta = ?', [id_venta]);
    if (!pago) return res.status(404).json({ error: 'Pago no encontrado' });
    res.json(pago);
});

// Ruta para obtener orden por ID de venta
app.get('/orden/venta/:id', async (req, res) => {
    try {
        console.log('Buscando orden para venta:', req.params.id);
        const [rows] = await db.query(
            'SELECT * FROM orden WHERE id_venta = ? AND estado = "activo"',
            [req.params.id]
        );

        console.log('Resultado de búsqueda de orden:', rows);

        if (rows.length === 0) {
            return res.status(404).json({
                error: 'No se encontró orden para esta venta',
                ventaId: req.params.id
            });
        }

        // Devolver la primera orden encontrada
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener la orden por venta:', error);
        res.status(500).json({
            error: 'Error al obtener la orden',
            details: error.message,
            ventaId: req.params.id
        });
    }
});

// GET todos los suplidores
app.get('/suplidores', async (req, res) => {
    try {
        const [suplidores] = await db.query('SELECT * FROM suplidores');
        res.json(suplidores);
    } catch (error) {
        console.error('Error al obtener suplidores:', error);
        res.status(500).json({ error: 'Error al obtener suplidores' });
    }
});

// Ruta para actualizar un detalle de venta
app.put('/detalle-ventas/:id_venta/:id_producto', async (req, res) => {
    try {
        console.log('Actualizando detalle de venta:', {
            id_venta: req.params.id_venta,
            id_producto: req.params.id_producto,
            datos: req.body
        });

        // Primero verificar si el detalle existe
        const [detalleExistente] = await db.query(
            'SELECT * FROM detalle_venta WHERE id_venta = ? AND id_producto = ?',
            [req.params.id_venta, req.params.id_producto]
        );

        if (detalleExistente.length === 0) {
            console.log('Detalle no encontrado:', {
                id_venta: req.params.id_venta,
                id_producto: req.params.id_producto
            });
            return res.status(404).json({
                error: 'Detalle de venta no encontrado',
                details: 'No se encontró el detalle con los IDs proporcionados'
            });
        }

        // Preparar los datos para actualizar
        const datosActualizar = {
            cantidad_detalle_venta: parseInt(req.body.cantidad_detalle_venta) || detalleExistente[0].cantidad_detalle_venta,
            precio_unitario_detalle_venta: parseFloat(req.body.precio_unitario_detalle_venta) || detalleExistente[0].precio_unitario_detalle_venta,
            subtotal_detalle_venta: parseFloat(req.body.subtotal_detalle_venta) || detalleExistente[0].subtotal_detalle_venta,
            estado: req.body.estado || detalleExistente[0].estado
        };

        console.log('Datos a actualizar:', datosActualizar);

        // Realizar la actualización
        const [result] = await db.query(
            'UPDATE detalle_venta SET ? WHERE id_venta = ? AND id_producto = ?',
            [datosActualizar, req.params.id_venta, req.params.id_producto]
        );

        if (result.affectedRows === 0) {
            console.log('No se pudo actualizar el detalle');
            return res.status(500).json({
                error: 'Error al actualizar el detalle de venta',
                details: 'No se pudo actualizar el registro'
            });
        }

        console.log('Detalle actualizado exitosamente');
        res.json({
            message: 'Detalle de venta actualizado exitosamente',
            updatedData: datosActualizar
        });
    } catch (error) {
        console.error('Error al actualizar el detalle de venta:', error);
        res.status(500).json({
            error: 'Error al actualizar el detalle de venta',
            details: error.message,
            sqlMessage: error.sqlMessage
        });
    }
});

app.get('/dashboard/proximos-envios', async (req, res) => {
    console.log('Recibida petición a /dashboard/proximos-envios');
    try {
        const [envios] = await db.query(`
            SELECT * FROM vw_proximos_envios 
            WHERE semana_entrega = WEEK(CURDATE(), 1) 
              AND año_entrega = YEAR(CURDATE())
        `);
        console.log('Envíos obtenidos:', envios);
        res.json(envios);
    } catch (error) {
        console.error('Error detallado en /dashboard/proximos-envios:', error);
        res.status(500).json({
            error: 'Error al obtener próximos envíos',
            details: error.message
        });
    }
});

app.get('/api/dashboard/productos-mas-vendidos', async (req, res) => {
    console.log('Recibida petición a /api/dashboard/productos-mas-vendidos');
    try {
        const [productos] = await db.query(`
            SELECT 
                productos.nombre_producto as nombre,
                COUNT(dv.id_producto) as cantidad
            FROM detalle_venta dv
            JOIN productos ON dv.id_producto = productos.id_producto
            JOIN venta v ON dv.id_venta = v.id_venta
            WHERE v.estado = 'activo'
            AND MONTH(v.fecha_venta) = MONTH(CURRENT_DATE())
            AND YEAR(v.fecha_venta) = YEAR(CURRENT_DATE())
            GROUP BY productos.id_producto, productos.nombre_producto
            ORDER BY cantidad DESC
            LIMIT 5
        `);
        res.json(productos);
    } catch (error) {
        console.error('Error al obtener productos más vendidos:', error);
        res.status(500).json({ error: 'Error al obtener productos más vendidos' });
    }
});

app.get('/dashboard/productos-mas-vendidos', async (req, res) => {
    console.log('Recibida petición a /dashboard/productos-mas-vendidos');
    try {
        const [productos] = await db.query('SELECT * FROM vw_top3_productos_mas_vendidos');
        console.log('Productos más vendidos obtenidos:', productos);
        res.json(productos);
    } catch (error) {
        console.error('Error detallado en /dashboard/productos-mas-vendidos:', error);
        res.status(500).json({
            error: 'Error al obtener productos más vendidos',
            details: error.message
        });
    }
});

app.get('/dashboard/categorias', async (req, res) => {
    console.log('Recibida petición a /dashboard/categorias');
    try {
        const [categorias] = await db.query('SELECT * FROM vw_dashboard_categorias');
        console.log('Estadísticas de categorías obtenidas:', categorias);
        res.json(categorias);
    } catch (error) {
        console.error('Error detallado en /dashboard/categorias:', error);
        res.status(500).json({
            error: 'Error al obtener estadísticas de categorías',
            details: error.message
        });
    }
});

// Configura tu transportador de correo (usa tus credenciales reales)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'refrielectricmv@gmail.com',
        pass: 'rlfp pitl xfuu odnu'
    }
});

// Ruta para solicitar recuperación
app.post('/recuperar', async (req, res) => {
    const { email } = req.body;

    // Busca el cliente en la base de datos
    const [clientesResult] = await db.query(
        'SELECT * FROM clientes WHERE correo_clientes = ?',
        [email]
    );

    if (clientesResult.length === 0) {
        // Por seguridad, responde igual aunque no exista
        return res.json({ message: 'Si el correo está registrado, recibirás un enlace.' });
    }

    // Aquí deberías generar un token seguro y guardarlo en la BD
    const token = Math.random().toString(36).substring(2);
    const tokenExpires = new Date(Date.now() + 1000 * 60 * 30 + 1000 * 60 * 60 * 4); // suma 4 horas

    // Guarda el token y expiración en la tabla clientes
    await db.query(
        'UPDATE clientes SET reset_token = ?, reset_token_expires = ? WHERE correo_clientes = ?',
        [token, tokenExpires, email]
    );

    // Enlace de recuperación (ajusta la URL a tu frontend)
    const resetLink = `http://localhost:5173/reset-password?token=${token}&email=${email}`;

    // Envía el correo
    await transporter.sendMail({
        from: '"RMV Soporte" <refrielectricmv@gmail.com>',
        to: email,
        subject: 'Recupera tu contraseña - RMV',
        html: `
      <div style="font-family: Arial, sans-serif; background: #f8fbfd; padding: 32px;">
        <div style="max-width: 480px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 4px 24px #176bb320; padding: 32px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <img src="https://i.postimg.cc/xCTDNby2/lgo.png" alt="RMV Logo" style="width: 80px; margin-bottom: 8px;" />
            <h2 style="color: #176bb3; margin: 0;">Cambio de contraseña</h2>
          </div>
          <p style="color: #222; font-size: 1.1rem;">
            Hola,<br>
            Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en <b>RMV</b>.
          </p>
          <p style="color: #222; font-size: 1.1rem;">
            Haz clic en el siguiente botón para cambiar tu contraseña:
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetLink}" style="background: linear-gradient(90deg, #4596e7, #176bb3); color: #fff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 1.1rem; display: inline-block;">
              Cambiar contraseña
            </a>
          </div>
          <p style="color: #888; font-size: 0.95rem;">
            Si no solicitaste este cambio, puedes ignorar este correo. Tu contraseña actual seguirá siendo segura.
          </p>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 24px 0;">
          <div style="text-align: center; color: #aaa; font-size: 0.9rem;">
            © ${new Date().getFullYear()} RMV | Soporte: refrielectricmv@gmail.com
          </div>
        </div>
      </div>
    `
    });

    res.json({ message: 'Si el correo está registrado, recibirás un enlace.' });
});

// Ruta para restablecer la contraseña
app.post('/reset-password', async (req, res) => {
    try {
        const { email, token, newPassword } = req.body;
        console.log('Intentando reset:', email, token);

        const [clientesResult] = await db.query(
            'SELECT * FROM clientes WHERE correo_clientes = ? AND reset_token = ? AND reset_token_expires > NOW()',
            [email, token]
        );
        console.log('Resultado de búsqueda:', clientesResult);

        if (clientesResult.length === 0) {
            return res.status(400).json({ error: 'Token inválido o expirado.' });
        }

        // Busca el usuario relacionado a este cliente
        const cliente = clientesResult[0];
        // Si tienes una relación directa por id:
        const [usuariosResult] = await db.query(
            'SELECT * FROM usuarios WHERE id_usuario = ?',
            [cliente.id_clientes]
        );
        if (usuariosResult.length === 0) {
            return res.status(400).json({ error: 'Usuario no encontrado.' });
        }

        // 2. Hashea la nueva contraseña
        const hashedPin = await bcrypt.hash(newPassword, 10);

        await db.query(
            'UPDATE usuarios SET pin_usuario = ? WHERE id_usuario = ?',
            [hashedPin, cliente.id_clientes]
        );

        // 4. Limpia el token en clientes
        await db.query(
            'UPDATE clientes SET reset_token = NULL, reset_token_expires = NULL WHERE correo_clientes = ?',
            [email]
        );

        res.json({ message: 'Contraseña actualizada correctamente.' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la contraseña.' });
    }
});
app.get('/productos/:id/precio', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT precio_producto FROM productos WHERE id_producto = ? AND estado = "activo"',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json({ precio: rows[0].precio_producto });
    } catch (error) {
        console.error('Error al obtener el precio del producto:', error);
        res.status(500).json({ error: 'Error al obtener el precio del producto' });
    }
});

app.get('/dashboard/productos-bajo-stock', async (req, res) => {
    console.log('Recibida petición a /dashboard/productos-bajo-stock');
    try {
        const [productos] = await db.query(`
            SELECT 
                id_producto,
                nombre_producto,
                marca_producto,
                stock_producto,
                precio_producto
            FROM productos 
            WHERE estado = 'activo' 
            AND stock_producto < 5
            ORDER BY stock_producto ASC
        `);

        console.log('Productos con bajo stock obtenidos:', productos);
        res.json(productos);
    } catch (error) {
        console.error('Error al obtener productos con bajo stock:', error);
        res.status(500).json({
            error: 'Error al obtener productos con bajo stock',
            details: error.message
        });
    }
});

app.get('/dashboard/categorias-mas-vendidas', async (req, res) => {
    console.log('Recibida petición a /dashboard/categorias-mas-vendidas');
    try {
        const [categorias] = await db.query('SELECT * FROM vw_categorias_mas_vendidas');
        console.log('Categorías más vendidas obtenidas:', categorias);
        res.json(categorias);
    } catch (error) {
        console.error('Error al obtener categorías más vendidas:', error);
        res.status(500).json({
            error: 'Error al obtener categorías más vendidas',
            details: error.message
        });
    }
});

app.get('/carrito/:userId', async (req, res) => {
    try {
        const [items] = await db.query(`
            SELECT 
                c.id_carrito,
                c.id_producto,
                c.cantidad,
                productos.nombre_producto,
                productos.precio_producto,
                productos.imagen_url,
                (productos.precio_producto * c.cantidad) AS subtotal
            FROM carrito c
            INNER JOIN productos ON c.id_producto = productos.id_producto
            WHERE c.id_usuario = ? AND productos.estado = 'activo'
        `, [req.params.userId]);
        res.json({ success: true, items });
    } catch (error) {
        console.error('Error al obtener carrito:', error);
        res.status(500).json({ error: 'Error al obtener carrito' });
    }
});

// 2. Agregar o actualizar un producto en el carrito
app.post('/carrito/:userId/item', async (req, res) => {
    try {
        const { userId } = req.params;
        const { id_producto, cantidad = 1 } = req.body;

        console.log("Agregando al carrito:", {
            userId,
            id_producto,
            cantidad,
            body: req.body
        });

        // Verificar si el producto ya está en el carrito
        const [existing] = await db.query(
            'SELECT * FROM carrito WHERE id_usuario = ? AND id_producto = ?',
            [userId, id_producto]
        );

        if (existing.length > 0) {
            // Actualizar cantidad si ya existe
            const newQuantity = existing[0].cantidad + cantidad;
            console.log('Enviando cantidad:', newQuantity, typeof newQuantity);
            await db.query(
                'UPDATE carrito SET cantidad = ? WHERE id_carrito = ?',
                [newQuantity, existing[0].id_carrito]
            );
        } else {
            // Insertar nuevo item
            await db.query(
                'INSERT INTO carrito (id_usuario, id_producto, cantidad) VALUES (?, ?, ?)',
                [userId, id_producto, cantidad]
            );
        }

        res.json({
            success: true,
            message: 'Producto agregado al carrito'
        });

    } catch (error) {
        console.error('Error al agregar al carrito:', error);
        res.status(500).json({
            success: false,
            message: 'Error al agregar producto al carrito'
        });
    }
});

// 3. Actualizar cantidad de un producto específico
app.put('/carrito/:userId/item/:productId', async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const { cantidad } = req.body;

        console.log('PUT carrito - Datos recibidos:', {
            userId,
            productId,
            cantidad,
            body: req.body
        });

        // Validar que userId y productId sean números válidos
        if (isNaN(parseInt(userId)) || isNaN(parseInt(productId))) {
            return res.status(400).json({
                success: false,
                message: 'ID de usuario o producto inválido'
            });
        }

        // Validar que cantidad sea un número positivo
        const cantidadNum = parseInt(cantidad);
        if (isNaN(cantidadNum) || cantidadNum < 1) {
            return res.status(400).json({
                success: false,
                message: 'La cantidad debe ser un número mayor a 0'
            });
        }

        // Verificar si el producto existe
        const [producto] = await db.query(
            'SELECT id_producto FROM productos WHERE id_producto = ? AND estado = "activo"',
            [productId]
        );

        if (producto.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'El producto no existe o no está activo'
            });
        }

        // Verificar si el item existe en el carrito
        const [itemExistente] = await db.query(
            'SELECT id_carrito FROM carrito WHERE id_usuario = ? AND id_producto = ?',
            [userId, productId]
        );

        if (itemExistente.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'El producto no está en el carrito'
            });
        }

        // Actualizar la cantidad
        const [result] = await db.query(
            'UPDATE carrito SET cantidad = ? WHERE id_usuario = ? AND id_producto = ?',
            [cantidadNum, userId, productId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'No se pudo actualizar la cantidad'
            });
        }

        // Obtener el item actualizado para la respuesta
        const [itemActualizado] = await db.query(`
            SELECT 
                c.id_carrito,
                c.id_producto,
                p.nombre_producto,
                p.precio_producto,
                c.cantidad,
                (p.precio_producto * c.cantidad) as subtotal
            FROM carrito c
            JOIN productos p ON c.id_producto = p.id_producto
            WHERE c.id_usuario = ? AND c.id_producto = ?
        `, [userId, productId]);

        res.json({
            success: true,
            message: 'Cantidad actualizada correctamente',
            item: itemActualizado[0]
        });

    } catch (error) {
        console.error('Error detallado al actualizar cantidad:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar la cantidad',
            error: error.message
        });
    }
});

// 4. Eliminar un producto del carrito
app.delete('/carrito/:userId/item/:productId', async (req, res) => {
    try {
        const { userId, productId } = req.params;

        const [result] = await db.query(
            'DELETE FROM carrito WHERE id_usuario = ? AND id_producto = ?',
            [userId, productId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado en el carrito'
            });
        }

        res.json({
            success: true,
            message: 'Producto eliminado del carrito'
        });

    } catch (error) {
        console.error('Error al eliminar del carrito:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar producto del carrito'
        });
    }
});

// 5. Vaciar completamente el carrito
app.delete('/carrito/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        await db.query(
            'DELETE FROM carrito WHERE id_usuario = ?',
            [userId]
        );

        res.json({
            success: true,
            message: 'Carrito vaciado correctamente'
        });

    } catch (error) {
        console.error('Error al vaciar carrito:', error);
        res.status(500).json({
            success: false,
            message: 'Error al vaciar el carrito'
        });
    }
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});

app.post('/procesar-compra', async (req, res) => {
    const connection = await db.getConnection();
    try {
        const { id_usuario, items, total, pago, direccion_envio } = req.body;

        await connection.beginTransaction();

        // 1. Crear la venta
        const ventaResult = await Venta.create({
            id_usuario,
            fecha_venta: new Date(),
            estado_venta: 'pendiente',
            estado: 'activo'
        });
        const id_venta = ventaResult.insertId;

        // 2. Crear los detalles de venta
        for (const item of items) {
            await DetalleVenta.create({
                id_venta,
                id_producto: item.id_producto,
                cantidad_detalle_venta: item.quantity,
                precio_unitario_detalle_venta: item.precio_producto,
                subtotal_detalle_venta: item.precio_producto * item.quantity,
                estado: 'activo'
            });
        }

        // 3. Registrar el pago SOLO si NO es transferencia
        if (pago.metodo_pago !== 'Transferencia') {
            await Pago.create({
                id_venta,
                monto_pago: pago.monto_pago,
                fecha_pago: pago.fecha_pago,
                metodo_pago: pago.metodo_pago,
                referencia: pago.referencia,
                banco_emisor: pago.banco_emisor,
                estado_pago: pago.estado_pago,
                estado: 'activo'
            });
        }
        // Si es transferencia, el pago se insertará cuando suban el comprobante

        // 4. Crear la orden
        const ordenResult = await Orden.create({
            id_usuario,
            id_venta,
            total_orden: total,
            estado_orden: 'pendiente',
            fecha_orden: new Date(),
            estado: 'activo'
        });
        const id_orden = ordenResult.insertId;

        // 5. Registrar el envío
        // Calcula la fecha estimada de envío (+3 días)
        const fechaEstimada = new Date();
        fechaEstimada.setDate(fechaEstimada.getDate() + 3);

        await Envio.create({
            id_orden,
            direccion_entrega_envio: direccion_envio,
            fecha_estimada_envio: fechaEstimada.toISOString().slice(0, 19).replace('T', ' '),
            estado_envio: 'pendiente',
            estado: 'activo'
        });

        await connection.commit();

        // 1. Obtener el correo del cliente
        console.log("Procesando compra para id_usuario:", id_usuario);
        const [clienteRows] = await connection.query(
            'SELECT correo_clientes, nombre_clientes FROM clientes WHERE id_usuario = ?',
            [id_usuario]
        );
        console.log("Resultado de búsqueda de cliente:", clienteRows);
        if (!clienteRows.length) {
            throw new Error('No se encontró el cliente para el usuario que compra');
        }
        const cliente = clienteRows[0];

        // 2. Construir el HTML de los productos comprados
        const productosHtml = items.map(item => `
            <tr>
                <td>${item.nombre_producto}</td>
                <td>${item.quantity}</td>
                <td>$${item.precio_producto}</td>
                <td>$${(item.precio_producto * item.quantity).toFixed(2)}</td>
            </tr>
        `).join('');

        // 3. Configurar el transportador de correo
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'refrielectricmv@gmail.com',
                pass: 'rlfp pitl xfuu odnu'
            }
        });

        // 4. Enviar el correo
        await transporter.sendMail({
            from: '"RMV Tienda" <TU_CORREO@gmail.com>',
            to: cliente.correo_clientes,
            subject: '¡Gracias por tu compra en RMV!',
            html: `
                <h2>¡Hola, ${cliente.nombre_clientes}!</h2>
                <p>Gracias por tu compra. Aquí tienes el resumen de tu pedido:</p>
                <table border="1" cellpadding="8" cellspacing="0">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio unitario</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${productosHtml}
                    </tbody>
                </table>
                <p><b>Total pagado:</b> $${total}</p>
                <p>¡Esperamos verte pronto!</p>
            `
        });

        // 5. Responder al frontend
        res.json({ success: true, id: id_venta, message: 'Compra procesada y correo enviado correctamente' });

    } catch (error) {
        await connection.rollback();
        console.error('Error al procesar la compra:', error);
        res.status(500).json({ success: false, message: 'Error al procesar la compra', error: error.message });
    } finally {
        connection.release();
    }
});

// Obtener todas las ventas de un usuario específico
app.get('/ventas/usuario/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [ventas] = await db.query(`
            SELECT 
                v.id_venta, 
                v.fecha_venta, 
                v.estado_venta,
                (
                    SELECT COALESCE(SUM(dv.subtotal_detalle_venta), 0)
                    FROM detalle_venta dv
                    WHERE dv.id_venta = v.id_venta
                ) as total
            FROM venta v
            WHERE v.id_usuario = ? AND v.estado = 'activo'
            ORDER BY v.fecha_venta DESC
        `, [id]);
        res.json(ventas);
    } catch (error) {
        console.error('Error al obtener ventas del usuario:', error);
        res.status(500).json({ error: 'Error al obtener ventas del usuario' });
    }
});

// Detalles completos de un pedido (venta)
app.get('/pedido/detalle/:id_venta', async (req, res) => {
    try {
        const [detalles] = await db.query(`
            SELECT d.*, productos.nombre_producto
             FROM detalle_venta d
            JOIN productos ON d.id_producto = productos.id_producto
            WHERE d.id_venta = ?
        `, [req.params.id_venta]);
        res.json(detalles);
    } catch (error) {
        console.error('Error al obtener detalles del pedido:', error);
        res.status(500).json({ error: 'Error al obtener detalles del pedido' });
    }
});

// Obtener información del usuario por ID
app.get('/usuario/:id', async (req, res) => {
    try {
        const [usuario] = await db.query(`
            SELECT u.*, c.* 
            FROM usuarios u 
            LEFT JOIN clientes c ON u.id_usuario = c.id_usuario 
            WHERE u.id_usuario = ? AND u.estado = 'activo'
        `, [req.params.id]);

        if (usuario.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(usuario[0]);
    } catch (error) {
        console.error('Error al obtener información del usuario:', error);
        res.status(500).json({ error: 'Error al obtener información del usuario' });
    }
});

// Cambiar contraseña de usuario
app.post('/cambiar-password', async (req, res) => {
    const { id_usuario, actual, nueva } = req.body;
    try {
        // 1. Buscar el usuario
        const [rows] = await db.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id_usuario]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        const usuario = rows[0];
        // 2. Verificar la contraseña actual
        const match = await bcrypt.compare(actual, usuario.pin_usuario);
        if (!match) {
            return res.status(401).json({ error: 'La contraseña actual es incorrecta' });
        }
        // 3. Hashear la nueva contraseña
        const hashed = await bcrypt.hash(nueva, 10);
        await db.query('UPDATE usuarios SET pin_usuario = ? WHERE id_usuario = ?', [hashed, id_usuario]);
        res.json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al cambiar la contraseña', details: error.message });
    }
});

const upload = multer({ storage: multer.memoryStorage() });

app.post('/pago/transferencia', upload.single('voucher'), async (req, res) => {
    try {
        const { id_venta, monto_pago, fecha_pago, referencia, banco_emisor } = req.body;
        const token = crypto.randomBytes(32).toString('hex');

        // Formatea la fecha para MySQL
        let fecha_pago_mysql = fecha_pago;
        if (fecha_pago_mysql) {
            fecha_pago_mysql = new Date(fecha_pago_mysql).toISOString().slice(0, 19).replace('T', ' ');
        }

        // Inserta el pago en la base de datos
        const [result] = await db.query(
            'INSERT INTO pago (id_venta, monto_pago, fecha_pago, metodo_pago, referencia_transaccion_pago, estado_pago, referencia, banco_emisor, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                id_venta,
                monto_pago,
                fecha_pago_mysql || new Date().toISOString().slice(0, 19).replace('T', ' '),
                'Transferencia',
                token,
                'pendiente',
                referencia,
                banco_emisor,
                'activo'
            ]
        );

        const id_pago = result.insertId;

        // Construye el enlace de validación
        const urlValidar = `http://localhost:3000/validar-pago/${id_pago}/${token}`;

        // Envía el correo al admin con el voucher adjunto (usando buffer)
        await transporter.sendMail({
            from: '"RMV Vouchers" <refrielectricmv@gmail.com>',
            to: 'refrielectricmv@gmail.com',
            subject: 'Nuevo comprobante de transferencia recibido',
            html: `
                <p>Referencia: ${referencia}</p>
                <p>Banco: ${banco_emisor}</p>
                <p><a href="${urlValidar}" style="background:#27639b;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;">Validar pago</a></p>
            `,
            attachments: [
                {
                    filename: req.file.originalname,
                    content: req.file.buffer
                }
            ]
        });

        res.json({ success: true, message: 'Comprobante recibido y enviado al administrador.' });
    } catch (error) {
        console.error('Error al recibir comprobante:', error);
        res.status(500).json({ success: false, message: 'Error al recibir el comprobante.', error: error.message });
    }
});

app.get('/validar-pago/:id/:token', async (req, res) => {
    const { id, token } = req.params;
    // Busca el pago por id y token
    const [pagos] = await db.query('SELECT * FROM pago WHERE id_pago = ? AND referencia_transaccion_pago = ?', [id, token]);
    if (pagos.length === 0) {
        return res.status(400).send('Enlace inválido o ya usado.');
    }
    // Verifica si ya está validado
    if (pagos[0].estado_pago === 'validado') {
        return res.send('Este pago ya fue validado.');
    }
    // Marca el pago como validado
    await db.query('UPDATE pago SET estado_pago = "validado" WHERE id_pago = ?', [id]);
    res.send('¡Pago validado correctamente!');
});