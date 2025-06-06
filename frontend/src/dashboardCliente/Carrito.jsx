import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { FaShoppingCart, FaHome, FaSignOutAlt, FaShoppingBag, FaUser } from 'react-icons/fa';
import { FaShop } from 'react-icons/fa6';
import { useCart } from '../context/CartContext';
import Swal from 'sweetalert2';
import './Carrito.css';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import PagoTransferencia from './PagoTransferencia';

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
  const [userInfo, setUserInfo] = useState(null);
  const [metodoPago, setMetodoPago] = useState('paypal');
  const [provincia, setProvincia] = useState('');
  const [showDireccionModal, setShowDireccionModal] = useState(false);
  const [direccionTemp, setDireccionTemp] = useState('');
  const [provinciaTemp, setProvinciaTemp] = useState('');

  // Asegurarse de que el carrito esté actualizado para el usuario actual
  useEffect(() => {
    if (userId) {
      refreshCart(userId);
      // Obtener info del usuario
      fetch(`https://backend-production-6925.up.railway.app/usuario/${userId}`)
        .then(res => res.json())
        .then(data => setUserInfo(data))
        .catch(() => setUserInfo(null));
    } else {
      // Redirigir al login si no hay usuario
      navigate('/loginCliente');
    }
  }, [userId, refreshCart, navigate]);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const increaseQuantity = (itemId) => {
    const item = cartItems.find(item => item.id_producto === itemId);
    console.log('Increase Quantity called for item:', itemId);
    console.log('Item found:', item);
    console.log('Current quantity:', item?.quantity);
    console.log('Stock available:', item?.stock_producto);
    console.log('Loading state:', loading);
    // Verificar si la nueva cantidad excede el stock disponible
    if (item && item.quantity < item.stock_producto && !loading) {
      console.log('Updating quantity...');
      updateQuantity(itemId, item.quantity + 1);
    } else if (item && item.quantity >= item.stock_producto) {
      console.log('Stock insufficient.');
      Swal.fire('Stock insuficiente', `Solo hay ${item.stock_producto} unidades disponibles de ${item.nombre_producto}.`, 'warning');
    } else if (!item) {
      console.log('Item not found in cartItems.');
    } else if (loading) {
      console.log('Blocked by loading state.');
    }
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

    // Validar stock antes de proceder (frontend validation)
    for (const item of cartItems) {
      if (item.quantity > item.stock_producto) {
        Swal.fire('Stock insuficiente', `La cantidad solicitada de ${item.nombre_producto} excede el stock disponible (${item.stock_producto}). Por favor ajusta la cantidad en el carrito.`, 'warning');
        setProcessingCheckout(false);
        return;
      }
    }

    setProcessingCheckout(true);
    try {
      const response = await fetch('https://backend-production-6925.up.railway.app/procesar-compra', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_usuario: userId,
          items: cartItems,
          total: getCartTotal(),
          pago: datosPago,
          direccion_envio: datosPago.direccion_envio || '',
          provincia_envio: provincia
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

  // Cálculo de costo de envío
  const getCostoEnvio = (prov) => {
    if (prov === 'Santiago') return 500;
    if (prov === 'Santo Domingo') return 1500;
    return 0;
  };

  // Total con envío
  const totalConEnvio = getCartTotal() + getCostoEnvio(provincia);

  // Reemplaza pedirDireccionEnvio para mostrar modal propio
  const pedirDireccionEnvio = () => {
    setDireccionTemp(direccionEnvio);
    setProvinciaTemp(provincia);
    setShowDireccionModal(true);
  };

  // Guardar dirección y provincia y mostrar métodos de pago
  const handleDireccionSubmit = (e) => {
    e.preventDefault();
    if (!direccionTemp || !provinciaTemp) return;
    setDireccionEnvio(direccionTemp);
    setProvincia(provinciaTemp);
    setShowDireccionModal(false);
    setMostrarPayPal(true);
  };

  const handlePagoTransferencia = async (formData) => {
    try {
      // Mostrar confirmación antes de proceder
      const result = await Swal.fire({
        title: '¿Confirmar pago?',
        text: '¿Estás seguro que deseas proceder con este pago por transferencia?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, continuar',
        cancelButtonText: 'Cancelar'
      });

      if (!result.isConfirmed) return;

      // 1. Crear la venta
      const ventaResponse = await fetch('https://backend-production-6925.up.railway.app/procesar-compra', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_usuario: userId,
          items: cartItems,
          total: getCartTotal(),
          pago: {
            monto_pago: getCartTotal(),
            fecha_pago: new Date().toISOString(),
            metodo_pago: 'Transferencia',
            estado_pago: 'pendiente',
            referencia: formData.get('referencia'),
            banco_emisor: formData.get('banco_emisor'),
            estado: 'activo'
          },
          direccion_envio: direccionEnvio,
          provincia_envio: provincia
        })
      });

      if (!ventaResponse.ok) {
        throw new Error('Error al crear la venta');
      }

      const ventaData = await ventaResponse.json();
      if (!ventaData.id) {
        throw new Error('No se pudo crear la venta');
      }

      // 2. Enviar el comprobante con el id_venta
      formData.append('id_venta', ventaData.id);
      const pagoResponse = await fetch('https://backend-production-6925.up.railway.app/pago/transferencia', {
        method: 'POST',
        body: formData
      });

      if (!pagoResponse.ok) {
        throw new Error('Error al enviar el comprobante');
      }

      const pagoData = await pagoResponse.json();
      if (!pagoData.success) {
        throw new Error(pagoData.message || 'Error al procesar el pago');
      }

      // Éxito
      await Swal.fire({
        title: '¡Comprobante enviado!',
        text: 'Tu comprobante ha sido recibido y será validado por un administrador.',
        icon: 'success',
        confirmButtonText: 'Entendido'
      });

      await clearCart();
      navigate('/MisPedidos');
    } catch (error) {
      console.error('Error en handlePagoTransferencia:', error);
      Swal.fire({
        title: 'Error',
        text: error.message || 'Ocurrió un error al procesar tu pago',
        icon: 'error'
      });

      // Revertir cambios si es necesario
      // Aquí podrías llamar a un endpoint para eliminar la venta si falló el proceso
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
        {/* Información del usuario */}
        {userInfo && (
          <div className="user-info">
            <div
              className="user-avatar"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/editar-perfil")}
            >
              <FaUser size={40} />
            </div>
            <h3 className="username">{userInfo.nombre_clientes}</h3>
            <p className="user-email">{userInfo.correo_clientes}</p>
          </div>
        )}
        <ul className="menu-items">
          {/* <li>
            <NavLink to="/iniciocli" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <FaHome className="nav-icon" />
              <span className="nav-text">Inicio</span>
            </NavLink>
          </li> */}
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
                  <span>{provincia ? `$${getCostoEnvio(provincia)}` : '--'}</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>${totalConEnvio.toFixed(2)}</span>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label>
                    <input
                      type="radio"
                      name="metodoPago"
                      value="paypal"
                      checked={metodoPago === 'paypal'}
                      onChange={() => setMetodoPago('paypal')}
                    />
                    PayPal
                  </label>
                  <label style={{ marginLeft: 16 }}>
                    <input
                      type="radio"
                      name="metodoPago"
                      value="transferencia"
                      checked={metodoPago === 'transferencia'}
                      onChange={() => setMetodoPago('transferencia')}
                    />
                    Transferencia bancaria
                  </label>
                </div>

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
                    <>
                      {metodoPago === 'paypal' && (
                        <PayPalScriptProvider options={{ "client-id": "AX2kwfBLc6X6tevJto9iZ6-yUVrt5GjvXHe2cEQZzJg7aSQrFlGjOZy-SgZKgh4PAOGiPnQtG76XhwT9" }}>
                          <PayPalButtons
                            createOrder={(data, actions) => {
                              return actions.order.create({
                                purchase_units: [{
                                  amount: { value: totalConEnvio.toString() }
                                }]
                              });
                            }}
                            onApprove={async (data, actions) => {
                              const details = await actions.order.capture();
                              if (details.status === 'COMPLETED') {
                                const datosPago = {
                                  monto_pago: totalConEnvio,
                                  fecha_pago: new Date().toISOString(),
                                  metodo_pago: 'PayPal',
                                  referencia: details.id,
                                  banco_emisor: details.payer.email_address,
                                  estado_pago: details.status,
                                  direccion_envio: direccionEnvio,
                                  provincia_envio: provincia
                                };
                                handleCheckout(datosPago);
                                setMostrarPayPal(false);
                                setDireccionEnvio('');
                                setProvincia('');
                              } else {
                                Swal.fire('Pago no completado', 'El pago con PayPal no se completó correctamente.', 'error');
                              }
                            }}
                            onCancel={() => {
                              setMostrarPayPal(false);
                              setDireccionEnvio('');
                              setProvincia('');
                            }}
                          />
                        </PayPalScriptProvider>
                      )}
                      {metodoPago === 'transferencia' && (
                        <div style={{ position: 'relative' }}>
                          {processingCheckout && (
                            <div style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              backgroundColor: 'rgba(255,255,255,0.7)',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              zIndex: 10
                            }}>
                              <div style={{ textAlign: 'center' }}>
                                <p>Procesando tu pago...</p>
                                <p>Por favor no cierres esta página</p>
                              </div>
                            </div>
                          )}
                          <PagoTransferencia
                            onSubmit={async (formData) => {
                              if (processingCheckout) return;

                              try {
                                setProcessingCheckout(true);
                                formData.append('provincia_envio', provincia);
                                await handlePagoTransferencia(formData);
                                setProvincia('');
                                setDireccionEnvio('');
                              } catch (error) {
                                console.error('Error en el proceso de pago:', error);
                              } finally {
                                setProcessingCheckout(false);
                              }
                            }}
                            monto={totalConEnvio}
                            isSubmitting={processingCheckout}
                          />
                        </div>
                      )}
                    </>
                  )}

                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Modal para dirección y provincia */}
      {showDireccionModal && (
        <div className="modal-pago-overlay" style={{ zIndex: 9999 }}>
          <div className="modal-pago-content" style={{ background: '#fff', borderRadius: 18, padding: 36, minWidth: 340, maxWidth: 420, boxShadow: '0 8px 32px #2563eb22', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
            <h2 className="modal-pago-title" style={{ color: '#176bb3', fontSize: 26, fontWeight: 700, marginBottom: 18, textAlign: 'center' }}>Dirección de envío</h2>
            <form className="modal-pago-form" onSubmit={handleDireccionSubmit}>
              <label style={{ color: '#222', fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Dirección completa</label>
              <input
                type="text"
                value={direccionTemp}
                onChange={e => setDireccionTemp(e.target.value)}
                placeholder="Dirección completa"
                required
                style={{ background: '#fff', color: '#222', fontSize: 17, border: '1.5px solid #dbeafe', borderRadius: 8, padding: '12px 14px', marginBottom: 18 }}
              />
              <label style={{ color: '#222', fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Provincia</label>
              <select
                value={provinciaTemp}
                onChange={e => setProvinciaTemp(e.target.value)}
                required
                style={{ background: '#fff', color: '#222', fontSize: 17, border: '1.5px solid #dbeafe', borderRadius: 8, padding: '12px 14px', marginBottom: 18 }}
              >
                <option value="">Seleccione una provincia</option>
                <option value="Santiago">Santiago</option>
                <option value="Santo Domingo">Santo Domingo</option>
              </select>
              <div style={{ margin: '12px 0', color: '#176bb3', fontWeight: 'bold', fontSize: 18 }}>
                Costo de envío: {getCostoEnvio(provinciaTemp) > 0 ? `$${getCostoEnvio(provinciaTemp)}` : '--'}<br />
                Total a pagar: ${(getCartTotal() + getCostoEnvio(provinciaTemp)).toFixed(2)}
              </div>
              <div className="modal-pago-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: 16, marginTop: 18 }}>
                <button type="button" className="modal-pago-cancel" onClick={() => setShowDireccionModal(false)} style={{ background: '#e5e7eb', color: '#222', border: 'none', padding: '10px 24px', borderRadius: 8, fontWeight: 500, fontSize: 16, cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" className="modal-pago-submit" style={{ background: '#176bb3', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 8, fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Continuar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Carrito;