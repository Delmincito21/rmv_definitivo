import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaMinus, FaPlus, FaArrowLeft, FaCreditCard, FaTruck } from 'react-icons/fa';
import './Ventas.css';
import EditarVentaModal from './components/EditarVentaModal';
import { useNavigate } from 'react-router-dom';

// Componente de Pago
const PagoForm = ({ total, onSubmit, setPaso, id_venta }) => {
  const [datosPago, setDatosPago] = useState({
    monto_pago: total || 0,
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

    if (!datosPago.monto_pago) {
      nuevosErrores.monto_pago = 'El monto es requerido';
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
        <div className={`form-field ${errores.monto_pago ? 'error' : ''}`}>
          <label>Monto</label>
          <input
            type="number"
            value={datosPago.monto_pago}
            onChange={(e) => setDatosPago({ ...datosPago, monto_pago: e.target.value })}
            placeholder="0.00"
            step="0.01"
          />
          {errores.monto_pago && <div className="error-message">{errores.monto_pago}</div>}
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

  const handleVolver = async () => {
    try {
      // Guardar los datos del envío antes de volver
      if (datosEnvio.id_orden) {
        const response = await fetch(`http://localhost:3000/envios/${datosEnvio.id_orden}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(datosEnvio)
        });

        if (!response.ok) {
          throw new Error('Error al actualizar el envío');
        }
      }
      setPaso('pago');
    } catch (error) {
      console.error('Error al volver:', error);
      alert('Error al guardar los cambios: ' + error.message);
    }
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
    total: 0,
    id_venta: null
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

  const [paso, setPaso] = useState('venta');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [ventas, setVentas] = useState([]);
  const [ventasFiltradas, setVentasFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ordenId, setOrdenId] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedVentaId, setSelectedVentaId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [datosPagoActual, setDatosPagoActual] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/ventas')
      .then(res => res.json())
      .then(data => {
        console.log('Ventas obtenidas del backend:', data);
        setVentas(data);
        setVentasFiltradas(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al cargar las ventas:', err);
        setError('No se pudo cargar la lista de ventas');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setVentasFiltradas(ventas);
      return;
    }

    const termLower = searchTerm.toLowerCase();
    const filtered = ventas.filter(venta => {
      const fechaVenta = new Date(venta.fecha_venta).toLocaleDateString();
      return (
        venta.id_venta.toString().includes(termLower) ||
        venta.cliente.toLowerCase().includes(termLower) ||
        fechaVenta.includes(termLower)
      );
    });
    setVentasFiltradas(filtered);
  }, [searchTerm, ventas]);

  const calcularSubtotal = (detalle) => {
    const cantidad = parseFloat(detalle.cantidad) || 0;
    const precio = parseFloat(detalle.precio) || 0;
    return Number((cantidad * precio).toFixed(2));
  };

  const calcularTotal = () => {
    return detalles.reduce((total, detalle) => total + calcularSubtotal(detalle), 0);
  };

  const handleDetalleChange = async (index, campo, valor) => {
    const nuevosDetalles = [...detalles];
    nuevosDetalles[index] = {
      ...nuevosDetalles[index],
      [campo]: valor
    };

    // Si el campo que cambió es id_producto, obtener el precio automáticamente
    if (campo === 'id_producto' && valor) {
      try {
        const response = await fetch(`http://localhost:3000/productos/${valor}/precio`);
        if (response.ok) {
          const data = await response.json();
          nuevosDetalles[index].precio = data.precio;
        } else {
          console.error('Error al obtener el precio del producto');
        }
      } catch (error) {
        console.error('Error al obtener el precio:', error);
      }
    }

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
        let idVenta = datosVenta.id_venta;

        if (!idVenta) {
          // Si no hay ID de venta, crear una nueva
          const ventaParaEnviar = {
            id_usuario: parseInt(datosVenta.id_usuario),
            fecha_venta: datosVenta.fecha_venta,
            estado_venta: datosVenta.estado_venta,
            estado: 'activo',
            detalles: detalles.map(detalle => ({
              id_producto: parseInt(detalle.id_producto),
              cantidad_detalle_venta: parseInt(detalle.cantidad),
              precio_unitario_detalle_venta: parseFloat(detalle.precio),
              subtotal_detalle_venta: parseFloat(detalle.subtotal),
              estado: 'activo'
            }))
          };

          const ventaResponse = await fetch('http://localhost:3000/ventas', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(ventaParaEnviar)
          });

          const responseData = await ventaResponse.json();
          if (!ventaResponse.ok) {
            throw new Error(responseData.details || responseData.error || 'Error al crear la venta');
          }
          idVenta = responseData.id || responseData.insertId;
        } else {
          // Actualizar venta existente
          const ventaParaEnviar = {
            id_usuario: parseInt(datosVenta.id_usuario),
            fecha_venta: datosVenta.fecha_venta,
            estado_venta: datosVenta.estado_venta,
            estado: 'activo',
            detalles: detalles.map(detalle => ({
              id_producto: parseInt(detalle.id_producto),
              cantidad_detalle_venta: parseInt(detalle.cantidad),
              precio_unitario_detalle_venta: parseFloat(detalle.precio),
              subtotal_detalle_venta: parseFloat(detalle.subtotal),
              estado: 'activo'
            }))
          };

          const ventaResponse = await fetch(`http://localhost:3000/ventas/${idVenta}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(ventaParaEnviar)
          });

          if (!ventaResponse.ok) {
            const errorData = await ventaResponse.json();
            throw new Error(errorData.details || errorData.error || 'Error al actualizar la venta');
          }
        }

        setDatosVenta(prev => ({ ...prev, id_venta: idVenta }));
        setPaso('pago');
      } catch (error) {
        console.error('Error completo:', error);
        alert(error.message);
        return; // No continuar si hay error
      }
    }
  };

  const handlePagoSubmit = async (datosPago) => {
    try {
      let idPago = datosPagoActual?.id_pago;

      if (!idPago) {
        // Crear nuevo pago
        const response = await fetch('http://localhost:3000/pagos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(datosPago)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || errorData.error || 'Error al procesar el pago');
        }

        const pagoResponse = await response.json();
        idPago = pagoResponse.id;
        setDatosPagoActual({ ...datosPago, id_pago: idPago });
      } else {
        // Actualizar pago existente
        const response = await fetch(`http://localhost:3000/pagos/${idPago}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(datosPago)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || errorData.error || 'Error al actualizar el pago');
        }
      }

      // Crear la orden con estado "completada"
      const ordenData = {
        id_usuario: parseInt(datosVenta.id_usuario),
        id_venta: datosVenta.id_venta,
        total_orden: datosPago.monto_pago,
        estado_orden: 'completada',
        fecha_orden: datosVenta.fecha_venta,
        estado: 'activo'
      };

      const ordenResponse = await fetch('http://localhost:3000/orden', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ordenData)
      });

      if (!ordenResponse.ok) {
        const errorData = await ordenResponse.json();
        throw new Error(errorData.details || errorData.error || 'Error al crear la orden');
      }

      const ordenResult = await ordenResponse.json();
      setOrdenId(ordenResult.id);
      setPaso('envio');

    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
      return; // No continuar si hay error
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

  const handleVolverAVenta = async () => {
    try {
      // Primero guardar los cambios actuales
      if (datosVenta.id_venta) {
        // Actualizar la venta
        const ventaResponse = await fetch(`http://localhost:3000/ventas/${datosVenta.id_venta}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id_usuario: parseInt(datosVenta.id_usuario),
            fecha_venta: datosVenta.fecha_venta,
            estado_venta: datosVenta.estado_venta,
            estado: 'activo'
          })
        });

        if (!ventaResponse.ok) throw new Error('Error al actualizar la venta');

        // Actualizar los detalles
        for (const detalle of detalles) {
          const detalleParaEnviar = {
            id_venta: datosVenta.id_venta,
            id_producto: parseInt(detalle.id_producto),
            cantidad_detalle_venta: parseInt(detalle.cantidad),
            precio_unitario_detalle_venta: parseFloat(detalle.precio),
            subtotal_detalle_venta: parseFloat(detalle.subtotal),
            estado: 'activo'
          };

          await fetch(`http://localhost:3000/detalle-ventas/${datosVenta.id_venta}/${detalle.id_producto}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(detalleParaEnviar)
          });
        }
      }

      // Cargar los datos actualizados
      const ventaResponse = await fetch(`http://localhost:3000/ventas/${datosVenta.id_venta}`);
      if (!ventaResponse.ok) throw new Error('Error al cargar la venta');
      const ventaData = await ventaResponse.json();

      const detallesResponse = await fetch(`http://localhost:3000/detalle-ventas/venta/${datosVenta.id_venta}`);
      if (!detallesResponse.ok) throw new Error('Error al cargar los detalles');
      const detallesData = await detallesResponse.json();

      setDatosVenta({
        ...ventaData,
        fecha_venta: new Date(ventaData.fecha_venta).toISOString().slice(0, 16)
      });

      setDetalles(detallesData.map(detalle => ({
        id_producto: detalle.id_producto,
        cantidad: detalle.cantidad_detalle_venta,
        precio: parseFloat(detalle.precio_unitario_detalle_venta),
        subtotal: parseFloat(detalle.subtotal_detalle_venta) || 0
      })));

      setPaso('venta');
    } catch (error) {
      console.error('Error al cargar los datos de la venta:', error);
      alert('Error al cargar los datos de la venta: ' + error.message);
    }
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

  const handleEdit = (ventaId) => {
    setSelectedVentaId(ventaId);
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
    setSelectedVentaId(null);
    // Recargar la lista de ventas
    fetch('http://localhost:3000/ventas')
      .then(res => res.json())
      .then(data => {
        setVentas(data);
        setVentasFiltradas(data);
      })
      .catch(err => {
        console.error('Error al recargar las ventas:', err);
      });
  };

  const handleVentaUpdate = (ventaActualizada) => {
    setVentas(prevVentas => {
      const nuevasVentas = prevVentas.map(venta =>
        venta.id_venta === ventaActualizada.id_venta ? ventaActualizada : venta
      );
      setVentasFiltradas(nuevasVentas);
      return nuevasVentas;
    });
  };

  return (
    <div className="ventas-container">
      <div className="dashboard-header">
        <h1 className="page-title">Gestión de Ventas</h1>
        <div className="actions-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar por ID, cliente o fecha..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button
            className="add-button"
            onClick={() => setMostrarFormulario(true)}
          >
            <FaPlus /> Nueva Venta
          </button>
        </div>
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
              ) : ventasFiltradas.length > 0 ? (
                ventasFiltradas.map((venta, index) => (
                  <tr key={index}>
                    <td>{venta.id_venta}</td>
                    <td>{new Date(venta.fecha_venta).toLocaleString()}</td>
                    <td>{venta.cliente}</td>
                    <td>${venta.total}</td>
                    <td>
                      <span className={`estado ${venta.estado_venta}`}>{venta.estado_venta}</span>
                    </td>
                    <td className="actions-cell">
                      <button
                        className="action-button view"
                        onClick={() => navigate(`/factura/${venta.id_venta}`, { state: { volverA: '/Ventas' } })}
                      >
                        Ver Detalles
                      </button>
                      <button
                        className="action-button edit"
                        onClick={() => handleEdit(venta.id_venta)}
                      >
                        Editar
                      </button>
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
                  <td colSpan="6">No se encontraron ventas</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <EditarVentaModal
        isOpen={modalIsOpen}
        onClose={handleCloseModal}
        ventaId={selectedVentaId}
        onVentaUpdate={handleVentaUpdate}
      />
    </div>
  );
};

export default Ventas;