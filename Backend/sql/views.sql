-- Vista de clientes activos
CREATE OR REPLACE VIEW vw_clientes_activos AS
SELECT COUNT(*) as clientes_activos
FROM clientes
WHERE estado = 'activo';

-- Vista de pedidos del mes actual
CREATE OR REPLACE VIEW vw_pedidos_mes_actual AS
SELECT COUNT(*) as pedidos_mes
FROM venta
WHERE MONTH(fecha_venta) = MONTH(CURRENT_DATE())
AND YEAR(fecha_venta) = YEAR(CURRENT_DATE())
AND estado = 'activo';

-- Vista de ingresos mensuales
CREATE OR REPLACE VIEW vw_ingresos_mensuales AS
SELECT COALESCE(SUM(dv.subtotal_detalle_venta), 0) as ingresos_mensuales
FROM venta v
JOIN detalle_venta dv ON v.id_venta = dv.id_venta
WHERE MONTH(v.fecha_venta) = MONTH(CURRENT_DATE())
AND YEAR(v.fecha_venta) = YEAR(CURRENT_DATE())
AND v.estado = 'activo';

-- Vista de próximos envíos
CREATE OR REPLACE VIEW vw_proximos_envios AS
SELECT 
    e.id_envio,
    o.id_orden,
    c.nombre_clientes AS cliente,
    e.direccion_entrega_envio AS direccion,
    DATE_FORMAT(e.fecha_estimada_envio, '%d/%m/%y') AS fecha_entrega,
    TIME_FORMAT(e.fecha_estimada_envio, '%h:%i %p') AS hora_entrega,
    CONCAT(
        DATE_FORMAT(e.fecha_estimada_envio, '%d/%m/%y'), 
        ' - ', 
        TIME_FORMAT(e.fecha_estimada_envio, '%h:%i %p')
    ) AS entrega_completa
FROM 
    envios e
JOIN 
    orden o ON e.id_orden = o.id_orden
JOIN 
    clientes c ON o.id_usuario = c.id_clientes
WHERE 
    DATE(e.fecha_estimada_envio) = CURDATE()
    AND e.estado_envio = 'pendiente'
    AND e.estado = 'activo'
ORDER BY 
    e.fecha_estimada_envio ASC; 