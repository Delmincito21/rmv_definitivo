import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { FaShoppingCart, FaHome, FaSignOutAlt, FaShoppingBag, FaCreditCard, FaArrowLeft } from 'react-icons/fa';
import { FaShop } from 'react-icons/fa6';
import { useCart } from '../context/CartContext';
import Swal from 'sweetalert2';
import './Carrito.css';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

// Componente ModalPago
const ModalPago = ({ isOpen, onClose, total, onSubmit }) => {
  const [datosPago, setDatosPago] = useState({
    monto_pago: total || 0,
    fecha_pago: new Date().toISOString().slice(0, 19).replace('T', ' '),
    metodo_pago: 'TRANSFERENCIA',
    referencia: '',
    banco_emisor: '',
    estado_pago: 'PENDIENTE',
    estado: 'activo'
  });

  const [errores, setErrores] = useState({});

  const validarPago = () => {
    const nuevosErrores = {};
    if (datosPago.metodo_pago === 'TRANSFERENCIA') {
      if (!datosPago.referencia.trim()) {
        nuevosErrores.referencia = 'La referencia es requerida';
      }
      if (!datosPago.banco_emisor.trim()) {
        nuevosErrores.banco_emisor = 'El banco emisor es requerido';
      }
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validarPago()) {
      onSubmit(datosPago);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-pago">
        <div className="modal-header">
          <h2>Información de Pago</h2>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="pago-form">
          <div className="form-row">
            <div className="form-field">
              <label>Monto</label>
              <input
                type="number"
                value={datosPago.monto_pago}
                readOnly
                className="readonly-input"
              />
            </div>
            <div className="form-field">
              <label>Fecha de Pago</label>
              <input
                type="datetime-local"
                value={datosPago.fecha_pago}
                readOnly
                className="readonly-input"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label>Método de Pago</label>
              <select
                value={datosPago.metodo_pago}
                onChange={e => setDatosPago({ ...datosPago, metodo_pago: e.target.value })}
              >
                <option value="TRANSFERENCIA">Transferencia</option>
                <option value="PAYPAL">PayPal</option>
              </select>
            </div>
            {datosPago.metodo_pago === 'TRANSFERENCIA' && (
              <div className={`form-field ${errores.referencia ? 'error' : ''}`}>
                <label>Número de Referencia</label>
                <input
                  type="text"
                  value={datosPago.referencia}
                  onChange={(e) => setDatosPago({ ...datosPago, referencia: e.target.value })}
                  placeholder="Número de referencia"
                />
                {errores.referencia && <div className="error-message">{errores.referencia}</div>}
              </div>
            )}
          </div>
          <div className="form-row">
            {datosPago.metodo_pago === 'TRANSFERENCIA' && (
              <div className={`form-field ${errores.banco_emisor ? 'error' : ''}`}>
                <label>Banco Emisor</label>
                <input
                  type="text"
                  value={datosPago.banco_emisor}
                  onChange={(e) => setDatosPago({ ...datosPago, banco_emisor: e.target.value })}
                  placeholder="Nombre del banco"
                />
                {errores.banco_emisor && <div className="error-message">{errores.banco_emisor}</div>}
              </div>
            )}
            <div className="form-field">
              <label>Estado del Pago</label>
              <select
                value={datosPago.estado_pago}
                onChange={(e) => setDatosPago({ ...datosPago, estado_pago: e.target.value })}
              >
                <option value="PENDIENTE">Pendiente</option>
                <option value="COMPLETADO">Completado</option>
                <option value="FALLIDO">Fallido</option>
                <option value="REEMBOLSADO">Reembolsado</option>
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancelar
            </button>
            {datosPago.metodo_pago === 'TRANSFERENCIA' && (
              <button type="submit" className="submit-btn">
                <FaCreditCard /> Confirmar Pago
              </button>
            )}
          </div>
        </form>
        {datosPago.metodo_pago === 'PAYPAL' && (
          <div style={{ marginTop: '1rem' }}>
            <PayPalScriptProvider options={{ "client-id": "AdMwepOl7fjhj0-jKj-91OriY35fQ4pz4tUxiWQqwgPSxzhuytqzNMnSaWGArt8tbXckJ4rjTkaPUxWt", currency: "USD" }}>
              <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [{
                      amount: {
                        value: datosPago.monto_pago
                      }
                    }]
                  });
                }}
                onApprove={async (data, actions) => {
                  const details = await actions.order.capture();
                  onSubmit({
                    ...datosPago,
                    metodo_pago: 'PAYPAL',
                    referencia: details.id,
                    banco_emisor: 'PayPal',
                    estado_pago: 'COMPLETADO'
                  });
                  onClose();
                }}
                onError={(err) => {
                  alert('Error con el pago de PayPal: ' + err);
                }}
              />
            </PayPalScriptProvider>
          </div>
        )}
      </div>
    </div>
  );
};

