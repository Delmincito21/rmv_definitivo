import React from 'react';
import './Dashboard.css';

const Clientes = () => {
    // Datos del cliente (persona)
    const cliente = {
        nombre: "María González",
        direccion: "Calle Flores #123, Col. Jardines",
        telefono: "555-123-4567",
        email: "maria.g@email.com",
        antiguedad: "Cliente desde 10/2021"
    };

    // Equipos instalados en el hogar
    const equipos = [
        {
            id: 1,
            tipo: "Aire Acondicionado",
            modelo: "FrigidHome FH-3000",
            ubicacion: "Sala principal",
            instalacion: "15/05/2022",
            garantia: "Vence 15/05/2024"
        },
        {
            id: 2,
            tipo: "Refrigerador",
            modelo: "CoolMaster CM-450",
            ubicacion: "Cocina",
            instalacion: "22/01/2021",
            garantia: "Vencida"
        }
    ];

    // Mantenimientos y alertas
    const mantenimientos = [
        {
            tipo: "Limpieza de filtros",
            equipo: "Aire Acondicionado",
            frecuencia: "Cada 3 meses",
            proximo: "15/08/2023"
        },
        {
            tipo: "Revisión de gas",
            equipo: "Refrigerador",
            frecuencia: "Anual",
            proximo: "22/01/2024"
        }
    ];

    const alertas = [
        "Garantía del refrigerador vencida",
        "Limpieza de filtros atrasada"
    ];

    return (
        <div className="dashboard-residencial">
            {/* Encabezado con datos personales */}
            <header className="cliente-header">
                <div className="cliente-foto">
                    <div className="avatar">MG</div>
                </div>
                <div className="cliente-info">
                    <h1>{cliente.nombre}</h1>
                    <div className="cliente-detalle">
                        <p><span>📱</span> {cliente.telefono}</p>
                        <p><span>✉️</span> {cliente.email}</p>
                        <p><span>🏠</span> {cliente.direccion}</p>
                    </div>
                </div>
                <div className="cliente-antiguedad">
                    {cliente.antiguedad}
                </div>
            </header>

            {/* Contenido horizontal */}
            <div className="contenido-horizontal">
                {/* Sección 1: Equipos instalados */}
                <section className="seccion-equipos">
                    <h2>Mis Equipos ({equipos.length})</h2>
                    <div className="tarjetas-equipos">
                        {equipos.map(equipo => (
                            <div key={equipo.id} className={`tarjeta-equipo ${equipo.garantia.includes("Vencida") ? "garantia-vencida" : ""}`}>
                                <h3>{equipo.tipo}</h3>
                                <p><strong>Modelo:</strong> {equipo.modelo}</p>
                                <p><strong>Ubicación:</strong> {equipo.ubicacion}</p>
                                <p><strong>Instalado:</strong> {equipo.instalacion}</p>
                                <p className="garantia">
                                    <strong>Garantía:</strong> {equipo.garantia}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Sección 2: Mantenimientos */}
                <section className="seccion-mantenimientos">
                    <h2>Próximos Mantenimientos</h2>
                    <div className="lista-mantenimientos">
                        {mantenimientos.map((mant, index) => (
                            <div key={index} className="tarjeta-mantenimiento">
                                <div className="mantenimiento-icono">🔧</div>
                                <div className="mantenimiento-info">
                                    <h3>{mant.tipo}</h3>
                                    <p>{mant.equipo}</p>
                                    <p><strong>Próximo:</strong> {mant.proximo}</p>
                                    <p><small>{mant.frecuencia}</small></p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Sección 3: Alertas y acciones */}
                <section className="seccion-alertas">
                    <h2>Mis Alertas</h2>
                    <div className="lista-alertas">
                        {alertas.map((alerta, index) => (
                            <div key={index} className="tarjeta-alerta">
                                <span className="alerta-icono">⚠️</span>
                                <p>{alerta}</p>
                            </div>
                        ))}
                    </div>

                    <h2 className="acciones-titulo">Acciones Rápidas</h2>
                    <div className="acciones-rapidas">
                        <button className="accion-btn solicitar">
                            📅 Solicitar mantenimiento
                        </button>
                        <button className="accion-btn emergencia">
                            🆘 Reportar emergencia
                        </button>
                        <button className="accion-btn consulta">
                            💬 Consultar garantía
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Clientes;