// import { useState, useEffect } from 'react';
// import './InicioCli.css';
// import { useNavigate } from "react-router-dom";
// import { Outlet } from 'react-router-dom';
// import {
//     FaHome,
//     FaSignOutAlt,
//     FaShoppingCart,
//     FaShoppingBag,
//     FaHeart,
//     FaUser,
//     FaBell,
//     FaStar,
//     FaSearch,
//     FaFilter
// } from "react-icons/fa";
// import { FaShop } from "react-icons/fa6";

// const InicioCli = () => {
//     const [productos, setProductos] = useState([]);
//     const [categorias] = useState(['Todos', 'Electrodomésticos', 'Electrónica', 'Cocina', 'Lavandería']);
//     const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');
//     const [favoritos, setFavoritos] = useState([]);
//     const [busqueda, setBusqueda] = useState('');
//     const [notificaciones] = useState([
//         { id: 1, mensaje: 'Oferta especial: 20% de descuento en aires acondicionados', fecha: '15/07/2023' },
//         { id: 2, mensaje: 'Tu pedido #45678 ha sido enviado', fecha: '12/07/2023' },
//         { id: 3, mensaje: 'Nuevos productos disponibles', fecha: '10/07/2023' }
//     ]);
//     const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);
//     const [modoOscuro, setModoOscuro] = useState(false);
//     const navigate = useNavigate();

//     // Simulación de datos de productos
//     useEffect(() => {
//         setProductos([
//             {
//                 id: 1,
//                 nombre: 'Aire Acondicionado Inverter',
//                 precio: 25000,
//                 stock: 10,
//                 categoria: 'Electrodomésticos',
//                 calificacion: 4.5,
//                 imagen: 'https://metalgas.com.do/wp-content/uploads/2023/02/Aire-inverter-12000-BTU-eficiencia-21-e1653145649812.jpg',
//                 descripcion: 'Aire acondicionado inverter de alta eficiencia energética, 12,000 BTU'
//             },
//             {
//                 id: 2,
//                 nombre: 'Refrigerador Samsung',
//                 precio: 45000,
//                 stock: 5,
//                 categoria: 'Electrodomésticos',
//                 calificacion: 4.2,
//                 imagen: 'https://images.samsung.com/is/image/samsung/p6pim/latin/rs27t5200s9-ed/gallery/latin-side-by-side-rs27t5200s9-ed-frontsilver-346714496',
//                 descripcion: 'Refrigerador de acero inoxidable con dispensador de hielo y agua'
//             },
//             {
//                 id: 3,
//                 nombre: 'Smart TV LG 55"',
//                 precio: 28000,
//                 stock: 8,
//                 categoria: 'Electrónica',
//                 calificacion: 4.8,
//                 imagen: 'https://www.lg.com/latin/images/tvs/md07527594/gallery/D-01.jpg',
//                 descripcion: 'Televisor 4K UHD con inteligencia artificial ThinQ AI'
//             },
//             {
//                 id: 4,
//                 nombre: 'Microondas Panasonic',
//                 precio: 8000,
//                 stock: 12,
//                 categoria: 'Cocina',
//                 calificacion: 3.9,
//                 imagen: 'https://www.lg.com/cl/images/microondas/md05792305/gallery/medium03.jpg',
//                 descripcion: 'Microondas de 1.2 pies cúbicos con 1200 watts de potencia'
//             },
//             {
//                 id: 5,
//                 nombre: 'Lavadora Whirlpool',
//                 precio: 30000,
//                 stock: 3,
//                 categoria: 'Lavandería',
//                 calificacion: 4.0,
//                 imagen: 'https://whirlpool-latam.scene7.com/is/image/whirlpool/MCLA_8MWTW1935EMM_Frente?wid=1200&hei=1200&fmt=webp',
//                 descripcion: 'Lavadora de carga superior con 19 kg de capacidad'
//             },
//             {
//                 id: 6,
//                 nombre: 'Licuadora Oster',
//                 precio: 3500,
//                 stock: 15,
//                 categoria: 'Cocina',
//                 calificacion: 4.7,
//                 imagen: 'https://m.media-amazon.com/images/I/71dzOPtfEaL._AC_SL1500_.jpg',
//                 descripcion: 'Licuadora de 3 velocidades con jarra de vidrio resistente'
//             },
//         ]);
//     }, []);

//     // Filtrar productos por categoría y búsqueda
//     const productosFiltrados = productos.filter(producto => {
//         const coincideCategoria = categoriaSeleccionada === 'Todos' || producto.categoria === categoriaSeleccionada;
//         const coincideBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase());
//         return coincideCategoria && coincideBusqueda;
//     });

//     const toggleFavorito = (productoId) => {
//         if (favoritos.includes(productoId)) {
//             setFavoritos(favoritos.filter(id => id !== productoId));
//         } else {
//             setFavoritos([...favoritos, productoId]);
//         }
//     };

//     const toggleModoOscuro = () => {
//         setModoOscuro(!modoOscuro);
//         document.body.classList.toggle('modo-oscuro');
//     };

