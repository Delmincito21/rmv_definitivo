import React from 'react';
import './Dashboard.css';
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaPlusCircle, FaEdit, FaEye, FaHome, FaSnowflake, FaFire, FaTemperatureHigh, FaWind, FaBars } from "react-icons/fa";
import { useState } from 'react';

function AgregarProductoForm({ onCancel }) {
  return (
    <div className="form-container">
      <form className="horizontal-product-form">
        <h2 className="form-title">Agregar Producto</h2>

        {/* Primera fila horizontal */}
        <div className="form-row">
          <div className="form-field">
            <label>Nombre del Producto</label>
            <input type="text" placeholder="Ej: Aire Inverter" />
          </div>

          <div className="form-field">
            <label>Marca</label>
            <input type="text" placeholder="Ej: Samsung" />
          </div>

          <div className="form-field">
            <label>Modelo</label>
            <input type="text" placeholder="Ej: AR12TXCAAWK" />
          </div>
        </div>

        {/* Segunda fila horizontal */}
        <div className="form-row">
          <div className="form-field">
            <label>Precio ($DOP)</label>
            <input type="number" step="0.01" placeholder="0.00" />
          </div>

          <div className="form-field">
            <label>Precio Compra ($DOP)</label>
            <input type="number" step="0.01" placeholder="0.00" />
          </div>

          <div className="form-field">
            <label>Tipo de Garantía </label>
            <input type="text" />
          </div>
        </div>

        {/* Tercera fila horizontal */}
        <div className="form-row">
          <div className="form-field">
            <label>Categoría</label>
            <select>
              <option value="" style={{ color: '#000000' }}>Seleccionar categoría</option>
              <option value="Aire Acondicionado">Aire Acondicionado</option>
              <option value="Refrigerador">Refrigerador</option>
              <option value="Estufa">Estufa</option>
            </select>
          </div>

          <div className="form-field">
            <label>Stock</label>
            <input type="number" placeholder="0" />
          </div>

          <div className="form-field">
            <label>Colores</label>
            <input type="text" placeholder="Ej: Blanco, Negro" />
          </div>
        </div>

        {/* Cuarta fila horizontal */}
        <div className="form-row">
          <div className="form-field wide">
            <label>Descripción</label>
            <textarea placeholder="Descripción detallada..." rows="2"></textarea>
          </div>

          <div className="form-field">
            <label>Suplidor (opcional)</label>
            <input type="text" placeholder="Nombre del suplidor" />
          </div>
        </div>

        {/* Quinta fila horizontal */}
        <div className="form-row">
          <div className="form-field wide">
            <label>Imagen (URL)</label>
            <input type="url" placeholder="https://ejemplo.com/imagen.jpg" />
          </div>
        </div>

        {/* Botones de acción */}
        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className="submit-btn">
            Guardar Producto
          </button>
        </div>
      </form>
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
const ModificarProductoList = () => {
  const [productos] = useState([
    { id: 1, nombre: 'Aire inverter', precio: 29.99, stock: 15, imagen: 'https://via.placeholder.com/150' },
    { id: 2, nombre: 'Aire industrial', precio: 89.50, stock: 8, imagen: 'https://via.placeholder.com/150' },
    { id: 3, nombre: 'Nevera Samsung', precio: 599.99, stock: 22, imagen: 'https://via.placeholder.com/150' },
    { id: 4, nombre: 'Aire TGM', precio: 15.00, stock: 0, imagen: 'https://via.placeholder.com/150' },
  ]);

  return (
    <div className="content-card">
      <h3 style={{ color: '#000000' }}>Gestionar Productos</h3>
      <div className="horizontal-products-container">
        {productos.map(producto => (
          <div key={producto.id} className="horizontal-product-card">
            <div className="horizontal-product-content">
              <h4>{producto.nombre}</h4>
              <p className="horizontal-product-price">${producto.precio.toFixed(2)}</p>
              <div className="horizontal-product-stock">
                <span className={`stock-indicator ${producto.stock > 0 ? 'in-stock' : 'out-of-stock'}`}></span>
                {producto.stock > 0 ? `${producto.stock} disponibles` : 'Sin stock'}
              </div>
              <button className="edit-btn">
                <FaEdit /> Editar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Dashboard de Categorías (sin cambios)
function DashboardCategorias() {
  const [categorias] = useState([
    { id: 1, nombre: 'Aires Acondicionados', icon: <FaSnowflake />, color: '#3498db', cantidad: 8 },
    { id: 2, nombre: 'Estufas', icon: <FaFire />, color: '#e74c3c', cantidad: 6 },
    { id: 3, nombre: 'Refrigeradores', icon: <FaTemperatureHigh />, color: '#2ecc71', cantidad: 5 },
    { id: 4, nombre: 'Extractores de Grasa', icon: <FaWind />, color: '#f39c12', cantidad: 3 }
  ]);

  return (
    <div className="content-card">
      <h3 style={{ color: '#000000' }}>Dashboard de Categorías</h3>

      <div className="horizontal-products-container">
        {categorias.map(categoria => (
          <div key={categoria.id} className="horizontal-product-card" style={{ borderLeft: `4px solid ${categoria.color}` }}>
            <div className="horizontal-product-icon" style={{ backgroundColor: categoria.color }}>
              {categoria.icon}
            </div>
            <div className="horizontal-product-info">
              <h4>{categoria.nombre}</h4>
              <p><strong>{categoria.cantidad}</strong> productos</p>
            </div>
          </div>
        ))}
      </div>

      <div className="stats-container">
        <div className="stats-card">
          <h4>Total de Productos</h4>
          <p className="stats-number">{categorias.reduce((total, cat) => total + cat.cantidad, 0)}</p>
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
          <button
            className={`nav-btn ${view === 'view' ? 'active' : ''}`}
            onClick={() => {
              setView('view');
              if (window.innerWidth <= 768) setIsSidebarOpen(false);
            }}
          >
            <FaEye className="nav-icon" /> <span>Ver Productos</span>
          </button>
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