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
import AdminLayout from './AdminLayout';

function App() {
  return (
    <Router>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/Bienvenido" replace />} />
          {/* Rutas públicas */}
          <Route path="/Bienvenido" element={<Bienvenido />} />
          <Route path="/loginCliente" element={<LoginCliente />} />
          <Route path="/registrate" element={<RegistroCliente />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Layout de administrador */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['administrador']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={
              <Inicio />
            } />
            <Route path="inicio" element={
              <Inicio />
            } />
            <Route path="ventas" element={
              <Ventas />
            } />
            <Route path="clientes" element={
              <Clientes />
            } />
            <Route path="factura/:id_venta" element={
              <Factura />
            } />
          </Route>

          {/* Rutas de productos (fuera del AdminLayout) */}
          <Route path="/admin/productos" element={
            <ProtectedRoute allowedRoles={['administrador']}>
              <ProductAdmi />
            </ProtectedRoute>
          } />
          <Route path="/ProductAdmi" element={
            <ProtectedRoute allowedRoles={['administrador']}>
              <ProductAdmi />
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

export default App;