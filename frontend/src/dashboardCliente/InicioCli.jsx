import React, { useState, useEffect } from 'react';
import './InicioCli.css';
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";

const InicioCli = () => {
    const [productos, setProductos] = useState([]);
    const navigate = useNavigate(); // Asegúrate de inicializar useNavigate

    // Simulación de datos o puedes reemplazar con una llamada a tu API
    useEffect(() => {
        setProductos([
            { id: 1, nombre: 'Aire Inverter', precio: 25000, stock: 10, imagen: 'https://metalgas.com.do/wp-content/uploads/2023/02/Aire-inverter-12000-BTU-eficiencia-21-e1653145649812.jpg' },
            { id: 2, nombre: 'Refrigerador Samsung', precio: 45000, stock: 5, imagen: 'https://via.placeholder.com/150' },
            { id: 3, nombre: 'Estufa LG', precio: 15000, stock: 8, imagen: 'https://via.placeholder.com/150' },
            { id: 4, nombre: 'Microondas Panasonic', precio: 8000, stock: 12, imagen: 'https://via.placeholder.com/150' },
            { id: 5, nombre: 'Lavadora Whirlpool', precio: 30000, stock: 3, imagen: 'https://via.placeholder.com/150' },
        ]);
    }, []);

    return (
        <div className="dashboard-container">
            {/* Barra lateral */}
            <aside className="sidebar">
                <h2>Menú</h2>
                <ul>
                    <li>Inicio</li>
                    <li>Productos</li>
                    <li>Ventas</li>
                    <li>Perfil</li>
                    <div className="sidebar-footer">
                        <button onClick={() => navigate('/Bienvenido')} className="exit-btn">
                            <FaSignOutAlt className="exit-icon" />
                            <span>Cerrar Sesión</span>
                        </button>
                    </div>
                </ul>
            </aside>

            {/* Contenido principal */}
            <main className="main-content">
                <header className="dashboard-header">
                    <h1>Productos Disponibles</h1>
                </header>

                <section className="product-grid">
                    {productos.map((producto) => (
                        <div key={producto.id} className="product-card">
                            <img src={producto.imagen} alt={producto.nombre} className="product-image" />
                            <h3 className="product-name">{producto.nombre}</h3>
                            <p className="product-price">Precio: ${producto.precio.toLocaleString()}</p>
                            <p className={`product-stock ${producto.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                {producto.stock > 0 ? `Stock: ${producto.stock}` : 'Sin stock'}
                            </p>
                            <button className="buy-button" disabled={producto.stock === 0}>
                                Comprar
                            </button>
                        </div>
                    ))}
                </section>
            </main>
        </div>
    );
};

export default InicioCli;