import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LogiAdmin.css'; // Asegúrate de usar el mismo archivo CSS
import logo from './imagenes/lgo.png'; // Asegúrate de tener la ruta correcta

const LoginCliente = () => {
  const [credenciales, setCredenciales] = useState({
    usuario: '',
    contraseña: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredenciales(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Iniciando sesión:', credenciales);
    // navigate('/dashboard');
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