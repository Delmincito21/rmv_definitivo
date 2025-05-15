import React from 'react';
import './Dashboard.css';
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaPlusCircle, FaEdit, FaEye, FaHome, FaSnowflake, FaFire, FaTemperatureHigh, FaWind, FaBars, FaSearch, FaBoxOpen, FaTrash } from "react-icons/fa";
import { useState, useEffect } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function AgregarProductoForm({ onCancel }) {
  const [formData, setFormData] = useState({
    nombre_producto: '',
    descripcion_producto: '',
    marca_producto: '',
    precio_producto: '',
    stock_producto: '',
    modelo: '',
    color: '',
    garantia: '',
    id_categoria: '',
    id_suplidor: '',
    estado: 'activo'
  });

  const [loading, setLoading] = useState(false);
  const [setError] = useState(null);
  const [setCategorias] = useState([]);
  const [mostrarSuplidores, setMostrarSuplidores] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const dataToSend = {
      ...formData,
      id_categoria: formData.id_categoria,
      id_suplidor: formData.id_suplidor
    };

    try {
      const response = await fetch('http://localhost:3000/productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        throw new Error('Error al crear el producto');
      }

      // const data = await response.json();
      alert('Producto creado exitosamente');
      onCancel(); // Cierra el formulario después de crear
    } catch (err) {
      setError(err.message);
      alert('Error al crear el producto: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        console.log('Intentando obtener categorías...');
        const response = await fetch('http://localhost:3000/categorias_productos');
        console.log('Respuesta recibida:', response);

        if (!response.ok) {
          throw new Error('Error al cargar categorías');
        }

        const data = await response.json();
        console.log('Datos de categorías:', data);
        setCategorias(data);
      } catch (err) {
        console.error('Error al cargar categorías:', err);
        setError('Error al cargar las categorías');
      }
    };

    fetchCategorias();
  }, []);

  return (
    <div className="form-container">
      <form className="horizontal-product-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Agregar Producto</h2>

        {/* Primera fila horizontal */}
        <div className="form-row">
          <div className="form-field">
            <label>Nombre del Producto</label>
            <input
              type="text"
              name="nombre_producto"
              value={formData.nombre_producto}
              onChange={handleChange}
              placeholder="Ej: Aire Inverter"
              required
            />
          </div>

          <div className="form-field">
            <label>Marca</label>
            <input
              type="text"
              name="marca_producto"
              value={formData.marca_producto}
              onChange={handleChange}
              placeholder="Ej: Samsung"
              required
            />
          </div>

          <div className="form-field">
            <label>Modelo</label>
            <input
              type="text"
              name="modelo"
              value={formData.modelo}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Segunda fila horizontal */}
        <div className="form-row">
          <div className="form-field">
            <label>Precio ($DOP)</label>
            <input
              type="number"
              name="precio_producto"
              value={formData.precio_producto}
              onChange={handleChange}
              step="0.01"
              placeholder="0.00"
              required
            />
          </div>

          <div className="form-field">
            <label>Garantía</label>
            <input
              type="text"
              name="garantia"
              value={formData.garantia}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Tercera fila horizontal */}
        <div className="form-row">
          <div className="form-field">
            <label>ID Categoría</label>
            <input
              type="number"
              name="id_categoria"
              value={formData.id_categoria}
              onChange={handleChange}
              placeholder="ID de la categoría"
              required
            />
          </div>

          <div className="form-field">
            <label>Stock</label>
            <input
              type="number"
              name="stock_producto"
              value={formData.stock_producto}
              onChange={handleChange}
              placeholder="0"
              required
            />
          </div>

          <div className="form-field">
            <label>Color</label>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Cuarta fila horizontal */}
        <div className="form-row">
          <div className="form-field wide">
            <label>Descripción</label>
            <textarea
              name="descripcion_producto"
              value={formData.descripcion_producto}
              onChange={handleChange}
              placeholder="Descripción detallada..."
              rows="2"
              required
            ></textarea>
          </div>

          <div className="form-field">
            <label>ID Suplidor</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="number"
                name="id_suplidor"
                value={formData.id_suplidor}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setMostrarSuplidores(!mostrarSuplidores)}
                style={{ padding: '4px 8px', fontSize: 13 }}
              >
                {mostrarSuplidores ? 'Ocultar' : 'Ver Suplidores'}
              </button>
            </div>
          </div>
        </div>

        {mostrarSuplidores && (
          <TablaSuplidores
            onSelect={id => {
              setFormData(prev => ({ ...prev, id_suplidor: id }));
              setMostrarSuplidores(false);
            }}
          />
        )}

        {/* Quinta fila horizontal */}
        <div className="form-row">
          <div className="form-field wide">
            <label>Imagen del Producto</label>
            <input
              type="file"
              name="imagen_producto"
              accept="image/*"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Botones de acción */}
        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar Producto'}
          </button>
        </div>
      </form>
    </div>
  );
}

