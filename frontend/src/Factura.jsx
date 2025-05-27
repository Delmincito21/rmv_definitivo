import React, { useState, useEffect } from 'react';
import './Factura.css';
import logo from './imagenes/lgo.png';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const Factura = ({ venta, id_venta: propIdVenta }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const [facturaVenta, setFacturaVenta] = useState(null);
    const [pago, setPago] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [envio, setEnvio] = useState(null);

    useEffect(() => {
        const fetchVentaData = async () => {
            try {
                // 1. Determinar el ID de la venta
                let id_venta = propIdVenta || (venta && venta.id_venta);
                if (!id_venta) {
                    const stored = localStorage.getItem('facturaData');
                    if (stored) {
                        const storedVenta = JSON.parse(stored);
                        id_venta = storedVenta.id_venta;
                    }
                }
                if (!id_venta && params.id_venta) {
                    id_venta = params.id_venta;
                }
                if (!id_venta) {
                    setError('No se encontró el ID de la venta para la factura.');
                    setLoading(false);
                    return;
                }

                // 2. Obtener la venta
                const ventaResponse = await fetch(`http://localhost:3000/ventas/${id_venta}`);
                if (!ventaResponse.ok) throw new Error('Error al obtener los detalles de la venta');
                const ventaArray = await ventaResponse.json();
                const ventaInfo = Array.isArray(ventaArray) ? ventaArray[0] : ventaArray;

                // 3. Obtener los detalles de los productos
                const detallesResponse = await fetch(`http://localhost:3000/detalle-ventas/venta/${id_venta}`);
                let detallesData = [];
                try {
                    if (!detallesResponse.ok) {
                        // Si es 404, simplemente no hay detalles, no es un error fatal
                        if (detallesResponse.status === 404) {
                            detallesData = [];
                        } else {
                            throw new Error('Error al obtener los detalles de los productos');
                        }
                    } else {
                        detallesData = await detallesResponse.json();
                    }
                } catch {
                    detallesData = [];
                }

                // 4. Para cada detalle, obtener el nombre del producto
                detallesData = await Promise.all(detallesData.map(async (detalle) => {
                    let nombreProducto = 'Producto no especificado';
                    let garantiaProducto = 'No especificado';
                    try {
                        const productoResponse = await fetch(`http://localhost:3000/productos/${detalle.id_producto}`);
                        if (productoResponse.ok) {
                            const productoData = await productoResponse.json();
                            nombreProducto = productoData.nombre_producto || nombreProducto;
                            garantiaProducto = productoData.garantia || garantiaProducto;
                        }
                    } catch {
                        console.error('Error al obtener el producto:', detalle.id_producto);
                    }
                    return {
                        ...detalle,
                        producto: {
                            nombre: nombreProducto,
                            precio: detalle.precio_unitario_detalle_venta,
                            garantia: garantiaProducto
                        }
                    };
                }));

                // 5. Obtener la información del cliente directamente de la venta
                let clienteData = {
                    nombre_clientes: ventaInfo.nombre_clientes || ventaInfo.nombre_usuario || 'No especificado',
                    direccion_clientes: ventaInfo.direccion_clientes || 'No especificada',
                    telefono_clientes: ventaInfo.telefono_clientes || 'No especificado',
                    correo_clientes: ventaInfo.correo_clientes || 'No especificado'
                };

                // 6. Obtener la información del pago
                const pagoResponse = await fetch(`http://localhost:3000/pago/venta/${id_venta}`);
                const pagoArray = await pagoResponse.json();
                const pagoData = Array.isArray(pagoArray) ? pagoArray[0] : pagoArray;
                setPago(pagoData);

                // 7. Obtener la información del envío
                const ordenResponse = await fetch(`http://localhost:3000/orden/venta/${id_venta}`);
                if (ordenResponse.ok) {
                    const ordenData = await ordenResponse.json();
                    if (ordenData && ordenData.id_orden) {
                        const envioResponse = await fetch(`http://localhost:3000/envios/orden/${ordenData.id_orden}`);
                        if (envioResponse.ok) {
                            const envioData = await envioResponse.json();
                            setEnvio(envioData);
                            console.log('ENVÍO EN FACTURA:', envioData);
                        }
                    }
                }

                // 8. Calcular el total sumando los subtotales
                const total = detallesData.reduce((acc, d) => acc + (parseFloat(d.subtotal_detalle_venta) || 0), 0);
                // const itbis = total * 0.18;

                // 9. Construir el objeto completo de la factura
                const costoEnvio = envio ? getCostoEnvio(envio.provincia_envio) : 0;
                const facturaCompleta = {
                    ...ventaInfo,
                    cliente: clienteData,
                    detalles: detallesData,
                    metodo_pago: pagoData?.metodo_pago || 'No especificado',
                    total,
                    costoEnvio
                };

                setFacturaVenta(facturaCompleta);
                setLoading(false);
            } catch (error) {
                console.error('Error:', error);
                setError('Error al cargar los datos de la factura: ' + error.message);
                setLoading(false);
            }
        };

        fetchVentaData();
    }, [venta, propIdVenta, params.id_venta]);

    if (loading) return <div>Cargando factura...</div>;
    if (error) return <div>{error}</div>;
    if (!facturaVenta) return <div>No hay datos de factura.</div>;

    const formatDate = (date) => {
        const d = new Date(date);
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    };

    const formatCurrency = (amount) => {
        return `$${Number(amount).toFixed(2)}`;
    };

    const handlePrint = () => {
        window.print();
    };

    const handleGeneratePDF = async () => {
        const content = document.querySelector('.factura-content');
        if (!content) return;

        try {
            const canvas = await html2canvas(content);
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });

            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(`factura-${facturaVenta.id_venta}.pdf`);
        } catch (error) {
            console.error('Error al generar PDF:', error);
            alert('Error al generar el PDF. Por favor, intente nuevamente.');
        }
    };

    const handleVolver = () => {
        // Si viene con state, usa ese destino, si no, por defecto a /Ventas
        const destino = location.state?.volverA || '/Ventas';
        navigate(destino);
    };

    const getCostoEnvio = (provincia) => {
        if (!provincia) return 0;
        if (provincia === 'Santiago') return 500;
        if (provincia === 'Santo Domingo') return 1500;
        return 0;
    };

    const costoEnvio = envio ? getCostoEnvio(envio.provincia_envio) : 0;

    return (
        <div className="factura-container">
            <div className="factura-content">
                <div className="factura-header">
                    <div className="logo-section">
                        <img src={logo} alt="RefriElectric Martin Vasquez SRL" className="logo" />
                        <div>
                            <h1>RefriElectric Martin Vasquez SRL</h1>
                            <p style={{ fontWeight: 'bold', margin: 0 }}>RNC: 133-081-504</p>
                        </div>
                    </div>
                    <div className="factura-info">
                        <p><strong>Factura #:</strong> {facturaVenta.id_venta}</p>
                        <p><strong>Fecha:</strong> {formatDate(facturaVenta.fecha_venta)}</p>
                    </div>
                </div>

                <div className="cliente-info">
                    <h2>Información del Cliente</h2>
                    <div className="cliente-details">
                        <div style={{ marginTop: 0 }}>
                            <p><strong>Cliente:</strong> {facturaVenta.cliente.nombre_clientes}</p>
                            <p><strong>Teléfono:</strong> {facturaVenta.cliente.telefono_clientes}</p>
                            <p><strong>Método de Pago:</strong> {facturaVenta.metodo_pago}</p>
                        </div>
                        <div style={{ marginTop: 8 }}>
                            <p><strong>Banco Emisor:</strong> {pago?.banco_emisor || 'No especificado'}</p>
                            <p><strong>ID Referencia:</strong> {pago?.referencia || 'No especificado'}</p>
                        </div>
                    </div>
                </div>

                <div className="productos-section">
                    <h2>Detalle de Productos</h2>
                    {facturaVenta.detalles.length === 0 ? (
                        <p>No hay productos asociados a esta venta.</p>
                    ) : (
                        <table className="productos-table">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Precio Unitario</th>
                                    <th style={{ minWidth: 120 }}>Garantía</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {facturaVenta.detalles.map((detalle, index) => (
                                    <tr key={index}>
                                        <td>{detalle.producto.nombre}</td>
                                        <td>{detalle.cantidad_detalle_venta}</td>
                                        <td>{formatCurrency(detalle.precio_unitario_detalle_venta)}</td>
                                        <td>{detalle.producto.garantia || 'No especificado'}</td>
                                        <td>{formatCurrency(detalle.subtotal_detalle_venta)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="totales-section">
                    <div className="total-row">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(facturaVenta.total)}</span>
                    </div>
                    <div className="total-row">
                        <span>ITBIS:</span>
                        <span>{formatCurrency(facturaVenta.total * 0.18)}</span>
                    </div>
                    <div className="total-row">
                        <span>Envío:</span>
                        <span>{formatCurrency(costoEnvio)}</span>
                    </div>
                    <div className="total-row">
                        <span><strong>Total:</strong></span>
                        <span><strong>{formatCurrency(facturaVenta.total + costoEnvio)}</strong></span>
                    </div>
                </div>

                <div className="factura-footer">
                    <p>¡Gracias por su compra!</p>
                    <p>Para cualquier consulta, contáctenos al: (809) 401-1312</p>
                    <p>Email: refrielectricmv@gmail.com</p>
                </div>

                <div className="factura-buttons">
                    <button className="action-button print" onClick={handlePrint}>
                        Imprimir
                    </button>
                    <button className="action-button pdf" onClick={handleGeneratePDF}>
                        Generar PDF
                    </button>
                    <button className="action-button close" onClick={handleVolver}>
                        Volver
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Factura;