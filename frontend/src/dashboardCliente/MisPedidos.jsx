import React, { useEffect, useState } from 'react';
import { FaShoppingCart, FaHome, FaSignOutAlt, FaShoppingBag, FaSearch, FaFilter, FaSort, FaUser } from "react-icons/fa";
import { FaShop } from "react-icons/fa6";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import './Tienda.css';
import { useCart } from '../context/CartContext';

const MisPedidos = () => {
  const userId = localStorage.getItem('userId');
  const [pedidos, setPedidos] = useState([]);
  const [pedidosFiltrados, setPedidosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [detalles, setDetalles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [pago, setPago] = useState(null);
  const [envio, setEnvio] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [ordenarPor, setOrdenarPor] = useState('fecha');
  const [ordenAscendente, setOrdenAscendente] = useState(false);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const { cartItems } = useCart();

  // Cargar pedidos del usuario
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch(`http://localhost:3000/ventas/usuario/${userId}`)
      .then(res => res.json())
      .then(async data => {
        // Para cada pedido, buscar su orden y su envío
        const pedidosConEnvio = await Promise.all(data.map(async pedido => {
          try {
            const ordenRes = await fetch(`http://localhost:3000/orden/venta/${pedido.id_venta}`);
            const orden = await ordenRes.json();
            if (orden && orden.id_orden) {
              const envioRes = await fetch(`http://localhost:3000/envios/orden/${orden.id_orden}`);
              if (envioRes.ok) {
                const envio = await envioRes.json();
                return { ...pedido, envio_estado: envio.estado_envio, envio_fecha: envio.fecha_estimada_envio };
              }
            }
          } catch (e) {}
          return { ...pedido, envio_estado: null, envio_fecha: null };
        }));
        setPedidos(pedidosConEnvio);
        setPedidosFiltrados(pedidosConEnvio);
      })
      .catch(err => {
        Swal.fire('Error', 'No se pudieron cargar tus pedidos', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  // Filtrar y ordenar pedidos
  useEffect(() => {
    let resultado = [...pedidos];

    // Aplicar búsqueda
    if (busqueda) {
      resultado = resultado.filter(pedido =>
        pedido.id_venta.toString().includes(busqueda) ||
        pedido.estado_venta.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    // Aplicar filtro de estado
    if (filtroEstado !== 'todos') {
      resultado = resultado.filter(pedido =>
        pedido.estado_venta.toLowerCase() === filtroEstado.toLowerCase()
      );
    }

    // Aplicar ordenamiento
    resultado.sort((a, b) => {
      if (ordenarPor === 'fecha') {
        return ordenAscendente
          ? new Date(a.fecha_venta) - new Date(b.fecha_venta)
          : new Date(b.fecha_venta) - new Date(a.fecha_venta);
      } else if (ordenarPor === 'total') {
        return ordenAscendente
          ? a.total - b.total
          : b.total - a.total;
      }
      return 0;
    });

    setPedidosFiltrados(resultado);
  }, [pedidos, busqueda, filtroEstado, ordenarPor, ordenAscendente]);

  // Cargar detalles completos de un pedido
  const verDetalles = async (id_venta) => {
    setShowModal(true);
    setDetalles([]);
    setPedidoSeleccionado(null);
    setPago(null);
    setEnvio(null);
    try {
      // 1. Detalles de productos
      const detallesRes = await fetch(`http://localhost:3000/pedido/detalle/${id_venta}`);
      const detallesData = await detallesRes.json();
      setDetalles(detallesData);

      // 2. Pago
      const pagoRes = await fetch(`http://localhost:3000/pago/venta/${id_venta}`);
      const pagoArray = await pagoRes.json();
      setPago(Array.isArray(pagoArray) ? pagoArray[0] : pagoArray);

      // 3. Envío (requiere buscar la orden primero)
      const ordenRes = await fetch(`http://localhost:3000/orden/venta/${id_venta}`);
      const orden = await ordenRes.json();
      if (orden && orden.id_orden) {
        const envioRes = await fetch(`http://localhost:3000/envios/orden/${orden.id_orden}`);
        const envioData = await envioRes.json();
        setEnvio(envioData);
      } else {
        setEnvio(null);
      }
      setPedidoSeleccionado(pedidos.find(p => p.id_venta === id_venta));
    } catch (err) {
      Swal.fire('Error', 'No se pudieron cargar los detalles del pedido', 'error');
    }
  };

  const cerrarModal = () => {
    setShowModal(false);
    setPedidoSeleccionado(null);
    setDetalles([]);
    setPago(null);
    setEnvio(null);
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

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  useEffect(() => {
    if (!userId) return;
    fetch(`http://localhost:3000/usuario/${userId}`)
      .then(res => res.json())
      .then(data => {
        setUserInfo(data);
      })
      .catch(() => {
        setUserInfo(null);
      });
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    fetch(`http://localhost:3000/carrito/usuario/${userId}`)
      .then(res => res.json())
      .then(data => {
        setCartItems(data);
      })
      .catch(() => {
        setCartItems([]);
      });
  }, [userId]);

  console.log("pedidos:", pedidos);
  console.log("pedidosFiltrados:", pedidosFiltrados);

  return (
    <div className="dashboard-container">
      {/* Sidebar igual que en Tienda */}
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

        {/* Información del usuario */}

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
            <h2 style={{ color: '#27639b', margin: 0 }}>Mis Pedidos</h2>
            <div style={{
              background: '#e0e7ff',
              padding: '8px 16px',
              borderRadius: 20,
              color: '#27639b',
              fontWeight: 'bold'
            }}>
              Total: {loading ? 'Cargando...' : pedidos.length + ' pedidos'}
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
                  placeholder="Buscar por ID o estado..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
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
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
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
              <option value="todos">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="completado">Completado</option>
              <option value="enviado">Enviado</option>
            </select>

            <select
              value={ordenarPor}
              onChange={(e) => setOrdenarPor(e.target.value)}
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
              <option value="fecha">Ordenar por fecha</option>
              <option value="total">Ordenar por total</option>
            </select>

            <button
              onClick={() => setOrdenAscendente(!ordenAscendente)}
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
              <FaSort />
              {ordenAscendente ? 'Ascendente' : 'Descendente'}
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>Cargando pedidos...</p>
            </div>
          ) : pedidosFiltrados.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              background: '#f8fafc',
              borderRadius: 8
            }}>
              <p>No se encontraron pedidos.</p>
            </div>
          ) : (
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
              {pedidosFiltrados.map(pedido => (
                <div key={pedido.id_venta} style={{
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', color: '#27639b', fontSize: 18 }}>#{pedido.id_venta}</span>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: 'bold',
                      background: pedido.estado_venta === 'completado' ? '#dcfce7' :
                        pedido.estado_venta === 'pendiente' ? '#fef9c3' : '#fee2e2',
                      color: pedido.estado_venta === 'completado' ? '#166534' :
                        pedido.estado_venta === 'pendiente' ? '#854d0e' : '#991b1b',
                      textTransform: 'capitalize',
                    }}>{pedido.estado_venta}</span>
                  </div>
                  <div style={{ color: '#666', fontSize: 14, marginBottom: 4 }}>
                    {new Date(pedido.fecha_venta).toLocaleString()}
                  </div>
                  {/* Estado y fecha de envío */}
                  <div style={{ color: '#27639b', fontSize: 14, marginBottom: 4, display: 'flex', gap: 16, alignItems: 'center' }}>
                    <span><b>Estado envío:</b> {pedido.envio_estado ? pedido.envio_estado : 'No disponible'}</span>
                    <span><b>Fecha estimada:</b> {pedido.envio_fecha ? new Date(pedido.envio_fecha).toLocaleDateString() : '--'}</span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 16, color: '#2196F3', marginBottom: 8 }}>
                    Total: ${pedido.total || 0}
                  </div>
                  <button
                    onClick={() => verDetalles(pedido.id_venta)}
                    style={{
                      background: '#27639b',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      padding: '10px 0',
                      fontWeight: 'bold',
                      fontSize: 15,
                      marginTop: 8,
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                    onMouseOver={e => e.target.style.background = '#1e4c7d'}
                    onMouseOut={e => e.target.style.background = '#27639b'}
                  >
                    Ver Detalles
                  </button>
                  <button
                    onClick={() => navigate(`/factura/${pedido.id_venta}`, { state: { volverA: '/MisPedidos' } })}
                    style={{
                      background: '#43a047',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      padding: '10px 0',
                      fontWeight: 'bold',
                      fontSize: 15,
                      marginTop: 8,
                      marginLeft: 8,
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                    onMouseOver={e => e.target.style.background = '#2e7031'}
                    onMouseOut={e => e.target.style.background = '#43a047'}
                  >
                    Ver Factura
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Modal de detalles */}
          {showModal && pedidoSeleccionado && (
            <div style={{
              position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
              background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
            }}>
              <div style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 350, maxWidth: 500, boxShadow: '0 4px 24px #2563eb22', position: 'relative' }}>
                <button onClick={cerrarModal} style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#27639b' }}>×</button>
                <h3 style={{ color: '#27639b', marginBottom: 12 }}>Detalle del pedido n.º {pedidoSeleccionado.id_venta}</h3>
                <p><b>Fecha:</b> {new Date(pedidoSeleccionado.fecha_venta).toLocaleString()}</p>
                <p><b>Estado:</b> {pedidoSeleccionado.estado_venta}</p>
                <table style={{ width: '100%', borderCollapse: 'collapse', margin: '12px 0' }}>
                  <thead>
                    <tr style={{ background: '#e0e7ff' }}>
                      <th style={{ padding: 6 }}>Producto</th>
                      <th style={{ padding: 6 }}>Cantidad</th>
                      <th style={{ padding: 6 }}>Precio</th>
                      <th style={{ padding: 6 }}>Total parcial</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detalles.map((item, idx) => (
                      <tr key={idx}>
                        <td style={{ padding: 6 }}>{item.nombre_producto || item.id_producto}</td>
                        <td style={{ padding: 6 }}>{item.cantidad_detalle_venta}</td>
                        <td style={{ padding: 6 }}>${Number(item.precio_unitario_detalle_venta).toFixed(2)}</td>
                        <td style={{ padding: 6 }}>${Number(item.subtotal_detalle_venta).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p style={{ marginTop: 16 }}><b>Total:</b> ${pedidoSeleccionado.total || 0}</p>
                {/* Estado de pago y dirección de envío */}
                {pago && (
                  <div style={{ marginTop: 12 }}>
                    <p><b>Método de pago:</b> {pago.metodo_pago}</p>
                    <p><b>Estado del pago:</b> {pago.estado_pago}</p>
                    <p><b>Referencia:</b> {pago.referencia}</p>
                    <p><b>Banco Emisor:</b> {pago.banco_emisor}</p>
                  </div>
                )}
                {envio && (
                  <div style={{ marginTop: 12 }}>
                    <p><b>Dirección de envío:</b> {envio.direccion_entrega_envio}</p>
                    <p><b>Estado del envío:</b> {envio.estado_envio}</p>
                    <p><b>Fecha estimada de envío:</b> {envio.fecha_estimada_envio ? new Date(envio.fecha_estimada_envio).toLocaleDateString() : ''}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MisPedidos;