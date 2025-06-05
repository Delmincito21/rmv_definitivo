import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LogiAdmin.css';
import logo from './imagenes/lgo.png';

const formatTelefono = (numero) => {
  if (!numero) return '';
  const cleaned = numero.replace(/[^0-9]/g, '');
  if (cleaned.length < 3) return cleaned;
  if (cleaned.length < 6) return `${cleaned.substring(0, 3)}-${cleaned.substring(3)}`;
  return `${cleaned.substring(0, 3)}-${cleaned.substring(3, 6)}-${cleaned.substring(6)}`;
};

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

    // Validación del correo electrónico
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(cliente.correo_clientes)) {
      alert('Por favor ingrese un correo electrónico válido (ejemplo: usuario@dominio.com)');
      return;
    }

    try {
      const response = await fetch('https://backend-production-6925.up.railway.app/clientes', {
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

      const loginResponse = await fetch('https://backend-production-6925.up.railway.app/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre_usuario: cliente.nombre_usuario, pin_usuario: cliente.pin_usuario })
      });
      const loginData = await loginResponse.json();

      localStorage.clear();
      localStorage.setItem('userId', String(loginData.id_usuario));
      localStorage.setItem('token', loginData.token);
      localStorage.setItem('userData', JSON.stringify(loginData));

      navigate('/loginCliente', { replace: true });
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
                  type="text"
                  name="telefono_clientes"
                  value={formatTelefono(cliente.telefono_clientes)}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, ''); // Solo permitir números
                    setCliente(prev => ({
                      ...prev,
                      telefono_clientes: value
                    }));
                  }}
                  placeholder="Teléfono (ejemplo: 123-456-7890)"
                  required
                  maxLength="12" // Solo 10 dígitos sin guiones
                  className="input-field"
                  inputMode="tel"
                  pattern="[0-9]*"
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
                  type="text"
                  name="correo_clientes"
                  pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                  title="El correo electrónico debe tener un formato válido (ejemplo: usuario@dominio.com)"
                  value={cliente.correo_clientes}
                  onChange={handleChange}
                  placeholder="Correo electrónico"
                  required
                  className="input-field"
                  autoComplete="off"
                  onBlur={(e) => {
                    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                    if (!emailRegex.test(e.target.value)) {
                      if (!e.target.value.includes('@')) {
                        e.target.setCustomValidity('El correo debe contener el símbolo @');
                      } else if (!e.target.value.includes('.')) {
                        e.target.setCustomValidity('El correo debe contener un dominio válido (ejemplo: .com, .org)');
                      } else {
                        e.target.setCustomValidity('Formato de correo electrónico inválido');
                      }
                    } else {
                      e.target.setCustomValidity('');
                    }
                  }}
                  onInput={(e) => {
                    e.target.setCustomValidity('');
                  }}
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
                  autoComplete="off"
                  onBlur={async (e) => {
                    const username = e.target.value.trim();
                    if (!username) return;

                    try {
                      // Usar el nuevo endpoint del backend para verificar unicidad
                      const response = await fetch(`https://backend-production-6925.up.railway.app/check-username/${encodeURIComponent(username)}`);
                      const data = await response.json();

                      if (data.exists) {
                        e.target.setCustomValidity('Este nombre de usuario ya está en uso.');
                      } else {
                        e.target.setCustomValidity(''); // Nombre de usuario disponible
                      }
                    } catch (error) {
                      console.error('Error verificando usuario:', error);
                      e.target.setCustomValidity('Error al verificar usuario. Intenta de nuevo.');
                    }
                  }}
                  onInput={(e) => {
                    e.target.setCustomValidity(''); // Limpiar mensaje de error al escribir
                  }}
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