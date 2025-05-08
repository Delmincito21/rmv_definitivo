
import React from 'react';

export default function ProductAdmi() {
  return (
    <div className="product-admin-dashboard">
      <h2>Panel de Administración de Productos</h2>
      <div className="dashboard-actions">
        <button
          className="dashboard-btn"
          onClick={() => {
            // Lógica para mostrar el formulario de agregar producto
            alert('Mostrar formulario para agregar producto');
          }}
        >
          Agregar Producto
        </button>
        <button
          className="dashboard-btn"
          onClick={() => {
            // Lógica para mostrar la lista de productos para modificar
            alert('Mostrar lista para modificar productos');
          }}
        >
          Modificar Productos
        </button>
        <button
          className="dashboard-btn"
          onClick={() => {
            // Lógica para mostrar productos disponibles
            alert('Mostrar productos disponibles');
          }}
        >
          Ver Productos Disponibles
        </button>
      </div>
      {/* Aquí puedes renderizar condicionalmente los componentes o formularios según la acción seleccionada */}
      <div className="dashboard-content">
        {/* Ejemplo: <AgregarProductoForm />, <ModificarProductoList />, <ProductosDisponiblesList /> */}
      </div>
    </div>
  );
}
