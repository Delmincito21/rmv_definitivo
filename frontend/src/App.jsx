import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Bienvenido from './Bienvenido';
import LoginCliente from './loginCliente';
import RegistroCliente from './Registrate';
import ProductAdmi from './ProductAdmi';
import Ventas from './Ventas';
import AdminDashboard from './AdminDashboard';
import Clientes from './Clientes';
import Inicio from './Inicio';
import InicioCli from './dashboardCliente/InicioCli';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/Bienvenido" replace />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/Bienvenido" element={<Bienvenido />} />
        <Route path="/loginCliente" element={<LoginCliente />} />
        <Route path="/registrate" element={<RegistroCliente />} />
        <Route path="/InicioCli" element={<InicioCli />} />

        {/* Rutas con sidebar */}
        <Route element={<LayoutWithSidebar />}>
          <Route path="/Inicio" element={<Inicio />} />
          <Route path="/Clientes" element={<Clientes />} />
          <Route path="/Ventas" element={<Ventas />} />
        </Route>

        {/* Rutas sin sidebar */}
        <Route path="/ProductAdmi" element={<ProductAdmi />} />
      </Routes>
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