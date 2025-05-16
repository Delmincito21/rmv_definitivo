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
import "./Dashboard.css";

const ClienteDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    // Verificar si estamos en la ruta base del dashboard
    const showWelcome = location.pathname === "/clidash" || location.pathname === "/clidash/";

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className={`admin-sidebar ${sidebarOpen ? "open" : "closed"}`}>
                <div className="sidebar-header">
                    <h3>Panel del Cliente</h3>
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
                            <NavLink to="/Tienda" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                <FaHome className="nav-icon" />
                                <span className="nav-text">Tienda</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/Ventas" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                <FaCashRegister className="nav-icon" />
                                <span className="nav-text">Ventas</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/Carrito" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                <FaMoneyBillWave className="nav-icon" />
                                <span className="nav-text">Pagos</span>
                            </NavLink>
                        </li>
                    </ul>
                </nav>

                <div className="sidebar-footer">
                    <button
                        onClick={() => navigate('/Bienvenido')} // Redirige a la página de Bienvenido
                        className="exit-btn"
                    >
                        <FaSignOutAlt className="icon" />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* Contenido principal */}
            <main className="main-content">
                {showWelcome ? (
                    <div className="welcome-message">
                        <h1>RefriElectic Martin Vasquezb SRL</h1>
                        <p>Panel completo de los clientes de RefriElectric Martín Vásquez SRL</p>

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

export default ClienteDashboard;