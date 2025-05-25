import React, { useState, useEffect } from 'react';
import './EditarVentaModal.css';

const EditarVentaModal = ({ isOpen, onClose, ventaId, onVentaUpdate }) => {
  const [activeTab, setActiveTab] = useState('venta');
  const [ventaData, setVentaData] = useState(null);
  const [detalleVentaData, setDetalleVentaData] = useState(null);
  const [pagoData, setPagoData] = useState(null);
  const [ordenData, setOrdenData] = useState(null);
  const [envioData, setEnvioData] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [currentEnvioId, setCurrentEnvioId] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      if (!isOpen || !ventaId) return;

      setLoadingData(true);
      try {
        // Cargar venta
        const ventaRes = await fetch(`http://localhost:3000/ventas/${ventaId}`);
        if (!ventaRes.ok) throw new Error('Error al obtener la venta');
        const ventaData = await ventaRes.json();
        console.log('1. Datos de venta cargados:', { ventaId, ventaData });
        
        if (ventaData && ventaData.fecha_venta) {
          const fecha = new Date(ventaData.fecha_venta);
          ventaData.fecha_venta = fecha.toISOString().slice(0, 16);
        }
        setVentaData(ventaData || {});

        // Cargar detalles
        const detallesRes = await fetch(`http://localhost:3000/detalle-ventas/venta/${ventaId}`);
        if (!detallesRes.ok) throw new Error('Error al obtener los detalles');
        const detallesData = await detallesRes.json();
        console.log('2. Detalles de venta cargados:', detallesData);
        setDetalleVentaData(Array.isArray(detallesData) ? detallesData : []);

        // Cargar pago
        const pagoRes = await fetch(`http://localhost:3000/pago/venta/${ventaId}`);
        if (!pagoRes.ok) throw new Error('Error al obtener el pago');
        const pagoData = await pagoRes.json();
        console.log('3. Datos de pago cargados:', pagoData);
        if (pagoData && pagoData.length > 0) {
          const pago = pagoData[0];
          if (pago.fecha_pago) {
            const fechaPago = new Date(pago.fecha_pago);
            pago.fecha_pago = fechaPago.toISOString().slice(0, 16);
          }
          setPagoData(pago);
        } else {
          setPagoData({});
        }

        // Cargar orden
        const ordenRes = await fetch(`http://localhost:3000/orden/venta/${ventaId}`);
        if (!ordenRes.ok) throw new Error('Error al obtener la orden');
        const ordenData = await ordenRes.json();
        console.log('4. Datos de orden cargados:', ordenData);
        setOrdenData(ordenData || {});

        // Cargar envío si existe orden
        if (ordenData && ordenData.id_orden) {
          const envioRes = await fetch(`http://localhost:3000/envios/orden/${ordenData.id_orden}`);
          if (envioRes.ok) {
            const envioData = await envioRes.json();
            console.log('5. Datos de envío cargados:', envioData);
            if (envioData && envioData.fecha_estimada_envio) {
              const fechaEnvio = new Date(envioData.fecha_estimada_envio);
              envioData.fecha_estimada_envio = fechaEnvio.toISOString().slice(0, 16);
            }
            setEnvioData(envioData);
            setCurrentEnvioId(envioData.id_envio);
          }
        }
      } catch (error) {
        console.error('Error al cargar los datos:', error);
        alert('Error al cargar los datos: ' + error.message);
        setVentaData({});
        setDetalleVentaData([]);
        setPagoData({});
        setOrdenData({});
        setEnvioData({});
        setCurrentEnvioId(null);
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, [isOpen, ventaId]);

  const formatDateForMySQL = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toISOString().slice(0, 19).replace('T', ' ');
  };

  // Función para obtener el precio de un producto
  const obtenerPrecioProducto = async (idProducto) => {
    try {
      if (!idProducto) return 0;
      
      const response = await fetch(`http://localhost:3000/productos/${idProducto}/precio`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al obtener el precio');
      }
      const data = await response.json();
      return data.precio || 0;
    } catch (error) {
      console.error('Error al obtener precio:', error);
      return 0;
    }
  };

  // Función para recalcular el subtotal
  const recalcularSubtotal = (cantidad, precio) => {
    return (parseFloat(cantidad) || 0) * (parseFloat(precio) || 0);
  };

  // Función para manejar el cambio de producto
  const handleProductoChange = async (index, idProducto) => {
    const newDetalles = [...detalleVentaData];
    newDetalles[index] = {
      ...newDetalles[index],
      id_producto: idProducto
    };

    // Obtener el precio del nuevo producto
    const precio = await obtenerPrecioProducto(idProducto);
    newDetalles[index].precio_unitario_detalle_venta = precio;
    
    // Recalcular el subtotal
    newDetalles[index].subtotal_detalle_venta = recalcularSubtotal(
      newDetalles[index].cantidad_detalle_venta,
      precio
    );

    setDetalleVentaData(newDetalles);
  };

  // Función para manejar el cambio de cantidad
  const handleCantidadChange = (index, cantidad) => {
    const newDetalles = [...detalleVentaData];
    newDetalles[index] = {
      ...newDetalles[index],
      cantidad_detalle_venta: cantidad,
      subtotal_detalle_venta: recalcularSubtotal(
        cantidad,
        newDetalles[index].precio_unitario_detalle_venta
      )
    };
    setDetalleVentaData(newDetalles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let success = false;

      switch (activeTab) {
        case 'venta': {
          if (ventaData) {
            const ventaResponse = await fetch(`http://localhost:3000/ventas/${ventaId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id_usuario: parseInt(ventaData.id_usuario),
                fecha_venta: formatDateForMySQL(ventaData.fecha_venta),
                estado_venta: ventaData.estado_venta,
                estado: ventaData.estado || 'activo'
              })
            });

            if (!ventaResponse.ok) {
              const errorData = await ventaResponse.json();
              throw new Error(errorData.error || 'Error al actualizar la venta');
            }
            success = true;
          }
          break;
        }

        case 'detalleVenta': {
          if (detalleVentaData && detalleVentaData.length > 0) {
            try {
              console.log('Iniciando actualización de detalles:', {
                ventaId,
                detalles: detalleVentaData
              });

              // Obtener detalles existentes primero
              const checkResponse = await fetch(`http://localhost:3000/detalle-ventas/venta/${ventaId}`);
              if (!checkResponse.ok) {
                throw new Error('Error al verificar detalles existentes');
              }
              const detallesExistentes = await checkResponse.json();
              console.log('Detalles existentes:', detallesExistentes);

              // Actualizar cada detalle
              for (const detalle of detalleVentaData) {
                if (!detalle.id_producto) {
                  console.warn('Detalle sin ID de producto, saltando...');
                  continue;
                }

                const detalleParaEnviar = {
                  id_venta: parseInt(ventaId),
                  id_producto: parseInt(detalle.id_producto),
                  cantidad_detalle_venta: parseInt(detalle.cantidad_detalle_venta) || 0,
                  precio_unitario_detalle_venta: parseFloat(detalle.precio_unitario_detalle_venta) || 0,
                  subtotal_detalle_venta: parseFloat(detalle.subtotal_detalle_venta) || 0,
                  estado: detalle.estado || 'activo'
                };

                console.log('Enviando detalle para actualizar:', detalleParaEnviar);

                // Buscar si el detalle ya existe
                const detalleExistente = detallesExistentes.find(
                  d => d.id_producto === parseInt(detalle.id_producto)
                );

                if (detalleExistente) {
                  // Si la venta está completa, necesitamos manejar el stock
                  if (ventaData.estado_venta === 'completa') {
                    // Calcular la diferencia en cantidad
                    const diferenciaCantidad = detalleParaEnviar.cantidad_detalle_venta - detalleExistente.cantidad_detalle_venta;
                    
                    if (diferenciaCantidad !== 0) {
                      // Actualizar el stock del producto
                      const stockResponse = await fetch(`http://localhost:3000/productos/${detalle.id_producto}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          stock_producto: `stock_producto - ${diferenciaCantidad}`
                        })
                      });

                      if (!stockResponse.ok) {
                        throw new Error('Error al actualizar el stock del producto');
                      }
                    }
                  }

                  // Actualizar el detalle
                  const updateResponse = await fetch(`http://localhost:3000/detalle-ventas/${ventaId}/${detalle.id_producto}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(detalleParaEnviar)
                  });

                  if (!updateResponse.ok) {
                    const errorData = await updateResponse.json();
                    throw new Error(errorData.error || 'Error al actualizar el detalle de venta');
                  }
                } else {
                  // Si no existe, crear nuevo
                  const createResponse = await fetch('http://localhost:3000/detalle-ventas', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(detalleParaEnviar)
                  });

                  if (!createResponse.ok) {
                    const errorData = await createResponse.json();
                    throw new Error(errorData.error || 'Error al crear el detalle de venta');
                  }
                }
              }

              // Eliminar detalles que ya no existen en la nueva lista
              for (const detalleExistente of detallesExistentes) {
                const detalleSigueExistiendo = detalleVentaData.some(
                  d => parseInt(d.id_producto) === detalleExistente.id_producto
                );

                if (!detalleSigueExistiendo) {
                  // Si la venta está completa, devolver el stock
                  if (ventaData.estado_venta === 'completa') {
                    const stockResponse = await fetch(`http://localhost:3000/productos/${detalleExistente.id_producto}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        stock_producto: `stock_producto + ${detalleExistente.cantidad_detalle_venta}`
                      })
                    });

                    if (!stockResponse.ok) {
                      throw new Error('Error al devolver el stock del producto');
                    }
                  }

                  // Marcar como inactivo el detalle que ya no existe
                  const deleteResponse = await fetch(`http://localhost:3000/detalle-ventas/${ventaId}/${detalleExistente.id_producto}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      ...detalleExistente,
                      estado: 'inactivo'
                    })
                  });

                  if (!deleteResponse.ok) {
                    const errorData = await deleteResponse.json();
                    throw new Error(errorData.error || 'Error al eliminar el detalle de venta');
                  }
                }
              }

              // Actualizar la lista de ventas en el componente padre
              const ventasResponse = await fetch('http://localhost:3000/ventas');
              if (!ventasResponse.ok) {
                throw new Error('Error al actualizar la lista de ventas');
              }
              const ventasActualizadas = await ventasResponse.json();
              
              // Encontrar la venta actualizada
              const ventaActualizada = ventasActualizadas.find(v => v.id_venta === parseInt(ventaId));
              if (ventaActualizada) {
                // Actualizar el estado local con los nuevos datos
                setVentaData(prev => ({
                  ...prev,
                  ...ventaActualizada
                }));
                // Notificar al componente padre sobre la actualización
                onVentaUpdate(ventaActualizada);
              }

              success = true;
            } catch (error) {
              console.error('Error al actualizar detalles:', error);
              throw error;
            }
          }
          break;
        }

        case 'pago': {
          if (pagoData && pagoData.id_pago) {
            const pagoResponse = await fetch(`http://localhost:3000/pago/${pagoData.id_pago}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                monto_pago: parseFloat(pagoData.monto_pago),
                fecha_pago: formatDateForMySQL(pagoData.fecha_pago),
                metodo_pago: pagoData.metodo_pago,
                referencia: pagoData.referencia,
                banco_emisor: pagoData.banco_emisor,
                estado_pago: pagoData.estado_pago,
                estado: pagoData.estado || 'activo'
              })
            });
            success = pagoResponse.ok;
          }
          break;
        }

        case 'orden': {
          if (ordenData && ordenData.id_orden) {
            const ordenResponse = await fetch(`http://localhost:3000/orden/${ordenData.id_orden}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                total_orden: parseFloat(ordenData.total_orden),
                estado_orden: ordenData.estado_orden,
                fecha_orden: formatDateForMySQL(ordenData.fecha_orden),
                estado: ordenData.estado || 'activo'
              })
            });
            success = ordenResponse.ok;
          }
          break;
        }

        case 'envio': {
          if (!currentEnvioId) {
            alert('No hay un envío asociado a esta orden. Por favor, verifica que la orden tenga un envío válido.');
            return;
          }

          console.log('Actualizando envío:', {
            id: currentEnvioId,
            data: envioData
          });

          const envioResponse = await fetch(`http://localhost:3000/envios/${currentEnvioId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fecha_estimada_envio: formatDateForMySQL(envioData.fecha_estimada_envio),
              direccion_entrega_envio: envioData.direccion_entrega_envio,
              estado_envio: envioData.estado_envio || 'pendiente',
              estado: envioData.estado || 'activo'
            })
          });

          if (!envioResponse.ok) {
            const errorData = await envioResponse.json();
            throw new Error(errorData.message || errorData.error || 'Error al actualizar el envío');
          }

          const responseData = await envioResponse.json();
          console.log('Respuesta de actualización de envío:', responseData);
          success = true;
          break;
        }
      }

      if (success) {
        alert('Datos actualizados exitosamente');
        onClose();
      }
    } catch (error) {
      console.error('Error en la actualización:', error);
      alert(error.message);
    }
  };

  if (!isOpen) return null;

  if (loadingData) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Cargando datos...</h2>
          </div>
          <div className="modal-body" style={{ textAlign: 'center', padding: '20px' }}>
            <p>Por favor espere mientras se cargan los datos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Editar Venta #{ventaId}</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-tabs">
          <button 
            className={`tab-button ${activeTab === 'venta' ? 'active' : ''}`}
            onClick={() => setActiveTab('venta')}
          >
            Venta
          </button>
          <button 
            className={`tab-button ${activeTab === 'detalleVenta' ? 'active' : ''}`}
            onClick={() => setActiveTab('detalleVenta')}
          >
            Detalles
          </button>
          <button 
            className={`tab-button ${activeTab === 'pago' ? 'active' : ''}`}
            onClick={() => setActiveTab('pago')}
          >
            Pago
          </button>
          <button 
            className={`tab-button ${activeTab === 'orden' ? 'active' : ''}`}
            onClick={() => setActiveTab('orden')}
          >
            Orden
          </button>
          <button 
            className={`tab-button ${activeTab === 'envio' ? 'active' : ''}`}
            onClick={() => setActiveTab('envio')}
          >
            Envío
          </button>
        </div>

        <form onSubmit={handleSubmit} className="edit-form">
          {activeTab === 'venta' && (
            <div className="form-section">
              <div className="form-group">
                <label>ID Usuario</label>
                <input
                  type="number"
                  value={ventaData?.id_usuario || ''}
                  onChange={e => setVentaData({...ventaData, id_usuario: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Fecha Venta</label>
                <input
                  type="datetime-local"
                  value={ventaData?.fecha_venta || ''}
                  onChange={e => setVentaData({...ventaData, fecha_venta: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Estado Venta</label>
                <select
                  value={ventaData?.estado_venta || 'pendiente'}
                  onChange={e => setVentaData({...ventaData, estado_venta: e.target.value})}
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="completa">Completa</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'detalleVenta' && (
            <div className="form-section">
              {(detalleVentaData || []).map((detalle, index) => (
                <div key={index} className="detalle-item">
                  <div className="form-group">
                    <label>ID Producto</label>
                    <input
                      type="number"
                      value={detalle?.id_producto || ''}
                      onChange={e => handleProductoChange(index, e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Cantidad</label>
                    <input
                      type="number"
                      value={detalle?.cantidad_detalle_venta || ''}
                      onChange={e => handleCantidadChange(index, e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Precio Unitario</label>
                    <input
                      type="number"
                      value={detalle?.precio_unitario_detalle_venta || ''}
                      readOnly
                      style={{ backgroundColor: '#f0f0f0' }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Subtotal</label>
                    <input
                      type="number"
                      value={detalle?.subtotal_detalle_venta || ''}
                      readOnly
                      style={{ backgroundColor: '#f0f0f0' }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Estado</label>
                    <select
                      value={detalle?.estado || 'activo'}
                      onChange={e => {
                        const newDetalles = [...detalleVentaData];
                        newDetalles[index] = {...detalle, estado: e.target.value};
                        setDetalleVentaData(newDetalles);
                      }}
                    >
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
                  </div>
                </div>
              ))}
              {(!detalleVentaData || detalleVentaData.length === 0) && (
                <p>No hay detalles de venta disponibles</p>
              )}
              {/* Subtotal actualizado */}
              <div style={{ textAlign: 'right', marginTop: '16px', fontWeight: 'bold', fontSize: '1.1em' }}>
                Subtotal actualizado: $
                {detalleVentaData
                  ? detalleVentaData
                      .filter(d => d.estado !== 'inactivo')
                      .reduce((acc, d) => acc + (parseFloat(d.subtotal_detalle_venta) || 0), 0)
                      .toFixed(2)
                  : '0.00'}
              </div>
            </div>
          )}

          {activeTab === 'pago' && (
            <div className="form-section">
              <div className="form-group">
                <label>Monto</label>
                <input
                  type="number"
                  value={pagoData?.monto_pago || ''}
                  onChange={e => setPagoData({...pagoData, monto_pago: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Fecha Pago</label>
                <input
                  type="datetime-local"
                  value={pagoData?.fecha_pago?.slice(0, 16) || ''}
                  onChange={e => setPagoData({...pagoData, fecha_pago: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Método de Pago</label>
                <select
                  value={pagoData?.metodo_pago || 'TRANSFERENCIA'}
                  onChange={e => setPagoData({...pagoData, metodo_pago: e.target.value})}
                >
                  <option value="TRANSFERENCIA">Transferencia</option>
                  <option value="EFECTIVO">Efectivo</option>
                  <option value="TARJETA">Tarjeta</option>
                </select>
              </div>
              <div className="form-group">
                <label>Referencia</label>
                <input
                  type="text"
                  value={pagoData?.referencia || ''}
                  onChange={e => setPagoData({...pagoData, referencia: e.target.value})}
                  placeholder="Número de referencia"
                />
              </div>
              <div className="form-group">
                <label>Banco Emisor</label>
                <input
                  type="text"
                  value={pagoData?.banco_emisor || ''}
                  onChange={e => setPagoData({...pagoData, banco_emisor: e.target.value})}
                  placeholder="Nombre del banco"
                />
              </div>
              <div className="form-group">
                <label>Estado del Pago</label>
                <select
                  value={pagoData?.estado_pago || 'PENDIENTE'}
                  onChange={e => setPagoData({...pagoData, estado_pago: e.target.value})}
                >
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="COMPLETADO">Completado</option>
                  <option value="FALLIDO">Fallido</option>
                </select>
              </div>
              <div className="form-group">
                <label>Estado</label>
                <select
                  value={pagoData?.estado || 'activo'}
                  onChange={e => setPagoData({...pagoData, estado: e.target.value})}
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'orden' && (
            <div className="form-section">
              <div className="form-group">
                <label>Total Orden</label>
                <input
                  type="number"
                  value={ordenData?.total_orden || ''}
                  onChange={e => setOrdenData({...ordenData, total_orden: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Estado Orden</label>
                <select
                  value={ordenData?.estado_orden || 'pendiente'}
                  onChange={e => setOrdenData({...ordenData, estado_orden: e.target.value})}
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="procesando">Procesando</option>
                  <option value="completada">Completada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
              <div className="form-group">
                <label>Fecha Orden</label>
                <input
                  type="datetime-local"
                  value={ordenData?.fecha_orden?.slice(0, 16) || ''}
                  onChange={e => setOrdenData({...ordenData, fecha_orden: e.target.value})}
                />
              </div>
            </div>
          )}

          {activeTab === 'envio' && (
            <div className="form-section">
              <div className="form-group">
                <label>ID Envío (Solo lectura)</label>
                <input
                  type="text"
                  value={currentEnvioId || ''}
                  disabled
                  style={{ backgroundColor: '#f0f0f0' }}
                />
              </div>
              <div className="form-group">
                <label>Fecha Estimada de Envío</label>
                <input
                  type="datetime-local"
                  value={envioData?.fecha_estimada_envio || ''}
                  onChange={e => setEnvioData({...envioData, fecha_estimada_envio: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Dirección de Entrega</label>
                <input
                  type="text"
                  value={envioData?.direccion_entrega_envio || ''}
                  onChange={e => setEnvioData({...envioData, direccion_entrega_envio: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Provincia</label>
                <select
                  value={envioData?.provincia_envio || ''}
                  onChange={e => setEnvioData({...envioData, provincia_envio: e.target.value})}
                >
                  <option value="">Seleccione una provincia</option>
                  <option value="Santiago">Santiago</option>
                  <option value="Santo Domingo">Santo Domingo</option>
                </select>
              </div>
              <div className="form-group">
                <label>Estado del Envío</label>
                <select
                  value={envioData?.estado_envio || 'pendiente'}
                  onChange={e => setEnvioData({...envioData, estado_envio: e.target.value})}
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en_proceso">En Proceso</option>
                  <option value="enviado">Enviado</option>
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