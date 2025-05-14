import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Bienvenido from './Bienvenido';
import LoginCliente from './loginCliente';
import RegistroCliente from './Registrate';
import ProductAdmi from './ProductAdmi';
import Ventas from './Ventas';
import AdminDashboard from './AdminDashboard';
import Clientes from './Clientes';
import Inicio from './Inicio';
import InicioCli from './dashboardCliente/InicioCli';
import Tienda from './dashboardCliente/Tienda';
import Carrito from './dashboardCliente/Carrito';
import ResetPassword from './ResetPassword';
import Factura from './Factura';

function App() {
  return (
    <Router>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/Bienvenido" replace />} />
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/Bienvenido" element={<Bienvenido />} />
          <Route path="/loginCliente" element={<LoginCliente />} />
          <Route path="/registrate" element={<RegistroCliente />} />
          <Route path="/iniciocli" element={<InicioCli />} />
          <Route path="/Tienda" element={<Tienda />} />
          <Route path="/Carrito" element={<Carrito />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/Factura" element={<Factura />} />

          {/* Rutas con sidebar */}
          <Route element={<LayoutWithSidebar />}>
            <Route path="/Inicio" element={<Inicio />} />
            <Route path="/Clientes" element={<Clientes />} />
            <Route path="/Ventas" element={<Ventas />} />
          </Route>

          {/* Rutas sin sidebar */}
          <Route path="/ProductAdmi" element={<ProductAdmi />} />
        </Routes>
      </CartProvider>
    </Router>
  );
}

const LayoutWithSidebar = ({ children }) => {
  return (
    <div className="admin-layout">
      <AdminDashboard />
      <div className="main-content-with-sidebar">
        {children}
      </div>
    </div>
  );
};

export default App;