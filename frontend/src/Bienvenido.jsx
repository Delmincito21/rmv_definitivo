import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import logo from './imagenes/lgo.png';
import { FaShoppingCart, FaUserCheck, FaFacebook, FaInstagram, FaTwitter, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { FaShop } from 'react-icons/fa6';

const Bienvenido = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      height: '100vh',
      background: 'linear-gradient(120deg, #e0e7ff 0%, #f8fafc 100%)',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      overflowX: 'hidden'
    }}>
      {/* Header */}
      <header style={{
        width: '100%',
        background: '#fff',
        boxShadow: '0 2px 12px #2563eb11',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 40px 18px 32px',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={logo} alt="Logo" style={{ width: 48, height: 48, borderRadius: 12 }} />
          <span style={{ fontWeight: 800, fontSize: 24, color: '#176bb3', letterSpacing: 1 }}>RMV</span>
        </div>
        {/* <nav style={{ display: 'flex', gap: 32 }}> */}
          {/* <span style={{ color: '#27639b', fontWeight: 500, cursor: 'pointer' }}>Inicio</span>
          <span style={{ color: '#27639b', fontWeight: 500, cursor: 'pointer' }}>Productos</span>
          <span style={{ color: '#27639b', fontWeight: 500, cursor: 'pointer' }}>Contacto</span>
        </nav> */}
        <button
          onClick={() => navigate('/loginCliente')}
          style={{
            background: 'linear-gradient(90deg, #4596e7, #176bb3)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '10px 28px',
            fontSize: '1rem',
            fontWeight: 700,
            boxShadow: '0 2px 8px #176bb320',
            cursor: 'pointer'
          }}
        >
          Ingresar
        </button>
      </header>

      {/* Hero principal */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 0',
        width: '100%'
      }}>
        <div style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 32,
          flexWrap: 'wrap'
        }}>
          {/* Imagen/ilustración izquierda */}
          <div style={{
            flex: 1,
            minWidth: 260,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <img
              src="https://i.pinimg.com/736x/91/9e/9b/919e9bf919fc7e86c5706ebcdb4468ee.jpg"
              alt="Vista previa"
              style={{
                width: 320,
                height: 200,
                objectFit: 'cover',
                borderRadius: 18,
                marginBottom: 18,
                boxShadow: '0 4px 24px #176bb320'
              }}
            />
            <div style={{ color: '#176bb3', fontWeight: 600, fontSize: 16, textAlign: 'center' }}>¡Explora nuestro catálogo!</div>
          </div>

          {/* Centro: texto y botón */}
          <div style={{
            flex: 2,
            minWidth: 320,
            textAlign: 'center',
            padding: '0 16px'
          }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 900,
              color: '#222',
              marginBottom: 18,
              letterSpacing: 1
            }}>
              COMIENZA HOY A COMPRAR EN <span style={{ color: '#176bb3' }}>RMV</span>
            </h1>
            <p style={{
              color: '#444',
              fontSize: '1.2rem',
              marginBottom: 32,
              maxWidth: 500,
              margin: '0 auto 32px auto'
            }}>
              Descubre productos, gestiona tus pedidos y vive la mejor experiencia de compra online. ¡Todo en un solo lugar!
            </p>
            <button
              onClick={() => navigate('/loginCliente')}
              style={{
                background: 'linear-gradient(90deg, #4596e7, #176bb3)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '16px 48px',
                fontSize: '1.2rem',
                fontWeight: 700,
                boxShadow: '0 2px 8px #176bb320',
                cursor: 'pointer',
                marginBottom: 18
              }}
            >
              Ingresar
            </button>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 32,
              marginTop: 32
            }}>
              <div style={{ textAlign: 'center' }}>
                <FaShop size={32} color="#2196F3" />
                <div style={{ fontSize: 13, color: '#27639b', marginTop: 6 }}>Catálogo</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <FaShoppingCart size={32} color="#2196F3" />
                <div style={{ fontSize: 13, color: '#27639b', marginTop: 6 }}>Carrito</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <FaUserCheck size={32} color="#2196F3" />
                <div style={{ fontSize: 13, color: '#27639b', marginTop: 6 }}>Pedidos</div>
              </div>
            </div>
          </div>

          {/* Imagen/ilustración derecha */}
          <div style={{
            flex: 1,
            minWidth: 260,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <img
              src="https://i.pinimg.com/736x/6b/5c/e4/6b5ce4d92aa6672178fe02141c382088.jpg"
              alt="Vista previa"
              style={{
                width: 320,
                height: 200,
                objectFit: 'cover',
                borderRadius: 18,
                marginBottom: 18,
                boxShadow: '0 4px 24px #176bb320'
              }}
            />
            <div style={{ color: '#176bb3', fontWeight: 600, fontSize: 16, textAlign: 'center' }}>¡Gestiona tus pedidos!</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        background: 'white',
        padding: '40px 20px',
        marginTop: 'auto',
        boxShadow: '0 -4px 20px rgba(23, 107, 179, 0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
          alignItems: 'start'
        }}>
          {/* Logo y Nombre */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px'}}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' , paddingRight: '350px'}}>
              <img src={logo} alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '8px' }} />
              <span style={{ fontWeight: 800, fontSize: '20px', color: '#176bb3' }}>RefriElectric MV</span>
            </div>
            <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6' }}>
              Tu tienda confiable en electrodomésticos y servicios de refrigeración.
            </p>
          </div>

          {/* Información de Contacto */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '200px' }}>
            <h3 style={{ color: '#176bb3', fontSize: '18px', fontWeight: 600, margin: 0 }}>Contacto</h3>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', alignItems: 'center', flexWrap: 'nowrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#666', whiteSpace: 'nowrap' }}>
                <FaPhone size={16} />
                <span>(809) 401-1312</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#666', whiteSpace: 'nowrap' }}>
                <FaEnvelope size={16}/>
                <span>refrielectricmv@gmail.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#666', whiteSpace: 'nowrap' }}>
                <FaMapMarkerAlt size={16} />
                <span>Estancia Nueva, Santiago, RD</span>
              </div>
            </div>
            <div style={{
          color: '#666',
          fontSize: '10px'
        }}>
          <p style={{ margin: 0 }}>© 2024 RefriElectric Martin Vasquez SRL. Todos los derechos reservados.</p>
          <p style={{ margin: '8px 0 0 0' }}>RNC: 133-081-504</p>
        </div>
          </div>

          {/* Redes Sociales */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' , paddingLeft: '300px'}}>
            <h3 style={{ color: '#176bb3', fontSize: '18px', fontWeight: 600, margin: 0 }}>Síguenos</h3>
            <div style={{ display: 'flex', gap: '20px' }}>
              <a href="https://www.instagram.com/delmincito21" target="_blank" rel="noopener noreferrer" 
                 style={{ color: '#176bb3', textDecoration: 'none', transition: 'color 0.3s' }}>
                <FaInstagram size={24} />
              </a>
              <a href="https://www.facebook.com/4" target="_blank" rel="noopener noreferrer"
                 style={{ color: '#176bb3', textDecoration: 'none', transition: 'color 0.3s' }}>
                <FaFacebook size={24} />
              </a>
              <a href="https://x.com/" target="_blank" rel="noopener noreferrer"
                 style={{ color: '#176bb3', textDecoration: 'none', transition: 'color 0.3s' }}>
                <FaTwitter size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Línea divisoria y copyright */}
        
      </footer>
    </div>
  );
};

export default Bienvenido;