import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Bienvenido from './Bienvenido';
import LoginCliente from './loginCliente';
import RegistroCliente from './Registrate';
import ProductAdmi from './ProductAdmi';
import Venta from './Ventas';
import AdminDashboard from './AdminDashboard';
import Clientes from './Clientes';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/Bienvenido" />} />
        <Route path="/ProductAdmi" element={<ProductAdmi />} />
        <Route path="/Ventas" element={<Venta />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/Clientes" element={<Clientes />} />
        <Route path="/Bienvenido" element={<Bienvenido />} />
        <Route path="/loginCliente" element={<LoginCliente />} />
        <Route path="/registrate" element={<RegistroCliente />} />
      </Routes>
    </Router>
  );
}

export default App;
