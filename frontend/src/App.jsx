import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Bienvenido from './Bienvenido';
import LoginCliente from './loginCliente';
import RegistroCliente from './Registrate';
import LoginAdministrador from './LoginAdministrador';
import ProductAdmi from './ProductAdmi';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/Bienvenido" />} />
        <Route path="/ProductAdmi" element={<ProductAdmi />} />
        <Route path="/Bienvenido" element={<Bienvenido />} />
        <Route path="/loginCliente" element={<LoginCliente />} />
        <Route path="/loginAdmin" element={<LoginAdministrador />} />
        <Route path="/registrate" element={<RegistroCliente />} />
      </Routes>
    </Router>
  );
}

export default App;
