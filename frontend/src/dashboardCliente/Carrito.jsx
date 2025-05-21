import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { FaShoppingCart, FaHome, FaSignOutAlt, FaShoppingBag } from 'react-icons/fa';
import { FaShop } from 'react-icons/fa6';
import { useCart } from '../context/CartContext';
import Swal from 'sweetalert2';
import './Carrito.css';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';

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
  const [direccionEnvio, setDireccionEnvio] = useState('');
  const [mostrarPayPal, setMostrarPayPal] = useState(false);

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

  const handleCheckout = async (datosPago) => {
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
      const response = await fetch('http://localhost:3000/procesar-compra', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_usuario: userId,
          items: cartItems,
          total: getCartTotal(),
          pago: datosPago,
          direccion_envio: datosPago.direccion_envio || ''
        })
      });

      if (!response.ok) throw new Error('Error al procesar el pago');

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
    } finally {
      setProcessingCheckout(false);
    }
  };

  const pedirDireccionEnvio = async () => {
    const { value: direccion } = await Swal.fire({
      title: 'Dirección de envío',
      input: 'text',
      inputLabel: 'Por favor ingresa tu dirección de envío',
      inputPlaceholder: 'Dirección completa',
      confirmButtonText: 'Continuar con el pago',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) {
          return 'La dirección de envío es obligatoria';
        }
      }
    });
    if (direccion) {
      setDireccionEnvio(direccion);
      setMostrarPayPal(true);
      console.log('Dirección guardada:', direccion);
      console.log('mostrarPayPal:', true);
    }
  };

  const mostrarModalPago = async (total, onSubmit) => {
    const { value: formValues } = await Swal.fire({
      title: '<h2 style="color:#27639b;margin-bottom:16px;">Información de Pago</h2>',
      html: `
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div style="display: flex; gap: 16px;">
            <div style="flex:1; min-width:220px; max-width: 260px;">
              <label style="font-weight:bold;">Monto</label>
              <input id="swal-monto" class="swal2-input" style="width:100%;" value="${total}" readonly>
            </div>
            <div style="flex:1; min-width:220px; max-width: 260px;">
              <label style="font-weight:bold;">Fecha de Pago</label>
              <input id="swal-fecha" class="swal2-input" style="width:100%;" type="datetime-local" value="${new Date().toISOString().slice(0, 16)}">
            </div>
          </div>
          <div style="display: flex; gap: 16px;">
            <div style="flex:1; min-width:220px; max-width: 260px;">
              <label style="font-weight:bold;">Método de Pago</label>
              <input id="swal-metodo" class="swal2-input" style="width:100%;" value="Transferencia" readonly>
            </div>
            <div style="flex:1; min-width:220px; max-width: 260px;">
              <label style="font-weight:bold;">Referencia</label>
              <input id="swal-referencia" class="swal2-input" style="width:100%;" placeholder="Referencia">
            </div>
          </div>
          <div style="display: flex; gap: 16px;">
            <div style="flex:1; min-width:220px; max-width: 260px;">
              <label style="font-weight:bold;">Banco Emisor</label>
              <input id="swal-banco" class="swal2-input" style="width:100%;" placeholder="Banco Emisor">
            </div>
            <div style="flex:1; min-width:220px; max-width: 260px;">
              <label style="font-weight:bold;">Estado del Pago</label>
              <select id="swal-estado" class="swal2-input" style="width:100%;">
                <option value="pendiente">Pendiente</option>
                <option value="completado">Completado</option>
              </select>
            </div>
          </div>
        </div>
      `,
      width: 700,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Procesar Pago',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const referencia = document.getElementById('swal-referencia').value;
        const banco = document.getElementById('swal-banco').value;
        if (!referencia || !banco) {
          Swal.showValidationMessage('Referencia y Banco Emisor son obligatorios');
          return false;
        }
        return {
          monto_pago: Number(document.getElementById('swal-monto').value),
          fecha_pago: document.getElementById('swal-fecha').value,
          metodo_pago: document.getElementById('swal-metodo').value,
          referencia,
          banco_emisor: banco,
          estado_pago: document.getElementById('swal-estado').value
        };
      }
    });

    if (formValues) {
      onSubmit(formValues);
    }
  };

  const handlePagoCliente = async (datosPago) => {
    // ... tu lógica de pago ...
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
                        Subtotal: ${(item.precio_producto * item.quantity).toFixed(2)}
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
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Envío:</span>
                  <span>Gratis</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>

                <p className="shipping-note">Envío e impuestos calculados al finalizar la compra.</p>

                <div className="checkout-buttons">
                  {!mostrarPayPal ? (
                    <button
                      className="checkout-btn"
                      onClick={pedirDireccionEnvio}
                      disabled={loading || processingCheckout || cartItems.length === 0}
                    >
                      Proceder al pago
                    </button>
                  ) : (
                    <PayPalScriptProvider options={{ "client-id": "AX2kwfBLc6X6tevJto9iZ6-yUVrt5GjvXHe2cEQZzJg7aSQrFlGjOZy-SgZKgh4PAOGiPnQtG76XhwT9" }}>
                      <PayPalButtons
                        createOrder={(data, actions) => {
                          return actions.order.create({
                            purchase_units: [{
                              amount: { value: getCartTotal().toString() }
                            }]
                          });
                        }}
                        onApprove={async (data, actions) => {
                          const details = await actions.order.capture();
                          if (details.status === 'COMPLETED') {
                            const datosPago = {
                              monto_pago: getCartTotal(),
                              fecha_pago: new Date().toISOString(),
                              metodo_pago: 'PayPal',
                              referencia: details.id,
                              banco_emisor: details.payer.email_address,
                              estado_pago: details.status,
                              direccion_envio: direccionEnvio // <-- Aquí va la dirección
                            };
                            handleCheckout(datosPago);
                            setMostrarPayPal(false); // Oculta el botón después del pago
                            setDireccionEnvio('');
                          } else {
                            Swal.fire('Pago no completado', 'El pago con PayPal no se completó correctamente.', 'error');
                          }
                        }}
                        onCancel={() => {
                          setMostrarPayPal(false);
                          setDireccionEnvio('');
                        }}
                      />
                    </PayPalScriptProvider>
                  )}
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
    </div>
  );
}

export default Carrito;