import React, { useState } from 'react';
 //import { handleExit } from './Ventas';
import './Dashboard.css';
import {
    FaHome,
    FaShoppingCart,
    FaSignOutAlt
} from "react-icons/fa";

const Venta = () => {
  const [activePage, setActivePage] = useState('ventas');
  
  // Función para cambiar entre páginas
  const navigateTo = (page) => {
    setActivePage(page);
  };

  // Componente de inicio con cards (vacío por ahora)
  const InicioContent = () => (
    <div className="content-container">
      <h1 className="page-title">Dashboard</h1>
      <div className="cards-container">
        {/* Aquí irán los cards del dashboard */}
        <div className="empty-message">
          El contenido de los cards del dashboard se añadirá más adelante
        </div>
      </div>
    </div>
  );

  // Componente de ventas con tabla
  const VentasContent = () => (
    <div className="content-container">
      <h1 className="page-title">Gestión de Ventas</h1>
      
      <div className="action-bar">
        <button className="btn-nueva-venta">Nueva Venta</button>
      </div>
      
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID Venta</th>
              <th>ID Usuario</th>
              <th>Total Venta</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="6" className="empty-data">No hay ventas registradas</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="detail-section">
        <h2 className="section-title">Detalles de Venta</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID Detalle</th>
              <th>ID Venta</th>
              <th>ID Producto</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Subtotal</th>
              <th>Fecha Creación</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="7" className="empty-data">Seleccione una venta para ver sus detalles</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Panel de Administración</h2>
          <button className="sidebar-toggle">◀</button>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            <li>
              <button 
                className={`nav-item ${activePage === 'inicio' ? 'active' : ''}`} 
                onClick={() => navigateTo('inicio')}
              >
             <FaHome className="nav-icon" />
                Inicio
              </button>
            </li>
            <li>
              <button 
                className={`nav-item ${activePage === 'ventas' ? 'active' : ''}`} 
                onClick={() => navigateTo('ventas')}
              >
                 <FaShoppingCart className="nav-icon" />

                Ventas
              </button>
            </li>
          </ul>

        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {activePage === 'inicio' ? <InicioContent /> : <VentasContent />}
      </div>
    </div>
  );
};

export default Venta;