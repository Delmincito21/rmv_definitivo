import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from 'react-router-dom';
import { FaUserCircle, FaShoppingCart, FaHome, FaSignOutAlt, FaShoppingBag, FaUser, FaPhone, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';
import { FaShop } from "react-icons/fa6";
import Swal from 'sweetalert2';
import './Tienda.css';

const EditarPerfil = () => {
    const [cliente, setCliente] = useState({
        nombre_clientes: '',
        telefono_clientes: '',
        direccion_clientes: '',
        correo_clientes: '',
        rol: 'cliente',
        estado: 'activo'
    });
    const [loading, setLoading] = useState(true);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [passwordData, setPasswordData] = useState({
        actual: '',
        nueva: '',
        confirmar: ''
    });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            navigate('/loginCliente');
            return;
        }
        fetch(`https://backend-production-6925.up.railway.app/usuario/${userId}`)
            .then(res => res.json())
            .then(data => {
                setCliente({
                    nombre_clientes: data.nombre_clientes || '',
                    telefono_clientes: data.telefono_clientes || '',
                    direccion_clientes: data.direccion_clientes || '',
                    correo_clientes: data.correo_clientes || '',
                    rol: 'cliente',
                    estado: 'activo'
                });
                setUserInfo(data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCliente(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handleDeleteAccount = async () => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción cambiará tu estado a 'inactivo' y no podrás iniciar sesión hasta que un administrador reactive tu cuenta.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, eliminar cuenta',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                console.log('userInfo:', userInfo);
                if (!userInfo || !userInfo.id_clientes) {
                    throw new Error('ID del cliente no encontrado');
                }
                const response = await fetch(`https://backend-production-6925.up.railway.app/clientes/${userInfo.id_clientes}/estado`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        estado: 'inactivo'
                    })
                });

                if (!response.ok) {
                    throw new Error('Error al eliminar la cuenta');
                }

                // Log out the user after account is deactivated
                localStorage.removeItem('userId');
                navigate('/loginCliente');
                Swal.fire(
                    'Cuenta eliminada',
                    'Tu cuenta ha sido desactivada. Para reactivarla, contacta a un administrador.',
                    'success'
                );
            } catch (error) {
                Swal.fire(
                    'Error',
                    'Hubo un error al eliminar la cuenta. Por favor, intenta de nuevo.',
                    'error'
                );
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');
        const clienteId = userInfo.id_clientes;
        // 1. Si el usuario quiere cambiar la contraseña
        if (passwordData.nueva || passwordData.confirmar || passwordData.actual) {
            if (!passwordData.actual || !passwordData.nueva || !passwordData.confirmar) {
                setPasswordError('Completa todos los campos de contraseña.');
                return;
            }
            if (passwordData.nueva !== passwordData.confirmar) {
                setPasswordError('Las nuevas contraseñas no coinciden.');
                return;
            }
            // Petición aparte para cambiar contraseña
            try {
                const res = await fetch('https://backend-production-6925.up.railway.app/cambiar-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id_usuario: userInfo.id_usuario,
                        actual: passwordData.actual,
                        nueva: passwordData.nueva
                    })
                });
                const data = await res.json();
                if (!res.ok) {
                    setPasswordError(data.error || 'Error al cambiar la contraseña');
                    return;
                }
                setPasswordSuccess('¡Contraseña cambiada con éxito!');
                setPasswordData({ actual: '', nueva: '', confirmar: '' });
            } catch (err) {
                setPasswordError('Error de red al cambiar la contraseña');
                return;
            }
        }
        // 2. Actualizar datos personales
        try {
            const response = await fetch(`https://backend-production-6925.up.railway.app/clientes/${clienteId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cliente)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al actualizar el perfil');
            }
            alert('Perfil actualizado con éxito!');
            navigate('/Tienda');
        } catch (error) {
            alert('Error al actualizar el perfil: ' + error.message);
        }
    };

    const handleLogout = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¿Deseas cerrar sesión?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, cerrar sesión',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('userId');
                localStorage.removeItem('token');
                navigate('/loginCliente', { replace: true });
            }
        });
    };

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: 40 }}>Cargando datos...</div>;
    }

    return (
        <div className="dashboard-container">
            <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-content">
                    <div className="sidebar-header">
                        <h2 className="menu-title">Menú</h2>
                        <span
                            className={`collapse-arrow ${isCollapsed ? 'rotated' : ''}`}
                            onClick={toggleSidebar}
                        >

                        </span>
                    </div>
                    {userInfo && (
                        <div className="user-info">
                            <div
                                className="user-avatar"
                                style={{ cursor: "pointer" }}
                                onClick={() => navigate("/editar-perfil")}
                            >
                                <FaUser size={40} />
                            </div>
                            <h3 className="username">{userInfo.nombre_clientes}</h3>
                            <p className="user-email">{userInfo.correo_clientes}</p>
                        </div>
                    )}
                    <ul className="menu-items">
                        {/* <li>
                            <NavLink to="/iniciocli" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                <FaHome className="nav-icon" />
                                <span className="nav-text">Inicio</span>
                            </NavLink>
                        </li> */}
                        <li>
                            <NavLink to="/Tienda" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                <FaShop className="nav-icon" />
                                <span className="nav-text">Tienda</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/Carrito" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                <FaShoppingCart className="nav-icon" />
                                <span className="nav-text">Carrito</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/MisPedidos" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                <FaShoppingBag className="nav-icon" />
                                <span className="nav-text">Mis pedidos</span>
                            </NavLink>
                        </li>
                    </ul>
                    <div className="sidebar-footer">
                        <button onClick={handleLogout} className="exit-btn">
                            <FaSignOutAlt className="exit-icon" />
                            <span>Cerrar Sesión</span>
                        </button>
                    </div>
                </div>
            </aside>
            <div className="main-content">
                <div className="editar-perfil-horizontal" style={{ justifyContent: 'center' }}>
                    <form
                        onSubmit={handleSubmit}
                        className="editar-perfil-form"
                    >
                        <h2>Editar perfil</h2>
                        <div className="editar-perfil-form-fields">
                            <div className="editar-perfil-form-col">
                                <div className="input-group">
                                    <FaUser className="input-icon" />
                                    <input
                                        type="text"
                                        name="nombre_clientes"
                                        value={cliente.nombre_clientes}
                                        placeholder="Nombre"
                                        required
                                        maxLength="50"
                                        disabled
                                    />
                                </div>
                                <div className="input-group">
                                    <FaPhone className="input-icon" />
                                    <input
                                        type="tel"
                                        name="telefono_clientes"
                                        value={cliente.telefono_clientes}
                                        onChange={handleChange}
                                        placeholder="Teléfono"
                                        required
                                        maxLength="12"
                                    />
                                </div>
                            </div>
                            <div className="editar-perfil-form-col">
                                <div className="input-group">
                                    <FaMapMarkerAlt className="input-icon" />
                                    <input
                                        type="text"
                                        name="direccion_clientes"
                                        value={cliente.direccion_clientes}
                                        onChange={handleChange}
                                        placeholder="Dirección"
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <FaEnvelope className="input-icon" />
                                    <input
                                        type="email"
                                        name="correo_clientes"
                                        value={cliente.correo_clientes}
                                        placeholder="Correo electrónico"
                                        required
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                        <button type="submit">
                            Guardar cambios
                        </button>
                        <div style={{ marginTop: 18 }}>
                            <h3>Cambiar contraseña</h3>
                            <div className="editar-perfil-form-fields">
                                <div className="editar-perfil-form-col">
                                    <div className="input-group">
                                        <FaUser className="input-icon" />
                                        <input
                                            type="password"
                                            name="actual"
                                            value={passwordData.actual}
                                            onChange={handlePasswordChange}
                                            placeholder="Contraseña actual"
                                            autoComplete="current-password"
                                        />
                                    </div>
                                </div>
                                <div className="editar-perfil-form-col">
                                    <div className="input-group">
                                        <FaUser className="input-icon" />
                                        <input
                                            type="password"
                                            name="nueva"
                                            value={passwordData.nueva}
                                            onChange={handlePasswordChange}
                                            placeholder="Nueva contraseña"
                                            autoComplete="new-password"
                                        />
                                    </div>
                                    <div className="input-group">
                                        <FaUser className="input-icon" />
                                        <input
                                            type="password"
                                            name="confirmar"
                                            value={passwordData.confirmar}
                                            onChange={handlePasswordChange}
                                            placeholder="Confirmar nueva contraseña"
                                            autoComplete="new-password"
                                        />
                                    </div>
                                </div>
                            </div>
                            {passwordError && <div style={{ color: 'red', marginTop: 8 }}>{passwordError}</div>}
                            {passwordSuccess && <div style={{ color: 'green', marginTop: 8 }}>{passwordSuccess}</div>}
                        </div>
                        <div className="delete-account-section" style={{ marginTop: 24 }}>
                            <button 
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleDeleteAccount();
                                }}
                                className="delete-account-btn"
                                style={{
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    marginTop: 8
                                }}
                            >
                                Eliminar cuenta
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditarPerfil;
