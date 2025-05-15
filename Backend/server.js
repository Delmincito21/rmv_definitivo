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
app.get('/clientes', (req, res) => {
    db.query('SELECT * FROM clientes', (err, results) => {
        if (err) {
            console.error('Error al obtener clientes:', err);
            return res.status(500).json({ error: 'Error al obtener clientes' });
        }
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

app.get('/ventas', (req, res) => {
    const query = `
        SELECT 
            v.id_venta, 
            v.fecha_venta, 
            c.nombre_clientes AS cliente, 
            v.estado_venta,
            (
                SELECT COALESCE(SUM(dv.subtotal_detalle_venta), 0)
                FROM detalle_venta dv
                WHERE dv.id_venta = v.id_venta
            ) as total
        FROM venta v
        JOIN usuarios u ON v.id_usuario = u.id_usuario
        JOIN clientes c ON u.id_usuario = c.id_clientes
        WHERE v.estado = 'activo'
    `;

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
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
<<<<<<< HEAD
        const [result] = await db.query(
=======
        const [result] = await db.promise().query(
>>>>>>> cdbfa28 (funcionar boton eliminar y editar)
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
<<<<<<< HEAD
        const [result] = await db.query(
=======
        const [result] = await db.promise().query(
>>>>>>> cdbfa28 (funcionar boton eliminar y editar)
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
        // 1. Insertar el cliente
        const [clienteResult] = await db.query(
            `INSERT INTO clientes (
                nombre_clientes,
                telefono_clientes,
                direccion_clientes,
                correo_clientes,
                estado
            ) VALUES (?, ?, ?, ?, ?)`,
            [
                clienteData.nombre_clientes,
                clienteData.telefono_clientes,
                clienteData.direccion_clientes,
                clienteData.correo_clientes,
                clienteData.estado || 'activo'
            ]
        );
        // 2. Hashear el pin_usuario
        const hashedPin = await bcrypt.hash(pin_usuario, 10);
        // 3. Insertar en la tabla usuarios
        await db.query(
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
        res.status(201).json({ message: 'Cliente y usuario registrados exitosamente', id_clientes: clienteResult.insertId });
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
    try {
        console.log('Datos recibidos en /ventas:', req.body);
        const result = await Venta.create(req.body);
        console.log('Resultado de crear venta:', result);
        res.status(201).json({
            message: 'Venta creada exitosamente',
            id: result.insertId
        });
    } catch (error) {
        console.error('Error detallado al crear la venta:', error);
        res.status(500).json({
            error: 'Error al crear la venta',
            details: error.message,
            sqlMessage: error.sqlMessage
        });
    }
});

app.get('/ventas/:id', async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT 
                v.id_venta, 
                v.fecha_venta, 
                v.estado_venta,
                v.estado,
                v.origen,
                v.id_usuario,
                u.nombre_usuario,
                c.nombre_clientes,
                c.direccion_clientes,
                c.telefono_clientes,
                c.correo_clientes
            FROM venta v
            LEFT JOIN usuarios u ON v.id_usuario = u.id_usuario
            LEFT JOIN clientes c ON c.id_usuario = v.id_usuario
            WHERE v.id_venta = ?`,
            [req.params.id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener la venta:', error);
        res.status(500).json({ error: 'Error al obtener la venta' });
    }
}); 



app.put('/ventas/:id', async (req, res) => {
    try {
        const ventaData = { ...req.body };

        // Formatear la fecha correctamente para MySQL
        if (ventaData.fecha_venta) {
            const fecha = new Date(ventaData.fecha_venta);
            ventaData.fecha_venta = fecha.toISOString().slice(0, 19).replace('T', ' ');
        }

        const [result] = await db.query(
            'UPDATE venta SET ? WHERE id_venta = ?',
            [ventaData, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }

        res.json({ message: 'Venta actualizada exitosamente' });
    } catch (error) {
        console.error('Error al actualizar la venta:', error);
        res.status(500).json({ error: 'Error al actualizar la venta', details: error.message });
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
<<<<<<< HEAD
        await db.query(
=======
        await db.promise().query(
>>>>>>> ba488a2 (add btn delete venta)
            'UPDATE venta SET estado = ? WHERE id_venta = ?',
            [estado, id_venta]
        );

        // Actualizar estado de los detalles de venta
<<<<<<< HEAD
        await db.query(
=======
        await db.promise().query(
>>>>>>> ba488a2 (add btn delete venta)
            'UPDATE detalle_venta SET estado = ? WHERE id_venta = ?',
            [estado, id_venta]
        );

        // Actualizar estado de los pagos relacionados
<<<<<<< HEAD
        await db.query(
=======
        await db.promise().query(
>>>>>>> ba488a2 (add btn delete venta)
            'UPDATE pago SET estado = ? WHERE id_venta = ?',
            [estado, id_venta]
        );

        // Obtener las órdenes relacionadas con la venta
<<<<<<< HEAD
        const [ordenes] = await db.query(
=======
        const [ordenes] = await db.promise().query(
>>>>>>> ba488a2 (add btn delete venta)
            'SELECT id_orden FROM orden WHERE id_venta = ?',
            [id_venta]
        );

        // Actualizar estado de las órdenes
<<<<<<< HEAD
        await db.query(
=======
        await db.promise().query(
>>>>>>> ba488a2 (add btn delete venta)
            'UPDATE orden SET estado = ? WHERE id_venta = ?',
            [estado, id_venta]
        );

        // Actualizar estado de los envíos relacionados con las órdenes
        for (const orden of ordenes) {
<<<<<<< HEAD
            await db.query(
=======
            await db.promise().query(
>>>>>>> ba488a2 (add btn delete venta)
                'UPDATE envios SET estado = ? WHERE id_orden = ?',
                [estado, orden.id_orden]
            );
        }

        res.json({ message: 'Estados actualizados exitosamente' });
    } catch (error) {
        console.error('Error al actualizar estados:', error);
<<<<<<< HEAD
        res.status(500).json({
            error: 'Error al actualizar los estados',
            details: error.message
=======
        res.status(500).json({ 
            error: 'Error al actualizar los estados',
            details: error.message 
>>>>>>> ba488a2 (add btn delete venta)
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
<<<<<<< HEAD
=======

>>>>>>> cdbfa28 (funcionar boton eliminar y editar)
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
        console.log('Buscando detalles para venta:', req.params.id);
        const [rows] = await db.query(
            'SELECT * FROM detalle_venta WHERE id_venta = ? AND LOWER(estado) = "activo"',
            [req.params.id]
        );
        console.log('Detalles encontrados:', rows);
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
<<<<<<< HEAD
        const [result] = await db.query(
            'UPDATE orden SET ? WHERE id_orden = ?',
            [req.body, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Orden no encontrada' });
        }

=======
        const result = await Orden.update(req.params.id, req.body);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Orden no encontrada' });
        }
>>>>>>> 7bad6dd (add conexion venta)
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

<<<<<<< HEAD
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
=======
app.get('/envios/orden/:id', async (req, res) => {
    try {
        const envio = await Envio.getByOrdenId(req.params.id);
        if (!envio) {
            return res.status(404).json({ error: 'Envío no encontrado para esta orden' });
        }
        res.json(envio);
    } catch (error) {
        console.error('Error al obtener el envío:', error);
        res.status(500).json({ error: 'Error al obtener el envío' });
>>>>>>> 7bad6dd (add conexion venta)
    }
});

app.put('/envios/:id', async (req, res) => {
    try {
<<<<<<< HEAD
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

        const dataToUpdate = {
            fecha_estimada_envio: req.body.fecha_estimada_envio ?
                new Date(req.body.fecha_estimada_envio).toISOString().slice(0, 19).replace('T', ' ') :
                null,
            direccion_entrega_envio: req.body.direccion_entrega_envio,
            estado_envio: req.body.estado_envio,
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
=======
        const result = await Envio.update(req.params.id, req.body);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Envío no encontrado' });
        }
        res.json({ message: 'Envío actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar el envío:', error);
        res.status(500).json({ error: 'Error al actualizar el envío' });
>>>>>>> 7bad6dd (add conexion venta)
    }
});

app.put('/envios/:id/estado', async (req, res) => {
<<<<<<< HEAD
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
=======
    try {
        const { estado } = req.body;
        if (!estado) {
            return res.status(400).json({ error: 'El estado es requerido' });
        }
        const result = await Envio.updateEstado(req.params.id, estado);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Envío no encontrado' });
        }
        res.json({ message: 'Estado del envío actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar el estado del envío:', error);
        res.status(500).json({ error: 'Error al actualizar el estado del envío' });
>>>>>>> 7bad6dd (add conexion venta)
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
app.get('/pagos', async (req, res) => {
    try {
        const pagos = await Pago.getAll();
        res.json(pagos);
    } catch (error) {
        console.error('Error al obtener pagos:', error);
        res.status(500).json({ error: 'Error al obtener pagos' });
    }
});

app.post('/pagos', async (req, res) => {
    try {
        console.log('Datos recibidos en /pagos:', req.body);
        const result = await Pago.create(req.body);
        console.log('Resultado de crear pago:', result);
        res.status(201).json({
            message: 'Pago creado exitosamente',
            id: result.insertId
        });
    } catch (error) {
        console.error('Error detallado al crear el pago:', error);
<<<<<<< HEAD
<<<<<<< HEAD
        res.status(500).json({
=======
        res.status(500).json({ 
>>>>>>> 7bad6dd (add conexion venta)
=======
        res.status(500).json({
>>>>>>> cdbfa28 (funcionar boton eliminar y editar)
            error: 'Error al crear el pago',
            details: error.message,
            sqlMessage: error.sqlMessage
        });
    }
});

app.get('/pagos/:id', async (req, res) => {
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

app.put('/pagos/:id', async (req, res) => {
    try {
<<<<<<< HEAD
        const [result] = await db.query(
            'UPDATE pago SET ? WHERE id_pago = ?',
            [req.body, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Pago no encontrado' });
        }

=======
        const result = await Pago.update(req.params.id, req.body);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Pago no encontrado' });
        }
>>>>>>> 7bad6dd (add conexion venta)
        res.json({ message: 'Pago actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar el pago:', error);
        res.status(500).json({ error: 'Error al actualizar el pago' });
    }
});

app.delete('/pagos/:id', async (req, res) => {
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

<<<<<<< HEAD
<<<<<<< HEAD
// Ruta para obtener pago por ID de venta
app.get('/pagos/venta/:id', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM pago WHERE id_venta = ? AND estado = "activo"',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.json(null); // Devolver null si no hay resultados
        }

        res.json(rows[0]); // Devolver el primer pago encontrado
    } catch (error) {
        console.error('Error al obtener el pago:', error);
        res.status(500).json({ error: 'Error al obtener el pago' });
    }
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
=======
// GET todos los suplidores
app.get('/suplidores', async (req, res) => {
    try {
        const [suplidores] = await db.promise().query('SELECT * FROM suplidores');
>>>>>>> cdbfa28 (funcionar boton eliminar y editar)
        res.json(suplidores);
    } catch (error) {
        console.error('Error al obtener suplidores:', error);
        res.status(500).json({ error: 'Error al obtener suplidores' });
    }
});

<<<<<<< HEAD
// Ruta para actualizar un detalle de venta
app.put('/detalle-ventas/:id_venta/:id_producto', async (req, res) => {
    try {
        const [result] = await db.query(
            'UPDATE detalle_venta SET ? WHERE id_venta = ? AND id_producto = ?',
            [req.body, req.params.id_venta, req.params.id_producto]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Detalle de venta no encontrado' });
        }

        res.json({ message: 'Detalle de venta actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar el detalle de venta:', error);
        res.status(500).json({ error: 'Error al actualizar el detalle de venta' });
    }
});

app.get('/dashboard/proximos-envios', async (req, res) => {
    console.log('Recibida petición a /dashboard/proximos-envios');
    try {
        const [envios] = await db.query('SELECT * FROM vw_proximos_envios');
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
                p.nombre_producto as nombre,
                COUNT(dv.id_producto) as cantidad
            FROM detalle_venta dv
            JOIN productos p ON dv.id_producto = p.id_producto
            JOIN venta v ON dv.id_venta = v.id_venta
            WHERE v.estado = 'activo'
            AND MONTH(v.fecha_venta) = MONTH(CURRENT_DATE())
            AND YEAR(v.fecha_venta) = YEAR(CURRENT_DATE())
            GROUP BY p.id_producto, p.nombre_producto
            ORDER BY cantidad DESC
            LIMIT 5
        `);

        console.log('Productos más vendidos obtenidos:', productos);
        res.json(productos);
    } catch (error) {
        console.error('Error detallado en /api/dashboard/productos-mas-vendidos:', error);
        res.status(500).json({
            error: 'Error al obtener productos más vendidos',
            details: error.message
        });
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
        const { userId } = req.params;
        console.log(`Consultando carrito para usuario ID: ${userId}`);

        // Primero verificar si el usuario existe
        const [userExists] = await db.query('SELECT EXISTS(SELECT 1 FROM usuarios WHERE id_usuario = ?) as existe', [userId]);

        if (!userExists[0].existe) {
            console.log(`Usuario con ID ${userId} no existe`);
            return res.json({
                success: true,
                items: [],
                total: 0,
                message: 'Usuario no encontrado, carrito vacío'
            });
        }

        // Descubrir el nombre correcto de la columna
        const [columnsInfo] = await db.query('SHOW COLUMNS FROM productos');
        console.log('Columnas disponibles en productos:', columnsInfo.map(col => col.Field));

        // Encontrar el nombre de la columna que podría contener imágenes
        const possibleImageColumn = columnsInfo.find(col =>
            col.Field.includes('image') ||
            col.Field.includes('imagen') ||
            col.Field.includes('img') ||
            col.Field.includes('foto')
        );

        const imageColumnName = possibleImageColumn ? possibleImageColumn.Field : 'imagen_url';
        console.log(`Usando columna de imagen: ${imageColumnName}`);

        // Usar LEFT JOIN para evitar errores si un producto no existe
        const [items] = await db.query(`
            SELECT 
                c.id_carrito,
                c.id_producto,
                p.nombre_producto,
                p.precio_producto,
                p.${imageColumnName} AS imagen_producto,
                c.cantidad AS cantidad,
                (p.precio_producto * c.cantidad) AS subtotal
            FROM carrito c
            LEFT JOIN productos p ON c.id_producto = p.id_producto
            WHERE c.id_usuario = ?
        `, [userId]);

        console.log(`Encontrados ${items.length} items en el carrito`);
        console.log('Items crudos del carrito:', items);

        // Filtrar items donde el producto existe
        const validItems = items.filter(item => item.nombre_producto !== null);

        // Mapear los items al formato que espera el frontend
        const formattedItems = validItems.map(item => ({
            id_producto: item.id_producto,
            nombre_producto: item.nombre_producto || 'Producto no disponible',
            precio_producto: Number(item.precio_producto),
            imagen: item.imagen_producto || '',
            quantity: Number(item.cantidad),
            subtotal: Number(item.precio_producto) * Number(item.cantidad)
        }));

        console.log('formattedItems:', formattedItems);

        res.json({
            success: true,
            items: formattedItems,
            total: formattedItems.reduce((sum, item) => sum + (item.subtotal || 0), 0)
        });
    } catch (error) {
        console.error('Error detallado al obtener carrito:', error);
        console.error('SQL message:', error.sqlMessage);
        console.error('Stack:', error.stack);
        res.status(500).json({
            success: false,
            message: 'Error al obtener el carrito',
            error: error.message
        });
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

=======
>>>>>>> 7bad6dd (add conexion venta)
=======
>>>>>>> cdbfa28 (funcionar boton eliminar y editar)
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

        // 3. Registrar el pago
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
        await Envio.create({
            id_orden,
            direccion_entrega_envio: direccion_envio,
            estado_envio: 'pendiente',
            estado: 'activo'
        });

        await connection.commit();
        res.json({ success: true, message: 'Compra procesada correctamente' });
    } catch (error) {
        await connection.rollback();
        console.error('Error al procesar la compra:', error);
        res.status(500).json({ success: false, message: 'Error al procesar la compra', error: error.message });
    } finally {
        connection.release();
    }
});