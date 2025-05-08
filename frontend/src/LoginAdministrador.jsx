import React, { useState } from 'react';
import './LogiAdmin.css';
import logo from './imagenes/lgo.png';

const LoginAdministrador = () => {
    const [credentials, setCredentials] = useState({
        usuario: '',
        contrasena: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Credenciales:', credentials);
    };

    return (
        <div className="login-horizontal">
            {/* Panel izquierdo con logo */}
            <div className="logo-panel">
                <img src={logo} alt="Logo" className="logo-horizontal" />
            </div>

            {/* Panel derecho con formulario */}
            <div className="form-panel">
                <h2 className="form-title">INICIAR SESIÓN</h2>

                <form onSubmit={handleSubmit} className="horizontal-form">
                    <div className="form-row">
                        <label>Usuario</label>
                        <input
                            type="text"
                            name="usuario"
                            value={credentials.usuario}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <label>Contraseña</label>
                        <input
                            type="password"
                            name="contrasena"
                            value={credentials.contrasena}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="submit-button">
                            ENTRAR
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginAdministrador;