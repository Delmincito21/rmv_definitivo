import React, { useState } from 'react';
import Swal from 'sweetalert2';
import './LogiAdmin.css';

const ResetPassword = () => {
  const params = new URLSearchParams(window.location.search);
  const email = params.get('email');
  const token = params.get('token');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      );
      setPassword('');
    } else {
      Swal.fire(
        'Error',
        data.error || 'Error al cambiar la contraseña',
        'error'
      );
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-form">
        <h2 className="form-title" style={{ marginBottom: '1.5rem' }}>
          Cambia tu contraseña
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            className="reset-password-input"
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button className="reset-password-btn" type="submit">
            Cambiar contraseña
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;