import React, { useState } from 'react';
import { FiUser, FiPhone, FiMail, FiMapPin, FiSearch, FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';
import './Dashboard.css';

const Clientes = () => {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Datos de ejemplo
    const exampleClients = [
        {
            id_clientes: 1,
            nombre_clientes: "Juan Pérez",
            telefono_clientes: "555-1234",
            direccion_clientes: "Av. Principal 123",
            correo_clientes: "juan@example.com",
            activo: true
        },
        {
            id_clientes: 2,
            nombre_clientes: "María García",
            telefono_clientes: "555-5678",
            direccion_clientes: "Calle Secundaria 456",
            correo_clientes: "maria@example.com",
            activo: true
        }
    ];

    // useEffect para cargar datos reales (descomentar cuando esté listo)
    /*useEffect(() => {
        setLoading(true);
        fetch('/api/clientes')
            .then(res => res.json())
            .then(data => {
                setClientes(data);
                setLoading(false);
            })
            .catch(err => {
                setError('No se pudo cargar la lista de clientes');
                setLoading(false);
            });
    }, []);*/

    // Usar datos de ejemplo mientras
    useState(() => {
        setClientes(exampleClients);
    }, []);

    const filteredClientes = clientes.filter(cliente =>
        cliente.nombre_clientes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.correo_clientes.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="loading-container">
            <div className="spinner"></div>
            <p>Cargando clientes...</p>
        </div>
    );

    if (error) return (
        <div className="error-container">
            <p className="error-message">{error}</p>
            <button className="retry-button" onClick={() => window.location.reload()}>Reintentar</button>
        </div>
    );

    return (
        <div className="clientes-content">
            {/* Header */}
            <div className="dashboard-header">
                <h1 className="page-title">
                    <FiUser className="title-icon" />
                    Gestión de Clientes
                </h1>
                <div className="header-actions">
                    <div className="search-bar">
                        <FiSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar clientes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="add-button">
                        <FiEye /> Ver Clientes
                    </button>
                </div>
            </div>

            {/* Estadísticas rápidas */}
            <div className="stats-cards">
                <div className="stat-card">
                    <h3>Total Clientes</h3>
                    <p>{clientes.length}</p>
                </div>
                <div className="stat-card">
                    <h3>Clientes Activos</h3>
                    <p>{clientes.filter(c => c.activo).length}</p>
                </div>
                <div className="stat-card">
                    <h3>Nuevos este mes</h3>
                    <p>12</p>
                </div>
            </div>

            {/* Tabla de clientes */}
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Teléfono</th>
                            <th>Dirección</th>
                            <th>Correo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClientes.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="empty-data">
                                    {searchTerm ?
                                        "No se encontraron clientes con ese criterio" :
                                        "No hay clientes registrados"}
                                </td>
                            </tr>
                        ) : (
                            filteredClientes.map(cliente => (
                                <tr key={cliente.id_clientes}>
                                    <td className="id-cell">#{cliente.id_clientes}</td>
                                    <td>
                                        <div className="client-name">
                                            <div className="avatar">
                                                {cliente.nombre_clientes.charAt(0)}
                                            </div>
                                            {cliente.nombre_clientes}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="contact-info">
                                            <FiPhone className="info-icon" />
                                            {cliente.telefono_clientes || 'N/A'}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="contact-info">
                                            <FiMapPin className="info-icon" />
                                            {cliente.direccion_clientes || 'N/A'}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="contact-info">
                                            <FiMail className="info-icon" />
                                            {cliente.correo_clientes}
                                        </div>
                                    </td>
                                    <td className="actions-cell">
                                        <button className="action-button edit">
                                            <FiEdit /> Editar
                                        </button>
                                        <button className="action-button delete">
                                            <FiTrash2 /> Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Clientes;