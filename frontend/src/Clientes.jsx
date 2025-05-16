import React, { useState, useEffect } from 'react';
import { FiUser, FiSearch, FiEye, FiPhone, FiMapPin, FiMail, FiEdit, FiTrash2 } from 'react-icons/fi';
import './Dashboard.css';

const Clientes = () => {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [clienteEditando, setClienteEditando] = useState(null);

    // Cargar datos desde el backend
    useEffect(() => {
        fetch('http://localhost:3000/clientes')
            .then(res => res.json())
            .then(data => {
                console.log('Datos recibidos del backend:', data); // Verifica los datos aquí
                setClientes(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error al cargar clientes:', err);
                setError('No se pudo cargar la lista de clientes');
                setLoading(false);
            });
    }, []);

    // Filtrar clientes por término de búsqueda
    const filteredClientes = clientes.filter(cliente =>
        cliente.nombre_clientes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.correo_clientes.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filtrar clientes activos para el card
    const activeClientes = clientes.filter(cliente => cliente.estado === 'activo');

    const handleGuardarEdicionCliente = async () => {
        try {
            const response = await fetch(`http://localhost:3000/clientes/${clienteEditando.id_clientes}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(clienteEditando),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el cliente');
            }

            alert('Cliente actualizado exitosamente');

            // Actualiza la lista de clientes en el frontend
            setClientes((prevClientes) =>
                prevClientes.map((cliente) =>
                    cliente.id_clientes === clienteEditando.id_clientes ? clienteEditando : cliente
                )
            );

            // Salir del modo de edición
            setClienteEditando(null);
        } catch (error) {
            console.error('Error al actualizar el cliente:', error);
            alert('Hubo un error al actualizar el cliente. Inténtalo de nuevo.');
        }
    };

    const handleEliminarCliente = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas inactivar este cliente?')) {
            try {
                const response = await fetch(`http://localhost:3000/clientes/${id}/inactivar`, {
                    method: 'PUT',
                });

                if (!response.ok) {
                    throw new Error('Error al inactivar el cliente');
                }

                alert('Cliente inactivado exitosamente');

                // Actualiza la lista de clientes en el frontend
                setClientes((prevClientes) =>
                    prevClientes.map((cliente) =>
                        cliente.id_clientes === id ? { ...cliente, estado: 'inactivo' } : cliente
                    )
                );
            } catch (error) {
                console.error('Error al inactivar el cliente:', error);
                alert('Hubo un error al inactivar el cliente. Inténtalo de nuevo.');
            }
        }
    };

    const handleEditarCliente = (cliente) => {
        setClienteEditando(cliente);
    };

    if (loading) return <p>Cargando clientes...</p>;
    if (error) return <p>{error}</p>;

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
                    <p>{activeClientes.length}</p>
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
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClientes.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="empty-data">
                                    {searchTerm
                                        ? "No se encontraron clientes con ese criterio"
                                        : "No hay clientes registrados"}
                                </td>
                            </tr>
                        ) : (
                            filteredClientes.map(cliente => (
                                <tr key={cliente.id_clientes}>
                                    <td className="id-cell">#{cliente.id_clientes}</td>
                                    <td>{cliente.nombre_clientes}</td>
                                    <td>{cliente.telefono_clientes || 'N/A'}</td>
                                    <td>{cliente.direccion_clientes || 'N/A'}</td>
                                    <td>{cliente.correo_clientes}</td>
                                    <td>
                                        <span className={`status-badge ${cliente.estado === 'activo' ? 'active' : 'inactive'}`}>
                                            {cliente.estado === 'activo' ? 'activo' : 'inactivo'}
                                        </span>
                                    </td>
                                    <td className="actions-cell">
                                        <button className="action-button edit" onClick={() => handleEditarCliente(cliente)}>
                                            Editar
                                        </button>
                                        <button className="action-button delete" onClick={() => handleEliminarCliente(cliente.id_clientes)}>
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal para editar cliente */}
            {clienteEditando && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Editar Cliente</h3>
                        <form>
                            <label>Nombre:</label>
                            <input
                                type="text"
                                value={clienteEditando.nombre_clientes || ''}
                                onChange={(e) =>
                                    setClienteEditando((prev) => ({ ...prev, nombre_clientes: e.target.value }))
                                }
                            />
                            <label>Teléfono:</label>
                            <input
                                type="text"
                                value={clienteEditando.telefono_clientes || ''}
                                onChange={(e) =>
                                    setClienteEditando((prev) => ({ ...prev, telefono_clientes: e.target.value }))
                                }
                            />
                            <label>Dirección:</label>
                            <input
                                type="text"
                                value={clienteEditando.direccion_clientes || ''}
                                onChange={(e) =>
                                    setClienteEditando((prev) => ({ ...prev, direccion_clientes: e.target.value }))
                                }
                            />
                            <label>Correo:</label>
                            <input
                                type="email"
                                value={clienteEditando.correo_clientes || ''}
                                onChange={(e) =>
                                    setClienteEditando((prev) => ({ ...prev, correo_clientes: e.target.value }))
                                }
                            />
                            <label>Estado:</label>
                            <select
                                value={clienteEditando.estado || ''}
                                onChange={(e) =>
                                    setClienteEditando((prev) => ({ ...prev, estado: e.target.value }))
                                }
                            >
                                <option value="activo">Activo</option>
                                <option value="inactivo">Inactivo</option>
                            </select>
                            <div className="form-actions">
                                <button type="button" onClick={() => setClienteEditando(null)}>
                                    Cancelar
                                </button>
                                <button type="button" onClick={handleGuardarEdicionCliente}>
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Clientes;