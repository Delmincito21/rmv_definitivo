import React, { useState } from 'react';
import { FiTruck, FiPackage, FiDollarSign, FiUser, FiShoppingBag, FiCalendar } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './inicio.css';

const Inicio = () => {
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Datos de ejemplo
    const stats = {
        clientesActivos: 287,
        pedidosMes: 156,
        ingresosMes: 68450,
        enviosPendientes: 2
    };

    const proximosEnvios = [
        {
            producto: "AA Industrial 10 Ton",
            cliente: "Fábrica Helados Polar",
            direccion: "Av. Industrial 2345",
            fecha: "16/05/23 - 10:00 AM"
        },
        {
            producto: "Nevera Vertical 500L",
            cliente: "Carnicería Don José",
            direccion: "Calle Comercio 123",
            fecha: "17/05/23 - 02:00 PM"
        }
    ];

    const productosMasVendidos = [
        {
            nombre: "Aire acondicionado split AA de 18.000 BTU Inverter",
            cantidad: 45
        },
        {
            nombre: "Nevera Exhibidora 3 Puertas",
            cantidad: 32
        },
        {
            nombre: "AA Portátil 12.000 BTU",
            cantidad: 28
        }
    ];

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
                    <p>${stats.ingresosMes.toLocaleString()}</p>
                </div>
            </div>

            {/* Próximos envíos */}
            <div className="envios-container">
                <h2>Próximos envíos</h2>

                {proximosEnvios.map((envio, index) => (
                    <div key={index} className="envio-card">
                        <FiTruck className="envio-icon" />
                        <div className="envio-info">
                            <h3>{envio.producto}</h3>
                            <p><strong>Cliente:</strong> {envio.cliente} - <strong>Dirección:</strong> {envio.direccion}</p>
                            <p><strong>Entrega:</strong> {envio.fecha}</p>
                        </div>
                        <button className="confirmar-btn">Confirmar</button>
                    </div>
                ))}
            </div>

            {/* Productos más vendidos */}
            <div className="productos-container">
                <h2>Productos más vendidos</h2>

                <ol className="productos-list">
                    {productosMasVendidos.map((producto, index) => (
                        <li key={index} className="producto-item">
                            <span className="producto-rank">{index + 1}</span>
                            <div className="producto-info">
                                <h3>{producto.nombre}</h3>
                                <p>{producto.cantidad} unidades vendidas</p>
                            </div>
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    );
};

export default Inicio;