import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { FaShoppingCart, FaHome, FaSignOutAlt, FaShoppingBag } from 'react-icons/fa';
import { FaShop } from 'react-icons/fa6';
import { useCart } from '../context/CartContext';
import './Carrito.css';

function Carrito() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Función para incrementar cantidad
  const increaseQuantity = (itemId) => {
    const item = cartItems.find(item => item.id_producto === itemId);
    if (item) {
      updateQuantity(itemId, item.quantity + 1);
    }
  };

  // Función para disminuir cantidad
  const decreaseQuantity = (itemId) => {
    const item = cartItems.find(item => item.id_producto === itemId);
    if (item && item.quantity > 1) {
      updateQuantity(itemId, item.quantity - 1);
    }
  };

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
              <span className="nav-text">Carrito</span>
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
          <button onClick={() => navigate('/Bienvenido')} className="exit-btn">
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
          </div>

          {cartItems.length === 0 ? (
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
                    </div>

                    <div className="quantity-controls">
                      <button 
                        onClick={() => decreaseQuantity(item.id_producto)}
                        className="quantity-btn decrease"
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button 
                        onClick={() => increaseQuantity(item.id_producto)}
                        className="quantity-btn increase"
                      >
                        +
                      </button>
                      <button 
                        onClick={() => removeFromCart(item.id_producto)}
                        className="remove-btn"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <div className="subtotal">
                  <p>Subtotal</p>
                  <p>${getCartTotal().toFixed(2)}</p>
                </div>
                <p className="shipping-note">Envío e impuestos calculados al finalizar la compra.</p>
                <div className="checkout-buttons">
                  <button className="checkout-btn">
                    Proceder al pago
                  </button>
                  <button 
                    className="continue-shopping-btn"
                    onClick={() => navigate('/Tienda')}
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