import React, { useEffect, useState } from 'react';
import './Dashboard.css';

const Clientes = () => {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // useEffect(() => {
    //     setLoading(true);
    //     fetch('/api/clientes')
    //         .then(res => res.json())
    //         .then(data => {
    //             setClientes(data);
    //             setLoading(false);
    //         })
    //         .catch(err => {
    //             setError('No se pudo cargar la lista de clientes');
    //             setLoading(false);
    //         });
    // }, []);

    if (loading) return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Cargando clientes...</p>;
    if (error) return <p style={{ color: 'red', textAlign: 'center', marginTop: '2rem' }}>{error}</p>;

    return (
        <div className="tabla-clientes-container">
            <h2 className="tabla-clientes-titulo">Lista de Clientes</h2>
            <table className="tabla-clientes">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Teléfono</th>
                        <th>Dirección</th>
                        <th>Correo</th>
                    </tr>
                </thead>
                <tbody>
                    {clientes.length === 0 ? (
                        <tr>
                            <td colSpan={5}>
                                No hay clientes registrados
                            </td>
                        </tr>
                    ) : (
                        clientes.map(cliente => (
                            <tr key={cliente.id_clientes}>
                                <td>{cliente.id_clientes}</td>
                                <td>{cliente.nombre_clientes}</td>
                                <td>{cliente.telefono_clientes}</td>
                                <td>{cliente.direccion_clientes}</td>
                                <td>{cliente.correo_clientes}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Clientes;