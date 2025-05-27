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
import Tienda from './dashboardCliente/Tienda';
import Carrito from './dashboardCliente/Carrito';
import ResetPassword from './ResetPassword';
import MisPedidos from './dashboardCliente/MisPedidos';
import EditarPerfil from './dashboardCliente/EditarPerfil';
import Factura from './Factura';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/Bienvenido" replace />} />
          <Route path="/Bienvenido" element={<Bienvenido />} />
          <Route path="/loginCliente" element={<LoginCliente />} />
          <Route path="/registrate" element={<RegistroCliente />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Rutas protegidas para administradores */}
          <Route path="/AdminDashboard" element={
            <ProtectedRoute allowedRoles={['administrador']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/ProductAdmi" element={
            <ProtectedRoute allowedRoles={['administrador']}>
              <ProductAdmi />
            </ProtectedRoute>
          } />
          <Route path="/Ventas" element={
            <ProtectedRoute allowedRoles={['administrador']}>
              <Ventas />
            </ProtectedRoute>
          } />
          <Route path="/Clientes" element={
            <ProtectedRoute allowedRoles={['administrador']}>
              <Clientes />
            </ProtectedRoute>
          } />
          <Route path="/Inicio" element={
            <ProtectedRoute allowedRoles={['administrador']}>
              <Inicio />
            </ProtectedRoute>
          } />

          {/* Rutas protegidas para clientes */}
          <Route path="/Tienda" element={
            <ProtectedRoute allowedRoles={['cliente']}>
              <Tienda />
            </ProtectedRoute>
          } />
          <Route path="/Carrito" element={
            <ProtectedRoute allowedRoles={['cliente']}>
              <Carrito />
            </ProtectedRoute>
          } />
          <Route path="/MisPedidos" element={
            <ProtectedRoute allowedRoles={['cliente']}>
              <MisPedidos />
            </ProtectedRoute>
          } />
          <Route path="/editar-perfil" element={
            <ProtectedRoute allowedRoles={['cliente']}>
              <EditarPerfil />
            </ProtectedRoute>
          } />
          <Route path="/Factura" element={
            <ProtectedRoute allowedRoles={['cliente']}>
              <Factura />
            </ProtectedRoute>
          } />
          <Route path="/factura/:id_venta" element={
            <ProtectedRoute allowedRoles={['cliente']}>
              <Factura />
            </ProtectedRoute>
          } />
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