//     return (
//         <div className={`dashboard-container ${modoOscuro ? 'modo-oscuro' : ''}`}>
//             {/* Barra de navegación superior */}
//             <header className="top-navbar">
//                 <div className="logo-container">
//                     <h1>ElectroShop</h1>
//                 </div>
//                 <div className="search-container">
//                     <div className="search-input-container">
//                         <FaSearch className="search-icon" />
//                         <input
//                             type="text"
//                             placeholder="Buscar productos..."
//                             value={busqueda}
//                             onChange={(e) => setBusqueda(e.target.value)}
//                             className="search-input"
//                         />
//                     </div>
//                 </div>
//                 <div className="user-actions">
//                     <div className="notification-bell" onClick={() => setMostrarNotificaciones(!mostrarNotificaciones)}>
//                         <FaBell />
//                         <span className="notification-count">{notificaciones.length}</span>
//                         {mostrarNotificaciones && (
//                             <div className="notification-dropdown">
//                                 <h3>Notificaciones</h3>
//                                 {notificaciones.map(notif => (
//                                     <div key={notif.id} className="notification-item">
//                                         <p>{notif.mensaje}</p>
//                                         <small>{notif.fecha}</small>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                     <div className="user-profile">
//                         <FaUser />
//                     </div>
//                     <div className="theme-toggle" onClick={toggleModoOscuro}>
//                         {modoOscuro ? '☀️' : '🌙'}
//                     </div>
//                 </div>
//             </header>

//             <div className="main-container">
//                 {/* Barra lateral */}
//                 <aside className="sidebar">
//                     <div className="user-info">
//                         <div className="user-avatar">
//                             <img src="https://i.pravatar.cc/150?img=68" alt="Avatar del usuario" />
//                         </div>
//                         <h3 className="username">Carlos Rodríguez</h3>
//                         <p className="user-email">carlos@ejemplo.com</p>
//                     </div>
//                     <ul className="menu-items">
//                         <li className="active">
//                             <FaHome /> <span>Inicio</span>
//                         </li>
//                         <li>
//                             <FaShop /> <span>Tienda</span>
//                         </li>
//                         <li>
//                             <FaHeart /> <span>Favoritos</span>
//                             {favoritos.length > 0 && <span className="badge">{favoritos.length}</span>}
//                         </li>
//                         <li>
//                             <FaShoppingCart /> <span>Carrito</span>
//                         </li>
//                         <li>
//                             <FaShoppingBag /> <span>Mis Pedidos</span>
//                         </li>
//                         <li>
//                             <FaUser /> <span>Mi Perfil</span>
//                         </li>
//                     </ul>
//                     <div className="sidebar-footer">
//                         <button onClick={() => navigate('/Bienvenido')} className="exit-btn">
//                             <FaSignOutAlt />
//                             <span>Cerrar Sesión</span>
//                         </button>
//                     </div>
//                 </aside>

//                 {/* Contenido principal */}
//                 <main className="main-content">
//                     {/* Banner promocional */}
//                     <div className="promo-banner">
//                         <div className="promo-content">
//                             <h2>¡Ofertas especiales de temporada!</h2>
//                             <p>Descuentos de hasta 30% en electrodomésticos seleccionados</p>
//                             <button className="promo-button">Ver ofertas</button>
//                         </div>
//                         <div className="promo-image">
//                             <img src="https://www.lg.com/latin/images/plp-b2c/b2c-modules/lg-home-appliances-hero-resolutions-4096.jpg" alt="Promoción" />
//                         </div>
//                     </div>

//                     {/* Filtros de categoría */}
//                     <div className="category-filter">
//                         <div className="filter-header">
//                             <h2>Explorar productos</h2>
//                             <div className="filter-controls">
//                                 <FaFilter />
//                                 <span>Filtros</span>
//                             </div>
//                         </div>
//                         <div className="category-chips">
//                             {categorias.map(categoria => (
//                                 <button
//                                     key={categoria}
//                                     className={`category-chip ${categoriaSeleccionada === categoria ? 'active' : ''}`}
//                                     onClick={() => setCategoriaSeleccionada(categoria)}
//                                 >
//                                     {categoria}
//                                 </button>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Productos destacados */}
//                     <section className="featured-section">
//                         <h2>Productos destacados</h2>
//                         <div className="product-grid">
//                             {productosFiltrados.map((producto) => (
//                                 <div key={producto.id} className="product-card">
//                                     <div className="product-favorite" onClick={() => toggleFavorito(producto.id)}>
//                                         <FaHeart className={favoritos.includes(producto.id) ? 'favorited' : ''} />
//                                     </div>
//                                     <img src={producto.imagen} alt={producto.nombre} className="product-image" />
//                                     <div className="product-details">
//                                         <h3 className="product-name">{producto.nombre}</h3>
//                                         <div className="product-rating">
//                                             <FaStar className="star-icon" />
//                                             <span>{producto.calificacion}</span>
//                                         </div>
//                                         <p className="product-description">{producto.descripcion}</p>
//                                         <div className="product-footer">
//                                             <p className="product-price">${producto.precio.toLocaleString()}</p>
//                                             <p className={`product-stock ${producto.stock > 0 ? 'in-stock' : 'out-stock'}`}>
//                                                 {producto.stock > 0 ? `${producto.stock} unidades` : 'Sin stock'}
//                                             </p>
//                                         </div>
//                                         <div className="product-actions">
//                                             <button className="add-to-cart-button" disabled={producto.stock === 0}>
//                                                 Añadir al carrito
//                                             </button>
//                                             <button className="buy-now-button" disabled={producto.stock === 0}>
//                                                 Comprar ahora
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </section>

//                     {/* Sección de recomendaciones personalizadas */}
//                     <section className="recommendations-section">
//                         <h2>Recomendado para ti</h2>
//                         <div className="recommendation-cards">
//                             {productos.slice(0, 3).map(producto => (
//                                 <div key={`rec-${producto.id}`} className="recommendation-card">
//                                     <img src={producto.imagen} alt={producto.nombre} />
//                                     <div className="recommendation-details">
//                                         <h3>{producto.nombre}</h3>
//                                         <p className="recommendation-price">${producto.precio.toLocaleString()}</p>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </section>

//                     {/* Renderiza las rutas hijas */}
//                     <Outlet />
//                 </main>
//             </div>
//         </div>
//     );
// };

// export default InicioCli;
