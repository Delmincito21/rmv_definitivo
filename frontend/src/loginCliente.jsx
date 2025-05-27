import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LogiAdmin.css';
import logo from './imagenes/lgo.png';
import Swal from 'sweetalert2';

const LoginCliente = () => {
  const [credenciales, setCredenciales] = useState({
    usuario: '',
    contraseña: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
    setError('');
    setLoading(true);

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

      const responseText = await response.text();
      console.log("Respuesta en texto:", responseText);
      const data = JSON.parse(responseText);
      console.log("Datos parseados:", data);

      // Limpiar el localStorage antes de establecer el nuevo usuario
      localStorage.clear();

      // Establecer los nuevos valores
      localStorage.setItem('userId', String(data.id_usuario));
      localStorage.setItem('token', data.token); // Guardar el token
      localStorage.setItem('userData', JSON.stringify({
        id_usuario: data.id_usuario,
        rol: data.rol
      }));

      // Disparar evento personalizado para notificar el cambio de usuario
      window.dispatchEvent(new CustomEvent('userChanged', {
        detail: { userId: data.id_usuario }
      }));

      // Mostrar mensaje de bienvenida
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: '¡Bienvenido!',
        text: 'Inicio de sesión exitoso',
        showConfirmButton: false,
        timer: 1500
      });

      // Navegar según el rol
      if (data.rol === 'administrador') {
        navigate('/admin/inicio', { replace: true });
      } else {
        navigate('/Tienda', { replace: true });
      }

    } catch (error) {
      setError('Error al iniciar sesión: ' + error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error de acceso',
        text: 'Usuario o contraseña incorrectos'
      });
    } finally {
      setLoading(false);
    }
  };

  const irARegistro = () => {
    navigate('/registrate');
  };

  const handleForgotPassword = async () => {
    const { value: email } = await Swal.fire({
      title: 'Recuperar contraseña',
      input: 'email',
      inputLabel: 'Ingresa tu correo de Google',
      inputPlaceholder: 'correo@gmail.com',
      confirmButtonText: 'Enviar enlace',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    });

    if (email) {
      try {
        await fetch('http://localhost:3000/recuperar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });

        Swal.fire(
          '¡Listo!',
          'Si el correo está registrado, recibirás un enlace para recuperar tu contraseña.',
          'success'
        );
      } catch (error) {
        Swal.fire(
          'Error',
          'No se pudo enviar el correo de recuperación. Intenta de nuevo. Detalle: ${error.message}',
          'error'
        );
      }
    }
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
                disabled={loading}
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
                disabled={loading}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? 'CARGANDO...' : 'ENTRAR'}
              </button>
              <div className="register-link">
                ¿No tienes cuenta? <span onClick={irARegistro} className="register-anchor">REGÍSTRATE</span>
              </div>
            </div>
          </form>

          <div className="forgot-link">
            <span onClick={handleForgotPassword} className="forgot-anchor">
              ¿Olvidaste tu contraseña?
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginCliente;