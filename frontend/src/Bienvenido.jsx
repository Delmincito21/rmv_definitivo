import React from 'react';
// import { useNavigate } from 'react-router-dom';
import './App.css';
import App from './App.jsx';

const Bienvenido = () => {
    // const navigate = useNavigate();

    return (
        <div className="bienvenido-container">
            <h1 className="bienvenido-titulo">¡Bienvenido a nuestra aplicación!</h1>
            <p className="bienvenido-descripcion">
                Selecciona tu perfil para continuar:
            </p>
            <div className="bienvenido-botones">
                <button className="btn empleado" >
                    Cliente
                </button>
                <button className="btn administrador">
                    Administrador
                </button>
            </div>
        </div>
    );
};

export default Bienvenido;
