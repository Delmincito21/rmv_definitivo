import React, { useState } from 'react';
import './Dashboard.css';
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaPlusCircle, FaEdit, FaEye, FaHome, FaSnowflake, FaFan, FaThermometerHalf } from "react-icons/fa";

// Componente para agregar producto
function AgregarProductoForm({ onCancel }) {
  return (
    <div className="content-card">
      <h3 style={{ color: '#000000' }}>Agregar Nuevo Producto</h3>
      <form className="horizontal-product-form">
        <div className="form-row">
          <div className="form-group compact">
            <label>Nombre del Producto</label>
            <input type="text" placeholder="Ej: Aire Inverter" required />
          </div>

          <div className="form-group compact">
            <label>Descripción</label>
            <textarea placeholder="Descripción detallada..." required></textarea>
          </div>
        </div>

        <div className="form-row triple">
          <div className="form-group compact">
            <label>Precio ($)</label>
            <input type="number" step="0.01" placeholder="0.00" required />
          </div>

          <div className="form-group compact">
            <label>Stock</label>
            <input type="number" placeholder="0" required />
          </div>

          <div className="form-group compact">
            <label>Imagen (URL)</label>
            <input type="url" placeholder="https://ejemplo.com/imagen.jpg" />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">
            Guardar Producto
          </button>
        </div>
      </form>
    </div>
  );
}

// Componente para modificar productos
function ModificarProductoList() {
  const [productos] = useState([
    { id: 1, nombre: 'Aire acondicionado Inverter', precio: 29.99, stock: 15, categoria: 'Electrodomestico' },
    { id: 2, nombre: 'Aire acondiciondo Industrial', precio: 89.50, stock: 8, categoria: 'Electrodomestico' },
    { id: 3, nombre: 'Aire acondicionado TGM', precio: 599.99, stock: 22, categoria: 'Electrodomestico' },
  ]);

  return (
    <div className="content-card">
      <div className="table-header">
        <h3 style={{ color: '#000000' }}>Lista de Productos</h3>
        <input type="text" placeholder="Buscar productos..." className="search-input" />
      </div>
      <div className="table-responsive">
        <table className="product-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(producto => (
              <tr key={producto.id}>
                <td>{producto.id}</td>
                <td>{producto.nombre}</td>
                <td>{producto.categoria}</td>
                <td>${producto.precio.toFixed(2)}</td>
                <td>
                  <span className={`stock-badge ${producto.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                    {producto.stock}
                  </span>
                </td>
                <td>
                  <button className="action-btn edit">
                    <i className="fas fa-edit"></i> Editar
                  </button>
                  <button className="action-btn delete">
                    <i className="fas fa-trash"></i> Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Componente para ver productos disponibles
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

export default function ProductAdmin() {
  const [view, setView] = useState(null);
  const navigate = useNavigate();

  const handleExit = () => {
    navigate("/AdminDashboard"); // Redirige a la página de inicio
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
        return <div className="content-card"></div>; // VACÍO
    }
  };

  return (
    <div className="product-admin-container">
      {/* Panel lateral fijo */}
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Panel de Productos</h2>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`nav-btn ${view === null ? 'active' : ''}`}
            onClick={() => setView(null)}
          >
            <FaHome className="nav-icon" /> Inicio
          </button>
          <button
            className={`nav-btn ${view === 'add' ? 'active' : ''}`}
            onClick={() => setView('add')}
          >
            <FaPlusCircle className="nav-icon" /> Agregar Producto
          </button>
          <button
            className={`nav-btn ${view === 'modify' ? 'active' : ''}`}
            onClick={() => setView('modify')}
          >
            <FaEdit className="nav-icon" /> Gestionar Productos
          </button>
          <button
            className={`nav-btn ${view === 'view' ? 'active' : ''}`}
            onClick={() => setView('view')}
          >
            <FaEye className="nav-icon" /> Ver Productos
          </button>
        </nav>

        {/* Botón Salir en el sidebar */}
        <div className="sidebar-footer">
          <button onClick={handleExit} className="exit-btn">
            <FaSignOutAlt className="exit-icon" />
            Salir del Panel
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="admin-main">
        {renderView()}
      </div>
    </div>
  );
}
