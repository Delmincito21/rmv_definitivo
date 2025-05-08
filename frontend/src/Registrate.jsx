import { useState } from 'react';
import './LogiAdmin.css';
import logo from './imagenes/lgo.png';

const RegistroCliente = () => {
  const [cliente, setCliente] = useState({
    nombre_cliente: '',
    apellido_cliente: '',
    cedula_cliente: '',
    telefono_cliente: '',
    direccion_cliente: '',
    contrasena: '',
    confirmar_contrasena: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cliente.contrasena !== cliente.confirmar_contrasena) {
      alert('Las contraseñas no coinciden');
      return;
    }
    console.log('Cliente registrado:', cliente);
    alert('Cliente registrado con éxito!');
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
                  name="nombre_cliente"
                  value={cliente.nombre_cliente}
                  onChange={handleChange}
                  placeholder="Nombre"
                  required
                  maxLength="50"
                  className="input-field"
                />
              </div>

              <div className="form-row">
                <input
                  type="text"
                  name="apellido_cliente"
                  value={cliente.apellido_cliente}
                  onChange={handleChange}
                  placeholder="Apellido"
                  required
                  maxLength="50"
                  className="input-field"
                />
              </div>

              <div className="form-row">
                <input
                  type="text"
                  name="cedula_cliente"
                  value={cliente.cedula_cliente}
                  onChange={handleChange}
                  placeholder="Cédula (13 dígitos)"
                  required
                  pattern="[0-9]{13}"
                  title="La cédula debe tener 13 dígitos"
                  maxLength="13"
                  className="input-field"
                />
              </div>

              <div className="form-row">
                <input
                  type="tel"
                  name="telefono_cliente"
                  value={cliente.telefono_cliente}
                  onChange={handleChange}
                  placeholder="Teléfono (12 dígitos)"
                  required
                  pattern="[0-9]{12}"
                  title="El teléfono debe tener 12 dígitos"
                  maxLength="12"
                  className="input-field"
                />
              </div>

              <div className="form-row">
                <input
                  type="text"
                  name="direccion_cliente"
                  value={cliente.direccion_cliente}
                  onChange={handleChange}
                  placeholder="Dirección"
                  required
                  className="input-field enhanced-textarea"
                  rows="3"
                />
              </div>

              <div className="form-row">
                <input
                  type="password"
                  name="contrasena"
                  value={cliente.contrasena}
                  onChange={handleChange}
                  placeholder="Contraseña"
                  required
                  minLength="8"
                  className="input-field"
                />
              </div>

              <div className="form-row">
                <input
                  type="password"
                  name="confirmar_contrasena"
                  value={cliente.confirmar_contrasena}
                  onChange={handleChange}
                  placeholder="Confirmar Contraseña"
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