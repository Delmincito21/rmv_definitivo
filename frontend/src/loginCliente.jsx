import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

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
    // Lógica de autenticación aquí
    console.log('Iniciando sesión:', credenciales);
    // Redirigir al dashboard después del login
    // navigate('/dashboard');
  };

  const irARegistro = () => {
    navigate('/registrate');
  };

  return (
    <div className="login-container">
      <h1>Iniciar Sesión</h1>
      
      <form onSubmit={handleSubmit} className="login-form">
        <div className="input-group">
          <label htmlFor="usuario">Usuario</label>
          <input
            type="text"
            id="usuario"
            name="usuario"
            value={credenciales.usuario}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="contraseña">Contraseña</label>
          <input
            type="password"
            id="contraseña"
            name="contraseña"
            value={credenciales.contraseña}
            onChange={handleChange}
            required
          />
        </div>

        <div className="separator"></div>

        <button type="submit" className="login-button">Entrar</button>
      </form>

      <p className="register-link">
        ¿No tienes cuenta? <span onClick={irARegistro}>Regístrate</span>
      </p>
    </div>
  );
};

export default LoginCliente;