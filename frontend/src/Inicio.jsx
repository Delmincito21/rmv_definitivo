import React, { useState, useEffect } from 'react';
import { FiTruck, FiPackage, FiDollarSign, FiUser, FiShoppingBag, FiCalendar, FiCheck, FiAward } from 'react-icons/fi';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import './inicio.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Inicio = () => {
    const [stats, setStats] = useState({
        clientesActivos: 0,
        pedidosMes: 0,
        ingresosMes: 0
    });
    const [proximosEnvios, setProximosEnvios] = useState([]);
    const [productosMasVendidos, setProductosMasVendidos] = useState([]);
    const [pedidosPorMes, setPedidosPorMes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Cargar estadísticas
            const statsResponse = await fetch('http://localhost:3000/dashboard/stats');
            if (!statsResponse.ok) {
                throw new Error('Error al cargar estadísticas');
            }
            const statsData = await statsResponse.json();
            setStats(statsData);

            // Cargar próximos envíos
            const enviosResponse = await fetch('http://localhost:3000/dashboard/proximos-envios');
            if (!enviosResponse.ok) {
                throw new Error('Error al cargar próximos envíos');
            }
            const enviosData = await enviosResponse.json();
            setProximosEnvios(enviosData);

            // Cargar productos más vendidos
            const productosResponse = await fetch('http://localhost:3000/dashboard/productos-mas-vendidos');
            if (!productosResponse.ok) {
                throw new Error('Error al cargar productos más vendidos');
            }
            const productosData = await productosResponse.json();
            setProductosMasVendidos(productosData);

            // Cargar pedidos por mes
            const pedidosResponse = await fetch('http://localhost:3000/dashboard/pedidos-por-mes');
            if (!pedidosResponse.ok) {
                throw new Error('Error al cargar pedidos por mes');
            }
            const pedidosData = await pedidosResponse.json();
            setPedidosPorMes(pedidosData);

            setLoading(false);
        } catch (err) {
            console.error('Error:', err);
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const confirmarEntrega = async (idEnvio) => {
        try {
            const response = await fetch(`http://localhost:3000/envios/${idEnvio}/estado`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ estado_envio: 'entregado' })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al actualizar el estado del envío');
            }

            // Actualizar la lista de próximos envíos
            setProximosEnvios(prevEnvios => 
                prevEnvios.filter(envio => envio.id_envio !== idEnvio)
            );
        } catch (error) {
            console.error('Error al confirmar entrega:', error);
            alert(error.message);
        }
    };

    if (loading) {
        return <div className="loading-container">Cargando datos...</div>;
    }

    if (error) {
        return (
            <div className="error-container">
                <p>Error: {error}</p>
                <button onClick={fetchData}>
                    Intentar de nuevo
                </button>
            </div>
        );
    }

    return (
        <div className="inicio-container">
            {/* Encabezado */}
            <div className="inicio-header">
                <h1>Bienvenido a la aplicación de Refrigeración</h1>
                <p>Sistema de gestión de ventas y envíos</p>
            </div>

            {/* Métricas principales */}
            <div className="metricas-container">
                <div className="metrica-card">
                    <FiUser className="metrica-icon" />
                    <h3>Clientes activos</h3>
                    <p>{stats.clientesActivos}</p>
                </div>

                <div className="metrica-card">
                    <FiShoppingBag className="metrica-icon" />
                    <h3>Pedidos/mes</h3>
                    <p>{stats.pedidosMes}</p>
                </div>

                <div className="metrica-card">
                    <FiDollarSign className="metrica-icon" />
                    <h3>Ingresos mensuales</h3>
                    <p>${stats.ingresosMes?.toLocaleString()}</p>
                </div>
            </div>

            {/* Gráfica de pedidos por mes */}
            <div className="grafica-container">
                <h2><FiPackage /> Pedidos por Mes</h2>
                <div className="grafica-wrapper">
                    <Bar
                        data={{
                            labels: pedidosPorMes.map(item => item.mes_espanol),
                            datasets: [
                                {
                                    label: 'Total de Pedidos',
                                    data: pedidosPorMes.map(item => item.total_pedidos),
                                    backgroundColor: '#3B82F6',
                                    borderRadius: 5,
                                }
                            ]
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'top',
                                    labels: {
                                        font: {
                                            size: 12
                                        }
                                    }
                                },
                                title: {
                                    display: false
                                }
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        stepSize: 1
                                    }
                                }
                            }
                        }}
                    />
                </div>
            </div>

            {/* Productos más vendidos */}
            <div className="productos-container">
                <h2><FiAward /> Productos más vendidos</h2>
                <div className="productos-list">
                    {productosMasVendidos.map((producto, index) => (
                        <div key={producto.id_producto} className="producto-item">
                            <div className="producto-rank">{index + 1}</div>
                            <div className="producto-info">
                                <h3>{producto.nombre_producto}</h3>
                                <p>{producto.cantidad_vendida} unidades vendidas</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Próximos Envíos */}
            <div className="proximos-envios-container">
                <h2><FiTruck /> Próximos Envíos del Día</h2>
                <div className="envios-grid">
                    {proximosEnvios.length > 0 ? (
                        proximosEnvios.map((envio) => (
                            <div key={envio.id_envio.toString()} className="envio-card">
                                <div className="envio-info">
                                    <h3>{envio.cliente}</h3>
                                    <p><strong>Dirección:</strong> {envio.direccion}</p>
                                    <p><strong>Entrega:</strong> {envio.entrega_completa}</p>
                                </div>
                                <button 
                                    className="confirmar-btn"
                                    onClick={() => confirmarEntrega(envio.id_envio)}
                                >
                                    <FiCheck /> Confirmar Entrega
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="no-envios">No hay envíos programados para hoy</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Inicio;