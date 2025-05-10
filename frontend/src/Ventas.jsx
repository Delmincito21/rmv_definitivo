import React, { useState } from 'react';
import './Ventas.css';
import { useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaShoppingCart,
  FaPlus,
  FaMinus,
  FaArrowLeft,
  FaCalendarAlt,
  FaSignOutAlt
} from "react-icons/fa";

const Venta = () => {
  const [activePage, setActivePage] = useState('ventas');
  const [showNewSaleForm, setShowNewSaleForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showShippingForm, setShowShippingForm] = useState(false);
  const navigate = useNavigate();

  // Estado para el formulario de nueva venta
  const [nuevaVenta, setNuevaVenta] = useState({
    id_usuario: '',
    fecha_venta: new Date().toISOString().slice(0, 16),
    estado_venta: 'pendiente',
    detalles: [
      {
        id_producto: '',
        cantidad_detalle_venta: 1,
        precio_unitario_detalle_venta: 0,
        subtotal_detalle_venta: 0
      }
    ]
  });

  // Estado para el formulario de pago
  const [pago, setPago] = useState({
    monto_pagado: 0,
    fecha_pago: new Date().toISOString().slice(0, 16),
    metodo_pago: 'transferencia',
    referencia: '',
    banco_emisor: '',
    estado: 'pendiente'
  });

  // Estado para el formulario de envío
  const [envio, setEnvio] = useState({
    fecha_recepcion: new Date().toISOString().slice(0, 16),
    direccion: ''
  });

  // Función para cambiar entre páginas
  const navigateTo = (page) => {
    setActivePage(page);
  };

  // Abrir formulario de nueva venta
  const handleNuevaVenta = () => {
    setShowNewSaleForm(true);
    setShowPaymentForm(false);
    setShowShippingForm(false);
  };

  // Cerrar formulario de nueva venta
  const handleCancelVenta = () => {
    setShowNewSaleForm(false);
    setShowPaymentForm(false);
    setShowShippingForm(false);
  };

  // Manejar cambios en el formulario principal
  const handleVentaChange = (e) => {
    const { name, value } = e.target;
    setNuevaVenta({
      ...nuevaVenta,
      [name]: value
    });
  };

  // Manejar cambios en los detalles de venta (CORRECCIÓN APLICADA AQUÍ)
  const handleDetalleChange = (index, e) => {
    const { name, value } = e.target;

    setNuevaVenta(prevState => {
      const newDetalles = [...prevState.detalles];

      // Actualizar el campo específico
      newDetalles[index] = {
        ...newDetalles[index],
        [name]: value
      };

      // Si es precio o cantidad, recalcular el subtotal
      if (name === 'precio_unitario_detalle_venta' || name === 'cantidad_detalle_venta') {
        const precio = name === 'precio_unitario_detalle_venta'
          ? parseFloat(value) || 0
          : parseFloat(newDetalles[index].precio_unitario_detalle_venta) || 0;

        const cantidad = name === 'cantidad_detalle_venta'
          ? parseInt(value) || 0
          : parseInt(newDetalles[index].cantidad_detalle_venta) || 0;

        newDetalles[index].subtotal_detalle_venta = (precio * cantidad).toFixed(2);
      }

      return {
        ...prevState,
        detalles: newDetalles
      };
    });
  };

  // Agregar un nuevo detalle de venta
  const agregarDetalle = () => {
    setNuevaVenta({
      ...nuevaVenta,
      detalles: [
        ...nuevaVenta.detalles,
        {
          id_producto: '',
          cantidad_detalle_venta: 1,
          precio_unitario_detalle_venta: 0,
          subtotal_detalle_venta: 0
        }
      ]
    });
  };

  // Eliminar un detalle de venta
  const eliminarDetalle = (index) => {
    if (nuevaVenta.detalles.length > 1) {
      const newDetalles = nuevaVenta.detalles.filter((_, i) => i !== index);
      setNuevaVenta({
        ...nuevaVenta,
        detalles: newDetalles
      });
    }
  };

  // Calcular el total de la venta
  const calcularTotal = () => {
    return nuevaVenta.detalles.reduce((total, detalle) => {
      return total + parseFloat(detalle.subtotal_detalle_venta || 0);
    }, 0).toFixed(2);
  };

  // Ir al formulario de pago
  const handleProcederPago = () => {
    // Actualizar el monto pagado con el total de la venta
    setPago({
      ...pago,
      monto_pagado: calcularTotal(),
      fecha_pago: nuevaVenta.fecha_venta
    });
    setShowPaymentForm(true);
    setShowShippingForm(false);
  };

  // Volver al formulario de venta desde pago
  const handleVolverVenta = () => {
    setShowPaymentForm(false);
    setShowShippingForm(false);
  };

  // Ir al formulario de envío
  const handleProcederEnvio = () => {
    setShowShippingForm(true);
    setShowPaymentForm(false);
  };

  // Volver al formulario de pago desde envío
  const handleVolverPago = () => {
    setShowPaymentForm(true);
    setShowShippingForm(false);
  };

  // Manejar cambios en el formulario de pago
  const handlePagoChange = (e) => {
    const { name, value } = e.target;
    setPago({
      ...pago,
      [name]: value
    });
  };

  // Manejar cambios en el formulario de envío
  const handleEnvioChange = (e) => {
    const { name, value } = e.target;
    setEnvio({
      ...envio,
      [name]: value
    });
  };

  const handleExit = () => {
    navigate('/Inicio');
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

  // Componente del formulario de nueva venta
  const NuevaVentaForm = () => (
    <div className="form-container">
      <form className="horizontal-product-form">
        <h2 className="form-title">REGISTRAR NUEVA VENTA</h2>

        {/* Primera fila del formulario */}
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="id_usuario">ID Usuario</label>
            <input
              type="text"
              id="id_usuario"
              name="id_usuario"
              value={nuevaVenta.id_usuario}
              onChange={handleVentaChange}
              required
              className="input-no-arrows"
            />
          </div>

          <div className="form-field">
            <label htmlFor="fecha_venta">Fecha de Venta</label>
            <div className="date-input-container">
              <input
                type="datetime-local"
                id="fecha_venta"
                name="fecha_venta"
                value={nuevaVenta.fecha_venta}
                onChange={handleVentaChange}
                required
              />
              <FaCalendarAlt className="calendar-icon" />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="estado_venta">Estado de Venta</label>
            <select
              id="estado_venta"
              name="estado_venta"
              value={nuevaVenta.estado_venta}
              onChange={handleVentaChange}
              required
            >
              <option value="pendiente">Pendiente</option>
              <option value="completa">Completa</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
        </div>

        {/* Detalles de venta */}
        {nuevaVenta.detalles.map((detalle, index) => (
          <div key={index} className="detalle-venta-container">
            <div className="form-row">
              <div className="form-field">
                <label htmlFor={`id_producto_${index}`}>ID Producto</label>
                <input
                  type="text"
                  id={`id_producto_${index}`}
                  name="id_producto"
                  value={detalle.id_producto}
                  onChange={(e) => handleDetalleChange(index, e)}
                  required
                  className="input-no-arrows"
                />
              </div>

              <div className="form-field">
                <label htmlFor={`cantidad_${index}`}>Cantidad</label>
                <input
                  type="text"
                  id={`cantidad_${index}`}
                  name="cantidad_detalle_venta"
                  value={detalle.cantidad_detalle_venta}
                  onChange={(e) => handleDetalleChange(index, e)}
                  required
                  className="input-no-arrows"
                />
              </div>

              <div className="form-field">
                <label htmlFor={`precio_${index}`}>Precio Unitario</label>
                <input
                  type="text"
                  id={`precio_${index}`}
                  name="precio_unitario_detalle_venta"
                  value={detalle.precio_unitario_detalle_venta}
                  onChange={(e) => handleDetalleChange(index, e)}
                  required
                  className="input-no-arrows"
                />
              </div>

              <div className="form-field">
                <label htmlFor={`subtotal_${index}`}>Subtotal</label>
                <input
                  type="text"
                  id={`subtotal_${index}`}
                  name="subtotal_detalle_venta"
                  value={detalle.subtotal_detalle_venta}
                  readOnly
                  className="input-no-arrows"
                />
              </div>

              <div className="form-action-buttons">
                {nuevaVenta.detalles.length > 1 && (
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => eliminarDetalle(index)}
                  >
                    <FaMinus />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        <div className="add-item-container">
          <button
            type="button"
            className="btn-add-item"
            onClick={agregarDetalle}
          >
            <FaPlus /> Agregar Producto
          </button>
        </div>

        <div className="total-container">
          <span className="total-label">Total:</span>
          <span className="total-amount">${calcularTotal()}</span>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={handleCancelVenta}>
            Cancelar
          </button>
          <button type="button" className="submit-btn" onClick={() => console.log("Guardar venta")}>
            Guardar Venta
          </button>
          <button type="button" className="payment-btn" onClick={handleProcederPago}>
            Proceder a Pagar
          </button>
        </div>
      </form>
    </div>
  );

  // Componente del formulario de pago
  const PagoForm = () => (
    <div className="form-container">
      <form className="horizontal-product-form">
        <div className="form-header">
          <button type="button" className="back-btn" onClick={handleVolverVenta}>
            <FaArrowLeft /> Volver a Venta
          </button>
          <h2 className="form-title">DATOS DE PAGO</h2>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="monto_pagado">Monto Pagado</label>
            <input
              type="text"
              id="monto_pagado"
              name="monto_pagado"
              value={pago.monto_pagado}
              onChange={handlePagoChange}
              required
              className="input-no-arrows"
            />
          </div>

          <div className="form-field">
            <label htmlFor="fecha_pago">Fecha de Pago</label>
            <div className="date-input-container">
              <input
                type="datetime-local"
                id="fecha_pago"
                name="fecha_pago"
                value={pago.fecha_pago}
                onChange={handlePagoChange}
                required
              />
              <FaCalendarAlt className="calendar-icon" />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="metodo_pago">Método de Pago</label>
            <select
              id="metodo_pago"
              name="metodo_pago"
              value={pago.metodo_pago}
              onChange={handlePagoChange}
              required
            >
              <option value="transferencia">Transferencia</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="referencia">Número de Referencia</label>
            <input
              type="text"
              id="referencia"
              name="referencia"
              value={pago.referencia}
              onChange={handlePagoChange}
              required
              placeholder="Ej: 12345678"
            />
          </div>

          <div className="form-field">
            <label htmlFor="banco_emisor">Banco Emisor</label>
            <input
              type="text"
              id="banco_emisor"
              name="banco_emisor"
              value={pago.banco_emisor}
              onChange={handlePagoChange}
              required
              placeholder="Ej: Banco Nacional"
            />
          </div>

          <div className="form-field">
            <label htmlFor="estado">Estado</label>
            <select
              id="estado"
              name="estado"
              value={pago.estado}
              onChange={handlePagoChange}
              required
            >
              <option value="pendiente">Pendiente</option>
              <option value="confirmado">Confirmado</option>
              <option value="anulado">Anulado</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={handleCancelVenta}>
            Cancelar
          </button>
          <button type="button" className="submit-btn" onClick={() => console.log("Guardar pago")}>
            Guardar Pago
          </button>
          <button type="button" className="payment-btn" onClick={handleProcederEnvio}>
            Proceder a Envío
          </button>
        </div>
      </form>
    </div>
  );

  // Componente del formulario de envío
  const EnvioForm = () => (
    <div className="form-container">
      <form className="horizontal-product-form">
        <div className="form-header">
          <button type="button" className="back-btn" onClick={handleVolverPago}>
            <FaArrowLeft /> Volver a Pago
          </button>
          <h2 className="form-title">DATOS DE ENVÍO</h2>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="fecha_recepcion">Fecha de Recepción</label>
            <div className="date-input-container">
              <input
                type="datetime-local"
                id="fecha_recepcion"
                name="fecha_recepcion"
                value={envio.fecha_recepcion}
                onChange={handleEnvioChange}
                required
              />
              <FaCalendarAlt className="calendar-icon" />
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-field wide">
            <label htmlFor="direccion">Dirección de Envío</label>
            <textarea
              id="direccion"
              name="direccion"
              value={envio.direccion}
              onChange={handleEnvioChange}
              required
              placeholder="Ingrese la dirección completa de envío"
            ></textarea>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={handleCancelVenta}>
            Cancelar
          </button>
          <button type="button" className="submit-btn" onClick={() => console.log("Guardar envío")}>
            Completar Pedido
          </button>
        </div>
      </form>
    </div>
  );

  // Componente de ventas simplificado sin tablas
  const VentasContent = () => (
    <div className="content-container">
      <h1 className="page-title">Gestión de Ventas</h1>

      <div className="action-bar">
        <button className="btn-nueva-venta" onClick={handleNuevaVenta}>Nueva Venta</button>
      </div>

      {showNewSaleForm && !showPaymentForm && !showShippingForm && <NuevaVentaForm />}
      {showPaymentForm && !showShippingForm && <PagoForm />}
      {showShippingForm && <EnvioForm />}
    </div>
  );

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Panel de Administración</h2>
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

        <div className="sidebar-footer">
          <button onClick={handleExit} className="exit-btn">
            <FaSignOutAlt className="exit-icon" />
            <span>Salir del Panel</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {activePage === 'inicio' ? <InicioContent /> : <VentasContent />}
      </div>
    </div>
  );
};

export default Venta;