import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import logo from './imagenes/lgo.png';
import { motion } from 'framer-motion';

const Bienvenido = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="bienvenido-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="bienvenido-content">
        <motion.div
          className="bienvenido-logo-container"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <img src={logo} alt="Logo de la empresa" className="bienvenido-logo" />
        </motion.div>

        <motion.div
          className="bienvenido-text-container"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="bienvenido-titulo">
            ¡Bienvenido a nuestra aplicación!
          </h1>
          <p className="bienvenido-descripcion">
            Descubre una nueva forma de gestionar tus servicios
          </p>
        </motion.div>

        <motion.div
          className="bienvenido-botones"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            className="btn-empleado"
            onClick={() => navigate('/loginCliente')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Iniciar Sesión
          </motion.button>
        </motion.div>

        <motion.div
          className="bienvenido-decoration"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <div className="decoration-circle circle-1"></div>
          <div className="decoration-circle circle-2"></div>
          <div className="decoration-circle circle-3"></div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Bienvenido;