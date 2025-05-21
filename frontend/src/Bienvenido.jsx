import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import logo from './imagenes/lgo.png';
import { FaShoppingCart, FaUserCheck } from 'react-icons/fa';
import { FaShop } from 'react-icons/fa6';

const Bienvenido = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #e0e7ff 0%, #f8fafc 100%)',
      display: 'flex',
      flexDirection: 'column'
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
    </div>
  );
};

export default Bienvenido;