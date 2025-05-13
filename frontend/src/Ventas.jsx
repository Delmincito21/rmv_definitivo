import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaMinus, FaPlus, FaArrowLeft, FaCreditCard, FaTruck } from 'react-icons/fa';
import './Ventas.css';

// Componente de Pago
const PagoForm = ({ total, onSubmit, setPaso }) => {
  const [datosPago, setDatosPago] = useState({
    monto: total || 0,
    fecha_pago: new Date().toISOString().slice(0, 16),
    metodo_pago: 'transferencia',
    referencia: '',
    banco_emisor: '',
    estado_pago: 'pendiente'
  });

  const [errores, setErrores] = useState({});

  const validarPago = () => {
    const nuevosErrores = {};

    if (!datosPago.monto) {
      nuevosErrores.monto = 'El monto es requerido';
    }

    if (!datosPago.referencia) {
      nuevosErrores.referencia = 'La referencia es requerida';
    }

    if (!datosPago.banco_emisor) {
      nuevosErrores.banco_emisor = 'El banco emisor es requerido';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validarPago()) {
      onSubmit(datosPago);
    }
  };

  const handleVolver = () => {
    setPaso('venta');
  };

  return (
    <form onSubmit={handleSubmit} className="pago-form">
      <button type="button" className="back-btn" onClick={handleVolver}>
        <FaArrowLeft /> Volver
      </button>
      <h3 className="section-subtitle">Información de Pago</h3>

      <div className="form-row">
        <div className={`form-field ${errores.monto ? 'error' : ''}`}>
          <label>Monto</label>
          <input
            type="number"
            value={datosPago.monto}
            onChange={(e) => setDatosPago({ ...datosPago, monto: e.target.value })}
            placeholder="0.00"
            step="0.01"
          />
          {errores.monto && <div className="error-message">{errores.monto}</div>}
        </div>

        <div className="form-field">
          <label>Fecha de Pago</label>
          <input
            type="datetime-local"
            value={datosPago.fecha_pago}
            onChange={(e) => setDatosPago({ ...datosPago, fecha_pago: e.target.value })}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label>Método de Pago</label>
          <input
            type="text"
            value="Transferencia"
            readOnly
          />
        </div>

        <div className={`form-field ${errores.referencia ? 'error' : ''}`}>
          <label>Número de Referencia</label>
          <input
            type="text"
            value={datosPago.referencia}
            onChange={(e) => setDatosPago({ ...datosPago, referencia: e.target.value })}
            placeholder="Número de referencia"
          />
          {errores.referencia && <div className="error-message">{errores.referencia}</div>}
        </div>
      </div>

      <div className="form-row">
        <div className={`form-field ${errores.banco_emisor ? 'error' : ''}`}>
          <label>Banco Emisor</label>
          <input
            type="text"
            value={datosPago.banco_emisor}
            onChange={(e) => setDatosPago({ ...datosPago, banco_emisor: e.target.value })}
            placeholder="Nombre del banco"
          />
          {errores.banco_emisor && <div className="error-message">{errores.banco_emisor}</div>}
        </div>

        <div className="form-field">
          <label>Estado del Pago</label>
          <select
            value={datosPago.estado_pago}
            onChange={(e) => setDatosPago({ ...datosPago, estado_pago: e.target.value })}
          >
            <option value="pendiente">Pendiente</option>
            <option value="confirmado">Confirmado</option>
            <option value="anulado">Anulado</option>
          </select>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-btn">
          <FaCreditCard /> Procesar Pago
        </button>
      </div>
    </form>
  );
};

