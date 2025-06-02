import React, { useState, useEffect } from 'react';
import './EditarVentaModal.css';

// Función auxiliar para formatear fechas a MySQL
const formatDateForMySQL = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toISOString().slice(0, 19).replace('T', ' ');
};

const EditarVentaModal = ({ isOpen, onClose, ventaId, onVentaUpdate }) => {
  // Estados para todos los datos consolidados
  const [ventaData, setVentaData] = useState(null);
  const [detalleVentaData, setDetalleVentaData] = useState(null);
  const [pagoData, setPagoData] = useState(null);
  const [ordenData, setOrdenData] = useState(null);
  const [envioData, setEnvioData] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [motivoCancelacion, setMotivoCancelacion] = useState('');

  // Cargar todos los datos al abrir el modal
  useEffect(() => {
    const loadData = async () => {
      if (!isOpen || !ventaId) return;

      setLoadingData(true);
      try {
        // Cargar Venta
        const ventaRes = await fetch(`https://backend-production-6925.up.railway.app/ventas/${ventaId}`);
        if (!ventaRes.ok) throw new Error('Error al obtener la venta');
        const ventaData = await ventaRes.json();
        setVentaData(ventaData || {});
        setMotivoCancelacion(ventaData?.motivo_cancelacion || '');

        // Cargar Detalles
        const detallesRes = await fetch(`https://backend-production-6925.up.railway.app/detalle-ventas/venta/${ventaId}`);
        if (!detallesRes.ok) throw new Error('Error al obtener los detalles');
        const detallesData = await detallesRes.json();
        setDetalleVentaData(Array.isArray(detallesData) ? detallesData : []);

        // Cargar Pago
        const pagoRes = await fetch(`https://backend-production-6925.up.railway.app/pago/venta/${ventaId}`);
        if (!pagoRes.ok) throw new Error('Error al obtener el pago');
        const pagoArray = await pagoRes.json();
        setPagoData(Array.isArray(pagoArray) && pagoArray.length > 0 ? pagoArray[0] : {});

        // Cargar Orden
        const ordenRes = await fetch(`https://backend-production-6925.up.railway.app/orden/venta/${ventaId}`);
        if (!ordenRes.ok) throw new Error('Error al obtener la orden');
        const ordenData = await ordenRes.json();
        setOrdenData(ordenData || {});

        // Cargar Envío si existe orden
        if (ordenData && ordenData.id_orden) {
          const envioRes = await fetch(`https://backend-production-6925.up.railway.app/envios/orden/${ordenData.id_orden}`);
          if (envioRes.ok) {
            const envioData = await envioRes.json();
            setEnvioData(envioData || {});
          } else {
             setEnvioData({}); // Inicializar si no hay envío
          }
        } else {
           setEnvioData({}); // Inicializar si no hay orden
        }

      } catch (error) {
        console.error('Error al cargar los datos:', error);
        // Considerar mostrar un mensaje de error al usuario
        setVentaData({});
        setDetalleVentaData([]);
        setPagoData({});
        setOrdenData({});
        setEnvioData({});
      } finally {
        setLoadingData(false);
      }
    };

    if (isOpen) {
      loadData();
    } else {
      // Limpiar estados al cerrar el modal
      setVentaData(null);
      setDetalleVentaData(null);
      setPagoData(null);
      setOrdenData(null);
      setEnvioData(null);
      setMotivoCancelacion('');
      setLoadingData(true);
    }

  }, [isOpen, ventaId]);

  // Función para obtener el precio de un producto (puede ser necesaria para detalles)
  const obtenerPrecioProducto = async (idProducto) => {
    try {
      if (!idProducto) return 0;
      const response = await fetch(`https://backend-production-6925.up.railway.app/productos/${idProducto}/precio`);
      if (!response.ok) throw new Error('Error al obtener el precio');
      const data = await response.json();
      return data.precio || 0;
    } catch (error) {
      console.error('Error al obtener precio:', error);
      return 0;
    }
  };

  // Función para recalcular el subtotal (necesario para detalles)
  const recalcularSubtotal = (cantidad, precio) => {
    return (parseFloat(cantidad) || 0) * (parseFloat(precio) || 0);
  };

  // Manejar cambio en los inputs (general)
  const handleInputChange = (section, field, value, index = null) => {
    if (section === 'detalle') {
        const newDetalles = [...detalleVentaData];
        newDetalles[index] = { ...newDetalles[index], [field]: value };

        // Recalcular subtotal si cambia cantidad o precio
        if (field === 'cantidad_detalle_venta' || field === 'precio_unitario_detalle_venta') {
             const cantidad = parseFloat(newDetalles[index].cantidad_detalle_venta) || 0;
             const precio = parseFloat(newDetalles[index].precio_unitario_detalle_venta) || 0;
             newDetalles[index].subtotal_detalle_venta = cantidad * precio;
        }
         setDetalleVentaData(newDetalles);
    } else if (section === 'venta') {
      if (field === 'estado_venta') {
          setVentaData({ ...ventaData, [field]: value });
          // Si el estado cambia a cancelada, mostrar/limpiar motivo
          if (value !== 'cancelada') {
              setMotivoCancelacion('');
          }
      } else {
          setVentaData({ ...ventaData, [field]: value });
      }
    } else if (section === 'pago') {
        setPagoData({ ...pagoData, [field]: value });
    } else if (section === 'orden') {
        setOrdenData({ ...ordenData, [field]: value });
    } else if (section === 'envio') {
        setEnvioData({ ...envioData, [field]: value });
    }
  };

  // Añadir nuevo detalle de venta (simple, necesitaría buscar producto real en una versión completa)
  const addDetalle = async () => {
      // Puedes agregar un detalle vacío o pre-llenado con un producto por defecto/buscado
      const newDetalle = {
          id_venta: ventaId,
          id_producto: null, // Requerir selección o input de producto
          cantidad_detalle_venta: 1,
          precio_unitario_detalle_venta: 0, // Se llenará al seleccionar producto
          subtotal_detalle_venta: 0,
          estado: 'activo'
      };
       setDetalleVentaData([...detalleVentaData, newDetalle]);
  };



  // Función para guardar todos los datos
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingData(true); // Mostrar loading durante el guardado
    try {

      // Validaciones (ej: motivo de cancelación si estado es cancelada)
      if (ventaData?.estado_venta === 'cancelada' && !motivoCancelacion) {
          alert('Se requiere un motivo de cancelación.');
          setLoadingData(false);
          return;
      }

      // --- Preparar Datos Consolidados para Enviar ---
      const detallesToProcess = (detalleVentaData || []).map(d => ({
           ...d,
           id_producto: parseInt(d.id_producto) || null,
           cantidad_detalle_venta: parseInt(d.cantidad_detalle_venta) || 0,
           precio_unitario_detalle_venta: parseFloat(d.precio_unitario_detalle_venta) || 0,
           subtotal_detalle_venta: parseFloat(d.subtotal_detalle_venta) || 0,
           id_venta: parseInt(ventaId)
      }));

      const consolidatedData = {
          ...ventaData, // Incluye id_usuario, fecha_venta, estado_venta, etc.
          fecha_venta: formatDateForMySQL(ventaData.fecha_venta), // Asegurar formato correcto
          motivo_cancelacion: ventaData?.estado_venta === 'cancelada' ? motivoCancelacion : null, // Incluir motivo condicionalmente
          detalles: detallesToProcess // Incluir el array de detalles
          // No necesitamos incluir pagoData, ordenData, envioData aquí
          // porque se actualizan en sus propios endpoints si tienen ID.
      };

      // --- 1. Actualizar Venta y Detalles (en una sola petición) ---
      const ventaUpdateResponse = await fetch(`https://backend-production-6925.up.railway.app/ventas/${ventaId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(consolidatedData) // Enviamos todos los datos consolidados
      });

      if (!ventaUpdateResponse.ok) {
           const errorData = await ventaUpdateResponse.json();
           throw new Error(errorData.error || errorData.message || 'Error al actualizar la venta y detalles');
      }


      // --- 2. Actualizar Pago (si existe) ---
      if (pagoData?.id_pago) {
          const pagoUpdateResponse = await fetch(`https://backend-production-6925.up.railway.app/pago/${pagoData.id_pago}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                   ...pagoData,
                  fecha_pago: formatDateForMySQL(pagoData.fecha_pago),
                   monto_pago: parseFloat(pagoData.monto_pago)
              })
          });
           // Puedes añadir verificación de pagoUpdateResponse.ok aquí si quieres validar cada uno.
      }

      // --- 3. Actualizar Orden (si existe) ---
      if (ordenData?.id_orden) {
          const ordenUpdateResponse = await fetch(`https://backend-production-6925.up.railway.app/orden/${ordenData.id_orden}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                   ...ordenData,
                  fecha_orden: formatDateForMySQL(ordenData.fecha_orden),
                   total_orden: parseFloat(ordenData.total_orden)
              })
          });
           // Puedes añadir verificación de ordenUpdateResponse.ok aquí.
      }

      // --- 4. Actualizar Envío (si existe) ---
      if (envioData?.id_envio) {
          const envioUpdateResponse = await fetch(`https://backend-production-6925.up.railway.app/envios/${envioData.id_envio}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  ...envioData,
                  fecha_estimada_envio: formatDateForMySQL(envioData.fecha_estimada_envio),
              })
          });
           // Puedes añadir verificación de envioUpdateResponse.ok aquí.
      }


      // Si todo fue bien
      alert('Venta actualizada exitosamente');
      // Recargar la venta actualizada y pasarla al padre para actualizar la tabla principal
      const updatedVentaRes = await fetch(`https://backend-production-6925.up.railway.app/ventas/${ventaId}`);
      if (updatedVentaRes.ok) {
          const updatedVentaData = await updatedVentaRes.json();
          // Asegurarse de que la fecha tiene el formato correcto para el estado local en el padre si es necesario
           if (updatedVentaData && updatedVentaData.fecha_venta) {
               const fecha = new Date(updatedVentaData.fecha_venta);
               updatedVentaData.fecha_venta = fecha.toISOString().slice(0, 16); // O el formato que espere el padre
           }
          if (onVentaUpdate) {
             onVentaUpdate(updatedVentaData); // Pasar los datos frescos al padre
          }
      } else {
           console.error('Error al recargar la venta después de actualizar.');
           // Considerar forzar una recarga completa o mostrar un aviso
      }

      onClose(); // Cerrar el modal

    } catch (error) {
      console.error('Error en la actualización consolidada:', error);
      alert('Error al actualizar la venta: ' + error.message);
    } finally {
        setLoadingData(false);
    }
  };

  // Renderizado del modal
  if (!isOpen) return null;

  if (loadingData) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Cargando datos de la venta...</h2>
          </div>
          <div className="modal-body" style={{ textAlign: 'center', padding: '20px' }}>
            <p>Por favor espere...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      {/* Aplicamos estilos en línea para controlar tamaño y apariencia */}
      <div style={{
        background: '#fff',
        borderRadius: 12,
        padding: 32,
        minWidth: 350,
        maxWidth: 500, // Ancho máximo similar al modal de MisPedidos
        boxShadow: '0 4px 24px #2563eb22', // Sombra similar
        position: 'relative',
        width: '90%', // Para ser responsive en pantallas más pequeñas
        maxHeight: '90vh', // Controlar altura máxima
        overflowY: 'auto' // Permitir scroll si el contenido es largo
      }}>
        <div className="modal-header">
          <h2>Editar Venta #{ventaId}</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        {/* Formulario Consolidado */}
        <form onSubmit={handleSubmit} className="edit-form">

          {/* Sección Venta */}
          <div className="form-section">
            <h3>Datos de la Venta</h3>
            <div className="form-group">
              <label>ID Usuario</label>
              <input type="number" value={ventaData?.id_usuario || ''} onChange={e => handleInputChange('venta', 'id_usuario', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Fecha Venta</label>
              <input type="datetime-local" value={ventaData?.fecha_venta ? new Date(ventaData.fecha_venta).toISOString().slice(0, 16) : ''} onChange={e => handleInputChange('venta', 'fecha_venta', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Estado Venta</label>
              <select value={ventaData?.estado_venta || 'pendiente'} onChange={e => handleInputChange('venta', 'estado_venta', e.target.value)}>
                <option value="pendiente">Pendiente</option>
                <option value="completa">Completa</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
            {ventaData?.estado_venta === 'cancelada' && (
              <div className="form-group">
                <label>Motivo de Cancelación:</label>
                <textarea value={motivoCancelacion} onChange={(e) => setMotivoCancelacion(e.target.value)} placeholder="Escribe aquí el motivo..." rows="2"></textarea>
              </div>
            )}
          </div>

          {/* Sección Detalles de Venta */}
          <div className="form-section">
            <h3>Detalles de Venta</h3>
            {(detalleVentaData || []).filter(d => d.estado !== 'inactivo').map((detalle, index) => ( // Mostrar solo detalles activos
              <div key={detalle.id_detalle_venta || `new-${index}`} className="detalle-item">
                <div className="form-group">
                  <label>ID Producto</label>
                  <input type="number" value={detalle?.id_producto || ''} onChange={e => handleInputChange('detalle', 'id_producto', e.target.value, index)} />
                </div>
                <div className="form-group">
                  <label>Cantidad</label>
                  <input type="number" value={detalle?.cantidad_detalle_venta || ''} onChange={e => handleInputChange('detalle', 'cantidad_detalle_venta', e.target.value, index)} />
                </div>
                <div className="form-group">
                   <label>Precio Unitario</label>
                   <input type="number" value={detalle?.precio_unitario_detalle_venta || ''} readOnly style={{ backgroundColor: '#f0f0f0' }} />
                </div>
                <div className="form-group">
                   <label>Subtotal</label>
                   <input type="number" value={detalle?.subtotal_detalle_venta || ''} readOnly style={{ backgroundColor: '#f0f0f0' }} />
                </div>
              </div>
            ))}
             <button type="button" onClick={addDetalle} style={{ background: 'green', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}>
                Añadir Producto
             </button>
          </div>

          {/* Sección Pago */}
           {pagoData && Object.keys(pagoData).length > 0 && (
              <div className="form-section">
                <h3>Datos del Pago</h3>
                 <div className="form-group">
                   <label>ID Pago (No editable)</label>
                   <input type="text" value={pagoData.id_pago || ''} readOnly style={{ backgroundColor: '#f0f0f0' }} />
                 </div>
                <div className="form-group">
                  <label>Monto</label>
                  <input type="number" value={pagoData?.monto_pago || ''} onChange={e => handleInputChange('pago', 'monto_pago', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Fecha Pago</label>
                  <input type="datetime-local" value={pagoData?.fecha_pago ? new Date(pagoData.fecha_pago).toISOString().slice(0, 16) : ''} onChange={e => handleInputChange('pago', 'fecha_pago', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Método de Pago</label>
                  <select value={pagoData?.metodo_pago || ''} onChange={e => handleInputChange('pago', 'metodo_pago', e.target.value)}>
                     <option value="TRANSFERENCIA">Transferencia</option>
                     <option value="PAYPAL">PAYPAL</option>
                   </select>
                </div>
                 <div className="form-group">
                   <label>Referencia (Pago)</label>
                   <input type="text" value={pagoData?.referencia || ''} onChange={e => handleInputChange('pago', 'referencia', e.target.value)} />
                 </div>
                 <div className="form-group">
                   <label>Banco Emisor</label>
                   <input type="text" value={pagoData?.banco_emisor || ''} onChange={e => handleInputChange('pago', 'banco_emisor', e.target.value)} />
                 </div>
                <div className="form-group">
                  <label>Estado del Pago</label>
                  <select value={pagoData?.estado_pago || ''} onChange={e => handleInputChange('pago', 'estado_pago', e.target.value)}>
                    <option value="">Seleccionar</option>
                    <option value="PENDIENTE">Pendiente</option>
                    <option value="COMPLETADO">Completado</option>
                    <option value="FALLIDO">Fallido</option>
                  </select>
                </div>
              </div>
           )}

          {/* Sección Orden */}
           {ordenData && Object.keys(ordenData).length > 0 && (
            <div className="form-section">
              <h3>Datos de la Orden</h3>
               <div className="form-group">
                 <label>ID Orden (No editable)</label>
                 <input type="text" value={ordenData.id_orden || ''} readOnly style={{ backgroundColor: '#f0f0f0' }} />
               </div>
              <div className="form-group">
                <label>Total Orden</label>
                <input type="number" value={ordenData?.total_orden || ''} onChange={e => handleInputChange('orden', 'total_orden', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Estado Orden</label>
                <select value={ordenData?.estado_orden || ''} onChange={e => handleInputChange('orden', 'estado_orden', e.target.value)}>
                   <option value="">Seleccionar</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="procesando">Procesando</option>
                  <option value="completada">Completada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
              <div className="form-group">
                <label>Fecha Orden</label>
                <input type="datetime-local" value={ordenData?.fecha_orden ? new Date(ordenData.fecha_orden).toISOString().slice(0, 16) : ''} onChange={e => handleInputChange('orden', 'fecha_orden', e.target.value)} />
              </div>
            </div>
           )}

          {/* Sección Envío */}
           {envioData && Object.keys(envioData).length > 0 && (
            <div className="form-section">
              <h3>Datos del Envío</h3>
               <div className="form-group">
                 <label>ID Envío (No editable)</label>
                 <input type="text" value={envioData.id_envio || ''} readOnly style={{ backgroundColor: '#f0f0f0' }} />
               </div>
              <div className="form-group">
                <label>Fecha Estimada de Envío</label>
                <input type="datetime-local" value={envioData?.fecha_estimada_envio ? new Date(envioData.fecha_estimada_envio).toISOString().slice(0, 16) : ''} onChange={e => handleInputChange('envio', 'fecha_estimada_envio', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Dirección de Entrega</label>
                <input type="text" value={envioData?.direccion_entrega_envio || ''} onChange={e => handleInputChange('envio', 'direccion_entrega_envio', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Provincia</label>
                <select value={envioData?.provincia_envio || ''} onChange={e => handleInputChange('envio', 'provincia_envio', e.target.value)}>
                  <option value="">Seleccionar una provincia</option>
                  <option value="Santiago">Santiago</option>
                  <option value="Santo Domingo">Santo Domingo</option>
                </select>
              </div>
              <div className="form-group">
                <label>Estado del Envío</label>
                <select value={envioData?.estado_envio || ''} onChange={e => handleInputChange('envio', 'estado_envio', e.target.value)}>
                   <option value="">Seleccionar</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="caminando">Caminando</option>
                  <option value="entregado">Entregado</option>
                </select>
              </div>
            </div>
           )}

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="save-btn">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarVentaModal; 