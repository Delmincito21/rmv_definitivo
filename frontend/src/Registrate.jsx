import { useState } from 'react';
import './app.css';

const RegistroCliente = () => {
  const [cliente, setCliente] = useState({
    nombre_cliente: '',
    apellido_cliente: '',
    cedula_cliente: '',
    telefono_cliente: '',
    direccion_cliente: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar los datos al servidor
    console.log('Cliente registrado:', cliente);
    alert('Cliente registrado con éxito!');
  };

  return (
    <div className="registro-cliente-container">
      <h2>Registro de Nuevo Cliente</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre_cliente">Nombre:</label>
          <input
            type="text"
            id="nombre_cliente"
            name="nombre_cliente"
            value={cliente.nombre_cliente}
            onChange={handleChange}
            required
            maxLength="50"
          />
        </div>

        <div className="form-group">
          <label htmlFor="apellido_cliente">Apellido:</label>
          <input
            type="text"
            id="apellido_cliente"
            name="apellido_cliente"
            value={cliente.apellido_cliente}
            onChange={handleChange}
            required
            maxLength="50"
          />
        </div>

        <div className="form-group">
          <label htmlFor="cedula_cliente">Cédula:</label>
          <input
            type="text"
            id="cedula_cliente"
            name="cedula_cliente"
            value={cliente.cedula_cliente}
            onChange={handleChange}
            required
            pattern="[0-9]{13}"
            title="La cédula debe tener 13 dígitos"
            maxLength="13"
          />
        </div>

        <div className="form-group">
          <label htmlFor="telefono_cliente">Teléfono:</label>
          <input
            type="tel"
            id="telefono_cliente"
            name="telefono_cliente"
            value={cliente.telefono_cliente}
            onChange={handleChange}
            required
            pattern="[0-9]{12}"
            title="El teléfono debe tener 12 dígitos"
            maxLength="12"
          />
        </div>

        <div className="form-group">
          <label htmlFor="direccion_cliente">Dirección:</label>
          <textarea
            id="direccion_cliente"
            name="direccion_cliente"
            value={cliente.direccion_cliente}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-btn">Registrarme</button>
      </form>
    </div>
  );
};

export default RegistroCliente;