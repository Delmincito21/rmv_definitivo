import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaMinus, FaPlus, FaArrowLeft, FaCreditCard, FaTruck } from 'react-icons/fa';
import './Ventas.css';

// Componente de Pago
const PagoForm = ({ total, onSubmit, setPaso, id_venta }) => {
  const [datosPago, setDatosPago] = useState({
    monto: total || 0,
    fecha_pago: new Date().toISOString().slice(0, 16),
    metodo_pago: 'transferencia',
    referencia: '',
    banco_emisor: '',
    estado_pago: 'pendiente',
    id_venta: id_venta
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
            <option value="completado">Completado</option>
            <option value="fallido">Fallido</option>
            <option value="reembolsado">Reembolsado</option>
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
const EnvioForm = ({ onSubmit, setPaso, id_orden }) => {
  const [datosEnvio, setDatosEnvio] = useState({
    fecha_estimada_envio: '',
    direccion_entrega_envio: '',
    estado_envio: 'pendiente',
    estado: 'activo',
    id_orden: id_orden
  });

  const [errores, setErrores] = useState({});

  const validarEnvio = () => {
    const nuevosErrores = {};

    if (!datosEnvio.fecha_estimada_envio) {
      nuevosErrores.fecha_estimada_envio = 'La fecha de entrega es requerida';
    }

    if (!datosEnvio.direccion_entrega_envio.trim()) {
      nuevosErrores.direccion_entrega_envio = 'La dirección es requerida';
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
        <div className={`form-field ${errores.fecha_estimada_envio ? 'error' : ''}`}>
          <label>Fecha de Entrega</label>
          <input
            type="datetime-local"
            value={datosEnvio.fecha_estimada_envio}
            onChange={(e) => setDatosEnvio({ ...datosEnvio, fecha_estimada_envio: e.target.value })}
          />
          {errores.fecha_estimada_envio && <div className="error-message">{errores.fecha_estimada_envio}</div>}
        </div>

        <div className={`form-field ${errores.direccion_entrega_envio ? 'error' : ''}`}>
          <label>Dirección</label>
          <input
            type="text"
            value={datosEnvio.direccion_entrega_envio}
            onChange={(e) => setDatosEnvio({ ...datosEnvio, direccion_entrega_envio: e.target.value })}
            placeholder="Dirección de entrega"
          />
          {errores.direccion_entrega_envio && <div className="error-message">{errores.direccion_entrega_envio}</div>}
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
    estado: 'activo',
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
  const [ordenId, setOrdenId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/ventas')
      .then(res => res.json())
      .then(data => {
        console.log('Ventas obtenidas del backend:', data);
        setVentas(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al cargar las ventas:', err);
        setError('No se pudo cargar la lista de ventas');
        setLoading(false);
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

    // Validar id_usuario
    if (!datosVenta.id_usuario.toString().trim()) {
      nuevosErrores.datosVenta.id_usuario = 'El ID de usuario es requerido';
      esValido = false;
    } else if (isNaN(parseInt(datosVenta.id_usuario))) {
      nuevosErrores.datosVenta.id_usuario = 'El ID de usuario debe ser un número';
      esValido = false;
    }

    // Validar fecha_venta
    if (!datosVenta.fecha_venta) {
      nuevosErrores.datosVenta.fecha_venta = 'La fecha de venta es requerida';
      esValido = false;
    }

    // Validar detalles
    detalles.forEach((detalle, index) => {
      if (!detalle.id_producto.toString().trim()) {
        nuevosErrores.detalles[index].id_producto = 'El ID del producto es requerido';
        esValido = false;
      } else if (isNaN(parseInt(detalle.id_producto))) {
        nuevosErrores.detalles[index].id_producto = 'El ID del producto debe ser un número';
        esValido = false;
      }

      if (!detalle.cantidad || parseInt(detalle.cantidad) <= 0) {
        nuevosErrores.detalles[index].cantidad = 'La cantidad debe ser mayor a 0';
        esValido = false;
      }

      if (!detalle.precio || parseFloat(detalle.precio) <= 0) {
        nuevosErrores.detalles[index].precio = 'El precio debe ser mayor a 0';
        esValido = false;
      }
    });

    setErrores(nuevosErrores);
    return esValido;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validarFormulario()) {
      try {
        // Preparar los datos de la venta
        const ventaParaEnviar = {
          id_usuario: parseInt(datosVenta.id_usuario),
          fecha_venta: datosVenta.fecha_venta,
          estado_venta: datosVenta.estado_venta,
          estado: 'activo'
        };

        console.log('Datos de venta a enviar:', ventaParaEnviar);

        // Crear la venta
        const ventaResponse = await fetch('http://localhost:3000/ventas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(ventaParaEnviar)
        });

        console.log('Respuesta del servidor:', ventaResponse.status);
        
        const responseData = await ventaResponse.json();
        console.log('Datos de respuesta:', responseData);

        if (!ventaResponse.ok) {
          throw new Error(responseData.error || 'Error al crear la venta');
        }

        // Obtener el ID de la venta desde insertId
        const idVenta = responseData.id || responseData.insertId;
        if (!idVenta) {
          throw new Error('No se pudo obtener el ID de la venta creada');
        }
        console.log('ID de venta creada:', idVenta);

        // Crear los detalles de venta
        for (const detalle of detalles) {
          const detalleParaEnviar = {
            id_venta: idVenta,
            id_producto: parseInt(detalle.id_producto),
            cantidad_detalle_venta: parseInt(detalle.cantidad),
            precio_unitario_detalle_venta: parseFloat(detalle.precio),
            subtotal_detalle_venta: parseFloat(detalle.subtotal),
            estado: 'activo'
          };

          console.log('Detalle a enviar:', detalleParaEnviar);

          const detalleResponse = await fetch('http://localhost:3000/detalle-ventas', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(detalleParaEnviar)
          });

          if (!detalleResponse.ok) {
            const errorDetalleData = await detalleResponse.json();
            throw new Error(errorDetalleData.error || 'Error al crear el detalle de venta');
          }
        }

        // Guardar el ID de la venta en el estado
        setDatosVenta(prev => ({ ...prev, id_venta: idVenta }));
        setPaso('pago');
      } catch (error) {
        console.error('Error completo:', error);
        alert('Error al procesar la venta: ' + error.message);
      }
    }
  };

  const handlePagoSubmit = async (datosPago) => {
    try {
      // Procesar el pago
      console.log('Enviando datos de pago:', datosPago);
      const response = await fetch('http://localhost:3000/pagos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosPago)
      });

      if (!response.ok) {
        throw new Error('Error al procesar el pago');
      }

      // Crear la orden
      const ordenData = {
        id_usuario: parseInt(datosVenta.id_usuario),
        id_venta: datosVenta.id_venta,
        total_orden: datosPago.monto,
        estado_orden: 'pendiente',
        fecha_orden: datosVenta.fecha_venta,
        estado: 'activo'
      };

      console.log('Enviando datos de orden:', ordenData);
      const ordenResponse = await fetch('http://localhost:3000/orden', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ordenData)
      });

      if (!ordenResponse.ok) {
        throw new Error('Error al crear la orden');
      }

      const ordenResult = await ordenResponse.json();
      console.log('Orden creada exitosamente:', ordenResult);
      setOrdenId(ordenResult.id); // Guardamos el ID de la orden
      setPaso('envio');

    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar el pago o crear la orden: ' + error.message);
    }
  };

  const handleEnvioSubmit = async (datosEnvio) => {
    try {
      const response = await fetch('http://localhost:3000/envios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosEnvio)
      });

      if (!response.ok) {
        throw new Error('Error al procesar el envío');
      }

      alert('Venta completada exitosamente');
      setMostrarFormulario(false);
      setPaso('venta');
      
      // Recargar la lista de ventas
      const ventasResponse = await fetch('http://localhost:3000/ventas');
      const ventasData = await ventasResponse.json();
      setVentas(ventasData);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar el envío: ' + error.message);
    }
  };

  const handleVolverAVenta = () => {
    setPaso('venta');
    setMostrarFormulario(true);
  };

  const handleDelete = async (id_venta) => {
    if (window.confirm('¿Estás seguro que quieres eliminar esta venta? Se cambiarán a inactivo todos los registros relacionados.')) {
      try {
        const response = await fetch(`http://localhost:3000/ventas/${id_venta}/estado`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ estado: 'inactivo' })
        });

        if (!response.ok) {
          throw new Error('Error al cambiar el estado de la venta');
        }

        alert('Se ha cambiado el estado exitosamente');
        // Recargar la lista de ventas
        const ventasResponse = await fetch('http://localhost:3000/ventas');
        const ventasData = await ventasResponse.json();
        setVentas(ventasData);
      } catch (error) {
        console.error('Error:', error);
        alert('Error al cambiar el estado de la venta: ' + error.message);
      }
    }
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
              id_venta={datosVenta.id_venta}
            />
          )}

          {paso === 'envio' && (
            <EnvioForm
              onSubmit={handleEnvioSubmit}
              setPaso={setPaso}
              id_orden={ordenId}
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
                    <td>{venta.id_venta}</td>
                    <td>{new Date(venta.fecha_venta).toLocaleString()}</td>
                    <td>{venta.cliente}</td>
                    <td>${venta.total}</td>
                    <td>
                      <span className={`estado ${venta.estado_venta}`}>{venta.estado_venta}</span>
                    </td>
                    <td className="actions-cell">
                      <button className="action-button view">Ver Detalles</button>
                      <button className="action-button edit">Editar</button>
                      <button 
                        className="action-button delete"
                        onClick={() => handleDelete(venta.id_venta)}
                      >
                        Eliminar
                      </button>
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