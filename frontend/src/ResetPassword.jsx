import React, { useState } from 'react';
import Swal from 'sweetalert2';
import './LogiAdmin.css';

const ResetPassword = () => {
  const params = new URLSearchParams(window.location.search);
  const email = params.get('email');
  const token = params.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setError('');
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, newPassword: password })
      });
      const data = await res.json();
      
      if (res.ok) {
        Swal.fire(
          '¡Listo!',
          '¡Contraseña cambiada exitosamente!',
          'success'
        ).then(() => {
          window.location.href = '/loginCliente';
        });
        setPassword('');
      } else {
        Swal.fire(
          'Error',
          data.error || 'Error al cambiar la contraseña',
          'error'
        );
      }
    } catch (error) {
      Swal.fire(
        'Error',
        error.message || 'Error al procesar la solicitud',
        'error'
      );
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-form">
        <h2 className="reset-password-title">Cambia tu contraseña</h2>
        <form onSubmit={handleSubmit} className="reset-password-form">
          <div className="form-row">
            <label className="reset-password-label" htmlFor="password">
              Nueva contraseña
            </label>
            <input
              id="password"
              type="password"
              className="reset-password-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="8"
              placeholder="Ingresa tu nueva contraseña"
            />
          </div>
          <div className="form-row">
            <label className="reset-password-label" htmlFor="confirm-password">
              Confirmar contraseña
            </label>
            <input
              id="confirm-password"
              type="password"
              className="reset-password-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength="8"
              placeholder="Confirma tu nueva contraseña"
            />
          </div>
          {error && (
            <div className="reset-password-error">{error}</div>
          )}
          <button type="submit" className="reset-password-button">
            Cambiar contraseña
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;