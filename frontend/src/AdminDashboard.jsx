import { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import {
    FaHome,
    FaBox,
    FaTruck,
    FaUsers,
    FaFileInvoiceDollar,
    FaCashRegister,
    FaMoneyBillWave,
    FaCog
} from "react-icons/fa";
import "./Dashboard.css";

const AdminDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();

    // Verificar si estamos en la ruta base del dashboard
    const showWelcome = location.pathname === "/admin" || location.pathname === "/admin/";

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className={`admin-sidebar ${sidebarOpen ? "open" : "closed"}`}>
                <div className="sidebar-header">
                    <h2>Panel de Administración</h2>
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
                            <NavLink to="/Inicio" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                <FaHome className="nav-icon" />
                                <span className="nav-text">Inicio</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/Ventas" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                <FaCashRegister className="nav-icon" />
                                <span className="nav-text">Ventas</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/Pago" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                <FaMoneyBillWave className="nav-icon" />
                                <span className="nav-text">Pagos</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/ProductAdmi" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                <FaBox className="nav-icon" />
                                <span className="nav-text">Productos</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/Clientes" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                <FaUsers className="nav-icon" />
                                <span className="nav-text">Clientes</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/Factura" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                <FaFileInvoiceDollar className="nav-icon" />
                                <span className="nav-text">Facturas</span>
                            </NavLink>
                        </li>
                    </ul>
                </nav>

                <div className="sidebar-footer">
                    <NavLink to="/admin/config" className={({ isActive }) => isActive ? "config-link active" : "config-link"}>
                        <FaCog className="icon" />
                        <span>Configuración</span>
                    </NavLink>
                </div>
            </aside>

            {/* Contenido principal */}
            <main className="main-content">
                {showWelcome ? (
                    <div className="welcome-message">
                        <h1>¡Bienvenido al Sistema de Gestión!</h1>
                        <p>Panel completo de administración para RefriElectric Martín Vásquez SRL</p>

                        <div className="welcome-features">
                            <div className="feature-card">
                                <FaCashRegister className="feature-icon" />
                                <h3>Ventas</h3>
                                <p>Registro y seguimiento de transacciones comerciales</p>
                            </div>
                            <div className="feature-card">
                                <FaMoneyBillWave className="feature-icon" />
                                <h3>Pagos</h3>
                                <p>Administración de cobros y pagos</p>
                            </div>
                            <div className="feature-card">
                                <FaUsers className="feature-icon" />
                                <h3>Clientes</h3>
                                <p>Gestión de tu base de clientes</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Outlet />
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;