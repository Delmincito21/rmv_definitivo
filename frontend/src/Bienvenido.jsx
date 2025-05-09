import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import logo from './imagenes/lgo.png'; // Asegúrate de que la ruta sea correcta

const Bienvenido = () => {
  const navigate = useNavigate();

  return (
    <div className="bienvenido-container">
      {/* Logo agregado aquí */}
      <div className="bienvenido-logo-container">
        <img src={logo} alt="Logo de la empresa" className="bienvenido-logo" />
      </div>

      <h1 className="bienvenido-titulo">¡Bienvenido a nuestra aplicación!</h1>
      <p className="bienvenido-descripcion">
        Selecciona tu perfil para continuar:
      </p>
      <div className="bienvenido-botones">
        <button
          className="btn empleado"
          onClick={() => navigate('/loginCliente')}
        >
          Iniciar Sesion
        </button>
      </div>
      </div>

  );
};

export default Bienvenido;