function Carrito() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const {
    cartItems,
    loading,
    error,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    clearCart,
    refreshCart
  } = useCart();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [processingCheckout, setProcessingCheckout] = useState(false);
  const [showPagoModal, setShowPagoModal] = useState(false);
  const [ventaId, setVentaId] = useState(null);

  // Asegurarse de que el carrito esté actualizado para el usuario actual
  useEffect(() => {
    if (userId) {
      refreshCart(userId);
    } else {
      // Redirigir al login si no hay usuario
      navigate('/loginCliente');
    }
  }, [userId, refreshCart, navigate]);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const increaseQuantity = (itemId) => {
    const item = cartItems.find(item => item.id_producto === itemId);
    if (item && !loading) updateQuantity(itemId, item.quantity + 1);
  };

  const decreaseQuantity = (itemId) => {
    const item = cartItems.find(item => item.id_producto === itemId);
    if (item && item.quantity > 1 && !loading) updateQuantity(itemId, item.quantity - 1);
  };

  const handleLogout = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Deseas cerrar sesión?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        navigate('/loginCliente', { replace: true });
      }
    });
  };

  const handleCheckout = async () => {
    if (!userId) {
      Swal.fire('Error', 'Debes iniciar sesión para realizar una compra', 'error');
      navigate('/loginCliente');
      return;
    }

    if (cartItems.length === 0) {
      Swal.fire('Carrito vacío', 'Agrega productos a tu carrito antes de continuar', 'info');
      return;
    }

    setProcessingCheckout(true);
    try {
      // 1. Crear la venta
      const ventaRes = await fetch('http://localhost:3000/ventas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_usuario: userId,
          total_venta: getCartTotal(),
          estado: 'activo',
          origen: 'carrito',
          detalles: cartItems.map(item => ({
            id_producto: item.id_producto,
            cantidad_detalle_venta: item.quantity,
            precio_unitario_detalle_venta: item.precio_producto,
            subtotal_detalle_venta: item.precio_producto * item.quantity
          }))
        })
      });
      if (!ventaRes.ok) throw new Error('Error al crear la venta');
      const ventaData = await ventaRes.json();
      setVentaId(ventaData.id);
      setShowPagoModal(true);
    } catch (error) {
      Swal.fire(
        'Error',
        `No se pudo iniciar la compra: ${error.message}`,
        'error'
      );
    } finally {
      setProcessingCheckout(false);
    }
  };

  const handlePagoSubmit = async (datosPago) => {
    try {
      // 2. Crear el pago
      const pagoRes = await fetch('http://localhost:3000/pagos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...datosPago,
          id_venta: ventaId
        })
      });
      if (!pagoRes.ok) {
        const errorData = await pagoRes.json();
        throw new Error(errorData.details || 'Error al registrar el pago');
      }

      // 3. Crear la orden
      const ordenRes = await fetch('http://localhost:3000/orden', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_usuario: userId,
          id_venta: ventaId,
          total_orden: getCartTotal(),
          estado_orden: 'pendiente',
          estado: 'activo'
        })
      });
      if (!ordenRes.ok) throw new Error('Error al crear la orden');

      await clearCart();

      Swal.fire({
        title: '¡Compra exitosa!',
        text: 'Tu pedido ha sido procesado correctamente.',
        icon: 'success'
      }).then(() => {
        navigate('/MisPedidos');
      });

    } catch (error) {
      Swal.fire(
        'Error',
        `No se pudo completar la compra: ${error.message}`,
        'error'
      );
    }
  };

  // Mostrar errores si existen
  useEffect(() => {
    if (error) {
      Swal.fire('Error', error, 'error');
    }
  }, [error]);

  return (
    <div className="dashboard-container">
      {/* Barra lateral */}
      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <h2 className="menu-title">Menú</h2>
          <span
            className={`collapse-arrow ${isCollapsed ? 'rotated' : ''}`}
            onClick={toggleSidebar}
          >
            ◄
          </span>
        </div>
        <ul className="menu-items">
          <li>
            <NavLink to="/iniciocli" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <FaHome className="nav-icon" />
              <span className="nav-text">Inicio</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/Tienda" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <FaShop className="nav-icon" />
              <span className="nav-text">Tienda</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/Carrito" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <FaShoppingCart className="nav-icon" />
              <span className="nav-text">Carrito ({cartItems.length})</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/MisPedidos" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <FaShoppingBag className="nav-icon" />
              <span className="nav-text">Mis pedidos</span>
            </NavLink>
          </li>
        </ul>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="exit-btn">
            <FaSignOutAlt className="exit-icon" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="main-content">
        <div className="shopping-cart-container">
          <div className="cart-header">
            <h2>Carrito de Compras</h2>
            <div className="cart-count">
              <span className="cart-icon">🛒</span>
              <span className="item-count">{cartItems.length}</span>
            </div>
            <button
              onClick={() => refreshCart(userId)}
              className="refresh-btn"
              disabled={loading}
            >
              {loading ? 'Cargando...' : 'Actualizar'}
            </button>
          </div>

          {loading && cartItems.length === 0 ? (
            <div className="loading-cart">
              <p>Cargando carrito...</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="empty-cart">
              <p>Tu carrito está vacío</p>
              <button
                className="continue-shopping-btn"
                onClick={() => navigate('/Tienda')}
              >
                Ir a la tienda
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item.id_producto} className="cart-item">
                    <img
                      src={item.imagen || 'https://via.placeholder.com/80'}
                      alt={item.nombre_producto}
                      className="item-image"
                    />
                    <div className="item-details">
                      <h3 className="item-name">{item.nombre_producto}</h3>
                      <p className="item-price">${Number(item.precio_producto).toFixed(2)}</p>
                      <p className="item-subtotal">
                        Subtotal: ${(
                          Number(item.precio_producto) * Number(item.quantity)
                        ).toFixed(2)}
                      </p>
                    </div>

                    <div className="quantity-controls">
                      <button
                        onClick={() => decreaseQuantity(item.id_producto)}
                        className="quantity-btn decrease"
                        disabled={loading || item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button
                        onClick={() => increaseQuantity(item.id_producto)}
                        className="quantity-btn increase"
                        disabled={loading}
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id_producto)}
                        className="remove-btn"
                        disabled={loading}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>${isNaN(getCartTotal()) ? '0.00' : getCartTotal().toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Envío:</span>
                  <span>Gratis</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>${isNaN(getCartTotal()) ? '0.00' : getCartTotal().toFixed(2)}</span>
                </div>

                <p className="shipping-note">Envío e impuestos calculados al finalizar la compra.</p>

                <div className="checkout-buttons">
                  <button
                    className="checkout-btn"
                    onClick={handleCheckout}
                    disabled={loading || processingCheckout || cartItems.length === 0}
                  >
                    {processingCheckout ? 'Procesando...' : 'Proceder al pago'}
                  </button>
                  <button
                    className="continue-shopping-btn"
                    onClick={() => navigate('/Tienda')}
                    disabled={loading}
                  >
                    Seguir comprando
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <ModalPago
        isOpen={showPagoModal}
        onClose={() => setShowPagoModal(false)}
        total={getCartTotal()}
        onSubmit={handlePagoSubmit}
      />
    </div>
  );
}

export default Carrito;