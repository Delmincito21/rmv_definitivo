import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LogiAdmin.css';
import logo from './imagenes/lgo.png';

const RegistroCliente = () => {
  const [cliente, setCliente] = useState({
    nombre_clientes: '',
    telefono_clientes: '',
    direccion_clientes: '',
    correo_clientes: '',
    nombre_usuario: '',
    pin_usuario: '',
    rol: 'cliente',
    estado: 'activo'
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validación básica
    if (!cliente.pin_usuario || !cliente.nombre_usuario) {
      alert('El usuario y la contraseña son obligatorios');
      return;
    }
    try {
      const response = await fetch('http://localhost:3000/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cliente)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al registrar el cliente');
      }

      alert('Cliente registrado con éxito!');

      const loginResponse = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre_usuario: cliente.nombre_usuario, pin_usuario: cliente.pin_usuario })
      });
      const loginData = await loginResponse.json();

      localStorage.clear();
      localStorage.setItem('userId', String(loginData.id_usuario));
      localStorage.setItem('token', loginData.token);
      localStorage.setItem('userData', JSON.stringify(loginData));

      navigate('/Tienda', { replace: true });
    } catch (error) {
      alert('Error al registrar el cliente: ' + error.message);
    }
  };

  return (
    <div className="login-horizontal enhanced-form">
      {/* Panel izquierdo con logo más grande */}
      <div className="logo-panel enhanced-logo-panel">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo-horizontal enhanced-logo" />
          <h2 className="form-title">REGÍSTRATE COMO CLIENTE</h2>
        </div>
      </div>

      {/* Panel derecho con formulario */}
      <div className="form-panel enhanced-form-panel">
        <div className="form-content">
          <form onSubmit={handleSubmit} className="horizontal-form">
            <div className="enhanced-form-grid">
              <div className="form-row">
                <input
                  type="text"
                  name="nombre_clientes"
                  value={cliente.nombre_clientes}
                  onChange={handleChange}
                  placeholder="Nombre"
                  required
                  maxLength="50"
                  className="input-field"
                />
              </div>
              <div className="form-row">
                <input
                  type="tel"
                  name="telefono_clientes"
                  value={cliente.telefono_clientes}
                  onChange={handleChange}
                  placeholder="Teléfono"
                  required
                  maxLength="12"
                  className="input-field"
                />
              </div>
              <div className="form-row">
                <input
                  type="text"
                  name="direccion_clientes"
                  value={cliente.direccion_clientes}
                  onChange={handleChange}
                  placeholder="Dirección"
                  required
                  className="input-field enhanced-textarea"
                  rows="3"
                />
              </div>
              <div className="form-row">
                <input
                  type="email"
                  name="correo_clientes"
                  value={cliente.correo_clientes}
                  onChange={handleChange}
                  placeholder="Correo electrónico"
                  required
                  className="input-field"
                />
              </div>
              <div className="form-row">
                <input
                  type="text"
                  name="nombre_usuario"
                  value={cliente.nombre_usuario}
                  onChange={handleChange}
                  placeholder="Usuario"
                  required
                  className="input-field"
                />
              </div>
              <div className="form-row">
                <input
                  type="password"
                  name="pin_usuario"
                  value={cliente.pin_usuario}
                  onChange={handleChange}
                  placeholder="Contraseña"
                  required
                  minLength="8"
                  className="input-field"
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-button enhanced-register-button">
                REGISTRARME
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistroCliente;