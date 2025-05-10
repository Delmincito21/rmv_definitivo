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
      // Simular autenticación (reemplazar con tu lógica real)
      const response = await simulateLogin(credenciales.usuario, credenciales.contraseña);

      if (response.success) {
        // Guardar el token o estado de autenticación
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userRole', 'admin');

        // Redirigir al dashboard de inicio
        navigate('/Inicio');
      } else {
        setError(response.message || 'Credenciales incorrectas');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
      console.error('Error de login:', err);
    }
  };

  // Función de ejemplo para simular autenticación
  const simulateLogin = (usuario, contraseña) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Aquí debes reemplazar con tu lógica real de autenticación
        if (usuario === 'admin' && contraseña === 'admin123') {
          resolve({
            success: true,
            token: 'fake-jwt-token',
            user: { nombre: 'Administrador', rol: 'admin' }
          });
        } else {
          resolve({
            success: false,
            message: 'Usuario o contraseña incorrectos'
          });
        }
      }, 500); // Simular retardo de red
    });
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