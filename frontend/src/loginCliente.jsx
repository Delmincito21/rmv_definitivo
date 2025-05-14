import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LogiAdmin.css';
import logo from './imagenes/lgo.png';

const LoginCliente = () => {
  const [credenciales, setCredenciales] = useState({
    usuario: '',
    contraseña: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredenciales(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpiar errores previos

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre_usuario: credenciales.usuario, pin_usuario: credenciales.contraseña })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al iniciar sesión');
      }

      const data = await response.json();
      if (data.rol === 'admin') {
        navigate('/AdminDashboard');
      } else {
        navigate('/InicioCli');
      }
    } catch (error) {
      setError('Error al iniciar sesión: ' + error.message);
    }
  };

  const irARegistro = () => {
    navigate('/registrate');
  };

  return (
    <div className="login-horizontal">
      {/* Panel izquierdo con logo */}
      <div className="logo-panel">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo-horizontal" />
        </div>
      </div>

      {/* Panel derecho con formulario */}
      <div className="form-panel">
        <div className="form-content">
          <h2 className="form-title">INICIAR SESIÓN</h2>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="horizontal-form">
            <div className="form-row">
              <input
                type="text"
                name="usuario"
                value={credenciales.usuario}
                onChange={handleChange}
                placeholder="Usuario"
                required
                className="input-field"
              />
            </div>

            <div className="form-row">
              <input
                type="password"
                name="contraseña"
                value={credenciales.contraseña}
                onChange={handleChange}
                placeholder="Contraseña"
                required
                className="input-field"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-button">
                ENTRAR
              </button>
              <div className="register-link">
                ¿No tienes cuenta? <span onClick={irARegistro} className="register-anchor">REGÍSTRATE</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginCliente;