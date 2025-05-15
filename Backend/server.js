const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/db.config'); // Cambiado a db.config.js
const Producto = require('./models/productos');
const bcrypt = require('bcrypt');
const clientes = require('./models/clientes');
// Abre la consola de Node.js con: node


const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

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
        console.log('Clientes obtenidos:', results); // Verifica los datos aquí
        res.json(results);
    });
});

// Ruta de ejemplo
// app.get('/Ventas', (req, res) => {
//     db.query('SELECT * FROM venta', (err, results) => {
//         if (err) throw err;
//         res.json(results);
//     });
// });

app.get('/venta', (req, res) => {
    const query = `
        SELECT v.id_venta, v.fecha_venta, c.nombre_clientes AS cliente, v.total, v.estado_venta
        FROM venta v
        JOIN clientes c ON v.id_cliente = c.id_clientes
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener las ventas:', err);
            return res.status(500).json({ error: 'Error al obtener las ventas' });
        }
        console.log('Ventas obtenidas:', results); // Verifica los datos aquí
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
    try {
        const result = await Producto.update(req.params.id, req.body);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

// DELETE producto
app.delete('/productos/:id', async (req, res) => {
    try {
        const result = await Producto.delete(req.params.id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

// GET categorías productos
app.get('/categorias_productos', async (req, res) => {
    try {
        console.log('Intentando obtener categorías de la base de datos...');
        const [categorias] = await db.promise().query('SELECT * FROM categorias_productos');
        console.log('Categorías obtenidas:', categorias);
        res.json(categorias);
    } catch (error) {
        console.error('Error al obtener categorías:', error);
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
        res.status(201).json({ message: 'Cliente y usuario registrados exitosamente', id_cliente: clienteResult.insertId });
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

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});