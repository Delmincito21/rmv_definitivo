import React, { useState, useEffect } from "react";
import { FaShoppingCart, FaHome, FaSignOutAlt, FaShoppingBag, FaSearch, FaTimes, FaUser, FaSort } from "react-icons/fa";
import { FaShop } from "react-icons/fa6";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Tienda.css";
import { useCart } from '../context/CartContext';
import Swal from 'sweetalert2';


// Función auxiliar para formatear precios
const formatPrice = (price) => {
  try {
    const numberPrice = Number(price);
    return !isNaN(numberPrice) ? numberPrice.toFixed(2) : '0.00';
  } catch (error) {
    console.error('Error al formatear precio:', error);
    return '0.00';
  }
};

const getImagenUrl = (url) => {
  // Si la URL ya tiene el parámetro de formato, la devuelve igual
  if (url.includes('$')) return url;
  // Si no, le agrega el formato PNG por defecto
  return url + '?$684_547_PNG$';
};

const ProductoDetalle = ({ producto, onClose, onAddToCart }) => {
  if (!producto) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          <FaTimes />
        </button>
        <div className="producto-detalle">
          <div className="producto-detalle-imagen">
            <img
              src={getImagenUrl(producto.imagen_url)}
              alt={producto.nombre_producto}
              className="producto-imagen"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/300x200?text=Imagen+no+disponible";
              }}
            />

          </div>
          <div className="producto-detalle-info">
            <h2>{producto.nombre_producto}</h2>
            <p className="precio">${formatPrice(producto.precio_producto)}</p>
            <p className="stock-info" style={{ fontSize: '0.9em', color: producto.stock_producto > 5 ? '#28a745' : producto.stock_producto > 0 ? '#ffc107' : '#dc3545', fontWeight: 'bold' }}>
              Stock: {producto.stock_producto > 0 ? producto.stock_producto : 'Agotado'}
            </p>
            <div className="detalles-grid">
              <div className="detalle-item">
                <span className="label">Marca:</span>
                <span className="valor">{producto.marca_producto}</span>
              </div>
              <div className="detalle-item">
                <span className="label">Modelo:</span>
                <span className="valor">{producto.modelo}</span>
              </div>
              <div className="detalle-item">
                <span className="label">Color:</span>
                <span className="valor">{producto.color}</span>
              </div>
              <div className="detalle-item">
                <span className="label">Garantía:</span>
                <span className="valor">{producto.garantia}</span>
              </div>
              <div className="detalle-item">
                <span className="label">Stock:</span>
                <span className="valor">{producto.stock_producto}</span>
              </div>
              <div className="detalle-item full-width">
                <span className="label">Descripción:</span>
                <p className="descripcion">{producto.descripcion_producto}</p>
              </div>
            </div>
            <button
              className="boton-agregar-detalle"
              disabled={producto.stock_producto <= 0}
              onClick={onAddToCart}
            >
              <FaShoppingCart /> Añadir al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Tienda = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtros, setFiltros] = useState({
    categoria: '',
    marca: '',
    color: ''
  });
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          navigate('/loginCliente');
          return;
        }

        const [productosRes, categoriasRes, userRes] = await Promise.all([
          axios.get('http://localhost:3000/productos'),
          axios.get('http://localhost:3000/categorias_productos'),
          axios.get(`http://localhost:3000/usuario/${userId}`)
        ]);

        const productosActivos = productosRes.data.filter(producto => producto.estado === 'activo');
        console.log("Productos activos:", productosActivos);
        setProductos(productosActivos);
        setCategorias(categoriasRes.data);
        setUserInfo(userRes.data);
        setLoading(false);

      } catch (err) {
        console.error('Error al cargar los datos:', err);
        setError('Error al cargar los datos. Por favor, intente más tarde.');
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Obtener marcas y colores únicos de los productos
  const marcas = [...new Set(productos.map(p => p.marca_producto))];
  const colores = [...new Set(productos.map(p => p.color))];

  // Filtrar productos
  const filteredProducts = productos.filter(producto => {
    const matchSearch = producto.nombre_producto.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategoria = !filtros.categoria || producto.id_categoria.toString() === filtros.categoria;
    const matchMarca = !filtros.marca || producto.marca_producto === filtros.marca;
    const matchColor = !filtros.color || producto.color === filtros.color;

    return matchSearch && matchCategoria && matchMarca && matchColor;
  });

  // Contador de productos filtrados
  const totalFiltrados = filteredProducts.length;

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
        navigate('/', { replace: true }); // <-- Esto evita volver atrás
      }
    });
  };

  console.log("ID de usuario actual:", localStorage.getItem('userId'));

  if (loading) {
    return <div className="loading">Cargando productos...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar igual que en MisPedidos */}
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
        {userInfo && (
          <div className="user-info">
            <div className="user-avatar" onClick={() => navigate("/editar-perfil")}> <FaUser size={40} /> </div>
            <h3 className="username">{userInfo.nombre_clientes}</h3>
            <p className="user-email">{userInfo.correo_clientes}</p>
          </div>
        )}
        <ul className="menu-items">
          <li>
            <NavLink to="/Tienda" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <FaShop className="nav-icon" />
              <span className="nav-text">Tienda</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/Carrito" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <FaShoppingCart className="nav-icon" />
              <span className="nav-text">
                Carrito
                {cartItems.length > 0 && (
                  <span style={{
                    background: '#27639b',
                    color: '#fff',
                    borderRadius: '50%',
                    padding: '2px 8px',
                    marginLeft: 8,
                    fontWeight: 'bold',
                    fontSize: 13,
                    minWidth: 22,
                    display: 'inline-block',
                    textAlign: 'center'
                  }}>
                    {cartItems.length}
                  </span>
                )}
              </span>
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
        <div className="mis-pedidos-container" style={{
          maxWidth: 1000,
          margin: '0.5rem auto',
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 4px 16px #2563eb11',
          padding: 24
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ color: '#27639b', margin: 0 }}>Catálogo de Productos</h2>
            <div style={{
              background: '#e0e7ff',
              padding: '8px 16px',
              borderRadius: 20,
              color: '#27639b',
              fontWeight: 'bold'
            }}>
              Total: {loading ? 'Cargando...' : totalFiltrados + ' productos'}
            </div>
          </div>
          {/* Barra de búsqueda y filtros */}
          <div style={{
            display: 'flex',
            gap: 16,
            marginBottom: 24,
            flexWrap: 'wrap'
          }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ position: 'relative' }}>
                <FaSearch style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#27639b'
                }} />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 36px',
                    border: '1px solid #cbd5e1',
                    borderRadius: 8,
                    fontSize: 14,
                    background: '#fff',
                    color: '#222',
                    boxShadow: '0 1px 2px #e0e7ff44',
                    outline: 'none',
                    transition: 'border 0.2s',
                  }}
                />
              </div>
            </div>
            <select
              value={filtros.categoria}
              onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}
              style={{
                padding: '8px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: 8,
                fontSize: 14,
                minWidth: 150,
                background: '#fff',
                color: '#222',
                boxShadow: '0 1px 2px #e0e7ff44',
                outline: 'none',
                transition: 'border 0.2s',
              }}
            >
              <option value="">Todas las categorías</option>
              {categorias.map(cat => (
                <option key={cat.id_categoria_producto} value={cat.id_categoria_producto}>
                  {cat.nombre_categoria_producto}
                </option>
              ))}
            </select>
            <select
              value={filtros.marca}
              onChange={(e) => setFiltros({ ...filtros, marca: e.target.value })}
              style={{
                padding: '8px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: 8,
                fontSize: 14,
                minWidth: 150,
                background: '#fff',
                color: '#222',
                boxShadow: '0 1px 2px #e0e7ff44',
                outline: 'none',
                transition: 'border 0.2s',
              }}
            >
              <option value="">Todas las marcas</option>
              {marcas.map(marca => (
                <option key={marca} value={marca}>{marca}</option>
              ))}
            </select>
            <select
              value={filtros.color}
              onChange={(e) => setFiltros({ ...filtros, color: e.target.value })}
              style={{
                padding: '8px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: 8,
                fontSize: 14,
                minWidth: 150,
                background: '#fff',
                color: '#222',
                boxShadow: '0 1px 2px #e0e7ff44',
                outline: 'none',
                transition: 'border 0.2s',
              }}
            >
              <option value="">Todos los colores</option>
              {colores.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
            <button
              onClick={() => setProductos([...productos].reverse())}
              style={{
                padding: '8px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: 8,
                background: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: '#27639b',
                fontWeight: 'bold',
                boxShadow: '0 1px 2px #e0e7ff44',
                outline: 'none',
                transition: 'border 0.2s',
              }}
            >
              <FaSort /> Ordenar
            </button>
          </div>
          {/* Grid de productos */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
              overflowY: 'auto',
              maxHeight: '420px',
              background: '#fff',
              borderRadius: 12,
              border: '1px solid #e0e7ff',
              width: '100%',
              padding: '8px 0 16px 0',
            }}
            className="tabla-scroll-personalizada"
          >
            {filteredProducts.length > 0 ? (
              filteredProducts.map((producto) => (
                <div key={producto.id_producto} style={{
                  width: '100%',
                  background: '#f9fafb',
                  borderRadius: 12,
                  boxShadow: '0 2px 8px #2563eb11',
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  border: '1px solid #e0e7ff',
                  position: 'relative',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                    <div style={{ minWidth: 120, maxWidth: 120, height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: 8, overflow: 'hidden', border: '1px solid #e0e7ff' }}>
                      <img
                        src={getImagenUrl(producto.imagen_url)}
                        alt={producto.nombre_producto}
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/300x200?text=Imagen+no+disponible";
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontWeight: 'bold', color: '#27639b', fontSize: 18, margin: 0 }}>{producto.nombre_producto}</h3>
                      <div style={{ color: '#888', fontSize: 15, marginBottom: 4 }}>{producto.marca_producto}</div>
                      <div style={{ fontWeight: 600, fontSize: 16, color: '#2196F3', marginBottom: 8 }}>
                        ${formatPrice(producto.precio_producto)}
                      </div>
                      <p className="stock-info" style={{ fontSize: '0.9em', color: producto.stock_producto > 5 ? '#28a745' : producto.stock_producto > 0 ? '#ffc107' : '#dc3545', fontWeight: 'bold' }}>
                        Stock: {producto.stock_producto > 0 ? producto.stock_producto : 'Agotado'}
                      </p>
                      <div style={{ display: 'flex', gap: 12 }}>
                        <button
                          style={{
                            background: '#27639b',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 8,
                            padding: '10px 18px',
                            fontWeight: 'bold',
                            fontSize: 15,
                            cursor: 'pointer',
                            transition: 'background 0.2s',
                          }}
                          onClick={() => setProductoSeleccionado(producto)}
                          onMouseOver={e => e.target.style.background = '#1e4c7d'}
                          onMouseOut={e => e.target.style.background = '#27639b'}
                        >
                          Ver Detalles
                        </button>
                        <button
                          style={{
                            background: '#43a047',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 8,
                            padding: '10px 18px',
                            fontWeight: 'bold',
                            fontSize: 15,
                            cursor: producto.stock_producto <= 0 ? 'not-allowed' : 'pointer',
                            opacity: producto.stock_producto <= 0 ? 0.6 : 1,
                            transition: 'background 0.2s',
                          }}
                          disabled={producto.stock_producto <= 0}
                          onClick={() => {
                            addToCart(producto);
                            Swal.fire({
                              title: "AGREGADO AL CARRITO!",
                              icon: "success",
                              draggable: true
                            });
                          }}
                          onMouseOver={e => e.target.style.background = '#2e7031'}
                          onMouseOut={e => e.target.style.background = '#43a047'}
                        >
                          <FaShoppingCart /> Añadir al carrito
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '2rem',
                background: '#f8fafc',
                borderRadius: 8
              }}>
                <p>No se encontraron productos.</p>
              </div>
            )}
          </div>
        </div>
        {/* Modal de detalles del producto */}
        {productoSeleccionado && (
          <ProductoDetalle
            producto={productoSeleccionado}
            onClose={() => setProductoSeleccionado(null)}
            onAddToCart={() => {
              addToCart(productoSeleccionado);
              Swal.fire({
                title: "AGREGADO AL CARRITO!",
                icon: "success",
                draggable: true
              });
              setProductoSeleccionado(null);
            }}
          />
        )}
      </main>
    </div>
  );
};

export default Tienda;