function TablaSuplidores({ onSelect }) {
  const [suplidores, setSuplidores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/suplidores')
      .then(res => res.json())
      .then(data => {
        setSuplidores(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div>Cargando suplidores...</div>;

  return (
    <div className="content-card" style={{ marginTop: 20 }}>
      <h4>Suplidores</h4>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Correo</th>
            <th>Estado</th>
            <th>Seleccionar</th>
          </tr>
        </thead>
        <tbody>
          {suplidores.map(suplidor => (
            <tr key={suplidor.id_suplidor}>
              <td>{suplidor.id_suplidor}</td>
              <td>{suplidor.nombre_suplidor}</td>
              <td>{suplidor.telefono_suplidor}</td>
              <td>{suplidor.direccion_suplidor}</td>
              <td>{suplidor.correo_suplidor}</td>
              <td>{suplidor.estado}</td>
              <td>
                <button type="button" onClick={() => onSelect(suplidor.id_suplidor)}>
                  Seleccionar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Componente para ver productos disponibles (sin cambios)
const ProductosDisponiblesList = () => {
  const [productos] = useState([
    { id: 1, nombre: 'Aire inverter', precio: 29.99, stock: 15, imagen: 'https://via.placeholder.com/150' },
    { id: 2, nombre: 'Aire industrial', precio: 89.50, stock: 8, imagen: 'https://via.placeholder.com/150' },
    { id: 3, nombre: 'Nevera Samsung', precio: 599.99, stock: 22, imagen: 'https://via.placeholder.com/150' },
    { id: 4, nombre: 'Aire TGM', precio: 15.00, stock: 0, imagen: 'https://via.placeholder.com/150' },
  ]);

  return (
    <div className="content-card">
      <h3 style={{ color: '#000000' }}>Productos Disponibles</h3>
      <div className="horizontal-products-container">
        {productos.map(producto => (
          <div key={producto.id} className="horizontal-product-card">
            <div className="horizontal-product-content">
              <p className="horizontal-product-price">${producto.precio.toFixed(2)}</p>
              <div className="horizontal-product-stock">
                <span className={`stock-indicator ${producto.stock > 0 ? 'in-stock' : 'out-of-stock'}`}></span>
                {producto.stock > 0 ? `${producto.stock} disponibles` : 'Sin stock'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente para modificar productos
function ModificarProductoList() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [productoEditando, setProductoEditando] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/productos')
      .then(res => res.json())
      .then(data => {
        setProductos(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleEditar = (producto) => {
    setProductoEditando(producto);
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas inactivar este producto?')) {
      try {
        const response = await fetch(`http://localhost:3000/productos/${id}/inactivar`, {
          method: 'PUT',
        });

        if (!response.ok) {
          throw new Error('Error al inactivar el producto');
        }

        alert('Producto inactivado exitosamente');

        // Actualiza la lista de productos en el frontend
        setProductos((prevProductos) =>
          prevProductos.map((producto) =>
            producto.id_producto === id ? { ...producto, estado: 'inactivo' } : producto
          )
        );
      } catch (error) {
        console.error('Error al inactivar el producto:', error);
        alert('Hubo un error al inactivar el producto. Inténtalo de nuevo.');
      }
    }
  };

  const handleGuardarEdicion = async () => {
    try {
<<<<<<< HEAD
      const response = await fetch(`http://localhost:3000/productos/${productoEditando.id_producto}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productoEditando),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el producto');
      }

      alert('Producto actualizado exitosamente');

      // Actualiza la lista de productos en el frontend
      setProductos((prevProductos) =>
        prevProductos.map((producto) =>
          producto.id_producto === productoEditando.id_producto ? productoEditando : producto
        )
      );

      // Salir del modo de edición
      setProductoEditando(null);
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      alert('Hubo un error al actualizar el producto. Inténtalo de nuevo.');
=======
        const response = await fetch(`http://localhost:3000/productos/${productoEditando.id_producto}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productoEditando),
        });

        if (!response.ok) {
            throw new Error('Error al actualizar el producto');
        }

        alert('Producto actualizado exitosamente');

        // Actualiza la lista de productos en el frontend
        setProductos((prevProductos) =>
            prevProductos.map((producto) =>
                producto.id_producto === productoEditando.id_producto ? productoEditando : producto
            )
        );

        // Salir del modo de edición
        setProductoEditando(null);
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        alert('Hubo un error al actualizar el producto. Inténtalo de nuevo.');
>>>>>>> cdbfa28 (funcionar boton eliminar y editar)
    }
  };

  const total = productos.length;
  const enStock = productos.filter(p => p.stock_producto > 0).length;
  const sinStock = productos.filter(p => p.stock_producto === 0).length;

  const productosFiltrados = productos.filter(producto =>
    producto.nombre_producto.toLowerCase().includes(busqueda.toLowerCase()) ||
    producto.marca_producto.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (loading) return <div className="loading-container"><div className="spinner"></div>Cargando productos...</div>;

  return (
    <div className="content-card">
      <h3 style={{
        color: '#2c3e50',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        fontSize: '1.6rem'
      }}>
        <FaBoxOpen style={{ color: "#3182ce", fontSize: "2.1rem" }} />
        Gestionar Productos
      </h3>
      <div className="stats-cards">
        <div className="stat-card">
          <h3>Total Productos</h3>
          <p>{total}</p>
        </div>
        <div className="stat-card">
          <h3>En Stock</h3>
          <p>{enStock}</p>
        </div>
        <div className="stat-card">
          <h3>Sin Stock</h3>
          <p>{sinStock}</p>
        </div>
      </div>
      <div className="table-header" style={{ marginBottom: 20, display: "flex", justifyContent: "flex-end" }}>
        <div className="search-bar" style={{ width: "100%", maxWidth: 350, position: "relative" }}>
          <FaSearch className="search-icon" style={{ left: 10, top: 13, position: "absolute" }} />
          <input
            type="text"
            placeholder="Buscar producto o marca..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            style={{ paddingLeft: 35, width: "100%" }}
          />
        </div>
      </div>
      <div className="table-container" style={{ overflowX: "auto", width: "100%" }}>
        <table className="data-table" style={{ minWidth: 600 }}>

          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Marca</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map(producto => (
              <tr key={producto.id_producto}>
                <td>#{producto.id_producto}</td>
                <td>{producto.nombre_producto}</td>
                <td>{producto.marca_producto}</td>
                <td>${producto.precio_producto}</td>
                <td>{producto.stock_producto}</td>
                <td>
                  <span className={`status-badge ${producto.estado === 'activo' ? 'active' : 'inactive'}`}>
                    {producto.estado === 'activo' ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="actions-cell">
                  <button className="action-button edit" onClick={() => handleEditar(producto)}>
                    <FaEdit style={{ marginRight: 4 }} /> Editar
                  </button>
                  <button className="action-button delete" onClick={() => handleEliminar(producto.id_producto)}>
                    <FaTrash style={{ marginRight: 4 }} /> Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {productosFiltrados.length === 0 && (
              <tr>
                <td colSpan="7" className="empty-data">No hay productos registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {productoEditando && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Editar Producto</h3>
            <form>
              <label>Nombre:</label>
              <input
                type="text"
                value={productoEditando.nombre_producto}
                onChange={(e) =>
                  setProductoEditando((prev) => ({ ...prev, nombre_producto: e.target.value }))
                }
              />
              <label>Marca:</label>
              <input
                type="text"
                value={productoEditando.marca_producto}
                onChange={(e) =>
                  setProductoEditando((prev) => ({ ...prev, marca_producto: e.target.value }))
                }
              />
              <label>Precio:</label>
              <input
                type="number"
                value={productoEditando.precio_producto}
                onChange={(e) =>
                  setProductoEditando((prev) => ({ ...prev, precio_producto: e.target.value }))
                }
              />
              <label>Stock:</label>
              <input
                type="number"
                value={productoEditando.stock_producto}
                onChange={(e) =>
                  setProductoEditando((prev) => ({ ...prev, stock_producto: e.target.value }))
                }
              />
<<<<<<< HEAD
              <label>Estado:</label>
              <select
                value={productoEditando.estado}
                onChange={(e) =>
                  setProductoEditando((prev) => ({ ...prev, estado: e.target.value }))
                }
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
=======
>>>>>>> cdbfa28 (funcionar boton eliminar y editar)
              <div className="form-actions">
                <button type="button" onClick={() => setProductoEditando(null)}>
                  Cancelar
                </button>
                <button type="button" onClick={handleGuardarEdicion}>
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Dashboard de Categorías
function DashboardCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [productosBajoStock, setProductosBajoStock] = useState([]);
  const [categoriasMasVendidas, setCategoriasMasVendidas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = React.useRef(null);

  // Mapeo de iconos por categoría
  const iconMap = {
    'Aire acondicionado': <FaSnowflake />,
    'Nevera': <FaTemperatureHigh />,
    'Estufas': <FaFire />,
    'Estractores de grasa': <FaWind />
  };

  // Mapeo de colores por categoría
  const colorMap = {
    'Aire acondicionado': '#3B82F6', // Azul
    'Nevera': '#2ecc71', // Verde
    'Estufas': '#EF4444', // Rojo
    'Estractores de grasa': '#f39c12' // Amarillo
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener datos de categorías
        const categoriasResponse = await fetch('http://localhost:3000/dashboard/categorias');
        if (!categoriasResponse.ok) throw new Error('Error al cargar las categorías');
        const categoriasData = await categoriasResponse.json();
        setCategorias(categoriasData);

        // Obtener productos con bajo stock
        const stockResponse = await fetch('http://localhost:3000/dashboard/productos-bajo-stock');
        if (!stockResponse.ok) throw new Error('Error al cargar productos con bajo stock');
        const stockData = await stockResponse.json();
        setProductosBajoStock(stockData);

        // Obtener categorías más vendidas
        const vendidasResponse = await fetch('http://localhost:3000/dashboard/categorias-mas-vendidas');
        if (!vendidasResponse.ok) throw new Error('Error al cargar categorías más vendidas');
        const vendidasData = await vendidasResponse.json();
        setCategoriasMasVendidas(vendidasData);

        setLoading(false);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      if (chartRef.current && chartRef.current.chartInstance) {
        chartRef.current.chartInstance.destroy();
      }
    };
  }, []);

  const opcionesGrafica = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            size: 12
          }
        }
      }
    }
  };

  const datosGrafica = {
    labels: categoriasMasVendidas.map(cat => cat.categoria),
    datasets: [
      {
        data: categoriasMasVendidas.map(cat => cat.total_unidades_vendidas),
        backgroundColor: [
          '#3B82F6', // Azul
          '#2ecc71', // Verde
          '#EF4444', // Rojo
          '#f39c12', // Amarillo
          '#9333ea', // Púrpura
          '#06b6d4'  // Cyan
        ],
        borderWidth: 1
      }
    ]
  };

  if (loading) {
    return <div>Cargando categorías...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const totalProductos = categorias.reduce((total, cat) => total + cat.cantidad_productos, 0);

  return (
    <div className="dashboard-grid">
      <div className="content-card categorias-section">
        <h3 style={{ color: '#000000' }}>Dashboard de Categorías</h3>

        <div className="horizontal-products-container">
          {categorias.map(categoria => (
            <div 
              key={categoria.id_categoria_producto} 
              className="horizontal-product-card" 
              style={{ 
                borderLeft: `4px solid ${colorMap[categoria.categoria] || '#3B82F6'}`,
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}
            >
              <div 
                className="horizontal-product-icon" 
                style={{ 
                  backgroundColor: colorMap[categoria.categoria] || '#3B82F6',
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.2rem'
                }}
              >
                {iconMap[categoria.categoria] || <FaBoxOpen />}
              </div>
              <div className="horizontal-product-info">
                <h4 style={{ margin: '0 0 5px 0', fontSize: '1rem', color: '#1F2937' }}>
                  {categoria.categoria}
                </h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#6B7280' }}>
                  <strong>{categoria.cantidad_productos}</strong> productos
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-stats-container">
        <div className="content-card productos-bajo-stock">
          <h3><FiAlertCircle style={{ color: '#ef4444' }} /> Productos en Bajo Stock</h3>
          <div className="productos-bajo-stock-list">
            {productosBajoStock.length > 0 ? (
              productosBajoStock.map(producto => (
                <div 
                  key={producto.id_producto} 
                  className="producto-bajo-stock-card"
                  style={{
                    backgroundColor: producto.stock_producto <= 2 ? '#fee2e2' : '#fff',
                    borderLeft: `4px solid ${producto.stock_producto <= 2 ? '#ef4444' : '#f97316'}`,
                  }}
                >
                  <div className="producto-bajo-stock-info">
                    <h3>{producto.nombre_producto}</h3>
                    <p className="marca">{producto.marca_producto}</p>
                    <p className="stock" style={{ color: producto.stock_producto <= 2 ? '#dc2626' : '#f97316' }}>
                      <strong>Stock actual: {producto.stock_producto}</strong>
                    </p>
                    <p className="precio">Precio: ${producto.precio_producto}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-productos">No hay productos con bajo stock</p>
            )}
          </div>
        </div>

        <div className="content-card categorias-vendidas">
          <h3>Categorías Más Vendidas</h3>
          <div className="grafica-pie-container">
            <Pie ref={chartRef} data={datosGrafica} options={opcionesGrafica} />
          </div>
        </div>
      </div>

      <div className="stats-container">
        <div className="stats-card">
          <h4>Total de Productos</h4>
          <p className="stats-number">{totalProductos}</p>
        </div>

        <div className="stats-card">
          <h4>Categorías Activas</h4>
          <p className="stats-number">{categorias.length}</p>
        </div>
      </div>
    </div>
  );
}

export default function ProductAdmin() {
  const [view, setView] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();


  // const handleExit = () => {
  //   navigate("/AdminDashboard");
  // };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderView = () => {
    switch (view) {
      case 'add':
        return <AgregarProductoForm onCancel={() => setView(null)} />;
      case 'modify':
        return <ModificarProductoList />;
      case 'view':
        return <ProductosDisponiblesList />;
      default:
        return <DashboardCategorias />;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Botón para móvil */}
      <button
        className="mobile-toggle"
        onClick={toggleSidebar}
        style={{
          display: 'none',
          position: 'fixed',
          top: '10px',
          left: '10px',
          zIndex: 1001,
          background: '#2c3e50',
          color: 'white',
          border: 'none',
          padding: '10px',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        <FaBars />
      </button>

      {/* Panel lateral */}
      <div className={`admin-sidebar ${!isSidebarOpen ? 'closed' : ''}`}>
        <div className="sidebar-header">
          <h2>Panel de Productos</h2>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`nav-btn ${view === null ? 'active' : ''}`}
            onClick={() => {
              setView(null);
              if (window.innerWidth <= 768) setIsSidebarOpen(false);
            }}
          >
            <FaHome className="nav-icon" /> <span>Inicio</span>
          </button>
          <button
            className={`nav-btn ${view === 'add' ? 'active' : ''}`}
            onClick={() => {
              setView('add');
              if (window.innerWidth <= 768) setIsSidebarOpen(false);
            }}
          >
            <FaPlusCircle className="nav-icon" /> <span>Agregar Producto</span>
          </button>
          <button
            className={`nav-btn ${view === 'modify' ? 'active' : ''}`}
            onClick={() => {
              setView('modify');
              if (window.innerWidth <= 768) setIsSidebarOpen(false);
            }}
          >
            <FaEdit className="nav-icon" /> <span>Gestionar Productos</span>
          </button>
          {/* <button
            className={`nav-btn ${view === 'view' ? 'active' : ''}`}
            onClick={() => {
              setView('view');
              if (window.innerWidth <= 768) setIsSidebarOpen(false);
            }}
          >
            <FaEye className="nav-icon" /> <span>Ver Productos</span>
          </button> */}
        </nav>

        <div className="sidebar-footer">
          <button onClick={() => navigate('/Inicio')} className="exit-btn">
            <FaSignOutAlt className="exit-icon" />
            <span>Salir del Panel</span>
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className={`admin-main ${!isSidebarOpen ? 'expanded' : ''}`}>
        <div className="content-wrapper">
          {renderView()}
        </div>
      </div>

    </div>
  );
}