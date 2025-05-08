import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Bienvenido from './Bienvenido';
import LoginCliente from './loginCliente';
import RegistroCliente from './Registrate';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/Bienvenido" />} />
        <Route path="/Bienvenido" element={<Bienvenido />} />
        <Route path="/loginCliente" element={<LoginCliente />} />
        <Route path="/registrate" element={<RegistroCliente />} />
      </Routes>
    </Router>
  );
}

export default App;
