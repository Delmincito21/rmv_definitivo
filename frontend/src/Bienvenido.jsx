import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import logo from './imagenes/lgo.png';
import { FaShoppingCart, FaUserCheck, FaFacebook, FaInstagram, FaTwitter, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { FaShop } from 'react-icons/fa6';

const Bienvenido = () => {
  const navigate = useNavigate();

  return (
    <div className="bienvenido-wrapper">
      {/* Header */}
      <header className="bienvenido-header">
        <div className="header-logo">
          <img src={logo} alt="Logo" className="logo-img" />
          <span className="logo-text">Refrielectric Martin Vasquez SRL</span>
        </div>
        <button
          onClick={() => navigate('/loginCliente')}
          className="login-button"
        >
          Ingresar
        </button>
      </header>

      {/* Hero principal */}
      <main className="bienvenido-main">
        <div className="main-content">
          {/* Imagen/ilustración izquierda */}
          <div className="preview-image-container">
            <img
              src="https://i.pinimg.com/736x/91/9e/9b/919e9bf919fc7e86c5706ebcdb4468ee.jpg"
              alt="Vista previa"
              className="preview-image"
            />
            <div className="image-caption">¡Explora nuestro catálogo!</div>
          </div>

          {/* Centro: texto y botón */}
          <div className="main-text-container">
            <h1 className="main-title">
              COMIENZA HOY A COMPRAR EN <span className="highlight">Refrielectric Martin Vasquez SRL</span>
            </h1>
            <p className="main-description">
              Descubre productos, gestiona tus pedidos y vive la mejor experiencia de compra online. ¡Todo en un solo lugar!
            </p>
            <button
              onClick={() => navigate('/loginCliente')}
              className="main-button"
            >
              Ingresar
            </button>
            <div className="features-container">
              <div className="feature-item">
                <FaShop size={32} color="#2196F3" />
                <div className="feature-text">Catálogo</div>
              </div>
              <div className="feature-item">
                <FaShoppingCart size={32} color="#2196F3" />
                <div className="feature-text">Carrito</div>
              </div>
              <div className="feature-item">
                <FaUserCheck size={32} color="#2196F3" />
                <div className="feature-text">Pedidos</div>
              </div>
            </div>
          </div>

          {/* Imagen/ilustración derecha */}
          <div className="preview-image-container">
            <img
              src="https://i.pinimg.com/736x/6b/5c/e4/6b5ce4d92aa6672178fe02141c382088.jpg"
              alt="Vista previa"
              className="preview-image"
            />
            <div className="image-caption">¡Gestiona tus pedidos!</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bienvenido-footer">
        <div className="footer-content">
          {/* Logo y Nombre */}
          <div className="footer-section">
            <div className="footer-logo">
              <img src={logo} alt="Logo" className="footer-logo-img" />
              <span className="footer-logo-text">RefriElectric MV</span>
            </div>
            <p className="footer-description">
              Tu tienda confiable en electrodomésticos y servicios de refrigeración.
            </p>
          </div>

          {/* Información de Contacto */}
          <div className="footer-section">
            <h3 className="footer-title">Contacto</h3>
            <div className="contact-info">
              <div className="contact-item">
                <FaPhone size={16} />
                <span>(809) 401-1312</span>
              </div>
              <div className="contact-item">
                <FaEnvelope size={16}/>
                <span>refrielectricmv@gmail.com</span>
              </div>
              <div className="contact-item">
                <FaMapMarkerAlt size={16} />
                <span>Estancia Nueva, Santiago, RD</span>
              </div>
            </div>
          </div>

          {/* Redes Sociales */}
          <div className="footer-section">
            <h3 className="footer-title">Síguenos</h3>
            <div className="social-links">
              <a href="https://www.instagram.com/delmincito21" target="_blank" rel="noopener noreferrer" className="social-link">
                <FaInstagram size={24} />
              </a>
              <a href="https://www.facebook.com/4" target="_blank" rel="noopener noreferrer" className="social-link">
                <FaFacebook size={24} />
              </a>
              <a href="https://x.com/" target="_blank" rel="noopener noreferrer" className="social-link">
                <FaTwitter size={24} />
              </a>
            </div>
            <div className="footer-copyright">
              <p>© 2024 RefriElectric Martin Vasquez SRL. Todos los derechos reservados.</p>
              <p>RNC: 133-081-504</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Bienvenido;