// Componente de Envío
const EnvioForm = ({ onSubmit, setPaso }) => {
  const [datosEnvio, setDatosEnvio] = useState({
    fecha_entrega: '',
    direccion: ''
  });

  const [errores, setErrores] = useState({});

  const validarEnvio = () => {
    const nuevosErrores = {};

    if (!datosEnvio.fecha_entrega) {
      nuevosErrores.fecha_entrega = 'La fecha de entrega es requerida';
    }

    if (!datosEnvio.direccion.trim()) {
      nuevosErrores.direccion = 'La dirección es requerida';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validarEnvio()) {
      onSubmit(datosEnvio);
    }
  };

  const handleVolver = () => {
    setPaso('pago');
  };

  return (
    <form onSubmit={handleSubmit} className="envio-form">
      <button type="button" className="back-btn" onClick={handleVolver}>
        <FaArrowLeft /> Volver
      </button>
      <h3 className="section-subtitle">Información de Envío</h3>

      <div className="form-row">
        <div className={`form-field ${errores.fecha_entrega ? 'error' : ''}`}>
          <label>Fecha de Entrega</label>
          <input
            type="datetime-local"
            value={datosEnvio.fecha_entrega}
            onChange={(e) => setDatosEnvio({ ...datosEnvio, fecha_entrega: e.target.value })}
          />
          {errores.fecha_entrega && <div className="error-message">{errores.fecha_entrega}</div>}
        </div>

        <div className={`form-field ${errores.direccion ? 'error' : ''}`}>
          <label>Dirección</label>
          <input
            type="text"
            value={datosEnvio.direccion}
            onChange={(e) => setDatosEnvio({ ...datosEnvio, direccion: e.target.value })}
            placeholder="Dirección de entrega"
          />
          {errores.direccion && <div className="error-message">{errores.direccion}</div>}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-btn">
          <FaTruck /> Confirmar Envío
        </button>
      </div>
    </form>
  );
};

