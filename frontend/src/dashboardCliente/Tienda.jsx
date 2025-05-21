import React, { useState, useEffect } from "react";
import { FaShoppingCart, FaHome, FaSignOutAlt, FaShoppingBag, FaSearch, FaTimes, FaUser } from "react-icons/fa";
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
              src={`http://localhost:3000/${producto.imagen_url}` || '/imagesprods/p1.png'}
              alt={producto.nombre_producto}
              className="producto-imagen"
            />

          </div>
          <div className="producto-detalle-info">
            <h2>{producto.nombre_producto}</h2>
            <p className="precio">${formatPrice(producto.precio_producto)}</p>
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
  const { addToCart } = useCart();

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

        setProductos(productosRes.data);
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
      {/* Barra lateral */}
      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-content">
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
        </div>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="exit-btn">
            <FaSignOutAlt className="exit-icon" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="main-content">
        <div className="titulo-productos">
          <FaShop />
          <h2>Catálogo de Productos</h2>
        </div>
        <div className="tienda-container">
          <div className="tienda-header">
            <h2 className="tienda-title">Productos</h2>
            <div className="filtros-container">
              <div className="search-input-wrapper">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <select
                value={filtros.categoria}
                onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}
                className="filtro-select"
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
                className="filtro-select"
              >
                <option value="">Todas las marcas</option>
                {marcas.map(marca => (
                  <option key={marca} value={marca}>{marca}</option>
                ))}
              </select>
              <select
                value={filtros.color}
                onChange={(e) => setFiltros({ ...filtros, color: e.target.value })}
                className="filtro-select"
              >
                <option value="">Todos los colores</option>
                {colores.map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="horizontal-products-container">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((producto) => (
                <div key={producto.id_producto} className="horizontal-product-card">
                  <img
                    src={producto.imagen_url}
                    alt={producto.nombre_producto}
                    className="producto-imagen"
                  />
                  <div className="horizontal-product-content">
                    <h3 className="producto-nombre">{producto.nombre_producto}</h3>
                    <p className="producto-marca">{producto.marca_producto}</p>
                    <p className="horizontal-product-price">${formatPrice(producto.precio_producto)}</p>
                    <div className="horizontal-product-stock">
                      <span className={`stock-indicator ${producto.stock_producto > 0 ? 'in-stock' : 'out-of-stock'}`}></span>
                      {producto.stock_producto > 0 ? `${producto.stock_producto} disponibles` : 'Sin stock'}
                    </div>
                    <div className="product-buttons">
                      <button
                        className="boton-detalles"
                        onClick={() => setProductoSeleccionado(producto)}
                      >
                        Ver detalles
                      </button>
                      <button
                        className="boton-agregar"
                        disabled={producto.stock_producto <= 0}
                        onClick={() => {
                          addToCart(producto);
                          // Opcional: Mostrar una notificación de éxito
                          Swal.fire({
                            title: "AGREGADO AL CARRITO!",
                            icon: "success",
                            draggable: true
                          });
                        }}
                      >
                        <FaShoppingCart /> Añadir al carrito
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">No se encontraron productos</div>
            )}
          </div>
        </div>
      </main>

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
    </div>
  );
};

export default Tienda;
