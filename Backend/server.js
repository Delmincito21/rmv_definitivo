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
// Abre la consola de Node.js con: node


const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Prueba de conexión a la base de datos
db.query('SELECT 1 + 1 AS resultado', (err, results) => {
    if (err) {
        console.error('Error al probar la conexión a la base de datos:', err);
    } else {
        console.log('Conexión a la base de datos exitosa. Resultado:', results);
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
    });
});

app.put('/clientes/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre_clientes, telefono_clientes, direccion_clientes, correo_clientes, estado } = req.body;

    try {
        const [result] = await db.promise().query(
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
        const [result] = await db.promise().query(
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

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener las ventas:', err);
            return res.status(500).json({ error: 'Error al obtener las ventas' });
        }
        console.log('Ventas obtenidas:', results);
        res.json(results);
    });
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
        const [result] = await db.promise().query(
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
        const [result] = await db.promise().query(
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
app.get('/categorias_productos', (req, res) => {
    const query = `
        SELECT *
        FROM categorias_productos
        WHERE estado = 'activo'
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener categorías:', err);
            return res.status(500).json({ error: 'Error al obtener categorías' });
        }
        res.json(results);
    });
});

// POST para registrar un nuevo cliente
app.post('/clientes', async (req, res) => {
    const { pin_usuario, nombre_usuario, rol, ...clienteData } = req.body;
    if (!pin_usuario || !nombre_usuario) {
        return res.status(400).json({ error: 'El nombre de usuario y el pin (contraseña) son obligatorios' });
    }
    try {
        // 1. Insertar el cliente
        const [clienteResult] = await db.promise().query(
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
        await db.promise().query(
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
        // Busca el usuario activo en la base de datos
        const [rows] = await db.promise().query(
            'SELECT * FROM usuarios WHERE nombre_usuario = ? AND estado = "activo"',
            [nombre_usuario]
        );
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }
        const usuario = rows[0];
        // Compara la contraseña hasheada
        const match = await bcrypt.compare(pin_usuario, usuario.pin_usuario);
        if (!match) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }
        // Devuelve el rol y cualquier otro dato necesario
        res.json({ message: 'Login exitoso', rol: usuario.rol });
    } catch (error) {
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
        const venta = await Venta.getById(req.params.id);
        if (!venta) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }
        res.json(venta);
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

        const [result] = await db.promise().query(
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
        await db.promise().query(
            'UPDATE venta SET estado = ? WHERE id_venta = ?',
            [estado, id_venta]
        );

        // Actualizar estado de los detalles de venta
        await db.promise().query(
            'UPDATE detalle_venta SET estado = ? WHERE id_venta = ?',
            [estado, id_venta]
        );

        // Actualizar estado de los pagos relacionados
        await db.promise().query(
            'UPDATE pago SET estado = ? WHERE id_venta = ?',
            [estado, id_venta]
        );

        // Obtener las órdenes relacionadas con la venta
        const [ordenes] = await db.promise().query(
            'SELECT id_orden FROM orden WHERE id_venta = ?',
            [id_venta]
        );

        // Actualizar estado de las órdenes
        await db.promise().query(
            'UPDATE orden SET estado = ? WHERE id_venta = ?',
            [estado, id_venta]
        );

        // Actualizar estado de los envíos relacionados con las órdenes
        for (const orden of ordenes) {
            await db.promise().query(
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
        const [rows] = await db.promise().query(
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
        const [result] = await db.promise().query(
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
        const [rows] = await db.promise().query(
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
        const [existingEnvio] = await db.promise().query(
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
        
        const [result] = await db.promise().query(
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
        res.status(500).json({
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
        const [result] = await db.promise().query(
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

// Ruta para obtener pago por ID de venta
app.get('/pagos/venta/:id', async (req, res) => {
    try {
        const [rows] = await db.promise().query(
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
        const [rows] = await db.promise().query(
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
        const [suplidores] = await db.promise().query('SELECT * FROM suplidores');
        res.json(suplidores);
    } catch (error) {
        console.error('Error al obtener suplidores:', error);
        res.status(500).json({ error: 'Error al obtener suplidores' });
    }
});

// Ruta para actualizar un detalle de venta
app.put('/detalle-ventas/:id_venta/:id_producto', async (req, res) => {
    try {
        const [result] = await db.promise().query(
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

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});