// Componente Principal de Ventas
const Ventas = () => {
  const [datosVenta, setDatosVenta] = useState({
    id_usuario: '',
    fecha_venta: new Date().toISOString().slice(0, 16),
    estado_venta: 'pendiente',
    total: 0
  });

  const [detalles, setDetalles] = useState([{
    id_producto: '',
    cantidad: '',
    precio: '',
    subtotal: 0
  }]);

  const [errores, setErrores] = useState({
    datosVenta: {},
    detalles: [{}]
  });

  const [paso, setPaso] = useState('venta'); // 'venta', 'pago', 'envio'
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/venta') // Asegúrate de que esta ruta esté configurada en tu backend
      .then(res => res.json())
      .then(data => {
        console.log('Ventas obtenidas del backend:', data); // Verifica los datos aquí
        setVentas(data); // Guarda las ventas en el estado
        setLoading(false); // Indica que la carga ha terminado
      })
      .catch(err => {
        console.error('Error al cargar las ventas:', err); // Muestra el error en la consola
        setError('No se pudo cargar la lista de ventas'); // Muestra un mensaje de error
        setLoading(false); // Indica que la carga ha terminado
      });
  }, []);

  const calcularSubtotal = (detalle) => {
    const cantidad = parseFloat(detalle.cantidad) || 0;
    const precio = parseFloat(detalle.precio) || 0;
    return Number((cantidad * precio).toFixed(2));
  };

  const calcularTotal = () => {
    return detalles.reduce((total, detalle) => total + calcularSubtotal(detalle), 0);
  };

  const handleDetalleChange = (index, campo, valor) => {
    const nuevosDetalles = [...detalles];
    nuevosDetalles[index] = {
      ...nuevosDetalles[index],
      [campo]: valor
    };
    nuevosDetalles[index].subtotal = calcularSubtotal(nuevosDetalles[index]);

    setDetalles(nuevosDetalles);
    setDatosVenta(prev => ({
      ...prev,
      total: calcularTotal()
    }));

    // Limpiar error específico
    const nuevosErrores = { ...errores };
    if (nuevosErrores.detalles[index] && nuevosErrores.detalles[index][campo]) {
      delete nuevosErrores.detalles[index][campo];
      setErrores(nuevosErrores);
    }
  };

  const agregarDetalle = () => {
    setDetalles([...detalles, {
      id_producto: '',
      cantidad: '',
      precio: '',
      subtotal: 0
    }]);
    setErrores(prev => ({
      ...prev,
      detalles: [...prev.detalles, {}]
    }));
  };

  const eliminarDetalle = (index) => {
    const nuevosDetalles = detalles.filter((_, i) => i !== index);
    setDetalles(nuevosDetalles);

    const nuevosErrores = {
      ...errores,
      detalles: errores.detalles.filter((_, i) => i !== index)
    };
    setErrores(nuevosErrores);

    setDatosVenta(prev => ({
      ...prev,
      total: nuevosDetalles.reduce((total, detalle) => total + calcularSubtotal(detalle), 0)
    }));
  };

  const validarFormulario = () => {
    const nuevosErrores = {
      datosVenta: {},
      detalles: detalles.map(() => ({}))
    };
    let esValido = true;

    if (!datosVenta.id_usuario.trim()) {
      nuevosErrores.datosVenta.id_usuario = 'El ID de usuario es requerido';
      esValido = false;
    }

    if (!datosVenta.fecha_venta) {
      nuevosErrores.datosVenta.fecha_venta = 'La fecha de venta es requerida';
      esValido = false;
    }

    detalles.forEach((detalle, index) => {
      if (!detalle.id_producto.trim()) {
        nuevosErrores.detalles[index].id_producto = 'El ID del producto es requerido';
        esValido = false;
      }

      if (!detalle.cantidad || detalle.cantidad <= 0) {
        nuevosErrores.detalles[index].cantidad = 'La cantidad debe ser mayor a 0';
        esValido = false;
      }

      if (!detalle.precio || detalle.precio <= 0) {
        nuevosErrores.detalles[index].precio = 'El precio debe ser mayor a 0';
        esValido = false;
      }
    });

    setErrores(nuevosErrores);
    return esValido;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validarFormulario()) {
      setPaso('pago');
    }
  };

  const handlePagoSubmit = (datosPago) => {
    console.log('Datos de pago:', datosPago);
    setPaso('envio');
  };

  const handleEnvioSubmit = (datosEnvio) => {
    console.log('Datos de envío:', datosEnvio);
  };

  const handleVolverAVenta = () => {
    setPaso('venta');
    setMostrarFormulario(true);
  };

  return (
    <div className="ventas-container">
      <div className="dashboard-header">
        <h1 className="page-title">Gestión de Ventas</h1>
        <button
          className="add-button"
          onClick={() => setMostrarFormulario(true)}
        >
          <FaPlus /> Nueva Venta
        </button>
      </div>

      {mostrarFormulario ? (
        <div className="venta-container">
          {paso === 'venta' && (
            <form onSubmit={handleSubmit} className="horizontal-product-form">
              <div className="form-header">
                <button type="button" className="back-btn" onClick={() => setMostrarFormulario(false)}>
                  <FaArrowLeft /> Volver
                </button>
                <h2 className="form-title">Nueva Venta</h2>
              </div>

              <div className="form-row">
                <div className={`form-field ${errores.datosVenta?.id_usuario ? 'error' : ''}`}>
                  <label>ID Usuario</label>
                  <input
                    type="text"
                    value={datosVenta.id_usuario}
                    onChange={(e) => {
                      setDatosVenta({ ...datosVenta, id_usuario: e.target.value });
                      setErrores({
                        ...errores,
                        datosVenta: { ...errores.datosVenta, id_usuario: '' }
                      });
                    }}
                    placeholder="Ingrese ID de usuario"
                  />
                  {errores.datosVenta?.id_usuario && (
                    <div className="error-message">{errores.datosVenta.id_usuario}</div>
                  )}
                </div>

                <div className={`form-field ${errores.datosVenta?.fecha_venta ? 'error' : ''}`}>
                  <label>Fecha de Venta</label>
                  <div className="date-input-container">
                    <input
                      type="datetime-local"
                      value={datosVenta.fecha_venta}
                      onChange={(e) => {
                        setDatosVenta({ ...datosVenta, fecha_venta: e.target.value });
                        setErrores({
                          ...errores,
                          datosVenta: { ...errores.datosVenta, fecha_venta: '' }
                        });
                      }}
                    />
                    <FaCalendarAlt className="calendar-icon" />
                  </div>
                  {errores.datosVenta?.fecha_venta && (
                    <div className="error-message">{errores.datosVenta.fecha_venta}</div>
                  )}
                </div>

                <div className="form-field optional">
                  <label>Estado de Venta</label>
                  <select
                    value={datosVenta.estado_venta}
                    onChange={(e) => setDatosVenta({ ...datosVenta, estado_venta: e.target.value })}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="completa">Completa</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>
              </div>

              <h3 className="section-subtitle">Detalles de la Venta</h3>

              {detalles.map((detalle, index) => (
                <div key={index} className="detalle-venta-container">
                  <div className="form-row">
                    <div className={`form-field ${errores.detalles[index]?.id_producto ? 'error' : ''}`}>
                      <label>ID Producto</label>
                      <input
                        type="text"
                        value={detalle.id_producto}
                        onChange={(e) => handleDetalleChange(index, 'id_producto', e.target.value)}
                        placeholder="Ingrese ID del producto"
                      />
                      {errores.detalles[index]?.id_producto && (
                        <div className="error-message">{errores.detalles[index].id_producto}</div>
                      )}
                    </div>

                    <div className={`form-field ${errores.detalles[index]?.cantidad ? 'error' : ''}`}>
                      <label>Cantidad</label>
                      <input
                        type="number"
                        value={detalle.cantidad}
                        onChange={(e) => handleDetalleChange(index, 'cantidad', e.target.value)}
                        placeholder="0"
                        min="0"
                      />
                      {errores.detalles[index]?.cantidad && (
                        <div className="error-message">{errores.detalles[index].cantidad}</div>
                      )}
                    </div>

                    <div className={`form-field ${errores.detalles[index]?.precio ? 'error' : ''}`}>
                      <label>Precio Unitario</label>
                      <input
                        type="number"
                        value={detalle.precio}
                        onChange={(e) => handleDetalleChange(index, 'precio', e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                      />
                      {errores.detalles[index]?.precio && (
                        <div className="error-message">{errores.detalles[index].precio}</div>
                      )}
                    </div>

                    <div className="form-field subtotal">
                      <label>Subtotal</label>
                      <input
                        type="text"
                        value={detalle.subtotal.toFixed(2)}
                        readOnly
                        placeholder="0.00"
                      />
                    </div>

                    {detalles.length > 1 && (
                      <button
                        type="button"
                        className="btn-remove"
                        onClick={() => eliminarDetalle(index)}
                      >
                        <FaMinus />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <div className="add-item-container">
                <button
                  type="button"
                  className="btn-add-item"
                  onClick={agregarDetalle}
                >
                  <FaPlus /> Agregar Producto
                </button>
              </div>

              <div className="total-container">
                <h3>Total: ${Number(calcularTotal()).toFixed(2)}</h3>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setMostrarFormulario(false)}>
                  Cancelar
                </button>
                <button type="submit" className="submit-btn">Continuar al Pago</button>
              </div>
            </form>
          )}

          {paso === 'pago' && (
            <PagoForm
              total={calcularTotal()}
              onSubmit={handlePagoSubmit}
              setPaso={handleVolverAVenta}
            />
          )}

          {paso === 'envio' && (
            <EnvioForm
              onSubmit={handleEnvioSubmit}
              setPaso={setPaso}
            />
          )}
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6">Cargando...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6">{error}</td>
                </tr>
              ) : ventas.length > 0 ? (
                ventas.map((venta, index) => (
                  <tr key={index}>
                    <td>{venta.id}</td>
                    <td>{venta.fecha}</td>
                    <td>{venta.cliente}</td>
                    <td>${venta.total}</td>
                    <td>
                      <span className={`estado ${venta.estado}`}>{venta.estado}</span>
                    </td>
                    <td className="actions-cell">
                      <button className="action-button view">Ver Detalles</button>
                      <button className="action-button edit">Editar</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No hay ventas disponibles</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Ventas;