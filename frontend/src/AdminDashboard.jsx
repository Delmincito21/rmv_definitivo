import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { FaBox, FaTruck, FaCog } from "react-icons/fa";
import "./Dashboard.css";

const AdminDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="dashboard-container">
            {/* Sidebar izquierdo */}
            <div className={`admin-sidebar ${sidebarOpen ? "open" : "closed"}`}>
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
                            <NavLink
                                to="/admin/productos"
                                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                            >
                                <FaBox className="nav-icon" />
                                {sidebarOpen && <span className="nav-text">Productos</span>}
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/admin/suplidores"
                                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                            >
                                <FaTruck className="nav-icon" />
                                {sidebarOpen && <span className="nav-text">Suplidores</span>}
                            </NavLink>
                        </li>
                    </ul>
                </nav>

                <div className="sidebar-footer">
                    <NavLink
                        to="/admin/config"
                        className={({ isActive }) => isActive ? "config-link active" : "config-link"}
                    >
                        <FaCog className="icon" />
                        {sidebarOpen && <span>Configuración</span>}
                    </NavLink>
                </div>
            </div>

            {/* Contenido principal - Ocupa todo el espacio restante */}
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminDashboard;