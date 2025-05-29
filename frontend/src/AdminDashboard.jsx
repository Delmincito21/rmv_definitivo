import { useState } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
    FaHome,
    FaBox,
    FaTruck,
    FaUsers,
    FaFileInvoiceDollar,
    FaCashRegister,
    FaMoneyBillWave,
    FaCog,
    FaSignOutAlt
} from "react-icons/fa";
import Swal from 'sweetalert2';
import "./Dashboard.css";

const AdminDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    // Verificar si estamos en la ruta base del dashboard
    const showWelcome = location.pathname === "/admin" || location.pathname === "/admin/";

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
                // Limpiar datos de sesión
                localStorage.removeItem('userData');
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                
                // Redirigir a login y limpiar el historial
                navigate('/loginCliente', { replace: true });
            }
        });
    };

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className={`admin-sidebar ${sidebarOpen ? "open" : "closed"}`}>
                <div className="sidebar-header">
                    <h3>Panel de Administración</h3>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="toggle-btn"
                        aria-label={sidebarOpen ? "Contraer menú" : "Expandir menú"}
                    >
                        {sidebarOpen ? "◄" : "►"}
                    </button>
                </div>

                <nav className="sidebar-nav">
                    <ul>
                        <li>
                            <NavLink to="/admin/inicio" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                <FaHome className="nav-icon" />
                                <span className="nav-text">Inicio</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/ventas" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                <FaCashRegister className="nav-icon" />
                                <span className="nav-text">Ventas</span>
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to="/admin/productos" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                <FaBox className="nav-icon" />
                                <span className="nav-text">Productos</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/clientes" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                <FaUsers className="nav-icon" />
                                <span className="nav-text">Clientes</span>
                            </NavLink>
                        </li>
                        {/* <li>
                            <NavLink to="/admin/factura" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                <FaFileInvoiceDollar className="nav-icon" />
                                <span className="nav-text">Facturas</span>
                            </NavLink>
                        </li> */}
                    </ul>
                </nav>

                <div className="sidebar-footer">
                    <button
                        onClick={handleLogout}
                        className="exit-btn"
                    >
                        <FaSignOutAlt className="icon" />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* Contenido principal */}
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminDashboard;